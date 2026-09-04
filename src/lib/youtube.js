/**
 * YouTube IFrame Player API loader.
 *
 * We never download or host audio — playback is the official
 * YouTube embed, driven through the IFrame API so the app gets
 * real play/pause/seek/duration/volume control instead of a
 * dumb <iframe>. One script, one shared player instance.
 */

const API_SRC = 'https://www.youtube.com/iframe_api';
let apiPromise = null;

export function loadYouTubeApi() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      resolve(window.YT);
    };
    const tag = document.createElement('script');
    tag.src = API_SRC;
    tag.async = true;
    tag.onerror = () => reject(new Error('YouTube IFrame API failed to load'));
    document.head.appendChild(tag);
  });

  return apiPromise;
}
