import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import SongRow from '../components/common/SongRow';
import EmptyState from '../components/common/EmptyState';
import { dayByKey } from '../data/days';
import { songs } from '../data/songs';
import { festivalDays } from '../lib/festival';
import { usePlayerActions } from '../context/PlayerContext';
import { fmtDayMonth, fmtWeekday } from '../lib/format';

/** Ritual line reads better with even spacing around separators. */
const formatRitual = (ritual) => ritual.split('·').map((p) => p.trim()).join('  ·  ');

export default function DayDetail() {
  const { key } = useParams();
  const A = usePlayerActions();
  const day = dayByKey.get(key);

  if (!day) {
    return (
      <div className="shell">
        <EmptyState
          icon="calendar"
          title="Din nahi mila"
          action={
            <Link className="btn btn--primary" to="/four-days">
              Four Days
            </Link>
          }
        />
      </div>
    );
  }

  const info = festivalDays().find((d) => d.key === day.key);
  const list = songs.filter((s) => s.day === day.key);

  return (
    <div className="shell">
      <header className="page-head">
        <Link className="see-all" to="/four-days" style={{ paddingLeft: 0 }}>
          <Icon name="left" size={15} /> Four Days
        </Link>
        <span className="day-card__label" style={{ marginTop: 14 }}>
          Day {day.day} of 4
        </span>
        <h1 className="deva" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span aria-hidden="true">{day.icon}</span>
          {day.hindiName} · {day.name}
        </h1>
        {info && (
          <p>
            {fmtWeekday(info.date)}, {fmtDayMonth(info.date)}
            {info.status === 'today' ? ' · आज' : ''}
          </p>
        )}
      </header>

      <div className="ritual">
        <div className="stack" style={{ gap: 'var(--s-4)' }}>
          <div className="ritual__block">
            <h4>विधि · The ritual</h4>
            <p style={{ color: 'var(--text-soft)' }}>{formatRitual(day.ritual)}</p>
          </div>

          <div className="ritual__block">
            <h4>अर्थ · Meaning</h4>
            <p style={{ color: 'var(--text-soft)' }}>{day.meaning}</p>
          </div>

          <div className="ritual__block">
            <h4>मुख्य क्रियाएँ · Practices</h4>
            <ul className="ritual__list">
              {day.practices.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="stack" style={{ gap: 'var(--s-4)' }}>
          <div className="ritual__block">
            <h4>प्रसाद · Traditional food</h4>
            <div className="food-tags">
              {day.food.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>

          <div className="ritual__block">
            <h4>Recommended playlist</h4>
            {list.length ? (
              <>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {list.length} geet is din ke liye — {day.tagline}
                </p>
                <button className="btn btn--primary btn--block" onClick={() => A.playQueue(list, 0)}>
                  <Icon name="play" size={16} filled strokeWidth={0} /> इस दिन के गीत सुनें
                </button>
              </>
            ) : (
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Is din ke liye abhi koi geet catalogue mein nahi hai.
              </p>
            )}
          </div>
        </div>
      </div>

      {list.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Associated songs ({list.length})</h2>
          </div>
          <div className="stack" style={{ gap: 2 }}>
            {list.map((s, i) => (
              <SongRow key={s.id} song={s} queue={list} position={i + 1} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
