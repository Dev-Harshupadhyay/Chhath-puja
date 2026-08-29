# छठ गीत गाथा — Chhath Devotional Songs & Bhakti

A premium, original React + Vite website for a Chhath Puja devotional music
platform — inspired by the *feel* of a spiritual sunrise/river/ghat
experience, built from scratch with original UI, styling, and code (not a
clone of any existing site).

## Tech stack

- React 18 + Vite (JavaScript only, no TypeScript)
- Plain CSS3 (custom design tokens, no CSS framework)
- `localStorage` for favorites and recently-played history
- YouTube iframe embeds for playback (no scraping/downloading)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## Project structure

```
chhath-devotional/
├── public/
│   ├── images/        # SVG gallery art + song thumbnail placeholders
│   └── icons/         # favicon
├── src/
│   ├── components/    # Navbar, Hero, DayTimeline, SongCard, SongGrid,
│   │                  # MusicPlayer, Playlist, SearchBar, CategoryFilter,
│   │                  # Gallery, AboutChhath, Footer
│   ├── data/songs.js  # Song data model (24 sample songs)
│   ├── hooks/useLocalStorage.js
│   ├── App.jsx        # Global state + page composition
│   ├── main.jsx
│   └── index.css      # Design tokens, layout, animations
├── index.html
└── package.json
```

## Important: replace placeholder YouTube IDs

Every song in `src/data/songs.js` has a placeholder `youtubeId` value like
`"PLACEHOLDER_ID_01"`. These are **not real video IDs**. Before deploying,
replace each one with the real ID of a publicly available, appropriately
licensed YouTube video (the part after `v=` in a YouTube URL), e.g.:

```js
youtubeId: 'dQw4w9WgXcQ', // https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

The site only ever uses the standard public embed URL format
(`https://www.youtube.com/embed/VIDEO_ID`) — no scraping, downloading, ad
bypass, or DRM circumvention of any kind.

## Placeholder artwork

All gallery and thumbnail images in `public/images/` are original,
locally-generated SVG placeholders (no external/copyrighted photos are
hotlinked). Swap them for licensed photography or original artwork whenever
you have rights to real Chhath Puja imagery.

## Features implemented

- Responsive sticky navbar (desktop + mobile menu)
- Full-width hero with sunrise/river visual treatment, floating particles,
  and `prefers-reduced-motion` support
- Interactive 4-day Chhath timeline (नहाय-खाय, खरना, संध्या अर्घ्य, उषा अर्घ्य)
  that filters the song library by day
- Featured songs section
- Full song library with live search (title/artist/category/day) and
  category filter chips, plus a polished "कोई गीत नहीं मिला" empty state
- Floating music player with play/pause/next/previous, an expandable panel
  with the YouTube embed and playlist, and a minimize/close control
- Favorites (❤) and Recently Played (last 10), both persisted to
  `localStorage` with no login required
- Devotional gallery section (8 original SVG illustrations)
- About Chhath section with real informational copy (not lorem ipsum)
- Footer with navigation, social placeholders, and a clear YouTube
  rights/attribution disclaimer
- Semantic HTML, ARIA labels, visible focus states, alt text throughout

## Notes / next steps for a real deployment

- Swap placeholder YouTube IDs and SVG artwork as described above
- Expand `src/data/songs.js` beyond the 24 sample entries — the shape is
  designed to scale to 100+ songs with no code changes
- Artist names in the sample data are generic/illustrative, not official
  attributions — replace with correct credits before publishing
