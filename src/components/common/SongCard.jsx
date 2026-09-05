import { memo, useCallback, useState } from 'react';
import Icon from '../Icon';
import SongThumb from './SongThumb';
import SongMenu from './SongMenu';
import { usePlayer, usePlayerActions } from '../../context/PlayerContext';
import { fmtTime } from '../../lib/format';

/**
 * The workhorse card: artwork, Hindi + Latin titles, artist,
 * channel, duration, play, favourite and overflow actions.
 * Hover lifts the card and reveals the play button on desktop;
 * on touch the play button is always visible.
 */
function SongCard({ song, queue, showEq = true }) {
  const { current, isPlaying, favorites } = usePlayer();
  const A = usePlayerActions();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isCurrent = current?.id === song.id;
  const isFav = favorites.has(song.id);

  const onPlay = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isCurrent) A.toggle();
      else A.playSong(song, queue?.length ? queue : [song]);
    },
    [A, isCurrent, song, queue],
  );

  const onFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    A.toggleFavorite(song.id);
  };

  return (
    <article className={`song-card ${isCurrent ? 'is-current' : ''}`}>
      <div className="song-card__art">
        {/* Thumbnail is derived from the song's YouTube id — maxres
            first, hqdefault if that is missing, painted fallback last. */}
        <SongThumb song={song} alt={`${song.title} — ${song.artist}`}>
          <div className="song-card__scrim" />
          <span className="song-card__duration">{fmtTime(song.seconds)}</span>

          <button
            className="play-fab song-card__play"
            onClick={onPlay}
            aria-label={isCurrent && isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
          >
            <Icon
              name={isCurrent && isPlaying ? 'pause' : 'play'}
              size={20}
              filled
              strokeWidth={0}
              style={{ transform: 'translateX(1px)' }}
            />
          </button>

          {showEq && isCurrent && (
            <span
              aria-hidden="true"
              style={{ position: 'absolute', top: 10, left: 10 }}
            >
              <span className={`eq ${isPlaying ? '' : 'is-paused'}`}>
                <span />
                <span />
                <span />
              </span>
            </span>
          )}
        </SongThumb>
      </div>

      <div className="song-card__body">
        <div className="song-card__meta">
          <h3 className="song-card__title truncate" title={song.title}>
            {song.title}
          </h3>
          {song.hindiTitle && (
            <p className="song-card__hi truncate" lang="hi" title={song.hindiTitle}>
              {song.hindiTitle}
            </p>
          )}
          <p className="song-card__sub truncate" title={`${song.artist} · ${song.channel}`}>
            {song.artist} · {song.channel}
          </p>
        </div>

        <div className="song-card__actions">
          <button
            className={`icon-btn ${isFav ? 'heart-on' : ''}`}
            onClick={onFav}
            aria-pressed={isFav}
            aria-label={isFav ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`}
          >
            <Icon name="heart" size={18} filled={isFav} />
          </button>
          <button
            className="icon-btn"
            onClick={(e) => {
              e.preventDefault();
              setMenuAnchor(menuAnchor ? null : e.currentTarget);
            }}
            aria-haspopup="menu"
            aria-expanded={Boolean(menuAnchor)}
            aria-label={`More options for ${song.title}`}
          >
            <Icon name="more" size={18} />
          </button>
        </div>
      </div>

      {menuAnchor && (
        <SongMenu song={song} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} />
      )}
    </article>
  );
}

export default memo(SongCard);
