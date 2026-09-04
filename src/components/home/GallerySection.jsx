import SectionHeading from '../common/SectionHeading';
import GalleryGrid from './GalleryGrid';
import { galleryItems } from '../../data/gallery';

export default function GallerySection() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Ghat"
          hindi="गैलरी"
          title="Chhath through the lens"
          sub="Ghat, diyen, soop aur bahangi — Chhath ki tasveerein."
          to="/gallery"
        />
        <GalleryGrid images={galleryItems.slice(0, 6)} />
      </div>
    </section>
  );
}
