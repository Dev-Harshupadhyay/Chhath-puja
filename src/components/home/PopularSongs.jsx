import { useMemo } from 'react';
import SongRow from '../common/SongRow';
import SectionHeading from '../common/SectionHeading';
import { songs } from '../../data/songs';
import { usePlayerActions } from '../../context/PlayerContext';

export default function PopularSongs() {
  const A = usePlayerActions();
  const popular = useMemo(
    () => [...songs.filter((s) => s.featured), ...songs.filter((s) => !s.featured)].slice(0, 10),
    [],
  );

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Popular"
          hindi="लोकप्रिय गीत"
          title="Most played this Chhath"
          to="/library"
        />
        <div className="stack" style={{ gap: 2 }}>
          {popular.map((song, i) => (
            <SongRow key={song.id} song={song} queue={popular} position={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
