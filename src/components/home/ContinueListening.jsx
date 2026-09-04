import { Link } from 'react-router-dom';
import Icon from '../Icon';
import SongCard from '../common/SongCard';
import SectionHeading from '../common/SectionHeading';
import { usePlayer, usePlayerActions } from '../../context/PlayerContext';

export default function ContinueListening() {
  const { recentSongs } = usePlayer();
  const A = usePlayerActions();

  if (!recentSongs.length) return null;

  return (
    <section className="section" style={{ paddingTop: 'var(--s-10)' }}>
      <div className="shell">
        <SectionHeading
          eyebrow="Continue"
          hindi="सुनना जारी रखें"
          title="Continue Listening"
          sub="Jahaan chhoda tha, wahin se shuru karein."
        />
        <div className="rail">
          {recentSongs.slice(0, 10).map((song) => (
            <SongCard key={song.id} song={song} queue={recentSongs} />
          ))}
        </div>
      </div>
    </section>
  );
}
