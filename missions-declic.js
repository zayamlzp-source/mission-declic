"use strict";

const STORAGE_KEYS = {
  profile: "festival_user_profile",
  results: "festival_results",
  suggestions: "festival_mission_suggestions",
  progress: "festival_progress_state",
  sessionId: "festival_session_id",
  missions: "festival_missions",
  adminSettings: "festival_admin_settings",
  adminPinHash: "festival_admin_pin_hash_v2",
  adminPinSalt: "festival_admin_pin_salt_v2",
  adminRecoveryEmail: "festival_admin_recovery_email",
  selectedCategory: "festival_selected_category",
  selectedSubThemes: "festival_selected_subthemes"
};

const LEGACY_KEYS = {
  adminPinPlain: "festival_admin_pin"
};

const STORAGE_KEYS_HISTORY = "missions_history";
const STORAGE_AUTH_STATE = "festival_admin_auth_state";
const STORAGE_ADMIN_SESSION = "festival_admin_session";

const DEFAULT_ADMIN_PIN = "7777";
const DEFAULT_ADMIN_RECOVERY_EMAIL = "admin@missions-declic.app";
const DEFAULT_ADMIN_SESSION_MINUTES = 45;
const ADMIN_MAX_FAILED_ATTEMPTS = 5;

const DRAW_CATEGORIES = [
  { id: "festival", label: "Festival", icon: "🎪" },
  { id: "quotidien", label: "Quotidien", icon: "☀️" },
  { id: "sante", label: "Santé", icon: "❤️‍🩹" }
];

const DRAW_THEMES = [
  { id: "festival", label: "Festival", icon: "🎪" },
  { id: "communaute", label: "Communauté", icon: "🤝" },
  { id: "daily", label: "Quotidien", icon: "☀️" },
  { id: "pool", label: "Piscine", icon: "🏊" },
  { id: "health_sport", label: "Sport", icon: "💪" },
  { id: "health_mental", label: "Mental", icon: "🧠" },
  { id: "health_wellness", label: "Bien-être", icon: "🌿" },
  { id: "health_breathing", label: "Respiration", icon: "🫁" },
  { id: "health_yoga", label: "Yoga", icon: "🧘" }
];

const CATEGORY_SUBTHEMES = {
  festival: ["communaute", "pool"],
  quotidien: ["communaute", "pool", "health_sport", "health_mental", "health_wellness", "health_breathing", "health_yoga"],
  sante: ["pool", "health_sport", "health_mental", "health_wellness", "health_breathing", "health_yoga"]
};

const CATEGORY_BASE_THEMES = {
  festival: ["festival"],
  quotidien: ["daily"],
  sante: ["health_sport", "health_mental", "health_wellness", "health_breathing", "health_yoga"]
};

const HOME_TAGLINES = [
  "Chaque mission est une porte : ouvre-la.",
  "Un petit déclic peut changer la journée.",
  "Ose une mission, regarde ce qu’elle ouvre.",
  "Avance une mission à la fois."
];

const COMMON_ACCENT_FIXES = [
  ["dèfi", "défi"],
  ["defi", "défi"],
  ["a quelqu", "à quelqu"],
  ["ca ", "ça "],
  ["tres ", "très "],
  ["ete ", "été "],
  ["sante ", "santé "],
  ["entraîne ", "entraîne "],
  ["communaute", "communauté"],
  ["amelioration", "amélioration"],
  ["difficulte", "difficulté"],
  ["facilement ", "facilement "]
];

const DEFAULT_MISSIONS = [
  createMission({ id: 1, text: "Va parler à une personne que tu ne connais pas encore.", category: "OSE", level: 2, theme: "festival", tags: ["rencontre"] }),
  createMission({ id: 2, text: "Fais un compliment sincère à quelqu’un.", category: "RESSENS", level: 1, theme: "festival", tags: ["lien"] }),
  createMission({ id: 3, text: "Invite 2 personnes à faire une photo originale.", category: "JOUE", level: 3, theme: "festival", tags: ["photo"] }),
  createMission({ id: 4, text: "Lance un mini-jeu express avec 3 personnes.", category: "ENTRAÎNE", level: 4, theme: "festival", tags: ["collectif"] }),
  createMission({ id: 5, text: "Partage un souvenir marquant du festival avec quelqu’un.", category: "LIEN", level: 2, theme: "communaute", tags: ["échange"] }),
  createMission({ id: 6, text: "Aide une personne à s’intégrer dans une activité.", category: "LIEN", level: 3, theme: "communaute", tags: ["entraide"] }),
  createMission({ id: 7, text: "Range un petit espace en 5 minutes chrono.", category: "JOUE", level: 1, theme: "daily", tags: ["quotidien"] }),
  createMission({ id: 8, text: "Envoie un message de gratitude à une personne.", category: "RESSENS", level: 1, theme: "daily", tags: ["gratitude"] }),
  createMission({ id: 9, text: "Fais 2 longueurs de piscine à ton rythme.", category: "ENTRAÎNE", level: 2, theme: "pool", tags: ["piscine"] }),
  createMission({ id: 10, text: "Crée un mini-défi fun dans l’eau avec une autre personne.", category: "JOUE", level: 4, theme: "pool", tags: ["piscine"] }),
  createMission({ id: 11, text: "Marche 10 minutes sans téléphone.", category: "ENTRAÎNE", level: 1, theme: "health_sport", tags: ["sport"] }),
  createMission({ id: 12, text: "Fais 20 squats lents.", category: "ENTRAÎNE", level: 2, theme: "health_sport", tags: ["sport"] }),
  createMission({ id: 13, text: "Prends 2 minutes pour respirer lentement.", category: "RESSENS", level: 1, theme: "health_mental", tags: ["mental"] }),
  createMission({ id: 14, text: "Écris 3 choses positives de ta journée.", category: "RESSENS", level: 1, theme: "health_mental", tags: ["mental"] }),
  createMission({ id: 15, text: "Bois un grand verre d’eau en pleine conscience.", category: "RESSENS", level: 1, theme: "health_wellness", tags: ["bien-être"] }),
  createMission({ id: 16, text: "Accorde-toi 10 minutes sans écran.", category: "OSE", level: 2, theme: "health_wellness", tags: ["bien-être"] }),
  createMission({ id: 17, text: "Fais 10 respirations abdominales lentes.", category: "RESSENS", level: 2, theme: "health_breathing", tags: ["respiration"] }),
  createMission({ id: 18, text: "Respire 3 minutes avant une discussion importante.", category: "RESSENS", level: 3, theme: "health_breathing", tags: ["respiration"] }),
  createMission({ id: 19, text: "Fais 5 minutes de yoga doux.", category: "JOUE", level: 2, theme: "health_yoga", tags: ["yoga"] }),
  createMission({ id: 20, text: "Tiens la posture de l’arbre 20 secondes par jambe.", category: "ENTRAÎNE", level: 3, theme: "health_yoga", tags: ["yoga"] })
];

const STATE = {
  currentMission: null,
  currentPhotoDataUrl: "",
  selectedCategory: null,
  selectedSubThemes: {},
  activeThemeFilter: null
};

const ADMIN_SECURITY = {
  initPromise: null,
  ready: false
};

let MISSIONS = [];
let homeTaglineIndex = -1;
let deferredInstallPrompt = null;
let swRegistration = null;

const screens = {
  home: byId("screen-home"),
  mission: byId("screen-mission"),
  validation: byId("screen-validation"),
  journal: byId("screen-journal"),
  photos: byId("screen-photos"),
  suggest: byId("screen-suggest"),
  orga: byId("screen-orga")
};

const displayNameInput = byId("display-name-input");
const missionText = byId("mission-text");
const photoInput = byId("photo-input");
const photoPreviewWrap = byId("photo-preview-wrap");
const photoPreview = byId("photo-preview");
const orgaMessageInput = byId("orga-message-input");
const fileNameDisplay = byId("file-name-display");
const journalList = byId("journal-list");
const photosGrid = byId("photos-grid");
const suggestText = byId("suggest-text");
const suggestCategory = byId("suggest-category");
const suggestLevel = byId("suggest-level");
const suggestionsList = byId("suggestions-list");
const progressBarFill = byId("progress-bar-fill");
const progressText = byId("progress-text");
const photoVisibilityWrap = byId("photo-visibility-wrap");
const photoVisibilityLock = byId("photo-visibility-lock");
const themeChoiceLabel = byId("theme-choice-label");
const adminMissionsList = byId("admin-missions-list");
const adminExcludedMissionsList = byId("admin-excluded-missions-list");
const adminPhotoReviewList = byId("admin-photo-review-list");
const adminSuggestionsReviewList = byId("admin-suggestions-review-list");
const adminMissionSearch = byId("admin-mission-search");
const adminMissionCountEl = byId("admin-mission-count");
const adminThemeJump = byId("admin-theme-jump");
const orgaSummary = byId("orga-summary");
const orgaStats = byId("orga-stats");
const topMissions = byId("top-missions");
const topRated = byId("top-rated");
const topSequences = byId("top-sequences");
const orgaMessages = byId("orga-messages");
const installBtnTop = byId("install-btn");
const installBtnHome = byId("install-btn-home");
const installCallout = byId("install-callout");
const installHelp = byId("install-help");
const updateBanner = byId("app-update-banner");
const adminLoginModal = byId("admin-login-modal");
const adminLoginInput = byId("admin-login-code-input");
const adminLoginStatus = byId("admin-login-status");

const Toast = {
  container: byId("toast-container"),
  show(message, type = "info", duration = 3200) {
    if (!this.container) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 260);
    }, duration);
  },
  success(message, duration) { this.show(message, "success", duration); },
  warning(message, duration) { this.show(message, "warning", duration); },
  error(message, duration) { this.show(message, "error", duration); },
  info(message, duration) { this.show(message, "info", duration); }
};

function byId(id) {
  return document.getElementById(id);
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn("JSON read warning:", key, error);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("JSON save error:", key, error);
    Toast.error("Impossible de sauvegarder les données.");
    return false;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDateTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeDisplayName(value) {
  return String(value || "")
    .replace(/[<>"'`\\/]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\n|\r/g, "")
    .trim()
    .slice(0, 40);
}

function createMission({
  id,
  text,
  category,
  level = 1,
  theme = "festival",
  active = true,
  bonus = false,
  note = "",
  tags = [],
  editRequests = []
}) {
  return {
    id,
    text,
    category,
    level,
    theme,
    active,
    bonus,
    note,
    tags,
    editRequests
  };
}

function normalizeMissionRecord(mission) {
  const normalizedId = toNumber(mission.id, Math.floor(Math.random() * 900000));
  return {
    ...mission,
    id: normalizedId,
    text: String(mission.text || "").trim(),
    category: String(mission.category || "JOUE").trim(),
    level: Math.max(1, Math.min(10, toNumber(mission.level, 1))),
    theme: String(mission.theme || "festival").trim(),
    active: mission.active !== false,
    bonus: !!mission.bonus,
    note: String(mission.note || ""),
    tags: Array.isArray(mission.tags) ? mission.tags.map(tag => String(tag)) : [],
    editRequests: Array.isArray(mission.editRequests) ? mission.editRequests : []
  };
}

function saveMissions(list) {
  MISSIONS = list.map(normalizeMissionRecord);
  saveJSON(STORAGE_KEYS.missions, MISSIONS);
}

function loadMissions() {
  const stored = loadJSON(STORAGE_KEYS.missions, null);
  if (Array.isArray(stored) && stored.length) {
    MISSIONS = stored.map(normalizeMissionRecord);
    return;
  }
  MISSIONS = DEFAULT_MISSIONS.map(normalizeMissionRecord);
  saveJSON(STORAGE_KEYS.missions, MISSIONS);
}

function getMissionById(id) {
  const missionId = toNumber(id, -1);
  return MISSIONS.find(mission => mission.id === missionId) || null;
}

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
  if (!sessionId) {
    sessionId = uid();
    localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
  }
  return sessionId;
}

function getUserProfile() {
  return loadJSON(STORAGE_KEYS.profile, { displayName: "" });
}

function saveUserProfile(profile) {
  saveJSON(STORAGE_KEYS.profile, profile);
}

function getDefaultProgressState() {
  return {
    internalLevel: 1,
    shownMissionIds: [],
    doneMissionIds: [],
    skippedMissionIds: [],
    currentMissionId: null,
    lastMissionId: null
  };
}

function getProgressState() {
  return loadJSON(STORAGE_KEYS.progress, getDefaultProgressState());
}

function saveProgressState(progress) {
  saveJSON(STORAGE_KEYS.progress, progress);
}

function computeInternalLevel(doneCount) {
  return Math.max(1, Math.min(8, 1 + Math.floor(doneCount / 2)));
}

function getDefaultAdminSettings() {
  return {
    allowCommunityShare: true,
    funMode: false,
    excludedMissionIds: [],
    sessionMinutes: DEFAULT_ADMIN_SESSION_MINUTES,
    supabaseUrl: "",
    supabaseAnonKey: "",
    enabledThemes: {
      festival: true,
      communaute: true,
      pool: true,
      daily: true,
      health_sport: true,
      health_mental: true,
      health_wellness: true,
      health_breathing: true,
      health_yoga: true
    }
  };
}

function getAdminSettings() {
  const defaults = getDefaultAdminSettings();
  const raw = loadJSON(STORAGE_KEYS.adminSettings, null) || {};
  return {
    allowCommunityShare: raw.allowCommunityShare !== false,
    funMode: !!raw.funMode,
    excludedMissionIds: Array.isArray(raw.excludedMissionIds)
      ? raw.excludedMissionIds.map(Number).filter(Number.isFinite)
      : [],
    sessionMinutes: Math.max(5, Math.min(240, toNumber(raw.sessionMinutes, defaults.sessionMinutes))),
    supabaseUrl: String(raw.supabaseUrl || "").trim(),
    supabaseAnonKey: String(raw.supabaseAnonKey || "").trim(),
    enabledThemes: {
      festival: raw.enabledThemes?.festival ?? defaults.enabledThemes.festival,
      communaute: raw.enabledThemes?.communaute ?? raw.enabledThemes?.["communauté"] ?? defaults.enabledThemes.communaute,
      pool: raw.enabledThemes?.pool ?? defaults.enabledThemes.pool,
      daily: raw.enabledThemes?.daily ?? defaults.enabledThemes.daily,
      health_sport: raw.enabledThemes?.health_sport ?? defaults.enabledThemes.health_sport,
      health_mental: raw.enabledThemes?.health_mental ?? defaults.enabledThemes.health_mental,
      health_wellness: raw.enabledThemes?.health_wellness ?? defaults.enabledThemes.health_wellness,
      health_breathing: raw.enabledThemes?.health_breathing ?? defaults.enabledThemes.health_breathing,
      health_yoga: raw.enabledThemes?.health_yoga ?? defaults.enabledThemes.health_yoga
    }
  };
}

function saveAdminSettings(settings) {
  saveJSON(STORAGE_KEYS.adminSettings, settings);
}

function getAdminRecoveryEmail() {
  return localStorage.getItem(STORAGE_KEYS.adminRecoveryEmail) || DEFAULT_ADMIN_RECOVERY_EMAIL;
}

function setAdminRecoveryEmail(email) {
  localStorage.setItem(STORAGE_KEYS.adminRecoveryEmail, String(email || "").trim().toLowerCase());
}

function bytesToHex(bytes) {
  return [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function createSalt() {
  if (window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }
  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

async function derivePinHash(pin, salt) {
  const safePin = String(pin || "");
  const safeSalt = String(salt || "");
  const encoder = new TextEncoder();

  if (window.crypto?.subtle) {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(safePin),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(safeSalt),
        iterations: 160000,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
    return bytesToHex(new Uint8Array(derivedBits));
  }

  const fallback = `${safeSalt}:${safePin}`;
  let hash = 0;
  for (let i = 0; i < fallback.length; i += 1) {
    hash = ((hash << 5) - hash) + fallback.charCodeAt(i);
    hash |= 0;
  }
  return `fallback_${Math.abs(hash)}`;
}

function secureEqual(a, b) {
  const x = String(a || "");
  const y = String(b || "");
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i += 1) {
    diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  }
  return diff === 0;
}

async function setAdminPinSecure(pin) {
  const normalizedPin = String(pin || "").trim();
  if (!normalizedPin) throw new Error("Code admin vide.");
  const salt = createSalt();
  const hash = await derivePinHash(normalizedPin, salt);
  localStorage.setItem(STORAGE_KEYS.adminPinSalt, salt);
  localStorage.setItem(STORAGE_KEYS.adminPinHash, hash);
  localStorage.removeItem(LEGACY_KEYS.adminPinPlain);
}

async function verifyAdminPin(pin) {
  const salt = localStorage.getItem(STORAGE_KEYS.adminPinSalt) || "";
  const expectedHash = localStorage.getItem(STORAGE_KEYS.adminPinHash) || "";
  if (!salt || !expectedHash) return false;
  const computedHash = await derivePinHash(String(pin || ""), salt);
  return secureEqual(expectedHash, computedHash);
}

async function ensureAdminSecurityReady() {
  if (ADMIN_SECURITY.ready) return;
  if (ADMIN_SECURITY.initPromise) return ADMIN_SECURITY.initPromise;

  ADMIN_SECURITY.initPromise = (async () => {
    let hash = localStorage.getItem(STORAGE_KEYS.adminPinHash);
    let salt = localStorage.getItem(STORAGE_KEYS.adminPinSalt);

    if (!hash || !salt) {
      const legacyPin = localStorage.getItem(LEGACY_KEYS.adminPinPlain);
      const sourcePin = legacyPin || DEFAULT_ADMIN_PIN;
      await setAdminPinSecure(sourcePin);
      hash = localStorage.getItem(STORAGE_KEYS.adminPinHash);
      salt = localStorage.getItem(STORAGE_KEYS.adminPinSalt);
    }

    if (!hash || !salt) {
      throw new Error("Impossible d'initialiser la sécurité admin.");
    }

    if (!localStorage.getItem(STORAGE_KEYS.adminRecoveryEmail)) {
      setAdminRecoveryEmail(DEFAULT_ADMIN_RECOVERY_EMAIL);
    }
    ADMIN_SECURITY.ready = true;
  })();

  return ADMIN_SECURITY.initPromise;
}

function getAuthState() {
  const raw = sessionStorage.getItem(STORAGE_AUTH_STATE);
  if (!raw) return { failCount: 0, lockUntil: 0 };
  try {
    const parsed = JSON.parse(raw);
    return {
      failCount: Math.max(0, toNumber(parsed.failCount, 0)),
      lockUntil: Math.max(0, toNumber(parsed.lockUntil, 0))
    };
  } catch (error) {
    return { failCount: 0, lockUntil: 0 };
  }
}

function setAuthState(state) {
  sessionStorage.setItem(STORAGE_AUTH_STATE, JSON.stringify(state));
}

function getRemainingLockMs() {
  const { lockUntil } = getAuthState();
  return Math.max(0, lockUntil - Date.now());
}

function resetAuthFailures() {
  setAuthState({ failCount: 0, lockUntil: 0 });
}

function registerAuthFailure() {
  const state = getAuthState();
  state.failCount += 1;
  if (state.failCount >= ADMIN_MAX_FAILED_ATTEMPTS) {
    const extraFails = state.failCount - ADMIN_MAX_FAILED_ATTEMPTS;
    const backoffMinutes = Math.min(30, 2 ** extraFails);
    state.lockUntil = Date.now() + (backoffMinutes * 60 * 1000);
  }
  setAuthState(state);
}

function hasValidAdminSession() {
  const raw = sessionStorage.getItem(STORAGE_ADMIN_SESSION);
  if (!raw) return false;
  try {
    const session = JSON.parse(raw);
    return toNumber(session.expiresAt, 0) > Date.now();
  } catch (error) {
    return false;
  }
}

function setAdminSession(minutes = DEFAULT_ADMIN_SESSION_MINUTES) {
  const expiresAt = Date.now() + (Math.max(5, Math.min(240, minutes)) * 60 * 1000);
  sessionStorage.setItem(STORAGE_ADMIN_SESSION, JSON.stringify({
    token: uid(),
    expiresAt
  }));
}

function clearAdminSession() {
  sessionStorage.removeItem(STORAGE_ADMIN_SESSION);
}

function ensureAdminSessionOrWarn() {
  if (hasValidAdminSession()) return true;
  Toast.warning("Session admin expirée.");
  return false;
}

function setAdminLoginStatus(message = "") {
  if (adminLoginStatus) adminLoginStatus.textContent = message;
}

function openAdminLoginModal() {
  if (!adminLoginModal) return;
  adminLoginModal.hidden = false;
  setAdminLoginStatus("");
  if (adminLoginInput) {
    adminLoginInput.value = "";
    setTimeout(() => adminLoginInput.focus(), 0);
  }
}

function closeAdminLoginModal() {
  if (!adminLoginModal) return;
  adminLoginModal.hidden = true;
  setAdminLoginStatus("");
}

function getBackendConfigFromSettings() {
  const settings = getAdminSettings();
  return {
    supabaseUrl: settings.supabaseUrl,
    supabaseAnonKey: settings.supabaseAnonKey
  };
}

function hasRecoveryBackendConfigured() {
  const cfg = getBackendConfigFromSettings();
  return !!cfg.supabaseUrl && !!cfg.supabaseAnonKey;
}

function getSupabaseHeaders(config) {
  return {
    "Content-Type": "application/json",
    apikey: config.supabaseAnonKey,
    Authorization: `Bearer ${config.supabaseAnonKey}`
  };
}

async function supabaseAuthRequest(path, body) {
  const config = getBackendConfigFromSettings();
  if (!hasRecoveryBackendConfigured()) {
    throw new Error("Supabase non configuré.");
  }

  const baseUrl = config.supabaseUrl.replace(/\/$/, "");
  const endpoint = `${baseUrl}/auth/v1/${path}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: getSupabaseHeaders(config),
    body: JSON.stringify(body)
  });

  if (response.ok) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  let message = `Erreur auth (${response.status})`;
  try {
    const payload = await response.json();
    message = payload.error_description || payload.msg || payload.message || message;
  } catch (error) {
    const fallbackText = await response.text();
    if (fallbackText) message = fallbackText;
  }
  throw new Error(message);
}

async function requestRecoveryOtp(email) {
  return supabaseAuthRequest("otp", {
    email,
    create_user: true,
    data: { role: "admin_recovery" }
  });
}

async function verifyRecoveryOtp(email, token) {
  return supabaseAuthRequest("verify", {
    email,
    token,
    type: "email"
  });
}

function missionAllowedByAdmin(mission, settings = getAdminSettings()) {
  if (!mission.active || mission.bonus) return false;
  if (settings.excludedMissionIds.includes(Number(mission.id))) return false;
  if (settings.enabledThemes[mission.theme] === false) return false;
  return true;
}

function missionBlockedByFunMode(mission, settings = getAdminSettings()) {
  if (!settings.funMode) return false;
  const simplePatterns = [
    /respire/i,
    /souris/i,
    /grand verre d’eau/i,
    /range un petit espace/i,
    /sans écran/i
  ];
  return mission.level <= 1 && simplePatterns.some(pattern => pattern.test(mission.text));
}

function getResults() {
  return loadJSON(STORAGE_KEYS.results, []).map(normalizeResultRecord);
}

function saveResults(results) {
  saveJSON(STORAGE_KEYS.results, results.map(normalizeResultRecord));
}

function normalizeResultRecord(result) {
  const normalized = { ...result };
  normalized.visibility = normalized.visibility || "private";
  if (!normalized.photoUrl) normalized.reviewStatus = "none";
  if (!normalized.reviewStatus && normalized.photoUrl) {
    normalized.reviewStatus = normalized.visibility === "participants" ? "pending" : "private";
  }
  return normalized;
}

function saveResult(result) {
  const results = getResults();
  results.push(normalizeResultRecord(result));
  saveResults(results);
}

function updateResultRating(resultId, rating) {
  const results = getResults();
  const found = results.find(item => item.id === resultId);
  if (!found) return;
  found.rating = rating;
  saveResults(results);
}

function updateResultReview(resultId, updates) {
  const results = getResults();
  const found = results.find(item => item.id === resultId);
  if (!found) return;
  Object.assign(found, updates);
  found.adminReviewedAt = nowIso();
  saveResults(results);
}

function getOwnResults() {
  const currentSessionId = getOrCreateSessionId();
  return getResults()
    .filter(item => item.sessionId === currentSessionId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getSuggestions() {
  return loadJSON(STORAGE_KEYS.suggestions, []);
}

function saveSuggestions(items) {
  saveJSON(STORAGE_KEYS.suggestions, items);
}

function saveSuggestion(item) {
  const suggestions = getSuggestions();
  suggestions.push(item);
  saveSuggestions(suggestions);
}

function updateSuggestionStatus(id, status) {
  const suggestions = getSuggestions();
  const found = suggestions.find(item => item.id === id);
  if (!found) return;
  found.status = status;
  found.updatedAt = nowIso();
  saveSuggestions(suggestions);
}

function getSelectedThemeIds() {
  if (!STATE.selectedCategory) return null;
  const base = CATEGORY_BASE_THEMES[STATE.selectedCategory] || [];
  const selected = Object.keys(STATE.selectedSubThemes || {}).filter(themeId => STATE.selectedSubThemes[themeId]);
  return [...new Set([...base, ...selected])];
}

function pickNextMission() {
  const progress = getProgressState();
  progress.internalLevel = computeInternalLevel(progress.doneMissionIds.length);

  const allowedLevels = [progress.internalLevel - 1, progress.internalLevel, progress.internalLevel + 1]
    .filter(level => level >= 1 && level <= 10);
  const selectedThemeIds = getSelectedThemeIds();
  const settings = getAdminSettings();
  const recentIds = progress.shownMissionIds.slice(-6);

  let pool = MISSIONS.filter(mission => {
    if (!missionAllowedByAdmin(mission, settings)) return false;
    if (missionBlockedByFunMode(mission, settings)) return false;
    if (!allowedLevels.includes(mission.level)) return false;
    if (selectedThemeIds && !selectedThemeIds.includes(mission.theme)) return false;
    return true;
  });

  if (!pool.length) {
    pool = MISSIONS.filter(mission => {
      if (!missionAllowedByAdmin(mission, settings)) return false;
      if (selectedThemeIds && !selectedThemeIds.includes(mission.theme)) return false;
      return true;
    });
  }

  let candidates = pool.filter(mission => !recentIds.includes(mission.id) && mission.id !== progress.lastMissionId);
  if (!candidates.length) candidates = pool.filter(mission => mission.id !== progress.lastMissionId);
  if (!candidates.length) candidates = pool;
  if (!candidates.length) return null;

  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  progress.currentMissionId = picked.id;
  progress.lastMissionId = picked.id;
  progress.shownMissionIds.push(picked.id);
  saveProgressState(progress);
  return picked;
}

function skipCurrentMission() {
  const progress = getProgressState();
  if (progress.currentMissionId) progress.skippedMissionIds.push(progress.currentMissionId);
  progress.currentMissionId = null;
  saveProgressState(progress);
}

function completeCurrentMission() {
  const progress = getProgressState();
  if (progress.currentMissionId && !progress.doneMissionIds.includes(progress.currentMissionId)) {
    progress.doneMissionIds.push(progress.currentMissionId);
  }
  progress.currentMissionId = null;
  progress.internalLevel = computeInternalLevel(progress.doneMissionIds.length);
  saveProgressState(progress);
}

function replayMission(missionId) {
  const mission = getMissionById(missionId);
  if (!mission) return null;
  const progress = getProgressState();
  progress.currentMissionId = mission.id;
  progress.lastMissionId = mission.id;
  saveProgressState(progress);
  return mission;
}

function showScreen(name) {
  const target = screens[name];
  if (!target) return;
  Object.values(screens).forEach(screen => screen?.classList.remove("active"));
  target.classList.add("active");

  if (name === "journal") renderJournal();
  if (name === "photos") renderPhotos();
  if (name === "suggest") renderSuggestions();
  if (name === "orga") {
    if (!hasValidAdminSession()) {
      Toast.warning("Session admin expirée.");
      showScreen("home");
      return;
    }
    hydrateAdminSettingsForm();
    renderOrga();
  }
  if (name === "home") updateProgressBar();
}

function renderMission(mission) {
  STATE.currentMission = mission;
  missionText.textContent = mission ? mission.text : "Aucune mission disponible.";
  const editButton = byId("flag-mission-edit-btn");
  if (editButton && mission) {
    const alreadyExists = mission.editRequests.some(request => request.sessionId === getOrCreateSessionId());
    editButton.textContent = alreadyExists ? "Modifier ma suggestion" : "💡 Suggestion d'amélioration";
  }
  showScreen("mission");
}

function showNextHomeTagline(initial = false) {
  const node = byId("home-tagline");
  if (!node || !HOME_TAGLINES.length) return;
  let nextIndex = Math.floor(Math.random() * HOME_TAGLINES.length);
  if (!initial && HOME_TAGLINES.length > 1) {
    while (nextIndex === homeTaglineIndex) {
      nextIndex = Math.floor(Math.random() * HOME_TAGLINES.length);
    }
  }
  homeTaglineIndex = nextIndex;
  node.textContent = HOME_TAGLINES[homeTaglineIndex];
}

function updateProgressBar() {
  const progress = getProgressState();
  const settings = getAdminSettings();
  const availableIds = new Set(
    MISSIONS
      .filter(mission => missionAllowedByAdmin(mission, settings) && !missionBlockedByFunMode(mission, settings))
      .map(mission => mission.id)
  );

  const doneCount = progress.doneMissionIds.filter(id => availableIds.has(id)).length;
  const total = availableIds.size;
  const percent = total ? Math.round((doneCount / total) * 100) : 0;
  if (progressBarFill) progressBarFill.style.width = `${percent}%`;
  if (progressText) progressText.textContent = `${doneCount} mission${doneCount > 1 ? "s" : ""} validée${doneCount > 1 ? "s" : ""} · ${percent}%`;
}

function renderThemePicker() {
  const root = byId("theme-list");
  if (!root) return;
  root.innerHTML = "";

  DRAW_CATEGORIES.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `theme-btn${STATE.selectedCategory === category.id ? " active" : ""}`;
    button.innerHTML = `<span class="theme-icon">${category.icon}</span><span class="theme-label">${escapeHtml(category.label)}<span class="theme-checkmark">✓</span></span>`;
    button.addEventListener("click", () => {
      if (STATE.selectedCategory === category.id) {
        STATE.selectedCategory = null;
        STATE.selectedSubThemes = {};
      } else {
        STATE.selectedCategory = category.id;
        STATE.selectedSubThemes = {};
      }
      localStorage.setItem(STORAGE_KEYS.selectedCategory, STATE.selectedCategory || "");
      saveJSON(STORAGE_KEYS.selectedSubThemes, STATE.selectedSubThemes);
      renderThemePicker();
    });
    root.appendChild(button);
  });

  if (STATE.selectedCategory) {
    const subThemeIds = CATEGORY_SUBTHEMES[STATE.selectedCategory] || [];
    subThemeIds.forEach(themeId => {
      const theme = DRAW_THEMES.find(item => item.id === themeId);
      if (!theme) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `theme-btn${STATE.selectedSubThemes[theme.id] ? " active" : ""}`;
      button.innerHTML = `<span class="theme-icon">${theme.icon}</span><span class="theme-label">${escapeHtml(theme.label)}<span class="theme-checkmark">✓</span></span>`;
      button.addEventListener("click", () => {
        STATE.selectedSubThemes[theme.id] = !STATE.selectedSubThemes[theme.id];
        saveJSON(STORAGE_KEYS.selectedSubThemes, STATE.selectedSubThemes);
        renderThemePicker();
      });
      root.appendChild(button);
    });
  }

  if (themeChoiceLabel) {
    if (!STATE.selectedCategory) {
      themeChoiceLabel.textContent = "Aucune catégorie imposée : tirage libre.";
    } else {
      const category = DRAW_CATEGORIES.find(item => item.id === STATE.selectedCategory);
      const selectedCount = Object.values(STATE.selectedSubThemes).filter(Boolean).length;
      themeChoiceLabel.textContent = `${category?.label || "Catégorie"} sélectionnée${selectedCount ? ` + ${selectedCount} option(s)` : ""}.`;
    }
  }
}

function syncProfileFromInput() {
  const profile = getUserProfile();
  const sanitized = sanitizeDisplayName(displayNameInput?.value || "");
  if (displayNameInput && displayNameInput.value !== sanitized) {
    displayNameInput.value = sanitized;
  }
  profile.displayName = sanitized;
  saveUserProfile(profile);
}

function hydrateProfile() {
  const profile = getUserProfile();
  if (displayNameInput) displayNameInput.value = profile.displayName || "";
}

function resetValidationForm() {
  if (photoInput) photoInput.value = "";
  if (orgaMessageInput) orgaMessageInput.value = "";
  if (fileNameDisplay) fileNameDisplay.textContent = "";
  STATE.currentPhotoDataUrl = "";
  if (photoPreview) photoPreview.src = "";
  if (photoPreviewWrap) photoPreviewWrap.style.display = "none";
  if (photoVisibilityWrap) photoVisibilityWrap.style.display = "none";
  if (photoVisibilityLock) photoVisibilityLock.style.display = "none";
  const privateRadio = document.querySelector('input[name="photo-visibility"][value="private"]');
  if (privateRadio) privateRadio.checked = true;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImage(dataUrl, maxSize = 1280, quality = 0.82) {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      let { width, height } = image;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => resolve(dataUrl);
    image.src = dataUrl;
  });
}

async function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) {
    resetValidationForm();
    return;
  }
  try {
    let dataUrl = await fileToDataUrl(file);
    dataUrl = await compressImage(dataUrl);
    STATE.currentPhotoDataUrl = String(dataUrl || "");
    if (photoPreview) photoPreview.src = STATE.currentPhotoDataUrl;
    if (photoPreviewWrap) photoPreviewWrap.style.display = "grid";
    if (photoVisibilityWrap) photoVisibilityWrap.style.display = "grid";
    if (fileNameDisplay) fileNameDisplay.textContent = file.name;
    const settings = getAdminSettings();
    if (photoVisibilityLock) photoVisibilityLock.style.display = settings.allowCommunityShare ? "none" : "block";
  } catch (error) {
    console.error("Photo read error:", error);
    Toast.error("Impossible de charger la photo.");
  }
}

function openValidation() {
  if (!STATE.currentMission) return;
  resetValidationForm();
  const settings = getAdminSettings();
  if (photoVisibilityLock) photoVisibilityLock.style.display = settings.allowCommunityShare ? "none" : "block";
  showScreen("validation");
}

function confirmValidation() {
  if (!STATE.currentMission) return;
  const settings = getAdminSettings();
  const selectedVisibility = document.querySelector('input[name="photo-visibility"]:checked');
  const visibility = STATE.currentPhotoDataUrl && settings.allowCommunityShare
    ? (selectedVisibility?.value || "private")
    : "private";

  const progress = getProgressState();
  const previousMissionId = progress.doneMissionIds.length
    ? progress.doneMissionIds[progress.doneMissionIds.length - 1]
    : null;
  const profile = getUserProfile();

  saveResult({
    id: uid(),
    sessionId: getOrCreateSessionId(),
    missionId: STATE.currentMission.id,
    previousMissionId,
    status: "done",
    photoUrl: STATE.currentPhotoDataUrl,
    visibility,
    reviewStatus: STATE.currentPhotoDataUrl ? (visibility === "participants" ? "pending" : "private") : "none",
    orgaMessage: orgaMessageInput?.value.trim() || "",
    rating: null,
    displayName: profile.displayName || "",
    createdAt: nowIso()
  });

  completeCurrentMission();
  updateProgressBar();
  resetValidationForm();
  showNextHomeTagline();
  const nextMission = pickNextMission();
  if (nextMission) {
    renderMission(nextMission);
  } else {
    showScreen("home");
    Toast.warning("Plus de mission disponible pour l’instant.");
  }
}

function launchMissionDraw() {
  syncProfileFromInput();
  const mission = pickNextMission();
  if (!mission) {
    Toast.warning("Aucune mission disponible.");
    return;
  }
  renderMission(mission);
}

function goToAnotherMission() {
  skipCurrentMission();
  const mission = pickNextMission();
  if (!mission) {
    Toast.warning("Aucune autre mission disponible.");
    return;
  }
  renderMission(mission);
}

function renderStars(result) {
  const wrapper = document.createElement("div");
  wrapper.className = "stars";
  for (let i = 1; i <= 5; i += 1) {
    const button = document.createElement("button");
    button.className = `star-btn${result.rating === i ? " active" : ""}`;
    button.type = "button";
    button.textContent = String(i);
    button.addEventListener("click", () => {
      updateResultRating(result.id, i);
      renderJournal();
      renderOrga();
    });
    wrapper.appendChild(button);
  }
  return wrapper;
}

function renderJournal() {
  if (!journalList) return;
  const results = getOwnResults();
  journalList.innerHTML = "";
  if (!results.length) {
    journalList.innerHTML = "<div class=\"empty\">Aucune mission pour l’instant.</div>";
    return;
  }

  results.forEach(result => {
    const mission = getMissionById(result.missionId);
    if (!mission) return;

    const item = document.createElement("div");
    item.className = "journal-item";

    const top = document.createElement("div");
    top.className = "journal-top";

    if (result.photoUrl) {
      const img = document.createElement("img");
      img.className = "thumb";
      img.src = result.photoUrl;
      img.alt = "Photo mission";
      top.appendChild(img);
    }

    const main = document.createElement("div");
    main.className = "journal-main";
    main.innerHTML = `
      <div class="journal-title">${escapeHtml(mission.text)}</div>
      <div class="micro">${formatDateTime(result.createdAt)}</div>
      <div class="micro">Ta note (1 à 5)</div>
    `;
    main.appendChild(renderStars(result));

    const actions = document.createElement("div");
    actions.className = "row";
    const replayBtn = document.createElement("button");
    replayBtn.className = "btn btn-secondary";
    replayBtn.type = "button";
    replayBtn.textContent = "Refaire cette mission";
    replayBtn.addEventListener("click", () => {
      const replay = replayMission(result.missionId);
      if (replay) renderMission(replay);
    });
    actions.appendChild(replayBtn);
    main.appendChild(actions);

    top.appendChild(main);
    item.appendChild(top);
    journalList.appendChild(item);
  });
}

function renderPhotos() {
  if (!photosGrid) return;
  const items = getResults()
    .filter(result => result.photoUrl && result.visibility === "participants" && result.reviewStatus === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  photosGrid.innerHTML = "";
  if (!items.length) {
    photosGrid.innerHTML = "<div class=\"empty\">Aucune photo partagée pour le moment.</div>";
    return;
  }

  items.forEach(result => {
    const mission = getMissionById(result.missionId);
    const card = document.createElement("div");
    card.className = "photo-card";
    card.innerHTML = `
      <img src="${escapeHtml(result.photoUrl)}" alt="Photo partagée">
      <div class="photo-title">${escapeHtml(mission?.text || "Mission")}</div>
      <div class="micro">${formatDateTime(result.createdAt)}${result.displayName ? ` · ${escapeHtml(result.displayName)}` : ""}</div>
    `;
    photosGrid.appendChild(card);
  });
}

function renderSuggestions() {
  if (!suggestionsList) return;
  const suggestions = getSuggestions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  suggestionsList.innerHTML = "";
  if (!suggestions.length) {
    suggestionsList.innerHTML = "<div class=\"empty\">Aucune proposition pour l’instant.</div>";
    return;
  }

  suggestions.forEach(suggestion => {
    const row = document.createElement("div");
    row.className = "suggestion-item";
    row.innerHTML = `
      <div class="journal-title">${escapeHtml(suggestion.text)}</div>
      <div class="micro">${formatDateTime(suggestion.createdAt)}${suggestion.category ? ` · ${escapeHtml(suggestion.category)}` : ""}${suggestion.level ? ` · Niveau ${suggestion.level}` : ""}${suggestion.displayName ? ` · ${escapeHtml(suggestion.displayName)}` : ""}</div>
    `;
    suggestionsList.appendChild(row);
  });
}

function submitSuggestion() {
  const text = suggestText?.value.trim() || "";
  if (!text) {
    Toast.warning("Écris d’abord une mission à proposer.");
    suggestText?.focus();
    return;
  }

  const profile = getUserProfile();
  const parsedLevel = toNumber(suggestLevel?.value, 0);
  saveSuggestion({
    id: uid(),
    text,
    category: suggestCategory?.value || "",
    level: parsedLevel >= 1 && parsedLevel <= 8 ? parsedLevel : null,
    status: "proposed",
    displayName: profile.displayName || "",
    createdAt: nowIso()
  });

  if (suggestText) suggestText.value = "";
  if (suggestCategory) suggestCategory.value = "";
  if (suggestLevel) suggestLevel.value = "";
  renderSuggestions();
  renderOrga();
  Toast.success("Mission proposée enregistrée.");
}

function flagCurrentMissionForEdit() {
  if (!STATE.currentMission) return;
  const mission = getMissionById(STATE.currentMission.id);
  if (!mission) return;

  const currentSessionId = getOrCreateSessionId();
  const existing = mission.editRequests.find(request => request.sessionId === currentSessionId);
  const note = window.prompt("Ta suggestion d’amélioration pour cette mission :", existing?.note || "");
  if (note === null) return;

  const profile = getUserProfile();
  if (existing) {
    existing.note = note.trim();
    existing.updatedAt = nowIso();
  } else {
    mission.editRequests.unshift({
      id: uid(),
      sessionId: currentSessionId,
      displayName: profile.displayName || "",
      note: note.trim(),
      createdAt: nowIso()
    });
  }
  saveMissions(MISSIONS);
  renderMission(mission);
  Toast.success("Suggestion enregistrée.");
}

function getThemePresentation(themeId) {
  return DRAW_THEMES.find(theme => theme.id === themeId) || { id: themeId || "other", label: themeId || "Autres", icon: "•" };
}

function addMissionHistory(action, mission, extra = {}) {
  const history = loadJSON(STORAGE_KEYS_HISTORY, []);
  history.unshift({
    date: nowIso(),
    action,
    mission: mission ? { ...mission } : null,
    ...extra
  });
  saveJSON(STORAGE_KEYS_HISTORY, history.slice(0, 1000));
}

function renderMissionHistory() {
  const list = byId("admin-history-list");
  if (!list) return;
  const history = loadJSON(STORAGE_KEYS_HISTORY, []);
  if (!history.length) {
    list.innerHTML = "<div class=\"micro\">Aucune modification enregistrée.</div>";
    return;
  }
  list.innerHTML = history.map(entry => {
    const mission = entry.mission;
    const missionTextPart = mission ? ` mission <b>#${mission.id || "?"}</b> : ${escapeHtml((mission.text || "").slice(0, 80))}` : "";
    return `<div class="admin-history-item"><span class="admin-history-action">${escapeHtml(entry.action)}</span>${missionTextPart}<span class="admin-history-date">${formatDateTime(entry.date)}</span></div>`;
  }).join("");
}

function undoLastMissionHistory() {
  if (!ensureAdminSessionOrWarn()) return;
  const history = loadJSON(STORAGE_KEYS_HISTORY, []);
  if (!history.length) {
    Toast.warning("Aucune action à annuler.");
    return;
  }

  const last = history.shift();
  let changed = false;

  if (last.action === "Création" && last.mission) {
    MISSIONS = MISSIONS.filter(mission => mission.id !== toNumber(last.mission.id, -1));
    changed = true;
  } else if (last.action === "Suppression" && last.mission) {
    MISSIONS.push(normalizeMissionRecord(last.mission));
    changed = true;
  } else if (last.action === "Modification" && last.previousMission) {
    MISSIONS = MISSIONS.map(mission =>
      mission.id === toNumber(last.previousMission.id, -1) ? normalizeMissionRecord(last.previousMission) : mission
    );
    changed = true;
  }

  if (!changed) {
    Toast.warning("Impossible d’annuler cette action.");
    return;
  }

  saveMissions(MISSIONS);
  saveJSON(STORAGE_KEYS_HISTORY, history);
  renderMissionHistory();
  renderOrga();
  updateProgressBar();
  Toast.success("Dernière action annulée.");
}

function removeMissionById(id) {
  const mission = getMissionById(id);
  if (!mission) return;
  addMissionHistory("Suppression", mission);
  saveMissions(MISSIONS.filter(item => item.id !== mission.id));
}

function updateMissionById(id, updates) {
  const mission = getMissionById(id);
  if (!mission) return null;
  const previousMission = { ...mission };
  Object.assign(mission, updates);
  saveMissions(MISSIONS);
  addMissionHistory("Modification", mission, { previousMission });
  return mission;
}

function setMissionExcluded(id, excluded) {
  const settings = getAdminSettings();
  const set = new Set(settings.excludedMissionIds.map(Number));
  if (excluded) set.add(Number(id));
  else set.delete(Number(id));
  settings.excludedMissionIds = [...set];
  saveAdminSettings(settings);
}

function editMissionInline(mission) {
  const newText = window.prompt(`Texte mission #${mission.id}`, mission.text || "");
  if (newText === null) return;
  const newCategory = window.prompt(`Catégorie mission #${mission.id}`, mission.category || "JOUE");
  if (newCategory === null) return;
  const newLevelRaw = window.prompt(`Niveau mission #${mission.id} (1-10)`, String(mission.level || 1));
  if (newLevelRaw === null) return;
  const newTheme = window.prompt(`Thème mission #${mission.id}`, mission.theme || "festival");
  if (newTheme === null) return;
  const newNote = window.prompt(`Note interne mission #${mission.id}`, mission.note || "");
  if (newNote === null) return;

  updateMissionById(mission.id, {
    text: String(newText).trim() || mission.text,
    category: String(newCategory).trim() || mission.category,
    level: Math.max(1, Math.min(10, toNumber(newLevelRaw, mission.level))),
    theme: String(newTheme).trim() || mission.theme,
    note: String(newNote).trim()
  });
  renderOrga();
  updateProgressBar();
}

function renderAdminThemeJump(groups) {
  if (!adminThemeJump) return;
  adminThemeJump.innerHTML = "";

  const allChip = document.createElement("a");
  allChip.href = "#";
  allChip.className = `admin-theme-chip${STATE.activeThemeFilter === null ? " is-active" : ""}`;
  allChip.textContent = "🌐 Toutes";
  allChip.addEventListener("click", event => {
    event.preventDefault();
    STATE.activeThemeFilter = null;
    renderAdminMissionList();
  });
  adminThemeJump.appendChild(allChip);

  groups.forEach(([themeId, missions]) => {
    const theme = getThemePresentation(themeId);
    const hasFlags = missions.some(mission => mission.editRequests.length > 0);
    const chip = document.createElement("a");
    chip.href = "#";
    chip.className = `admin-theme-chip${STATE.activeThemeFilter === themeId ? " is-active" : ""}${hasFlags ? " is-flagged" : ""}`;
    chip.textContent = `${theme.icon} ${theme.label}`;
    chip.addEventListener("click", event => {
      event.preventDefault();
      STATE.activeThemeFilter = themeId;
      renderAdminMissionList();
    });
    adminThemeJump.appendChild(chip);
  });
}

function renderAdminMissionList() {
  if (!adminMissionsList) return;
  const query = (adminMissionSearch?.value || "").trim().toLowerCase();
  const settings = getAdminSettings();
  const excludedSet = new Set(settings.excludedMissionIds.map(Number));

  let items = MISSIONS.filter(mission => {
    if (STATE.activeThemeFilter && mission.theme !== STATE.activeThemeFilter) return false;
    if (!query) return true;
    const searchable = `${mission.text} ${mission.category} ${mission.theme} ${mission.note} ${(mission.tags || []).join(" ")}`.toLowerCase();
    return searchable.includes(query);
  });

  if (adminMissionCountEl) {
    adminMissionCountEl.textContent = `${items.length} / ${MISSIONS.length} mission(s)`;
  }
  adminMissionsList.innerHTML = "";

  if (!items.length) {
    adminMissionsList.innerHTML = "<div class=\"empty\">Aucune mission trouvée.</div>";
    renderAdminThemeJump([]);
    return;
  }

  const map = new Map();
  items.forEach(mission => {
    if (!map.has(mission.theme)) map.set(mission.theme, []);
    map.get(mission.theme).push(mission);
  });
  const groups = [...map.entries()];
  renderAdminThemeJump(groups);

  groups.forEach(([themeId, missions]) => {
    const theme = getThemePresentation(themeId);
    const section = document.createElement("div");
    section.className = "admin-theme-group";
    section.innerHTML = `
      <div class="admin-theme-header">
        <div><strong>${theme.icon} ${escapeHtml(theme.label)}</strong></div>
        <div class="admin-theme-meta">${missions.length} mission(s)</div>
      </div>
    `;

    missions.sort((a, b) => a.id - b.id).forEach(mission => {
      const excluded = excludedSet.has(mission.id);
      const requestCount = mission.editRequests.length;
      const row = document.createElement("div");
      row.className = "admin-item";
      row.innerHTML = `
        <div class="admin-item-main">
          <div class="journal-title">#${mission.id} · ${escapeHtml(mission.text)}</div>
          <div class="micro">${escapeHtml(mission.category)} · Niveau ${mission.level}${mission.active ? "" : " · inactive"}${excluded ? " · exclue" : ""}</div>
          ${mission.note ? `<div class="micro">Note : ${escapeHtml(mission.note)}</div>` : ""}
          ${requestCount ? `<div class="flag-badge">💡 ${requestCount} suggestion${requestCount > 1 ? "s" : ""}</div>` : ""}
        </div>
      `;

      const actions = document.createElement("div");
      actions.className = "admin-item-actions";

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.type = "button";
      editBtn.textContent = "Modifier";
      editBtn.addEventListener("click", () => editMissionInline(mission));

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-secondary";
      toggleBtn.type = "button";
      toggleBtn.textContent = mission.active ? "Désactiver" : "Réactiver";
      toggleBtn.addEventListener("click", () => {
        updateMissionById(mission.id, { active: !mission.active });
        renderOrga();
        updateProgressBar();
      });

      const excludeBtn = document.createElement("button");
      excludeBtn.className = "btn btn-secondary";
      excludeBtn.type = "button";
      excludeBtn.textContent = excluded ? "Réintégrer" : "Exclure";
      excludeBtn.addEventListener("click", () => {
        setMissionExcluded(mission.id, !excluded);
        renderOrga();
        updateProgressBar();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-secondary";
      deleteBtn.type = "button";
      deleteBtn.textContent = "Supprimer";
      deleteBtn.addEventListener("click", () => {
        if (!window.confirm(`Supprimer la mission #${mission.id} ?`)) return;
        removeMissionById(mission.id);
        renderOrga();
        updateProgressBar();
      });

      actions.append(editBtn, toggleBtn, excludeBtn, deleteBtn);

      if (requestCount) {
        const clearBtn = document.createElement("button");
        clearBtn.className = "btn btn-secondary";
        clearBtn.type = "button";
        clearBtn.textContent = "Demandes traitées";
        clearBtn.addEventListener("click", () => {
          updateMissionById(mission.id, { editRequests: [] });
          renderOrga();
        });
        actions.appendChild(clearBtn);
      }

      row.appendChild(actions);
      section.appendChild(row);
    });

    adminMissionsList.appendChild(section);
  });
}

function renderAdminExcludedMissionList() {
  if (!adminExcludedMissionsList) return;
  const excludedSet = new Set(getAdminSettings().excludedMissionIds.map(Number));
  const items = MISSIONS.filter(mission => excludedSet.has(mission.id)).sort((a, b) => a.id - b.id);
  adminExcludedMissionsList.innerHTML = "";

  if (!items.length) {
    adminExcludedMissionsList.innerHTML = "<div class=\"empty\">Aucune mission exclue pour le moment.</div>";
    return;
  }

  items.forEach(mission => {
    const row = document.createElement("div");
    row.className = "admin-item";
    row.innerHTML = `
      <div class="admin-item-main">
        <div class="journal-title">#${mission.id} · ${escapeHtml(mission.text)}</div>
        <div class="micro">${escapeHtml(mission.category)} · Niveau ${mission.level} · ${escapeHtml(getThemePresentation(mission.theme).label)}</div>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-item-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-secondary";
    editBtn.type = "button";
    editBtn.textContent = "Modifier";
    editBtn.addEventListener("click", () => editMissionInline(mission));

    const restoreBtn = document.createElement("button");
    restoreBtn.className = "btn btn-primary";
    restoreBtn.type = "button";
    restoreBtn.textContent = "Réintégrer";
    restoreBtn.addEventListener("click", () => {
      setMissionExcluded(mission.id, false);
      renderOrga();
      updateProgressBar();
    });

    actions.append(editBtn, restoreBtn);
    row.appendChild(actions);
    adminExcludedMissionsList.appendChild(row);
  });
}

function renderAdminPhotoReview() {
  if (!adminPhotoReviewList) return;
  const items = getResults()
    .filter(result => !!result.photoUrl)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  adminPhotoReviewList.innerHTML = "";
  if (!items.length) {
    adminPhotoReviewList.innerHTML = "<div class=\"empty\">Aucune photo à modérer.</div>";
    return;
  }

  items.forEach(result => {
    const mission = getMissionById(result.missionId);
    const row = document.createElement("div");
    row.className = "admin-item";
    row.innerHTML = `
      <div class="admin-item-top">
        <img class="admin-thumb" src="${escapeHtml(result.photoUrl)}" alt="Photo mission">
        <div class="admin-item-main">
          <div class="journal-title">${escapeHtml(mission?.text || "Mission")}</div>
          <div class="micro">${formatDateTime(result.createdAt)}${result.displayName ? ` · ${escapeHtml(result.displayName)}` : ""}</div>
          <div class="status-badge">${escapeHtml(result.visibility)} · ${escapeHtml(result.reviewStatus || "none")}</div>
        </div>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-item-actions";

    if (result.visibility === "participants" && result.reviewStatus !== "approved") {
      const approveBtn = document.createElement("button");
      approveBtn.className = "btn btn-primary";
      approveBtn.type = "button";
      approveBtn.textContent = "Valider";
      approveBtn.addEventListener("click", () => {
        updateResultReview(result.id, { reviewStatus: "approved" });
        renderOrga();
        renderPhotos();
      });
      actions.appendChild(approveBtn);
    }

    if (result.reviewStatus !== "rejected") {
      const rejectBtn = document.createElement("button");
      rejectBtn.className = "btn btn-secondary";
      rejectBtn.type = "button";
      rejectBtn.textContent = "Refuser";
      rejectBtn.addEventListener("click", () => {
        updateResultReview(result.id, { reviewStatus: "rejected" });
        renderOrga();
        renderPhotos();
      });
      actions.appendChild(rejectBtn);
    }

    if (result.visibility !== "private") {
      const privateBtn = document.createElement("button");
      privateBtn.className = "btn btn-secondary";
      privateBtn.type = "button";
      privateBtn.textContent = "Passer en privé";
      privateBtn.addEventListener("click", () => {
        updateResultReview(result.id, { visibility: "private", reviewStatus: "private" });
        renderOrga();
        renderPhotos();
      });
      actions.appendChild(privateBtn);
    }

    row.appendChild(actions);
    adminPhotoReviewList.appendChild(row);
  });
}

function importSuggestionAsMission(suggestion) {
  const nextId = Math.max(0, ...MISSIONS.map(item => item.id)) + 1;
  const mission = createMission({
    id: nextId,
    text: suggestion.text,
    category: suggestion.category || "JOUE",
    level: suggestion.level || 1,
    theme: "festival",
    note: `Suggestion ${suggestion.displayName || "participant"}`
  });
  addMissionHistory("Création", mission);
  saveMissions([...MISSIONS, normalizeMissionRecord(mission)]);
  updateSuggestionStatus(suggestion.id, "imported");
}

function renderAdminSuggestionsReview() {
  if (!adminSuggestionsReviewList) return;
  const items = getSuggestions()
    .filter(item => item.status === "proposed")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  adminSuggestionsReviewList.innerHTML = "";

  if (!items.length) {
    adminSuggestionsReviewList.innerHTML = "<div class=\"empty\">Aucune proposition en attente.</div>";
    return;
  }

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "admin-item";
    row.innerHTML = `
      <div class="admin-item-main">
        <div class="journal-title">${escapeHtml(item.text)}</div>
        <div class="micro">${formatDateTime(item.createdAt)}${item.category ? ` · ${escapeHtml(item.category)}` : ""}${item.level ? ` · Niveau ${item.level}` : ""}${item.displayName ? ` · ${escapeHtml(item.displayName)}` : ""}</div>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "admin-item-actions";

    const importBtn = document.createElement("button");
    importBtn.className = "btn btn-primary";
    importBtn.type = "button";
    importBtn.textContent = "Ajouter aux missions";
    importBtn.addEventListener("click", () => {
      importSuggestionAsMission(item);
      renderOrga();
      updateProgressBar();
    });

    const rejectBtn = document.createElement("button");
    rejectBtn.className = "btn btn-secondary";
    rejectBtn.type = "button";
    rejectBtn.textContent = "Refuser";
    rejectBtn.addEventListener("click", () => {
      updateSuggestionStatus(item.id, "rejected");
      renderOrga();
    });

    actions.append(importBtn, rejectBtn);
    row.appendChild(actions);
    adminSuggestionsReviewList.appendChild(row);
  });
}

function countDoneByMission(results) {
  const map = {};
  results.forEach(result => {
    if (result.status !== "done") return;
    map[result.missionId] = (map[result.missionId] || 0) + 1;
  });
  return map;
}

function countMissionSequences(results) {
  const map = {};
  results.forEach(result => {
    if (result.status !== "done" || !result.previousMissionId) return;
    const key = `${result.previousMissionId}->${result.missionId}`;
    map[key] = (map[key] || 0) + 1;
  });
  return map;
}

function getAverageRatings(results) {
  const sums = {};
  const counts = {};
  results.forEach(result => {
    if (!result.rating) return;
    sums[result.missionId] = (sums[result.missionId] || 0) + result.rating;
    counts[result.missionId] = (counts[result.missionId] || 0) + 1;
  });
  const avg = {};
  Object.keys(sums).forEach(missionId => {
    avg[missionId] = sums[missionId] / counts[missionId];
  });
  return avg;
}

function sortMapDesc(map) {
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function renderOrga() {
  if (!hasValidAdminSession()) return;

  const results = getResults();
  const progress = getProgressState();
  const suggestionsCount = getSuggestions().filter(item => item.status === "proposed").length;
  const photos = results.filter(item => !!item.photoUrl);
  const sharedPhotos = photos.filter(item => item.visibility === "participants" && item.reviewStatus === "approved");
  const pendingPhotos = photos.filter(item => item.visibility === "participants" && item.reviewStatus === "pending");
  const messages = results.filter(item => (item.orgaMessage || "").trim());

  const shown = progress.shownMissionIds.length;
  const done = results.filter(item => item.status === "done").length;
  const skipped = progress.skippedMissionIds.length;
  const completionRate = shown ? Math.round((done / shown) * 100) : 0;

  if (orgaSummary) {
    orgaSummary.innerHTML = `
      <div><strong>Participation :</strong> ${done} validation(s) sur ${shown} mission(s) vues (${completionRate}%).</div>
      <div><strong>Photos :</strong> ${sharedPhotos.length} validée(s), ${pendingPhotos.length} en attente.</div>
      <div><strong>Messages orgas :</strong> ${messages.length}</div>
      <div><strong>Suggestions :</strong> ${suggestionsCount} en attente.</div>
    `;
  }

  if (orgaStats) {
    const stats = {
      vues: shown,
      validees: done,
      passees: skipped,
      photos: photos.length,
      partagees: sharedPhotos.length,
      en_attente: pendingPhotos.length,
      messages: messages.length,
      suggestions: suggestionsCount
    };
    orgaStats.innerHTML = "";
    Object.entries(stats).forEach(([label, value]) => {
      const block = document.createElement("div");
      block.className = "stat";
      block.innerHTML = `<div class="micro">${escapeHtml(label)}</div><strong>${value}</strong>`;
      orgaStats.appendChild(block);
    });
  }

  if (topMissions) {
    const items = sortMapDesc(countDoneByMission(results)).slice(0, 8);
    topMissions.innerHTML = items.length
      ? items.map(([missionId, count]) => `<div>${escapeHtml(getMissionById(Number(missionId))?.text || `Mission #${missionId}`)} — ${count}</div>`).join("")
      : "<div class=\"micro\">Pas encore de données.</div>";
  }

  if (topRated) {
    const items = sortMapDesc(getAverageRatings(results)).slice(0, 8);
    topRated.innerHTML = items.length
      ? items.map(([missionId, average]) => `<div>${escapeHtml(getMissionById(Number(missionId))?.text || `Mission #${missionId}`)} — ${Number(average).toFixed(1)}/5</div>`).join("")
      : "<div class=\"micro\">Aucune note pour l’instant.</div>";
  }

  if (topSequences) {
    const items = sortMapDesc(countMissionSequences(results)).slice(0, 8);
    topSequences.innerHTML = items.length
      ? items.map(([key, count]) => {
          const [fromId, toId] = key.split("->").map(Number);
          const from = getMissionById(fromId)?.text || `#${fromId}`;
          const to = getMissionById(toId)?.text || `#${toId}`;
          return `<div>${escapeHtml(`${from} → ${to}`)} — ${count}</div>`;
        }).join("")
      : "<div class=\"micro\">Pas encore d’enchaînements relevés.</div>";
  }

  if (orgaMessages) {
    const latest = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
    orgaMessages.innerHTML = latest.length
      ? latest.map(message => {
          const missionLabel = getMissionById(message.missionId)?.text || "Mission";
          return `<div><strong>${escapeHtml(missionLabel)}</strong><br><span class="micro">${formatDateTime(message.createdAt)}${message.displayName ? ` · ${escapeHtml(message.displayName)}` : ""}</span><br>${escapeHtml(message.orgaMessage)}</div>`;
        }).join("")
      : "<div class=\"micro\">Aucun message pour l’instant.</div>";
  }

  renderAdminMissionList();
  renderAdminExcludedMissionList();
  renderAdminPhotoReview();
  renderAdminSuggestionsReview();
}

function exportMissionsToCSV() {
  if (!ensureAdminSessionOrWarn()) return;
  if (!MISSIONS.length) {
    Toast.warning("Aucune mission à exporter.");
    return;
  }

  const headers = ["id", "texte", "categorie", "niveau", "theme", "note", "active"];
  const rows = MISSIONS.map(mission => ([
    mission.id,
    `"${String(mission.text).replace(/"/g, "\"\"")}"`,
    mission.category,
    mission.level,
    mission.theme,
    `"${String(mission.note || "").replace(/"/g, "\"\"")}"`,
    mission.active ? "1" : "0"
  ]));

  const csv = `${headers.join(",")}\r\n${rows.map(row => row.join(",")).join("\r\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "missions_declic.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  Toast.success("Export CSV téléchargé.");
}

function exportAppDataAsJson() {
  const payload = {
    app: "missions-declic",
    version: 2,
    exportedAt: nowIso(),
    data: {
      [STORAGE_KEYS.profile]: loadJSON(STORAGE_KEYS.profile, { displayName: "" }),
      [STORAGE_KEYS.results]: loadJSON(STORAGE_KEYS.results, []),
      [STORAGE_KEYS.suggestions]: loadJSON(STORAGE_KEYS.suggestions, []),
      [STORAGE_KEYS.progress]: loadJSON(STORAGE_KEYS.progress, getDefaultProgressState()),
      [STORAGE_KEYS.missions]: loadJSON(STORAGE_KEYS.missions, DEFAULT_MISSIONS),
      [STORAGE_KEYS.adminSettings]: loadJSON(STORAGE_KEYS.adminSettings, getDefaultAdminSettings()),
      [STORAGE_KEYS.adminPinHash]: localStorage.getItem(STORAGE_KEYS.adminPinHash) || "",
      [STORAGE_KEYS.adminPinSalt]: localStorage.getItem(STORAGE_KEYS.adminPinSalt) || "",
      [STORAGE_KEYS.adminRecoveryEmail]: localStorage.getItem(STORAGE_KEYS.adminRecoveryEmail) || DEFAULT_ADMIN_RECOVERY_EMAIL,
      [STORAGE_KEYS.selectedCategory]: localStorage.getItem(STORAGE_KEYS.selectedCategory) || "",
      [STORAGE_KEYS.selectedSubThemes]: loadJSON(STORAGE_KEYS.selectedSubThemes, {}),
      [STORAGE_KEYS_HISTORY]: loadJSON(STORAGE_KEYS_HISTORY, [])
    }
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `missions-declic-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  Toast.success("Export JSON téléchargé.");
}

function applyImportedData(payload) {
  if (!payload || typeof payload !== "object" || !payload.data || typeof payload.data !== "object") {
    throw new Error("Format JSON invalide.");
  }

  const data = payload.data;
  const allowedJsonKeys = [
    STORAGE_KEYS.profile,
    STORAGE_KEYS.results,
    STORAGE_KEYS.suggestions,
    STORAGE_KEYS.progress,
    STORAGE_KEYS.missions,
    STORAGE_KEYS.adminSettings,
    STORAGE_KEYS.selectedSubThemes,
    STORAGE_KEYS_HISTORY
  ];

  allowedJsonKeys.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      localStorage.setItem(key, JSON.stringify(data[key]));
    }
  });

  if (Object.prototype.hasOwnProperty.call(data, STORAGE_KEYS.adminRecoveryEmail)) {
    localStorage.setItem(STORAGE_KEYS.adminRecoveryEmail, String(data[STORAGE_KEYS.adminRecoveryEmail] || "").trim().toLowerCase());
  }
  if (Object.prototype.hasOwnProperty.call(data, STORAGE_KEYS.selectedCategory)) {
    localStorage.setItem(STORAGE_KEYS.selectedCategory, String(data[STORAGE_KEYS.selectedCategory] || ""));
  }
  if (Object.prototype.hasOwnProperty.call(data, STORAGE_KEYS.adminPinHash)) {
    localStorage.setItem(STORAGE_KEYS.adminPinHash, String(data[STORAGE_KEYS.adminPinHash] || ""));
  }
  if (Object.prototype.hasOwnProperty.call(data, STORAGE_KEYS.adminPinSalt)) {
    localStorage.setItem(STORAGE_KEYS.adminPinSalt, String(data[STORAGE_KEYS.adminPinSalt] || ""));
  }
}

async function handleImportDataFile(event) {
  const statusNode = byId("import-data-status");
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    if (!window.confirm("Importer ces données va remplacer les données actuelles. Continuer ?")) return;
    applyImportedData(payload);
    if (statusNode) statusNode.textContent = "Import réussi. Les écrans ont été rafraîchis.";
    loadMissions();
    hydrateProfile();
    STATE.selectedCategory = localStorage.getItem(STORAGE_KEYS.selectedCategory) || null;
    STATE.selectedSubThemes = loadJSON(STORAGE_KEYS.selectedSubThemes, {});
    renderThemePicker();
    renderSuggestions();
    renderJournal();
    renderPhotos();
    renderMissionHistory();
    renderOrga();
    updateProgressBar();
    Toast.success("Import JSON terminé.");
  } catch (error) {
    console.error(error);
    if (statusNode) statusNode.textContent = `Import impossible: ${error.message}`;
    Toast.error("Import JSON échoué.");
  } finally {
    event.target.value = "";
  }
}

function previewMissionReplacement() {
  if (!ensureAdminSessionOrWarn()) return;
  const searchText = String(byId("admin-replace-search")?.value || "");
  const replacementText = String(byId("admin-replace-value")?.value || "");
  const preview = byId("admin-replace-preview");
  if (!preview) return;

  if (!searchText.trim()) {
    preview.textContent = "Saisis un texte à corriger.";
    return;
  }

  const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const impacted = MISSIONS.filter(mission => regex.test(mission.text) || regex.test(mission.note || ""));
  preview.textContent = `${impacted.length} mission(s) seront modifiées : "${searchText}" → "${replacementText}".`;
}

function applyMissionReplacement() {
  if (!ensureAdminSessionOrWarn()) return;
  const searchText = String(byId("admin-replace-search")?.value || "");
  const replacementText = String(byId("admin-replace-value")?.value || "");
  if (!searchText.trim()) {
    Toast.warning("Saisis le texte à corriger.");
    return;
  }

  const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  let changedCount = 0;

  const updated = MISSIONS.map(mission => {
    const nextText = mission.text.replace(regex, replacementText);
    const nextNote = String(mission.note || "").replace(regex, replacementText);
    if (nextText !== mission.text || nextNote !== mission.note) {
      changedCount += 1;
      const previousMission = { ...mission };
      const next = { ...mission, text: nextText, note: nextNote };
      addMissionHistory("Modification", next, { previousMission });
      return next;
    }
    return mission;
  });

  if (!changedCount) {
    Toast.info("Aucune mission concernée.");
    return;
  }

  saveMissions(updated);
  renderOrga();
  Toast.success(`${changedCount} mission(s) corrigée(s).`);
}

function autoFixMissionAccents() {
  if (!ensureAdminSessionOrWarn()) return;
  let changedCount = 0;
  const updated = MISSIONS.map(mission => {
    let nextText = mission.text;
    let nextNote = mission.note || "";
    COMMON_ACCENT_FIXES.forEach(([from, to]) => {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      nextText = nextText.replace(regex, to);
      nextNote = nextNote.replace(regex, to);
    });
    if (nextText !== mission.text || nextNote !== mission.note) {
      changedCount += 1;
      const previousMission = { ...mission };
      const next = { ...mission, text: nextText, note: nextNote };
      addMissionHistory("Modification", next, { previousMission });
      return next;
    }
    return mission;
  });

  if (!changedCount) {
    Toast.info("Aucune correction automatique nécessaire.");
    return;
  }

  saveMissions(updated);
  renderOrga();
  Toast.success(`${changedCount} mission(s) mises à jour automatiquement.`);
}

function getFestivalShareUrl() {
  const base = `${location.origin}${location.pathname}`.replace(/index\.html$/i, "");
  return base.endsWith("/") ? `${base}missions-declic.html` : `${base}/missions-declic.html`;
}

async function copyFestivalLink() {
  const url = getFestivalShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    Toast.success("Lien copié.");
  } catch (error) {
    window.prompt("Copie ce lien :", url);
  }
}

async function openAdminAccess() {
  if (hasValidAdminSession()) {
    showScreen("orga");
    return;
  }
  openAdminLoginModal();
}

async function recoverAdminAccessFlow() {
  const enteredEmail = (window.prompt("E-mail de récupération admin :") || "").trim().toLowerCase();
  if (!enteredEmail) return;

  if (!ADMIN_SECURITY.ready) {
    try {
      await ensureAdminSecurityReady();
    } catch (error) {
      Toast.error("Sécurité admin indisponible. Recharge la page.");
      return;
    }
  }

  if (!hasRecoveryBackendConfigured()) {
    Toast.warning("Récupération e-mail non disponible: configure Supabase dans Réglages admin.");
    return;
  }

  const recoveryEmail = getAdminRecoveryEmail().trim().toLowerCase();
  if (enteredEmail !== recoveryEmail) {
    Toast.error("E-mail de récupération incorrect.");
    return;
  }

  try {
    await requestRecoveryOtp(enteredEmail);
    Toast.info("Code de récupération envoyé par e-mail.", 5000);
  } catch (error) {
    Toast.error(`Envoi impossible: ${error.message}`);
    return;
  }

  const otp = (window.prompt("Entre le code reçu par e-mail :") || "").trim();
  if (!otp) return;

  try {
    await verifyRecoveryOtp(enteredEmail, otp);
  } catch (error) {
    Toast.error(`Code invalide: ${error.message}`);
    return;
  }

  const newPin = (window.prompt("Nouveau code admin :", DEFAULT_ADMIN_PIN) || "").trim();
  if (!newPin) {
    Toast.warning("Code admin inchangé.");
    return;
  }

  try {
    await setAdminPinSecure(newPin);
    resetAuthFailures();
    setAdminSession(getAdminSettings().sessionMinutes);
    Toast.success("Code admin mis à jour via récupération e-mail.");
    showScreen("orga");
  } catch (error) {
    Toast.error(`Impossible d'enregistrer le nouveau code: ${error.message}`);
  }
}

async function submitAdminLoginFromModal() {
  const lockMs = getRemainingLockMs();
  if (lockMs > 0) {
    const minutes = Math.ceil(lockMs / 60000);
    setAdminLoginStatus(`Trop d’essais. Réessaie dans ${minutes} min.`);
    return;
  }

  const code = String(adminLoginInput?.value || "").trim();
  if (!code) {
    setAdminLoginStatus("Entre un code admin.");
    adminLoginInput?.focus();
    return;
  }

  if (!ADMIN_SECURITY.ready) {
    try {
      await ensureAdminSecurityReady();
    } catch (error) {
      setAdminLoginStatus("Sécurité admin indisponible. Recharge la page.");
      return;
    }
  }

  const valid = await verifyAdminPin(code);
  if (!valid) {
    registerAuthFailure();
    setAdminLoginStatus("Code admin incorrect.");
    return;
  }

  resetAuthFailures();
  setAdminSession(getAdminSettings().sessionMinutes);
  closeAdminLoginModal();
  Toast.success("Accès admin autorisé.");
  showScreen("orga");
}

async function testRecoveryDelivery() {
  if (!ensureAdminSessionOrWarn()) return;
  const statusNode = byId("admin-security-status");
  if (statusNode) statusNode.textContent = "";
  if (!hasRecoveryBackendConfigured()) {
    if (statusNode) statusNode.textContent = "Supabase non configuré.";
    Toast.warning("Supabase non configuré.");
    return;
  }

  const email = getAdminRecoveryEmail().trim().toLowerCase();
  if (!email) {
    Toast.warning("E-mail de récupération manquant.");
    return;
  }

  try {
    await requestRecoveryOtp(email);
    if (statusNode) statusNode.textContent = `Code envoyé à ${email}`;
    Toast.success("Code de test envoyé.");
  } catch (error) {
    if (statusNode) statusNode.textContent = `Échec: ${error.message}`;
    Toast.error(`Envoi impossible: ${error.message}`);
  }
}

function hydrateAdminSettingsForm() {
  const settings = getAdminSettings();
  const by = byId;
  if (by("admin-allow-community-share")) by("admin-allow-community-share").checked = !!settings.allowCommunityShare;
  if (by("admin-fun-mode")) by("admin-fun-mode").checked = !!settings.funMode;
  if (by("admin-theme-festival")) by("admin-theme-festival").checked = !!settings.enabledThemes.festival;
  if (by("admin-theme-communaute")) by("admin-theme-communaute").checked = !!settings.enabledThemes.communaute;
  if (by("admin-theme-pool")) by("admin-theme-pool").checked = !!settings.enabledThemes.pool;
  if (by("admin-theme-daily")) by("admin-theme-daily").checked = !!settings.enabledThemes.daily;
  if (by("admin-theme-health-sport")) by("admin-theme-health-sport").checked = !!settings.enabledThemes.health_sport;
  if (by("admin-theme-health-mental")) by("admin-theme-health-mental").checked = !!settings.enabledThemes.health_mental;
  if (by("admin-theme-health-wellness")) by("admin-theme-health-wellness").checked = !!settings.enabledThemes.health_wellness;
  if (by("admin-theme-health-breathing")) by("admin-theme-health-breathing").checked = !!settings.enabledThemes.health_breathing;
  if (by("admin-theme-health-yoga")) by("admin-theme-health-yoga").checked = !!settings.enabledThemes.health_yoga;
  if (by("admin-pin-input")) by("admin-pin-input").value = "";
  if (by("admin-recovery-email-input")) by("admin-recovery-email-input").value = getAdminRecoveryEmail();
  if (by("admin-session-minutes-input")) by("admin-session-minutes-input").value = String(settings.sessionMinutes);
  if (by("admin-supabase-url-input")) by("admin-supabase-url-input").value = settings.supabaseUrl || "";
  if (by("admin-supabase-key-input")) by("admin-supabase-key-input").value = settings.supabaseAnonKey || "";
  if (by("admin-security-status")) by("admin-security-status").textContent = "";
}

async function saveAdminSettingsFromForm() {
  await ensureAdminSecurityReady();
  if (!hasValidAdminSession()) {
    Toast.warning("Session admin expirée.");
    return;
  }

  const by = byId;
  const enabledThemes = {
    festival: !!by("admin-theme-festival")?.checked,
    communaute: !!by("admin-theme-communaute")?.checked,
    pool: !!by("admin-theme-pool")?.checked,
    daily: !!by("admin-theme-daily")?.checked,
    health_sport: !!by("admin-theme-health-sport")?.checked,
    health_mental: !!by("admin-theme-health-mental")?.checked,
    health_wellness: !!by("admin-theme-health-wellness")?.checked,
    health_breathing: !!by("admin-theme-health-breathing")?.checked,
    health_yoga: !!by("admin-theme-health-yoga")?.checked
  };

  if (!Object.values(enabledThemes).some(Boolean)) {
    Toast.warning("Active au moins un thème.");
    return;
  }

  const current = getAdminSettings();
  saveAdminSettings({
    allowCommunityShare: !!by("admin-allow-community-share")?.checked,
    funMode: !!by("admin-fun-mode")?.checked,
    excludedMissionIds: current.excludedMissionIds,
    sessionMinutes: Math.max(5, Math.min(240, toNumber(by("admin-session-minutes-input")?.value, DEFAULT_ADMIN_SESSION_MINUTES))),
    supabaseUrl: String(by("admin-supabase-url-input")?.value || "").trim(),
    supabaseAnonKey: String(by("admin-supabase-key-input")?.value || "").trim(),
    enabledThemes
  });

  const newPin = String(by("admin-pin-input")?.value || "").trim();
  if (newPin) {
    try {
      await setAdminPinSecure(newPin);
      Toast.success("Code admin mis à jour (hash sécurisé).");
    } catch (error) {
      Toast.error(`Impossible de mettre à jour le code: ${error.message}`);
      return;
    }
  }

  const recoveryEmail = String(by("admin-recovery-email-input")?.value || "").trim().toLowerCase();
  if (recoveryEmail) {
    setAdminRecoveryEmail(recoveryEmail);
  }

  updateProgressBar();
  renderThemePicker();
  renderOrga();
  Toast.success("Réglages admin enregistrés.");
}

function setActiveAdminTab(tabName) {
  document.querySelectorAll(".admin-tab-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  document.querySelectorAll(".admin-tab-content").forEach(panel => {
    panel.classList.toggle("active", panel.id === `tab-${tabName}`);
  });
  if (tabName === "history") renderMissionHistory();
}

function initAdminTabs() {
  document.querySelectorAll(".admin-tab-btn").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      if (!hasValidAdminSession()) {
        Toast.warning("Session admin expirée.");
        return;
      }
      setActiveAdminTab(button.dataset.tab);
    });
  });

  const resetBtn = byId("admin-reset-tab-order-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      setActiveAdminTab("settings");
      Toast.info("Ordre des onglets réinitialisé.");
    });
  }
}

function initNavigation() {
  document.querySelectorAll("[data-go]").forEach(node => {
    node.addEventListener("click", () => showScreen(node.dataset.go));
  });
}

function isMobileLike() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function updateInstallUx(showPrompt) {
  const shouldShow = isMobileLike() || showPrompt;
  if (installCallout) installCallout.hidden = !shouldShow;
  if (installBtnTop) installBtnTop.style.display = showPrompt ? "" : "none";

  if (installHelp) {
    if (showPrompt) {
      installHelp.hidden = true;
      installHelp.textContent = "";
    } else if (isMobileLike()) {
      installHelp.hidden = false;
      installHelp.textContent = "Si le bouton n’apparaît pas, utilise le menu du navigateur puis “Ajouter à l’écran d’accueil”.";
    } else {
      installHelp.hidden = false;
      installHelp.textContent = "Sur ordinateur, l’installation dépend du navigateur (Chrome/Edge principalement).";
    }
  }
}

async function launchInstallPrompt() {
  if (!deferredInstallPrompt) {
    updateInstallUx(false);
    Toast.info("Utilise le menu du navigateur puis “Ajouter à l’écran d’accueil”.", 4500);
    return;
  }
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  if (choice?.outcome === "accepted") {
    if (installBtnTop) installBtnTop.style.display = "none";
    if (installCallout) installCallout.hidden = true;
  }
  deferredInstallPrompt = null;
}

function initPwaInstall() {
  updateInstallUx(false);
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallUx(true);
  });

  installBtnTop?.addEventListener("click", launchInstallPrompt);
  installBtnHome?.addEventListener("click", launchInstallPrompt);

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    if (installBtnTop) installBtnTop.style.display = "none";
    if (installCallout) installCallout.hidden = true;
    Toast.success("Application installée.");
  });
}

function showUpdateBanner() {
  if (updateBanner) updateBanner.hidden = false;
}

function hideUpdateBanner() {
  if (updateBanner) updateBanner.hidden = true;
}

function bindUpdateBannerAction() {
  byId("update-app-btn")?.addEventListener("click", () => {
    if (!swRegistration?.waiting) return;
    swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
  });
}

function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      const isLocalhost = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
      if (location.protocol === "file:") return;
      if (!window.isSecureContext && !isLocalhost) return;

      swRegistration = await navigator.serviceWorker.register("./sw.js");

      if (swRegistration.waiting) {
        showUpdateBanner();
      }

      swRegistration.addEventListener("updatefound", () => {
        const newWorker = swRegistration.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateBanner();
          }
        });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        hideUpdateBanner();
        window.location.reload();
      });
    } catch (error) {
      console.warn("Service Worker indisponible:", error);
    }
  });
}

function bindEvents() {
  initNavigation();
  initAdminTabs();
  initPwaInstall();
  initServiceWorker();
  bindUpdateBannerAction();

  displayNameInput?.addEventListener("input", syncProfileFromInput);
  byId("start-btn")?.addEventListener("click", launchMissionDraw);
  byId("journal-btn")?.addEventListener("click", () => showScreen("journal"));
  byId("validate-mission-btn")?.addEventListener("click", openValidation);
  byId("another-mission-btn")?.addEventListener("click", goToAnotherMission);
  byId("confirm-validation-btn")?.addEventListener("click", confirmValidation);
  byId("cancel-validation-btn")?.addEventListener("click", () => showScreen("mission"));
  byId("submit-suggestion-btn")?.addEventListener("click", submitSuggestion);
  byId("admin-access-btn")?.addEventListener("click", () => {
    openAdminAccess().catch(error => {
      console.error("Admin access error:", error);
      Toast.error("Impossible d’ouvrir l’espace admin.");
    });
  });
  byId("admin-login-submit-btn")?.addEventListener("click", () => {
    submitAdminLoginFromModal().catch(error => {
      console.error("Admin login error:", error);
      setAdminLoginStatus("Erreur inattendue. Réessaie.");
    });
  });
  byId("admin-login-cancel-btn")?.addEventListener("click", closeAdminLoginModal);
  byId("admin-login-forgot-btn")?.addEventListener("click", () => {
    recoverAdminAccessFlow().catch(error => {
      console.error("Recovery error:", error);
      setAdminLoginStatus("Récupération impossible.");
    });
  });
  adminLoginInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitAdminLoginFromModal().catch(error => {
        console.error("Admin login enter error:", error);
        setAdminLoginStatus("Erreur inattendue. Réessaie.");
      });
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeAdminLoginModal();
    }
  });
  adminLoginModal?.addEventListener("click", event => {
    if (event.target === adminLoginModal) closeAdminLoginModal();
  });
  byId("share-link-btn")?.addEventListener("click", copyFestivalLink);
  byId("clear-theme-btn")?.addEventListener("click", () => {
    STATE.selectedCategory = null;
    STATE.selectedSubThemes = {};
    localStorage.removeItem(STORAGE_KEYS.selectedCategory);
    localStorage.removeItem(STORAGE_KEYS.selectedSubThemes);
    renderThemePicker();
  });
  byId("flag-mission-edit-btn")?.addEventListener("click", flagCurrentMissionForEdit);
  byId("admin-save-settings-btn")?.addEventListener("click", () => { saveAdminSettingsFromForm(); });
  byId("admin-export-csv-btn")?.addEventListener("click", exportMissionsToCSV);
  byId("admin-undo-history-btn")?.addEventListener("click", undoLastMissionHistory);
  byId("admin-recovery-test-btn")?.addEventListener("click", () => { testRecoveryDelivery(); });
  byId("export-data-btn")?.addEventListener("click", exportAppDataAsJson);
  byId("import-data-input")?.addEventListener("change", handleImportDataFile);
  byId("admin-preview-replace-btn")?.addEventListener("click", previewMissionReplacement);
  byId("admin-apply-replace-btn")?.addEventListener("click", applyMissionReplacement);
  byId("admin-auto-fix-accents-btn")?.addEventListener("click", autoFixMissionAccents);
  adminMissionSearch?.addEventListener("input", renderAdminMissionList);
  photoInput?.addEventListener("change", handlePhotoChange);
  window.addEventListener("offline", () => Toast.warning("Hors ligne — l’app continue de fonctionner.", 4500));
  window.addEventListener("online", () => Toast.success("Connexion rétablie.", 2500));
}

async function init() {
  await ensureAdminSecurityReady();
  getOrCreateSessionId();
  loadMissions();
  hydrateProfile();
  hydrateAdminSettingsForm();
  STATE.selectedCategory = localStorage.getItem(STORAGE_KEYS.selectedCategory) || null;
  STATE.selectedSubThemes = loadJSON(STORAGE_KEYS.selectedSubThemes, {});
  renderThemePicker();
  renderJournal();
  renderSuggestions();
  renderPhotos();
  renderMissionHistory();
  updateProgressBar();
  showNextHomeTagline(true);
  setActiveAdminTab("settings");

  if (location.hash === "#photos") showScreen("photos");
  if (location.hash === "#orga") {
    if (hasValidAdminSession()) showScreen("orga");
    else Toast.info("Ouvre d’abord l’espace admin avec ton code.");
  }
}

bindEvents();
init().catch(error => {
  console.error("Init error:", error);
  Toast.error("Erreur d’initialisation de l’application.");
});
