/*
  WeData Navigator data

  This prototype navigates to WeData views, not to mock data concept tables.
  Fill the matrices with global-view UUIDs only. Empty values block navigation
  and show a clear message to the user.
*/

const WEDATA_VIEW_PATH = "/global-view?view=";
const WEDATA_SEARCH_PATH = "../../search?q=";

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

/*
  GROUP USER MATRIX
  Format: groupViewMatrix[entity][groupDataDomain] = "view UUID"

  Example:
  CARDIF x ALL is groupViewMatrix.cardif.all
*/
const groupViewMatrix = {
  cardif: {
    accounting_params: "",
    bnpp_entities: "",
    counterparties: "",
    cpty_risk_params: "",
    credit_lines: "",
    credit_protections: "",
    credit_risk_params: "",
    market_risk_params: "",
    op_risk_params: "",
    securities_params: "",
    securization_params: "",
    all: "019d33f-cab7-7195-84e9-6d4ad7795e97"
  }
};

/*
  BUSINESS LINE USER MATRIX
  Format: blViewMatrix[businessLine][blDataDomain] = "view UUID"

  Example:
  CARDIF x ALL is blViewMatrix.cardif.all
*/
const blViewMatrix = {
  cardif: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  }
};

const WEDATA_NAVIGATORS = {
  group: {
    eyebrow: "Internal navigation",
    title: "WeData Navigator",
    subtitle: "Select an entity, then choose the Group Data Domain you want to access.",
    stepOneLabel: "Entity",
    stepTwoLabel: "Group Data Domain",
    stepOneTitle: "Choose an entity",
    stepOneHelp: "Risk Finance Filieres and Business Lines are grouped to keep the selection easy to scan.",
    stepTwoTitle: "Choose a Group Data Domain",
    stepTwoHelp: "The selected combination will open the matching WeData view.",
    selectedLabel: "Selected entity",
    groups: [
      { title: "Risk Finance Filieres", type: "risk", items: riskFinanceFilieres },
      { title: "Business Lines", type: "business", items: businessLines }
    ],
    domains: groupDataDomains,
    matrix: groupViewMatrix,
    missingMessage: "No WeData view is configured yet for {entity} / {domain}. Please choose another Group Data Domain or contact the WeData team."
  },
  bl: {
    eyebrow: "Business Line navigation",
    title: "WeData Navigator",
    subtitle: "Select a Business Line, then choose the local BL Data Domain you want to access.",
    stepOneLabel: "Business Line",
    stepTwoLabel: "BL Data Domain",
    stepOneTitle: "Choose a Business Line",
    stepOneHelp: "Select the Business Line context before opening a local BL Data Domain view.",
    stepTwoTitle: "Choose a BL Data Domain",
    stepTwoHelp: "The selected combination will open the matching Business Line WeData view.",
    selectedLabel: "Selected Business Line",
    groups: [
      { title: "Business Lines", type: "business", items: businessLines }
    ],
    domains: blDataDomains,
    matrix: blViewMatrix,
    missingMessage: "No Business Line view is configured yet for {entity} / {domain}. Please choose another BL Data Domain or contact the WeData team."
  }
};
