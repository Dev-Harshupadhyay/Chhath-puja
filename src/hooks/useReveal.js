import { useEffect, useRef } from 'react';

/**
 * Adds `.is-in` when an element scrolls into view (once).
 * Respects prefers-reduced-motion by revealing immediately.
 */
export function useReveal(options) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px', ...options },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return ref;
}
