/**
 * localStorage that never throws.
 * Private-mode Safari, quota limits and corrupt JSON are all
 * handled by falling back to the supplied default.
 */
const NS = 'chhath-geet:v1:';

export function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(NS + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const KEYS = {
  favorites: 'favorites',
  savedPlaylists: 'saved-playlists',
  favoriteArtists: 'favorite-artists',
  recent: 'recent',
  volume: 'volume',
  mood: 'mood',
  progress: 'progress',
  name: 'name',
  nameSkipped: 'name-skipped',
  language: 'language',
};
