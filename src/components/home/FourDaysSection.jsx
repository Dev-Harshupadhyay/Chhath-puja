import { Link } from 'react-router-dom';
import Icon from '../Icon';
import SectionHeading from '../common/SectionHeading';
import { days } from '../../data/days';
import { festivalDays } from '../../lib/festival';
import { songs } from '../../data/songs';
import { usePlayerActions } from '../../context/PlayerContext';
import { fmtDayMonth, fmtWeekday } from '../../lib/format';

export default function FourDaysSection() {
  const A = usePlayerActions();
  const dates = festivalDays();
  const dateByKey = new Map(dates.map((d) => [d.key, d]));

  return (
    <section className="section" id="four-days">
      <div className="shell">
        <SectionHeading
          eyebrow="Mahaparva"
          hindi="छठ के चार दिन"
          title="The Four Days"
          sub="Nahay Khay se Usha Arghya tak — har din ka apna ritual, apna prasad aur apne geet."
          to="/four-days"
        />

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {days.map((d) => {
            const info = dateByKey.get(d.key);
            const daySongs = songs.filter((s) => s.day === d.key);
            return (
              <article key={d.key} className="day-card">
                <span className="day-card__no" aria-hidden="true">
                  {d.day}
                </span>
                <span className="day-card__icon" aria-hidden="true">
                  {d.icon}
                </span>
                <span className="day-card__label">Day {d.day}</span>
                <h3 className="deva">{d.hindiName}</h3>
                <span
                  className={`day-card__date ${info?.status === 'today' ? 'is-today' : ''}`}
                >
                  <Icon name="calendar" size={12} />
                  {info ? `${fmtDayMonth(info.date)} · ${fmtWeekday(info.date)}` : '—'}
                  {info?.status === 'today' ? ' · आज' : ''}
                </span>
                <p className="clamp-3">{d.description}</p>
                <div className="day-card__foot">
                  <Link className="btn btn--ghost btn--sm btn--block" to={`/four-days/${d.key}`}>
                    <Icon name="play" size={14} /> इस दिन के गीत सुनें ({daySongs.length})
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
