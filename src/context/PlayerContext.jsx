import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { songs as ALL_SONGS, songById } from '../data/songs';
import { loadYouTubeApi } from '../lib/youtube';
import { KEYS, read, write } from '../lib/storage';

/* ─────────────────────────────────────────────────────────────
   Three contexts on purpose.
   • State   – what is playing (changes rarely)
   • Actions – stable callbacks (never change identity)
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

const MAX_RECENT = 12;

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
  const [queue, setQueue] = useState([]); // array of song ids
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  /* ── progress (isolated context) ────────────────────────── */
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0, buffered: 0 });

  /* ── refs ───────────────────────────────────────────────── */
  const playerRef = useRef(null);
  const hostRef = useRef(null);
  const apiRef = useRef(null);
  const queueRef = useRef(queue);
  const indexRef = useRef(index);
  const shuffleRef = useRef(shuffle);
  const wantPlayRef = useRef(false);
  const progressRef = useRef(progress);
  const savedPositions = useRef(read(KEYS.progress, {}));

  queueRef.current = queue;
  indexRef.current = index;
  shuffleRef.current = shuffle;
  progressRef.current = progress;

  /* ── persistence effects ────────────────────────────────── */
  useEffect(() => write(KEYS.favorites, [...favorites]), [favorites]);
  useEffect(() => write(KEYS.savedPlaylists, [...savedPlaylists]), [savedPlaylists]);
  useEffect(() => write(KEYS.favoriteArtists, [...favoriteArtists]), [favoriteArtists]);
  useEffect(() => write(KEYS.recent, recent), [recent]);
  useEffect(() => write(KEYS.mood, mood), [mood]);
  useEffect(() => write(KEYS.volume, volume), [volume]);

  /* ── toast helper ───────────────────────────────────────── */
  const toastTimer = useRef(null);
  const notify = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  /* ── movement ───────────────────────────────────────────── */
  const loadIndex = useCallback((i, autoplay = true) => {
    const q = queueRef.current;
    if (!q.length) return;
    const next = ((i % q.length) + q.length) % q.length;
    const song = songById.get(q[next]);
    if (!song) return;

    // remember where we were, so "Continue listening" can resume
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

    const p = playerRef.current;
    if (!p || typeof p.loadVideoById !== 'function') return;
    const startAt = savedPositions.current[song.id] > 10 ? savedPositions.current[song.id] : 0;
    if (autoplay) p.loadVideoById({ videoId: song.youtubeId, startSeconds: startAt });
    else p.cueVideoById({ videoId: song.youtubeId, startSeconds: startAt });

    if (autoplay) {
      setRecent((r) => [song.id, ...r.filter((id) => id !== song.id)].slice(0, MAX_RECENT));
    }
  }, []);

  const next = useCallback(
    (auto = true) => {
      const q = queueRef.current;
      if (!q.length) return;
      let i = indexRef.current + 1;
      if (shuffleRef.current && q.length > 1) {
        do {
          i = Math.floor(Math.random() * q.length);
        } while (i === indexRef.current);
      }
      if (i >= q.length) {
        // end of queue — stop rather than looping forever
        setIsPlaying(false);
        setProgress((p) => ({ ...p, currentTime: 0 }));
        const p = playerRef.current;
        if (p?.stopVideo) p.stopVideo();
        return;
      }
      loadIndex(i, auto);
    },
    [loadIndex],
  );

  const prev = useCallback(() => {
    // Spotify behaviour: restart if we're more than 3s in
    if (progressRef.current.currentTime > 3) {
      playerRef.current?.seekTo(0, true);
      setProgress((p) => ({ ...p, currentTime: 0 }));
      return;
    }
    loadIndex(indexRef.current - 1, true);
  }, [loadIndex]);

  /* ── boot the IFrame API once ───────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    let ticker = null;

    const startTicker = () => {
      if (ticker) return;
      ticker = setInterval(() => {
        const p = playerRef.current;
        if (!p || typeof p.getCurrentTime !== 'function') return;
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

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return;
        apiRef.current = YT;
        playerRef.current = new YT.Player(hostRef.current, {
          width: 200,
          height: 120,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            fs: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              try {
                e.target.setVolume(volume);
              } catch {
                /* volume may be unavailable before a gesture */
              }
            },
            onStateChange: (e) => {
              const YTapi = apiRef.current;
              if (!YTapi) return;
              const st = e.data;
              if (st === YTapi.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsBuffering(false);
                setError(null);
                startTicker();
              } else if (st === YTapi.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (st === YTapi.PlayerState.BUFFERING) {
                setIsBuffering(wantPlayRef.current);
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
              notify(`${msg} — next geet`);
              setTimeout(() => next(true), 900);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError('YouTube player failed to load');
          notify('YouTube player load nahi ho paaya — check your connection');
        }
      });

    return () => {
      cancelled = true;
      if (ticker) clearInterval(ticker);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* teardown is best-effort */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* keep the embed volume in sync with app state */
  useEffect(() => {
    try {
      playerRef.current?.setVolume?.(muted ? 0 : volume);
      playerRef.current?.[muted ? 'mute' : 'unMute']?.();
    } catch {
      /* not ready yet */
    }
  }, [volume, muted]);

  /* ── actions ────────────────────────────────────────────── */
  const playSong = useCallback(
    (song, newQueue) => {
      const q = newQueue?.length ? newQueue : [song];
      const ids = q.map((s) => (typeof s === 'string' ? s : s.id));
      const at = Math.max(0, ids.indexOf(song.id));

      if (ids.join('|') === queueRef.current.join('|')) {
        // same queue: just jump
        if (at === indexRef.current) {
          playerRef.current?.playVideo?.();
          wantPlayRef.current = true;
          return;
        }
        loadIndex(at, true);
        return;
      }
      setQueue(ids);
      queueRef.current = ids;
      // loadIndex reads queueRef, so prime index then load
      indexRef.current = -1;
      requestAnimationFrame(() => loadIndex(at, true));
    },
    [loadIndex],
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
    if (!p || typeof p.getPlayerState !== 'function') return;
    let st = -1;
    try {
      st = p.getPlayerState();
    } catch {
      return;
    }
    const YTapi = apiRef.current;
    if (st === YTapi?.PlayerState.PLAYING) {
      p.pauseVideo();
      wantPlayRef.current = false;
    } else {
      wantPlayRef.current = true;
      p.playVideo();
    }
  }, []);

  const seekTo = useCallback((seconds) => {
    playerRef.current?.seekTo?.(seconds, true);
    setProgress((p) => ({ ...p, currentTime: seconds }));
  }, []);

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
        if (nextSet.has(name)) {
          nextSet.delete(name);
          notify('Artist removed');
        } else {
          nextSet.add(name);
          notify(`${name} followed`);
        }
        return nextSet;
      });
    },
    [notify],
  );

  const toggleSavedPlaylist = useCallback(
    (slug) => {
      setSavedPlaylists((s) => {
        const nextSet = new Set(s);
        if (nextSet.has(slug)) {
          nextSet.delete(slug);
          notify('Playlist unsaved');
        } else {
          nextSet.add(slug);
          notify('Playlist saved');
        }
        return nextSet;
      });
    },
    [notify],
  );

  const addToQueue = useCallback(
    (song) => {
      setQueue((q) => [...q, song.id]);
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
      const nextQ = [...q];
      const [moved] = nextQ.splice(from, 1);
      nextQ.splice(to, 0, moved);
      queueRef.current = nextQ;
      // keep pointing at the same song
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
  const queueSongs = useMemo(
    () => queue.map((id) => songById.get(id)).filter(Boolean),
    [queue],
  );
  const upNext = useMemo(
    () => queueSongs.slice(index + 1),
    [queueSongs, index],
  );
  const recentSongs = useMemo(
    () => recent.map((id) => songById.get(id)).filter(Boolean),
    [recent],
  );
  const favoriteSongs = useMemo(
    () => ALL_SONGS.filter((s) => favorites.has(s.id)),
    [favorites],
  );

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
      setMood,
      notify,
    }),
    [
      playSong,
      playQueue,
      toggle,
      next,
      prev,
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
          {/* Hidden host for the official YouTube embed — audio only,
              driven entirely by our own UI. */}
          <div
            ref={hostRef}
            className="player-host"
            aria-hidden="true"
            title="YouTube audio player"
          />
        </ProgressCtx.Provider>
      </StateCtx.Provider>
    </ActionsCtx.Provider>
  );
}
