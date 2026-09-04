import { memo, useEffect, useState } from 'react';
import Icon from '../Icon';
import Slider from '../common/Slider';
import { usePlayer, usePlayerActions, useProgress } from '../../context/PlayerContext';
import { useUI } from '../../context/UIContext';
import { thumb } from '../../data/songs';
import { fmtTime } from '../../lib/format';

/**
 * Premium sticky player — presentation only.
 *
 * Playback still runs through the same PlayerContext / YouTube IFrame
 * singleton as before. Nothing about queue logic, routes, song data
 * or the API integration is touched here.
 *
 *   [artwork] [title + artist + UP NEXT tab] [seek] [transport]
 *
 * • artwork is pulled straight from YouTube (i.ytimg.com) with a
 *   blurred skeleton while it loads and a quiet fallback on error
 * • the UP NEXT tab shows the exact song that plays after this one,
 *   with its own thumbnail — tapping it opens the full queue
 * • the 4-bar equalizer animates only while audio is really playing
 *   and freezes (but stays visible) when paused or buffering
 * • play/pause is the visual hero; every control is at least 44px
 */
function StickyPlayer() {
  const {
    current,
    isPlaying,
    isBuffering,
    favorites,
    volume,
    muted,
    index,
    queue,
    upNext,
    error,
  } = usePlayer();
  const A = usePlayerActions();
  const { currentTime, duration } = useProgress();
  const { openExpanded, toggleQueue } = useUI();

  const [artLoaded, setArtLoaded] = useState(false);
  const [artFailed, setArtFailed] = useState(false);
  const [nextArtFailed, setNextArtFailed] = useState(false);

  /* Re-arm the skeleton and re-trigger the cross-fade whenever the
     track changes, so art and titles fade instead of snapping. */
  useEffect(() => {
    setArtLoaded(false);
    setArtFailed(false);
  }, [current?.id]);

  useEffect(() => {
    setNextArtFailed(false);
  }, [upNext?.[0]?.id]);

  if (!current) return null;

  const total = duration || current.seconds || 0;
  const pct = total ? Math.min(100, Math.max(0, (currentTime / total) * 100)) : 0;
  const isFav = favorites.has(current.id);
  const hasNext = index < queue.length - 1;
  const nextSong = upNext[0] || null;
  const spinning = isBuffering && !isPlaying;
  const artist = current.artist || current.channel || 'Unknown artist';

  return (
    <div
      className="pm"
      role="region"
      aria-label="Music player"
      data-playing={isPlaying ? 'true' : 'false'}
    >
      {/* hairline progress pinned to the very top edge */}
      <div className="pm__line" aria-hidden="true">
        <i style={{ width: `${pct}%` }} />
      </div>

      <div className="shell pm__inner">
        {/* ── artwork + what's playing + up next ──────────── */}
        <div className="pm__now">
          <button
            className="pm__artbtn"
            onClick={openExpanded}
            aria-label={`Open full player for ${current.title}`}
          >
            <span className={`pm__art ${artLoaded ? 'is-loaded' : ''}`}>
              {artFailed ? (
                <span className="pm__art-fallback" aria-hidden="true">
                  <Icon name="music" size={16} />
                </span>
              ) : (
                <img
                  key={current.id}
                  src={thumb(current)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setArtLoaded(true)}
                  onError={() => {
                    setArtFailed(true);
                    setArtLoaded(true);
                  }}
                />
              )}

              {/* equalizer — only moves while audio is playing */}
              <span
                className={`pm__eq ${isPlaying && !isBuffering ? 'is-playing' : ''}`}
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                <i />
              </span>
            </span>
          </button>

          <div className="pm__meta">
            <button
              className="pm__titles"
              onClick={openExpanded}
              aria-label={`Open full player for ${current.title}`}
            >
              <b className="truncate" key={`t-${current.id}`}>
                {current.title}
              </b>
              <span className="truncate" key={`a-${current.id}`}>
                {artist}
              </span>
            </button>

            {/* ── UP NEXT tab ─────────────────────────────── */}
            {nextSong ? (
              <button
                className="pm__upnext"
                onClick={toggleQueue}
                aria-label={`Next song: ${nextSong.title}. Queue kholne ke liye dabayein`}
              >
                <span className="pm__upnext-art">
                  {nextArtFailed ? (
                    <span className="pm__upnext-fallback" aria-hidden="true">
                      <Icon name="music" size={8} />
                    </span>
                  ) : (
                    <img
                      src={thumb(nextSong)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={() => setNextArtFailed(true)}
                    />
                  )}
                </span>
                <span className="pm__upnext-text">
                  <span className="pm__upnext-label">
                    <Icon name="next" size={9} /> Up next
                  </span>
                  <span className="pm__upnext-title truncate">{nextSong.title}</span>
                </span>
              </button>
            ) : (
              <span className="pm__upnext is-empty" aria-hidden="true">
                <span className="pm__upnext-label">Queue khatam</span>
              </span>
            )}
          </div>
        </div>

        {/* ── transport ───────────────────────────────────── */}
        <div className="pm__controls">
          <button
            className="pm__btn only-desktop"
            onClick={() => A.prev()}
            aria-label="Previous song"
          >
            <Icon name="prev" size={18} filled strokeWidth={0} />
          </button>

          <button
            className="pm__play"
            onClick={() => A.toggle()}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            aria-pressed={isPlaying}
          >
            {spinning ? (
              <span className="pm__spinner" aria-hidden="true" />
            ) : (
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={19}
                filled
                strokeWidth={0}
                style={{ transform: isPlaying ? 'none' : 'translateX(1.5px)' }}
              />
            )}
          </button>

          <button
            className="pm__btn"
            onClick={() => A.next(true)}
            disabled={!hasNext}
            aria-label="Next song"
          >
            <Icon name="next" size={18} filled strokeWidth={0} />
          </button>
        </div>

        {/* ── seek (desktop / tablet) ──────────────────────── */}
        <div className="pm__seek">
          <span className="pm__time">{fmtTime(currentTime)}</span>
          <Slider
            value={currentTime}
            max={total || 1}
            onChange={(v) => A.seekTo(v)}
            label="Seek"
            step={5}
          />
          <span className="pm__time">{fmtTime(total)}</span>
        </div>

        {/* ── extras ──────────────────────────────────────── */}
        <div className="pm__extras">
          <button
            className={`pm__btn ${isFav ? 'is-fav' : ''}`}
            onClick={() => A.toggleFavorite(current.id)}
            aria-pressed={isFav}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Icon name="heart" size={17} filled={isFav} />
          </button>

          <div className="pm__volume only-desktop">
            <button
              className="pm__btn"
              onClick={() => A.toggleMute()}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              <Icon name={muted || volume === 0 ? 'mute' : 'volume'} size={17} />
            </button>
            <Slider
              value={muted ? 0 : volume}
              max={100}
              onChange={(v) => A.setVolume(v)}
              label="Volume"
            />
          </div>

          <button
            className="pm__btn only-desktop"
            onClick={toggleQueue}
            aria-label="Open queue"
            aria-expanded={false}
          >
            <Icon name="queue" size={17} />
          </button>

          {error && (
            <button
              className="pm__btn is-error"
              onClick={() => A.retry()}
              aria-label="Retry playback"
              title={error}
            >
              <Icon name="repeat" size={17} />
            </button>
          )}

          <button
            className="pm__btn pm__expand"
            onClick={openExpanded}
            aria-label="Open full player"
          >
            <Icon name="up" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(StickyPlayer);
