import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';
import Toast from './Toast';
import StickyPlayer from '../player/StickyPlayer';
import ExpandedPlayer from '../player/ExpandedPlayer';
import Lightbox from '../common/Lightbox';
import NameGate from '../common/NameGate';
import { usePlayer } from '../../context/PlayerContext';

export default function Layout() {
  const { mood } = usePlayer();
  const { pathname } = useLocation();

  /* Mood repaints the whole surface — one attribute swap. */
  useEffect(() => {
    const root = document.documentElement;
    if (mood) root.dataset.mood = mood;
    else delete root.dataset.mood;
  }, [mood]);

  /* New route starts at the top, unless the URL has a hash. */
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="app-main">
        <Outlet />
      </main>

      <Footer />

      <BottomNav />
      <StickyPlayer />
      <ExpandedPlayer />
      <Lightbox />
      <NameGate />
      <Toast />
    </>
  );
}
