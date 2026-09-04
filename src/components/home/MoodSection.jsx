import Icon from '../Icon';
import SectionHeading from '../common/SectionHeading';
import { usePlayer, usePlayerActions } from '../../context/PlayerContext';
import { songs } from '../../data/songs';

const MOODS = [
  {
    key: 'morning',
    icon: '🌅',
    hi: 'सुबह',
    en: 'Morning',
    blurb: 'Usha arghya ki roshni — suraj ugte hi bajne wale geet.',
  },
  {
    key: 'evening',
    icon: '🌇',
    hi: 'शाम',
    en: 'Evening',
    blurb: 'Sandhya arghya ki bela — ghat ki diyen aur thekua ki mehak.',
  },
  {
    key: 'night',
    icon: '🌙',
    hi: 'रात',
    en: 'Night',
    blurb: 'Diyon ki roshni mein jagran — dheeme, gehre bhajan.',
  },
];

export default function MoodSection() {
  const { mood } = usePlayer();
  const A = usePlayerActions();

  const choose = (key) => {
    A.setMood(mood === key ? null : key);
    if (mood !== key) {
      const list = songs.filter((s) => s.moods.includes(key));
      A.playQueue(list, 0);
      A.notify(`${key} mood chal raha hai`);
    }
  };

  return (
    <section className="section" id="mood">
      <div className="shell">
        <SectionHeading
          eyebrow="Today’s Chhath Mood"
          hindi="आज का छठ मूड"
          title="Pick the hour, the UI follows"
          sub="Morning, evening ya night — mood badalte hi poori site ka rang aur geet badal jaate hain."
        />

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {MOODS.map((m) => (
            <button
              key={m.key}
              className="mood"
              data-mood={m.key}
              aria-pressed={mood === m.key}
              onClick={() => choose(m.key)}
            >
              {mood === m.key && <span className="mood__on">Playing</span>}
              <span className="mood__icon" aria-hidden="true">
                {m.icon}
              </span>
              <h3>
                <span className="deva">{m.hi}</span> · {m.en}
              </h3>
              <p className="deva">{m.blurb}</p>
              <span
                className="row"
                style={{ gap: 6, marginTop: 10, fontSize: '0.75rem', color: 'var(--saffron-300)', fontWeight: 700 }}
              >
                <Icon name="play" size={13} filled strokeWidth={0} />
                {songs.filter((s) => s.moods.includes(m.key)).length} geet
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
