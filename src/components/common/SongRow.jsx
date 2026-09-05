import { memo, useState } from 'react';
import Icon from '../Icon';
import SongThumb from './SongThumb';
import SongMenu from './SongMenu';
import { usePlayer, usePlayerActions } from '../../context/PlayerContext';
import { fmtTime } from '../../lib/format';
import { dayByKey } from '../../data/days';

/** Compact row used by the Song Library and playlist views. */
function SongRow({ song, queue, position }) {
  const { current, isPlaying, favorites } = usePlayer();
  const A = usePlayerActions();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const isCurrent = current?.id === song.id;
  const isFav = favorites.has(song.id);
  const day = dayByKey.get(song.day);

  const onPlay = () => {
    if (isCurrent) A.toggle();
    else A.playSong(song, queue?.length ? queue : [song]);
  };

  return (
    <div
      className={`song-row ${isCurrent ? 'is-current' : ''}`}
      onDoubleClick={onPlay}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay();
        }
      }}
      aria-label={`${song.title} — ${song.artist}`}
    >
      <div className="song-row__index">
        {isCurrent && isPlaying ? (
          <span className="eq">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span>{position ?? ''}</span>
        )}
      </div>

      <div className="song-row__title">
        <div className="song-row__art">
          {/* hqdefault is plenty for a 44px row — cheaper than maxres */}
          <SongThumb song={song} alt="" size="hq">
            <button className="song-row__play" onClick={onPlay} tabIndex={-1} aria-hidden="true">
              <Icon name={isCurrent && isPlaying ? 'pause' : 'play'} size={18} />
            </button>
          </SongThumb>
        </div>
        <div style={{ minWidth: 0 }}>
          <b className="truncate" style={{ display: 'block' }}>
            {song.title}
          </b>
          <i className="truncate" lang="hi" style={{ display: 'block' }}>
            {song.hindiTitle || song.artist}
          </i>
        </div>
      </div>

      <div className="song-row__artist truncate">{song.artist}</div>
      <div className="song-row__day truncate">
        {day ? `${day.icon} ${day.hindiName}` : '—'}
      </div>
      <div className="song-row__time">{fmtTime(song.seconds)}</div>

      <div className="song-row__actions">
        <button
          className={`icon-btn ${isFav ? 'heart-on' : ''}`}
          onClick={() => A.toggleFavorite(song.id)}
          aria-pressed={isFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          style={{ width: 36, height: 36 }}
        >
          <Icon name="heart" size={17} filled={isFav} />
        </button>
        <button
          className="icon-btn"
          onClick={(e) => setMenuAnchor(menuAnchor ? null : e.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={Boolean(menuAnchor)}
          aria-label="More options"
          style={{ width: 36, height: 36 }}
        >
          <Icon name="more" size={17} />
        </button>
      </div>

      {menuAnchor && (
        <SongMenu song={song} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} />
      )}
    </div>
  );
}

export default memo(SongRow);
