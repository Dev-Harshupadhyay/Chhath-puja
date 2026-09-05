import { useEffect, useRef } from 'react';

/**
 * Scroll reveal — one shared IntersectionObserver for the whole app.
 *
 * Elements fade / rise / de-blur as they enter the viewport, once.
 * Children can be staggered by passing an `index`, which becomes a
 * CSS custom property the stylesheet turns into a transition-delay.
 *
 * A single observer instance is reused for every element, so a long
 * page with hundreds of cards still costs one observer and no
 * scroll handlers at all.
 */

let sharedObserver = null;

function getObserver() {
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        sharedObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
  );

  return sharedObserver;
}

export default function Reveal({
  as: Tag = 'div',
  variant = 'rise',
  index = 0,
  delay,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }

    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${className}`}
      style={{
        '--reveal-i': index,
        ...(delay != null ? { '--reveal-delay': `${delay}ms` } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
