import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { festivalStatus } from '../../lib/festival';
import { fmtDayMonth, fmtWeekday } from '../../lib/format';

export default function Countdown({ detailed = false }) {
  const s = useMemo(() => festivalStatus(), []);
  const today = s.days.find((d) => d.status === 'today');
  const nextUp = s.days.find((d) => d.status === 'upcoming');

  return (
    <div className="countdown surface">
      <div>
        <span className="countdown__label">Chhath Puja {s.year}</span>
        <div className="countdown__num">{s.daysToGo}</div>
        <span className="countdown__label">days to go</span>
      </div>

      <div style={{ flex: 1, minWidth: 220 }}>
        <p className="deva" style={{ color: 'var(--text-soft)' }}>
          {today
            ? `आज ${today.key === 'nahayKhay' ? 'नहाय खाय' : ''} hai — Chhath chal raha hai.`
            : 'छठ नहाय खाय से आरंभ होता है'}
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
          Festival window {fmtDayMonth(s.days[0].date)} – {fmtDayMonth(s.days[3].date)} · Kartik
          Shukla Chaturthi to Saptami
        </p>
        {detailed && nextUp && (
          <p style={{ fontSize: '0.8rem', color: 'var(--gold-400)', marginTop: 6 }}>
            Next: {fmtWeekday(nextUp.date)}, {fmtDayMonth(nextUp.date)}
          </p>
        )}
      </div>

      <Link className="btn btn--ghost btn--sm" to="/four-days">
        <Icon name="calendar" size={15} /> Four Days
      </Link>
    </div>
  );
}
