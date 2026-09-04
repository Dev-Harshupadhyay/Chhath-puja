import { Link } from 'react-router-dom';

export default function SectionHeading({ eyebrow, title, hindi, sub, to, linkLabel = 'सभी देखें' }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section-title">
          {hindi ? (
            <>
              <span className="deva">{hindi}</span>
              {title ? <span className="deva-none"> · {title}</span> : null}
            </>
          ) : (
            title
          )}
        </h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {to && (
        <Link className="see-all" to={to} aria-label={linkLabel}>
          {linkLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9.5 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
