import { memo, useState } from 'react';

/**
 * Image with an inline blur placeholder, native lazy-loading and
 * async decoding. Fades in on load so there is never a hard pop.
 */
const LazyImage = memo(function LazyImage({
  src,
  alt = '',
  placeholder,
  className,
  eager = false,
  sizes,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      sizes={sizes}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      style={{
        backgroundImage: placeholder ? `url(${placeholder})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: loaded ? 1 : 0,
        transition: 'opacity .5s cubic-bezier(.16,1,.32,1)',
        ...rest.style,
      }}
      {...rest}
    />
  );
});

export default LazyImage;
