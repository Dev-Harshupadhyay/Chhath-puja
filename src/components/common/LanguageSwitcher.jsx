import { useId } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LANGS } from '../../lib/translations';

/**
 * Segmented control: English | हिंदी | भोजपुरी
 *
 * The active chip is solid gold with dark ink; the inactive ones
 * are glass, so the active choice is obvious at a glance without
 * shouting. Switches are instant and never reload the player.
 */
export default function LanguageSwitcher({ id, className = '' }) {
  const { lang, setLang, t } = useLanguage();
  /* This control appears in three places at once (navbar, drawer,
     developer profile), so each instance gets its own id — duplicate
     ids break getElementById and assistive tech. */
  const autoId = useId();

  return (
    <div
      className={`langswitch ${className}`}
      role="group"
      aria-label={t('lang.label')}
      id={id || autoId}
    >
      {LANGS.map((l) => {
        const active = l.id === lang;
        return (
          <button
            key={l.id}
            type="button"
            className={`langswitch__chip ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            lang={l.id === 'bho' ? 'bh' : l.id}
            onClick={() => setLang(l.id)}
            title={t('lang.switch')}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
