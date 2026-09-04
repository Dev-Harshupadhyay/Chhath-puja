import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import SongCard from '../components/common/SongCard';
import EmptyState from '../components/common/EmptyState';
import SectionHeading from '../components/common/SectionHeading';
import { usePlayer, usePlayerActions } from '../context/PlayerContext';
import { artists } from '../data/artists';
import { playlists, playlistSongs } from '../data/playlists';
import { songs, songById, thumb } from '../data/songs';
import LazyImage from '../components/common/LazyImage';

export default function Favorites() {
  const { favoriteSongs, savedPlaylists, favoriteArtists } = usePlayer();
  const A = usePlayerActions();

  const savedLists = playlists.filter((p) => savedPlaylists.has(p.slug));
  const followedArtists = artists.filter((a) => favoriteArtists.has(a.name));
  const isEmpty =
    favoriteSongs.length === 0 && savedLists.length === 0 && followedArtists.length === 0;

  return (
    <div className="shell">
      <header className="page-head">
        <span className="eyebrow">Favorites</span>
        <h1 className="deva">पसंदीदा</h1>
        <p>
          Aapke pasandida geet, artists aur playlists — sab isi device par saved. Koi account
          zaroori nahi.
        </p>
      </header>

      {isEmpty ? (
        <EmptyState
          icon="heart"
          title="अभी कोई गीत पसंद नहीं किया गया है।"
          body="Kisi bhi geet ke dil wale button par tap karein — woh yahin saved ho jayega."
          action={
            <Link className="btn btn--primary" to="/library">
              <Icon name="search" size={16} /> गीत खोजें
            </Link>
          }
        />
      ) : (
        <>
          {favoriteSongs.length > 0 && (
            <section className="section" style={{ paddingTop: 'var(--s-4)' }}>
              <SectionHeading
                eyebrow={`${favoriteSongs.length} saved`}
                hindi="पसंदीदा गीत"
                title="Favorite songs"
              />
              <div className="row" style={{ gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <button className="btn btn--primary" onClick={() => A.playQueue(favoriteSongs, 0)}>
                  <Icon name="play" size={16} filled strokeWidth={0} /> Play all
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() => A.playQueue(shuffleArray(favoriteSongs), 0)}
                >
                  <Icon name="shuffle" size={16} /> Shuffle
                </button>
              </div>
              <div className="grid">
                {favoriteSongs.map((s) => (
                  <SongCard key={s.id} song={s} queue={favoriteSongs} />
                ))}
              </div>
            </section>
          )}

          {followedArtists.length > 0 && (
            <section className="section" style={{ paddingTop: 0 }}>
              <SectionHeading hindi="पसंदीदा कलाकार" title="Followed artists" />
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {followedArtists.map((a) => {
                  const list = songs.filter((s) => s.artist === a.name);
                  const top = songById.get(a.topSongIds[0]) ?? list[0];
                  return (
                    <article key={a.slug} className="artist-card">
                      <Link to={`/artists/${a.slug}`} className="artist-card__avatar">
                        {top && <LazyImage src={thumb(top)} alt="" />}
                      </Link>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <Link to={`/artists/${a.slug}`}>
                          <h3 className="truncate">{a.name}</h3>
                        </Link>
                        <p>{list.length} geet</p>
                      </div>
                      <button
                        className="icon-btn"
                        onClick={() => A.playQueue(list, 0)}
                        aria-label={`Play ${a.name}`}
                      >
                        <Icon name="play" size={18} filled strokeWidth={0} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {savedLists.length > 0 && (
            <section className="section" style={{ paddingTop: 0 }}>
              <SectionHeading hindi="सेव की गई प्लेलिस्ट" title="Saved playlists" />
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
                {savedLists.map((p) => {
                  const list = playlistSongs(p);
                  return (
                    <article key={p.slug} className="pl-card">
                      <Link to={`/playlists/${p.slug}`} className="pl-card__cover" aria-label={p.englishTitle}>
                        <span aria-hidden="true">{p.emoji}</span>
                      </Link>
                      <div className="pl-card__body">
                        <Link to={`/playlists/${p.slug}`}>
                          <h3 className="deva truncate">{p.title}</h3>
                        </Link>
                        <p>{list.length} geet</p>
                        <div className="pl-card__foot">
                          <button className="btn btn--ghost btn--sm" onClick={() => A.playQueue(list, 0)}>
                            <Icon name="play" size={14} filled strokeWidth={0} /> Play
                          </button>
                          <button
                            className="icon-btn heart-on"
                            onClick={() => A.toggleSavedPlaylist(p.slug)}
                            aria-label="Unsave playlist"
                            style={{ width: 36, height: 36 }}
                          >
                            <Icon name="heart" size={16} filled />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
