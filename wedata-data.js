/* GUIDE DE MAINTENANCE
 * Ce fichier contient les textes, les listes et les liens du navigateur.
 * Les sections 1 a 5 sont les zones de configuration ; la section 6 les assemble.
 *
 * label : texte affiche sur une carte. value : cle technique utilisee pour les liens.
 * Conserver les value lors d'un changement de libelle.
 * Pour ajouter une entite, copier une entree et utiliser une value unique.
 *
 * Pour renseigner un lien, remplacer "" par un chemin WeData existant, par exemple
 * "/domain/IDENTIFIANT?view=IDENTIFIANT_VUE" ou "/community/IDENTIFIANT?view=...".
 * Le serveur commun est defini en section 6. Un lien vide conserve le message
 * d'erreur actuel ; il ne desactive pas la carte.
 */

/* ==========================================================================
 1. TEXTES DE LA PAGE

 Modifier ici les titres et textes visibles dans la page.
 ========================================================================== */

const pageTexts = {
  title: "Supervision & Consolidation Layer",
  subtitle: "Explore Filières or Business Lines content.",
  accessNote: "RF Filières users have full access; Business Lines users can access RF Filières and their own Business Line only.",
  stepOneLabel: "Entity",
  stepTwoLabel: "Content",
  stepOneTitle: "Choose an entity",
  stepOneHelp: "",
  selectedLabel: "Selected entity"
};

/* ==========================================================================
 2. LES QUATRE CONTENUS COMMUNS

 Ces quatre cartes sont communes aux filieres et aux Business Lines.
 Les noms sont partages, mais chaque entite possede ses propres URL.
 ========================================================================== */

const contentTypes = [
  { label: "Business Data Dictionary", value: "business_dictionary" },
  { label: "Data Quality Rules", value: "quality_rules" },
  { label: "Data Labeling", value: "data_labeling" },
  { label: "Data Quality Issues Register", value: "quality_issues" }
];

/* ==========================================================================
 3. FILIERES : LISTE PUIS LIENS

 La liste definit les 13 cartes de la section Risk Finance Filieres.
 Les liens se renseignent dans configuredFiliereContentViews, juste apres la liste.
 ========================================================================== */

const riskFinanceFilieres = [
  { label: "Accounting & Financial Reporting", value: "accounting_financial_reporting" },
  { label: "ALMT", value: "almt" },
  { label: "Credit Risk", value: "credit_risk" },
  { label: "ESG", value: "esg" },
  { label: "Insurance Risk", value: "insurance_risk" },
  { label: "Liquidity Reporting", value: "liquidity_reporting" },
  { label: "Market & Counterparty", value: "market_cpty" },
  { label: "Modelling & Backtesting", value: "modelling_backtesting" },
  { label: "Operational Risk", value: "operational_risk" },
  { label: "Performance Management", value: "perf_mgmt" },
  { label: "Regulatory Capital Reporting", value: "regulatory_cap" },
  { label: "Resolution Reporting", value: "resolution_reporting" },
  { label: "Stress Testing", value: "stress_testing" }
];

// Copier credit_risk pour une autre filiere et utiliser sa value (ex. almt).
// Exemple : configuredFiliereContentViews.credit_risk.quality_rules.
const configuredFiliereContentViews = {
  // Exemple : remplacer "" par "/domain/IDENTIFIANT?view=IDENTIFIANT_VUE".
  // Pour une autre filiere, copier credit_risk et utiliser sa value (ex. almt).
  // Chaque filiere peut avoir quatre URL differentes. Un champ vide declenche
  // le message d'erreur existant, sans ouvrir de nouvel onglet.
  credit_risk: {
    business_dictionary: "",
    quality_rules: "",
    data_labeling: "",
    quality_issues: ""
  }
};

/* ==========================================================================
 4. BUSINESS LINES : LISTE PUIS LIENS DES BL SIMPLES

 Garder la liste dans l'ordre alphabetique.
 Les BL simples ouvrent directement les quatre contenus.
 CIB2S, CIBGB et CIBGM utilisent les perimetres et les liens de la section 5.
 ========================================================================== */

const businessLines = [
  { label: "Arval", value: "arval" },
  { label: "BCEF", value: "bcef" },
  { label: "BGL", value: "bgl" },
  { label: "BNL", value: "bnl" },
  { label: "BPLS", value: "bpls" },
  { label: "Cardif", value: "cardif" },
  { label: "CIB2S", value: "cib2s" },
  { label: "CIBGB", value: "cibgb" },
  { label: "CIBGM", value: "cibgm" },
  { label: "EM", value: "em" },
  { label: "Factoring", value: "factoring" },
  { label: "FLOA", value: "floa" },
  { label: "Fortis", value: "fortis" },
  { label: "Nickel", value: "nickel" },
  { label: "PF", value: "pf" },
  { label: "PI", value: "pi" },
  { label: "Wealth Management", value: "wm" }
];

// Copier bcef pour une autre BL simple et utiliser sa value (ex. arval).
// Exemple : configuredBusinessLineContentViews.bcef.quality_rules.
// Ne pas renseigner ici les liens des BL regionales : utiliser la section 5.
const configuredBusinessLineContentViews = {
  bcef: {
    business_dictionary: "",
    quality_rules: "",
    data_labeling: "",
    quality_issues: ""
  }
};

/* ==========================================================================
 5. BL REGIONALES : PERIMETRES PUIS LIENS

 Seules les BL de businessLineScopes demandent un choix de perimetre.
 La cle global correspond au bouton portant le nom de la BL (ex. CIBGB).
 CIB2S ne comporte pas de perimetre NAR.
 ========================================================================== */

const businessLineScopes = {
  cibgb: [
    { label: "CIBGB", value: "global" },
    { label: "CIBGB EMEA", value: "emea" },
    { label: "CIBGB APAC", value: "apac" },
    { label: "CIBGB NAR", value: "nar" },
    { label: "CIBGB Germany", value: "germany" }
  ],
  cibgm: [
    { label: "CIBGM", value: "global" },
    { label: "CIBGM EMEA", value: "emea" },
    { label: "CIBGM APAC", value: "apac" },
    { label: "CIBGM NAR", value: "nar" },
    { label: "CIBGM Germany", value: "germany" }
  ],
  cib2s: [
    { label: "CIB2S", value: "global" },
    { label: "CIB2S EMEA", value: "emea" },
    { label: "CIB2S APAC", value: "apac" },
    { label: "CIB2S Germany", value: "germany" }
  ]
};

// Chaque couple BL / perimetre possede quatre liens independants.
// Exemple : configuredBusinessLineScopeContentViews.cibgb.emea.quality_rules.
// Un lien regional vide ne reprend jamais le lien du perimetre global.
const configuredBusinessLineScopeContentViews = {
  cibgb: {
    global: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    emea: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    apac: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    nar: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    germany: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    }
  },
  cibgm: {
    global: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    emea: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    apac: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    nar: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    germany: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    }
  },
  cib2s: {
    global: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    emea: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    apac: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    },
    germany: {
      business_dictionary: "",
      quality_rules: "",
      data_labeling: "",
      quality_issues: ""
    }
  }
};

/* ==========================================================================
 6. CONFIGURATION TECHNIQUE

 Modifier WEDATA_VIEW_BASE_URL uniquement si le serveur WeData change.
 Le reste assemble les donnees ci-dessus pour wedata-ui.js.
 Il n'est pas necessaire de modifier cette partie pour ajouter des liens.
 ========================================================================== */

const WEDATA_VIEW_BASE_URL = "https://wedata.group.echonet";

const navigationGroups = [
  { title: "Risk Finance Filieres", type: "risk", items: riskFinanceFilieres },
  { title: "Business Lines", type: "business", items: businessLines }
];

// Construit une table de recherche : table[entite][contenu] = chemin du lien.
// Les combinaisons absentes deviennent "" pour utiliser le meme traitement d'erreur.
function createViewMatrix(entities, domains, configuredViews) {
  return entities.reduce((matrix, entity) => {
    const entityViews = configuredViews[entity.value] || {};

    matrix[entity.value] = domains.reduce((views, domain) => {
      views[domain.value] = entityViews[domain.value] || "";
      return views;
    }, {});

    return matrix;
  }, {});
}

// Configuration lue par wedata-ui.js : les BL regionales ajoutent un choix de perimetre.
const WEDATA_NAVIGATOR = {
  title: pageTexts.title,
  subtitle: pageTexts.subtitle,
  accessNote: pageTexts.accessNote,
  stepOneLabel: pageTexts.stepOneLabel,
  stepTwoLabel: pageTexts.stepTwoLabel,
  stepOneTitle: pageTexts.stepOneTitle,
  stepOneHelp: pageTexts.stepOneHelp,
  selectedLabel: pageTexts.selectedLabel,
  groups: navigationGroups,
  businessLineScopes,
  scopeContentViews: configuredBusinessLineScopeContentViews,
  domainFlows: {
    risk: {
      stepTwoLabel: "Content",
      stepTwoTitle: "Choose content to explore",
      stepTwoHelp: "Choose a content type to open its WeData view in a new tab.",
      domains: contentTypes,
      matrix: createViewMatrix(riskFinanceFilieres, contentTypes, configuredFiliereContentViews),
      missingMessage: "View for '{entity} / {domain}' no set yet . Working in progress"
    },
    business: {
      stepTwoLabel: "Content",
      stepTwoTitle: "Choose content to explore",
      stepTwoHelp: "Choose a content type to open its WeData view in a new tab.",
      domains: contentTypes,
      matrix: createViewMatrix(businessLines, contentTypes, configuredBusinessLineContentViews),
      missingMessage: "View for '{entity} / {domain}' no set yet . Working in progress"
    }
  }
};
