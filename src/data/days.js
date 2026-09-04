// ─────────────────────────────────────────────────────────────
// The Four Days of Chhath — ritual copy carried over from the
// existing Chhath Geet site (content preserved, presentation
// upgraded). Dates are the published Chhath calendar.
// ─────────────────────────────────────────────────────────────

export const FESTIVAL_YEARS = [
  { year: 2025, nahayKhay: '2025-10-25', kharna: '2025-10-26', sandhyaArghya: '2025-10-27', ushaArghya: '2025-10-28' },
  { year: 2026, nahayKhay: '2026-11-13', kharna: '2026-11-14', sandhyaArghya: '2026-11-15', ushaArghya: '2026-11-16' },
  { year: 2027, nahayKhay: '2027-11-03', kharna: '2027-11-04', sandhyaArghya: '2027-11-05', ushaArghya: '2027-11-06' },
  { year: 2028, nahayKhay: '2028-10-21', kharna: '2028-10-22', sandhyaArghya: '2028-10-23', ushaArghya: '2028-10-24' },
];

export const days = [
  {
    key: 'nahayKhay',
    day: 1,
    name: 'Nahay Khay',
    hindiName: 'नहाय खाय',
    icon: '🛁',
    tagline: 'The holy bath and the first sattvic meal.',
    description:
      'Vratis bathe in the river, bring home holy water and cook a single pure meal of arwa rice, chana dal and lauki. Purity of body and kitchen begins here.',
    ritual: 'Holy bath · Kaddu-bhaat',
    meaning:
      'The first day is about shuddhi — cleansing the body, the home and the kitchen before the fast begins. The vrati eats one simple sattvic meal, and from that moment the food is cooked without onion, garlic, salt or grain from outside.',
    practices: [
      'Bathe in the Ganga or a local river before sunrise and carry home sanctified water.',
      'Clean the kitchen and cook in fresh or newly lined chulha/utensils.',
      'One meal only: arwa rice, chana dal and lauki (kaddu-bhaat), cooked without salt, onion or garlic.',
      'The vrati begins observing strict purity for the next four days.',
    ],
    food: ['Arwa chawal', 'Chana dal', 'Lauki / kaddu-bhaat', 'Cooked without salt, onion or garlic'],
    mood: 'morning',
  },
  {
    key: 'kharna',
    day: 2,
    name: 'Kharna',
    hindiName: 'खरना',
    icon: '🍚',
    tagline: 'A day-long fast broken with kheer at dusk.',
    description:
      'A waterless fast through the day, broken after sunset with rasiao-kheer, roti and fruit offered to Chhathi Maiya. Thereafter begins the 36-hour nirjala vrat.',
    ritual: 'Rasiao-kheer · Prasad',
    meaning:
      'Kharna is the hinge of the vrata. The day-long nirjala fast is broken only after sunset, once the prasad has been offered. After this single meal the vrati takes nothing — not even water — until the Usha Arghya on the fourth morning.',
    practices: [
      'Nirjala vrat (no food, no water) through the day.',
      'Prepare rasiao-kheer with jaggery, rice and milk in a new earthen or clean vessel.',
      'Offer the kheer, roti and fruit to Chhathi Maiya after sunset — often on the roof or in the courtyard.',
      'Begin the 36-hour waterless fast that runs to the final arghya.',
    ],
    food: ['Rasiao-kheer (jaggery, rice, milk)', 'Roti', 'Seasonal fruit', 'Ghee from a clean earthen lamp'],
    mood: 'evening',
  },
  {
    key: 'sandhyaArghya',
    day: 3,
    name: 'Sandhya Arghya',
    hindiName: 'संध्या अर्घ्य',
    icon: '🌇',
    tagline: 'Offering to the setting sun at the ghat.',
    description:
      'Families walk to the ghat with bamboo soop and daura of thekua, sugarcane and fruit, and offer arghya to the setting Surya standing in the water.',
    ritual: 'Soop · Daura · Setting sun',
    meaning:
      'The evening arghya is the most photographed moment of Chhath. Standing waist-deep in the river, the vrati offers the setting sun water, milk and the prasad carried in the soop, while the ghat glows with hundreds of diyas and the folk songs of Chhath rise over the water.',
    practices: [
      'Walk to the ghat in procession, the bahangi of prasad carried on the shoulder.',
      'Stand in the water and offer arghya to the setting sun.',
      'Light the soop with a diya and circle it around the family.',
      'Sing Chhath geet through the night while the ghats stay lit.',
    ],
    food: ['Thekua', 'Kasari (khajuria)', 'Sugarcane', 'Coconut', 'Seasonal fruit in the soop'],
    mood: 'evening',
  },
  {
    key: 'ushaArghya',
    day: 4,
    name: 'Usha Arghya',
    hindiName: 'उषा अर्घ्य',
    icon: '🌅',
    tagline: 'The final offering to the rising sun.',
    description:
      'Before dawn the ghats fill again. Arghya is offered to the rising sun, the vrat is broken with prasad, and Chhathi Maiya is bid farewell for the year.',
    ritual: 'Rising sun · Paran',
    meaning:
      'The last arghya is offered to the rising sun. With it the 36-hour fast ends, the prasad is distributed to everyone at the ghat and beyond, and Chhathi Maiya is asked to return the following year.',
    practices: [
      'Reach the ghat before sunrise and offer arghya to the rising sun.',
      'Break the fast (paran) with prasad and a small sip of water.',
      'Distribute prasad to family, neighbours and everyone at the ghat.',
      'Bid farewell to Chhathi Maiya with the closing Chhath geet.',
    ],
    food: ['Thekua prasad', 'Sugarcane juice', 'Fruit', 'Kheer from the previous evening'],
    mood: 'morning',
  },
];

export const dayByKey = new Map(days.map((d) => [d.key, d]));
