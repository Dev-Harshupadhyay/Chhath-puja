/**
 * Single inline-SVG icon set (Lucide geometry, 24×24 grid).
 * Inline rather than an icon package: zero extra requests,
 * zero CLS, and every glyph inherits currentColor.
 */
const P = {
  play: 'M6 4.5v15l13-7.5z',
  pause: 'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z',
  prev: 'M7 5v14M19 5.6v12.8L9.5 12z',
  next: 'M17 5v14M5 5.6v12.8L14.5 12z',
  heart: 'M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 6.9l-1.4-1.3a5.2 5.2 0 1 0-7.4 7.4L12 21.6l8.8-8.6a5.2 5.2 0 0 0 0-7.4z',
  queue: 'M3 6h13M3 12h13M3 18h9M17 13.5v6M20.5 16.5h-7',
  volume: 'M11 4.5v15l-4.5-4H3V8.5h3.5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13',
  mute: 'M11 4.5v15l-4.5-4H3V8.5h3.5zM16 9.5l5 5M21 9.5l-5 5',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.6-4.6',
  home: 'M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1h-5v-6H9.5v6h-5a1 1 0 0 1-1-1z',
  music: 'M9 18V5.5l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 15.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
  mic: 'M12 3.5a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0v-4a3 3 0 0 1 3-3zM5.5 10.5a6.5 6.5 0 0 0 13 0M12 17v3.5M8.5 20.5h7',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  x: 'M6 6l12 12M18 6L6 18',
  down: 'M6 9.5l6 6 6-6',
  up: 'M6 14.5l6-6 6 6',
  left: 'M14.5 6l-6 6 6 6',
  right: 'M9.5 6l6 6-6 6',
  share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3.5M8 7l4-3.5L16 7',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  plus: 'M12 5v14M5 12h14',
  check: 'M4.5 12.5l5 5 10-11',
  shuffle: 'M16 3.5h5v5M4 20l17-13M21 16v4.5h-5M15 15l6 6M4 4l5 5',
  trash: 'M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3.5 2',
  sun: 'M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  sunrise: 'M12 21V9M7 13l5-5 5 5M3.5 17.5h17M6.5 21h11M5.5 8.5 4 7M18.5 8.5 20 7M12 5.5V3M8.5 6 7.5 4.5M15.5 6l1-1.5',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  grip: 'M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
  calendar: 'M7 3v3M17 3v3M4.5 8.5h15M5.5 5.5h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1z',
  image: 'M4.5 5.5h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zM8.5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM20 15.5l-5-5L5.5 19.5',
  youtube:
    'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15.2V8.8l5.2 3.2z',
  repeat: 'M17 2.5l3.5 3.5L17 9.5M3 12V11a4 4 0 0 1 4-4h13.5M7 21.5L3.5 18 7 14.5M21 12v1a4 4 0 0 1-4 4H3.5',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  code: 'M9 18l-6-6 6-6M15 6l6 6-6 6',
  filter: 'M4 5.5h16l-6.2 7.4V19L10.2 17v-4.1z',
  sort: 'M4 6.5h10M4 12h7M4 17.5h4M17 9v10M14 16l3 3 3-3',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 7.8h.01',
  flame: 'M12 21c3.6 0 6-2.4 6-5.6 0-4-3.2-5.4-3.2-9.4-2 .9-3.4 3-3.4 5 0 1.3-.6 2-1.5 2-1 0-1.6-.8-1.6-2C7 12.4 6 13.6 6 15.4 6 18.6 8.4 21 12 21z',
  lotus: 'M12 20c-4.4 0-8-2.6-8-5.8C7 14.2 9.4 15 12 15s5-.8 8-1c0 3.2-3.6 5.8-8 5.8zM12 15c0-4 2-7.5 5-9 .5 3.5-1.2 6.8-3.2 8.4M12 15c0-4-2-7.5-5-9-.5 3.5 1.2 6.8 3.2 8.4M12 15V5.5',
};

export default function Icon({ name, size = 20, filled = false, strokeWidth = 1.8, ...rest }) {
  const d = P[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
