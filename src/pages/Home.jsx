import Hero from '../components/home/Hero';
import Countdown from '../components/home/Countdown';
import ContinueListening from '../components/home/ContinueListening';
import MoodSection from '../components/home/MoodSection';
import FeaturedSection from '../components/home/FeaturedSection';
import PopularArtists from '../components/home/PopularArtists';
import PlaylistsSection from '../components/home/PlaylistsSection';
import FourDaysSection from '../components/home/FourDaysSection';
import PopularSongs from '../components/home/PopularSongs';
import GallerySection from '../components/home/GallerySection';
import AboutChhath from '../components/home/AboutChhath';
import { useReveal } from '../hooks/useReveal';

/**
 * Home follows a deliberate rhythm — cinematic opener, then
 * short personal rows, then wide discovery grids, then the
 * cultural storytelling. Every band is visually distinct.
 */
function Band({ children }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <div className="shell" style={{ marginTop: 'var(--s-8)' }}>
        <Band>
          <Countdown />
        </Band>
      </div>

      <Band>
        <ContinueListening />
      </Band>

      <Band>
        <MoodSection />
      </Band>

      <hr className="hairline shell" />

      <Band>
        <FeaturedSection />
      </Band>

      <Band>
        <PopularArtists />
      </Band>

      <Band>
        <PlaylistsSection />
      </Band>

      <hr className="hairline shell" />

      <Band>
        <FourDaysSection />
      </Band>

      <Band>
        <PopularSongs />
      </Band>

      <Band>
        <GallerySection />
      </Band>

      <Band>
        <AboutChhath />
      </Band>
    </>
  );
}
