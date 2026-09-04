import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import LazyImage from '../common/LazyImage';
import SectionHeading from '../common/SectionHeading';
import { usePlayerActions, usePlayer } from '../../context/PlayerContext';
import { artists } from '../../data/artists';
import { songs, songById, thumb } from '../../data/songs';

export default function PopularArtists() {
  const A = usePlayerActions();
  const { favoriteArtists } = usePlayer();

  const withArt = useMemo(
    () =>
      artists
        .map((a) => {
          const list = songs.filter((s) => s.artist === a.name);
          const top = songById.get(a.topSongIds[0]) ?? list[0];
          return { ...a, list, top };
        })
        .filter((a) => a.top)
        .sort((x, y) => y.list.length - x.list.length),
    [],
  );

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Voices"
          hindi="लोकप्रिय कलाकार"
          title="Popular Artists"
          sub="Chhath ki awaaz jinke bina ghat soona lagta hai."
          to="/artists"
        />

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {withArt.slice(0, 8).map((a) => (
            <article key={a.slug} className="artist-card">
              <Link to={`/artists/${a.slug}`} className="artist-card__avatar" aria-label={a.name}>
                <LazyImage src={thumb(a.top)} alt="" loading="lazy" />
              </Link>
              <div style={{ minWidth: 0, flex: 1 }}>
                <Link to={`/artists/${a.slug}`}>
                  <h3 className="truncate">{a.name}</h3>
                </Link>
                <p>
                  {a.list.length} geet · {a.channels[0]}
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
                  aria-label={`Follow ${a.name}`}
                >
                  <Icon name="heart" size={18} filled={favoriteArtists.has(a.name)} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
