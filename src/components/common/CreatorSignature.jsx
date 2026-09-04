import { useLanguage } from '../../context/LanguageContext';

/** The creator's live portfolio — the one place his work lives. */
const PORTFOLIO_URL = 'https://new-profotilo-flame.vercel.app';

/**
 * One signature, used by both the footer credits and the developer
 * profile, so the two never drift into competing identities.
 *
 * "HARSH" is the creator's name — it is never translated and never
 * replaced by anything generated. The whole "Made by HARSH" line is
 * a single link to his portfolio: one obvious target, big enough to
 * tap, with a slow gold glow so it reads as special but not shouty.
 */
export default function CreatorSignature({ className = '' }) {
  const { t } = useLanguage();

  return (
    <div className={`signature ${className}`}>
      <span className="signature__line">{t('sig.madeWith')}</span>

      <a
        className="signature__link"
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={t('sig.portfolioTitle')}
      >
        <span className="signature__glow" aria-hidden="true" />
        <span className="signature__by">
          {t('sig.madeBy')}{' '}
          <b className="signature__name" data-text="HARSH">
            HARSH
          </b>
        </span>
      </a>
    </div>
  );
}
