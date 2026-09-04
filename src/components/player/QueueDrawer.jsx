import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';
import LazyImage from '../common/LazyImage';
import { usePlayer, usePlayerActions } from '../../context/PlayerContext';
import { useUI, useEscape } from '../../context/UIContext';
import { thumb } from '../../data/songs';
import { fmtTime } from '../../lib/format';

/**
 * Queue drawer: current + up next, with remove, clear and
 * reorder. Reordering works three ways — drag (mouse),
 * Arrow keys on the grip (keyboard), and tap-arrows on touch.
 */
export default function QueueDrawer() {
  const { queueSongs, index, current } = usePlayer();
  const A = usePlayerActions();
  const { closeQueue } = useUI();
  const [dragFrom, setDragFrom] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const listRef = useRef(null);

  useEscape(true, closeQueue);

  const upNext = queueSongs.slice(index + 1);
  const base = index + 1;

  const move = (from, to) => {
    if (to < base || to >= queueSongs.length) return;
    A.reorderQueue(from, to);
  };

  return createPortal(
    <>
      <div className="queue-scrim" onClick={closeQueue} aria-hidden="true" />
      <aside
        className="queue"
        role="dialog"
        aria-modal="true"
        aria-label="Queue"
      >
        <div className="queue__handle" aria-hidden="true" />
        <div className="queue__head">
          <div>
            <span className="eyebrow">Queue</span>
            <h3>अगला गीत · Up next</h3>
          </div>
          <button className="icon-btn" onClick={closeQueue} aria-label="Close queue">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="queue__list" ref={listRef}>
          {current && (
            <>
              <div className="eyebrow" style={{ margin: '4px 4px 6px' }}>
                Abhi chal raha hai
              </div>
              <div className="queue__item is-current">
                <span className="queue__grip" aria-hidden="true">
                  <span className="eq">
                    <span />
                    <span />
                    <span />
                  </span>
                </span>
                <span className="queue__art">
                  <LazyImage src={thumb(current)} alt="" />
                </span>
                <span className="queue__meta">
                  <b className="truncate">{current.title}</b>
                  <span className="truncate">{current.artist}</span>
                </span>
                <span className="song-row__time">{fmtTime(current.seconds)}</span>
              </div>
              <div className="eyebrow" style={{ margin: '14px 4px 6px' }}>
                Up next · {upNext.length}
              </div>
            </>
          )}

          {upNext.length === 0 && (
            <p style={{ padding: '18px 8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Queue khaali hai. Koi geet play karein ya “Add to queue” dabayein.
            </p>
          )}

          {upNext.map((song, i) => {
            const qi = base + i;
            return (
              <div
                key={`${song.id}-${qi}`}
                className={`queue__item ${dragOver === qi ? 'is-over' : ''} ${
                  dragFrom === qi ? 'is-dragging' : ''
                }`}
                draggable
                onDragStart={() => setDragFrom(qi)}
                onDragEnd={() => {
                  setDragFrom(null);
                  setDragOver(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(qi);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragFrom !== null && dragFrom !== qi) A.reorderQueue(dragFrom, qi);
                  setDragFrom(null);
                  setDragOver(null);
                }}
              >
                <button
                  className="queue__grip"
                  aria-label={`Reorder ${song.title}. Use arrow up and arrow down keys.`}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      move(qi, qi - 1);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      move(qi, qi + 1);
                    }
                  }}
                >
                  <Icon name="grip" size={16} />
                </button>

                <button
                  className="queue__art"
                  onClick={() => A.playSong(song, queueSongs)}
                  aria-label={`Play ${song.title}`}
                  style={{ padding: 0, border: 0 }}
                >
                  <LazyImage src={thumb(song)} alt="" />
                </button>

                <button
                  className="queue__meta"
                  onClick={() => A.playSong(song, queueSongs)}
                  style={{ textAlign: 'left', padding: 0, border: 0 }}
                  aria-label={`Play ${song.title}`}
                >
                  <b className="truncate">{song.title}</b>
                  <span className="truncate">{song.artist}</span>
                </button>

                <span className="row" style={{ gap: 0 }}>
                  <span className="song-row__time">{fmtTime(song.seconds)}</span>
                  <button
                    className="icon-btn"
                    style={{ width: 36, height: 36 }}
                    onClick={() => A.removeFromQueue(qi)}
                    aria-label={`Remove ${song.title} from queue`}
                  >
                    <Icon name="x" size={16} />
                  </button>
                </span>
              </div>
            );
          })}
        </div>

        <div className="queue__foot">
          <button className="btn btn--ghost btn--sm btn--block" onClick={() => A.clearQueue()}>
            <Icon name="trash" size={15} /> Clear queue
          </button>
        </div>
      </aside>
    </>,
    document.body,
  );
}
