import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useUI, useEscape } from '../../context/UIContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

/* Order matters: Home and Songs first, Four Days kept near the front
   because it is the section people reach for during the festival. */
const LINKS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/library', label: 'Songs', icon: 'music' },
  { to: '/four-days', label: 'Four Days', icon: 'calendar' },
  { to: '/artists', label: 'Artists', icon: 'mic' },
  { to: '/playlists', label: 'Playlists', icon: 'list' },
  { to: '/gallery', label: 'Gallery', icon: 'image' },
  { to: '/favorites', label: 'Favorites', icon: 'heart' },
];

/**
 * Translucent glass bar with a hairline gold accent.
 *
 * Desktop lays the links out inline with the language control on the
 * right; below 1000px those collapse into a slide-in drawer opened by
 * the burger, so nothing is cramped and nothing is cut off at 320px.
 */
export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [q, setQ] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { openDeveloper } = useUI();
  const { t } = useLanguage();
  const burgerRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Any navigation closes the drawer. */
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEscape(drawerOpen, () => setDrawerOpen(false));
  useBodyScrollLock(drawerOpen);

  /* Focus the first link on open, hand focus back to the burger on close. */
  useEffect(() => {
    if (!drawerOpen) return;
    const id = setTimeout(() => {
      drawerRef.current?.querySelector('a, button')?.focus();
    }, 60);
    return () => {
      clearTimeout(id);
      burgerRef.current?.focus();
    };
  }, [drawerOpen]);

  const submit = (e) => {
    e.preventDefault();
    setDrawerOpen(false);
    navigate(q.trim() ? `/library?q=${encodeURIComponent(q.trim())}` : '/library');
  };

  const openDev = () => {
    setDrawerOpen(false);
    openDeveloper();
  };

  return (
    <header className={`nav ${stuck ? 'is-stuck' : ''}`}>
      <div className="shell nav__inner">
        <Link to="/" className="nav__brand" aria-label="Chhath Geet home">
          <span className="nav__brand-mark">
            <img src="/icons/favicon.svg" alt="" width="38" height="38" />
          </span>
          <span className="nav__brand-text">
            <b>छठ गीत</b>
            <span>Chhath Geet</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}

          {/* Creator credit — deliberately the quietest item in the bar. */}
          <button type="button" className="nav__link nav__link--dev" onClick={openDev}>
            <Icon name="code" size={15} /> {t('nav.developer')}
          </button>
        </nav>

        <span className="nav__spacer" />

        <div className="nav__actions">
          <form className="nav__search" onSubmit={submit} role="search">
            <Icon name="search" size={16} />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="गीत, कलाकार खोजें…"
              aria-label="Search songs and artists"
            />
          </form>

          <div className="nav__lang">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className="nav__burger"
            ref={burgerRef}
            onClick={() => setDrawerOpen((v) => !v)}
            aria-expanded={drawerOpen}
            aria-controls="nav-drawer"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon name={drawerOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            className="navdrawer__scrim"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <nav
            className="navdrawer"
            id="nav-drawer"
            ref={drawerRef}
            aria-label="Main"
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                const nodes = Array.from(
                  drawerRef.current?.querySelectorAll('a[href], button') || [],
                );
                if (!nodes.length) return;
                const first = nodes[0];
                const last = nodes[nodes.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <div className="navdrawer__head">
              <span className="navdrawer__brand">
                <img src="/icons/favicon.svg" alt="" width="30" height="30" />
                <span>
                  <b>छठ गीत</b>
                  <small>Chhath Geet</small>
                </span>
              </span>
              <button
                type="button"
                className="navdrawer__close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="x" size={18} />
              </button>
            </div>

            <form className="navdrawer__search" onSubmit={submit} role="search">
              <Icon name="search" size={16} />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="गीत, कलाकार खोजें…"
                aria-label="Search songs and artists"
              />
            </form>

            <div className="navdrawer__links">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `navdrawer__link ${isActive ? 'is-active' : ''}`
                  }
                >
                  <Icon name={l.icon} size={18} />
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="navdrawer__foot">
              <span className="navdrawer__label">{t('lang.label')}</span>
              <LanguageSwitcher />

              <button type="button" className="navdrawer__dev" onClick={openDev}>
                <Icon name="code" size={18} /> {t('nav.developer')}
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
