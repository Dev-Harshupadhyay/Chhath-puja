import { FESTIVAL_YEARS } from '../data/days';

const toDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayDiff = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 86400000);

/** The next festival year whose Usha Arghya has not yet passed. */
export function currentFestival(now = new Date()) {
  const today = startOfDay(now);
  return FESTIVAL_YEARS.find((f) => toDate(f.ushaArghya) >= today) ?? FESTIVAL_YEARS[FESTIVAL_YEARS.length - 1];
}

export const ORDER = ['nahayKhay', 'kharna', 'sandhyaArghya', 'ushaArghya'];

/** Four day objects with resolved Date + today/completed/upcoming. */
export function festivalDays(festival = currentFestival(), now = new Date()) {
  const today = startOfDay(now).getTime();
  return ORDER.map((key) => {
    const date = toDate(festival[key]);
    const t = date.getTime();
    return {
      key,
      date,
      status: t === today ? 'today' : t < today ? 'completed' : 'upcoming',
    };
  });
}

export function festivalStatus(now = new Date()) {
  const festival = currentFestival(now);
  const days = festivalDays(festival, now);
  const today = startOfDay(now);
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const todayIdx = days.findIndex((d) => d.date.getTime() === today.getTime());

  let phase = 'BEFORE_FESTIVAL';
  if (todayIdx >= 0) phase = `DAY_${todayIdx + 1}`;
  else if (today > last) phase = 'AFTER_FESTIVAL';
  else if (today >= first) phase = 'FESTIVAL_ONGOING';

  return {
    festival,
    days,
    phase,
    todayIndex: todayIdx,
    daysToGo: Math.max(0, dayDiff(today, first)),
    year: festival.year,
  };
}
