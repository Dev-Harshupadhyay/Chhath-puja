// ─────────────────────────────────────────────────────────────
// Curated playlists — every playlist is a FILTER over the real
// song catalogue, so no track is ever invented. Counts are
// computed at runtime from `songIds`.
// ─────────────────────────────────────────────────────────────

export const playlists = [

  {
    slug: "morning-chhath-geet",
    emoji: "🌅",
    title: "सुबह के छठ गीत",
    englishTitle: "Morning Chhath Geet",
    blurb: "Usha ke samay ke geet — suraj ugte hi ghat par goonjne wale bhajan.",
    songIds: ["uga-hai-suraj-dev", "kekra-khatir-naa", "darshan-dekhai-dihi", "ugi-hey-dinanath-kalpana", "uga-ho-suraj-deva", "bihari-piya", "sona-satkuniya-ho-dinanath", "sona-surujdev", "ugi-he-dinanath-nisha", "dhaniya-hamar-naya-baadi", "chhath-kare-aai", "chhathi-maiya-jukebox", "ho-deenanath", "nahay-khay-rajan-rangila-khushi-kakkar", "ugi-hey-dinanath-anuska", "pawan-singh-ugi-suruj-dev-drj-records", "vishal-mishra-maiya-bulaye-kaushal-kishore", "ugi-hey-dinanath-shalini-singh-uag-films-stu", "maiya-bulaye-vishal-mishra-kaushal-kishore-d", "ugi-hey-dinanath-swati-mishra", "maiya-mintuaa-kaushal-kishore-kalpana-patowa"],
  },
  {
    slug: "sandhya-arghya-geet",
    emoji: "🌇",
    title: "संध्या अर्घ्य गीत",
    englishTitle: "Sandhya Arghya Geet",
    blurb: "Dhalte suraj ko arghya dete waqt bajne wale geet.",
    songIds: ["kaanch-hi-baans-ke-bahangiya", "marbo-re-sugwa", "bahangi-chhathi-mai-ke", "jode-jode-supwa", "chhath-ghate-chali", "kerwa-ke-paat-par-maithili", "amar-rahe-piyawa-hamar", "chhathi-mai-ke-ghatwa-pe", "kawna-kalamwa-se-likhla-karamwa", "maath-pa-daurawa-leke", "kelwa-ke-paat-par", "kholi-najariya"],
  },
  {
    slug: "usha-arghya-geet",
    emoji: "🌄",
    title: "उषा अर्घ्य गीत",
    englishTitle: "Usha Arghya Geet",
    blurb: "Bhor ke ujale mein ugte suraj ko samarpit geet.",
    songIds: ["uga-hai-suraj-dev", "darshan-dekhai-dihi", "ugi-hey-dinanath-kalpana", "uga-ho-suraj-deva", "sona-satkuniya-ho-dinanath", "sona-surujdev", "ugi-he-dinanath-nisha", "ho-deenanath", "ugi-hey-dinanath-anuska", "pawan-singh-ugi-suruj-dev-drj-records", "vishal-mishra-maiya-bulaye-kaushal-kishore", "ugi-hey-dinanath-shalini-singh-uag-films-stu", "maiya-bulaye-vishal-mishra-kaushal-kishore-d", "ugi-hey-dinanath-swati-mishra", "maiya-mintuaa-kaushal-kishore-kalpana-patowa"],
  },
  {
    slug: "chhathi-maiya-geet",
    emoji: "🙏",
    title: "छठी मईया के गीत",
    englishTitle: "Chhathi Maiya Ke Geet",
    blurb: "Chhathi Maiya ki aaradhna aur vinti ke geet.",
    songIds: ["kopi-kopi-boleli-chhathi-maiya", "bahangi-chhathi-mai-ke", "chhath-ghate-chali", "chhathi-maiya-khesari", "chhathi-mai-ke-ghatwa-pe", "chhath-kare-aai", "karelu-chhath-baratiya", "chhathi-maiya-jukebox", "hey-chhathi-maiya", "pahile-pahil-chhathi-maiya", "jai-chhathi-maiya-sonu-nigam", "suna-chhathi-maiya", "nishadubey-netrahin-chhathgeet", "maiya-sohar-chhathimaiya"],
  },
  {
    slug: "sharda-sinha-special",
    emoji: "🎶",
    title: "शारदा सिन्हा स्पेशल",
    englishTitle: "Sharda Sinha Special",
    blurb: "Chhath ki awaaz — Sharda Sinha ke lokpriya geet.",
    songIds: ["chhathi-maiya-jukebox", "hey-chhathi-maiya", "ho-deenanath", "kelwa-ke-paat-par", "pahile-pahil-chhathi-maiya", "uthau-suruj-bhaile-bihaan-by-sharda-sinha-so"],
  },
  {
    slug: "pawan-singh-chhath",
    emoji: "🎤",
    title: "पवन सिंह छठ गीत",
    englishTitle: "Pawan Singh Chhath Geet",
    blurb: "Pawan Singh ke chhath geet, ghat ki dhun ke saath.",
    songIds: ["chhathi-mai-ke-ghatwa-pe", "dhaniya-hamar-naya-baadi", "jode-jode-falwa", "kawna-kalamwa-se-likhla-karamwa", "pawan-singh-ghatiye-swarg-lagela-chandani", "jai-maiya-sonu-nigam-pawan-singh-vijay-chauh", "sonu-nigam-pawan-singh", "sonu-nigam-pawan-singh-s-chal-bhauji-hali", "pawan-singh-ugi-suruj-dev-drj-records", "pawan-singh-aditya-gosaiya"],
  },
  {
    slug: "khesari-lal-chhath",
    emoji: "🎬",
    title: "खेसारी लाल छठ गीत",
    englishTitle: "Khesari Lal Chhath Geet",
    blurb: "Khesari Lal Yadav ke sabse zyada bajne wale chhath geet.",
    songIds: ["bihari-piya", "chhath-ghate-chali", "chhathi-maiya-khesari", "pari-khatir-piyari-piya", "khesari-lal-yadav-bihari-piya-chal-aiha", "khesari-lal-yadav", "khesari-lal-yadav-2", "khesari-lal-yadav-ghutti-bhar-mor-dhoti-bhij", "khesari-lal-yadav-3", "khesari-lal-yadav-kajal-raghwani-chhapra-chh", "nariyal-khesari-lal-yadav-shilpi-raj-chaiti"],
  },
  {
    slug: "sadabahar-chhath-geet",
    emoji: "❤️",
    title: "सदाबहार छठ गीत",
    englishTitle: "Sadabahar Chhath Geet",
    blurb: "Wo geet jo har saal chhath par sabse pehle bajte hain.",
    songIds: ["kaanch-hi-baans-ke-bahangiya", "uga-hai-suraj-dev", "ugi-hey-dinanath-kalpana", "chhath-ghate-chali", "sona-satkuniya-ho-dinanath", "jode-jode-falwa", "kawna-kalamwa-se-likhla-karamwa", "kelwa-ke-paat-par", "pahile-pahil-chhathi-maiya", "jai-chhathi-maiya-sonu-nigam"],
  },
  {
    slug: "kharna-special",
    emoji: "🪔",
    title: "खरना स्पेशल",
    englishTitle: "Kharna Special",
    blurb: "Kharna ki shaam, kheer ki mehak aur vrat ki taiyari.",
    songIds: ["daura-ghate-pahuchai", "sone-ke-katorwa", "pari-khatir-piyari-piya", "jode-jode-falwa", "karelu-chhath-baratiya", "aahe-dev-kavan-dev", "suna-chhathi-maiya", "ripali-raj-kharna-khir"],
  },
  {
    slug: "ghat-ke-geet",
    emoji: "🌊",
    title: "घाट पर बजने वाले गीत",
    englishTitle: "Ghat Par Bajne Wale Geet",
    blurb: "Ghat ki kashti, diyon ki roshni aur bheed mein goonjte geet.",
    songIds: ["marbo-re-sugwa", "bahangi-chhathi-mai-ke", "darshan-dekhai-dihi", "jode-jode-supwa", "uga-ho-suraj-deva", "kerwa-ke-paat-par-maithili", "sona-surujdev", "amar-rahe-piyawa-hamar", "ugi-he-dinanath-nisha", "chhathi-mai-ke-ghatwa-pe", "maath-pa-daurawa-leke", "ho-deenanath", "kholi-najariya", "ugi-hey-dinanath-anuska", "pawan-singh-ugi-suruj-dev-drj-records", "vishal-mishra-maiya-bulaye-kaushal-kishore", "ugi-hey-dinanath-shalini-singh-uag-films-stu", "maiya-bulaye-vishal-mishra-kaushal-kishore-d", "ugi-hey-dinanath-swati-mishra", "maiya-mintuaa-kaushal-kishore-kalpana-patowa"],
  },
  {
    slug: "nisha-dubey-chhath",
    emoji: "🎵",
    title: "निशा दुबे छठ गीत",
    englishTitle: "Nisha Dubey Chhath Geet",
    blurb: "Nisha Dubey ki madhur awaaz mein chhath ke geet.",
    songIds: ["amar-rahe-piyawa-hamar", "ugi-he-dinanath-nisha", "panhi-na-jittu-ji-piyariya-nisha-dubey-parab", "jagmag-jagmag-jarata-dekha-nisha-dubey-mahim", "nisha-dubey-lambi-lambi-ukhiya", "nisha-dubey-2020", "seemva-se-ayihe-jihya-saiya-nisha-dubey-arag", "nisha-dubey-bullet-se-leke-jaihe-sajanwa-chh", "bullet-se-leke-jaihe-sajanwa-nisha-dubey-201", "nishadubey-netrahin-chhathgeet", "parab-karab-ho-nisha-dubey-parab-karab-2017"],
  },
  {
    slug: "riteshn-pandey-chhath",
    emoji: "🕉️",
    title: "रितेश पांडे छठ गीत",
    englishTitle: "Ritesh Pandey Chhath Geet",
    blurb: "Ritesh Pandey ke chhath geet — ghar-ghar bajne wale.",
    songIds: ["chhath-kare-aai", "karelu-chhath-baratiya", "maath-pa-daurawa-leke", "ritesh-pandey", "ritesh-pandey-nirdhan-tiwaiya-parv-mai", "ritesh-pandey-aragh-bera-bital-jata", "ritesh-pandey-anjali-yadav-2020", "ritesh-pandey-kathin-baratiya-2017", "ritesh-pandey-pamela-jain-kare-aawatani", "he-chathi-maiya-ritesh-pandey-songs-2015"],
  },
];

export const playlistBySlug = new Map(playlists.map((p) => [p.slug, p]));

import { songById } from './songs';

/** Resolve a playlist's song ids into real song objects. */
export const playlistSongs = (playlist) =>
  playlist.songIds.map((id) => songById.get(id)).filter(Boolean);
