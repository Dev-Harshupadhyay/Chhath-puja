/** 94 -> "1:34" */
export function fmtTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

/** "5:39" -> 339 (falls back to null when unknown) */
export function parseDuration(value) {
  if (!value) return null;
  const parts = String(value).split(':').map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** 37 songs, 1,234 plays -> locale grouped strings */
export const fmtCount = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0);

/** "15 Nov" */
export const fmtDayMonth = (date) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date);

/** "Sunday" */
export const fmtWeekday = (date) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(date);

/** Plain-text share body for a song */
export const shareText = (song) =>
  `${song.title}${song.hindiTitle ? ` (${song.hindiTitle})` : ''} — ${song.artist} · छठ गीत`;

export const shareUrl = (song) => `https://www.youtube.com/watch?v=${song.youtubeId}`;
