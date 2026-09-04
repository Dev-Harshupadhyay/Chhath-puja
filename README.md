# छठ गीत · Chhath Geet

A premium Chhath Puja devotional music experience — Spotify-grade playback
interaction, Indian devotional cultural identity, and Chhath ghat visual
storytelling.

**Live:** https://chhathgeetsong.lovable.app

---

## What this is

Chhath Geet is a listening app for the folk songs of Chhath — the four-day
festival of the Sun observed across Bihar, Jharkhand, eastern UP and the Nepal
Terai. It is built around one idea: **make the real songs easy to find and
beautiful to play.**

- 37 Chhath geet from 15 artists
- 9 curated playlists, one for every hour of the festival
- The four days of Chhath as an interactive ritual guide
- A persistent, app-grade player with queue, favourites and resume

## Data integrity

Every song is real. Nothing is invented.

| Field | Source |
| --- | --- |
| `youtubeId` | Official video id, **verified playable** against YouTube |
| `seconds` | Real runtime read from the video's `lengthSeconds` |
| `artist` / `channel` | As published on the official upload |
| `title` / `hindiTitle` | Catalogue metadata, carried over unedited |
| `day` | Which of the four days the geet belongs to |
| `moods` | **Curation, not metadata** — maps a song's Chhath day onto the Morning / Evening / Night listening modes |

Where data genuinely does not exist, the UI says so instead of guessing —
for example the player shows **“Lyrics unavailable”** rather than fabricating
words, and artist pages show no biography because none was sourced.

No audio is downloaded or hosted. Playback is the **official YouTube embed**,
driven through the IFrame Player API so the app gets true play/pause/seek/
duration/volume control rather than a passive `<iframe>`. There is no YouTube
Data API key in this codebase — nothing secret to leak.

## Stack

- React 18 + Vite (JavaScript, no TypeScript)
- `react-router-dom` v6, route-level code splitting
- Plain CSS with a design-token layer (no framework, no template)
- `localStorage` for favourites, saved playlists, recent, mood and volume

No CSS framework. The design system in `src/styles/tokens.css` is hand-built
around a Chhath ghat palette: sindoor, saffron, muted gold, parchment, deep
brown, and the indigo that comes just before the sun clears the river.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Architecture

```
src/
├── data/          songs · artists · days · playlists · gallery  (real data)
├── lib/           format · storage · festival dates · YouTube API loader
├── context/       PlayerProvider (transport + queue + favourites) · UIProvider
├── hooks/         useReveal · useMediaQuery · useBodyScrollLock
├── components/
│   ├── layout/    Navbar · BottomNav · Footer · Layout · Toast
│   ├── player/    StickyPlayer · ExpandedPlayer · QueueDrawer
│   ├── home/      Hero · MoodSection · FourDays · Gallery · About…
│   ├── common/    SongCard · SongRow · SongMenu · Slider · Lightbox · Skeleton
│   └── Icon.jsx   one inline SVG set, zero extra requests
├── pages/         Home · Library · Artists · Playlists · FourDays ·
│                  Gallery · Favorites · NotFound
└── styles/        tokens · base · components · player
```

### Why three player contexts

`PlayerProvider` splits state into **State**, **Actions** and **Progress**.
The progress context ticks four times a second; keeping it separate stops a
moving seek bar from re-rendering the entire 37-song library on every tick.

## Performance

- Images right-sized to 1400px progressive JPEG with inline blur placeholders
  (the original `public/images` was **14.7 MB → 1.8 MB**)
- Route-level code splitting; vendor chunk cached separately
- Lazy-loaded artwork, skeleton loading states, shimmer placeholders
- Animations are transform/opacity only; the hero's six diyas cost nothing
- `prefers-reduced-motion` is honoured everywhere

## Accessibility

- 44px minimum touch targets, keyboard-reachable sliders (arrows, Home/End)
- Visible focus rings, semantic landmarks, ARIA on all icon-only controls
- Skip link, `aria-pressed` toggles, `aria-live` toasts
- Lightbox and sheets trap focus and close on `Escape`

---

Made with ❤️ for Chhath Puja · Made by Harsh
