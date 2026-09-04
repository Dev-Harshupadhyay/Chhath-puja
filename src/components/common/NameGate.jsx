import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';
import { useName } from '../../context/NameContext';
import { useEscape } from '../../context/UIContext';

/**
 * First-visit gate: "What should we call you?"
 * Dismissible without an answer — we never block listening.
 */
export default function NameGate() {
  const { asked, saveName, skipName } = useName();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const open = !asked;

  useEscape(open, skipName);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 180);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const clean = value.trim();
    if (clean) saveName(clean);
    else skipName();
  };

  return createPortal(
    <div className="namegate" role="dialog" aria-modal="true" aria-labelledby="namegate-title">
      <div className="namegate__scrim" onClick={skipName} aria-hidden="true" />

      <form className="namegate__card" onSubmit={submit}>
        <span className="namegate__sun" aria-hidden="true">
          ☀
        </span>

        <h2 id="namegate-title" className="namegate__title deva">
          छठी मईया calls you ☀
        </h2>
        <p className="namegate__sub">What should we call you?</p>

        <div className="namegate__field">
          <Icon name="mic" size={17} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="आपका नाम · Your name"
            aria-label="Your name"
            maxLength={24}
            autoComplete="given-name"
          />
        </div>

        <button className="btn btn--primary btn--lg btn--block" type="submit">
          Continue <Icon name="right" size={16} />
        </button>

        <button className="btn btn--quiet btn--sm btn--block" type="button" onClick={skipName}>
          Skip for now
        </button>

        <p className="namegate__note">
          Saved only on this device — no account, nothing sent anywhere.
        </p>
      </form>
    </div>,
    document.body,
  );
}
