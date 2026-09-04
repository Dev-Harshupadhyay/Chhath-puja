// ─────────────────────────────────────────────────────────────
// Artists — DERIVED from the song catalogue. No invented bios.
// ─────────────────────────────────────────────────────────────
// Every field here is computed from real catalogue data:
//   songCount / channels / seconds / topSongs all come from the
//   verified song list. `bio` is intentionally empty — we do not
//   invent biographies, so the UI omits the block when empty.
// ─────────────────────────────────────────────────────────────

export const artists = [
  {
    name: "Sharda Sinha",
    slug: "sharda-sinha",
    songCount: 5,
    channels: ["T-Series Bhakti Sagar", "Worldwide Records Bhojpuri"],
    bio: '',
    topSongIds: ["chhathi-maiya-jukebox", "kelwa-ke-paat-par", "pahile-pahil-chhathi-maiya", "hey-chhathi-maiya", "ho-deenanath"],
  },
  {
    name: "Khesari Lal Yadav",
    slug: "khesari-lal-yadav",
    songCount: 4,
    channels: ["Aadishakti Films", "Global Music Junction", "Khesari Music World"],
    bio: '',
    topSongIds: ["chhath-ghate-chali", "chhathi-maiya-khesari", "bihari-piya", "pari-khatir-piyari-piya"],
  },
  {
    name: "Pawan Singh",
    slug: "pawan-singh",
    songCount: 4,
    channels: ["Maa Amma Films Bhakti", "T-Series Hamaar Bhojpuri", "WWR Bhojpuri Bhakti Geet", "Wave Music"],
    bio: '',
    topSongIds: ["jode-jode-falwa", "kawna-kalamwa-se-likhla-karamwa", "chhathi-mai-ke-ghatwa-pe", "dhaniya-hamar-naya-baadi"],
  },
  {
    name: "Anuradha Paudwal",
    slug: "anuradha-paudwal",
    songCount: 3,
    channels: ["T-Series Bhakti Sagar"],
    bio: '',
    topSongIds: ["marbo-re-sugwa", "uga-hai-suraj-dev", "kaanch-hi-baans-ke-bahangiya"],
  },
  {
    name: "Kalpana Patowary",
    slug: "kalpana-patowary",
    songCount: 3,
    channels: ["T-Series Bhakti Sagar", "Trimurti Music World", "Urgent Music"],
    bio: '',
    topSongIds: ["ugi-hey-dinanath-kalpana", "jode-jode-supwa", "darshan-dekhai-dihi"],
  },
  {
    name: "Maithili Thakur",
    slug: "maithili-thakur",
    songCount: 3,
    channels: ["Maithili Thakur", "Times Music Spiritual"],
    bio: '',
    topSongIds: ["kerwa-ke-paat-par-maithili", "sona-surujdev", "sona-satkuniya-ho-dinanath"],
  },
  {
    name: "Ritesh Pandey",
    slug: "ritesh-pandey",
    songCount: 3,
    channels: ["Aadishakti Films", "Saregama Hum Bhojpuri Bhakti", "Worldwide Records Bhojpuri"],
    bio: '',
    topSongIds: ["chhath-kare-aai", "karelu-chhath-baratiya", "maath-pa-daurawa-leke"],
  },
  {
    name: "Anu Dubey",
    slug: "anu-dubey",
    songCount: 2,
    channels: ["Anu Dubey Entertainment", "Bhojpuri Bhakti Vandana"],
    bio: '',
    topSongIds: ["kopi-kopi-boleli-chhathi-maiya", "sone-ke-katorwa"],
  },
  {
    name: "Arvind Akela Kallu",
    slug: "arvind-akela-kallu",
    songCount: 2,
    channels: ["Wave Music Bhakti"],
    bio: '',
    topSongIds: ["bahangi-chhathi-mai-ke", "kekra-khatir-naa"],
  },
  {
    name: "Nisha Dubey",
    slug: "nisha-dubey",
    songCount: 2,
    channels: ["SrisTech Bhojpuri", "Worldwide Records Bhojpuri"],
    bio: '',
    topSongIds: ["amar-rahe-piyawa-hamar", "ugi-he-dinanath-nisha"],
  },
  {
    name: "Shilpi Raj",
    slug: "shilpi-raj",
    songCount: 2,
    channels: ["Shiva Shiv Music", "Worldwide Records Bhojpuri"],
    bio: '',
    topSongIds: ["aahe-dev-kavan-dev", "kholi-najariya"],
  },
  {
    name: "Amrita Dixit",
    slug: "amrita-dixit",
    songCount: 1,
    channels: ["Aarav Films"],
    bio: '',
    topSongIds: ["daura-ghate-pahuchai"],
  },
  {
    name: "Kanchan Yadav",
    slug: "kanchan-yadav",
    songCount: 1,
    channels: ["Bhojpuri Vox"],
    bio: '',
    topSongIds: ["uga-ho-suraj-deva"],
  },
  {
    name: "Sonu Nigam",
    slug: "sonu-nigam",
    songCount: 1,
    channels: ["I Believe Music"],
    bio: '',
    topSongIds: ["jai-chhathi-maiya-sonu-nigam"],
  },
  {
    name: "Traditional",
    slug: "traditional",
    songCount: 1,
    channels: ["Star Video"],
    bio: '',
    topSongIds: ["suna-chhathi-maiya"],
  },
];

export const artistBySlug = new Map(artists.map((a) => [a.slug, a]));
export const songsByArtist = (artistName, allSongs) =>
  allSongs.filter((s) => s.artist === artistName);
