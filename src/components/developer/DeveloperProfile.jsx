import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';
import LanguageSwitcher from '../common/LanguageSwitcher';
import CreatorSignature from '../common/CreatorSignature';
import { useLanguage } from '../../context/LanguageContext';
import { useUI } from '../../context/UIContext';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

/** Swipe-down-to-close threshold, in pixels. */
const SWIPE_CLOSE_PX = 90;

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Premium developer profile.
 *
 * A creator card for the person who built Chhath Geet — not an
 * "About" page. Everything here is information the creator supplied;
 * nothing is invented (no age, location, education, contacts or
 * social profiles).
 *
 * Opens as a centred dialog on desktop and a bottom sheet on mobile,
 * with scroll lock, Escape, focus trap and swipe-to-dismiss.
 */
export default function DeveloperProfile() {
  const { developerOpen, closeDeveloper } = useUI();
  const { t, lang } = useLanguage();

  const cardRef = useRef(null);
  const bodyRef = useRef(null);
  const closeRef = useRef(null);
  const restoreRef = useRef(null);
  const touchStartY = useRef(null);

  useBodyScrollLock(developerOpen);

  /* Escape to close — same hook every other sheet in the app uses. */
  useEffect(() => {
    if (!developerOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDeveloper();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [developerOpen, closeDeveloper]);

  /* Move focus in on open, put it back where it came from on close. */
  useEffect(() => {
    if (!developerOpen) return;
    restoreRef.current = document.activeElement;
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      clearTimeout(id);
      const prev = restoreRef.current;
      if (prev && typeof prev.focus === 'function') prev.focus();
    };
  }, [developerOpen]);

  /* Keep Tab inside the dialog while it is open. */
  const onKeyDown = useCallback(
    (e) => {
      if (e.key !== 'Tab' || !cardRef.current) return;
      const nodes = Array.from(cardRef.current.querySelectorAll(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

  /* Swipe down to dismiss — only when the sheet is scrolled to top. */
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (e) => {
    const start = touchStartY.current;
    touchStartY.current = null;
    if (start === null) return;
    const delta = (e.changedTouches[0]?.clientY ?? start) - start;
    const scrolled = bodyRef.current ? bodyRef.current.scrollTop > 4 : false;
    if (delta > SWIPE_CLOSE_PX && !scrolled) closeDeveloper();
  };

  if (!developerOpen) return null;

  /* 'bho' is not a valid BCP-47 subtag; 'bh' (Bihari) is the
     closest registered tag for Bhojpuri text. */
  const htmlLang = lang === 'bho' ? 'bh' : lang;

  const facts = [
    { icon: '👨‍💻', label: t('dev.infoDeveloper'), value: t('dev.infoDeveloperValue') },
    { icon: '🎵', label: t('dev.infoProject'), value: t('dev.infoProjectValue') },
    { icon: '🪔', label: t('dev.infoPurpose'), value: t('dev.infoPurposeValue') },
    { icon: '❤️', label: t('dev.infoMadeWith'), value: t('dev.infoMadeWithValue') },
  ];

  return createPortal(
    <div
      className="devprofile"
      role="dialog"
      aria-modal="true"
      aria-labelledby="devprofile-title"
    >
      <div className="devprofile__scrim" onClick={closeDeveloper} aria-hidden="true" />

      <div
        className="devprofile__card"
        ref={cardRef}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <span className="devprofile__grip" aria-hidden="true" />

        <button
          type="button"
          className="devprofile__close"
          onClick={closeDeveloper}
          aria-label={t('dev.close')}
          ref={closeRef}
        >
          <Icon name="x" size={18} />
        </button>

        <header className="devprofile__head">
          <span className="devprofile__avatar" aria-hidden="true">
            <span className="devprofile__monogram">H</span>
          </span>

          <h2 id="devprofile-title" className="devprofile__name">
            HARSH
          </h2>
          <p className="devprofile__role">{t('dev.cardRole')}</p>
          <p className="devprofile__bio">“{t('dev.bio')}”</p>
        </header>

        <div className="devprofile__body" ref={bodyRef}>
          <p className="devprofile__lead" lang={htmlLang}>
            {t('dev.intro')}
          </p>
          <p className="devprofile__text" lang={htmlLang}>
            {t('dev.description')}
          </p>
          <p className="devprofile__text" lang={htmlLang}>
            {t('dev.mission')}
          </p>

          <div className="devprofile__facts">
            {facts.map((f) => (
              <div className="devfact" key={f.label}>
                <span className="devfact__icon" aria-hidden="true">
                  {f.icon}
                </span>
                <span className="devfact__label">{f.label}</span>
                <span className="devfact__value">{f.value}</span>
              </div>
            ))}
          </div>

          <blockquote className="devprofile__quote">
            <p className="devprofile__quote-text">{t('dev.quote')}</p>
            <footer className="devprofile__jai deva">जय छठी मैया 🙏</footer>
          </blockquote>

          <div className="devprofile__lang">
            <span className="devprofile__lang-label">{t('lang.label')}</span>
            <LanguageSwitcher />
          </div>
        </div>

        <footer className="devprofile__foot">
          <CreatorSignature />
        </footer>
      </div>
    </div>,
    document.body,
  );
}
