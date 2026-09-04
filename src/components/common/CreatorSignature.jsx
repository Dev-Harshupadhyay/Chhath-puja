import { useLanguage } from '../../context/LanguageContext';

/**
 * One signature, used by both the footer credits and the developer
 * profile, so the two never drift into competing identities.
 *
 * "HARSH" is the creator's name — it is never translated and never
 * replaced by anything generated.
 */
export default function CreatorSignature({ className = '' }) {
  const { t } = useLanguage();

  return (
    <div className={`signature ${className}`}>
      <span className="signature__line">{t('sig.madeWith')}</span>
      <span className="signature__by">
        {t('sig.madeBy')}{' '}
        <b className="signature__name" data-text="HARSH">
          HARSH
        </b>
      </span>
    </div>
  );
}
