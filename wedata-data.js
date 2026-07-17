/* ==========================================================================
 EDIT HERE - PAGE TEXTS
 Change these labels if the page wording needs to evolve.
 ========================================================================== */

const pageTexts = {
  title: "Supervision & Consolidation Layer",
  subtitle: "Explore Filières or Business Lines content.",
  accessNote: "RF Filières users have full access; Business Lines users can access RF Filières and their own Business Line only.",
  stepOneLabel: "Entity",
  stepTwoLabel: "Data Domain",
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
  { label: "FRR", value: "frr" },
  { label: "Credit Risk", value: "credit_risk" },
  { label: "Finance", value: "finance" },
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
 If the selected entity is from Risk Finance Filieres, show groupDataDomains.
 If the selected entity is from Business Lines, the user can switch between:
 - Filiere: riskFinanceFilieres
 - Business Line: blDataDomains
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
  { label: "Finance", value: "finance" },
  { label: "Human Resources", value: "human_resources" },
  { label: "ALL", value: "all" }
];

/* ==========================================================================
 EDIT HERE - VIEW URL PATHS
 This is the main area to update when views are created in WeData.

 Do:
 - Fill only existing WeData URL paths, starting with /domain/.
 - Leave missing views empty or omit them. Missing views block navigation.
 - Use the technical keys from the arrays above.

 Do not:
 - Put the base URL here. Keep only the path and query string in each combination.
 - Change WEDATA_VIEW_BASE_URL unless the portal host changes.

 Examples:
 - Risk Finance Filiere page, FRR x Accounting Parameters:
 configuredGroupViews.frr.accounting_params

 - Business Line page, CARDIF x FRR:
 configuredBusinessLineFiliereViews.cardif.frr

 - Business Line page, CARDIF x Risk:
 configuredBlViews.cardif.risk
 ========================================================================== */

// EDIT HERE - Direct Filiere views.
// When a user clicks one of these filieres on step 1, the navigator opens the
// configured view directly instead of showing the Group Data Domain step.
const configuredFiliereDirectViews = {
  credit_risk: "/domain/019eb1c9-260a-77c3-adb2-45fec9afdfcb?view=019edf96-c0a5-7489-8f63-72a26abcf15b"
};

const filiereDirectMissingMessage = "View for '{entity}' no set yet . Working in progress";

const configuredGroupViews = {
  frr: {
    all: ""
  }
};

const configuredBusinessLineFiliereViews = {
  cardif: {
    frr: "",
    credit_risk: "/community/0199ce53-ce2b-723b-b8aa-aaf6052e45d4?tabbar=Assets&view=019edfc0-a6be-747f-8714-be446ec9c829"
  }
};

const configuredBlViews = {
  cardif: {
    risk: "/domain/019eda2b-9567-72fb-9d2f-5c4463115d38?view=019edfae-e79a-7056-b5f2-975cb5a9614c",
    finance: "/domain/019eda27-fe8a-74d5-985b-1dc559722ac0?view=019ee00b-52ea-7128-b19f-52a1632a8198",
    all: "/domain/019eda2b-9567-72fb-9d2f-5c4463115d38?view=019eda2d-3340-7383-b553-c45962c431c2"
  }
};

/* ==========================================================================
 DO NOT EDIT BELOW
 Unless you are changing the navigator behavior, routing, or UI contract.
 ========================================================================== */

const WEDATA_VIEW_BASE_URL = "https://wedata.staging.echonet";

const navigationGroups = [
  { title: "Risk Finance Filieres", type: "risk", items: riskFinanceFilieres },
  { title: "Business Lines", type: "business", items: businessLines }
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

const groupViewMatrix = createViewMatrix(riskFinanceFilieres, groupDataDomains, configuredGroupViews);
const businessLineFiliereViewMatrix = createViewMatrix(businessLines, riskFinanceFilieres, configuredBusinessLineFiliereViews);
const blViewMatrix = createViewMatrix(businessLines, blDataDomains, configuredBlViews);

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
  filiereDirectViews: configuredFiliereDirectViews,
  filiereDirectMissingMessage,
  domainFlows: {
    risk: {
      stepTwoLabel: "Group Data Domain",
      stepTwoTitle: "Choose a Group Data Domain",
      stepTwoHelp: "The selected combination will open the matching WeData view.",
      domains: groupDataDomains,
      matrix: groupViewMatrix,
      missingMessage: "View for '{entity} / {domain}' no set yet . Working in progress"
    },
    business: {
      defaultMode: "businessLine",
      modes: {
        filiere: {
          label: "Filiere",
          stepTwoLabel: "Filiere",
          stepTwoTitle: "Choose a Filiere",
          stepTwoHelp: "The selected combination will open the matching Business Line content organized by filiere.",
          domains: riskFinanceFilieres,
          matrix: businessLineFiliereViewMatrix,
          missingMessage: "View for '{entity} / {domain}' no set yet . Working in progress"
        },
        businessLine: {
          label: "Business Line",
          stepTwoLabel: "BL Data Domain",
          stepTwoTitle: "Choose a BL Data Domain",
          stepTwoHelp: "The selected combination will open the matching Business Line WeData view.",
          domains: blDataDomains,
          matrix: blViewMatrix,
          missingMessage: "View for '{entity} / {domain}' no set yet . Working in progress"
        }
      }
    }
  }
};
