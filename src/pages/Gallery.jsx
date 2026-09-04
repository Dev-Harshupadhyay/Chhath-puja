import { useMemo, useState } from 'react';
import GalleryGrid from '../components/home/GalleryGrid';
import { galleryCategories, galleryItems } from '../data/gallery';

export default function Gallery() {
  const [cat, setCat] = useState('all');

  const items = useMemo(
    () => (cat === 'all' ? galleryItems : galleryItems.filter((i) => i.categories.includes(cat))),
    [cat],
  );

  return (
    <div className="shell">
      <header className="page-head">
        <span className="eyebrow">Ghat</span>
        <h1 className="deva">गैलरी</h1>
        <p>
          Chhath ki tasveerein — ghat, diyen, soop, bahangi aur Chhathi Maiya. Kisi bhi tasveer par
          tap karein, badi ho jayegi.
        </p>
      </header>

      <div className="chip-row" role="group" aria-label="Gallery categories">
        {galleryCategories.map((c) => (
          <button
            key={c.key}
            className="chip"
            aria-pressed={cat === c.key}
            onClick={() => setCat(c.key)}
          >
            <span className="deva">{c.label}</span>
            <span style={{ opacity: 0.6, fontSize: '0.72rem' }}>{c.englishLabel}</span>
          </button>
        ))}
      </div>

      <p style={{ margin: '10px 0 18px', fontSize: '0.82rem', color: 'var(--text-faint)' }}>
        {items.length} tasveerein
      </p>

      <GalleryGrid images={items} />
    </div>
  );
}
