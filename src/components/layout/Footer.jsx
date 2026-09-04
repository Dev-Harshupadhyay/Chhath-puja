import { Link } from 'react-router-dom';
import Icon from '../Icon';
import CreatorSignature from '../common/CreatorSignature';

const COLS = [
  {
    title: 'Listen',
    links: [
      { to: '/library', label: 'Songs' },
      { to: '/artists', label: 'Artists' },
      { to: '/playlists', label: 'Playlists' },
    ],
  },
  {
    title: 'Chhath',
    links: [
      { to: '/four-days', label: 'Four Days' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/favorites', label: 'Favorites' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div className="footer__brand">
            <b className="deva">छठ गीत</b>
            <p className="deva">“सूर्य देव की आराधना और लोकगीतों को समर्पित।”</p>
            <p style={{ fontSize: '0.8rem', marginTop: 8 }}>
              Devotional songs for the sacred festival of Chhath.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <div className="footer__links">
                {col.links.map((l) => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer__note">
          <span className="footer__yt">
            <Icon name="youtube" size={15} />
            <span className="deva">सभी गीत आधिकारिक YouTube स्रोतों के माध्यम से चलाए जाते हैं।</span>
          </span>
          <span className="footer__made">
            <CreatorSignature />
          </span>
        </div>
      </div>
    </footer>
  );
}
