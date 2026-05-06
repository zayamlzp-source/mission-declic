'use strict';

/* â”€â”€â”€ Storage keys â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const SK = {
  profile:       'capPatrimoine.profile',
  alertSettings: 'capPatrimoine.alertSettings',
  alertFeed:     'capPatrimoine.alertFeed',
  history:       'capPatrimoine.history',
  sparkData:     'capPatrimoine.sparkData',
  briefSettings: 'capPatrimoine.briefSettings',
};

/* â”€â”€â”€ Default alert settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const DEFAULTS = {
  alert: {
    enabled:      true,
    btcThreshold: 5,
    ethThreshold: 8,
    capThreshold: 2,
    eurusdHigh:   1.12,
    eurusdLow:    1.05,
    goldHigh:     2500,
  },
  brief: { enabled: true },
};

/* â”€â”€â”€ Intelligence institutionnelle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
/*
 * Toutes les donnees ci-dessous sont PUBLIQUES :
 * - Depots SEC Form 13F (obligatoire tous les 90 jours, seuil 100M$)
 * - Rapports annuels Berkshire Hathaway, Bridgewater
 * - Declarations publiques / interviews / lettres aux actionnaires
 * Source primaire : sec.gov/cgi-bin/browse-edgar
 */

const MACRO_SIGNALS = [
  {
    level:  'danger',
    icon:   'ðŸ¦',
    title:  'Fed : taux inchanges (4.25-4.5%) â€” Avr. 2026',
    text:   "La Reserve federale maintient ses taux directeurs. Powell indique qu'aucune baisse n'est imminente tant que l'inflation reste au-dessus de 2.5%. Pression maintenue sur les obligations longues et les actifs de croissance.",
    impact: { bonds: -1, crypto: -1, etf: 0, immo: -1 },
  },
  {
    level:  'warning',
    icon:   'ðŸ“Š',
    title:  'BCE : taux de depot a 2.5% â€” Avr. 2026',
    text:   "La BCE a operÃ© 4 baisses successives depuis fin 2024. L'euro reste sous pression face au dollar. Favorable aux exportateurs europeens et aux SCPI a rendement variable, mais dilue le pouvoir d'achat de l'epargnant.",
    impact: { immo: 1, bonds: 1, gold: 1, etf: 0 },
  },
  {
    level:  'warning',
    icon:   'ðŸ’¸',
    title:  'Inflation US : 2.8% (CPI Mars 2026)',
    text:   "L'inflation americaine reste au-dessus de l'objectif Fed (2%). Les actifs tangibles (or, immobilier, energie) et les TIPS continuent de servir de couverture. Penalise les obligations a taux fixe long terme.",
    impact: { gold: 2, immo: 1, bonds: -2, etf: 0 },
  },
  {
    level:  'info',
    icon:   'ðŸŒ',
    title:  'FMI : croissance mondiale 3.2% en 2026',
    text:   "Le FMI maintient ses previsions de croissance globale moderee. Les marches emergents (Inde, Asie du Sud-Est) surperforment. Les ETF MSCI World et EM profitent de la diversification geographique.",
    impact: { etf: 1, pe: 1 },
  },
  {
    level:  'danger',
    icon:   'ðŸ“‰',
    title:  'Dette US : 36 000 Mds$ â€” risque systÃ©mique',
    text:   "La dette federale americaine atteint des niveaux historiques. Plusieurs analystes (Druckenmiller, Dalio) alertent sur un risque de \"crise de la dette\" a moyen terme. Pousse vers l'or, le Bitcoin et les actifs hors dollar.",
    impact: { gold: 2, crypto: 1, bonds: -2 },
  },
];

const INVESTORS = [
  {
    name:     'Warren Buffett',
    firm:     'Berkshire Hathaway',
    aum:      '~900 Mds$',
    avatar:   'WB',
    color:    '#1f7a67',
    lastFiled: 'T4 2025 (13F)',
    stance:   'Prudent / Valeur',
    cash:     'Niveau record de cash (330 Mds$) â€” signal de prudence extreme',
    positions: [
      { asset: 'Apple (AAPL)',          weight: '28%',  market: 'etf',    action: 'hold',   note: 'Position reduite de 50% vs 2023, reste la plus grande ligne' },
      { asset: 'American Express (AXP)', weight: '15%',  market: 'etf',    action: 'hold',   note: 'Position intacte depuis des decennies â€” conviction tres forte' },
      { asset: 'Coca-Cola (KO)',         weight: '9%',   market: 'etf',    action: 'hold',   note: 'Jamais vendu depuis 1988 â€” exemple de conviction long terme' },
      { asset: 'Occidental Petroleum',   weight: '5%',   market: 'etf',    action: 'buy',    note: 'Exposition a l\'energie / inflation â€” rachat progressif' },
      { asset: 'Cash / T-bills',         weight: '37%',  market: 'bonds',  action: 'buy',    note: 'Niveau record â€” Buffett attend une opportunite de marche' },
    ],
    keyQuote: '"Soyez craintif quand les autres sont avides." â€” Berkshire Annual Letter 2025',
  },
  {
    name:     'Ray Dalio',
    firm:     'Bridgewater Associates',
    aum:      '~124 Mds$',
    avatar:   'RD',
    color:    '#7a5c1f',
    lastFiled: 'T4 2025 (13F)',
    stance:   'Macro / Diversification',
    cash:     'Tres diversifie â€” "All Weather Portfolio"',
    positions: [
      { asset: 'Or (via ETF GLD/IAU)',   weight: '~15%', market: 'gold',   action: 'buy',    note: 'Dalio considere l\'or essentiel face a la dette souveraine mondiale' },
      { asset: 'ETF Marches emergents',  weight: '~18%', market: 'etf',    action: 'buy',    note: 'Forte surponderation Chine et Inde vs pairs' },
      { asset: 'Obligations TIPS',       weight: '~20%', market: 'bonds',  action: 'hold',   note: 'Protection inflation integree au portefeuille All Weather' },
      { asset: 'Actions US large caps',  weight: '~25%', market: 'etf',    action: 'hold',   note: 'Positions diversifiees via ETF S&P 500' },
    ],
    keyQuote: '"L\'or est la monnaie de dernier recours." â€” Bridgewater Research Note 2025',
  },
  {
    name:     'Michael Saylor',
    firm:     'Strategy (ex-MicroStrategy)',
    aum:      '~47 Mds$ BTC',
    avatar:   'MS',
    color:    '#c2542f',
    lastFiled: 'SEC 8-K (continu)',
    stance:   'Bitcoin Maximaliste',
    cash:     '568 000+ BTC detenus directement (Avr. 2026)',
    positions: [
      { asset: 'Bitcoin (BTC)',           weight: '100%', market: 'crypto', action: 'buy',    note: 'Achat systematique chaque semaine â€” "Bitcoin est de l\'energie numerique"' },
    ],
    keyQuote: '"Bitcoin est la meilleure reserve de valeur de l\'histoire humaine." â€” Conf. BTC 2025',
  },
  {
    name:     'Larry Fink',
    firm:     'BlackRock',
    aum:      '~10 000 Mds$',
    avatar:   'LF',
    color:    '#1f447a',
    lastFiled: 'Rapport annuel 2025',
    stance:   'Institutionnel / ETF / Tokenisation',
    cash:     'Positionne massivement sur les ETF Bitcoin spot (IBIT)',
    positions: [
      { asset: 'ETF Bitcoin spot (IBIT)', weight: 'N/A',  market: 'crypto', action: 'buy',    note: 'BlackRock gere le plus grand ETF Bitcoin au monde (>50 Mds$)' },
      { asset: 'Infrastructures / actifs reels', weight: 'N/A', market: 'immo', action: 'buy', note: 'Positionnement fort sur les actifs reels physiques et tokenises' },
      { asset: 'ETF actions mondiales', weight: 'N/A',   market: 'etf',    action: 'hold',   note: 'Coeur du business â€” iShares controle ~40% du marche ETF mondial' },
    ],
    keyQuote: '"La tokenisation des actifs reels est la prochaine revolution financiere." â€” Lettre CEO 2025',
  },
  {
    name:     'Stanley Druckenmiller',
    firm:     'Duquesne Family Office',
    aum:      '~3 Mds$',
    avatar:   'SD',
    color:    '#5b3a7a',
    lastFiled: 'T4 2025 (13F)',
    stance:   'Macro / Opportuniste',
    cash:     'Tres actif â€” taux de rotation eleve',
    positions: [
      { asset: 'Or (positions longues)',  weight: '~12%', market: 'gold',   action: 'buy',    note: 'Alerte publiquement sur la crise de la dette souveraine US' },
      { asset: 'IA / Tech (Nvidia, etc.)','weight': '~20%', market: 'etf', action: 'buy',    note: 'Conviction forte sur le cycle IA â€” achats en 2023-2024' },
      { asset: 'Bitcoin',                 weight: '~5%',  market: 'crypto', action: 'hold',   note: 'Position initiee en 2020, maintenue comme couverture macro' },
    ],
    keyQuote: '"La dette US est le plus grand danger macro de notre generation." â€” Sohn Conference 2025',
  },
  {
    name:     'Cathie Wood',
    firm:     'ARK Invest',
    aum:      '~14 Mds$',
    avatar:   'CW',
    color:    '#1f7a67',
    lastFiled: 'Transactions quotidiennes publiques',
    stance:   'Innovation / Disruption / Long terme',
    cash:     'Peu de cash â€” investit en conviction forte',
    positions: [
      { asset: 'Tesla (TSLA)',            weight: '~12%', market: 'etf',    action: 'hold',   note: 'Plus grande position historique ARK â€” conviction IA + energie' },
      { asset: 'Bitcoin (via ETF)',       weight: '~8%',  market: 'crypto', action: 'buy',    note: 'Target BTC 1.5M$ pour 2030 selon modele ARK' },
      { asset: 'Coinbase (COIN)',         weight: '~10%', market: 'crypto', action: 'hold',   note: 'Paris sur l\'infrastructure crypto reglementee' },
      { asset: 'Biotech / CRISPR',        weight: '~15%', market: 'etf',    action: 'buy',    note: 'Conviction forte sur la revolution genomique' },
    ],
    keyQuote: '"Nous investissons dans les technologies qui changeront le monde sur 5 a 10 ans." â€” ARK Big Ideas 2026',
  },
];

/* â”€â”€â”€ Render : Intel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderIntelMacro() {
  const container = document.getElementById('intel-macro');
  if (!container) return;
  container.innerHTML = `
    <h3 class="intel-section-title">Signaux macro globaux</h3>
    <div class="macro-grid">${MACRO_SIGNALS.map(s => `
      <div class="macro-card macro-${s.level}">
        <div class="macro-head">
          <span class="macro-icon">${s.icon}</span>
          <strong class="macro-title">${s.title}</strong>
          <span class="macro-badge macro-badge-${s.level}">${s.level.toUpperCase()}</span>
        </div>
        <p class="macro-text">${s.text}</p>
      </div>`).join('')}
    </div>`;
}

function renderIntelInvestors() {
  const container = document.getElementById('intel-investors');
  if (!container) return;
  container.innerHTML = `
    <h3 class="intel-section-title">Positions publiques des grands investisseurs <span class="intel-13f-note">(SEC 13F / declarations officielles)</span></h3>
    <div class="investor-grid">${INVESTORS.map(inv => `
      <div class="investor-card" style="--accent-color:${inv.color}">
        <div class="investor-head">
          <span class="investor-avatar" style="background:linear-gradient(135deg,${inv.color},${inv.color}cc)">${inv.avatar}</span>
          <div>
            <strong class="investor-name">${inv.name}</strong>
            <span class="investor-firm">${inv.firm}</span>
            <span class="investor-aum">${inv.aum}</span>
          </div>
          <span class="investor-stance">${inv.stance}</span>
        </div>
        <p class="investor-cash">${inv.cash}</p>
        <table class="investor-table">
          <thead><tr><th>Actif</th><th>Poids</th><th>Signal</th><th>Note</th></tr></thead>
          <tbody>${inv.positions.map(p => `
            <tr>
              <td><strong>${p.asset}</strong></td>
              <td>${p.weight}</td>
              <td><span class="action-badge action-${p.action}">${p.action === 'buy' ? 'â–² Achat' : p.action === 'sell' ? 'â–¼ Vente' : 'â— Maintien'}</span></td>
              <td class="investor-note">${p.note}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <blockquote class="investor-quote">${inv.keyQuote}</blockquote>
        <p class="investor-filed">Derniere declaration : ${inv.lastFiled}</p>
      </div>`).join('')}
    </div>`;
}

function computeInstitutionalBoost(marketId) {
  let boost = 0;
  MACRO_SIGNALS.forEach(s => { if (s.impact && s.impact[marketId]) boost += s.impact[marketId]; });
  INVESTORS.forEach(inv => {
    inv.positions.forEach(p => {
      if (p.market === marketId) {
        if (p.action === 'buy')  boost += 3;
        if (p.action === 'hold') boost += 1;
        if (p.action === 'sell') boost -= 2;
      }
    });
  });
  return boost;
}


const MARKETS = [
  {
    id: 'etf',
    name: 'ETF / Actions',
    tag: 'Bourse',
    description: "Les ETF indiciels (MSCI World, S&P 500) permettent d'investir en Bourse a faibles frais avec une diversification mondiale instantanee.",
    risk: 3, liquidity: 5, horizon: 5,
    passiveFriendly: true, realAsset: false,
    minCapital: 'small', minExperience: 'beginner',
    scoreFactors: { growth: 5, balanced: 4, income: 3, preservation: 1, inflation: 4 },
    pros: [
      'Diversification mondiale instantanee',
      'Frais de gestion tres faibles (< 0.25%)',
      'Liquidite quotidienne',
      'Acces des 1 EUR via PEA ou CTO',
    ],
    cons: [
      'Volatilite court terme significative',
      'Rendement non garanti',
      'Impacte par les crises macro globales',
    ],
  },
  {
    id: 'immo',
    name: 'Immobilier',
    tag: 'Pierre',
    description: "L'investissement immobilier (direct ou via SCPI) offre des revenus locatifs reguliers et une valeur refuge contre l'inflation.",
    risk: 2, liquidity: 1, horizon: 10,
    passiveFriendly: true, realAsset: true,
    minCapital: 'large', minExperience: 'intermediate',
    scoreFactors: { growth: 3, balanced: 5, income: 5, preservation: 4, inflation: 5 },
    pros: [
      'Actif tangible, refuge contre l\'inflation',
      'Revenus locatifs reguliers (SCPI)',
      'Effet de levier via le credit immobilier',
      'Patrimoine transmissible',
    ],
    cons: [
      'Faible liquidite, surtout en direct',
      'Capital de depart eleve',
      'Gestion, entretien et charges',
    ],
  },
  {
    id: 'crypto',
    name: 'Cryptomonnaies',
    tag: 'Crypto',
    description: "Bitcoin, Ethereum et autres actifs numeriques offrent un potentiel de gains eleves au prix d'une volatilite extreme et de risques reglementaires.",
    risk: 5, liquidity: 5, horizon: 5,
    passiveFriendly: false, realAsset: false,
    minCapital: 'small', minExperience: 'intermediate',
    scoreFactors: { growth: 5, balanced: 2, income: 1, preservation: 1, inflation: 3 },
    pros: [
      'Potentiel de croissance tres eleve',
      'Liquidite 24h/7j sur les plateformes',
      'Diversification hors systeme bancaire classique',
      'Accessible avec de petits montants',
    ],
    cons: [
      'Volatilite extreme (drawdown -80% possible)',
      'Risque reglementaire et fiscal evolutif',
      'Pas de sous-jacent fondamental garantissant la valeur',
    ],
  },
  {
    id: 'gold',
    name: 'Or / Metaux precieux',
    tag: 'Metaux',
    description: "L'or est un actif refuge classique, efficace contre l'inflation et les crises systÃ©miques, mais sans rendement courant.",
    risk: 2, liquidity: 4, horizon: 5,
    passiveFriendly: true, realAsset: true,
    minCapital: 'small', minExperience: 'beginner',
    scoreFactors: { growth: 2, balanced: 3, income: 1, preservation: 5, inflation: 5 },
    pros: [
      'Valeur refuge en periode de crise',
      'Protection contre l\'inflation sur le long terme',
      'Decorrelation avec les actions',
      'Accessible via ETF Or sans stockage',
    ],
    cons: [
      'Aucun dividende ni interet',
      'Stockage et assurance (or physique)',
      'Cotation en USD - risque de change EUR/USD',
    ],
  },
  {
    id: 'bonds',
    name: 'Obligations / Fonds euros',
    tag: 'Taux',
    description: "Les obligations d'Etat et les fonds euros en assurance vie offrent une securite elevee avec des rendements modestes mais previsibles.",
    risk: 1, liquidity: 3, horizon: 3,
    passiveFriendly: true, realAsset: false,
    minCapital: 'small', minExperience: 'beginner',
    scoreFactors: { growth: 1, balanced: 3, income: 4, preservation: 5, inflation: 2 },
    pros: [
      'Capital garanti (fonds euros assurance vie)',
      'Rendement previsible et stable',
      'Faible volatilite',
      'Accessible des 1 EUR',
    ],
    cons: [
      'Rendement souvent inferieur a l\'inflation',
      'Sensibilite aux hausses de taux d\'interet',
      'Rendement reel potentiellement negatif',
    ],
  },
  {
    id: 'pe',
    name: 'Private Equity / FCPR',
    tag: 'Non cote',
    description: "L'investissement dans des entreprises non cotees (via FCPR) peut offrir des rendements eleves pour un capital patient et bloque sur 5-10 ans.",
    risk: 4, liquidity: 1, horizon: 10,
    passiveFriendly: false, realAsset: false,
    minCapital: 'large', minExperience: 'advanced',
    scoreFactors: { growth: 5, balanced: 3, income: 2, preservation: 1, inflation: 3 },
    pros: [
      'Potentiel de rendement eleve (10-15%/an)',
      'Decorrelation avec la Bourse cotee',
      'Soutien a l\'economie reelle',
      'Fiscalite avantageuse (FCPR/FPCI)',
    ],
    cons: [
      'Capital bloque 5-10 ans minimum',
      'Capital de depart eleve (> 50 000 EUR)',
      'Necessite une expertise avancee',
    ],
  },
];

/* â”€â”€â”€ App state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const state = {
  autoTimerId:       null,
  countdownTimerId:  null,
  nextRefreshAt:     null,
  profileSaveTimerId: null,
  lastRankedMarkets: [],
  lastSnapshot:      null,
  prevSnapshot:      null,
  alertFeed:         [],
  history:           [],
  sparkData:         [],
  settings: {
    alert: { ...DEFAULTS.alert },
    brief: { ...DEFAULTS.brief },
  },
};

/* â”€â”€â”€ DOM / util helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const $ = id => document.getElementById(id);

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* quota */ }
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch (_) { return fallback; }
}

/* â”€â”€â”€ Profile persistence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function saveProfileNow() {
  const form = $('advisor-form');
  if (!form) return;
  const fd = new FormData(form);
  const data = Object.fromEntries(fd);
  data.preference = [...form.querySelectorAll('input[name="preference"]:checked')]
    .map(c => c.value);
  save(SK.profile, data);
  const st = $('profile-save-status');
  if (st) {
    st.textContent = 'Profil sauvegarde â€” ' + new Date().toLocaleTimeString('fr-FR');
    st.classList.add('saved');
    setTimeout(() => st.classList.remove('saved'), 2000);
  }
}

function restoreProfileFromStorage() {
  const data = load(SK.profile, null);
  if (!data) return;
  const form = $('advisor-form');
  if (!form) return;
  ['goal', 'horizon', 'experience', 'capital'].forEach(id => {
    const el = $(id);
    if (el && data[id]) el.value = data[id];
  });
  ['risk', 'liquidity'].forEach(id => {
    const el = $(id);
    if (el && data[id] !== undefined) el.value = data[id];
  });
  const prefs = Array.isArray(data.preference) ? data.preference : [];
  form.querySelectorAll('input[name="preference"]').forEach(cb => {
    cb.checked = prefs.includes(cb.value);
  });
  syncOutputs();
  const st = $('profile-save-status');
  if (st) st.textContent = 'Profil restaure depuis cet appareil.';
}

function resetProfile() {
  localStorage.removeItem(SK.profile);
  const form = $('advisor-form');
  if (form) form.reset();
  syncOutputs();
  updateAdvisor();
  const st = $('profile-save-status');
  if (st) st.textContent = 'Profil reinitialise.';
}

function scheduleProfileSave() {
  clearTimeout(state.profileSaveTimerId);
  state.profileSaveTimerId = setTimeout(saveProfileNow, 350);
}

/* â”€â”€â”€ Range outputs sync â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function syncOutputs() {
  const risk = $('risk');
  const riskOut = $('risk-output');
  if (risk && riskOut) riskOut.value = risk.value;
  const liq = $('liquidity');
  const liqOut = $('liquidity-output');
  if (liq && liqOut) liqOut.value = liq.value;
}

/* â”€â”€â”€ Scoring engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function getFormData() {
  const form = $('advisor-form');
  const fd = new FormData(form);
  return {
    goal:        fd.get('goal')       || 'balanced',
    horizon:     parseInt(fd.get('horizon')    || '10', 10),
    risk:        parseInt(fd.get('risk')       || '3',  10),
    liquidity:   parseInt(fd.get('liquidity')  || '3',  10),
    experience:  fd.get('experience') || 'intermediate',
    capital:     fd.get('capital')    || 'medium',
    preferences: fd.getAll('preference'),
  };
}

function scoreMarket(market, p) {
  let score = 0;

  // Goal alignment (max 20)
  score += (market.scoreFactors[p.goal] || 3) * 4;

  // Horizon compatibility (max 15)
  const hDiff = Math.abs(market.horizon - p.horizon);
  score += Math.max(0, 15 - hDiff * 2);

  // Risk match (max 15)
  const rDiff = Math.abs(market.risk - p.risk);
  score += Math.max(0, 15 - rDiff * 3);

  // Liquidity need (max 15)
  if (p.liquidity >= 4 && market.liquidity < 3) score -= 15;
  else if (p.liquidity >= 4) score += 10;
  else if (p.liquidity <= 2 && market.liquidity >= 4) score += 5;
  else score += 8;

  // Experience gate (max 10)
  const expMap = { beginner: 1, intermediate: 2, advanced: 3 };
  const minMap = { beginner: 1, intermediate: 2, advanced: 3 };
  if ((expMap[p.experience] || 2) >= (minMap[market.minExperience] || 1)) score += 10;
  else score -= 10;

  // Capital gate (max 10)
  const capMap = { small: 1, medium: 2, large: 3 };
  if ((capMap[p.capital] || 2) >= (capMap[market.minCapital] || 1)) score += 10;
  else score -= 15;

  // Preferences (max 22)
  if (p.preferences.includes('passive')         && market.passiveFriendly) score += 8;
  if (p.preferences.includes('real-assets')     && market.realAsset)       score += 8;
  if (p.preferences.includes('high-volatility') && market.risk >= 4)       score += 6;
  if (!p.preferences.includes('high-volatility')&& market.risk >= 4)       score -= 8;

  // Boost institutionnel (signaux macro + positions grands investisseurs)
  score += computeInstitutionalBoost(market.id) * 1.5;

  return Math.max(0, Math.min(100, score));
}

function rankMarkets(p) {
  return MARKETS
    .map(m => ({ ...m, score: scoreMarket(m, p) }))
    .sort((a, b) => b.score - a.score);
}

/* â”€â”€â”€ Render: Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderSummary(ranked) {
  const container = $('summary-content');
  if (!container) return;
  const top = ranked[0];
  const snap = state.lastSnapshot;

  let html = `<div class="summary-top">
    <p class="summary-market-name">${top.name}</p>
    <p class="summary-market-desc">${top.description}</p>
    <div class="summary-badges">
      <span class="badge badge-tag">${top.tag}</span>
      <span class="badge">Score : ${top.score}/100</span>
      <span class="badge">Risque : ${'â—'.repeat(top.risk)}${'â—‹'.repeat(5 - top.risk)}</span>
    </div>
  </div>`;

  if (snap) {
    const btcDir   = (snap.btcChange24h || 0) > 0 ? 'â–²' : 'â–¼';
    const btcCls   = (snap.btcChange24h || 0) > 0 ? 'positive' : 'negative';
    html += `<div class="summary-live">
      <span class="summary-live-item">BTC <strong class="${btcCls}">${btcDir} ${Math.abs(snap.btcChange24h || 0).toFixed(1)}%</strong></span>
      <span class="summary-live-item">EUR/USD <strong>${snap.eurusd ? snap.eurusd.toFixed(4) : 'N/A'}</strong></span>
      <span class="summary-live-item">Cap. crypto <strong>${snap.totalMktCapB ? '$' + snap.totalMktCapB.toFixed(0) + ' Md' : 'N/A'}</strong></span>
    </div>`;
  }

  container.innerHTML = html;
}

/* â”€â”€â”€ Render: Recommendations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderRecommendations(ranked) {
  const grid = $('recommendations-grid');
  if (!grid) return;
  const tpl = document.getElementById('recommendation-template');
  grid.innerHTML = '';

  ranked.slice(0, 3).forEach((market, i) => {
    const card = tpl.content.cloneNode(true);
    card.querySelector('.market-tag').textContent         = market.tag;
    card.querySelector('.market-score').textContent       = market.score + '/100';
    card.querySelector('.market-name').textContent        = (i === 0 ? 'â˜… ' : '') + market.name;
    card.querySelector('.market-description').textContent = market.description;
    card.querySelector('.market-meta').innerHTML = `
      <span>Risque : ${'â—'.repeat(market.risk)}${'â—‹'.repeat(5 - market.risk)}</span>
      <span>Liquidite : ${'â—'.repeat(market.liquidity)}${'â—‹'.repeat(5 - market.liquidity)}</span>
      <span>Horizon min : ${market.horizon} ans</span>`;

    const whyList   = card.querySelector('.why-list');
    const watchList = card.querySelector('.watch-list');
    market.pros.forEach(p => { const li = document.createElement('li'); li.textContent = p; whyList.appendChild(li); });
    market.cons.forEach(c => { const li = document.createElement('li'); li.textContent = c; watchList.appendChild(li); });

    if (i === 0) card.querySelector('.market-card').classList.add('top-pick');
    grid.appendChild(card);
  });
}

/* â”€â”€â”€ Render: Comparison table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderComparisonTable(ranked) {
  const container = $('comparison-table');
  if (!container) return;
  let html = '<table class="comp-table"><thead><tr><th>Marche</th><th>Score</th><th>Risque</th><th>Liquidite</th><th>Horizon</th></tr></thead><tbody>';
  ranked.forEach((m, i) => {
    html += `<tr class="${i === 0 ? 'top-row' : ''}">
      <td><strong>${m.name}</strong></td>
      <td><span class="score-pill">${m.score}</span></td>
      <td>${'â—'.repeat(m.risk)}${'â—‹'.repeat(5 - m.risk)}</td>
      <td>${'â—'.repeat(m.liquidity)}${'â—‹'.repeat(5 - m.liquidity)}</td>
      <td>${m.horizon} ans</td>
    </tr>`;
  });
  container.innerHTML = html + '</tbody></table>';
}

/* â”€â”€â”€ Render: Live metrics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderLiveMetrics(snap) {
  const container = $('live-metrics');
  if (!container || !snap) return;
  const btcCls   = (snap.btcChange24h || 0) > 0 ? 'metric-up' : 'metric-down';
  const ethCls   = (snap.ethChange24h || 0) > 0 ? 'metric-up' : 'metric-down';
  const btcArrow = (snap.btcChange24h || 0) > 0 ? 'â–²' : 'â–¼';
  const ethArrow = (snap.ethChange24h || 0) > 0 ? 'â–²' : 'â–¼';
  container.innerHTML = `
    <div class="metric-card ${btcCls}">
      <p class="metric-label">Bitcoin</p>
      <p class="metric-value">$${snap.btcPrice ? snap.btcPrice.toLocaleString('fr-FR') : 'N/A'}</p>
      <p class="metric-change">${btcArrow} ${Math.abs(snap.btcChange24h || 0).toFixed(2)}% (24h)</p>
    </div>
    <div class="metric-card ${ethCls}">
      <p class="metric-label">Ethereum</p>
      <p class="metric-value">$${snap.ethPrice ? snap.ethPrice.toLocaleString('fr-FR') : 'N/A'}</p>
      <p class="metric-change">${ethArrow} ${Math.abs(snap.ethChange24h || 0).toFixed(2)}% (24h)</p>
    </div>
    <div class="metric-card">
      <p class="metric-label">EUR / USD</p>
      <p class="metric-value">${snap.eurusd ? snap.eurusd.toFixed(4) : 'N/A'}</p>
      <p class="metric-change">Taux de change</p>
    </div>
    <div class="metric-card">
      <p class="metric-label">Cap. crypto totale</p>
      <p class="metric-value">${snap.totalMktCapB ? '$' + snap.totalMktCapB.toFixed(0) + ' Md' : 'N/A'}</p>
      <p class="metric-change">Marche global</p>
    </div>`;
}

/* â”€â”€â”€ Render: Signals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function renderSignals(snap) {
  const list = $('live-signals');
  if (!list || !snap) return;
  const signals = [];

  if (snap.btcChange24h !== undefined) {
    const abs = snap.btcChange24h.toFixed(1);
    if (snap.btcChange24h > 5)       signals.push({ type: 'positive', text: `Bitcoin en forte hausse : +${abs}% sur 24h.` });
    else if (snap.btcChange24h < -5) signals.push({ type: 'negative', text: `Bitcoin en forte baisse : ${abs}% sur 24h.` });
    else                              signals.push({ type: 'neutral',  text: `Bitcoin stable : ${snap.btcChange24h > 0 ? '+' : ''}${abs}% sur 24h.` });
  }

  if (snap.eurusd !== undefined) {
    if (snap.eurusd > 1.10)      signals.push({ type: 'positive', text: `EUR fort face au dollar (${snap.eurusd.toFixed(4)}) â€” actifs USD plus abordables.` });
    else if (snap.eurusd < 1.05) signals.push({ type: 'warning',  text: `EUR faible face au dollar (${snap.eurusd.toFixed(4)}) â€” attention aux achats en USD.` });
    else                          signals.push({ type: 'neutral',  text: `EUR/USD en zone neutre : ${snap.eurusd.toFixed(4)}.` });
  }

  if (snap.dominance !== undefined) {
    if (snap.dominance > 55)      signals.push({ type: 'warning',  text: `Dominance BTC elevee (${snap.dominance.toFixed(1)}%) â€” prudence sur les altcoins.` });
    else if (snap.dominance < 45) signals.push({ type: 'positive', text: `Altcoins actifs â€” dominance BTC basse (${snap.dominance.toFixed(1)}%).` });
  }

  if (snap.ethPrice && snap.btcPrice) {
    const ratio = (snap.ethPrice / snap.btcPrice).toFixed(5);
    signals.push({ type: 'neutral', text: `Ratio ETH/BTC : ${ratio}.` });
  }

  list.innerHTML = signals.map(s =>
    `<li class="signal signal-${s.type}">${s.text}</li>`
  ).join('');
}

/* â”€â”€â”€ Sparkline chart (Canvas) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function drawSparklines() {
  const canvas = $('sparkline-chart');
  if (!canvas) return;
  const W = canvas.offsetWidth || 600;
  const H = 130;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const data = [...state.sparkData].reverse(); // oldest â†’ newest

  if (data.length < 2) {
    ctx.fillStyle = '#5b6a5e';
    ctx.font = '13px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Attendez 2+ actualisations pour voir la courbe.', W / 2, H / 2);
    return;
  }

  // Light grid
  ctx.strokeStyle = 'rgba(24, 33, 26, 0.07)';
  ctx.lineWidth = 1;
  [0.25, 0.5, 0.75].forEach(f => {
    const y = H * f;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  });

  function drawLine(values, color) {
    const valid = values.filter(v => v != null && isFinite(v));
    if (valid.length < 2) return;
    const min   = Math.min(...valid);
    const max   = Math.max(...valid);
    const range = max - min || 1;
    const xStep = (W - 20) / (values.length - 1);
    const PAD   = 14;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    let first = true;
    values.forEach((v, i) => {
      if (v == null || !isFinite(v)) return;
      const x = 10 + i * xStep;
      const y = PAD + (1 - (v - min) / range) * (H - PAD * 2);
      if (first) { ctx.moveTo(x, y); first = false; }
      else        ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  drawLine(data.map(d => d.btc),                     '#c2542f'); // BTC orange
  drawLine(data.map(d => d.eth),                     '#1f7a67'); // ETH green
  drawLine(data.map(d => d.eurusd ? d.eurusd * 1000 : null), '#7a5c1f'); // EUR/USD amber

  // Legend
  const legends = [
    { color: '#c2542f', label: 'BTC' },
    { color: '#1f7a67', label: 'ETH' },
    { color: '#7a5c1f', label: 'EUR/USD' },
  ];
  ctx.font = '11px Manrope, sans-serif';
  legends.forEach((l, i) => {
    ctx.fillStyle = l.color;
    ctx.fillRect(10 + i * 82, 6, 14, 4);
    ctx.fillStyle = '#5b6a5e';
    ctx.fillText(l.label, 28 + i * 82, 14);
  });
}

/* â”€â”€â”€ Alert system â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function evaluateAlerts(snap, prev) {
  const s = state.settings.alert;
  if (!s.enabled || !snap) return;

  // BTC 24h change
  if (snap.btcChange24h !== undefined && Math.abs(snap.btcChange24h) >= s.btcThreshold) {
    const dir = snap.btcChange24h > 0 ? 'hausse' : 'baisse';
    const level = Math.abs(snap.btcChange24h) > s.btcThreshold * 1.5 ? 'danger' : 'warning';
    pushAlert(`BTC : ${dir} de ${Math.abs(snap.btcChange24h).toFixed(1)}% en 24h (seuil : ${s.btcThreshold}%).`, level);
  }

  // ETH 24h change
  if (snap.ethChange24h !== undefined && Math.abs(snap.ethChange24h) >= s.ethThreshold) {
    const dir = snap.ethChange24h > 0 ? 'hausse' : 'baisse';
    pushAlert(`ETH : ${dir} de ${Math.abs(snap.ethChange24h).toFixed(1)}% en 24h (seuil : ${s.ethThreshold}%).`, 'warning');
  }

  // EUR/USD bounds
  if (snap.eurusd !== undefined) {
    if (snap.eurusd >= s.eurusdHigh)
      pushAlert(`EUR/USD au-dessus du seuil haut : ${snap.eurusd.toFixed(4)} >= ${s.eurusdHigh}.`, 'info');
    else if (snap.eurusd <= s.eurusdLow)
      pushAlert(`EUR/USD sous le seuil bas : ${snap.eurusd.toFixed(4)} <= ${s.eurusdLow}.`, 'warning');
  }

  // Market cap change vs previous snapshot
  if (prev && snap.totalMktCapB && prev.totalMktCapB) {
    const pct = ((snap.totalMktCapB - prev.totalMktCapB) / prev.totalMktCapB) * 100;
    if (Math.abs(pct) >= s.capThreshold) {
      const dir   = pct > 0 ? 'hausse' : 'baisse';
      const level = pct < -s.capThreshold ? 'danger' : 'warning';
      pushAlert(`Cap. crypto globale en ${dir} de ${Math.abs(pct).toFixed(1)}% (seuil : ${s.capThreshold}%).`, level);
    }
  }

  // Gold threshold note (informational â€” no free gold API used)
  if (snap.btcPrice && snap.btcPrice > s.goldHigh * 10) {
    pushAlert(`Seuil actif eleve depasse : BTC > ${(s.goldHigh * 10).toLocaleString('fr-FR')} $. Verifiez l'or et les actifs refuges.`, 'info');
  }
}

function pushAlert(text, level = 'info') {
  const item = { text, level, time: new Date().toLocaleTimeString('fr-FR'), ts: Date.now() };
  state.alertFeed.unshift(item);
  if (state.alertFeed.length > 40) state.alertFeed.pop();
  save(SK.alertFeed, state.alertFeed);
  renderAlertFeed();
  if ('Notification' in window && Notification.permission === 'granted')
    new Notification('Cap Patrimoine', { body: text });
}

function renderAlertFeed() {
  const list = $('alert-feed');
  if (!list) return;
  if (state.alertFeed.length === 0) {
    list.innerHTML = '<li class="signal signal-neutral">Aucune alerte detectee pour le moment.</li>';
    return;
  }
  const levelCls = { danger: 'negative', warning: 'warning', info: 'info', neutral: 'neutral' };
  list.innerHTML = state.alertFeed.slice(0, 12).map(a =>
    `<li class="signal signal-${levelCls[a.level] || 'neutral'}">[${a.time}] ${a.text}</li>`
  ).join('');
}

function applyAlertSettings() {
  const s = state.settings.alert;
  const map = {
    'alert-btc-threshold': 'btcThreshold',
    'alert-eth-threshold': 'ethThreshold',
    'alert-cap-threshold': 'capThreshold',
    'alert-eurusd-high':   'eurusdHigh',
    'alert-eurusd-low':    'eurusdLow',
    'alert-gold-high':     'goldHigh',
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = $(id);
    if (el && s[key] !== undefined) el.value = s[key];
  });
  const cb = $('smart-alerts');
  if (cb) cb.checked = s.enabled;
}

function readAlertSettings() {
  const s = state.settings.alert;
  s.enabled      = $('smart-alerts')?.checked ?? true;
  s.btcThreshold = parseFloat($('alert-btc-threshold')?.value) || 5;
  s.ethThreshold = parseFloat($('alert-eth-threshold')?.value) || 8;
  s.capThreshold = parseFloat($('alert-cap-threshold')?.value) || 2;
  s.eurusdHigh   = parseFloat($('alert-eurusd-high')?.value)   || 1.12;
  s.eurusdLow    = parseFloat($('alert-eurusd-low')?.value)    || 1.05;
  s.goldHigh     = parseFloat($('alert-gold-high')?.value)     || 2500;
  save(SK.alertSettings, s);
}

function updateNotificationStatusText() {
  const btn = $('enable-notifications');
  if (!btn) return;
  if (!('Notification' in window)) {
    btn.textContent = 'Notifications non supportees';
    btn.disabled = true;
  } else if (Notification.permission === 'granted') {
    btn.textContent = 'Notifications activees âœ“';
    btn.disabled = true;
  }
}

/* â”€â”€â”€ History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function recordHistory(snap, ranked) {
  if (!snap) return;
  state.history.unshift({
    ts:        snap.timestamp,
    time:      new Date(snap.timestamp).toLocaleString('fr-FR'),
    btcPrice:  snap.btcPrice,
    btcChange: snap.btcChange24h,
    ethPrice:  snap.ethPrice,
    eurusd:    snap.eurusd,
    mktCap:    snap.totalMktCapB,
    topMarket: ranked[0]?.name || 'â€”',
  });
  if (state.history.length > 60) state.history.pop();
  save(SK.history, state.history);

  // Spark data
  state.sparkData.unshift({
    ts:     snap.timestamp,
    btc:    snap.btcPrice,
    eth:    snap.ethPrice,
    eurusd: snap.eurusd,
    mktCap: snap.totalMktCapB,
  });
  if (state.sparkData.length > 30) state.sparkData.pop();
  save(SK.sparkData, state.sparkData);
  drawSparklines();

  renderHistory();
}

function renderHistory() {
  const list = $('history-list');
  if (!list) return;
  if (state.history.length === 0) {
    list.innerHTML = '<li class="history-item">Aucun historique pour le moment.</li>';
    return;
  }
  list.innerHTML = state.history.slice(0, 20).map(h => `
    <li class="history-item">
      <span class="history-time">${h.time}</span>
      <span class="history-data">
        ${h.btcPrice ? 'BTC $' + h.btcPrice.toLocaleString('fr-FR') : ''}
        ${h.eurusd   ? ' | EUR/USD ' + h.eurusd.toFixed(4) : ''}
        ${h.topMarket ? ' | ' + h.topMarket : ''}
      </span>
    </li>`).join('');
}

function exportHistoryCsv() {
  if (state.history.length === 0) return;
  const headers = ['Date', 'BTC Prix', 'BTC 24h%', 'ETH Prix', 'EUR/USD', 'Cap Md$', 'Top Marche'];
  const rows    = state.history.map(h => [
    h.time,
    h.btcPrice  || '',
    h.btcChange?.toFixed(2) || '',
    h.ethPrice  || '',
    h.eurusd?.toFixed(4)   || '',
    h.mktCap?.toFixed(0)   || '',
    h.topMarket,
  ]);
  const csv  = [headers, ...rows].map(r => r.join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'cap-patrimoine-historique.csv' });
  a.click();
  URL.revokeObjectURL(url);
}

function clearHistory() {
  state.history  = [];
  state.sparkData = [];
  save(SK.history, []);
  save(SK.sparkData, []);
  renderHistory();
  drawSparklines();
}

/* â”€â”€â”€ Brief quotidien â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function generateBrief() {
  const snap   = state.lastSnapshot;
  const ranked = state.lastRankedMarkets;
  if (!snap && ranked.length === 0) {
    return [{ icon: 'ðŸ“Š', text: 'Aucune donnee disponible. Lancez une actualisation.', importance: 0 }];
  }

  const items = [];

  if (snap?.btcChange24h !== undefined) {
    const abs      = Math.abs(snap.btcChange24h).toFixed(1);
    const dir      = snap.btcChange24h > 0 ? 'en hausse' : 'en baisse';
    const strength = Math.abs(snap.btcChange24h) > 5 ? 'fortement ' : '';
    items.push({
      icon:       snap.btcChange24h > 0 ? 'ðŸ“ˆ' : 'ðŸ“‰',
      text:       `Bitcoin est ${strength}${dir} de ${abs}% sur 24h${snap.btcPrice ? ' (' + snap.btcPrice.toLocaleString('fr-FR') + ' $)' : ''}.`,
      importance: Math.abs(snap.btcChange24h),
    });
  }

  if (snap?.ethChange24h !== undefined && Math.abs(snap.ethChange24h) > 1) {
    items.push({
      icon:       snap.ethChange24h > 0 ? 'ðŸ“ˆ' : 'ðŸ“‰',
      text:       `Ethereum ${snap.ethChange24h > 0 ? 'en hausse' : 'en baisse'} de ${Math.abs(snap.ethChange24h).toFixed(1)}% sur 24h${snap.ethPrice ? ' (' + snap.ethPrice.toLocaleString('fr-FR') + ' $)' : ''}.`,
      importance: Math.abs(snap.ethChange24h) * 0.85,
    });
  }

  if (snap?.eurusd !== undefined) {
    let msg = '';
    if      (snap.eurusd > 1.10) msg = `L'euro est solide face au dollar (${snap.eurusd.toFixed(4)}) â€” les actifs en USD sont plus abordables.`;
    else if (snap.eurusd < 1.05) msg = `L'euro est faible face au dollar (${snap.eurusd.toFixed(4)}) â€” les actifs en USD sont plus chers.`;
    else                          msg = `L'EUR/USD est dans une zone neutre (${snap.eurusd.toFixed(4)}).`;
    items.push({ icon: 'ðŸ’±', text: msg, importance: Math.abs(snap.eurusd - 1.08) * 25 });
  }

  if (snap?.dominance !== undefined) {
    if (snap.dominance > 55)
      items.push({ icon: 'âš ï¸', text: `Dominance BTC elevee (${snap.dominance.toFixed(1)}%) â€” signal de prudence sur les altcoins.`, importance: 3 });
    else if (snap.dominance < 45)
      items.push({ icon: 'ðŸ”€', text: `Diversification crypto active â€” dominance BTC basse (${snap.dominance.toFixed(1)}%).`, importance: 2 });
  }

  if (ranked.length > 0) {
    items.push({ icon: 'ðŸ†', text: `Marche le mieux adapte a votre profil actuel : ${ranked[0].name} (score ${ranked[0].score}/100).`, importance: 0 });
  }

  if (snap?.totalMktCapB) {
    items.push({ icon: 'ðŸŒ', text: `Capitalisation crypto mondiale : ${snap.totalMktCapB.toFixed(0)} milliards $.`, importance: 0 });
  }

  return items.sort((a, b) => b.importance - a.importance).slice(0, 3);
}

function renderBrief() {
  const container = $('brief-content');
  const tsEl      = $('brief-timestamp');
  if (!container) return;

  if (!state.settings.brief.enabled) {
    container.innerHTML = '<p class="next-refresh">Brief desactive.</p>';
    return;
  }

  const items = generateBrief();
  if (tsEl) tsEl.textContent = 'Mis a jour : ' + new Date().toLocaleTimeString('fr-FR');

  container.innerHTML = `<ol class="brief-list">${items.map((item, i) => `
    <li class="brief-item">
      <span class="brief-rank">${i + 1}</span>
      <span class="brief-icon">${item.icon}</span>
      <span class="brief-text">${item.text}</span>
    </li>`).join('')}</ol>`;
}

/* â”€â”€â”€ PDF export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function exportDiagnosticPdf() {
  if (!window.jspdf) {
    alert("La bibliotheque PDF n'est pas disponible. Verifiez votre connexion.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc    = new jsPDF({ unit: 'mm', format: 'a4' });
  const snap   = state.lastSnapshot;
  const ranked = state.lastRankedMarkets;
  const brief  = generateBrief();
  let y = 20;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Cap Patrimoine â€” Diagnostic', 14, y); y += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Genere le ' + new Date().toLocaleString('fr-FR'), 14, y); y += 10;

  // Brief
  doc.setFontSize(13); doc.setFont('helvetica', 'bold');
  doc.text('Brief du jour', 14, y); y += 7;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal');
  brief.forEach(item => {
    const lines = doc.splitTextToSize(item.icon + ' ' + item.text, 178);
    doc.text(lines, 14, y); y += lines.length * 6 + 2;
  }); y += 4;

  // Profile
  const form = $('advisor-form');
  if (form) {
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Votre profil', 14, y); y += 7;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    const fd = new FormData(form);
    const goalLabel    = document.querySelector('#goal option:checked')?.textContent    || '';
    const horizonLabel = document.querySelector('#horizon option:checked')?.textContent || '';
    doc.text(`Objectif : ${goalLabel}`, 14, y);         y += 6;
    doc.text(`Horizon : ${horizonLabel}`, 14, y);       y += 6;
    doc.text(`Risque : ${fd.get('risk')}/5`, 14, y);    y += 6;
    doc.text(`Liquidite : ${fd.get('liquidity')}/5`, 14, y); y += 6; y += 4;
  }

  // Top 3 markets
  if (ranked.length > 0) {
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Top 3 marches', 14, y); y += 7;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    ranked.slice(0, 3).forEach((m, i) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}. ${m.name}  (${m.score}/100)`, 14, y); y += 6;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(m.description, 172);
      doc.text(lines, 16, y); y += lines.length * 5 + 4;
    }); y += 2;
  }

  // Live snapshot
  if (snap) {
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Donnees de marche', 14, y); y += 7;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    if (snap.btcPrice)      { doc.text(`Bitcoin    : $${snap.btcPrice.toLocaleString('fr-FR')} (${(snap.btcChange24h || 0).toFixed(2)}% 24h)`, 14, y); y += 6; }
    if (snap.ethPrice)      { doc.text(`Ethereum   : $${snap.ethPrice.toLocaleString('fr-FR')} (${(snap.ethChange24h || 0).toFixed(2)}% 24h)`, 14, y); y += 6; }
    if (snap.eurusd)        { doc.text(`EUR/USD    : ${snap.eurusd.toFixed(4)}`, 14, y); y += 6; }
    if (snap.totalMktCapB)  { doc.text(`Cap. crypto: $${snap.totalMktCapB.toFixed(0)} Md`, 14, y); y += 6; }
    y += 4;
  }

  // Alerts
  if (state.alertFeed.length > 0) {
    doc.setFontSize(13); doc.setFont('helvetica', 'bold');
    doc.text('Alertes recentes', 14, y); y += 7;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    state.alertFeed.slice(0, 5).forEach(a => {
      const lines = doc.splitTextToSize(`[${a.time}] ${a.text}`, 178);
      doc.text(lines, 14, y); y += lines.length * 5 + 3;
    });
  }

  doc.save('cap-patrimoine-diagnostic.pdf');
}

/* â”€â”€â”€ Live data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function getLiveSnapshot() {
  const [cryptoRes, globalRes, fxRes] = await Promise.allSettled([
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true').then(r => r.json()),
    fetch('https://api.coingecko.com/api/v3/global').then(r => r.json()),
    fetch('https://api.frankfurter.app/latest?from=EUR&to=USD').then(r => r.json()),
  ]);

  const snap = { timestamp: Date.now() };

  if (cryptoRes.status === 'fulfilled') {
    const d = cryptoRes.value;
    snap.btcPrice    = d.bitcoin?.usd;
    snap.btcChange24h = d.bitcoin?.usd_24h_change;
    snap.ethPrice    = d.ethereum?.usd;
    snap.ethChange24h = d.ethereum?.usd_24h_change;
  }
  if (globalRes.status === 'fulfilled') {
    const d = globalRes.value?.data;
    snap.totalMktCapB = d?.total_market_cap?.usd / 1e9;
    snap.dominance    = d?.market_cap_percentage?.btc;
  }
  if (fxRes.status === 'fulfilled') {
    snap.eurusd = fxRes.value?.rates?.USD;
  }

  return snap;
}

function setLoadingState(loading) {
  const el = $('loading-status');
  if (el) el.hidden = !loading;
  const btn = $('refresh-now');
  if (btn) btn.disabled = loading;
}

async function refreshLiveData(label = 'Actualisation') {
  setLoadingState(true);
  const status = $('live-status');
  if (status) status.textContent = label + ' en cours...';

  try {
    const snap = await getLiveSnapshot();
    const prev = state.lastSnapshot;
    state.prevSnapshot = prev;
    state.lastSnapshot = snap;

    readAlertSettings();
    evaluateAlerts(snap, prev);
    recordHistory(snap, state.lastRankedMarkets);
    renderLiveMetrics(snap);
    renderSignals(snap);
    updateAdvisor();
    renderBrief();

    if (status) {
      const t = new Date(snap.timestamp).toLocaleTimeString('fr-FR');
      status.textContent = `Mis a jour a ${t} (CoinGecko + Frankfurter)`;
    }
    state.nextRefreshAt = Date.now() + parseInt($('refresh-interval')?.value || '5', 10) * 60 * 1000;
  } catch (err) {
    if (status) status.textContent = 'Erreur de chargement. Prochaine tentative automatique.';
    console.warn('[Cap Patrimoine] refreshLiveData:', err);
  } finally {
    setLoadingState(false);
  }
}

/* â”€â”€â”€ Auto-refresh + countdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function startAutoRefresh() {
  stopAutoRefresh();
  const mins = parseInt($('refresh-interval')?.value || '5', 10);
  state.nextRefreshAt = Date.now() + mins * 60 * 1000;
  state.autoTimerId = setInterval(() => refreshLiveData('Auto-actualisation'), mins * 60 * 1000);
  startCountdown();
}

function stopAutoRefresh() {
  clearInterval(state.autoTimerId);
  clearInterval(state.countdownTimerId);
  state.autoTimerId = state.countdownTimerId = null;
  const el = $('next-refresh');
  if (el) el.textContent = 'Actualisation automatique desactivee.';
}

function startCountdown() {
  clearInterval(state.countdownTimerId);
  state.countdownTimerId = setInterval(() => {
    if (!state.nextRefreshAt) return;
    const rem  = Math.max(0, state.nextRefreshAt - Date.now());
    const mins = Math.floor(rem / 60000);
    const secs = Math.floor((rem % 60000) / 1000);
    const el   = $('next-refresh');
    if (el) el.textContent = rem > 0
      ? `Prochaine actualisation dans ${mins}m ${String(secs).padStart(2, '0')}s`
      : 'Actualisation en cours...';
  }, 1000);
}

/* â”€â”€â”€ updateAdvisor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function updateAdvisor() {
  const p      = getFormData();
  const ranked = rankMarkets(p);
  state.lastRankedMarkets = ranked;
  renderSummary(ranked);
  renderRecommendations(ranked);
  renderComparisonTable(ranked);
}

/* â”€â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function loadPersistedData() {
  state.alertFeed = load(SK.alertFeed, []);
  state.history   = load(SK.history, []);
  state.sparkData = load(SK.sparkData, []);
  const savedAlert = load(SK.alertSettings, null);
  if (savedAlert) Object.assign(state.settings.alert, savedAlert);
  const savedBrief = load(SK.briefSettings, null);
  if (savedBrief) Object.assign(state.settings.brief, savedBrief);
}

function init() {
  loadPersistedData();
  applyAlertSettings();
  restoreProfileFromStorage();
  syncOutputs();
  renderIntelMacro();
  renderIntelInvestors();
  updateAdvisor();
  renderAlertFeed();
  renderHistory();
  drawSparklines();
  renderBrief();
  updateNotificationStatusText();

  // Form interactions
  const form = $('advisor-form');
  if (form) {
    form.addEventListener('submit', e => { e.preventDefault(); updateAdvisor(); scheduleProfileSave(); });
    form.addEventListener('input',  ()  => { syncOutputs(); updateAdvisor(); scheduleProfileSave(); });
  }

  // Live controls
  $('auto-refresh')?.addEventListener('change', e => e.target.checked ? startAutoRefresh() : stopAutoRefresh());
  $('refresh-interval')?.addEventListener('change', () => { if ($('auto-refresh')?.checked) startAutoRefresh(); });
  $('refresh-now')?.addEventListener('click', () => refreshLiveData('Actualisation manuelle'));

  // Alert controls
  $('smart-alerts')?.addEventListener('change', readAlertSettings);
  ['alert-btc-threshold', 'alert-eth-threshold', 'alert-cap-threshold',
   'alert-eurusd-high',   'alert-eurusd-low',    'alert-gold-high']
    .forEach(id => $(id)?.addEventListener('change', readAlertSettings));

  $('enable-notifications')?.addEventListener('click', async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
      updateNotificationStatusText();
    }
  });
  $('test-alert')?.addEventListener('click', () => {
    pushAlert('Ceci est une alerte de test â€” Cap Patrimoine surveille les marches pour vous.', 'info');
  });

  // History
  $('export-history')?.addEventListener('click', exportHistoryCsv);
  $('clear-history')?.addEventListener('click', () => {
    if (confirm('Vider tout l\'historique ?')) clearHistory();
  });

  // PDF
  $('export-pdf')?.addEventListener('click', exportDiagnosticPdf);

  // Profile reset
  $('reset-profile')?.addEventListener('click', () => {
    if (confirm('Reinitialiser le profil ?')) resetProfile();
  });

  // Brief
  $('brief-enabled')?.addEventListener('change', e => {
    state.settings.brief.enabled = e.target.checked;
    save(SK.briefSettings, state.settings.brief);
    renderBrief();
  });
  $('refresh-brief')?.addEventListener('click', renderBrief);

  // Sparkline resize
  window.addEventListener('resize', drawSparklines);

  // Start
  refreshLiveData('Initialisation');
  startAutoRefresh();
}

document.addEventListener('DOMContentLoaded', init);

