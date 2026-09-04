import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../Icon';
import { useUI } from '../../context/UIContext';
import { useLanguage } from '../../context/LanguageContext';

const ITEMS = [
  { to: '/', icon: 'home', label: 'Home', end: true },
  { to: '/library', icon: 'music', label: 'Songs' },
  { to: '/artists', icon: 'mic', label: 'Artists' },
  { to: '/favorites', icon: 'heart', label: 'Favorites' },
];

const MORE = [
  { to: '/playlists', icon: 'list', label: 'Playlists' },
  { to: '/four-days', icon: 'calendar', label: 'Four Days' },
  { to: '/gallery', icon: 'image', label: 'Gallery' },
];

/** Mobile-only tab bar. The player sits directly above it. */
export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { openDeveloper } = useUI();
  const { t } = useLanguage();

  /* "More" rows share one shape so the creator item reads as a
     quiet credit rather than competing with the music tabs. */
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    padding: '0 12px',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.9rem',
  };

  return (
    <>
      {moreOpen && (
        <>
          <div
            className="queue-scrim"
            style={{ zIndex: 68 }}
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />
          <div
            className="menu"
            role="menu"
            aria-label="More sections"
            style={{
              left: 12,
              right: 12,
              bottom: 'calc(var(--bottomnav-h) + var(--safe-b) + 10px)',
              zIndex: 69,
              animation: 'slide-in-up .28s var(--ease)',
            }}
          >
            {MORE.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                onClick={() => setMoreOpen(false)}
                role="menuitem"
                style={rowStyle}
              >
                <Icon name={m.icon} size={18} /> {m.label}
              </NavLink>
            ))}

            <div className="menu__divider" role="separator" aria-hidden="true" />

            <button
              type="button"
              role="menuitem"
              className="menu__dev"
              style={{ ...rowStyle, width: '100%', textAlign: 'left', color: 'var(--text-muted)' }}
              onClick={() => {
                setMoreOpen(false);
                openDeveloper();
              }}
            >
              <Icon name="code" size={18} /> {t('nav.developer')}
            </button>
          </div>
        </>
      )}

      <nav className="bottomnav" aria-label="Primary">
        {ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => `bottomnav__item ${isActive ? 'is-active' : ''}`}
          >
            <Icon name={it.icon} size={22} />
            {it.label}
          </NavLink>
        ))}
        <button
          className="bottomnav__item"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          aria-label="More sections"
        >
          <Icon name="more" size={22} />
          More
        </button>
      </nav>
    </>
  );
}
