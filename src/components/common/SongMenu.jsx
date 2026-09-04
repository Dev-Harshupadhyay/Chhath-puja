import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import { usePlayer, usePlayerActions } from '../../context/PlayerContext';
import { shareText, shareUrl } from '../../lib/format';

/**
 * Overflow menu for a song. Positioned against the trigger button
 * and clamped to the viewport so it never opens off-screen.
 */
export default function SongMenu({ song, anchorEl, onClose }) {
  const { favorites } = usePlayer();
  const A = usePlayerActions();
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    const w = 224;
    const h = 300;
    const left = Math.min(Math.max(8, r.right - w), window.innerWidth - w - 8);
    const top = Math.min(r.bottom + 6, window.innerHeight - h - 8);
    setPos({ top: Math.max(8, top), left });
  }, [anchorEl]);

  useEffect(() => {
    if (!anchorEl) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !anchorEl.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onClose, { once: true, passive: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onClose);
    };
  }, [anchorEl, onClose]);

  if (!anchorEl || !pos) return null;

  const isFav = favorites.has(song.id);
  const run = (fn) => () => {
    fn();
    onClose();
  };

  const share = async () => {
    const data = {
      title: song.title,
      text: shareText(song),
      url: shareUrl(song),
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
        A.notify('Link copy ho gaya');
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <div
      className="menu"
      ref={ref}
      role="menu"
      aria-label={`${song.title} options`}
      style={{ top: pos.top, left: pos.left, minWidth: 224 }}
    >
      <button role="menuitem" onClick={run(() => A.playSong(song, [song]))}>
        <Icon name="play" size={17} /> Play now
      </button>
      <button role="menuitem" onClick={run(() => A.playNext(song))}>
        <Icon name="next" size={17} /> Play next
      </button>
      <button role="menuitem" onClick={run(() => A.addToQueue(song))}>
        <Icon name="plus" size={17} /> Add to queue
      </button>
      <hr />
      <button role="menuitem" onClick={run(() => A.toggleFavorite(song.id))}>
        <Icon name="heart" size={17} filled={isFav} /> {isFav ? 'Remove from favorites' : 'Add to favorites'}
      </button>
      <button role="menuitem" onClick={run(share)}>
        <Icon name="share" size={17} /> Share
      </button>
      <hr />
      <button role="menuitem" onClick={run(() => window.open(shareUrl(song), '_blank', 'noopener'))}>
        <Icon name="external" size={17} /> Open on YouTube
      </button>
    </div>
  );
}
