import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import LazyImage from '../components/common/LazyImage';
import SongRow from '../components/common/SongRow';
import EmptyState from '../components/common/EmptyState';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';
import { artistBySlug } from '../data/artists';
import { songs, thumb } from '../data/songs';
import { fmtTime } from '../lib/format';

export default function ArtistDetail() {
  const { slug } = useParams();
  const A = usePlayerActions();
  const { favoriteArtists, favorites } = usePlayer();

  const artist = artistBySlug.get(slug);
  const list = useMemo(() => (artist ? songs.filter((s) => s.artist === artist.name) : []), [artist]);
  const top = useMemo(() => list.filter((s) => s.featured), [list]);

  if (!artist) {
    return (
      <div className="shell">
        <EmptyState
          icon="mic"
          title="Artist nahi mila"
          body="Yeh artist is catalogue mein maujood nahi hai."
          action={
            <Link className="btn btn--primary" to="/artists">
              All artists
            </Link>
          }
        />
      </div>
    );
  }

  const total = list.reduce((n, s) => n + s.seconds, 0);
  const isFollowed = favoriteArtists.has(artist.name);

  return (
    <div className="shell">
      <header className="page-head">
        <Link className="see-all" to="/artists" style={{ paddingLeft: 0 }}>
          <Icon name="left" size={15} /> Artists
        </Link>
      </header>

      <div className="artist-hero">
        <div className="artist-hero__avatar">
          <LazyImage src={thumb(list[0])} alt="" eager />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <span className="eyebrow">Artist</span>
          <h1 style={{ marginTop: 6 }}>{artist.name}</h1>
          {/* No fabricated biography — only what the catalogue proves. */}
          <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {list.length} geet · {artist.channels.join(' · ')} · {fmtTime(total)} total
          </p>
          <div className="row" style={{ gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={() => A.playQueue(list, 0)}>
              <Icon name="play" size={17} filled strokeWidth={0} /> Play all
            </button>
            <button
              className={`btn ${isFollowed ? 'btn--ghost' : 'btn--ghost'}`}
              onClick={() => A.toggleArtistFavorite(artist.name)}
              aria-pressed={isFollowed}
            >
              <Icon name="heart" size={16} filled={isFollowed} />
              {isFollowed ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>

      {top.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="section-head">
            <h2 className="section-title">Popular songs</h2>
          </div>
          <div className="stack" style={{ gap: 2 }}>
            {top.map((s, i) => (
              <SongRow key={s.id} song={s} queue={top} position={i + 1} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">All songs ({list.length})</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
            {favorites.size > 0
              ? `${list.filter((s) => favorites.has(s.id)).length} pasandida`
              : 'Official YouTube sources'}
          </span>
        </div>
        <div className="stack" style={{ gap: 2 }}>
          {list.map((s, i) => (
            <SongRow key={s.id} song={s} queue={list} position={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
