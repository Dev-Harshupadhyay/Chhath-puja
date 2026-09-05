import { memo, useState } from 'react';
import Icon from '../Icon';
import { thumbnailSources } from '../../lib/thumb';

/**
 * Premium 16:9 YouTube thumbnail.
 *
 * The video id is derived from the song data — no thumbnail URL is
 * ever stored per song. maxresdefault is attempted first and the
 * component silently steps down to hqdefault if that image is
 * missing, then to a painted Chhath fallback if YouTube serves
 * nothing at all.
 *
 * Loading is lazy, the box holds its exact aspect ratio so nothing
 * shifts as images arrive, and a shimmer sits underneath until the
 * image decodes.
 */
function SongThumb({
  song,
  alt = '',
  size = 'max',
  className = '',
  eager = false,
  children,
}) {
  const sources = thumbnailSources(song);
  const [step, setStep] = useState(0); // index into sources, or 2 = fell through
  const [loaded, setLoaded] = useState(false);

  const src = size === 'hq' ? sources[1] || sources[0] : sources[step];
  const failed = step >= sources.length || !src;

  return (
    <span
      className={`songthumb ${loaded || failed ? 'is-loaded' : ''} ${failed ? 'is-fallback' : ''} ${className}`}
    >
      {!failed && (
        <img
          className="songthumb__img"
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={eager ? 'high' : undefined}
          onLoad={() => setLoaded(true)}
          onError={() => setStep((s) => s + 1)}
        />
      )}

      {failed && (
        <span className="songthumb__fallback" aria-hidden="true">
          <Icon name="sun" size={22} />
        </span>
      )}

      {/* content passed in (scrim, duration, play button) rides on top */}
      {children}
    </span>
  );
}

export default memo(SongThumb);
