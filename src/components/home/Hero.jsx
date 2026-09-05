import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import LazyImage from '../common/LazyImage';
import Atmosphere from '../ambient/Atmosphere';
import { usePlayerActions, usePlayer } from '../../context/PlayerContext';
import { songs } from '../../data/songs';
import { artists } from '../../data/artists';
import { festivalStatus } from '../../lib/festival';
import { useName } from '../../context/NameContext';

/* Six diyas, each its own slow breathing cycle.
   Transform + opacity only — no layout, no repaint. */
const DIYAS = [
  { left: '6%', bottom: 8, size: 9, delay: '0s', dur: '5.5s', opacity: 0.85 },
  { left: '22%', bottom: 26, size: 7, delay: '1.1s', dur: '6.4s', opacity: 0.7 },
  { left: '41%', bottom: 6, size: 11, delay: '0.6s', dur: '5s', opacity: 0.9 },
  { left: '63%', bottom: 30, size: 8, delay: '2.2s', dur: '6.9s', opacity: 0.65 },
  { left: '79%', bottom: 12, size: 10, delay: '1.5s', dur: '5.8s', opacity: 0.8 },
  { left: '93%', bottom: 34, size: 7, delay: '3s', dur: '6.1s', opacity: 0.6 },
];

/**
 * Very subtle parallax on the hero artwork.
 *
 * One passive scroll listener, throttled to one write per frame,
 * that only ever sets a single CSS custom property. It bails out as
 * soon as the hero has scrolled away, and never runs at all for
 * people who asked for reduced motion.
 */
function useHeroParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY || window.pageYOffset || 0;
        const height = el.offsetHeight || 1;
        if (y > height) return; // hero is gone — stop working entirely
        el.style.setProperty('--hero-parallax', `${Math.min(y * 0.16, 80).toFixed(1)}px`);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export default function Hero() {
  const A = usePlayerActions();
  const { mood } = usePlayer();
  const { name, hasName, askAgain } = useName();
  const status = useMemo(() => festivalStatus(), []);
  const sectionRef = useRef(null);

  useHeroParallax(sectionRef);

  const startListening = () => {
    // Featured geet first, then the rest — one continuous queue.
    const ordered = [...songs.filter((s) => s.featured), ...songs.filter((s) => !s.featured)];
    A.playQueue(ordered, 0);
  };

  return (
    <section className="hero" aria-label="Chhath Geet" ref={sectionRef}>
      <div className="hero__art">
        <LazyImage
          src="/images/hero-madhubani.jpg"
          alt="Madhubani painting of devotees offering arghya to the Sun at a Chhath ghat"
          eager
          fetchpriority="high"
        />
      </div>

      {/* ── sunrise, light shafts, ambience ───────────────────
          Order matters: rays and the dark scrim go down first so the
          sunrise bloom can sit on top of them and still read, while
          everything stays behind .hero__inner. */}
      <div className="hero__rays" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__sunrise" aria-hidden="true" />

      <Atmosphere variant="bokeh" count={6} seed={17} />
      <Atmosphere variant="particles" count={16} seed={3} />

      <div className="hero__diyas" aria-hidden="true">
        {DIYAS.map((d, i) => (
          <span
            key={i}
            className="hero__diya"
            style={{
              '--d-left': d.left,
              '--d-bottom': `${d.bottom}px`,
              '--d-size': `${d.size}px`,
              '--d-delay': d.delay,
              '--d-dur': d.dur,
              '--d-opacity': d.opacity,
            }}
          />
        ))}
      </div>

      {/* ghat water along the bottom edge */}
      <div className="hero__water" aria-hidden="true">
        <Atmosphere variant="water" count={6} seed={29} />
      </div>

      <div className="shell hero__inner">
        {hasName && (
          <p className="hero__greet" style={{ marginBottom: 14 }}>
            <span className="deva">
              जय छठी मैया, <b>{name}</b> 🙏
            </span>
            <button onClick={askAgain} aria-label="Apna naam badlein" title="Naam badlein">
              <Icon name="mic" size={13} />
            </button>
          </p>
        )}

        <p className="hero__kicker">
          <Icon name="sun" size={13} /> छठ महापर्व · Chhath Mahaparva
        </p>

        <h1 className="hero__title">
          <span
            className="deva"
            style={{
              display: 'block',
              fontSize: '0.42em',
              letterSpacing: '0.16em',
              color: 'var(--parchment)',
            }}
          >
            छठ महापर्व
          </span>
          <span className="hero__title-accent">CHHATH GEET</span>
        </h1>

        <p className="hero__quote deva">“सूर्य देव की आराधना, लोकगीतों की मिठास।”</p>
        <p className="hero__en">
          Devotional songs for the sacred festival of Chhath — {songs.length} geet from{' '}
          {artists.length} voices, streamed from official YouTube sources.
        </p>

        <div className="hero__cta">
          <button className="btn btn--primary btn--lg" onClick={startListening}>
            <Icon name="play" size={18} filled strokeWidth={0} /> सुनना शुरू करें
          </button>
          <Link className="btn btn--ghost btn--lg" to="/library">
            Explore Songs
            <Icon name="right" size={17} />
          </Link>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <b>{songs.length}</b>
            <span>Chhath Geet</span>
          </div>
          <div className="hero__stat">
            <b>{artists.length}</b>
            <span>Artists</span>
          </div>
          <div className="hero__stat">
            <b>{status.daysToGo}</b>
            <span>Days to Chhath {status.year}</span>
          </div>
          <div className="hero__stat">
            <b>{mood ? mood : '—'}</b>
            <span>Current mood</span>
          </div>
        </div>
      </div>
    </section>
  );
}
