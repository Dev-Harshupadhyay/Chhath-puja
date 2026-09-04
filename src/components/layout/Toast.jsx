import { usePlayer } from '../../context/PlayerContext';

export default function Toast() {
  const { toast } = usePlayer();
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {toast}
    </div>
  );
}
