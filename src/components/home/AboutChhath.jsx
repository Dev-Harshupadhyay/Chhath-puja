import Icon from '../Icon';

const FACTS = [
  { icon: 'sun', hi: 'सूर्य षष्ठी', en: 'Dedicated to Surya Dev and Chhathi Maiya, observed on Kartik Shukla Shasthi.' },
  { icon: 'flame', hi: 'निर्जला व्रत', en: 'A 36-hour waterless fast kept by the vrati between Kharna and Usha Arghya.' },
  { icon: 'lotus', hi: 'पवित्रता', en: 'No onion, no garlic, no salt — everything is cooked in absolute purity.' },
  { icon: 'music', hi: 'लोकगीत', en: 'Chhath geet are folk songs of Bihar and Purvanchal, sung mostly by women at the ghat.' },
];

export default function AboutChhath() {
  return (
    <section className="section" id="about">
      <div className="shell">
        <div className="surface" style={{ padding: 'clamp(20px, 4vw, 44px)', borderRadius: 'var(--r-xl)' }}>
          <span className="eyebrow">About Chhath</span>
          <h2 className="section-title" style={{ marginTop: 8 }}>
            छठ के बारे में
          </h2>
          <p
            className="deva"
            style={{ marginTop: 14, maxWidth: '68ch', color: 'var(--text-soft)', lineHeight: 1.75 }}
          >
            छठ सूर्य देव और छठी मईया को समर्पित एक प्राचीन पर्व है — जिसमें व्रती नदी में खड़े होकर
            डूबते और उगते सूर्य को अर्घ्य देते हैं। यह पर्व बिहार, झारखंड, उत्तर प्रदेश और नेपाल के
            तराई इलाकों में बड़ी श्रद्धा से मनाया जाता है। चार दिनों तक चलने वाले इस व्रत में
            शुद्धता, संयम और भक्ति का विशेष महत्व है — और हर दिन के साथ बदलते हैं उसके गीत।
          </p>
          <p style={{ marginTop: 12, maxWidth: '68ch', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Chhath is a four-day festival of gratitude to the Sun. The vrati stands in the river at
            dusk and again before dawn, offering arghya, while the ghat rings with folk songs passed
            down through generations. This site exists to keep those songs easy to find and easy to
            play — streamed only from official YouTube sources.
          </p>

          <div
            className="grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', marginTop: 28 }}
          >
            {FACTS.map((f) => (
              <div key={f.en} className="ritual__block">
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name={f.icon} size={15} /> <span className="deva">{f.hi}</span>
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{f.en}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
