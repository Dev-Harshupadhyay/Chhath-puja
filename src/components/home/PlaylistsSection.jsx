import { Link } from 'react-router-dom';
import Icon from '../Icon';
import SectionHeading from '../common/SectionHeading';
import { usePlayer, usePlayerActions } from '../../context/PlayerContext';
import { playlists } from '../../data/playlists';
import { songById } from '../../data/songs';

const resolve = (p) => p.songIds.map((id) => songById.get(id)).filter(Boolean);

export default function PlaylistsSection() {
  const A = usePlayerActions();
  const { savedPlaylists } = usePlayer();

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Curated"
          hindi="चुनिंदा प्लेलिस्ट"
          title="Playlists for every hour of Chhath"
          sub="Subah ki arghya se lekar raat ke jagran tak — har bela ke liye ek playlist."
          to="/playlists"
        />

        <div className="rail rail--wide">
          {playlists.map((p) => {
            const list = resolve(p);
            const saved = savedPlaylists.has(p.slug);
            return (
              <article key={p.slug} className="pl-card">
                <Link to={`/playlists/${p.slug}`} className="pl-card__cover" aria-label={p.englishTitle}>
                  <span aria-hidden="true">{p.emoji}</span>
                </Link>
                <div className="pl-card__body">
                  <Link to={`/playlists/${p.slug}`}>
                    <h3 className="deva truncate">{p.title}</h3>
                  </Link>
                  <p className="clamp-2">{p.blurb}</p>
                  <div className="pl-card__foot">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                      {list.length} geet
                    </span>
                    <span className="row" style={{ gap: 2 }}>
                      <button
                        className="icon-btn"
                        style={{ width: 36, height: 36 }}
                        onClick={() => A.playQueue(list, 0)}
                        aria-label={`Play ${p.englishTitle}`}
                      >
                        <Icon name="play" size={16} filled strokeWidth={0} />
                      </button>
                      <button
                        className={`icon-btn ${saved ? 'heart-on' : ''}`}
                        style={{ width: 36, height: 36 }}
                        onClick={() => A.toggleSavedPlaylist(p.slug)}
                        aria-pressed={saved}
                        aria-label={saved ? 'Unsave playlist' : 'Save playlist'}
                      >
                        <Icon name="heart" size={16} filled={saved} />
                      </button>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
