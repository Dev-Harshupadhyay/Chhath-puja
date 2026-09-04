import { memo } from 'react';
import Icon from '../Icon';
import LazyImage from '../common/LazyImage';
import Slider from '../common/Slider';
import { usePlayer, usePlayerActions, useProgress } from '../../context/PlayerContext';
import { useUI } from '../../context/UIContext';
import { thumb } from '../../data/songs';
import { fmtTime } from '../../lib/format';

/**
 * The persistent bar. Full transport + progress + volume on
 * desktop; a compact mini-player that expands on tap on mobile.
 */
function StickyPlayer() {
  const { current, isPlaying, isBuffering, favorites, volume, muted, index, queue } = usePlayer();
  const A = usePlayerActions();
  const { currentTime, duration } = useProgress();
  const { openExpanded, toggleQueue } = useUI();

  if (!current) return null;

  const total = duration || current.seconds || 0;
  const pct = total ? (currentTime / total) * 100 : 0;
  const isFav = favorites.has(current.id);
  const hasNext = index < queue.length - 1;

  return (
    <div
      className="player"
      role="region"
      aria-label="Music player"
      style={{ position: 'fixed' }}
    >
      {/* 2px progress line — the mobile progress bar */}
      <div className="player__line" aria-hidden="true">
        <i style={{ width: `${pct}%` }} />
      </div>

      <div className="shell player__inner">
        {/* ── now playing ─────────────────────────────────── */}
        <button
          className="player__now"
          onClick={openExpanded}
          aria-label={`Open full player for ${current.title}`}
        >
          <span className="player__art">
            <LazyImage src={thumb(current)} alt="" />
          </span>
          <span className="player__meta">
            <b className="truncate">{current.title}</b>
            <span className="truncate">{current.artist} · {current.channel}</span>
            <span className="player__src">
              <Icon name="youtube" size={9} /> YouTube
            </span>
          </span>
        </button>

        {/* ── transport ───────────────────────────────────── */}
        <div className="player__controls">
          <button
            className="icon-btn only-desktop"
            onClick={() => A.prev()}
            aria-label="Previous song"
          />
          <button
            className="player__play"
            onClick={() => A.toggle()}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={isBuffering}
          >
            {isBuffering ? (
              <span
                aria-hidden="true"
                style={{
                  width: 18,
                  height: 18,
                  border: '2px solid rgba(42,15,6,.35)',
                  borderTopColor: '#2a0f06',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <Icon
                name={isPlaying ? 'pause' : 'play'}
                size={22}
                filled
                strokeWidth={0}
                style={{ transform: isPlaying ? 'none' : 'translateX(1.5px)' }}
              />
            )}
          </button>
          <button
            className="icon-btn"
            onClick={() => A.next(true)}
            disabled={!hasNext}
            aria-label="Next song"
          >
            <Icon name="next" size={20} />
          </button>
        </div>

        {/* ── progress (desktop) ──────────────────────────── */}
        <div className="player__progress">
          <span className="player__time">{fmtTime(currentTime)}</span>
          <Slider
            value={currentTime}
            max={total || 1}
            onChange={(v) => A.seekTo(v)}
            label="Seek"
            step={5}
          />
          <span className="player__time">{fmtTime(total)}</span>
        </div>

        {/* ── extras ──────────────────────────────────────── */}
        <div className="player__extras">
          <button
            className={`icon-btn ${isFav ? 'heart-on' : ''}`}
            onClick={() => A.toggleFavorite(current.id)}
            aria-pressed={isFav}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Icon name="heart" size={19} filled={isFav} />
          </button>

          <div className="player__volume">
            <button
              className="icon-btn"
              onClick={() => A.toggleMute()}
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              <Icon name={muted || volume === 0 ? 'mute' : 'volume'} size={19} />
            </button>
            <Slider
              value={muted ? 0 : volume}
              max={100}
              onChange={(v) => A.setVolume(v)}
              label="Volume"
            />
          </div>

          <button
            className="icon-btn"
            onClick={toggleQueue}
            aria-label="Open queue"
            aria-expanded={false}
          >
            <Icon name="queue" size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(StickyPlayer);
