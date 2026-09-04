import LazyImage from '../common/LazyImage';
import { useUI } from '../../context/UIContext';

/** Masonry-ish grid: alternating tall/wide tiles create rhythm. */
export default function GalleryGrid({ images }) {
  const { openLightbox } = useUI();

  return (
    <div className="gallery">
      {images.map((item, i) => {
        const mod = i % 6;
        const span = mod === 0 ? 'gallery__item--tall' : mod === 3 ? 'gallery__item--wide' : '';
        return (
          <button
            key={item.src}
            className={`gallery__item ${span}`}
            onClick={() => openLightbox(item, images)}
            aria-label={`Open ${item.englishTitle}`}
          >
            <LazyImage src={item.src} alt={item.englishTitle} placeholder={item.placeholder} />
            <span className="gallery__cap">
              <b className="deva">{item.title}</b>
              <span>{item.englishTitle}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
