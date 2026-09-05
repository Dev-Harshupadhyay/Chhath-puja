import { memo, useMemo } from 'react';

/**
 * Ambient Chhath atmosphere.
 *
 * Purely decorative, pointer-events:none, and built from transform +
 * opacity animations only, so it never triggers layout or paint work
 * on the main thread.
 *
 * Variants
 *   particles — floating golden light dust
 *   bokeh     — soft out-of-focus devotional lights
 *   diyas     — small floating diyas with a flickering flame
 *   water     — ghat water: ripples + a slow sun reflection
 *
 * Every variant scales its element count down on low-memory devices
 * and on narrow screens, and is switched off entirely by
 * prefers-reduced-motion (handled in CSS).
 */

/** Deterministic 0..1 so re-renders never shuffle the layout. */
const seeded = (n) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * How much ambience this device can afford, 0..1.
 * Weak phones get a fraction of the particles.
 */
function budgetFactor() {
  if (typeof navigator === 'undefined') return 1;
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const narrow = typeof window !== 'undefined' && window.innerWidth < 720;

  let factor = 1;
  if (mem <= 2 || cores <= 2) factor = 0.25;
  else if (mem <= 4 || cores <= 4) factor = 0.5;

  return narrow ? factor * 0.6 : factor;
}

function build(count, seed, map) {
  return Array.from({ length: count }, (_, i) => map(seeded(seed + i * 7.3), seeded(seed + i * 3.1 + 1), i));
}

function Atmosphere({ variant = 'particles', count = 14, seed = 1, className = '', ...rest }) {
  const items = useMemo(() => {
    const n = Math.max(2, Math.round(count * budgetFactor()));

    if (variant === 'particles') {
      return build(n, seed, (a, b, i) => ({
        left: `${(a * 100).toFixed(2)}%`,
        top: `${(b * 100).toFixed(2)}%`,
        size: `${(2 + a * 3).toFixed(1)}px`,
        delay: `${(b * 12).toFixed(2)}s`,
        dur: `${(14 + a * 16).toFixed(1)}s`,
        drift: `${(a > 0.5 ? 1 : -1) * (10 + b * 26).toFixed(1)}px`,
        opacity: (0.18 + b * 0.4).toFixed(2),
        key: i,
      }));
    }

    if (variant === 'bokeh') {
      return build(n, seed, (a, b, i) => ({
        left: `${(a * 100).toFixed(2)}%`,
        top: `${(20 + b * 70).toFixed(2)}%`,
        size: `${(28 + a * 90).toFixed(0)}px`,
        delay: `${(b * 16).toFixed(2)}s`,
        dur: `${(20 + a * 22).toFixed(1)}s`,
        drift: `${(a > 0.5 ? 1 : -1) * (14 + b * 30).toFixed(1)}px`,
        opacity: (0.05 + b * 0.09).toFixed(3),
        key: i,
      }));
    }

    if (variant === 'diyas') {
      return build(n, seed, (a, b, i) => ({
        left: `${(4 + a * 92).toFixed(2)}%`,
        bottom: `${(6 + b * 40).toFixed(1)}px`,
        size: `${(7 + a * 5).toFixed(1)}px`,
        delay: `${(b * 6).toFixed(2)}s`,
        dur: `${(5 + a * 2.5).toFixed(1)}s`,
        drift: `${(a > 0.5 ? 1 : -1) * (6 + b * 14).toFixed(1)}px`,
        opacity: (0.55 + b * 0.4).toFixed(2),
        key: i,
      }));
    }

    // water
    return build(n, seed, (a, b, i) => ({
      top: `${(10 + b * 80).toFixed(1)}%`,
      left: `${(a * 60).toFixed(1)}%`,
      width: `${(20 + a * 45).toFixed(0)}%`,
      delay: `${(b * 9).toFixed(2)}s`,
      dur: `${(9 + a * 9).toFixed(1)}s`,
      opacity: (0.15 + b * 0.3).toFixed(2),
      key: i,
    }));
  }, [variant, count, seed]);

  return (
    <span className={`atmo atmo--${variant} ${className}`} aria-hidden="true" {...rest}>
      {items.map((it) => (
        <span
          key={it.key}
          className="atmo__i"
          style={{
            '--a-left': it.left,
            '--a-top': it.top,
            '--a-bottom': it.bottom,
            '--a-size': it.size,
            '--a-width': it.width,
            '--a-delay': it.delay,
            '--a-dur': it.dur,
            '--a-drift': it.drift,
            '--a-opacity': it.opacity,
          }}
        />
      ))}
    </span>
  );
}

export default memo(Atmosphere);
