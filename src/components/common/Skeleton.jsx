export function CardSkeleton() {
  return (
    <div className="song-card" aria-hidden="true">
      <div className="skeleton" style={{ aspectRatio: '16 / 10', borderRadius: 0 }} />
      <div className="song-card__body">
        <div className="stack" style={{ gap: 8, flex: 1 }}>
          <div className="skeleton" style={{ height: 13, width: '78%' }} />
          <div className="skeleton" style={{ height: 11, width: '52%' }} />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid" role="status" aria-label="Loading…">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RowSkeleton({ count = 8 }) {
  return (
    <div className="stack" role="status" aria-label="Loading…">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ height: 60, borderRadius: 16 }} />
      ))}
    </div>
  );
}
