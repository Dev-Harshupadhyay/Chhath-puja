import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import SongRow from '../components/common/SongRow';
import EmptyState from '../components/common/EmptyState';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';
import { playlistBySlug, playlistSongs } from '../data/playlists';
import { fmtTime } from '../lib/format';

export default function PlaylistDetail() {
  const { slug } = useParams();
  const A = usePlayerActions();
  const { savedPlaylists } = usePlayer();

  const playlist = playlistBySlug.get(slug);
  if (!playlist) {
    return (
      <div className="shell">
        <EmptyState
          icon="list"
          title="Playlist nahi mili"
          action={
            <Link className="btn btn--primary" to="/playlists">
              All playlists
            </Link>
          }
        />
      </div>
    );
  }

  const list = playlistSongs(playlist);
  const total = list.reduce((n, s) => n + s.seconds, 0);
  const saved = savedPlaylists.has(playlist.slug);

  const shufflePlay = () => {
    A.setShuffle(true);
    A.playQueue(list, Math.floor(Math.random() * list.length));
  };

  return (
    <div className="shell">
      <header className="page-head">
        <Link className="see-all" to="/playlists" style={{ paddingLeft: 0 }}>
          <Icon name="left" size={15} /> Playlists
        </Link>
      </header>

      <div className="artist-hero">
        <div
          className="pl-card__cover"
          style={{ width: 148, borderRadius: 'var(--r-lg)', fontSize: '3.6rem', aspectRatio: 1 }}
          aria-hidden="true"
        >
          {playlist.emoji}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <span className="eyebrow">Playlist</span>
          <h1 className="deva" style={{ marginTop: 6 }}>
            {playlist.title}
          </h1>
          <p style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {playlist.englishTitle} · {list.length} geet · {fmtTime(total)}
          </p>
          <p style={{ marginTop: 6, color: 'var(--text-soft)' }}>{playlist.blurb}</p>

          <div className="row" style={{ gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={() => A.playQueue(list, 0)}>
              <Icon name="play" size={17} filled strokeWidth={0} /> Play all
            </button>
            <button className="btn btn--ghost" onClick={shufflePlay}>
              <Icon name="shuffle" size={16} /> Shuffle
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => A.toggleSavedPlaylist(playlist.slug)}
              aria-pressed={saved}
            >
              <Icon name="heart" size={16} filled={saved} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="stack" style={{ gap: 2 }}>
          {list.map((s, i) => (
            <SongRow key={s.id} song={s} queue={list} position={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
