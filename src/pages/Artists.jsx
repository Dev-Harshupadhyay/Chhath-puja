import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import LazyImage from '../components/common/LazyImage';
import SectionHeading from '../components/common/SectionHeading';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';
import { artists } from '../data/artists';
import { songs, songById, thumb } from '../data/songs';

export default function Artists() {
  const A = usePlayerActions();
  const { favoriteArtists } = usePlayer();

  const rows = useMemo(
    () =>
      artists
        .map((a) => {
          const list = songs.filter((s) => s.artist === a.name);
          return { ...a, list, top: songById.get(a.topSongIds[0]) ?? list[0] };
        })
        .filter((a) => a.top)
        .sort((x, y) => y.list.length - x.list.length),
    [],
  );

  return (
    <div className="shell">
      <header className="page-head">
        <span className="eyebrow">Voices</span>
        <h1 className="deva">कलाकार</h1>
        <p>
          Chhath geet ke sabse pramukh awaaz — {artists.length} artists, {songs.length} geet. Har
          artist page par unke saare geet official channels se.
        </p>
      </header>

      <SectionHeading hindi="सभी कलाकार" title="All artists" />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {rows.map((a) => (
          <article key={a.slug} className="artist-card">
            <Link to={`/artists/${a.slug}`} className="artist-card__avatar" aria-label={a.name}>
              <LazyImage src={thumb(a.top)} alt="" />
            </Link>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Link to={`/artists/${a.slug}`}>
                <h3 className="truncate">{a.name}</h3>
              </Link>
              <p className="truncate">
                {a.list.length} geet · {a.channels.join(', ')}
              </p>
            </div>
            <div className="row" style={{ gap: 2 }}>
              <button
                className="icon-btn"
                onClick={() => A.playQueue(a.list, 0)}
                aria-label={`Play all ${a.name} songs`}
              >
                <Icon name="play" size={18} filled strokeWidth={0} />
              </button>
              <button
                className={`icon-btn ${favoriteArtists.has(a.name) ? 'heart-on' : ''}`}
                onClick={() => A.toggleArtistFavorite(a.name)}
                aria-pressed={favoriteArtists.has(a.name)}
                aria-label={favoriteArtists.has(a.name) ? `Unfollow ${a.name}` : `Follow ${a.name}`}
              >
                <Icon name="heart" size={18} filled={favoriteArtists.has(a.name)} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
