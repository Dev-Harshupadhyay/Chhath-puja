/**
 * YouTube thumbnails — derived, never hand-typed.
 *
 * Every song in the library already carries its YouTube video id, so
 * artwork is generated from it at render time. No per-song thumbnail
 * URL is ever stored in the data files.
 *
 * Resolution ladder:
 *   1. img.youtube.com/vi/{ID}/maxresdefault.jpg   (1280×720 when available)
 *   2. i.ytimg.com/vi/{ID}/hqdefault.jpg           (always exists)
 *   3. a Chhath-themed painted fallback            (drawn in CSS)
 *
 * Not every video has a maxres image, so the component that uses these
 * walks the ladder on error — see <SongThumb>.
 */

/** Bare 11-character YouTube video id. */
const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/**
 * Pull the video id out of anything we might be handed: a bare id,
 * a watch URL, a youtu.be short link, an embed URL or a shorts URL.
 * Returns null when nothing sensible can be found.
 */
export function extractVideoId(input) {
  if (!input) return null;
  if (typeof input !== 'string') input = String(input);

  const value = input.trim();
  if (!value) return null;

  // Already a bare id — the common case, and the cheapest check.
  if (ID_RE.test(value)) return value;

  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return ID_RE.test(id) ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      // /watch?v=ID
      const v = url.searchParams.get('v');
      if (v && ID_RE.test(v)) return v;

      // /embed/ID, /shorts/ID, /v/ID, /live/ID
      const seg = url.pathname.split('/').filter(Boolean);
      const marker = seg.findIndex((s) => ['embed', 'shorts', 'v', 'live'].includes(s));
      if (marker !== -1 && ID_RE.test(seg[marker + 1] || '')) return seg[marker + 1];
    }
  } catch {
    /* not a parseable URL — fall through */
  }

  // Last resort: an 11-character id anywhere in the string.
  const loose = value.match(/[A-Za-z0-9_-]{11}/);
  return loose && ID_RE.test(loose[0]) ? loose[0] : null;
}

/** `https://img.youtube.com/vi/{ID}/maxresdefault.jpg` */
export const maxresUrl = (id) => (id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null);

/** `https://i.ytimg.com/vi/{ID}/hqdefault.jpg` — always present. */
export const hqUrl = (id) => (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);

/**
 * Ordered list of thumbnail sources for a song (or raw id / URL).
 * The caller tries them in order and falls through on error.
 */
export function thumbnailSources(songOrInput) {
  const id =
    typeof songOrInput === 'string'
      ? extractVideoId(songOrInput)
      : extractVideoId(songOrInput?.youtubeId ?? songOrInput?.url ?? songOrInput?.watchUrl);

  return id ? [maxresUrl(id), hqUrl(id)] : [];
}

/** Back-compat helper: the single best URL for a song. */
export function thumbFor(songOrInput, size = 'hq') {
  const [maxres, hq] = thumbnailSources(songOrInput);
  return size === 'max' ? maxres || hq : hq || maxres;
}
