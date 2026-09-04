import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { read, write, KEYS } from '../lib/storage';
import { DEFAULT_LANG, SUPPORTED, translations } from '../lib/translations';

/**
 * Language for interface copy only — song, artist and festival
 * metadata always renders exactly as it is in the data files.
 *
 * Persisted locally, detected from the browser on a first visit,
 * and defaults to English when nothing else is known.
 */

const LanguageCtx = createContext(null);
export const useLanguage = () => useContext(LanguageCtx);

const isSupported = (value) => SUPPORTED.includes(value);

/**
 * Best-effort guess from navigator.languages.
 * Bhojpuri has no dependable IANA subtag, so the Bihari macrolanguage
 * tag (`bh`) is treated as Bhojpuri; everything unknown falls back
 * to English rather than guessing wrong.
 */
function detectFromBrowser() {
  try {
    const nav = typeof navigator === 'undefined' ? null : navigator;
    if (!nav) return DEFAULT_LANG;
    const prefs = nav.languages?.length ? nav.languages : [nav.language].filter(Boolean);
    for (const pref of prefs) {
      const base = String(pref).toLowerCase().split('-')[0];
      if (base === 'hi') return 'hi';
      if (base === 'bh') return 'bho';
    }
  } catch {
    /* private mode / odd runtimes — English is a safe default */
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = read(KEYS.language, null);
    return isSupported(saved) ? saved : detectFromBrowser();
  });

  useEffect(() => {
    write(KEYS.language, lang);
  }, [lang]);

  /* Keep the document language in sync for screen readers and
     for the browser's own hyphenation / font selection. */
  useEffect(() => {
    document.documentElement.lang = lang === 'bho' ? 'bh' : lang;
  }, [lang]);

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations[DEFAULT_LANG][key] ?? key,
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}
