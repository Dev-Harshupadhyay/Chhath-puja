<div align="center">

<img src="./docs/banner.jpg" alt="Chhath Geet — devotees offering arghya to the rising sun at a river ghat" width="100%" />

<br />

# छठ गीत · Chhath Geet

**“सूर्य देव की आराधना, लोकगीतों की मिठास।”**
_Devotional songs for the sacred festival of Chhath._

<br />

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=20232a)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=flat-square&logo=javascript&logoColor=20232a)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Router](https://img.shields.io/badge/React_Router-6.30-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4?style=flat-square)](https://github.com/Dev-Harshupadhyay/Chhath-puja/pulls)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDev-Harshupadhyay%2FChhath-puja)

</div>

---

## What this is

Chhath Geet is a listening app for the folk songs of **Chhath** — the four-day festival of the Sun
observed across Bihar, Jharkhand, eastern Uttar Pradesh and the Nepal Terai.

It is built around one idea: **make the real songs easy to find and beautiful to play.**

- 🎵 **106 Chhath geet** from **37 artists** — every one verified embeddable and playable
- 🪔 A first-visit **“Chhathi Maiya calls you”** greeting, remembered on-device
- 🎧 A persistent, app-grade player with queue, favourites and resume
- 📅 The **four days of Chhath** as an interactive ritual guide
- 📜 **12 curated playlists**, one for every hour of the festival
- 🖼️ A Chhath **gallery** with lightbox and categories
- 🌅 **Morning / Evening / Night** moods that repaint the whole interface

<div align="center">
  <img src="./public/images/hero-madhubani.jpg" alt="Chhathi Maiya" width="32%" />
  <img src="./public/images/ghat-usha-argh.jpg" alt="The ghat at Usha Arghya" width="32%" />
  <img src="./public/images/sandhya-diya.jpg" alt="Diyas at the ghat" width="32%" />
</div>

---

## Features

### Player
- Sticky bar driven by the **YouTube IFrame API** — real play/pause/seek/duration/volume, not a
  passive `<iframe>`
- Expanded full-screen **now playing** screen with large artwork, share and queue
- **Queue drawer** with drag reorder, keyboard reorder (arrow keys), remove and clear
- Favourites, shuffle, **repeat (off / all / one)**, and **resume from where you stopped**
- Compact **mini-player** on mobile that expands on tap
- **Media Session** integration — lock-screen artwork and hardware play/pause/next keys
- **Keyboard shortcuts**: `Space`/`K` play-pause, `←`/`→` seek 10s, `↑`/`↓` volume, `N`/`P` track, `M` mute
- Play requests are **never dropped**: tap play before the API finishes loading and the
  request is queued, then fired the moment the player is ready
- If a video stalls or is blocked, the player says so and offers **retry** or **open on YouTube**

### Discovery
- Instant **search** across title, Hindi title, artist and channel
  (`Pawan Singh`, `Sharda Sinha`, `Uga Hai Suraj Dev`, `Chhathi Maiya`)
- **Sort** by popularity, title, artist, length
- **Filters** by artist, mood and Chhath day
- Grid and list layouts, skeleton loaders, real empty states

### Culture
- Cinematic hero — layered sunrise, haze and water with six GPU-only diyas
- **The Four Days**: Nahay Khay, Kharna, Sandhya Arghya, Usha Arghya — each with ritual, meaning,
  practices, prasad and its own songs
- Artist pages with play-all and follow
- Festival countdown driven by the real Chhath calendar (2025–2028)

### Personal
- On a first visit the site asks **“What should we call you?”** and greets you with
  *जय छठी मैया, {name}* — stored in `localStorage` only, never sent anywhere
- Skippable, and changeable at any time from the hero

### Foundation
- 44px touch targets, ARIA on every icon-only control, keyboard-operable sliders
- Focus trap and <kbd>Esc</kbd> on all sheets, skip link, `aria-live` toasts
- `prefers-reduced-motion` honoured throughout
- Hindi + English SEO: Open Graph, Twitter cards, JSON-LD, sitemap, PWA manifest

---

## Tech stack

| Layer | Choice |
|---|---|
| Build tool | **Vite 5.4** |
| UI | **React 18.3** |
| Routing | **react-router-dom 6.30** (client-side, code-split) |
| Styling | **Hand-built CSS design tokens** — no framework, no template |
| State | React Context (State / Actions / Progress split) |
| Persistence | `localStorage` |
| Playback | **YouTube IFrame Player API** (official embed) |
| Backend | **None** — pure static SPA |
| Secrets | **Zero** — no API keys, no `.env` |

Only four runtime packages. Total JS ships at **~92 KB gzipped**.

---

## Quick start

```bash
git clone https://github.com/Dev-Harshupadhyay/Chhath-puja.git
cd Chhath-puja
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

Requires **Node 18+**.

---

## Project structure

```
src/
├── data/          # songs · artists · days · playlists · gallery   (real data)
├── lib/           # format · storage · festival dates · YouTube API loader
├── context/       # PlayerProvider (transport + queue + favourites) · UIProvider
├── hooks/         # useReveal · useMediaQuery · useBodyScrollLock
├── components/
│   ├── layout/    # Navbar · BottomNav · Footer · Layout · Toast
│   ├── player/    # StickyPlayer · ExpandedPlayer · QueueDrawer
│   ├── home/      # Hero · MoodSection · FourDays · Gallery · About…
│   ├── common/    # SongCard · SongRow · SongMenu · Slider · Lightbox · Skeleton
│   └── Icon.jsx   # one inline SVG set — zero extra requests
├── pages/         # Home · Library · Artists · Playlists · FourDays ·
│                  # Gallery · Favorites · NotFound
└── styles/        # tokens · base · components · player
```

### Why three player contexts

`PlayerProvider` splits state into **State**, **Actions** and **Progress**. The progress context
ticks four times a second; keeping it separate stops a moving seek bar from re-rendering the entire
37-song library on every tick.

---

## Data integrity

Every song is real. Nothing is invented.

| Field | Source |
|---|---|
| `youtubeId` | Official video id — every one checked with YouTube's oEmbed endpoint (**embeddable**) and the watch page (**playable**) |
| `seconds` | Real runtime read from each video's `lengthSeconds` |
| `artist` / `channel` | As published on the official upload |
| `title` / `hindiTitle` | Catalogue metadata, carried over unedited |
| `day` | Which of the four days the geet belongs to |
| `moods` | **Curation, not metadata** — maps a song's Chhath day onto the Morning / Evening / Night modes |

The catalogue has two halves, both real:

1. **Curated (first 37)** — carried over from the live Chhath Geet catalogue, with artist,
   channel and ritual-day metadata.
2. **Harvested (the rest)** — found through YouTube search for Chhath geet, then individually
   verified for embeddability and playability before being written to `src/data/songs.js`.
   Artist attribution only ever uses a full-name match from the video title or channel; when no
   artist is named it falls back to the publishing channel, which is displayed too.

Where data genuinely does not exist, the UI says so instead of guessing — the player shows
**“Lyrics unavailable”** rather than fabricating words, and artist pages show no biography because
none was sourced.

No audio is downloaded or hosted. Playback is the **official YouTube embed**, so no API key is
needed and there is no secret to leak.

---

## Performance

| | |
|---|---|
| `public/images` | **14.7 MB → 1.8 MB** (right-sized progressive JPEGs) |
| Image loading | Lazy + inline blur placeholders, no layout shift |
| JS | Route-level code splitting, vendor chunk cached separately (~95 KB gzipped) |
| Animation | Transform/opacity only — the six hero diyas cost nothing |
| Motion | `prefers-reduced-motion` disables all of it |

---

## Deployment

`vercel.json` is committed, so Vercel picks up everything automatically:

| Setting | Value |
|---|---|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | **none** |

The catch-all rewrite is required — without it, refreshing `/library` or `/four-days/kharna`
returns a 404 on a static host.

<details>
<summary>Deploying somewhere else?</summary>

**GitHub Pages** — add a `404.html` copy of `index.html`, or use `HashRouter`.
**Netlify** — add `_redirects` containing `/* /index.html 200`.
**Any static host** — serve `dist/` and route all unknown paths to `index.html`.

</details>

---

## Roadmap

- [ ] Lyrics support (only once real, sourced lyrics exist)
- [ ] Offline-capable service worker
- [ ] Share-a-playlist links
- [ ] Festival reminder notifications
- [ ] Artist photos and bios (sourced, never generated)

---

## Contributing

Issues and pull requests are welcome. Please keep the data rules intact: **never add a song,
artist, duration or link you have not verified.**

```bash
npm run dev     # develop
npm run build   # verify the production build before opening a PR
```

---

## Credits

Built and maintained by **Harsh Upadhyay**.
All songs remain the property of their respective artists, labels and YouTube channels — this
project streams them through official embeds and claims no ownership.

---

<div align="center">

Made with ❤️ for Chhath Puja · Made by Harsh

[github.com/Dev-Harshupadhyay](https://github.com/Dev-Harshupadhyay)

</div>
