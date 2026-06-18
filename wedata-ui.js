(function () {
  const state = {
    step: 1,
    selectedEntity: null,
    selectedDomain: null,
    selectedContentMode: null
  };

  const config = WEDATA_NAVIGATOR;
  let entityByValue;

  function initWeDataNavigator() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initWeDataNavigator, { once: true });
      return;
    }

    entityByValue = createEntityLookup(config.groups);

    setStaticText();
    bindEvents();
    render();
  }

  function createEntityLookup(groups) {
    return groups.reduce((lookup, group) => {
      group.items.forEach(item => {
        lookup[item.value] = { ...item, entityType: group.type };
      });
      return lookup;
    }, {});
  }

  function createLookup(items) {
    return items.reduce((lookup, item) => {
      lookup[item.value] = item;
      return lookup;
    }, {});
  }

  function setStaticText() {
    text("navigatorTitle", config.title);
    text("navigatorSubtitle", config.subtitle);
    text("stepOneText", config.stepOneLabel);
    text("stepTwoText", config.stepTwoLabel);
    text("entityTitle", config.stepOneTitle);
    text("entityHelp", config.stepOneHelp);
    toggleClass("entityHelp", "hidden", !config.stepOneHelp);
    text("contextLabel", config.selectedLabel);
  }

  function bindEvents() {
    on("backButton", "click", () => goToStep(1));
    on("changeEntityButton", "click", () => goToStep(1));
    on("accessButton", "click", accessDestination);
    on("searchForm", "submit", submitSearch);
    on("modeSwitch", "click", event => {
      const button = event.target.closest("[data-mode]");
      if (button) selectContentMode(button.dataset.mode);
    });
  }

  function on(id, eventName, handler) {
    const element = byId(id);
    if (element) element.addEventListener(eventName, handler);
  }

  function toggleClass(id, className, force) {
    const element = byId(id);
    if (element) element.classList.toggle(className, force);
  }

  function getOrCreateContainer(id, fallbackId, className) {
    let element = byId(id);
    if (element) return element;

    const fallback = byId(fallbackId) || document.body;
    if (!fallback) return null;

    element = document.createElement("div");
    element.id = id;
    if (className) element.className = className;
    fallback.appendChild(element);
    return element;
  }

  function render() {
    const selectedEntity = entityByValue[state.selectedEntity];
    const selectedDomain = getSelectedDomain();
    const isStepTwo = state.step === 2;
    const flow = getSelectedFlow();
    const isBusinessLine = selectedEntity && selectedEntity.entityType === "business";

    toggleClass("entityStep", "hidden", isStepTwo);
    toggleClass("domainStep", "hidden", !isStepTwo);

    toggleClass("stepIndicatorEntity", "is-active", !isStepTwo);
    toggleClass("stepIndicatorEntity", "is-complete", isStepTwo);
    toggleClass("stepIndicatorDomain", "is-active", isStepTwo);
    toggleClass("stepConnector", "is-complete", isStepTwo);

    const accessButton = byId("accessButton");
    if (accessButton) accessButton.disabled = !state.selectedDomain;

    text("selectedEntityLabel", selectedEntity ? selectedEntity.label : "-");
    text("entitySelectionPill", selectedEntity ? `Selected: ${selectedEntity.label}` : "");
    toggleClass("entitySelectionPill", "hidden", !selectedEntity || isStepTwo);

    text("stepTwoText", flow ? flow.stepTwoLabel : config.stepTwoLabel);
    text("domainTitle", flow ? flow.stepTwoTitle : "");
    text("domainHelp", flow ? flow.stepTwoHelp : "");
    text("accessButtonText", selectedDomain ? "Access " + selectedDomain.label : "Access");
    renderModeSwitch(isStepTwo && isBusinessLine);

    renderEntityGroups();
    if (isStepTwo) renderDomains();
  }

  function renderModeSwitch(isVisible) {
    const switchEl = byId("modeSwitch");
    if (!switchEl) return;
    switchEl.classList.toggle("hidden", !isVisible);

    if (!isVisible) return;

    switchEl.querySelectorAll("[data-mode]").forEach(button => {
      const isActive = button.dataset.mode === state.selectedContentMode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderEntityGroups() {
    const root = getOrCreateContainer("entityGroups", "entityStep", "entity-groups");
    if (!root) return;
    root.innerHTML = "";

    config.groups.forEach(group => {
      const section = document.createElement("section");
      section.className = "group-block";
      section.innerHTML = `
 <div class="group-header">
 <h3 class="group-title ${group.type === "business" ? "is-green" : ""}">${escapeHtml(group.title)}</h3>
 </div>
 `;

      const grid = document.createElement("div");
      grid.className = "card-grid";
      group.items.forEach(item => {
        grid.appendChild(createChoiceCard(item, {
          variant: group.type,
          selectedValue: state.selectedEntity,
          onSelect: selectEntity
        }));
      });

      section.appendChild(grid);
      root.appendChild(section);
    });
  }

  function renderDomains() {
    const root = getOrCreateContainer("domainGrid", "domainStep", "card-grid domain-grid");
    const flow = getSelectedFlow();

    if (!root) return;
    root.innerHTML = "";
    if (!flow) return;

    flow.domains.forEach(domain => {
      root.appendChild(createChoiceCard(domain, {
        variant: "domain",
        selectedValue: state.selectedDomain,
        onSelect: selectDomain
      }));
    });
  }

  function createChoiceCard(item, options) {
    const button = document.createElement("button");
    const isSelected = options.selectedValue === item.value;

    button.type = "button";
    button.className = `choice-card is-${options.variant}${isSelected ? " is-selected" : ""}`;
    button.dataset.value = item.value;
    button.setAttribute("aria-pressed", String(isSelected));
    button.innerHTML = `
 <span class="card-text">
 <span class="card-label">${escapeHtml(item.label)}</span>
 ${item.badge ? `<span class="card-badge">${escapeHtml(item.badge)}</span>` : ""}
 </span>
 <span class="checkmark" aria-hidden="true">&#10003;</span>
 `;

    button.addEventListener("click", () => options.onSelect(item.value));
    return button;
  }

  function selectEntity(entityValue) {
    state.selectedEntity = entityValue;
    state.selectedDomain = null;
    state.selectedContentMode = getDefaultContentMode(entityValue);
    state.step = 2;
    hideFeedback();
    render();
  }

  function selectContentMode(mode) {
    if (mode === state.selectedContentMode) return;
    state.selectedContentMode = mode;
    state.selectedDomain = null;
    hideFeedback();
    render();
  }

  function selectDomain(domainValue) {
    state.selectedDomain = domainValue;
    hideFeedback();
    render();
    accessDestination();
  }

  function goToStep(stepNumber) {
    state.step = stepNumber;
    hideFeedback();
    render();
  }

  function getSelectedFlow() {
    const selectedEntity = entityByValue[state.selectedEntity];
    if (!selectedEntity) return null;

    const flow = config.domainFlows[selectedEntity.entityType];
    if (!flow) return null;

    if (flow.modes) {
      return flow.modes[state.selectedContentMode || flow.defaultMode];
    }

    return flow;
  }

  function getDefaultContentMode(entityValue) {
    const selectedEntity = entityByValue[entityValue];
    const flow = selectedEntity && config.domainFlows[selectedEntity.entityType];
    return flow && flow.modes ? flow.defaultMode : null;
  }



  function getSelectedDomain() {
    const flow = getSelectedFlow();
    if (!flow || !state.selectedDomain) return null;
    return createLookup(flow.domains)[state.selectedDomain];
  }

  function getDestinationUrl() {
    const flow = getSelectedFlow();
    if (!flow || !state.selectedEntity || !state.selectedDomain) return null;

    const viewId = flow.matrix[state.selectedEntity] && flow.matrix[state.selectedEntity][state.selectedDomain];
    return viewId ? buildViewUrl(viewId) : null;
  }

  function buildViewUrl(viewPath) {
    const baseUrl = typeof WEDATA_VIEW_BASE_URL === "string" ? WEDATA_VIEW_BASE_URL : "";
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    if (/^https?:\/\//.test(viewPath)) return viewPath;
    return normalizedBaseUrl + (viewPath.startsWith("/") ? "" : "/") + viewPath;
  }

  function accessDestination() {
    const url = getDestinationUrl();
    if (!url) {
      const flow = getSelectedFlow();
      const entityLabel = entityByValue[state.selectedEntity]?.label || "the selected item";
      const domainLabel = getSelectedDomain()?.label || "the selected domain";
      showFeedback(flow.missingMessage.replace("{entity}", entityLabel).replace("{domain}", domainLabel));
      return;
    }

    window.open(url, "_blank", "noopener");
  }

  function submitSearch(event) {
    event.preventDefault();
    const searchInput = byId("searchInput");
    const query = searchInput ? searchInput.value.trim() : "";
    if (!query) return;
    window.top.location.replace(`${WEDATA_SEARCH_PATH}${encodeURIComponent(query)}`);
  }

  function showFeedback(message) {
    const feedback = byId("feedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.hidden = false;
  }

  function hideFeedback() {
    const feedback = byId("feedback");
    if (!feedback) return;
    feedback.textContent = "";
    feedback.hidden = true;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function text(id, value) {
    const element = byId(id);
    if (element) element.textContent = value;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  window.initWeDataNavigator = initWeDataNavigator;
})();
