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
    songIds: ["uga-hai-suraj-dev", "ho-deenanath", "uga-ho-suraj-deva", "chhathi-maiya-jukebox", "dhaniya-hamar-naya-baadi", "bihari-piya", "chhath-kare-aai", "ugi-hey-dinanath-kalpana", "darshan-dekhai-dihi", "ugi-he-dinanath-nisha", "kekra-khatir-naa", "sona-satkuniya-ho-dinanath", "sona-surujdev"],
  },
  {
    slug: "sandhya-arghya-geet",
    emoji: "🌇",
    title: "संध्या अर्घ्य गीत",
    englishTitle: "Sandhya Arghya Geet",
    blurb: "Dhalte suraj ko arghya dete waqt bajne wale geet.",
    songIds: ["kelwa-ke-paat-par", "kaanch-hi-baans-ke-bahangiya", "marbo-re-sugwa", "jode-jode-supwa", "kawna-kalamwa-se-likhla-karamwa", "chhathi-mai-ke-ghatwa-pe", "chhath-ghate-chali", "maath-pa-daurawa-leke", "amar-rahe-piyawa-hamar", "kholi-najariya", "bahangi-chhathi-mai-ke", "kerwa-ke-paat-par-maithili"],
  },
  {
    slug: "usha-arghya-geet",
    emoji: "🌄",
    title: "उषा अर्घ्य गीत",
    englishTitle: "Usha Arghya Geet",
    blurb: "Bhor ke ujale mein ugte suraj ko samarpit geet.",
    songIds: ["uga-hai-suraj-dev", "ho-deenanath", "uga-ho-suraj-deva", "ugi-hey-dinanath-kalpana", "darshan-dekhai-dihi", "ugi-he-dinanath-nisha", "sona-satkuniya-ho-dinanath", "sona-surujdev"],
  },
  {
    slug: "chhathi-maiya-geet",
    emoji: "🙏",
    title: "छठी मईया के गीत",
    englishTitle: "Chhathi Maiya Ke Geet",
    blurb: "Chhathi Maiya ki aaradhna aur vinti ke geet.",
    songIds: ["pahile-pahil-chhathi-maiya", "hey-chhathi-maiya", "suna-chhathi-maiya", "chhathi-maiya-jukebox", "chhathi-mai-ke-ghatwa-pe", "jai-chhathi-maiya-sonu-nigam", "chhath-ghate-chali", "chhathi-maiya-khesari", "chhath-kare-aai", "karelu-chhath-baratiya", "kopi-kopi-boleli-chhathi-maiya", "bahangi-chhathi-mai-ke"],
  },
  {
    slug: "sharda-sinha-special",
    emoji: "🎶",
    title: "शारदा सिन्हा स्पेशल",
    englishTitle: "Sharda Sinha Special",
    blurb: "Chhath ki awaaz — Sharda Sinha ke lokpriya geet.",
    songIds: ["kelwa-ke-paat-par", "pahile-pahil-chhathi-maiya", "ho-deenanath", "hey-chhathi-maiya", "chhathi-maiya-jukebox"],
  },
  {
    slug: "pawan-singh-chhath",
    emoji: "🎤",
    title: "पवन सिंह छठ गीत",
    englishTitle: "Pawan Singh Chhath Geet",
    blurb: "Pawan Singh ke chhath geet, ghat ki dhun ke saath.",
    songIds: ["kawna-kalamwa-se-likhla-karamwa", "chhathi-mai-ke-ghatwa-pe", "jode-jode-falwa", "dhaniya-hamar-naya-baadi"],
  },
  {
    slug: "sadabahar-chhath-geet",
    emoji: "❤️",
    title: "सदाबहार छठ गीत",
    englishTitle: "Sadabahar Chhath Geet",
    blurb: "Wo geet jo har saal chhath par sabse zyada bajte hain.",
    songIds: ["uga-hai-suraj-dev", "kelwa-ke-paat-par", "pahile-pahil-chhathi-maiya", "kaanch-hi-baans-ke-bahangiya", "kawna-kalamwa-se-likhla-karamwa", "jode-jode-falwa", "jai-chhathi-maiya-sonu-nigam", "chhath-ghate-chali", "ugi-hey-dinanath-kalpana", "sona-satkuniya-ho-dinanath"],
  },
  {
    slug: "kharna-special",
    emoji: "🪔",
    title: "खरना स्पेशल",
    englishTitle: "Kharna Special",
    blurb: "Kharna ki shaam, kheer ki mehak aur vrat ki taiyari.",
    songIds: ["daura-ghate-pahuchai", "suna-chhathi-maiya", "jode-jode-falwa", "pari-khatir-piyari-piya", "karelu-chhath-baratiya", "sone-ke-katorwa", "aahe-dev-kavan-dev"],
  },
  {
    slug: "ghat-ke-geet",
    emoji: "🌊",
    title: "घाट पर बजने वाले गीत",
    englishTitle: "Ghat Par Bajne Wale Geet",
    blurb: "Ghat ki kashti, diyon ki roshni aur bheed mein goonjte geet.",
    songIds: ["ho-deenanath", "marbo-re-sugwa", "jode-jode-supwa", "uga-ho-suraj-deva", "chhathi-mai-ke-ghatwa-pe", "maath-pa-daurawa-leke", "darshan-dekhai-dihi", "amar-rahe-piyawa-hamar", "ugi-he-dinanath-nisha", "kholi-najariya", "bahangi-chhathi-mai-ke", "kerwa-ke-paat-par-maithili", "sona-surujdev"],
  },
];

export const playlistBySlug = new Map(playlists.map((p) => [p.slug, p]));

import { songById } from './songs';

/** Resolve a playlist's song ids into real song objects. */
export const playlistSongs = (playlist) =>
  playlist.songIds.map((id) => songById.get(id)).filter(Boolean);
