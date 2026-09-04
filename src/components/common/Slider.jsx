import { useCallback, useRef, useState } from 'react';

/**
 * Accessible seek/volume slider.
 * Pointer-drag + keyboard (arrows, home/end) + ARIA slider role.
 */
export default function Slider({
  value = 0,
  max = 100,
  onChange,
  onCommit,
  label,
  step = 1,
  className = '',
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  const posToValue = useCallback(
    (clientX) => {
      const el = trackRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return ratio * max;
    },
    [max],
  );

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
    onChange(posToValue(e.clientX));
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    onChange(posToValue(e.clientX));
  };

  const onPointerUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    onCommit?.(posToValue(e.clientX));
  };

  const onKeyDown = (e) => {
    const jumps = { ArrowLeft: -step, ArrowRight: step, ArrowDown: -step, ArrowUp: step };
    let next = null;
    if (e.key in jumps) next = value + jumps[e.key];
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = max;
    if (next === null) return;
    e.preventDefault();
    const clamped = Math.min(max, Math.max(0, next));
    onChange(clamped);
    onCommit?.(clamped);
  };

  return (
    <div
      className={`slider ${dragging ? 'is-active' : ''} ${className}`}
      style={{ '--pct': `${pct}%` }}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      aria-valuetext={label === 'Volume' ? `${Math.round(value)}%` : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="slider__track" ref={trackRef}>
        <div className="slider__fill" />
      </div>
      <div className="slider__thumb" />
    </div>
  );
}
