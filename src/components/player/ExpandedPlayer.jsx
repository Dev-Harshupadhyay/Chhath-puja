import { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';
import LazyImage from '../common/LazyImage';
import Slider from '../common/Slider';
import QueueDrawer from './QueueDrawer';
import { usePlayer, usePlayerActions, useProgress } from '../../context/PlayerContext';
import { useUI, useEscape } from '../../context/UIContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { thumb, watchUrl } from '../../data/songs';
import { fmtTime, shareText } from '../../lib/format';

/** Full-screen "now playing" — the app-like layer over the embed. */
export default function ExpandedPlayer() {
  const { current, isPlaying, isBuffering, favorites, shuffle, upNext } = usePlayer();
  const A = usePlayerActions();
  const { currentTime, duration } = useProgress();
  const { expandedOpen, closeExpanded, queueOpen, openQueue } = useUI();

  const dragStart = useRef(null);

  useBodyScrollLock(expandedOpen);
  useEscape(expandedOpen, closeExpanded);

  /* swipe-down to dismiss on touch */
  const onPointerDown = (e) => {
    if (e.target.closest('button, input, .slider')) return;
    dragStart.current = e.clientY;
  };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const dy = e.clientY - dragStart.current;
    dragStart.current = null;
    if (dy > 110) closeExpanded();
  };

  const share = useCallback(async () => {
    if (!current) return;
    const data = { title: current.title, text: shareText(current), url: watchUrl(current) };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
        A.notify('Link copy ho gaya');
      }
    } catch {
      /* dismissed */
    }
  }, [current, A]);

  if (!expandedOpen || !current) return null;

  const total = duration || current.seconds || 0;
  const isFav = favorites.has(current.id);

  return createPortal(
    <>
      <div
        className="expanded"
        role="dialog"
        aria-modal="true"
        aria-label="Now playing"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="expanded__top">
          <button className="icon-btn" onClick={closeExpanded} aria-label="Close player">
            <Icon name="down" size={22} />
          </button>
          <span
            className="eyebrow"
            style={{ color: 'var(--gold-400)' }}
          >
            अभी बज रहा है · Now playing
          </span>
          <button className="icon-btn" onClick={openQueue} aria-label="Open queue">
            <Icon name="queue" size={20} />
          </button>
        </div>

        <div className="expanded__body">
          <div className="expanded__art">
            <LazyImage src={thumb(current, 'max')} alt={current.title} eager />
          </div>

          <div className="expanded__info">
            <h2>{current.title}</h2>
            {current.hindiTitle && (
              <span className="deva" lang="hi">
                {current.hindiTitle}
              </span>
            )}
            <p>
              {current.artist} · {current.channel}
            </p>
          </div>

          <div className="expanded__progress">
            <Slider
              value={currentTime}
              max={total || 1}
              onChange={(v) => A.seekTo(v)}
              label="Seek"
              step={5}
            />
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
              <span className="player__time">{fmtTime(currentTime)}</span>
              <span className="player__time">{fmtTime(total)}</span>
            </div>
          </div>

          <div className="expanded__controls">
            <button
              className={`icon-btn ${shuffle ? 'icon-btn--on' : ''}`}
              onClick={() => A.setShuffle(!shuffle)}
              aria-pressed={shuffle}
              aria-label="Shuffle"
            >
              <Icon name="shuffle" size={22} />
            </button>
            <button className="icon-btn" onClick={() => A.prev()} aria-label="Previous">
              <Icon name="prev" size={28} />
            </button>
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
                    width: 22,
                    height: 22,
                    border: '2px solid rgba(42,15,6,.35)',
                    borderTopColor: '#2a0f06',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : (
                <Icon
                  name={isPlaying ? 'pause' : 'play'}
                  size={30}
                  filled
                  strokeWidth={0}
                  style={{ transform: isPlaying ? 'none' : 'translateX(2px)' }}
                />
              )}
            </button>
            <button className="icon-btn" onClick={() => A.next(true)} aria-label="Next">
              <Icon name="next" size={28} />
            </button>
            <button
              className={`icon-btn ${isFav ? 'icon-btn--on heart-on' : ''}`}
              onClick={() => A.toggleFavorite(current.id)}
              aria-pressed={isFav}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icon name="heart" size={22} filled={isFav} />
            </button>
          </div>

          <div className="expanded__aux">
            <button
              className="btn btn--ghost btn--sm"
              onClick={share}
              aria-label="Share this geet"
            >
              <Icon name="share" size={16} /> Share
            </button>

            {/* No lyrics dataset exists, so we say so instead of
                inventing words. Rule: never fabricate content. */}
            <button
              className="btn btn--quiet btn--sm"
              disabled
              title="इस गीत के लिए lyrics उपलब्ध नहीं हैं"
              aria-label="Lyrics unavailable for this song"
            >
              <Icon name="list" size={16} /> Lyrics unavailable
            </button>

            <a
              className="btn btn--quiet btn--sm"
              href={watchUrl(current)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon name="youtube" size={16} /> YouTube
            </a>
          </div>

          {upNext.length > 0 && (
            <div style={{ width: '100%' }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Up next
              </div>
              <div className="stack" style={{ gap: 4 }}>
                {upNext.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    className="song-row"
                    style={{ gridTemplateColumns: '44px minmax(0,1fr) auto', cursor: 'pointer' }}
                    onClick={() => A.playSong(s, [current, ...upNext])}
                  >
                    <span className="song-row__art">
                      <LazyImage src={thumb(s)} alt="" />
                    </span>
                    <span className="song-row__title">
                      <span style={{ minWidth: 0 }}>
                        <b className="truncate" style={{ display: 'block' }}>
                          {s.title}
                        </b>
                        <i className="truncate" lang="hi" style={{ display: 'block' }}>
                          {s.hindiTitle || s.artist}
                        </i>
                      </span>
                    </span>
                    <span className="song-row__time">{fmtTime(s.seconds)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {queueOpen && <QueueDrawer />}
    </>,
    document.body,
  );
}
