import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from '../Icon';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/library', label: 'Songs' },
  { to: '/artists', label: 'Artists' },
  { to: '/playlists', label: 'Playlists' },
  { to: '/four-days', label: 'Four Days' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/favorites', label: 'Favorites' },
];

export default function Navbar() {
  const [stuck, setStuck] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/library?q=${encodeURIComponent(q.trim())}` : '/library');
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
        </div>
      </div>
    </header>
  );
}
