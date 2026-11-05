/* Mors's Music Box — SillyTavern extension
 * A floating music player that plays the playlist stored inside the character card
 * (data.extensions.mors_music_box). Default look is cloned from Cozy Cat's music screen.
 */

const MODULE = 'mors-music-box';
const CARD_KEY = 'mors_music_box';
const POS_KEY = `${MODULE}:btnPos`;
const NO_COVER = 'https://i.postimg.cc/4yQghhGj/none.png';

/* ---------- themes ---------- */

const PAPER = "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")";
const PAPER_LIGHT = PAPER.replace('0.1', '0.06');
const PAPER_DARK = PAPER.replace('%239C92AC', '%23ffffff').replace('0.1', '0.045'); // same paper lines, for dark screens

/* Fallback for any colour/font a theme JSON leaves out (the old Cozy look) — not offered as a theme. */
const BASE_THEME = {
    name: 'Cozy',
    colors: {
      screen: '#F7F5F0', frame: '#111827', text: '#2C2420', muted: '#9ca3af', soft: '#6b7280',
      accent: '#a78bfa', track: '#e5e7eb', play: '#2C2420', playIcon: '#F7F5F0',
      vinyl: '#111111', groove: '#222222', stylus: '#9ca3af', stylusKnob: '#6b7280', row: 'rgba(44,36,32,0.05)',
    },
    fonts: { tag: 'Cinzel', title: 'Playfair Display', body: 'DM Sans', sign: 'La Belle Aurore' },
    texture: 'paper',
  };

const DEFAULT_THEME = 'rose';

const BUILTIN_THEMES = {
  rose: {
    name: 'Rose',
    colors: {
      screen: '#fbf1f3', frame: '#3a2430', text: '#3a2430', muted: '#b9959f', soft: '#8c6873',
      accent: '#d58aa0', track: '#f0dde2', play: '#3a2430', playIcon: '#fbf1f3',
      vinyl: '#1a1115', groove: '#2a1b21', stylus: '#c9a3ad', stylusKnob: '#8c6873', row: 'rgba(213,138,160,0.10)',
    },
    fonts: { tag: 'Cinzel', title: 'Playfair Display', body: 'DM Sans', sign: 'La Belle Aurore' },
    texture: 'paper',
  },
  elegant: {
    name: 'Elegant',
    colors: {
      screen: '#121826', frame: '#0b0f17', text: '#ece4d4', muted: '#8f8778', soft: '#a59d8e',
      accent: '#c9a96e', track: '#2c3650', play: '#c9a96e', playIcon: '#121826',
      vinyl: '#0a0a0a', groove: '#1d1d1d', stylus: '#a88452', stylusKnob: '#c9a96e', row: 'rgba(201,169,110,0.08)',
    },
    fonts: { tag: 'Cinzel', title: 'Cormorant Garamond', body: 'DM Sans', sign: 'La Belle Aurore' },
    texture: 'paper-dark',
  },
  midnight: {
    name: 'Midnight',
    colors: {
      screen: '#232323', frame: '#0e0e0e', text: '#ffffff', muted: '#9a9a9a', soft: '#bdbdbd',
      accent: '#ffffff', track: '#3d3d3d', play: '#ffffff', playIcon: '#232323',
      vinyl: '#0b0b0b', groove: '#1b1b1b', stylus: '#8a8a8a', stylusKnob: '#cfcfcf', row: 'rgba(255,255,255,0.06)',
    },
    fonts: { tag: 'Cinzel', title: 'Playfair Display', body: 'DM Sans', sign: 'La Belle Aurore' },
    texture: 'paper-dark',
  },
};

const DEFAULTS = {
  enabled: true,
  theme: DEFAULT_THEME,
  followCardTheme: true,
  autoplay: false,
  volume: 1,
  shuffle: false,
  repeat: 'all', // all | one | off
  customThemes: {}, // id -> theme object (imported JSON)
  lang: null, // 'th' | 'en' | null = follow SillyTavern's language
};

/* ---------- language (TH / EN) ---------- */

const I18N = {
  th: {
    themeToast: 'ธีม: {name}',
    noWriteField: 'SillyTavern เวอร์ชันนี้ไม่มี writeExtensionField ลองอัปเดต ST',
    cantPlay: 'เล่นไม่ได้: {title} — ลิงก์อาจไม่ใช่ลิงก์ไฟล์ตรง',
    tapPlay: 'แตะปุ่ม ▶ เพื่อเริ่มเล่น',
    themeBtnTitle: 'แตะเพื่อสลับธีม · กดค้างเพื่อเลือก',
    langBtnTitle: 'เปลี่ยนภาษา (English)',
    editTitle: 'แก้เพลย์ลิสต์',
    closeTitle: 'ปิด',
    back: 'กลับ',
    noSongs: 'ยังไม่มีเพลง',
    noSongsHint: 'แตะ ✎ มุมขวาบนเพื่อเพิ่มเพลงให้บอทตัวนี้',
    openChatFirst: 'เปิดแชทกับบอทก่อนนะ',
    addSong: 'เพิ่มเพลง',
    pasteMany: 'วางหลายเพลงทีเดียว',
    onePerLine: 'หนึ่งบรรทัดต่อหนึ่งเพลง',
    addToList: 'เพิ่มลงลิสต์',
    cardSettings: 'ตั้งค่าการ์ด',
    tagLabel: 'ป้ายหลัง NOW PLAYING',
    tagPh: 'เช่น VOL.03',
    signLabel: 'ข้อความลายมือด้านล่าง',
    cardTheme: 'ธีมประจำการ์ด',
    cardThemeNone: 'ไม่กำหนด (ใช้ธีมของผู้เล่น)',
    inCard: '(ในการ์ด)',
    cardThemeHint: 'ถ้าเลือกธีมที่ Import มาเอง ตัวธีมจะถูกฝังไปในการ์ดด้วย คนที่โหลดการ์ดไปจะเห็นธีมเดียวกัน',
    cancel: 'ยกเลิก',
    titlePh: 'ชื่อเพลง',
    artistPh: 'ศิลปิน (ไม่ใส่ก็ได้)',
    urlPh: 'https://… ลิงก์ไฟล์เสียงตรง',
    moveUp: 'ขึ้น',
    moveDown: 'ลง',
    remove: 'ลบ',
    importedSongs: 'เพิ่ม {n} เพลงจากไฟล์แล้ว (กด Save to Card เพื่อบันทึก)',
    badPlaylistFile: 'อ่านไฟล์ไม่ได้ ต้องเป็น JSON ที่มี tracks',
    bulkFormat: 'ใส่แบบ ชื่อเพลง | ลิงก์ ทีละบรรทัด (ลิงก์ขึ้นต้นด้วย http)',
    badLinks: 'มีลิงก์ที่ไม่ได้ขึ้นต้นด้วย http/https',
    savedCard: 'บันทึก {n} เพลงลงการ์ด {name} แล้ว',
    saveFailed: 'บันทึกไม่สำเร็จ: {err}',
    badJson: 'JSON ไม่ถูกต้อง: {err}',
    oneThemeOnly: 'ต้องเป็น { … } หนึ่งธีม',
    badTheme: 'อ่านธีมไม่ได้',
    editThemeH: 'แก้ไขธีม: {name}',
    newThemeH: 'สร้างธีมใหม่',
    themeHint: 'กรอกเฉพาะช่องที่อยากเปลี่ยน ช่องที่เว้นว่าง ("") จะใช้ค่าพื้นฐาน · ความหมายแต่ละค่าดูใน THEME-GUIDE.md · ตัดแขนเข็ม "stylus": false',
    themeSaved: 'บันทึกธีม {name} แล้ว',
    themeCreated: 'สร้างธีม {name} แล้ว',
    builtinNoEdit: 'ธีมตั้งต้นแก้ไม่ได้ กด + เพื่อสร้างธีมใหม่',
    builtinNoDelete: 'ธีมตั้งต้นลบไม่ได้',
    confirmDelete: 'ลบธีม "{name}" ?',
    themeDeleted: 'ลบธีม {name} แล้ว',
    themeAdded: 'เพิ่มธีม {name} แล้ว',
    badThemeFile: 'อ่านไฟล์ธีมไม่ได้',
    loadFailed: 'โหลดปุ่มไม่สำเร็จ: {err}',
  },
  en: {
    themeToast: 'Theme: {name}',
    noWriteField: "This SillyTavern version doesn't support writeExtensionField. Please update ST.",
    cantPlay: "Can't play: {title} — the link may not be a direct audio file.",
    tapPlay: 'Tap ▶ to start playing',
    themeBtnTitle: 'Tap to switch theme · press and hold to choose',
    langBtnTitle: 'Change language (ภาษาไทย)',
    editTitle: 'Edit playlist',
    closeTitle: 'Close',
    back: 'Back',
    noSongs: 'No songs yet',
    noSongsHint: "Tap ✎ in the top-right corner to add songs for this bot",
    openChatFirst: 'Open a chat with a bot first',
    addSong: 'Add song',
    pasteMany: 'Paste many songs',
    onePerLine: 'One song per line',
    addToList: 'Add to list',
    cardSettings: 'Card settings',
    tagLabel: 'Label after NOW PLAYING',
    tagPh: 'e.g. VOL.03',
    signLabel: 'Handwritten line at the bottom',
    cardTheme: "Card's theme",
    cardThemeNone: "None (use the player's theme)",
    inCard: '(in card)',
    cardThemeHint: "If you pick a theme you imported, the whole theme is saved into the card, so anyone who loads the card sees it too.",
    cancel: 'Cancel',
    titlePh: 'Song title',
    artistPh: 'Artist (optional)',
    urlPh: 'https://… direct audio link',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    importedSongs: 'Added {n} songs from the file (tap Save to Card to keep them)',
    badPlaylistFile: "Couldn't read the file. It must be JSON with tracks.",
    bulkFormat: 'Use one line per song: Title | link (the link must start with http)',
    badLinks: "Some links don't start with http/https",
    savedCard: 'Saved {n} songs to {name}',
    saveFailed: 'Save failed: {err}',
    badJson: 'Invalid JSON: {err}',
    oneThemeOnly: 'Must be one theme: { … }',
    badTheme: "Couldn't read this theme",
    editThemeH: 'Edit theme: {name}',
    newThemeH: 'New theme',
    themeHint: 'Fill in only what you want to change. Blank ("") uses the default · See THEME-GUIDE.md for what each value does · Remove the tone arm with "stylus": false',
    themeSaved: 'Saved theme {name}',
    themeCreated: 'Created theme {name}',
    builtinNoEdit: "Built-in themes can't be edited. Tap + to make a new one.",
    builtinNoDelete: "Built-in themes can't be deleted",
    confirmDelete: 'Delete theme "{name}"?',
    themeDeleted: 'Deleted theme {name}',
    themeAdded: 'Added theme {name}',
    badThemeFile: "Couldn't read the theme file",
    loadFailed: 'Failed to load the button: {err}',
  },
};

/** Current language: the player's own choice, otherwise SillyTavern's language, otherwise the browser's. */
function lang() {
  let s = null;
  try { s = settings().lang; } catch (e) { /* not ready */ }
  if (s === 'th' || s === 'en') return s;
  let guess = '';
  try { guess = localStorage.getItem('language') || ''; } catch (e) { /* ignore */ }
  if (!guess) guess = navigator.language || '';
  return /^th/i.test(guess) ? 'th' : 'en';
}

/** Translate: t('savedCard', { n: 3, name: 'Karl' }) */
function t(key, vars) {
  const table = I18N[lang()] || I18N.en;
  let str = table[key] != null ? table[key] : (I18N.en[key] != null ? I18N.en[key] : key);
  if (vars) Object.keys(vars).forEach((k) => { str = str.split(`{${k}}`).join(String(vars[k])); });
  return str;
}

function toggleLang() {
  const s = settings();
  s.lang = lang() === 'th' ? 'en' : 'th';
  save();
  render();
}

/* ---------- state ---------- */

const state = {
  charKey: null,
  charName: '',
  avatar: '',
  card: { tracks: [], theme: null, tag: '', sign: '' },
  tracks: [],
  index: -1,
  history: [],
  nextIndex: null,
  errors: 0,
  open: false,
  openedAt: 0,
  view: 'list',
};

let audio = null;     // the element that is playing (or paused) right now
let preloader = null; // a second element that quietly loads the next song
let preloadTimer = null;

/* ---------- icons (inline SVG so every theme can colour them) ---------- */

const svg = (d, size = 24) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
const ICON = {
  play: svg('M8 5v14l11-7z', 26),
  pause: svg('M6 19h4V5H6v14zm8-14v14h4V5h-4z', 26),
  prev: svg('M19 20L9 12l10-8v16zM5 4h2v16H5V4z'),
  next: svg('M5 4l10 8-10 8V4zm14 0h2v16h-2V4z'),
  shuffle: svg('M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z', 22),
  repeat: svg('M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z', 22),
  repeatOne: svg('M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z', 22),
  edit: svg('M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z', 18),
  close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  back: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>',
  up: svg('M7 14l5-5 5 5z', 22),
  down: svg('M7 10l5 5 5-5z', 22),
  trash: svg('M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z', 18),
  plus: svg('M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', 18),
  music: svg('M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z', 22),
  palette: svg('M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z', 18),
};

/* ---------- helpers ---------- */

const ctx = () => (typeof SillyTavern !== 'undefined' && SillyTavern.getContext ? SillyTavern.getContext() : null);
const clone = (o) => JSON.parse(JSON.stringify(o));

function settings() {
  const c = ctx();
  if (!c || !c.extensionSettings) return clone(DEFAULTS);
  if (!c.extensionSettings[MODULE]) c.extensionSettings[MODULE] = {};
  const s = c.extensionSettings[MODULE];
  Object.keys(DEFAULTS).forEach((k) => { if (s[k] === undefined) s[k] = clone(DEFAULTS[k]); });
  if (s.theme === 'gilded' || s.theme === 'cozy') s.theme = DEFAULT_THEME; // renamed / removed
  return s;
}

function save() { try { const c = ctx(); if (c && c.saveSettingsDebounced) c.saveSettingsDebounced(); } catch (e) { /* ignore */ } }

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function toast(type, msg) {
  if (typeof toastr !== 'undefined' && toastr[type]) toastr[type](msg, "Mors's Music Box");
  else console.log(`[${MODULE}]`, msg);
}

function fmt(sec) {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

/** Turn common share links into direct-play links. */
function normalizeUrl(raw) {
  const url = String(raw || '').trim();
  if (!url) return '';
  try {
    const u = new URL(url);
    if (/dropbox\.com$/.test(u.hostname)) { u.searchParams.delete('dl'); u.searchParams.set('raw', '1'); return u.toString(); }
    if (u.hostname === 'github.com' && u.pathname.indexOf('/blob/') > -1) return `https://raw.githubusercontent.com${u.pathname.replace('/blob/', '/')}`;
    const gd = u.hostname === 'drive.google.com' && u.pathname.match(/\/file\/d\/([^/]+)/);
    if (gd) return `https://drive.google.com/uc?export=download&id=${gd[1]}`;
  } catch (e) { /* not a full URL */ }
  return url;
}

function titleFromUrl(url) {
  try {
    const last = decodeURIComponent(new URL(url, location.href).pathname.split('/').pop() || '');
    return last.replace(/\.[a-z0-9]{2,4}$/i, '').replace(/[_-]+/g, ' ').trim() || 'Untitled';
  } catch (e) { return 'Untitled'; }
}

function cleanTracks(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((t) => (typeof t === 'string' ? { url: t } : t))
    .filter((t) => t && typeof t.url === 'string' && t.url.trim())
    .map((t) => ({ title: String(t.title || '').trim() || titleFromUrl(t.url), artist: String(t.artist || '').trim(), url: t.url.trim() }));
}

/* ---------- theme registry ---------- */

function slug(s) { return String(s || 'theme').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'theme'; }

/** Validate + fill a theme object (from JSON) against the Cozy defaults. */
function normalizeTheme(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const base = BASE_THEME;
  const t = {
    name: String(raw.name || 'Custom Theme').slice(0, 40),
    colors: Object.assign({}, base.colors),
    fonts: Object.assign({}, base.fonts),
    texture: 'paper',
  };
  const okColor = (v) => typeof v === 'string' && v.trim() !== '' && v.length < 60 && !/[;{}<>]|url\s*\(/i.test(v);
  if (raw.colors && typeof raw.colors === 'object') {
    Object.keys(base.colors).forEach((k) => { if (okColor(raw.colors[k])) t.colors[k] = raw.colors[k]; });
    if (okColor(raw.colors.button)) t.colors.button = raw.colors.button;
    if (okColor(raw.colors.buttonIcon)) t.colors.buttonIcon = raw.colors.buttonIcon;
    if (okColor(raw.colors.barTitle)) t.colors.barTitle = raw.colors.barTitle;
    if (okColor(raw.colors.barArtist)) t.colors.barArtist = raw.colors.barArtist;
  }
  if (raw.fonts && typeof raw.fonts === 'object') {
    Object.keys(base.fonts).forEach((k) => { if (typeof raw.fonts[k] === 'string' && /^[\w .'-]{1,40}$/.test(raw.fonts[k])) t.fonts[k] = raw.fonts[k]; });
  }
  if (['paper', 'paper-light', 'paper-dark', 'none'].indexOf(raw.texture) > -1) t.texture = raw.texture;
  else if (isImageUrl(raw.texture)) t.texture = raw.texture;
  if (raw.colors && okColor(raw.colors.line)) t.colors.line = raw.colors.line;

  // full-screen background picture (sits under the paper texture)
  const bg = typeof raw.background === 'string' ? { image: raw.background } : raw.background;
  if (bg && isImageUrl(bg.image)) {
    t.background = { image: bg.image, fit: bg.fit === 'tile' ? 'tile' : 'cover' };
    if (okColor(bg.dim)) t.background.dim = bg.dim; // colour laid over the picture to mute it
  }

  // the record: picture instead of the black vinyl, grooves on/off, bot avatar label on/off
  if (raw.disc && typeof raw.disc === 'object') {
    t.disc = {};
    if (isImageUrl(raw.disc.image)) t.disc.image = raw.disc.image;
    if (typeof raw.disc.grooves === 'boolean') t.disc.grooves = raw.disc.grooves;
    if (okColor(raw.disc.glow)) t.disc.glow = raw.disc.glow;
    if (raw.disc.label === false) t.disc.label = false;
  }

  if (raw.titleItalic === false) t.titleItalic = false;

  // the tone arm: false = remove it, or a picture with an optional size / position (px)
  if (raw.stylus === false || (raw.stylus && raw.stylus.show === false)) t.stylus = { show: false };
  else if (raw.stylus && typeof raw.stylus === 'object' && isImageUrl(raw.stylus.image)) {
    const num = (v, lo, hi) => (typeof v === 'number' && isFinite(v) ? clamp(v, lo, hi) : undefined);
    t.stylus = {
      image: raw.stylus.image,
      width: num(raw.stylus.width, 10, 220),
      height: num(raw.stylus.height, 20, 260),
      top: num(raw.stylus.top, -200, 200),
      right: num(raw.stylus.right, -200, 200),
    };
  }
  return t;
}

/** https links, or pictures packed into the theme file itself (data:image/…;base64) so a theme can be one file. */
function isImageUrl(v) {
  if (typeof v !== 'string') return false;
  if (/^https:\/\/[^\s"'()<>\\]+$/.test(v)) return true;
  return v.length < 2000000 && /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(v);
}

const THEME_ALIASES = { gilded: 'elegant', cozy: 'rose' }; // renamed themes keep working on older cards

function allThemes() {
  return Object.assign({}, BUILTIN_THEMES, settings().customThemes || {});
}

function themeById(id) {
  const all = allThemes();
  return all[id] || all[THEME_ALIASES[id]] || null;
}

function activeTheme() {
  const s = settings();
  const cardTheme = state.card.theme;
  if (s.followCardTheme && cardTheme) {
    if (typeof cardTheme === 'string' && themeById(cardTheme)) return themeById(cardTheme);
    if (typeof cardTheme === 'object') { const t = normalizeTheme(cardTheme); if (t) return t; }
  }
  return themeById(s.theme) || BUILTIN_THEMES[DEFAULT_THEME];
}

const loadedFonts = {};
/** Load a Google Font. Not every font has italics or a 600 weight, and Google rejects the whole request
 *  if you ask for one that doesn't exist, so step down to simpler requests until one works. */
function ensureFonts(theme) {
  const builtin = ['Cinzel', 'Playfair Display', 'DM Sans', 'La Belle Aurore', 'Cormorant Garamond'];
  Object.values(theme.fonts).forEach((f) => {
    if (!f || builtin.indexOf(f) > -1 || loadedFonts[f]) return;
    loadedFonts[f] = true;
    const fam = encodeURIComponent(f).replace(/%20/g, '+');
    const tries = [`${fam}:ital,wght@0,400;0,600;1,600`, `${fam}:wght@400;600`, fam];
    const attempt = (n) => {
      if (n >= tries.length) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${tries[n]}&display=swap`;
      link.onerror = () => { link.remove(); attempt(n + 1); };
      document.head.appendChild(link);
    };
    attempt(0);
  });
}

function themeVars(theme) {
  const c = theme.colors;
  const tex = theme.texture === 'paper' ? PAPER : theme.texture === 'paper-light' ? PAPER_LIGHT : theme.texture === 'paper-dark' ? PAPER_DARK : theme.texture === 'none' ? 'none' : `url("${theme.texture}")`;
  const f = (name, fallback) => `"${name}", ${fallback}`;
  return {
    '--mmb-screen': c.screen, '--mmb-frame': c.frame, '--mmb-text': c.text, '--mmb-muted': c.muted, '--mmb-soft': c.soft,
    '--mmb-accent': c.accent, '--mmb-track': c.track, '--mmb-play': c.play, '--mmb-play-icon': c.playIcon,
    '--mmb-vinyl': c.vinyl, '--mmb-groove': c.groove, '--mmb-stylus': c.stylus, '--mmb-stylus-knob': c.stylusKnob, '--mmb-row': c.row,
    '--mmb-bar-title': c.barTitle || '', '--mmb-bar-artist': c.barArtist || '', '--mmb-bar-artist-op': c.barArtist ? '1' : '',
    '--mmb-texture': tex,
    '--mmb-line': c.line || c.track,
    '--mmb-bg-image': theme.background ? `url("${theme.background.image}")` : 'none',
    '--mmb-bg-size': theme.background && theme.background.fit === 'tile' ? 'auto' : 'cover',
    '--mmb-bg-dim': theme.background && theme.background.dim ? theme.background.dim : 'transparent',
    '--mmb-disc-glow': theme.disc && theme.disc.glow ? `0 0 36px 6px ${theme.disc.glow}` : '',
    '--mmb-title-style': theme.titleItalic === false ? 'normal' : 'italic',
    '--mmb-disc-image': theme.disc && theme.disc.image ? `url("${theme.disc.image}")` : 'none',
    '--mmb-stylus-image': theme.stylus && theme.stylus.image ? `url("${theme.stylus.image}")` : 'none',
    '--mmb-stylus-w': theme.stylus && theme.stylus.width != null ? `${theme.stylus.width}px` : '',
    '--mmb-stylus-h': theme.stylus && theme.stylus.height != null ? `${theme.stylus.height}px` : '',
    '--mmb-stylus-top': theme.stylus && theme.stylus.top != null ? `${theme.stylus.top}px` : '',
    '--mmb-stylus-right': theme.stylus && theme.stylus.right != null ? `${theme.stylus.right}px` : '',
    '--mmb-f-tag': f(theme.fonts.tag, '"Trirong", serif'),
    '--mmb-f-title': f(theme.fonts.title, '"Trirong", serif'),
    '--mmb-f-body': f(theme.fonts.body, '"Sarabun", system-ui, sans-serif'),
    '--mmb-f-sign': f(theme.fonts.sign, '"Mali", cursive'),
  };
}

function applyTheme() {
  const theme = activeTheme();
  ensureFonts(theme);
  const vars = themeVars(theme);
  const ov = document.getElementById('mmb-overlay');
  if (ov) {
    Object.keys(vars).forEach((k) => { if (vars[k] === '') ov.style.removeProperty(k); else ov.style.setProperty(k, vars[k]); });
    const disc = theme.disc || {};
    const stylus = theme.stylus || {};
    ov.toggleAttribute('data-disc-image', !!disc.image);
    ov.toggleAttribute('data-no-grooves', disc.grooves === false || !!disc.image && disc.grooves !== true);
    ov.toggleAttribute('data-no-label', disc.label === false);
    ov.toggleAttribute('data-no-stylus', stylus.show === false);
    ov.toggleAttribute('data-stylus-image', !!stylus.image);
  }
  const btn = document.getElementById('mmb-btn');
  if (btn) {
    btn.style.setProperty('--mmb-btn-bg', theme.colors.button || '');
    btn.style.setProperty('--mmb-btn-fg', theme.colors.buttonIcon || '');
  }
}

/** Palette button: step through every installed theme (overrides the card theme while you're picking). */
function cycleTheme() {
  const s = settings();
  const keys = Object.keys(allThemes());
  const cur = keys.indexOf(s.theme);
  s.theme = keys[(cur + 1) % keys.length];
  s.followCardTheme = false;
  save(); applyTheme(); syncSettingsUI();
  toast('info', t('themeToast', { name: allThemes()[s.theme].name }));
}

function openThemeMenu() {
  const ov = document.getElementById('mmb-overlay');
  if (!ov) return;
  const menu = ov.querySelector('.mmb-theme-menu');
  const cur = activeTheme();
  const themes = allThemes();
  menu.innerHTML = `<div class="mmb-tag">THEME</div>` + Object.keys(themes).map((k) => {
    const t = themes[k];
    const on = t === cur;
    return `<button type="button" class="mmb-theme-item${on ? ' on' : ''}" data-act="pick-theme" data-theme="${esc(k)}">
      <span class="mmb-theme-sw" style="background:${esc(t.colors.screen)};box-shadow:inset 0 0 0 1px ${esc(t.colors.track)}"><i style="background:${esc(t.colors.accent)}"></i></span>
      <span class="mmb-theme-name">${esc(t.name)}</span>
      <span class="mmb-theme-check">${on ? '✓' : ''}</span>
    </button>`;
  }).join('');
  menu.hidden = false;
}

function closeThemeMenu() {
  const menu = document.querySelector('#mmb-overlay .mmb-theme-menu');
  if (menu) menu.hidden = true;
}

function pickTheme(id) {
  const s = settings();
  if (!allThemes()[id]) return;
  s.theme = id;
  s.followCardTheme = false; // picking by hand overrides the card theme
  save(); applyTheme(); syncSettingsUI();
  closeThemeMenu();
}

/* ---------- character / card ---------- */

function currentChar() {
  const c = ctx();
  if (!c || c.groupId || c.characterId === undefined || c.characterId === null) return null;
  return (c.characters && c.characters[c.characterId]) || null;
}

function readCard(char) {
  const data = char && char.data && char.data.extensions ? char.data.extensions[CARD_KEY] : null;
  if (!data) return { tracks: [], theme: null, tag: '', sign: '' };
  if (Array.isArray(data)) return { tracks: cleanTracks(data), theme: null, tag: '', sign: '' };
  return {
    tracks: cleanTracks(data.tracks),
    theme: data.theme || null,
    tag: String(data.tag || '').slice(0, 40),
    sign: String(data.sign || '').slice(0, 80),
  };
}

async function writeCard(payload) {
  const c = ctx();
  const char = currentChar();
  if (!c || !char) throw new Error('No character chat open');
  if (typeof c.writeExtensionField !== 'function') throw new Error(t('noWriteField'));
  await c.writeExtensionField(c.characterId, CARD_KEY, payload);
  char.data = char.data || {};
  char.data.extensions = char.data.extensions || {};
  char.data.extensions[CARD_KEY] = payload;
}

function avatarUrl(char) {
  if (!char || !char.avatar || char.avatar === 'none') return NO_COVER;
  return `/thumbnail?type=avatar&file=${encodeURIComponent(char.avatar)}`;
}

function syncWithChat() {
  const char = currentChar();
  const key = char ? char.avatar : null;
  const card = readCard(char);
  const sameChar = key === state.charKey;
  const playingUrl = state.tracks[state.index] ? state.tracks[state.index].url : null;

  state.card = card;
  state.charName = char ? char.name : '';
  state.avatar = avatarUrl(char);

  if (sameChar) {
    state.tracks = card.tracks;
    state.nextIndex = null;
    if (isPlaying()) schedulePreload(); // playlist may have changed -> re-pick the next song
    const keep = card.tracks.findIndex((t) => t.url === playingUrl);
    if (keep >= 0) state.index = keep;
    else { if (playingUrl) stop(); state.index = card.tracks.length ? 0 : -1; }
  } else {
    stop();
    state.charKey = key;
    state.tracks = card.tracks;
    state.index = card.tracks.length ? 0 : -1;
    state.history = [];
    state.view = 'list';
    if (settings().autoplay && settings().enabled && card.tracks.length) {
      play(settings().shuffle ? Math.floor(Math.random() * card.tracks.length) : 0);
    }
  }
  applyTheme();
  render();
}

/* ---------- audio ---------- */

/** Make an <audio>; its events only count while it is the active `audio`, so the preloader stays silent. */
function makeAudioEl() {
  const el = new Audio();
  el.preload = 'auto';
  const mine = (fn) => function () { if (el === audio) fn.apply(null, arguments); };
  el.addEventListener('timeupdate', mine(renderProgress));
  el.addEventListener('loadedmetadata', mine(renderProgress));
  el.addEventListener('play', mine(() => { state.errors = 0; renderPlaying(); }));
  el.addEventListener('playing', mine(schedulePreload));
  el.addEventListener('progress', mine(maybePreload)); // fires as the file downloads
  el.addEventListener('timeupdate', mine(() => { if (isFinite(el.duration) && el.duration - el.currentTime < 20) maybePreload(); }));
  el.addEventListener('pause', mine(renderPlaying));
  el.addEventListener('ended', mine(() => next(true)));
  el.addEventListener('error', mine(onAudioError));
  return el;
}

function ensureAudio() {
  if (!audio) { audio = makeAudioEl(); audio.volume = settings().volume; }
  if (!preloader) { preloader = makeAudioEl(); preloader.volume = settings().volume; }
  return audio;
}

function isPlaying() { return !!(audio && !audio.paused && audio.getAttribute('src')); }

function onAudioError() {
  if (!audio || !audio.getAttribute('src')) return;
  const track = state.tracks[state.index];
  state.errors += 1;
  toast('warning', t('cantPlay', { title: track ? track.title : 'track' }));
  if (state.errors >= state.tracks.length) { state.errors = 0; stop(); return; }
  setTimeout(() => next(true), 1200);
}

/** Which song comes after the current one (null = nothing). Shuffle picks now and remembers it. */
function upcomingIndex() {
  const n = state.tracks.length;
  if (!n || state.index < 0) return null;
  const s = settings();
  if (s.repeat === 'one') return null; // the same song repeats, nothing new to load
  if (s.shuffle && n > 1) {
    if (state.nextIndex == null || state.nextIndex === state.index || state.nextIndex >= n) {
      let i;
      do { i = Math.floor(Math.random() * n); } while (i === state.index);
      state.nextIndex = i;
    }
    return state.nextIndex;
  }
  const i = state.index + 1;
  if (i < n) return i;
  return s.repeat === 'off' ? null : 0;
}

/** Is the network bad enough that loading ahead would only hurt? (Chrome/Android can tell us; iPhone can't.) */
function slowNetwork() {
  const c = navigator.connection;
  return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
}

/** Has the current song finished downloading? */
function currentFullyLoaded() {
  if (!audio || !isFinite(audio.duration) || !audio.buffered || !audio.buffered.length) return false;
  return audio.buffered.end(audio.buffered.length - 1) >= audio.duration - 0.5;
}

/** Load the next song only once the current one is fully downloaded, so the two never fight over a slow
 *  connection. If a host never reports the file as complete, start anyway in the last 20 seconds. */
function schedulePreload() {
  clearTimeout(preloadTimer);
  preloadTimer = setTimeout(maybePreload, 1500);
}

function maybePreload() {
  if (!audio || audio.paused || slowNetwork()) return;
  const left = isFinite(audio.duration) ? audio.duration - audio.currentTime : Infinity;
  if (currentFullyLoaded() || left < 20) preloadNext();
}

function preloadNext() {
  ensureAudio();
  const i = upcomingIndex();
  if (i == null || !state.tracks[i]) return;
  const url = normalizeUrl(state.tracks[i].url);
  if (url === audio.dataset.url || preloader.dataset.url === url) return;
  preloader.src = url;
  preloader.dataset.url = url;
  try { preloader.load(); } catch (e) { /* ignore */ }
}

function resetPreload() {
  clearTimeout(preloadTimer);
  state.nextIndex = null;
  if (!preloader || !preloader.getAttribute('src')) return;
  preloader.removeAttribute('src');
  delete preloader.dataset.url;
  try { preloader.load(); } catch (e) { /* ignore */ }
}

function play(i) {
  if (!state.tracks.length) return;
  ensureAudio();
  if (typeof i === 'number' && i !== state.index) {
    if (state.index >= 0) state.history.push(state.index);
    if (state.history.length > 50) state.history.shift();
    state.index = clamp(i, 0, state.tracks.length - 1);
  }
  if (state.index < 0) state.index = 0;
  state.nextIndex = null;
  const url = normalizeUrl(state.tracks[state.index].url);
  if (audio.dataset.url !== url) {
    if (preloader.dataset.url === url) {
      // the next song is already loaded — swap players so it starts right away
      const old = audio;
      audio = preloader;
      preloader = old;
      old.pause();
      old.removeAttribute('src');
      delete old.dataset.url;
      try { old.load(); } catch (e) { /* ignore */ }
      audio.currentTime = 0;
    } else {
      audio.src = url;
      audio.dataset.url = url;
    }
  }
  audio.volume = settings().volume;
  const p = audio.play();
  if (p && p.catch) p.catch((err) => { if (err && err.name === 'NotAllowedError') toast('info', t('tapPlay')); });
  updateMediaSession();
  render();
}

function toggle() {
  if (!state.tracks.length) return;
  if (isPlaying()) audio.pause();
  else play();
}

function stop() {
  resetPreload();
  if (!audio) return;
  audio.pause();
  audio.removeAttribute('src');
  delete audio.dataset.url;
  try { audio.load(); } catch (e) { /* ignore */ }
  renderPlaying();
  renderProgress();
}

function next(auto) {
  const n = state.tracks.length;
  if (!n) return;
  const s = settings();
  if (auto === true && s.repeat === 'one' && audio) { audio.currentTime = 0; play(); return; }
  let i;
  if (s.shuffle && n > 1) {
    i = upcomingIndex(); // the same random pick that was preloaded
  } else {
    i = state.index + 1;
    if (i >= n) {
      if (auto === true && s.repeat === 'off') { audio.pause(); audio.currentTime = 0; renderPlaying(); return; }
      i = 0;
    }
  }
  play(i);
}

function prev() {
  if (!state.tracks.length) return;
  if (audio && audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (settings().shuffle && state.history.length) { state.index = state.history.pop(); play(); return; }
  let i = state.index - 1;
  if (i < 0) i = state.tracks.length - 1;
  play(i);
}

function updateMediaSession() {
  if (!('mediaSession' in navigator)) return;
  const t = state.tracks[state.index];
  if (!t) return;
  try {
    const art = new URL(state.avatar, location.href).href;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title,
      artist: t.artist || state.charName,
      album: "Mors's Music Box",
      artwork: /^https?:/.test(art) ? [{ src: art, sizes: '512x512' }] : [],
    });
    navigator.mediaSession.setActionHandler('play', () => play());
    navigator.mediaSession.setActionHandler('pause', () => audio && audio.pause());
    navigator.mediaSession.setActionHandler('previoustrack', prev);
    navigator.mediaSession.setActionHandler('nexttrack', () => next());
  } catch (e) { /* ignore */ }
}

/* ---------- floating button (unchanged look) ---------- */

function mountButton() {
  if (document.getElementById('mmb-btn')) return;
  const btn = document.createElement('div');
  btn.id = 'mmb-btn';
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.title = "Mors's Music Box";
  btn.innerHTML = `<span class="mmb-btn-note">${ICON.music}</span><span class="mmb-eq"><b></b><b></b><b></b></span>`;


  let dragging = false, moved = false, sx = 0, sy = 0, sl = 0, st = 0;
  btn.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false;
    try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const r = btn.getBoundingClientRect();
    sl = r.left; st = r.top; sx = e.clientX; sy = e.clientY;
  });
  btn.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
    moved = true;
    const r = btn.getBoundingClientRect();
    btn.style.right = 'auto'; btn.style.bottom = 'auto';
    btn.style.left = `${clamp(sl + dx, 8, window.innerWidth - r.width - 8)}px`;
    btn.style.top = `${clamp(st + dy, 8, window.innerHeight - r.height - 8)}px`;
  });
  btn.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      const r = btn.getBoundingClientRect();
      try { localStorage.setItem(POS_KEY, JSON.stringify({ x: r.left, y: r.top })); } catch (e) { /* ignore */ }
    }
  });
  // Open on `click`, not pointerup: on phones the browser fires a follow-up click after the
  // touch, and if the overlay is already open that click lands on the backdrop and closes it.
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (moved) { moved = false; return; } // it was a drag
    togglePanel();
  });
  btn.addEventListener('pointercancel', () => { dragging = false; });
  btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(); } });

  document.body.appendChild(btn);
  placeButton();
  requestAnimationFrame(() => placeButton()); // again after layout settles (mobile toolbars)
}

/* Same approach as Cozy Cat's mobile fix: never anchor with right/bottom.
 * Always place with left/top measured from the *visual* viewport, then clamp. */
function getViewport() {
  const vv = window.visualViewport;
  return {
    w: vv && typeof vv.width === 'number' ? vv.width : window.innerWidth,
    h: vv && typeof vv.height === 'number' ? vv.height : window.innerHeight,
    x: vv && typeof vv.offsetLeft === 'number' ? vv.offsetLeft : 0,
    y: vv && typeof vv.offsetTop === 'number' ? vv.offsetTop : 0,
  };
}

function savedPos() {
  try {
    const v = JSON.parse(localStorage.getItem(POS_KEY));
    return v && isFinite(v.x) && isFinite(v.y) ? v : null;
  } catch (e) { return null; }
}

function placeButton(forceDefault) {
  const btn = document.getElementById('mmb-btn');
  if (!btn) return;
  const v = getViewport();
  const size = btn.offsetWidth || 52;
  const pad = 8;
  const minX = v.x + pad, maxX = v.x + v.w - size - pad;
  const minY = v.y + pad, maxY = v.y + v.h - size - pad;

  let pos = forceDefault ? null : savedPos();
  // a saved spot far outside this screen (e.g. saved on a bigger one) -> forget it
  if (pos && (pos.x < minX - 200 || pos.x > maxX + 200 || pos.y < minY - 200 || pos.y > maxY + 200)) {
    try { localStorage.removeItem(POS_KEY); } catch (e) { /* ignore */ }
    pos = null;
  }
  // default: bottom-right, a little above Cozy Cat's paw
  const x = pos ? pos.x : v.x + v.w - size - 16;
  const y = pos ? pos.y : v.y + v.h - size - 84;

  btn.style.right = 'auto';
  btn.style.bottom = 'auto';
  btn.style.left = `${clamp(x, minX, Math.max(minX, maxX))}px`;
  btn.style.top = `${clamp(y, minY, Math.max(minY, maxY))}px`;
}

function clampButton() { placeButton(false); }

function resetButtonPosition() {
  try { localStorage.removeItem(POS_KEY); } catch (e) { /* ignore */ }
  if (!document.getElementById('mmb-btn') && settings().enabled) mountButton();
  placeButton(true);
  const btn = document.getElementById('mmb-btn');

}

/* ---------- overlay: list + player ---------- */

function mountOverlay() {
  if (document.getElementById('mmb-overlay')) return;
  const ov = document.createElement('div');
  ov.id = 'mmb-overlay';
  ov.innerHTML = `
    <div class="mmb-screen" role="dialog" aria-label="Mors's Music Box">

      <section class="mmb-view mmb-list-view">
        <div class="mmb-topbar">
          <span class="mmb-brand">MORS'S MUSIC BOX</span>
          <span class="mmb-topbtns">
            <button type="button" class="mmb-ghost mmb-lang-btn" data-act="lang"></button>
            <button type="button" class="mmb-ghost mmb-theme-btn" data-act="theme">${ICON.palette}</button>
            <button type="button" class="mmb-ghost" data-act="edit" title="Edit playlist">${ICON.edit}</button>
            <button type="button" class="mmb-ghost" data-act="close" title="Close">${ICON.close}</button>
          </span>
        </div>
        <div class="mmb-theme-menu" hidden></div>
        <div class="mmb-list-head">
          <div class="mmb-mini-vinyl"><div class="mmb-grooves"></div><img class="mmb-cover" alt=""></div>
          <div class="mmb-list-meta">
            <div class="mmb-tag mmb-list-tag"></div>
            <div class="mmb-list-title"></div>
          </div>
        </div>
        <div class="mmb-tracks"></div>
        <button type="button" class="mmb-nowbar" data-act="open-player">
          <img class="mmb-cover mmb-now-cover" alt="">
          <span class="mmb-now-text"><b class="mmb-now-title"></b><small class="mmb-now-artist"></small></span>
          <span class="mmb-now-btn" data-act="toggle"></span>
        </button>
      </section>

      <section class="mmb-view mmb-player-view">
        <button type="button" class="mmb-back" data-act="back" aria-label="Back">${ICON.back}<span class="mmb-back-text">Back</span></button>
        <div class="mmb-music-content">
          <div class="mmb-vinyl-area">
            <div class="mmb-vinyl">
              <div class="mmb-grooves"></div>
              <img class="mmb-cover mmb-big-cover" alt="Cover">
            </div>
            <div class="mmb-stylus"><div class="mmb-stylus-knob"></div></div>
          </div>
          <div class="mmb-track-info">
            <div class="mmb-tag mmb-now-tag"></div>
            <div class="mmb-title"></div>
            <div class="mmb-artist"></div>
          </div>
          <div class="mmb-controls">
            <div class="mmb-progress">
              <span class="mmb-cur">0:00</span>
              <div class="mmb-bar" data-slider="seek"><div class="mmb-fill"></div><div class="mmb-knob"></div></div>
              <span class="mmb-dur">0:00</span>
            </div>
            <div class="mmb-btnrow">
              <button type="button" class="mmb-btn mmb-toggle-btn" data-act="shuffle" aria-label="Shuffle">${ICON.shuffle}</button>
              <button type="button" class="mmb-btn" data-act="prev" aria-label="Previous">${ICON.prev}</button>
              <button type="button" class="mmb-play" data-act="toggle" aria-label="Play / Pause">${ICON.play}</button>
              <button type="button" class="mmb-btn" data-act="next" aria-label="Next">${ICON.next}</button>
              <button type="button" class="mmb-btn mmb-toggle-btn" data-act="repeat" aria-label="Repeat">${ICON.repeat}</button>
            </div>
            <div class="mmb-sign"></div>
          </div>
        </div>
      </section>

    </div>`;

  ov.addEventListener('click', (e) => {
    const menu = ov.querySelector('.mmb-theme-menu');
    if (state.themeLongPressed && e.target.closest('[data-act="theme"]')) {
      state.themeLongPressed = false; // this is the release of the long-press that opened the menu
      e.stopPropagation();
      return;
    }
    if (!menu.hidden && !e.target.closest('.mmb-theme-menu')) {
      closeThemeMenu();
      if (e.target.closest('[data-act="theme"]')) { e.stopPropagation(); return; } // tapping the palette again just closes it
    }
    if (e.target === ov) {
      if (document.getElementById('mmb-editor')) return; // don't lose an unsaved playlist edit
      if (Date.now() - state.openedAt > 400) togglePanel(false); // ignore the tap that opened it
      return;
    }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    e.stopPropagation();
    if (act === 'close') togglePanel(false);
    else if (act === 'back') setView('list');
    else if (act === 'open-player') setView('player');
    else if (act === 'toggle') toggle();
    else if (act === 'next') next();
    else if (act === 'prev') prev();
    else if (act === 'edit') openEditor();
    else if (act === 'theme') cycleTheme();
    else if (act === 'lang') toggleLang();
    else if (act === 'pick-theme') pickTheme(b.dataset.theme);
    else if (act === 'track') { play(Number(b.dataset.i)); setView('player'); }
    else if (act === 'shuffle') { settings().shuffle = !settings().shuffle; save(); state.nextIndex = null; if (isPlaying()) schedulePreload(); render(); }
    else if (act === 'repeat') {
      const order = ['all', 'one', 'off'];
      const s = settings();
      s.repeat = order[(order.indexOf(s.repeat) + 1) % order.length];
      save(); if (isPlaying()) schedulePreload(); render();
    }
  });

  // palette: tap = next theme, press and hold = open the theme list
  const themeBtn = ov.querySelector('.mmb-theme-btn');
  let holdTimer = null;
  const cancelHold = () => { clearTimeout(holdTimer); holdTimer = null; };
  themeBtn.addEventListener('pointerdown', () => {
    cancelHold();
    state.themeLongPressed = false;
    holdTimer = setTimeout(() => { holdTimer = null; state.themeLongPressed = true; openThemeMenu(); }, 450);
  });
  themeBtn.addEventListener('pointerup', cancelHold);
  themeBtn.addEventListener('pointerleave', cancelHold);
  themeBtn.addEventListener('pointercancel', cancelHold);
  themeBtn.addEventListener('contextmenu', (e) => e.preventDefault()); // no browser menu on long-press

  const isPhone = () => window.matchMedia('(max-width: 768px)').matches;
  ov.addEventListener('focusin', (e) => {
    if (!/^(INPUT|TEXTAREA)$/.test(e.target.tagName) || !isPhone()) return;
    setTyping(true);
    setTimeout(() => revealField(e.target), 350); // after the keyboard has opened
  });
  ov.addEventListener('focusout', () => setTimeout(() => { if (!isTypingInPlayer()) setTyping(false); }, 300));

  makeSlider(ov.querySelector('[data-slider="seek"]'), (ratio) => {
    if (audio && isFinite(audio.duration)) audio.currentTime = ratio * audio.duration;
  });

  document.body.appendChild(ov);
  applyTheme();
}

function makeSlider(el, onChange) {
  let active = false;
  const set = (e) => { const r = el.getBoundingClientRect(); onChange(clamp((e.clientX - r.left) / r.width, 0, 1)); };
  el.addEventListener('pointerdown', (e) => { active = true; try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } set(e); });
  el.addEventListener('pointermove', (e) => { if (active) set(e); });
  el.addEventListener('pointerup', () => { active = false; });
  el.addEventListener('pointercancel', () => { active = false; });
}

/** Shrink a heading step by step until it fits in `lines` lines (long bot / song names). */
function fitText(el, max, min, lines) {
  if (!el || !el.offsetParent) return; // not visible right now
  let size = max;
  el.style.fontSize = `${size}px`;
  const ratio = (parseFloat(getComputedStyle(el).lineHeight) || max * 1.1) / max;
  while (size > min && el.scrollHeight > Math.ceil(size * ratio * lines) + 2) {
    size -= 1;
    el.style.fontSize = `${size}px`;
  }
  el.classList.toggle('mmb-fit-min', size <= min); // still too long -> CSS clamps with …
}

function fitTitles() {
  const ov = document.getElementById('mmb-overlay');
  if (!ov || !state.open) return;
  fitText(ov.querySelector('.mmb-list-title'), 30, 18, 2);
  fitText(ov.querySelector('.mmb-title'), 34, 22, 2);
}

/* While typing on a phone the keyboard eats half the window, and the 1:2 phone frame would shrink to a
 * sliver. So while a field in the player is focused, the frame turns into a wide panel that fills the
 * space above the keyboard (class mmb-typing), and the field is scrolled into view inside the editor. */
function isTypingInPlayer() {
  const el = document.activeElement;
  const ov = document.getElementById('mmb-overlay');
  return !!(el && ov && ov.contains(el) && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}
function setTyping(on) {
  const ov = document.getElementById('mmb-overlay');
  if (ov) ov.classList.toggle('mmb-typing', !!on);
}
/** Scroll only the editor's own list — never the page, so SillyTavern's layout isn't pushed around. */
function revealField(el) {
  const box = el.closest('.mmb-ed-body');
  if (!box) return;
  const r = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  if (r.top < b.top + 8 || r.bottom > b.bottom - 8) box.scrollTop += (r.top - b.top) - b.height / 3;
}

function setView(v) {
  state.view = v;
  const ov = document.getElementById('mmb-overlay');
  if (ov) ov.dataset.view = v;
  render();
}

function togglePanel(force) {
  mountOverlay();
  state.open = typeof force === 'boolean' ? force : !state.open;
  const ov = document.getElementById('mmb-overlay');
  ov.classList.toggle('mmb-open', state.open);
  if (!state.open) { const ed = document.getElementById('mmb-editor'); if (ed) ed.remove(); closeThemeMenu(); }
  if (!state.open) setTyping(false);
  if (state.open) { state.openedAt = Date.now(); state.view = 'list'; ov.dataset.view = 'list'; render(); }
}


function render() {
  const ov = document.getElementById('mmb-overlay');
  if (!ov) { renderPlaying(); return; }
  const s = settings();
  const cur = state.tracks[state.index];
  const hasChar = !!currentChar();
  ov.dataset.view = state.view;

  ov.querySelectorAll('.mmb-cover').forEach((img) => {
    if (img.getAttribute('src') !== state.avatar) img.setAttribute('src', state.avatar);
  });

  // labels that follow the language
  const L = lang();
  const langBtn = ov.querySelector('.mmb-lang-btn');
  langBtn.textContent = L.toUpperCase();
  langBtn.title = t('langBtnTitle');
  ov.querySelector('.mmb-theme-btn').title = t('themeBtnTitle');
  ov.querySelector('[data-act="edit"]').title = t('editTitle');
  ov.querySelector('[data-act="close"]').title = t('closeTitle');
  ov.querySelector('.mmb-back-text').textContent = t('back');

  // list view
  ov.querySelector('.mmb-list-tag').textContent = `PLAYLIST • ${state.tracks.length} ${state.tracks.length === 1 ? 'TRACK' : 'TRACKS'}`;
  ov.querySelector('.mmb-list-title').textContent = state.charName || 'Music Box';
  ov.querySelector('[data-act="edit"]').style.visibility = hasChar ? '' : 'hidden';

  const list = ov.querySelector('.mmb-tracks');
  list.innerHTML = state.tracks.length
    ? state.tracks.map((tr, i) => `
        <button type="button" class="mmb-row${i === state.index ? ' cur' : ''}" data-act="track" data-i="${i}">
          <span class="mmb-n">${String(i + 1).padStart(2, '0')}</span>
          <span class="mmb-rt"><b>${esc(tr.title)}</b>${tr.artist ? `<small>${esc(tr.artist)}</small>` : ''}</span>
          <span class="mmb-row-eq"><i></i><i></i><i></i></span>
        </button>`).join('')
    : `<div class="mmb-empty">${hasChar ? `${t('noSongs')}<br><small>${t('noSongsHint')}</small>` : t('openChatFirst')}</div>`;

  const nowbar = ov.querySelector('.mmb-nowbar');
  nowbar.hidden = !(cur && audio && audio.getAttribute('src'));
  ov.querySelector('.mmb-now-title').textContent = cur ? cur.title : '';
  ov.querySelector('.mmb-now-artist').textContent = cur ? (cur.artist || state.charName) : '';

  // player view
  ov.querySelector('.mmb-now-tag').textContent = `NOW PLAYING${state.card.tag ? ` • ${state.card.tag}` : ''}`;
  ov.querySelector('.mmb-title').textContent = cur ? cur.title : '—';
  ov.querySelector('.mmb-artist').textContent = cur ? (cur.artist || state.charName) : '';
  ov.querySelector('.mmb-sign').textContent = state.card.sign || 'on repeat forever...';

  const sh = ov.querySelector('[data-act="shuffle"]');
  sh.classList.toggle('on', !!s.shuffle);
  const rep = ov.querySelector('[data-act="repeat"]');
  rep.classList.toggle('on', s.repeat !== 'off');
  rep.innerHTML = s.repeat === 'one' ? ICON.repeatOne : ICON.repeat;
  rep.title = `Repeat: ${s.repeat}`;

  renderPlaying();
  renderProgress();
  fitTitles();
}

function renderPlaying() {
  const playing = isPlaying();
  const btn = document.getElementById('mmb-btn');
  if (btn) btn.classList.toggle('playing', playing);
  const ov = document.getElementById('mmb-overlay');
  if (!ov) return;
  ov.classList.toggle('playing', playing);
  ov.querySelector('.mmb-play').innerHTML = playing ? ICON.pause : ICON.play;
  ov.querySelector('.mmb-now-btn').innerHTML = playing ? ICON.pause : ICON.play;
  ov.querySelectorAll('.mmb-row').forEach((row) => row.classList.toggle('live', playing && Number(row.dataset.i) === state.index));
}

function renderProgress() {
  const ov = document.getElementById('mmb-overlay');
  if (!ov || !state.open) return;
  const cur = (audio && audio.currentTime) || 0;
  const dur = (audio && audio.duration) || 0;
  ov.querySelector('[data-slider="seek"]').style.setProperty('--v', dur ? cur / dur : 0);
  ov.querySelector('.mmb-cur').textContent = fmt(cur);
  ov.querySelector('.mmb-dur').textContent = fmt(dur);
}

/* ---------- playlist editor ---------- */

function openEditor() {
  const char = currentChar();
  if (!char) { toast('info', t('openChatFirst')); return; }
  if (!state.open) togglePanel(true);
  const existing = document.getElementById('mmb-editor');
  if (existing) existing.remove();

  const card = readCard(char);
  const draft = card.tracks.map((t) => Object.assign({}, t));
  let draftTheme = card.theme;
  if (THEME_ALIASES[draftTheme]) draftTheme = THEME_ALIASES[draftTheme]; // renamed / removed
  const themeKey = typeof draftTheme === 'string' ? draftTheme : (draftTheme ? '__embedded' : '');

  const themeOptions = Object.keys(allThemes()).map((k) => `<option value="${esc(k)}">${esc(allThemes()[k].name)}</option>`).join('');

  const wrap = document.createElement('div');
  wrap.id = 'mmb-editor';
  wrap.innerHTML = `
    <div class="mmb-ed">
      <div class="mmb-ed-head">
        <div><span class="mmb-tag">EDIT PLAYLIST</span><div class="mmb-ed-name">${esc(char.name)}</div></div>
        <button type="button" class="mmb-ghost" data-ed="close" title="Back">${ICON.close}</button>
      </div>
      <div class="mmb-ed-body">
        <div class="mmb-ed-rows"></div>
        <button type="button" class="mmb-pill wide" data-ed="add">${ICON.plus} ${t('addSong')}</button>

        <details class="mmb-ed-box">
          <summary>${t('pasteMany')}</summary>
          <p>${t('onePerLine')}</p>
          <textarea rows="4" placeholder="Waltz in A minor | https://od.lk/s/test.mp3&#10;Richmond Nocturne | https://od.lk/s/test2.mp3"></textarea>
          <button type="button" class="mmb-pill primary wide" data-ed="bulk">${ICON.plus} ${t('addToList')}</button>
        </details>

        <details class="mmb-ed-box">
          <summary>${t('cardSettings')}</summary>
          <label>${t('tagLabel')} <input type="text" data-card="tag" maxlength="40" placeholder="${esc(t('tagPh'))}"></label>
          <label>${t('signLabel')} <input type="text" data-card="sign" maxlength="80" placeholder="on repeat forever..."></label>
          <label>${t('cardTheme')}
            <select data-card="theme">
              <option value="">${t('cardThemeNone')}</option>
              ${themeOptions}
              ${themeKey === '__embedded' ? `<option value="__embedded">${esc((draftTheme && draftTheme.name) || 'Embedded theme')} ${t('inCard')}</option>` : ''}
            </select>
          </label>
          <p class="mmb-hint">${t('cardThemeHint')}</p>
        </details>

        <div class="mmb-ed-io">
          <button type="button" class="mmb-pill" data-ed="import">Import JSON</button>
          <button type="button" class="mmb-pill" data-ed="export">Export JSON</button>
          <input type="file" accept=".json,application/json" hidden>
        </div>
      </div>
      <div class="mmb-ed-foot">
        <button type="button" class="mmb-pill" data-ed="close">${t('cancel')}</button>
        <button type="button" class="mmb-pill primary" data-ed="save">Save to Card</button>
      </div>
    </div>`;

  const rowsEl = wrap.querySelector('.mmb-ed-rows');
  const tagInp = wrap.querySelector('[data-card="tag"]');
  const signInp = wrap.querySelector('[data-card="sign"]');
  const themeSel = wrap.querySelector('[data-card="theme"]');
  tagInp.value = card.tag;
  signInp.value = card.sign;
  themeSel.value = themeKey;

  const resolveThemeForCard = () => {
    const v = themeSel.value;
    if (!v) return undefined;
    if (v === '__embedded') return draftTheme;
    if (BUILTIN_THEMES[v]) return v;
    const custom = (settings().customThemes || {})[v];
    return custom ? Object.assign({ id: v }, custom) : undefined; // embed imported themes so the card is portable
  };

  const renderRows = () => {
    rowsEl.innerHTML = draft.length ? draft.map((tr, i) => `
      <div class="mmb-ed-row" data-i="${i}">
        <div class="mmb-ed-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="mmb-ed-fields">
          <input type="text" data-f="title" placeholder="${esc(t('titlePh'))}" value="${esc(tr.title)}">
          <input type="text" data-f="artist" placeholder="${esc(t('artistPh'))}" value="${esc(tr.artist)}">
          <input type="url" data-f="url" placeholder="${esc(t('urlPh'))}" value="${esc(tr.url)}">
        </div>
        <div class="mmb-ed-move">
          <button type="button" class="mmb-ghost" data-ed="up" title="${t('moveUp')}"${i === 0 ? ' disabled' : ''}>${ICON.up}</button>
          <button type="button" class="mmb-ghost" data-ed="down" title="${t('moveDown')}"${i === draft.length - 1 ? ' disabled' : ''}>${ICON.down}</button>
          <button type="button" class="mmb-ghost danger" data-ed="del" title="${t('remove')}">${ICON.trash}</button>
        </div>
      </div>`).join('')
      : `<div class="mmb-empty">${t('noSongs')}</div>`;
  };

  rowsEl.addEventListener('input', (e) => {
    const row = e.target.closest('.mmb-ed-row');
    if (row && e.target.dataset.f) draft[Number(row.dataset.i)][e.target.dataset.f] = e.target.value;
  });

  const fileInput = wrap.querySelector('input[type=file]');
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    try {
      const json = JSON.parse(await f.text());
      const tracks = cleanTracks(Array.isArray(json) ? json : json.tracks);
      if (!tracks.length) throw new Error('empty');
      draft.push(...tracks);
      if (!Array.isArray(json)) {
        if (json.tag) tagInp.value = String(json.tag).slice(0, 40);
        if (json.sign) signInp.value = String(json.sign).slice(0, 80);
        if (typeof json.theme === 'string' && allThemes()[json.theme]) themeSel.value = json.theme;
      }
      renderRows();
      toast('success', t('importedSongs', { n: tracks.length }));
    } catch (e) {
      toast('error', t('badPlaylistFile'));
    }
    fileInput.value = '';
  });

  const close = () => { wrap.remove(); render(); };

  wrap.addEventListener('click', async (e) => {
    e.stopPropagation(); // keep clicks inside the editor away from the overlay's handlers
    const b = e.target.closest('[data-ed]');
    if (!b) return;
    const act = b.dataset.ed;
    const rowEl = b.closest('.mmb-ed-row');
    const i = rowEl ? Number(rowEl.dataset.i) : -1;

    if (act === 'close') close();
    else if (act === 'add') {
      draft.push({ title: '', artist: '', url: '' });
      renderRows();
      const last = rowsEl.lastElementChild && rowsEl.lastElementChild.querySelector('input');
      if (last) last.focus();
    }
    else if (act === 'del') { draft.splice(i, 1); renderRows(); }
    else if (act === 'up' && i > 0) { const tmp = draft[i - 1]; draft[i - 1] = draft[i]; draft[i] = tmp; renderRows(); }
    else if (act === 'down' && i < draft.length - 1) { const tmp = draft[i + 1]; draft[i + 1] = draft[i]; draft[i] = tmp; renderRows(); }
    else if (act === 'bulk') {
      const ta = wrap.querySelector('.mmb-ed-box textarea');
      const added = ta.value.split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
        const bar = line.lastIndexOf('|');
        return bar > -1 ? { title: line.slice(0, bar).trim(), artist: '', url: line.slice(bar + 1).trim() } : { title: '', artist: '', url: line };
      }).filter((t) => /^https?:\/\//i.test(t.url));
      if (!added.length) { toast('warning', t('bulkFormat')); return; }
      added.forEach((t) => { if (!t.title) t.title = titleFromUrl(t.url); });
      draft.push(...added);
      ta.value = '';
      renderRows();
    }
    else if (act === 'import') fileInput.click();
    else if (act === 'export') {
      const payload = { version: 2, tag: tagInp.value.trim() || undefined, sign: signInp.value.trim() || undefined, theme: resolveThemeForCard(), tracks: cleanTracks(draft) };
      downloadJson(payload, `${(char.name || 'playlist').replace(/[^\w\- ]+/g, '').trim() || 'playlist'}-music-box.json`);
    }
    else if (act === 'save') {
      const bad = draft.filter((t) => t.url && !/^(https?:\/\/|\/|\.\/)/i.test(t.url.trim()));
      if (bad.length) { toast('warning', t('badLinks')); return; }
      const tracks = cleanTracks(draft);
      b.disabled = true;
      try {
        await writeCard({ version: 2, tag: tagInp.value.trim() || undefined, sign: signInp.value.trim() || undefined, theme: resolveThemeForCard(), tracks });
        toast('success', t('savedCard', { n: tracks.length, name: char.name }));
        close();
        syncWithChat();
      } catch (err) {
        console.error(`[${MODULE}]`, err);
        toast('error', t('saveFailed', { err: err.message || err }));
        b.disabled = false;
      }
    }
  });

  renderRows();
  // Lives inside the phone screen (like Cozy Cat's pages) instead of a second full-screen layer:
  // a separate fixed layer collapsed behind the player on some mobile setups.
  document.querySelector('#mmb-overlay .mmb-screen').appendChild(wrap);
  fitText(wrap.querySelector('.mmb-ed-name'), 26, 16, 2);
}

function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- theme editor (JSON) ---------- */

function uniqueThemeId(base) {
  const all = allThemes();
  let id = BUILTIN_THEMES[base] ? `${base}-custom` : base;
  let n = 2;
  while (all[id]) { id = `${base}-${n}`; n += 1; }
  return id;
}

/** Empty template: every setting listed, nothing filled in. Blank ("") = use the default. */
function starterThemeJson() {
  const blankColors = {};
  ['screen', 'frame', 'text', 'muted', 'soft', 'accent', 'track', 'line', 'row', 'play', 'playIcon',
    'barTitle', 'barArtist', 'vinyl', 'groove', 'stylus', 'stylusKnob', 'button', 'buttonIcon']
    .forEach((k) => { blankColors[k] = ''; });
  return JSON.stringify({
    name: '',
    colors: blankColors,
    fonts: { tag: '', title: '', body: '', sign: '' },
    titleItalic: true,
    texture: '',
    background: { image: '', dim: '' },
    disc: { image: '', label: true, glow: '' },
    stylus: { image: '' },
  }, null, 2);
}

/** Check the text; returns { theme, raw } or { error }. */
function parseThemeText(text) {
  let raw;
  try { raw = JSON.parse(text); } catch (e) { return { error: t('badJson', { err: e.message }) }; }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { error: t('oneThemeOnly') };
  const theme = normalizeTheme(raw);
  if (!theme) return { error: t('badTheme') };
  return { theme, raw };
}

/** id = null -> create new; otherwise edit that custom theme. */
async function openThemeEditor(id) {
  const s = settings();
  const editing = id && s.customThemes[id];
  const startText = editing ? JSON.stringify(s.customThemes[id], null, 2) : starterThemeJson();

  const wrap = document.createElement('div');
  wrap.className = 'mmb-json-editor';
  wrap.innerHTML = `
    <h3>${editing ? esc(t('editThemeH', { name: s.customThemes[id].name })) : t('newThemeH')}</h3>
    <p class="mmb-json-hint">${esc(t('themeHint'))}</p>
    <textarea class="text_pole mmb-json-text" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
    <div class="mmb-json-error" hidden></div>`;
  const ta = wrap.querySelector('textarea');
  const errEl = wrap.querySelector('.mmb-json-error');
  ta.value = startText;
  const showErr = (m) => { errEl.textContent = m; errEl.hidden = !m; };

  const commit = () => {
    const res = parseThemeText(ta.value);
    if (res.error) { showErr(res.error); return false; }
    const newId = editing ? id : uniqueThemeId(slug(res.raw.id || res.theme.name));
    s.customThemes[newId] = res.theme;
    s.theme = newId;
    save(); applyTheme(); syncSettingsUI();
    toast('success', t(editing ? 'themeSaved' : 'themeCreated', { name: res.theme.name }));
    return true;
  };

  const c = ctx();
  if (c && typeof c.callGenericPopup === 'function' && c.POPUP_TYPE) {
    const OK = c.POPUP_RESULT ? c.POPUP_RESULT.AFFIRMATIVE : 1;
    let saved = false;
    const result = await c.callGenericPopup(wrap, c.POPUP_TYPE.CONFIRM, '', {
      okButton: 'Save', cancelButton: 'Cancel', wide: true, large: true, allowVerticalScrolling: true,
      onClosing: (popup) => {
        if (popup.result !== OK) return true;
        saved = commit();
        return saved; // keep the window open while the JSON has an error
      },
    });
    if (result === OK && !saved) commit(); // older ST without onClosing
    return;
  }

  // fallback: our own simple window
  const box = document.createElement('div');
  box.className = 'mmb-json-modal';
  box.innerHTML = '<div class="mmb-json-card"></div>';
  box.firstChild.appendChild(wrap);
  const bar = document.createElement('div');
  bar.className = 'mmb-json-actions';
  bar.innerHTML = '<div class="menu_button" data-x="cancel">Cancel</div><div class="menu_button" data-x="save">Save</div>';
  box.firstChild.appendChild(bar);
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('[data-x]');
    if (!b) return;
    if (b.dataset.x === 'cancel' || commit()) box.remove();
  });
  document.body.appendChild(box);
  ta.focus();
}

async function confirmBox(text) {
  const c = ctx();
  if (c && typeof c.callGenericPopup === 'function' && c.POPUP_TYPE) {
    const OK = c.POPUP_RESULT ? c.POPUP_RESULT.AFFIRMATIVE : 1;
    return (await c.callGenericPopup(esc(text), c.POPUP_TYPE.CONFIRM)) === OK;
  }
  return window.confirm(text);
}

/* ---------- settings drawer ---------- */

function mountSettings() {
  if (document.getElementById('mmb-settings')) return;
  const host = document.getElementById('extensions_settings') || document.getElementById('extensions_settings2');
  if (!host) return;
  host.insertAdjacentHTML('beforeend', `
    <div id="mmb-settings" class="mmb-settings">
      <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
          <b>Mors's Music Box</b>
          <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
          <div class="mmb-set-body">
          <div class="styled_description_block" style="text-align:center;">
            <small>
              Created by <a href="https://bio.site/deMors" target="_blank" rel="noopener noreferrer">Mors</a>
              with help of Friends<br>
              Hopefully, you guys enjoy it. Have fun:)
            </small>
          </div>

          <hr>

          <label class="checkbox_label" for="mmb-set-enabled"><input type="checkbox" id="mmb-set-enabled"> <span>Enable Music Box</span></label>
          <label class="checkbox_label" for="mmb-set-follow"><input type="checkbox" id="mmb-set-follow"> <span>Use the character's theme</span></label>
          <label class="checkbox_label" for="mmb-set-autoplay"><input type="checkbox" id="mmb-set-autoplay"> <span>Autoplay when opening a chat</span></label>

          <div class="mmb-set-row mmb-set-theme-row">
            <label for="mmb-set-theme">Theme</label>
            <select id="mmb-set-theme" class="text_pole"></select>
          </div>
          <div class="mmb-set-row mmb-set-tools">
            <div id="mmb-set-new" class="menu_button fa-solid fa-plus" role="button" tabindex="0" title="Create a new theme"></div>
            <div id="mmb-set-edit" class="menu_button fa-solid fa-pencil" role="button" tabindex="0" title="Edit this theme"></div>
            <div id="mmb-set-import" class="menu_button fa-solid fa-file-import" role="button" tabindex="0" title="Import theme (.json)"></div>
            <div id="mmb-set-export" class="menu_button fa-solid fa-file-export" role="button" tabindex="0" title="Export this theme"></div>
            <div id="mmb-set-delete" class="menu_button fa-solid fa-skull" role="button" tabindex="0" title="Delete this theme"></div>
            <button type="button" class="mmbSetBtn" id="mmb-set-resetpos" title="Move the floating button back to its default spot">Reset Position</button>
          </div>
          <input type="file" id="mmb-set-file" accept=".json,application/json" hidden>

          <div class="mmb-set-note">
            Each bot keeps its own playlist inside its character card.<br>
            Open the player and tap ✎ to add songs. Reset Position moves the floating button back to the corner.<br>
            Built-in themes (Rose, Elegant, Midnight) can't be edited or deleted — tap + to make your own.
          </div>
          </div>
        </div>
      </div>
    </div>`);

  const s = settings();
  const $ = (id) => document.getElementById(id);
  $('mmb-set-enabled').addEventListener('change', (e) => { s.enabled = e.target.checked; save(); applyEnabled(); });
  $('mmb-set-follow').addEventListener('change', (e) => { s.followCardTheme = e.target.checked; save(); applyTheme(); });
  $('mmb-set-autoplay').addEventListener('change', (e) => { s.autoplay = e.target.checked; save(); });
  $('mmb-set-theme').addEventListener('change', (e) => { s.theme = e.target.value; save(); applyTheme(); syncSettingsUI(); });
  $('mmb-set-resetpos').addEventListener('click', resetButtonPosition);
  const onTap = (id, fn) => {
    const el = $(id);
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  };
  onTap('mmb-set-new', () => openThemeEditor(null));
  onTap('mmb-set-edit', () => {
    if (BUILTIN_THEMES[s.theme]) { toast('info', t('builtinNoEdit')); return; }
    openThemeEditor(s.theme);
  });
  onTap('mmb-set-delete', async () => {
    if (BUILTIN_THEMES[s.theme]) { toast('info', t('builtinNoDelete')); return; }
    const name = (s.customThemes[s.theme] || {}).name || s.theme;
    if (!(await confirmBox(t('confirmDelete', { name })))) return;
    delete s.customThemes[s.theme];
    s.theme = DEFAULT_THEME;
    save(); applyTheme(); syncSettingsUI();
    toast('success', t('themeDeleted', { name }));
  });
  onTap('mmb-set-import', () => $('mmb-set-file').click());
  onTap('mmb-set-export', () => {
    const t = themeById(s.theme) || BUILTIN_THEMES[DEFAULT_THEME];
    downloadJson(t, `${slug(t.name)}.mmb-theme.json`);
  });
  $('mmb-set-file').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const raw = JSON.parse(await f.text());
      const list = Array.isArray(raw) ? raw : [raw];
      let last = null;
      list.forEach((r) => {
        const t = normalizeTheme(r);
        if (!t) return;
        let id = slug(r.id || t.name);
        if (BUILTIN_THEMES[id]) id = `${id}-custom`;
        s.customThemes[id] = t;
        last = id;
      });
      if (!last) throw new Error('no theme');
      s.theme = last;
      save(); applyTheme(); syncSettingsUI();
      toast('success', t('themeAdded', { name: s.customThemes[last].name }));
    } catch (err) {
      toast('error', t('badThemeFile'));
    }
    e.target.value = '';
  });
  syncSettingsUI();
}

function syncSettingsUI() {
  const s = settings();
  const $ = (id) => document.getElementById(id);
  if (!$('mmb-settings')) return;
  $('mmb-set-enabled').checked = !!s.enabled;
  $('mmb-set-follow').checked = !!s.followCardTheme;
  $('mmb-set-autoplay').checked = !!s.autoplay;
  const themes = allThemes();
  $('mmb-set-theme').innerHTML = Object.keys(themes).map((k) => `<option value="${esc(k)}">${esc(themes[k].name)}${BUILTIN_THEMES[k] ? '' : ' ★'}</option>`).join('');
  $('mmb-set-theme').value = themes[s.theme] ? s.theme : DEFAULT_THEME;
  const builtin = !!BUILTIN_THEMES[$('mmb-set-theme').value];
  $('mmb-set-edit').classList.toggle('mmb-locked', builtin);
  $('mmb-set-delete').classList.toggle('mmb-locked', builtin);
}

function applyEnabled() {
  if (settings().enabled) {
    mountButton();
    mountOverlay();
    applyTheme();
    render();
  } else {
    stop();
    if (document.getElementById('mmb-overlay')) togglePanel(false);
    const btn = document.getElementById('mmb-btn');
    if (btn) btn.remove();
    const ed = document.getElementById('mmb-editor');
    if (ed) ed.remove();
  }
}

/* ---------- boot ---------- */

function boot() {
  const c = ctx();
  if (!c) { console.warn(`[${MODULE}] SillyTavern context not available`); return; }
  try {
    settings();
    applyEnabled(); // button first, so a settings-panel problem can't hide it
  } catch (err) {
    console.error(`[${MODULE}] failed to mount player`, err);
    toast('error', t('loadFailed', { err: err.message || err }));
  }
  try { mountSettings(); } catch (err) { console.error(`[${MODULE}] settings panel`, err); }
  try { syncWithChat(); } catch (err) { console.error(`[${MODULE}] sync`, err); }

  const ev = c.event_types || {};
  if (c.eventSource) {
    c.eventSource.on(ev.CHAT_CHANGED, syncWithChat);
    if (ev.CHARACTER_EDITED) c.eventSource.on(ev.CHARACTER_EDITED, syncWithChat);
    if (ev.CHARACTER_DELETED) c.eventSource.on(ev.CHARACTER_DELETED, syncWithChat);
  }
  window.addEventListener('resize', clampButton);
  window.addEventListener('orientationchange', () => setTimeout(clampButton, 300));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', clampButton);
  setTimeout(clampButton, 1000); // mobile ST finishes its layout late
  console.log(`[${MODULE}] ready`);
}

if (typeof jQuery === 'function') jQuery(boot);
else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
