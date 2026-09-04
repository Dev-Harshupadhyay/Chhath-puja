import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';
import LazyImage from './LazyImage';
import { useUI, useEscape } from '../../context/UIContext';

/** Fullscreen gallery viewer with focus trap + arrow navigation. */
export default function Lightbox() {
  const { lightbox, closeLightbox, openLightbox } = useUI();
  const closeRef = useRef(null);

  useEscape(Boolean(lightbox), closeLightbox);

  useEffect(() => {
    if (!lightbox) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (!lightbox.list.length) return;
      const i = lightbox.list.findIndex((x) => x.src === lightbox.item.src);
      if (e.key === 'ArrowRight') {
        openLightbox(lightbox.list[(i + 1) % lightbox.list.length], lightbox.list);
      } else if (e.key === 'ArrowLeft') {
        openLightbox(
          lightbox.list[(i - 1 + lightbox.list.length) % lightbox.list.length],
          lightbox.list,
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, openLightbox, closeLightbox]);

  if (!lightbox) return null;
  const { item } = lightbox;

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.englishTitle}
      onClick={(e) => e.target === e.currentTarget && closeLightbox()}
    >
      <button
        className="icon-btn lightbox__close"
        onClick={closeLightbox}
        ref={closeRef}
        aria-label="Close"
      >
        <Icon name="x" size={22} />
      </button>

      <figure className="lightbox__fig">
        <LazyImage src={item.src} alt={item.englishTitle} placeholder={item.placeholder} eager />
        <figcaption className="lightbox__cap">
          <b className="deva">{item.title}</b>
          <p className="deva">{item.caption}</p>
          <p style={{ fontSize: '0.78rem', opacity: 0.6 }}>{item.englishCaption}</p>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
