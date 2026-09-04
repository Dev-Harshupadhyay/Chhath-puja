import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Countdown from '../components/home/Countdown';
import SectionHeading from '../components/common/SectionHeading';
import { days } from '../data/days';
import { festivalDays } from '../lib/festival';
import { songs } from '../data/songs';
import { usePlayerActions } from '../context/PlayerContext';
import { fmtDayMonth, fmtWeekday } from '../lib/format';

export default function FourDays() {
  const A = usePlayerActions();
  const dates = festivalDays();
  const dateByKey = new Map(dates.map((d) => [d.key, d]));

  return (
    <div className="shell">
      <header className="page-head">
        <span className="eyebrow">Mahaparva</span>
        <h1 className="deva">छठ के चार दिन</h1>
        <p>
          Nahay Khay se Usha Arghya tak — har din ka ritual, uska matlab, uska prasad aur us din ke
          geet.
        </p>
      </header>

      <Countdown detailed />

      <SectionHeading hindi="चारों दिन" title="Rituals & dates" />

      <div className="stack" style={{ gap: 'var(--s-5)' }}>
        {days.map((d) => {
          const info = dateByKey.get(d.key);
          const daySongs = songs.filter((s) => s.day === d.key);
          return (
            <article key={d.key} className="day-card" style={{ padding: 'clamp(18px, 3vw, 30px)' }}>
              <span className="day-card__no" aria-hidden="true">
                {d.day}
              </span>
              <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
                <span className="day-card__icon" aria-hidden="true">
                  {d.icon}
                </span>
                <span className="day-card__label">Day {d.day}</span>
                <span className={`day-card__date ${info?.status === 'today' ? 'is-today' : ''}`}>
                  <Icon name="calendar" size={12} />
                  {info ? `${fmtWeekday(info.date)}, ${fmtDayMonth(info.date)}` : ''}
                  {info?.status === 'today' ? ' · आज' : ''}
                </span>
              </div>

              <h2 className="deva" style={{ fontSize: 'var(--fs-h2)', color: 'var(--saffron-300)' }}>
                {d.hindiName} · {d.name}
              </h2>
              <p style={{ maxWidth: '70ch' }}>{d.description}</p>

              <div className="ritual" style={{ marginTop: 8 }}>
                <div className="ritual__block">
                  <h4>इस दिन के गीत · Songs for this day</h4>
                  {daySongs.length ? (
                    <>
                      <ul className="ritual__list">
                        {daySongs.slice(0, 4).map((s) => (
                          <li key={s.id}>
                            <button
                              onClick={() => A.playSong(s, daySongs)}
                              style={{ textAlign: 'left', color: 'inherit', fontWeight: 600 }}
                            >
                              {s.title} <span style={{ opacity: 0.6 }}>— {s.artist}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="row" style={{ gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                        <button className="btn btn--primary btn--sm" onClick={() => A.playQueue(daySongs, 0)}>
                          <Icon name="play" size={14} filled strokeWidth={0} /> इस दिन के गीत सुनें
                        </button>
                        <Link className="btn btn--ghost btn--sm" to={`/four-days/${d.key}`}>
                          Full ritual <Icon name="right" size={14} />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      Is din ke liye abhi koi geet catalogue mein nahi hai.
                    </p>
                  )}
                </div>

                <div className="ritual__block">
                  <h4>प्रसाद · Prasad</h4>
                  <div className="food-tags">
                    {d.food.map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
