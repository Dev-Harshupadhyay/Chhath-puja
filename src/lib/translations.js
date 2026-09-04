/**
 * Centralized UI translations — English | हिंदी | भोजपुरी
 *
 * ONE place for every piece of interface copy. Components never
 * hardcode strings; they call `t('key')` from useLanguage().
 *
 * Two things are deliberately NEVER translated:
 *   • proper nouns (the creator's name, "Chhath Geet")
 *   • the devotional mark "जय छठी मैया 🙏"
 * Song/artist metadata is untouched here by design — real titles
 * stay exactly as they are.
 */

export const DEFAULT_LANG = 'en';

/** Order here is the order shown in the segmented control. */
export const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'bho', label: 'भोजपुरी' },
];

export const SUPPORTED = LANGS.map((l) => l.id);

/* ── English ──────────────────────────────────────────────── */
const en = {
  'lang.label': 'Language',
  'lang.switch': 'Change language',

  'dev.navLabel': 'Developer',
  'dev.title': 'Developer',
  'dev.subtitle': 'The person behind this website',
  'dev.close': 'Close developer profile',

  'dev.role': 'Creator & Developer',
  'dev.bio': 'Code is like humor. When you have to explain it, it\u2019s bad.',
  'dev.cardRole': 'Creator • Developer • Chhath Geet',

  'dev.intro':
    'My name is Harsh, and this website is my personal project created with devotion for Chhath Puja and love for Bhojpuri culture.',
  'dev.description':
    'I created Chhath Geet to bring traditional Chhath devotional songs, artists, and festival information together in one beautiful and easy-to-use digital experience.',
  'dev.mission':
    'This project is a small effort to preserve, celebrate, and share the devotional spirit of Chhath Puja through technology.',

  'dev.infoDeveloper': 'Developer',
  'dev.infoDeveloperValue': 'Harsh',
  'dev.infoProject': 'Project',
  'dev.infoProjectValue': 'Chhath Geet',
  'dev.infoPurpose': 'Purpose',
  'dev.infoPurposeValue': 'Celebrating Chhath Puja through technology',
  'dev.infoMadeWith': 'Made With',
  'dev.infoMadeWithValue': 'Devotion, creativity & code',

  'dev.quote': 'Built with code, inspired by devotion.',
  'dev.jai': 'जय छठी मैया 🙏',

  'sig.madeWith': 'Made with devotion for Chhath Puja',
  'sig.madeBy': 'Made by',

  'nav.developer': 'Developer',
};

/* ── हिंदी ─────────────────────────────────────────────────── */
const hi = {
  'lang.label': 'भाषा',
  'lang.switch': 'भाषा बदलें',

  'dev.navLabel': 'डेवलपर',
  'dev.title': 'डेवलपर',
  'dev.subtitle': 'इस वेबसाइट के रचनाकार',
  'dev.close': 'डेवलपर प्रोफ़ाइल बंद करें',

  'dev.role': 'रचनाकार एवं डेवलपर',
  'dev.bio': 'कोड हास्य की तरह है — अगर उसे समझाना पड़े, तो वह अच्छा नहीं है।',
  'dev.cardRole': 'रचनाकार • डेवलपर • छठ गीत',

  'dev.intro':
    'मेरा नाम हर्ष है, और यह वेबसाइट मेरी निजी परियोजना है — छठ पूजा के प्रति श्रद्धा और भोजपुरी संस्कृति के प्रेम के साथ बनाई गई है।',
  'dev.description':
    'मैंने छठ गीत इसलिए बनाया है, ताकि पारंपरिक छठ भजन, कलाकार और त्यौहार की जानकारी एक ही सुंदर और सरल डिजिटल अनुभव में मिल जाए।',
  'dev.mission':
    'यह परियोजना छठ पूजा की भक्ति भावना को संजोने, मनाने और तकनीक के माध्यम से साझा करने का एक छोटा प्रयास है।',

  'dev.infoDeveloper': 'डेवलपर',
  'dev.infoDeveloperValue': 'हर्ष',
  'dev.infoProject': 'परियोजना',
  'dev.infoProjectValue': 'छठ गीत',
  'dev.infoPurpose': 'उद्देश्य',
  'dev.infoPurposeValue': 'तकनीक के माध्यम से छठ पूजा का उत्सव',
  'dev.infoMadeWith': 'निर्माण',
  'dev.infoMadeWithValue': 'श्रद्धा, रचनात्मकता और कोड से',

  'dev.quote': 'कोड से रचा, श्रद्धा से प्रेरित।',
  'dev.jai': 'जय छठी मैया 🙏',

  'sig.madeWith': 'छठ पूजा के प्रति श्रद्धा के साथ निर्मित',
  'sig.madeBy': 'निर्माता',

  'nav.developer': 'डेवलपर',
};

/* ── भोजपुरी ───────────────────────────────────────────────── */
const bho = {
  'lang.label': 'भाषा',
  'lang.switch': 'भाषा बदलीं',

  'dev.navLabel': 'डेवलपर',
  'dev.title': 'डेवलपर',
  'dev.subtitle': 'ए वेबसाइट के रचनाकार',
  'dev.close': 'डेवलपर प्रोफाइल बंद करीं',

  'dev.role': 'रचनाकार आ डेवलपर',
  'dev.bio': 'कोड हँसी जइसन होला — जब एकरा समझावे के पड़े, त समझ लीं कि ओह में गड़बड़ बा।',
  'dev.cardRole': 'रचनाकार • डेवलपर • छठ गीत',

  'dev.intro':
    'हमार नाम हर्ष हा, आ ई वेबसाइट हमार निजी परियोजना हऊ — छठ पूजा के भक्ति आ भोजपुरी संस्कृति के प्रेम के संगे बनावल गइल बा।',
  'dev.description':
    'हम छठ गीत एही खातिर बनवले हईं, जे पारंपरिक छठ भजन, कलाकार आ तिहुआर के जानकारी सभ एकही सुंदर आ सहज डिजिटल अनुभव में मिल जाव।',
  'dev.mission':
    'ई परियोजना छठ पूजा के भक्ति के संजोवे, मनावे आ तकनीक के माध्यम से बाँटे के एगो छोट कोसिस हऊ।',

  'dev.infoDeveloper': 'डेवलपर',
  'dev.infoDeveloperValue': 'हर्ष',
  'dev.infoProject': 'परियोजना',
  'dev.infoProjectValue': 'छठ गीत',
  'dev.infoPurpose': 'उद्देश्य',
  'dev.infoPurposeValue': 'तकनीक के माध्यम से छठ पूजा के उत्सव',
  'dev.infoMadeWith': 'निर्माण',
  'dev.infoMadeWithValue': 'भक्ति, रचनात्मकता आ कोड से',

  'dev.quote': 'कोड से रचल, भक्ति से प्रेरित।',
  'dev.jai': 'जय छठी मैया 🙏',

  'sig.madeWith': 'छठ पूजा के भक्ति के संगे बनावल गइल',
  'sig.madeBy': 'बनावे वाला',

  'nav.developer': 'डेवलपर',
};

export const translations = { en, hi, bho };
