/* GUIDE DE MAINTENANCE
 * index.html : structure de la page ; wedata.css : apparence et responsive.
 * Ce fichier : textes, listes et liens. wedata-ui.js : reactions aux clics.
 * Pour ajouter un lien : chercher configuredFiliereContentViews (RF) ou configuredBusinessLineContentViews (BL).
 * Pour les regions : chercher configuredBusinessLineScopeContentViews.
 * label = nom affiche ; value = identifiant utilise pour retrouver les liens.
 * Garder les value stables lors d'un simple changement de nom.
 */

/* ==========================================================================
 EDIT HERE - PAGE TEXTS
 Change these labels if the page wording needs to evolve.
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
 EDIT HERE - STEP 1 OPTIONS
 Add, remove or rename Risk Finance Filieres and Business Lines here.

 Rules:
 - label: text shown on the card.
 - value: stable technical key used in the view matrices. Keep it lowercase.
 - badge: optional small label shown on the card.
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

// Seules ces BL demandent un perimetre avant de proposer les quatre contenus.
// La cle technique global conserve ses liens ; le bouton affiche le nom de la BL.
const businessLineScopes = {
  cibgb: [
    { label: "CIBGB", value: "global" },
    { label: "EMEA", value: "emea" },
    { label: "APAC", value: "apac" },
    { label: "NAR", value: "nar" },
    { label: "Germany", value: "germany" }
  ],
  cibgm: [
    { label: "CIBGM", value: "global" },
    { label: "EMEA", value: "emea" },
    { label: "APAC", value: "apac" },
    { label: "NAR", value: "nar" },
    { label: "Germany", value: "germany" }
  ],
  cib2s: [
    { label: "CIB2S", value: "global" },
    { label: "EMEA", value: "emea" },
    { label: "APAC", value: "apac" },
    { label: "Germany", value: "germany" }
  ]
};

// Chaque couple BL / perimetre possede quatre liens distincts.
// Exemple : configuredBusinessLineScopeContentViews.cibgb.emea.quality_rules.
// Un champ vide affiche le message d'erreur existant ; aucun lien de repli Global.
const configuredBusinessLineScopeContentViews = {
  cibgb: {
    global: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    emea: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    apac: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    nar: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    germany: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" }
  },
  cibgm: {
    global: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    emea: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    apac: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    nar: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    germany: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" }
  },
  cib2s: {
    global: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    emea: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    apac: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" },
    germany: { business_dictionary: "", quality_rules: "", data_labeling: "", quality_issues: "" }
  }
};

/* ==========================================================================
 EDIT HERE - VIEW URL PATHS
 This is the main area to update when views are created in WeData.

 Do:
 - Fill only existing WeData URL paths, starting with /domain/ or /community/.
 - Leave missing views empty or omit them. Missing views block navigation.
 - Use the technical keys from the arrays above.

 Do not:
 - Put the base URL here. Keep only the path and query string in each combination.
 - Change WEDATA_VIEW_BASE_URL unless the portal host changes.

 Examples:
 - Risk Finance Filiere page, Credit Risk x Data Quality Rules:
 configuredFiliereContentViews.credit_risk.quality_rules

 - Business Line page, BCEF x Data Quality Rules:
 configuredBusinessLineContentViews.bcef.quality_rules
 ========================================================================== */

// EDIT HERE - Risk Finance Filiere content links.
// Add paths per filiere using these four keys. Empty links show the existing error message.
// Example: credit_risk: { business_dictionary: "/domain/...?...", ... }
// The previous direct Credit Risk URL is kept here for reference only until its
// content type is confirmed: /domain/019eb1c9-260a-77c3-adb2-45fec9afdfcb?view=019edf96-c0a5-7489-8f63-72a26abcf15b
// Les deux sections affichent exactement les memes quatre contenus.
const contentTypes = [
  { label: "Business Data Dictionary", value: "business_dictionary" },
  { label: "Data Quality Rules", value: "quality_rules" },
  { label: "Data Labeling", value: "data_labeling" },
  { label: "Data Quality Issues Register", value: "quality_issues" }
];

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

// EDIT HERE - Quatre liens propres a chaque Business Line.
// Copier bcef pour une autre BL et remplacer la cle par sa value (ex. cardif).
// Ne pas reutiliser automatiquement les anciennes vues par domaine : leur
// correspondance avec les quatre contenus doit etre confirmee.
const configuredBusinessLineContentViews = {
  bcef: {
    business_dictionary: "",
    quality_rules: "",
    data_labeling: "",
    quality_issues: ""
  }
};

// Anciennes URL CARDIF par domaine, conservees uniquement comme reference.
// Elles ne sont pas utilisees par le nouveau parcours.
/*
const configuredBlViews = {
  cardif: {
    risk: "/domain/019eda2b-9567-72fb-9d2f-5c4463115d38?view=019edfae-e79a-7056-b5f2-975cb5a9614c",
    finance: "/domain/019eda27-fe8a-74d5-985b-1dc559722ac0?view=019ee00b-52ea-7128-b19f-52a1632a8198",
    all: "/domain/019eda2b-9567-72fb-9d2f-5c4463115d38?view=019eda2d-3340-7383-b553-c45962c431c2"
  }
};
*/

/* ==========================================================================
 DO NOT EDIT BELOW
 Unless you are changing the navigator behavior, routing, or UI contract.
 ========================================================================== */

const WEDATA_VIEW_BASE_URL = "https://wedata.staging.echonet";

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
