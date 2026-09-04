import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import SongCard from '../components/common/SongCard';
import SongRow from '../components/common/SongRow';
import EmptyState from '../components/common/EmptyState';
import { GridSkeleton, RowSkeleton } from '../components/common/Skeleton';
import { songs } from '../data/songs';
import { artists } from '../data/artists';
import { days } from '../data/days';
import { usePlayer } from '../context/PlayerContext';

const SORTS = [
  { key: 'popular', label: 'Most popular' },
  { key: 'title', label: 'Title (A–Z)' },
  { key: 'artist', label: 'Artist (A–Z)' },
  { key: 'longest', label: 'Longest' },
  { key: 'shortest', label: 'Shortest' },
];

const VIEWS = [
  { key: 'all', label: 'All geet' },
  { key: 'featured', label: 'Featured' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'recent', label: 'Recently played' },
];

const MOODS = [
  { key: 'morning', label: '🌅 सुबह' },
  { key: 'evening', label: '🌇 शाम' },
  { key: 'night', label: '🌙 रात' },
];

export default function Library() {
  const [params, setParams] = useSearchParams();
  const { favorites, recentSongs } = usePlayer();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState(params.get('view') ?? 'all');
  const [artist, setArtist] = useState('');
  const [mood, setMood] = useState('');
  const [day, setDay] = useState('');
  const [layout, setLayout] = useState('grid');
  const [ready, setReady] = useState(false);
  const inputRef = useRef(null);

  /* First paint shows skeletons for one frame so the grid never
     pops in half-formed on a slow phone. */
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* keep the URL in sync so search results are shareable */
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (view !== 'all') next.set('view', view);
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, view]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = songs;

    if (view === 'featured') list = list.filter((s) => s.featured);
    if (view === 'favorites') list = list.filter((s) => favorites.has(s.id));
    if (view === 'recent') {
      const order = new Map(recentSongs.map((s, i) => [s.id, i]));
      list = [...list].filter((s) => order.has(s.id)).sort((a, b) => order.get(a.id) - order.get(b.id));
    }
    if (artist) list = list.filter((s) => s.artist === artist);
    if (mood) list = list.filter((s) => s.moods.includes(mood));
    if (day) list = list.filter((s) => s.day === day);

    if (q) {
      list = list.filter((s) =>
        [s.title, s.hindiTitle, s.artist, s.channel].join(' ').toLowerCase().includes(q),
      );
    }

    const sorted = [...list];
    if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'artist') sorted.sort((a, b) => a.artist.localeCompare(b.artist));
    else if (sort === 'longest') sorted.sort((a, b) => b.seconds - a.seconds);
    else if (sort === 'shortest') sorted.sort((a, b) => a.seconds - b.seconds);
    else if (view !== 'recent')
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title));

    return sorted;
  }, [query, sort, view, artist, mood, day, favorites, recentSongs]);

  const hasFilters = Boolean(query.trim() || artist || mood || day || view !== 'all');

  const clearAll = () => {
    setQuery('');
    setArtist('');
    setMood('');
    setDay('');
    setView('all');
    inputRef.current?.focus();
  };

  return (
    <div className="shell">
      <header className="page-head">
        <span className="eyebrow">Library</span>
        <h1 className="deva">गीत पुस्तकालय</h1>
        <p>
          {songs.length} Chhath geet from {artists.length} artists — har geet official YouTube
          channel se. Search, filter aur sort ek hi jagah.
        </p>
      </header>

      <div className="toolbar">
        <div className="search" style={{ flex: '1 1 260px' }}>
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pawan Singh, Sharda Sinha, Uga Hai Suraj Dev…"
            aria-label="Search songs"
          />
          {query && (
            <button
              className="icon-btn"
              style={{ width: 32, height: 32 }}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <Icon name="x" size={15} />
            </button>
          )}
        </div>

        <select
          className="select"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          aria-label="Filter by artist"
        >
          <option value="">All artists</option>
          {artists.map((a) => (
            <option key={a.slug} value={a.name}>
              {a.name} ({a.songCount})
            </option>
          ))}
        </select>

        <select className="select" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Filter by Chhath day">
          <option value="">All days</option>
          {days.map((d) => (
            <option key={d.key} value={d.key}>
              {d.hindiName} · {d.name}
            </option>
          ))}
        </select>

        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort songs">
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="row" style={{ gap: 2 }}>
          <button
            className={`icon-btn ${layout === 'grid' ? 'icon-btn--on' : ''}`}
            onClick={() => setLayout('grid')}
            aria-pressed={layout === 'grid'}
            aria-label="Grid view"
          >
            <Icon name="grid" size={18} />
          </button>
          <button
            className={`icon-btn ${layout === 'list' ? 'icon-btn--on' : ''}`}
            onClick={() => setLayout('list')}
            aria-pressed={layout === 'list'}
            aria-label="List view"
          >
            <Icon name="list" size={18} />
          </button>
        </div>
      </div>

      <div className="chip-row" role="group" aria-label="Quick views">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            className="chip"
            aria-pressed={view === v.key}
            onClick={() => setView(v.key)}
          >
            {v.label}
          </button>
        ))}
        <span style={{ width: 8 }} />
        {MOODS.map((m) => (
          <button
            key={m.key}
            className="chip"
            aria-pressed={mood === m.key}
            onClick={() => setMood(mood === m.key ? '' : m.key)}
          >
            {m.label}
          </button>
        ))}
        {hasFilters && (
          <button className="chip" onClick={clearAll}>
            <Icon name="x" size={13} /> Clear
          </button>
        )}
      </div>

      <p style={{ margin: '10px 0 18px', fontSize: '0.82rem', color: 'var(--text-faint)' }}>
        {results.length} geet {query.trim() ? `matching “${query.trim()}”` : ''}
      </p>

      {!ready ? (
        layout === 'grid' ? (
          <GridSkeleton count={8} />
        ) : (
          <RowSkeleton count={8} />
        )
      ) : results.length === 0 ? (
        <EmptyState
          icon="search"
          title="कोई गीत नहीं मिला"
          body="Yeh combination ke saath koi geet nahi hai. Filter hata kar dobara koshish karein."
          action={
            <button className="btn btn--primary" onClick={clearAll}>
              Filters clear karein
            </button>
          }
        />
      ) : layout === 'grid' ? (
        <div className="grid">
          {results.map((song) => (
            <SongCard key={song.id} song={song} queue={results} />
          ))}
        </div>
      ) : (
        <div className="stack" style={{ gap: 2 }}>
          {results.map((song, i) => (
            <SongRow key={song.id} song={song} queue={results} position={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
