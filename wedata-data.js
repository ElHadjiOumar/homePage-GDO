/*
  data

  The Selection opens WeData global views with:
  window.location.origin + "/global-view?view=" + viewUuid
  the code will now if you are in dev , stagging or prod
*/

/* ==========================================================================
   EDIT HERE - PAGE TEXTS
   Change these labels if the page wording needs to evolve.
   ========================================================================== */

const pageTexts = {
  group: {
    title: "Group Data Domains",
    subtitle: "Select an entity, then choose the Group Data Domain you want to access.",
    stepTwoLabel: "Group Data Domain",
    stepTwoTitle: "Choose a Group Data Domain",
    stepTwoHelp: "The selected combination will open the matching WeData view.",
    missingMessage: "No WeData view is configured yet for {entity} / {domain}. Please choose another Group Data Domain or contact the WeData team."
  },
  bl: {
    title: "BL Data Domains",
    subtitle: "Select an entity, then choose the local BL Data Domain you want to access.",
    stepTwoLabel: "BL Data Domain",
    stepTwoTitle: "Choose a BL Data Domain",
    stepTwoHelp: "The selected combination will open the matching Business Line WeData view.",
    missingMessage: "No Business Line view is configured yet for {entity} / {domain}. Please choose another BL Data Domain or contact the WeData team."
  }
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
  { label: "FRR", value: "frr" },
  { label: "Credit Risk", value: "credit_risk" },
  { label: "Performance Management", value: "perf_mgmt" },
  { label: "ALMT", value: "almt" },
  { label: "Operational Risk", value: "operational_risk" },
  { label: "Market & Counterparty", value: "market_cpty" },
  { label: "Insurance Risk", value: "insurance_risk" },
  { label: "Internal Capital & IFRS9", value: "internal_capital" },
  { label: "Regulatory Capital", value: "regulatory_cap" },
  { label: "Stress Testing", value: "stress_testing" }
];

const businessLines = [
  { label: "BCEF", value: "bcef" },
  { label: "BNL", value: "bnl" },
  { label: "BPLS", value: "bpls" },
  { label: "CARDIF", value: "cardif" },
  { label: "CIB", value: "cib", badge: "In WeData" },
  { label: "FORTIS", value: "fortis" },
  { label: "WM", value: "wm", badge: "In WeData" },
  { label: "EM", value: "em" },
  { label: "NICKEL", value: "nickel" },
  { label: "PF", value: "pf", badge: "In WeData" },
  { label: "ARVAL", value: "arval", badge: "In WeData" },
  { label: "FLOA", value: "floa" },
  { label: "REAL ESTATE", value: "real_estate" }
];

/* ==========================================================================
   EDIT HERE - STEP 2 OPTIONS
   Group page uses groupDataDomains.
   BL page uses blDataDomains.
   ========================================================================== */

const groupDataDomains = [
  { label: "Accounting Parameters", value: "accounting_params" },
  { label: "BNPP Entities", value: "bnpp_entities" },
  { label: "Counterparties", value: "counterparties" },
  { label: "Counterparties Risk Parameters", value: "cpty_risk_params" },
  { label: "Credit Lines & Financial Liabilities", value: "credit_lines" },
  { label: "Credit Protections", value: "credit_protections" },
  { label: "Credit Risk Parameters", value: "credit_risk_params" },
  { label: "Market Risk Parameters", value: "market_risk_params" },
  { label: "Operational Risk Parameters", value: "op_risk_params" },
  { label: "Securities Parameters", value: "securities_params" },
  { label: "Securization Parameters", value: "securization_params" },
  { label: "ALL", value: "all" }
];

const blDataDomains = [
  { label: "Actuariat", value: "actuariat" },
  { label: "Asset Management", value: "asset_management" },
  { label: "Compliance", value: "compliance" },
  { label: "Privacy & Protection", value: "privacy_protection" },
  { label: "Risk", value: "risk" },
  { label: "Human Resources", value: "human_resources" },
  { label: "ALL", value: "all" }
];

/* ==========================================================================
   EDIT HERE - VIEW UUIDS
   This is the main area to update when views are created in WeData.

   Do:
   - Fill only existing view UUIDs.
   - Leave missing views empty or omit them. Missing views block navigation.
   - Use the technical keys from the arrays above.

   Do not:
   - Put full URLs here.
   - Change WEDATA_VIEW_PATH unless the portal route changes.

   Examples:
   - Group page, CARDIF x ALL:
     configuredGroupViews.cardif.all

   - BL page, CARDIF x Risk:
     configuredBlViews.cardif.risk
   ========================================================================== */

const configuredGroupViews = {
  cardif: {
    all: "019d33f-cab7-7195-84e9-6d4ad7795e97"
  }
};

const configuredBlViews = {
  cardif: {
    all: ""
  }
};

/* ==========================================================================
   DO NOT EDIT BELOW
   Unless you are changing the navigator behavior, routing, or UI contract.
   ========================================================================== */

const WEDATA_VIEW_PATH = "/global-view?view=";
const WEDATA_SEARCH_PATH = "../../search?q=";

const allNavigationEntities = [
  ...riskFinanceFilieres,
  ...businessLines
];

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

const groupViewMatrix = createViewMatrix(allNavigationEntities, groupDataDomains, configuredGroupViews);
const blViewMatrix = createViewMatrix(allNavigationEntities, blDataDomains, configuredBlViews);

const sharedStepOneConfig = {
  stepOneLabel: "Entity",
  stepOneTitle: "Choose an entity",
  stepOneHelp: "",
  selectedLabel: "Selected entity",
  groups: [
    { title: "Risk Finance Filieres", type: "risk", items: riskFinanceFilieres },
    { title: "Business Lines", type: "business", items: businessLines }
  ]
};

const WEDATA_NAVIGATORS = {
  group: {
    ...sharedStepOneConfig,
    ...pageTexts.group,
    domains: groupDataDomains,
    matrix: groupViewMatrix
  },
  bl: {
    ...sharedStepOneConfig,
    ...pageTexts.bl,
    domains: blDataDomains,
    matrix: blViewMatrix
  }
};
