import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UICtx = createContext(null);
export const useUI = () => useContext(UICtx);

export function UIProvider({ children }) {
  const [expandedOpen, setExpandedOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [developerOpen, setDeveloperOpen] = useState(false);

  const value = useMemo(
    () => ({
      expandedOpen,
      openExpanded: () => setExpandedOpen(true),
      closeExpanded: () => setExpandedOpen(false),
      queueOpen,
      openQueue: () => setQueueOpen(true),
      closeQueue: () => setQueueOpen(false),
      toggleQueue: () => setQueueOpen((v) => !v),
      lightbox,
      openLightbox: (item, list = []) => setLightbox({ item, list }),
      closeLightbox: () => setLightbox(null),
      developerOpen,
      openDeveloper: () => setDeveloperOpen(true),
      closeDeveloper: () => setDeveloperOpen(false),
    }),
    [expandedOpen, queueOpen, lightbox, developerOpen],
  );

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

/** Escape-to-close for sheets and modals. */
export function useEscape(active, close) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close]);
}
