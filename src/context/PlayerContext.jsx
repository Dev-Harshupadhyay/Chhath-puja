import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { songs as ALL_SONGS, songById, thumb } from '../data/songs';
import { loadYouTubeApi } from '../lib/youtube';
import { KEYS, read, write } from '../lib/storage';

/* ─────────────────────────────────────────────────────────────
   Three contexts on purpose.
   • State    – what is playing (changes rarely)
   • Actions  – stable callbacks (never change identity)
   • Progress – currentTime, sampled 4×/sec (changes constantly)
   Splitting them keeps a moving progress bar from re-rendering
   the whole song library on every tick.
   ───────────────────────────────────────────────────────────── */
const StateCtx = createContext(null);
const ActionsCtx = createContext(null);
const ProgressCtx = createContext({ currentTime: 0, duration: 0, buffered: 0 });

export const usePlayer = () => useContext(StateCtx);
export const usePlayerActions = () => useContext(ActionsCtx);
export const useProgress = () => useContext(ProgressCtx);

const MAX_RECENT = 16;
const RESUME_AFTER = 10; // seconds

/* ─────────────────────────────────────────────────────────────
   ONE player for the whole app, held at module scope.

   Why this exists — the crash we were hitting:

   The YouTube IFrame API does not render *into* the element you
   give it, it REPLACES that element with an <iframe>. When that
   element was one React had rendered, React kept a reference to a
   node that no longer existed. The next time React reconciled
   (a route change, a toast, the name gate opening) it tried to
   insert or remove a sibling relative to the vanished node and
   the browser threw:
     · Failed to execute 'insertBefore' on 'Node'
     · Failed to execute 'removeChild' on 'Node'
   A stale iframe also explains the other two: messages sent to a
   replaced frame give "target origin does not match", and calling
   a method on a destroyed player gives "n is not a function".

   The rules that keep this safe:
   1. React renders an EMPTY container and never puts children in
      it. The real host node is created imperatively below, and
      that — not the React node — is what YouTube is handed.
      React therefore never owns, moves or removes the iframe.
   2. The instance lives here, not in a ref, so StrictMode's
      double-invoked effects and any remount REUSE it instead of
      stacking a second player on top of the first.
   3. It is destroyed only on pagehide, never in an effect
      cleanup, so route changes cannot tear it down.
   ───────────────────────────────────────────────────────────── */
const playerSingleton = {
  container: null, // React-owned empty div
  host: null, // imperative div we actually give to YouTube
  player: null, // the YT.Player instance
  ready: false,
  destroyed: false,
};

export function PlayerProvider({ children }) {
  /* ── persisted bits ─────────────────────────────────────── */
  const [favorites, setFavorites] = useState(() => new Set(read(KEYS.favorites, [])));
  const [savedPlaylists, setSavedPlaylists] = useState(() => new Set(read(KEYS.savedPlaylists, [])));
  const [favoriteArtists, setFavoriteArtists] = useState(() => new Set(read(KEYS.favoriteArtists, [])));
  const [recent, setRecent] = useState(() => read(KEYS.recent, []));
  const [mood, setMood] = useState(() => read(KEYS.mood, null));
  const [volume, setVolumeState] = useState(() => read(KEYS.volume, 85));
  const [muted, setMuted] = useState(false);

  /* ── transport ──────────────────────────────────────────── */
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // 'off' | 'all' | 'one'
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [progress, setProgress] = useState({ currentTime: 0, duration: 0, buffered: 0 });

  /* ── refs ───────────────────────────────────────────────── */
  const playerRef = useRef(null);
  const containerRef = useRef(null); // React-owned, always empty
  const apiRef = useRef(null);
  const readyRef = useRef(false);
  const pendingRef = useRef(null); // { videoId, startSeconds, autoplay }
  const queueRef = useRef(queue);
  const indexRef = useRef(index);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);
  const wantPlayRef = useRef(false);
  const progressRef = useRef(progress);
  const watchdogRef = useRef(null);
  const savedPositions = useRef(read(KEYS.progress, {}));

  queueRef.current = queue;
  indexRef.current = index;
  shuffleRef.current = shuffle;
  repeatRef.current = repeat;
  progressRef.current = progress;

  /* ── persistence ────────────────────────────────────────── */
  useEffect(() => {
    write(KEYS.favorites, [...favorites]);
  }, [favorites]);
  useEffect(() => {
    write(KEYS.savedPlaylists, [...savedPlaylists]);
  }, [savedPlaylists]);
  useEffect(() => {
    write(KEYS.favoriteArtists, [...favoriteArtists]);
  }, [favoriteArtists]);
  useEffect(() => {
    write(KEYS.recent, recent);
  }, [recent]);
  useEffect(() => {
    write(KEYS.mood, mood);
  }, [mood]);
  useEffect(() => {
    write(KEYS.volume, volume);
  }, [volume]);

  /* ── toast ──────────────────────────────────────────────── */
  const toastTimer = useRef(null);
  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  /* Single choke point for every call into the embed. A stale or
     half-built player used to surface as "n is not a function";
     now it just quietly returns undefined. */
  const callPlayer = useCallback((method, ...args) => {
    const p = playerRef.current;
    if (!p || playerSingleton.destroyed) return undefined;
    try {
      const fn = p[method];
      if (typeof fn !== 'function') return undefined;
      return fn.apply(p, args);
    } catch {
      /* the embed may have been torn down mid-call */
      return undefined;
    }
  }, []);

  /* ── the fix: never drop a play request ─────────────────────
     The IFrame API loads asynchronously. If a tap arrives before
     the player exists we park the request in pendingRef and fire
     it from onReady — previously it was silently discarded.    */
  const sendToPlayer = useCallback(
    (req) => {
      const p = playerRef.current;
      if (!readyRef.current || !p || typeof p.loadVideoById !== 'function') {
        pendingRef.current = req;
        return false;
      }
      try {
        if (req.autoplay) {
          p.loadVideoById({ videoId: req.videoId, startSeconds: req.startSeconds || 0 });
        } else {
          p.cueVideoById({ videoId: req.videoId, startSeconds: req.startSeconds || 0 });
        }
        return true;
      } catch {
        pendingRef.current = req;
        return false;
      }
    },
    [],
  );

  const flushPending = useCallback(() => {
    const req = pendingRef.current;
    if (!req) return;
    pendingRef.current = null;
    sendToPlayer(req);
  }, [sendToPlayer]);

  /* If a play was requested but nothing started, tell the user
     instead of leaving a dead play button. */
  const armWatchdog = useCallback(() => {
    clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => {
      const p = playerRef.current;
      const YT = apiRef.current;
      if (!p || !YT || !wantPlayRef.current) return;
      let st = -1;
      try {
        st = p.getPlayerState();
      } catch {
        return;
      }
      if (st !== YT.PlayerState.PLAYING && st !== YT.PlayerState.BUFFERING) {
        setIsBuffering(false);
        setIsPlaying(false);
        notify('Play start nahi hua — ▶ phir se dabayein');
      }
    }, 3200);
  }, [notify]);

  /* ── movement ───────────────────────────────────────────── */
  const loadIndex = useCallback(
    (i, autoplay = true) => {
      const q = queueRef.current;
      if (!q.length) return;
      const next = ((i % q.length) + q.length) % q.length;
      const song = songById.get(q[next]);
      if (!song) return;

      const prevId = q[indexRef.current];
      if (prevId) {
        savedPositions.current[prevId] = Math.floor(progressRef.current.currentTime || 0);
        write(KEYS.progress, savedPositions.current);
      }

      setIndex(next);
      wantPlayRef.current = autoplay;
      setIsBuffering(autoplay);
      setError(null);
      setProgress({ currentTime: 0, duration: song.seconds || 0, buffered: 0 });

      const startAt =
        savedPositions.current[song.id] > RESUME_AFTER ? savedPositions.current[song.id] : 0;
      const sent = sendToPlayer({ videoId: song.youtubeId, startSeconds: startAt, autoplay });

      if (!sent) {
        // player not ready yet — keep the buffering flag so the UI
        // shows intent, and flushPending() will finish the job.
        setIsBuffering(autoplay);
      } else if (autoplay) {
        armWatchdog();
      }

      if (autoplay) {
        setRecent((r) => [song.id, ...r.filter((id) => id !== song.id)].slice(0, MAX_RECENT));
      }
    },
    [sendToPlayer, armWatchdog],
  );

  const next = useCallback(
    (auto = true, userSkipped = false) => {
      const q = queueRef.current;
      if (!q.length) return;

      if (repeatRef.current === 'one' && !userSkipped) {
        callPlayer('seekTo', 0, true);
        callPlayer('playVideo');
        wantPlayRef.current = true;
        return;
      }

      let i = indexRef.current + 1;
      if (shuffleRef.current && q.length > 1) {
        let guard = 0;
        do {
          i = Math.floor(Math.random() * q.length);
          guard += 1;
        } while (i === indexRef.current && guard < 12);
      }

      if (i >= q.length) {
        if (repeatRef.current === 'all') {
          loadIndex(0, auto);
          return;
        }
        setIsPlaying(false);
        wantPlayRef.current = false;
        setProgress((p) => ({ ...p, currentTime: 0 }));
        try {
          callPlayer('stopVideo');
        } catch {
          /* already stopped */
        }
        return;
      }
      loadIndex(i, auto);
    },
    [callPlayer, loadIndex],
  );

  const prev = useCallback(() => {
    if (progressRef.current.currentTime > 3) {
      callPlayer('seekTo', 0, true);
      setProgress((p) => ({ ...p, currentTime: 0 }));
      return;
    }
    loadIndex(indexRef.current - 1, true);
  }, [callPlayer, loadIndex]);

  /* ── boot the IFrame API once ───────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    let ticker = null;

    const startTicker = () => {
      if (ticker) return;
      ticker = setInterval(() => {
        const p = playerRef.current;
        if (!p || !readyRef.current) return;
        let t = 0;
        let d = 0;
        let b = 0;
        try {
          t = p.getCurrentTime() || 0;
          d = p.getDuration?.() || 0;
          b = p.getVideoLoadedFraction?.() || 0;
        } catch {
          return;
        }
        setProgress((prev) => {
          if (Math.abs(prev.currentTime - t) < 0.25 && Math.abs(prev.duration - d) < 0.5) return prev;
          return { currentTime: t, duration: d || prev.duration, buffered: b };
        });
      }, 250);
    };

    const container = containerRef.current;
    if (!container) return undefined;

    /* Already built? StrictMode double-invokes effects in dev, and
       any remount would hit this too. Adopt the existing instance
       instead of building a second player over the same node — two
       players fighting over one iframe is exactly what produced the
       "target origin does not match" postMessage error. */
    if (playerSingleton.player && !playerSingleton.destroyed) {
      if (playerSingleton.host && !playerSingleton.host.isConnected) {
        container.appendChild(playerSingleton.host);
      }
      playerRef.current = playerSingleton.player;
      apiRef.current = window.YT || apiRef.current;
      readyRef.current = playerSingleton.ready;
      if (readyRef.current) flushPending();
      return () => {
        cancelled = true;
        if (ticker) clearInterval(ticker);
      };
    }

    /* The node YouTube is allowed to replace.
       Created here — NOT rendered by React — so React never owns,
       moves or removes it. React's tree says the container is
       empty and it stays empty as far as React is concerned. */
    const host = document.createElement('div');
    host.style.cssText = 'width:200px;height:120px;';
    container.appendChild(host);
    playerSingleton.host = host;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !host.isConnected) return;
        apiRef.current = YT;

        const origin = window.location?.origin;
        const playerVars = {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
        };
        // Only send `origin` when it is a real http(s) origin — a
        // wrong value makes YouTube refuse to start the video.
        if (typeof origin === 'string' && /^https?:\/\//.test(origin)) {
          playerVars.origin = origin;
        }

        playerSingleton.player = new YT.Player(host, {
          width: 200,
          height: 120,
          playerVars,
          events: {
            onReady: (e) => {
              readyRef.current = true;
              playerSingleton.ready = true;
              try {
                e.target.setVolume(volume);
                if (muted) e.target.mute();
              } catch {
                /* volume may be unavailable before a gesture */
              }
              // ← the missing piece: anything the user asked for
              //   while the API was still loading starts now.
              flushPending();
              if (wantPlayRef.current) armWatchdog();
            },
            onStateChange: (e) => {
              const YTapi = apiRef.current;
              if (!YTapi) return;
              const st = e.data;
              if (st === YTapi.PlayerState.PLAYING) {
                clearTimeout(watchdogRef.current);
                setIsPlaying(true);
                setIsBuffering(false);
                setError(null);
                startTicker();
              } else if (st === YTapi.PlayerState.PAUSED) {
                setIsPlaying(false);
                setIsBuffering(false);
              } else if (st === YTapi.PlayerState.BUFFERING) {
                setIsBuffering(wantPlayRef.current);
                if (wantPlayRef.current) armWatchdog();
              } else if (st === YTapi.PlayerState.ENDED) {
                setIsPlaying(false);
                next(true);
              }
            },
            onError: (e) => {
              const codes = {
                2: 'Invalid video id',
                5: 'This video cannot be played in an embedded player',
                100: 'Video not found or private',
                101: 'Embedding disabled by the owner',
                150: 'Embedding disabled by the owner',
              };
              const msg = codes[e.data] || 'Playback error';
              setError(msg);
              setIsBuffering(false);
              setIsPlaying(false);
              notify(`${msg} — agla geet`);
              setTimeout(() => next(true, true), 900);
            },
          },
        });
        playerRef.current = playerSingleton.player;
        playerSingleton.destroyed = false;
      })
      .catch(() => {
        if (!cancelled) {
          setError('YouTube player failed to load');
          notify('YouTube player load nahi ho paaya — internet check karein');
        }
      });

    /* Deliberately does NOT destroy the player.
       This is a persistent, app-level player mounted once above the
       router. It has to survive route changes, and StrictMode runs
       this cleanup once for free in development. Destroying here is
       what used to leave React holding a node the API had already
       replaced. Real teardown only happens on pagehide, below. */
    return () => {
      cancelled = true;
      clearTimeout(watchdogRef.current);
      if (ticker) clearInterval(ticker);
    };
  }, [flushPending]);

  /* The only place the embed is ever destroyed: the page really is
     going away. Nothing else in the app tears it down. */
  useEffect(() => {
    const teardown = () => {
      if (playerSingleton.destroyed) return;
      playerSingleton.destroyed = true;
      playerSingleton.ready = false;
      readyRef.current = false;
      playerRef.current = null;
      try {
        playerSingleton.player?.destroy?.();
      } catch {
        /* best-effort */
      }
      try {
        playerSingleton.host?.remove?.();
      } catch {
        /* best-effort */
      }
      playerSingleton.player = null;
      playerSingleton.host = null;
    };
    window.addEventListener('pagehide', teardown);
    return () => window.removeEventListener('pagehide', teardown);
  }, []);

  /* keep embed volume in sync */
  useEffect(() => {
    if (!readyRef.current) return;
    try {
      callPlayer('setVolume', muted ? 0 : volume);
      callPlayer(muted ? 'mute' : 'unMute');
    } catch {
      /* not ready */
    }
  }, [volume, muted, callPlayer]);

  /* ── actions ────────────────────────────────────────────── */
  const playSong = useCallback(
    (song, newQueue) => {
      const q = newQueue?.length ? newQueue : [song];
      const ids = q.map((s) => (typeof s === 'string' ? s : s.id));
      const at = Math.max(0, ids.indexOf(song.id));

      if (ids.join('|') === queueRef.current.join('|')) {
        if (at === indexRef.current) {
          wantPlayRef.current = true;
          if (readyRef.current) {
            callPlayer('playVideo');
            armWatchdog();
          } else {
            pendingRef.current = {
              videoId: song.youtubeId,
              startSeconds: Math.floor(progressRef.current.currentTime || 0),
              autoplay: true,
            };
            setIsBuffering(true);
          }
          return;
        }
        loadIndex(at, true);
        return;
      }
      setQueue(ids);
      queueRef.current = ids;
      indexRef.current = -1;
      requestAnimationFrame(() => loadIndex(at, true));
    },
    [callPlayer, loadIndex, armWatchdog],
  );

  const playQueue = useCallback(
    (list, startAt = 0) => {
      const ids = list.map((s) => (typeof s === 'string' ? s : s.id)).filter(Boolean);
      if (!ids.length) return;
      setQueue(ids);
      queueRef.current = ids;
      indexRef.current = -1;
      requestAnimationFrame(() => loadIndex(startAt, true));
    },
    [loadIndex],
  );

  const toggle = useCallback(() => {
    const p = playerRef.current;
    wantPlayRef.current = true;
    if (!readyRef.current || !p || typeof p.getPlayerState !== 'function') {
      const song = songById.get(queueRef.current[indexRef.current]);
      if (song) {
        pendingRef.current = {
          videoId: song.youtubeId,
          startSeconds: Math.floor(progressRef.current.currentTime || 0),
          autoplay: true,
        };
        setIsBuffering(true);
        notify('Player taiyaar ho raha hai…');
      }
      return;
    }
    let st = -1;
    try {
      st = p.getPlayerState();
    } catch {
      return;
    }
    const YTapi = apiRef.current;
    if (st === YTapi?.PlayerState.PLAYING) {
      wantPlayRef.current = false;
      callPlayer('pauseVideo');
    } else {
      callPlayer('playVideo');
      armWatchdog();
    }
  }, [armWatchdog, notify, callPlayer]);

  /** Force a fresh start — used when a video stalls or errors. */
  const retry = useCallback(() => {
    const song = songById.get(queueRef.current[indexRef.current]);
    if (!song) return;
    setError(null);
    wantPlayRef.current = true;
    setIsBuffering(true);
    sendToPlayer({ videoId: song.youtubeId, startSeconds: 0, autoplay: true });
    armWatchdog();
  }, [sendToPlayer, armWatchdog]);

  const seekTo = useCallback(
    (seconds) => {
      callPlayer('seekTo', seconds, true);
      setProgress((p) => ({ ...p, currentTime: seconds }));
    },
    [callPlayer],
  );

  const setVolume = useCallback((v) => {
    const clamped = Math.min(100, Math.max(0, Math.round(v)));
    setVolumeState(clamped);
    setMuted(clamped === 0);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const toggleFavorite = useCallback(
    (id) => {
      setFavorites((f) => {
        const nextSet = new Set(f);
        const song = songById.get(id);
        if (nextSet.has(id)) {
          nextSet.delete(id);
          notify('Pasandida geeton se hata diya');
        } else {
          nextSet.add(id);
          notify(`${song?.title ?? 'Geet'} pasandida mein save ho gaya ❤️`);
        }
        return nextSet;
      });
    },
    [notify],
  );

  const toggleArtistFavorite = useCallback(
    (name) => {
      setFavoriteArtists((f) => {
        const nextSet = new Set(f);
        nextSet.has(name) ? nextSet.delete(name) : nextSet.add(name);
        notify(nextSet.has(name) ? `${name} followed` : 'Artist removed');
        return nextSet;
      });
    },
    [notify],
  );

  const toggleSavedPlaylist = useCallback(
    (slug) => {
      setSavedPlaylists((s) => {
        const nextSet = new Set(s);
        nextSet.has(slug) ? nextSet.delete(slug) : nextSet.add(slug);
        notify(nextSet.has(slug) ? 'Playlist saved' : 'Playlist unsaved');
        return nextSet;
      });
    },
    [notify],
  );

  const addToQueue = useCallback(
    (song) => {
      setQueue((q) => {
        const nextQ = [...q, song.id];
        queueRef.current = nextQ;
        return nextQ;
      });
      notify('Queue mein jud gaya');
    },
    [notify],
  );

  const playNext = useCallback(
    (song) => {
      setQueue((q) => {
        const without = q.filter((id) => id !== song.id);
        const at = indexRef.current + 1;
        const nextQ = [...without.slice(0, at), song.id, ...without.slice(at)];
        queueRef.current = nextQ;
        return nextQ;
      });
      notify('Agla geet set ho gaya');
    },
    [notify],
  );

  const removeFromQueue = useCallback((i) => {
    setQueue((q) => {
      if (i === indexRef.current) return q;
      const nextQ = q.filter((_, idx) => idx !== i);
      queueRef.current = nextQ;
      if (i < indexRef.current) setIndex(indexRef.current - 1);
      return nextQ;
    });
  }, []);

  const reorderQueue = useCallback((from, to) => {
    setQueue((q) => {
      if (to < 0 || to >= q.length || from === to) return q;
      const nextQ = [...q];
      const [moved] = nextQ.splice(from, 1);
      nextQ.splice(to, 0, moved);
      queueRef.current = nextQ;
      const currentId = q[indexRef.current];
      setIndex(nextQ.indexOf(currentId));
      return nextQ;
    });
  }, []);

  const clearQueue = useCallback(() => {
    if (indexRef.current >= 0) {
      const currentId = queueRef.current[indexRef.current];
      setQueue([currentId]);
      queueRef.current = [currentId];
      setIndex(0);
    } else {
      setQueue([]);
      queueRef.current = [];
    }
  }, []);

  /* ── derived ────────────────────────────────────────────── */
  const current = index >= 0 ? songById.get(queue[index]) ?? null : null;
  const queueSongs = useMemo(() => queue.map((id) => songById.get(id)).filter(Boolean), [queue]);
  const upNext = useMemo(() => queueSongs.slice(index + 1), [queueSongs, index]);
  const recentSongs = useMemo(() => recent.map((id) => songById.get(id)).filter(Boolean), [recent]);
  const favoriteSongs = useMemo(() => ALL_SONGS.filter((s) => favorites.has(s.id)), [favorites]);

  /* Media Session — lock-screen art, title and hardware keys */
  useEffect(() => {
    if (!('mediaSession' in navigator) || !current) return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: current.title,
        artist: current.artist || current.channel,
        album: 'छठ गीत · Chhath Geet',
        artwork: [
          { src: thumb(current, 'max'), sizes: '480x360', type: 'image/jpeg' },
          { src: thumb(current), sizes: '480x360', type: 'image/jpeg' },
        ],
      });
      navigator.mediaSession.setActionHandler?.('play', () => toggle());
      navigator.mediaSession.setActionHandler?.('pause', () => toggle());
      navigator.mediaSession.setActionHandler?.('previoustrack', () => prev());
      navigator.mediaSession.setActionHandler?.('nexttrack', () => next(true, true));
    } catch {
      /* Media Session is optional */
    }
  }, [current, toggle, prev, next]);

  /* Keyboard shortcuts: space, arrows, n/p, m, s */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (e.code === 'Space' || k === 'k') {
        e.preventDefault();
        toggle();
      } else if (k === 'arrowright' || k === 'l') {
        e.preventDefault();
        const p = progressRef.current;
        seekTo(Math.min((p.duration || 0) - 1, p.currentTime + 10));
      } else if (k === 'arrowleft' || k === 'j') {
        e.preventDefault();
        seekTo(Math.max(0, progressRef.current.currentTime - 10));
      } else if (k === 'n') {
        next(true, true);
      } else if (k === 'p') {
        prev();
      } else if (k === 'm') {
        toggleMute();
      } else if (k === 'arrowup') {
        e.preventDefault();
        setVolume(Math.min(100, volume + 5));
      } else if (k === 'arrowdown') {
        e.preventDefault();
        setVolume(Math.max(0, volume - 5));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, next, prev, seekTo, toggleMute, setVolume, volume]);

  const state = useMemo(
    () => ({
      current,
      queue,
      queueSongs,
      upNext,
      index,
      isPlaying,
      isBuffering,
      shuffle,
      repeat,
      error,
      volume,
      muted,
      mood,
      favorites,
      favoriteSongs,
      savedPlaylists,
      favoriteArtists,
      recentSongs,
      toast,
      durationSeconds: current?.seconds ?? progress.duration ?? 0,
    }),
    [
      current,
      queue,
      queueSongs,
      upNext,
      index,
      isPlaying,
      isBuffering,
      shuffle,
      repeat,
      error,
      volume,
      muted,
      mood,
      favorites,
      favoriteSongs,
      savedPlaylists,
      favoriteArtists,
      recentSongs,
      toast,
      progress.duration,
    ],
  );

  const actions = useMemo(
    () => ({
      playSong,
      playQueue,
      toggle,
      next,
      prev,
      retry,
      seekTo,
      setVolume,
      toggleMute,
      toggleFavorite,
      toggleArtistFavorite,
      toggleSavedPlaylist,
      addToQueue,
      playNext,
      removeFromQueue,
      reorderQueue,
      clearQueue,
      setShuffle,
      setRepeat,
      setMood,
      notify,
    }),
    [
      playSong,
      playQueue,
      toggle,
      next,
      prev,
      retry,
      seekTo,
      setVolume,
      toggleMute,
      toggleFavorite,
      toggleArtistFavorite,
      toggleSavedPlaylist,
      addToQueue,
      playNext,
      removeFromQueue,
      reorderQueue,
      clearQueue,
      notify,
    ],
  );

  return (
    <ActionsCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>
        <ProgressCtx.Provider value={progress}>
          {children}
          {/* Empty container for the official YouTube embed.
              React renders this with NO children and must never put
              any here. PlayerProvider creates the real host node
              imperatively and hands *that* to the IFrame API, which
              replaces it with an <iframe>. Keeping React's hands off
              it is what stops the insertBefore/removeChild crashes. */}
          <div
            ref={containerRef}
            className="player-host"
            aria-hidden="true"
            title="YouTube audio player"
          />
        </ProgressCtx.Provider>
      </StateCtx.Provider>
    </ActionsCtx.Provider>
  );
}
