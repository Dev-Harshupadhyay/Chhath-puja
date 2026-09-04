import { useMemo } from 'react';
import SongCard from '../common/SongCard';
import SectionHeading from '../common/SectionHeading';
import { usePlayerActions } from '../../context/PlayerContext';
import { songs } from '../../data/songs';

export default function FeaturedSection() {
  const A = usePlayerActions();
  const featured = useMemo(() => songs.filter((s) => s.featured), []);

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Featured"
          hindi="चुनिंदा छठ गीत"
          title="Featured Chhath Geet"
          sub="Sabse zyada suney jaane wale geet — har saal ghat par sabse pehle bajte hain."
          to="/library?view=featured"
        />
        <div className="grid">
          {featured.map((song) => (
            <SongCard key={song.id} song={song} queue={featured} />
          ))}
        </div>
        <div style={{ marginTop: 'var(--s-5)' }}>
          <button
            className="btn btn--primary"
            onClick={() => A.playQueue(featured, 0)}
          >
            सभी चुनिंदा गीत सुनें
          </button>
        </div>
      </div>
    </section>
  );
}
