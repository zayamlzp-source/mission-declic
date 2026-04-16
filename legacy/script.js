    // ===== Stockage =====
    const STORAGE_KEYS = {
      profile: "festival_user_profile",
      results: "festival_results",
      suggestions: "festival_mission_suggestions",
      progress: "festival_progress_state",
      sessionId: "festival_session_id"
    };

    // ===== Métadonnées internes =====
    const CATEGORIES = ["OSE", "ENTRAÎNE", "RESSENS", "LIEN", "JOUE", "BONUS"];
    const THEMES = ["festival"];
    const PLACES = ["general", "pool", "expression_wall"];

    function createMission({
      id,
      text,
      category,
      level,
      theme = "festival",
      peopleMin = 1,
      place = ["general"],
      photoOk = true,
      active = true,
      bonus = false,
      tags = [],
      note = ""
    }) {
      return {
        id,
        text,
        category,
        level,
        theme,
        peopleMin,
        place,
        photoOk,
        active,
        bonus,
        tags,
        note
      };
    }

    const MISSIONS = [
      createMission({ id: 1, text: "Va parler à quelqu'un que tu n'aurais pas abordé… et reste un vrai moment avec lui", category: "OSE", level: 3, tags: ["rencontre"] }),
      createMission({ id: 2, text: "Regarde quelqu'un dans les yeux et souris", category: "OSE", level: 1, tags: ["simple", "regard"] }),
      createMission({ id: 3, text: "Dis à quelqu'un : \"j'avais envie de te parler\"… et vois où ça t'emmène", category: "OSE", level: 2, tags: ["rencontre"] }),
      createMission({ id: 4, text: "Va vers la personne qui t'impressionne… et dis-lui pourquoi (ex : très à l'aise / très stylée)", category: "OSE", level: 3, tags: ["audace"] }),
      createMission({ id: 5, text: "Invite un inconnu à danser (même 20 secondes)", category: "OSE", level: 3, tags: ["danse", "rencontre"] }),
      createMission({ id: 6, text: "Motive une personne à sauter dans la piscine avec toi", category: "OSE", level: 8, place: ["pool"], tags: ["piscine"], note: "piscine" }),
      createMission({ id: 7, text: "Fais une danse ridicule assumée… et tiens-la jusqu'au bout avec le sourire", category: "OSE", level: 3, tags: ["danse", "fun"] }),
      createMission({ id: 8, text: "Va voir quelqu'un seul et prends le temps avec lui", category: "OSE", level: 2, tags: ["rencontre", "présence"] }),
      createMission({ id: 9, text: "Fais un vrai compliment à un inconnu (ex : énergie, style, regard)", category: "OSE", level: 2, tags: ["compliment", "rencontre"] }),

      createMission({ id: 10, text: "Entraîne 5 personnes dans une chenille (et agrandis-la)", category: "ENTRAÎNE", level: 5, peopleMin: 5, tags: ["collectif", "fun"] }),
      createMission({ id: 11, text: "Lance un chifoumi, même de loin, à au moins 3 personnes dans les 10 minutes qui suivent", category: "ENTRAÎNE", level: 4, peopleMin: 3, tags: ["jeu", "collectif"], note: "niveau à confirmer" }),
      createMission({ id: 12, text: "Lance un cri collectif (tu lances, ils répondent)", category: "ENTRAÎNE", level: 5, peopleMin: 2, tags: ["collectif", "énergie"] }),
      createMission({ id: 13, text: "Invite quelqu'un dans un défi danse (ex : 10 secondes chacun)", category: "ENTRAÎNE", level: 3, peopleMin: 2, tags: ["danse", "défi"] }),
      createMission({ id: 14, text: "Rassemble 2 inconnus dans une action (danse, pose, jeu…)", category: "ENTRAÎNE", level: 5, peopleMin: 3, tags: ["collectif", "lien"] }),
      createMission({ id: 15, text: "Lance un défilé (marche + attitude)", category: "ENTRAÎNE", level: 5, peopleMin: 2, tags: ["jeu", "collectif"] }),
      createMission({ id: 16, text: "Entraîne un groupe dans un mouvement simple (ex : limbo, clap, saut)", category: "ENTRAÎNE", level: 5, peopleMin: 3, tags: ["collectif", "corps"] }),
      createMission({ id: 17, text: "Embarque quelqu'un dans un jeu (ex : imitation, regard, mini défi, chifoumi…)", category: "ENTRAÎNE", level: 2, peopleMin: 2, tags: ["jeu", "duo"] }),
      createMission({ id: 18, text: "Fais une visite guidée du lieu avec 2 personnes (à ta manière)", category: "ENTRAÎNE", level: 5, peopleMin: 3, tags: ["collectif", "impro"] }),
      createMission({ id: 19, text: "Lance un saut collectif dans la piscine", category: "ENTRAÎNE", level: 8, peopleMin: 2, place: ["pool"], tags: ["piscine", "collectif"], note: "piscine" }),

      createMission({ id: 20, text: "Trouve quelqu'un seul et reste avec lui (écoute vraiment)", category: "RESSENS", level: 7, tags: ["écoute", "présence"] }),
      createMission({ id: 21, text: "Demande à quelqu'un ce qu'il aime vraiment (ex : passion, moment préféré)", category: "RESSENS", level: 7, tags: ["écoute", "vrai"] }),
      createMission({ id: 22, text: "Fais un compliment sincère (pas générique)", category: "RESSENS", level: 1, tags: ["compliment"] }),
      createMission({ id: 23, text: "Complimente un bénévole (remercie-le vraiment)", category: "RESSENS", level: 7, tags: ["gratitude", "bénévole"] }),
      createMission({ id: 24, text: "Parle de quelque chose de vrai (ex : pourquoi tu es là)", category: "RESSENS", level: 7, tags: ["vrai", "partage"] }),
      createMission({ id: 25, text: "Fais sourire quelqu'un (ex : regard, geste, mot simple)", category: "RESSENS", level: 1, tags: ["simple", "sourire"] }),
      createMission({ id: 26, text: "Ramène un verre d'eau à quelqu'un qui en a besoin", category: "RESSENS", level: 1, tags: ["attention", "aide"] }),
      createMission({ id: 27, text: "Partage un moment calme avec quelqu'un (à l'écart ou posé)", category: "RESSENS", level: 7, tags: ["calme", "présence"] }),
      createMission({ id: 28, text: "Partage quelque chose à manger avec quelqu'un", category: "RESSENS", level: 7, tags: ["partage"] }),
      createMission({ id: 29, text: "Fais un cadeau à quelqu'un (même symbolique)", category: "RESSENS", level: 7, tags: ["cadeau", "attention"] }),

      createMission({ id: 30, text: "Crée un duo (ex : mini danse, pose, délire commun)", category: "LIEN", level: 4, peopleMin: 2, tags: ["duo", "lien"] }),
      createMission({ id: 31, text: "Crée un trio (ex : nom + pose d'équipe)", category: "LIEN", level: 4, peopleMin: 3, tags: ["trio", "lien"] }),
      createMission({ id: 32, text: "Présente deux personnes (comme dans une émission)", category: "LIEN", level: 4, peopleMin: 3, tags: ["rencontre", "lien"] }),
      createMission({ id: 33, text: "Fais rencontrer deux inconnus (et lance un échange)", category: "LIEN", level: 4, peopleMin: 3, tags: ["rencontre", "lien"] }),
      createMission({ id: 34, text: "Crée une rencontre entre 2 inconnus et reste un moment avec eux", category: "LIEN", level: 4, peopleMin: 3, tags: ["rencontre", "présence"] }),
      createMission({ id: 35, text: "Apprends quelque chose à quelqu'un (ex : mouvement, jeu)", category: "LIEN", level: 4, peopleMin: 2, tags: ["transmission", "lien"] }),
      createMission({ id: 36, text: "Trouve 3 points communs avec quelqu'un (rapide)", category: "LIEN", level: 2, peopleMin: 2, tags: ["duo", "échange"] }),
      createMission({ id: 37, text: "Crée une poignée de main (simple et unique)", category: "LIEN", level: 4, peopleMin: 2, tags: ["duo", "jeu"] }),
      createMission({ id: 38, text: "Fais quelque chose ensemble (ex : danser, jouer, poser)", category: "LIEN", level: 4, peopleMin: 2, tags: ["action", "lien"] }),

      createMission({ id: 39, text: "Bouge au ralenti (et entraîne 1–2 personnes)", category: "JOUE", level: 1, tags: ["jeu", "corps"] }),
      createMission({ id: 40, text: "Fige-toi comme une statue (et vois si d'autres suivent)", category: "JOUE", level: 1, tags: ["jeu", "corps"] }),
      createMission({ id: 41, text: "Cache-toi en pleine piste (quelques secondes)", category: "JOUE", level: 6, tags: ["absurde", "fun"] }),
      createMission({ id: 42, text: "Invente une autre vie (ex : métier improbable)", category: "JOUE", level: 6, tags: ["impro", "absurde"] }),
      createMission({ id: 43, text: "Fais chanter quelqu'un (objet = micro)", category: "JOUE", level: 6, tags: ["jeu", "impro"] }),
      createMission({ id: 44, text: "Crée une scène avec quelqu'un (ex : dispute, rencontre)", category: "JOUE", level: 6, peopleMin: 2, tags: ["impro", "duo"] }),
      createMission({ id: 45, text: "Fais quelque chose d'absurde à plusieurs (ex : marcher bizarrement)", category: "JOUE", level: 6, peopleMin: 2, tags: ["absurde", "collectif"] }),
      createMission({ id: 46, text: "Transforme une situation en jeu (ex : danse → défi)", category: "JOUE", level: 6, tags: ["jeu", "impro"] }),
      createMission({ id: 47, text: "Crée un cercle et lance un battle de danse", category: "JOUE", level: 6, peopleMin: 3, tags: ["danse", "collectif"] }),
      createMission({ id: 48, text: "Trouve une personne qui connaît le jeu du ninja et demande-lui une démo", category: "JOUE", level: 6, peopleMin: 2, tags: ["jeu", "rencontre"] }),
      createMission({ id: 49, text: "Fais une photo originale avec plusieurs personnes", category: "JOUE", level: 6, peopleMin: 2, tags: ["photo", "collectif"] }),
      createMission({ id: 50, text: "Va au mur d'expression et ajoute quelque chose en collaboration (dessin, mot…)", category: "JOUE", level: 1, place: ["expression_wall"], tags: ["mur", "expression"] }),
      createMission({ id: 51, text: "Invite quelqu'un à participer au mur d'expression", category: "JOUE", level: 1, place: ["expression_wall"], tags: ["mur", "invitation"] }),
      createMission({ id: 52, text: "Crée une course : objectif traverser le plus vite possible la piscine", category: "JOUE", level: 8, peopleMin: 2, place: ["pool"], tags: ["piscine", "défi"], note: "piscine" }),
      createMission({ id: 53, text: "Fais une action synchronisée dans l'eau", category: "JOUE", level: 8, peopleMin: 2, place: ["pool"], tags: ["piscine", "collectif"], note: "piscine" }),

      createMission({ id: 54, text: "Trouve Double Face… il a quelque chose à te proposer !", category: "BONUS", level: 0, bonus: true, tags: ["bonus"], note: "bonus" })
    ];

    // ===== Helpers stockage =====
    function loadJSON(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    }

    function saveJSON(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    }

    function nowIso() {
      return new Date().toISOString();
    }

    function formatDateTime(iso) {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("fr-CH", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(d);
    }

    function uid() {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
      return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }

    // ===== Profil =====
    function getUserProfile() {
      return loadJSON(STORAGE_KEYS.profile, { displayName: "" });
    }

    function saveUserProfile(profile) {
      return saveJSON(STORAGE_KEYS.profile, profile);
    }

    function getOrCreateSessionId() {
      let sessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
      if (!sessionId) {
        sessionId = uid();
        localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
      }
      return sessionId;
    }

    // ===== Progression invisible =====
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

    function saveProgressState(state) {
      return saveJSON(STORAGE_KEYS.progress, state);
    }

    function computeInternalLevel(doneCount) {
      const level = 1 + Math.floor(doneCount / 2);
      return Math.min(level, 8);
    }

    function getMissionById(missionId) {
      return MISSIONS.find(m => m.id === missionId) || null;
    }

    function shuffleArray(array) {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function getRecentMissionIds(state, limit = 6) {
      return state.shownMissionIds.slice(-limit);
    }

    function getMissionPoolForProgression(state) {
      const level = state.internalLevel;
      const allowedLevels = [level, level - 1, level + 1].filter(n => n >= 1 && n <= 8);

      return MISSIONS.filter(m => {
        if (!m.active) return false;
        if (m.bonus) return false;
        if (!allowedLevels.includes(m.level)) return false;
        if (m.id === state.currentMissionId) return false;
        return true;
      });
    }

    function pickNextMission() {
      const state = getProgressState();
      state.internalLevel = computeInternalLevel(state.doneMissionIds.length);

      const pool = getMissionPoolForProgression(state);
      const recentIds = getRecentMissionIds(state, 6);

      let candidates = pool.filter(m => !recentIds.includes(m.id) && m.id !== state.lastMissionId);
      if (!candidates.length) candidates = pool.filter(m => m.id !== state.lastMissionId);
      if (!candidates.length) candidates = pool;
      if (!candidates.length) return null;

      const mission = shuffleArray(candidates)[0];
      state.currentMissionId = mission.id;
      state.lastMissionId = mission.id;
      state.shownMissionIds.push(mission.id);
      saveProgressState(state);

      return mission;
    }

    function skipCurrentMission() {
      const state = getProgressState();
      if (state.currentMissionId) state.skippedMissionIds.push(state.currentMissionId);
      state.currentMissionId = null;
      saveProgressState(state);
    }

    function getAnotherMission() {
      skipCurrentMission();
      return pickNextMission();
    }

    function completeCurrentMission() {
      const state = getProgressState();
      if (!state.currentMissionId) return state;
      if (!state.doneMissionIds.includes(state.currentMissionId)) {
        state.doneMissionIds.push(state.currentMissionId);
      }
      state.currentMissionId = null;
      state.internalLevel = computeInternalLevel(state.doneMissionIds.length);
      saveProgressState(state);
      return state;
    }

    function replayMission(missionId) {
      const state = getProgressState();
      const mission = getMissionById(missionId);
      if (!mission) return null;
      state.currentMissionId = mission.id;
      state.lastMissionId = mission.id;
      saveProgressState(state);
      return mission;
    }

    // ===== Résultats =====
    function getResults() {
      return loadJSON(STORAGE_KEYS.results, []);
    }

    function saveResults(results) {
      return saveJSON(STORAGE_KEYS.results, results);
    }

    function createMissionResult({
      sessionId,
      missionId,
      previousMissionId = null,
      status = "done",
      photoUrl = "",
      visibility = "private",
      orgaMessage = "",
      rating = null,
      displayName = "",
      createdAt = nowIso()
    }) {
      return {
        id: uid(),
        sessionId,
        missionId,
        previousMissionId,
        status,
        photoUrl,
        visibility,
        orgaMessage,
        rating,
        displayName,
        createdAt
      };
    }

    function saveResult(result) {
      const results = getResults();
      results.push(result);
      saveResults(results);
      return result;
    }

    function updateResultRating(resultId, rating) {
      const results = getResults();
      const item = results.find(r => r.id === resultId);
      if (!item) return null;
      item.rating = rating;
      saveResults(results);
      return item;
    }

    // ===== Suggestions =====
    function getSuggestions() {
      return loadJSON(STORAGE_KEYS.suggestions, []);
    }

    function saveSuggestions(items) {
      return saveJSON(STORAGE_KEYS.suggestions, items);
    }

    function createMissionSuggestion({ text, category = "", level = null, displayName = "" }) {
      return {
        id: uid(),
        text,
        category,
        level,
        displayName,
        status: "proposed",
        createdAt: nowIso()
      };
    }

    function saveSuggestion(item) {
      const suggestions = getSuggestions();
      suggestions.push(item);
      saveSuggestions(suggestions);
      return item;
    }

    // ===== Stats =====
    function countShown(results) {
      const progress = getProgressState();
      return progress.shownMissionIds.length;
    }

    function countDone(results) {
      return results.filter(r => r.status === "done").length;
    }

    function countSkipped() {
      return getProgressState().skippedMissionIds.length;
    }

    function countPhotos(results) {
      return results.filter(r => !!r.photoUrl).length;
    }

    function countSharedPhotos(results) {
      return results.filter(r => !!r.photoUrl && r.visibility === "participants").length;
    }

    function countOrgaMessages(results) {
      return results.filter(r => (r.orgaMessage || "").trim()).length;
    }

    function countDoneByMission(results) {
      const map = {};
      for (const result of results) {
        if (result.status !== "done") continue;
        map[result.missionId] = (map[result.missionId] || 0) + 1;
      }
      return map;
    }

    function countMissionSequences(results) {
      const map = {};
      for (const result of results) {
        if (!result.previousMissionId || result.status !== "done") continue;
        const key = `${result.previousMissionId}->${result.missionId}`;
        map[key] = (map[key] || 0) + 1;
      }
      return map;
    }

    function getAverageRatings(results) {
      const sums = {};
      const counts = {};
      for (const r of results) {
        if (!r.rating) continue;
        sums[r.missionId] = (sums[r.missionId] || 0) + r.rating;
        counts[r.missionId] = (counts[r.missionId] || 0) + 1;
      }
      const avg = {};
      for (const missionId in sums) {
        avg[missionId] = sums[missionId] / counts[missionId];
      }
      return avg;
    }

    // ===== Simu upload locale =====
    // Remplacer plus tard par un vrai upload Supabase Storage.
    function fileToLocalDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // ===== État UI =====
    const STATE = {
      currentMission: null,
      currentPhotoDataUrl: ""
    };

    // ===== DOM =====
    const screens = {
      home: document.getElementById("screen-home"),
      mission: document.getElementById("screen-mission"),
      validation: document.getElementById("screen-validation"),
      journal: document.getElementById("screen-journal"),
      photos: document.getElementById("screen-photos"),
      suggest: document.getElementById("screen-suggest"),
      orga: document.getElementById("screen-orga")
    };

    const displayNameInput = document.getElementById("display-name-input");
    const missionText = document.getElementById("mission-text");
    const photoInput = document.getElementById("photo-input");
    const photoPreviewWrap = document.getElementById("photo-preview-wrap");
    const photoPreview = document.getElementById("photo-preview");
    const visibilityWrap = document.getElementById("visibility-wrap");
    const orgaMessageInput = document.getElementById("orga-message-input");
    const journalList = document.getElementById("journal-list");
    const photosGrid = document.getElementById("photos-grid");
    const suggestionsList = document.getElementById("suggestions-list");
    const orgaStats = document.getElementById("orga-stats");
    const topMissions = document.getElementById("top-missions");
    const topSequences = document.getElementById("top-sequences");
    const orgaMessages = document.getElementById("orga-messages");
    const topRated = document.getElementById("top-rated");

    // ===== Navigation =====
    function showScreen(name) {
      Object.values(screens).forEach(screen => screen.classList.remove("active"));
      screens[name].classList.add("active");

      if (name === "journal") renderJournal();
      if (name === "photos") renderPhotos();
      if (name === "suggest") renderSuggestions();
      if (name === "orga") renderOrga();
    }

    document.querySelectorAll("[data-go]").forEach(btn => {
      btn.addEventListener("click", () => showScreen(btn.dataset.go));
    });

    // ===== Profil =====
    function syncProfileFromInput() {
      const profile = getUserProfile();
      profile.displayName = displayNameInput.value.trim();
      saveUserProfile(profile);
    }

    displayNameInput.addEventListener("input", syncProfileFromInput);

    function hydrateProfile() {
      const profile = getUserProfile();
      displayNameInput.value = profile.displayName || "";
    }

    // ===== Mission =====
    function renderMission(mission) {
      STATE.currentMission = mission;
      missionText.textContent = mission ? mission.text : "Aucune mission disponible pour le moment.";
      showScreen("mission");
    }

    function startGame() {
      syncProfileFromInput();
      const mission = pickNextMission();
      if (!mission) {
        alert("Aucune mission disponible.");
        return;
      }
      renderMission(mission);
    }

    function goToAnotherMission() {
      const mission = getAnotherMission();
      if (!mission) {
        alert("Aucune autre mission disponible.");
        return;
      }
      renderMission(mission);
    }

    // ===== Validation =====
    function resetValidationForm() {
      photoInput.value = "";
      orgaMessageInput.value = "";
      STATE.currentPhotoDataUrl = "";
      photoPreview.src = "";
      photoPreviewWrap.style.display = "none";
      visibilityWrap.style.display = "none";
      const radios = document.querySelectorAll('input[name="photo-visibility"]');
      radios.forEach(r => {
        r.checked = r.value === "private";
      });
    }

    function openValidation() {
      if (!STATE.currentMission) return;
      resetValidationForm();
      showScreen("validation");
    }

    async function handlePhotoChange(event) {
      const file = event.target.files?.[0];
      if (!file) {
        STATE.currentPhotoDataUrl = "";
        photoPreviewWrap.style.display = "none";
        visibilityWrap.style.display = "none";
        return;
      }

      const dataUrl = await fileToLocalDataUrl(file);
      STATE.currentPhotoDataUrl = dataUrl;
      photoPreview.src = dataUrl;
      photoPreviewWrap.style.display = "grid";
      visibilityWrap.style.display = "grid";
    }

    async function confirmValidation() {
      if (!STATE.currentMission) return;

      const sessionId = getOrCreateSessionId();
      const profile = getUserProfile();
      const progress = getProgressState();
      const previousMissionId = progress.doneMissionIds.length
        ? progress.doneMissionIds[progress.doneMissionIds.length - 1]
        : null;

      const visibilityRadio = document.querySelector('input[name="photo-visibility"]:checked');
      const visibility = STATE.currentPhotoDataUrl ? (visibilityRadio?.value || "private") : "private";

      saveResult(
        createMissionResult({
          sessionId,
          missionId: STATE.currentMission.id,
          previousMissionId,
          status: "done",
          photoUrl: STATE.currentPhotoDataUrl || "",
          visibility,
          orgaMessage: orgaMessageInput.value.trim(),
          displayName: profile.displayName || ""
        })
      );

      completeCurrentMission();
      resetValidationForm();
      renderJournal();
      showScreen("journal");
    }

    // ===== Journal =====
    function getOwnResults() {
      const sessionId = getOrCreateSessionId();
      return getResults()
        .filter(r => r.sessionId === sessionId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    function renderStars(result) {
      const wrap = document.createElement("div");
      wrap.className = "stars";

      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.className = "star-btn" + (result.rating === i ? " active" : "");
        btn.textContent = `${i}`;
        btn.type = "button";
        btn.addEventListener("click", () => {
          updateResultRating(result.id, i);
          renderJournal();
          renderOrga();
        });
        wrap.appendChild(btn);
      }

      return wrap;
    }

    function renderJournal() {
      const results = getOwnResults();
      journalList.innerHTML = "";

      if (!results.length) {
        journalList.innerHTML = '<div class="empty">Aucune mission pour l\'instant.</div>';
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

        const title = document.createElement("div");
        title.className = "journal-title";
        title.textContent = mission.text;

        const meta = document.createElement("div");
        meta.className = "micro";
        meta.textContent = formatDateTime(result.createdAt);

        const ratingLabel = document.createElement("div");
        ratingLabel.className = "micro";
        ratingLabel.textContent = "Ta note (1 à 5)";

        const row = document.createElement("div");
        row.className = "row";

        const replayBtn = document.createElement("button");
        replayBtn.className = "btn btn-secondary";
        replayBtn.textContent = "Refaire cette mission";
        replayBtn.addEventListener("click", () => {
          const missionToReplay = replayMission(result.missionId);
          if (missionToReplay) renderMission(missionToReplay);
        });

        row.appendChild(replayBtn);

        main.appendChild(title);
        main.appendChild(meta);
        main.appendChild(ratingLabel);
        main.appendChild(renderStars(result));
        main.appendChild(row);

        top.appendChild(main);
        item.appendChild(top);
        journalList.appendChild(item);
      });
    }

    // ===== Photos =====
    function getSharedPhotos() {
      return getResults()
        .filter(r => !!r.photoUrl && r.visibility === "participants")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    function renderPhotos() {
      const items = getSharedPhotos();
      photosGrid.innerHTML = "";

      if (!items.length) {
        photosGrid.innerHTML = '<div class="empty">Aucune photo partagée pour le moment.</div>';
        return;
      }

      items.forEach(result => {
        const mission = getMissionById(result.missionId);
        const card = document.createElement("div");
        card.className = "photo-card";

        const img = document.createElement("img");
        img.src = result.photoUrl;
        img.alt = "Photo partagée";

        const title = document.createElement("div");
        title.className = "photo-title";
        title.textContent = mission ? mission.text : "Mission";

        const meta = document.createElement("div");
        meta.className = "micro";
        meta.textContent = result.displayName
          ? `${formatDateTime(result.createdAt)} — ${result.displayName}`
          : formatDateTime(result.createdAt);

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(meta);
        photosGrid.appendChild(card);
      });
    }

    // ===== Suggestions =====
    function renderSuggestions() {
      const items = getSuggestions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      suggestionsList.innerHTML = "";

      if (!items.length) {
        suggestionsList.innerHTML = '<div class="empty">Aucune proposition pour l\'instant.</div>';
        return;
      }

      items.forEach(item => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.innerHTML = `
          <div><strong>${escapeHtml(item.text)}</strong></div>
          <div class="micro">${item.category || "Sans catégorie"}${item.level ? ` · niveau ${item.level}` : ""}</div>
          <div class="micro">${formatDateTime(item.createdAt)}${item.displayName ? ` · ${escapeHtml(item.displayName)}` : ""}</div>
        `;
        suggestionsList.appendChild(div);
      });
    }

    function submitSuggestion() {
      const text = document.getElementById("suggest-text").value.trim();
      const category = document.getElementById("suggest-category").value;
      const levelValue = document.getElementById("suggest-level").value;
      const profile = getUserProfile();

      if (!text) {
        alert("Écris d'abord une mission.");
        return;
      }

      saveSuggestion(createMissionSuggestion({
        text,
        category,
        level: levelValue ? Number(levelValue) : null,
        displayName: profile.displayName || ""
      }));

      document.getElementById("suggest-text").value = "";
      document.getElementById("suggest-category").value = "";
      document.getElementById("suggest-level").value = "";

      renderSuggestions();
      alert("Merci. On la garde de côté pour enrichir la suite.");
    }

    // ===== Orga =====
    function sortMapDesc(map) {
      return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }

    function renderOrga() {
      const results = getResults();
      const stats = {
        vues: countShown(results),
        validées: countDone(results),
        passées: countSkipped(),
        photos: countPhotos(results),
        partagées: countSharedPhotos(results),
        messages: countOrgaMessages(results),
        propositions: getSuggestions().length
      };

      orgaStats.innerHTML = "";
      Object.entries(stats).forEach(([label, value]) => {
        const block = document.createElement("div");
        block.className = "stat";
        block.innerHTML = `<div class="micro">${label}</div><strong>${value}</strong>`;
        orgaStats.appendChild(block);
      });

      const doneByMission = sortMapDesc(countDoneByMission(results)).slice(0, 8);
      topMissions.innerHTML = doneByMission.length
        ? doneByMission.map(([missionId, count]) => {
            const mission = getMissionById(Number(missionId));
            return `<div>${mission ? escapeHtml(mission.text) : missionId} — ${count}</div>`;
          }).join("")
        : '<div class="micro">Pas encore de données.</div>';

      const ratings = sortMapDesc(getAverageRatings(results)).slice(0, 8);
      topRated.innerHTML = ratings.length
        ? ratings.map(([missionId, avg]) => {
            const mission = getMissionById(Number(missionId));
            return `<div>${mission ? escapeHtml(mission.text) : missionId} — ${avg.toFixed(1)}/5</div>`;
          }).join("")
        : '<div class="micro">Aucune note pour l\'instant.</div>';

      const sequences = sortMapDesc(countMissionSequences(results)).slice(0, 8);
      topSequences.innerHTML = sequences.length
        ? sequences.map(([key, count]) => `<div>${escapeHtml(key)} — ${count}</div>`).join("")
        : '<div class="micro">Pas encore d\'enchaînements relevés.</div>';

      const messages = results.filter(r => (r.orgaMessage || "").trim()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
      orgaMessages.innerHTML = messages.length
        ? messages.map(r => {
            const mission = getMissionById(r.missionId);
            return `<div><strong>${mission ? escapeHtml(mission.text) : "Mission"}</strong><br><span class="micro">${formatDateTime(r.createdAt)}${r.displayName ? ` · ${escapeHtml(r.displayName)}` : ""}</span><br>${escapeHtml(r.orgaMessage)}</div>`;
          }).join("")
        : '<div class="micro">Aucun message pour l\'instant.</div>';
    }

    // ===== Utilitaires =====
    function escapeHtml(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    // ===== Événements =====
    document.getElementById("start-btn").addEventListener("click", startGame);
    document.getElementById("journal-btn").addEventListener("click", () => showScreen("journal"));
    document.getElementById("validate-mission-btn").addEventListener("click", openValidation);
    document.getElementById("another-mission-btn").addEventListener("click", goToAnotherMission);
    document.getElementById("confirm-validation-btn").addEventListener("click", confirmValidation);
    document.getElementById("cancel-validation-btn").addEventListener("click", () => showScreen("mission"));
    document.getElementById("submit-suggestion-btn").addEventListener("click", submitSuggestion);
    photoInput.addEventListener("change", handlePhotoChange);

    // ===== Initialisation =====
    function init() {
      getOrCreateSessionId();
      hydrateProfile();
      renderJournal();
      renderPhotos();
      renderSuggestions();
      renderOrga();

      // Astuce : accès orga en ajoutant #orga à l'URL
      if (location.hash === "#orga") {
        showScreen("orga");
      }
    }

    init();

    // ===== Notes pour la suite Supabase =====
    // 1. Remplacer fileToLocalDataUrl par un vrai upload Supabase Storage.
    // 2. Remplacer localStorage par des tables Supabase (mission_results, mission_suggestions).
    // 3. Conserver la logique de visibilité photo : private | participants.
    // 4. La page Photos doit lire seulement les résultats avec photo_url non vide et visibility = participants.