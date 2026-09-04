import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { KEYS, read, write } from '../lib/storage';

/**
 * "Chhathi Maiya calls you ☀" — a one-time, device-only name.
 *
 * The name never leaves the browser: it goes straight to
 * localStorage and is used purely to greet the listener. There is
 * no account, no network call, and no tracking.
 */
const NameCtx = createContext(null);
export const useName = () => useContext(NameCtx);

export function NameProvider({ children }) {
  const [name, setNameState] = useState(() => read(KEYS.name, '') || '');
  const [asked, setAsked] = useState(() => Boolean(read(KEYS.name, '') || read(KEYS.nameSkipped, false)));

  const saveName = useCallback((value) => {
    const clean = String(value || '').trim().slice(0, 24);
    setNameState(clean);
    setAsked(true);
    write(KEYS.name, clean);
    write(KEYS.nameSkipped, true);
  }, []);

  const skipName = useCallback(() => {
    setAsked(true);
    write(KEYS.nameSkipped, true);
  }, []);

  const askAgain = useCallback(() => setAsked(false), []);

  const clearName = useCallback(() => {
    setNameState('');
    write(KEYS.name, '');
  }, []);

  const value = useMemo(
    () => ({ name, asked, saveName, skipName, askAgain, clearName, hasName: Boolean(name) }),
    [name, asked, saveName, skipName, askAgain, clearName],
  );

  return <NameCtx.Provider value={value}>{children}</NameCtx.Provider>;
}
