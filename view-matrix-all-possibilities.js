/*
  WeData Navigator - complete view matrix templates

  Usage:
  - Fill each value with the WeData global-view UUID.
  - Leave a value empty ("") when the combination has no view yet.
  - Copy the needed values into assets/js/wedata-data.js.

  Final URL is built in index.html as:
  window.location.origin + "/global-view?view=" + viewId
*/

const GROUP_VIEW_MATRIX_ALL_POSSIBILITIES = {
  frr: {
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
    all: ""
  },
  credit_risk: {
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
    all: ""
  },
  perf_mgmt: {
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
    all: ""
  },
  almt: {
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
    all: ""
  },
  operational_risk: {
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
    all: ""
  },
  market_cpty: {
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
    all: ""
  },
  insurance_risk: {
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
    all: ""
  },
  internal_capital: {
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
    all: ""
  },
  regulatory_cap: {
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
    all: ""
  },
  stress_testing: {
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
    all: ""
  },
  bcef: {
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
    all: ""
  },
  bnl: {
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
    all: ""
  },
  bpls: {
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
    all: ""
  },
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
  },
  cib: {
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
    all: ""
  },
  fortis: {
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
    all: ""
  },
  wm: {
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
    all: ""
  },
  em: {
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
    all: ""
  },
  nickel: {
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
    all: ""
  },
  pf: {
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
    all: ""
  },
  arval: {
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
    all: ""
  },
  floa: {
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
    all: ""
  },
  real_estate: {
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
    all: ""
  }
};

const BL_VIEW_MATRIX_ALL_POSSIBILITIES = {
  bcef: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  bnl: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  bpls: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  cardif: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  cib: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  fortis: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  wm: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  em: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  nickel: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  pf: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  arval: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  floa: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  },
  real_estate: {
    actuariat: "",
    asset_management: "",
    compliance: "",
    privacy_protection: "",
    risk: "",
    human_resources: "",
    all: ""
  }
};
