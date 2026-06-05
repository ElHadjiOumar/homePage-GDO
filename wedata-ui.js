(function () {
  const state = {
    step: 1,
    selectedEntity: null,
    selectedDomain: null
  };

  let config;
  let entityByValue;
  let domainByValue;

  function initWeDataNavigator(mode) {
    config = WEDATA_NAVIGATORS[mode];
    if (!config) throw new Error(`Unknown WeData navigator mode: ${mode}`);

    entityByValue = createLookup(config.groups.flatMap(group => group.items));
    domainByValue = createLookup(config.domains);

    setStaticText();
    bindEvents();
    render();
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
    byId("entityHelp").classList.toggle("hidden", !config.stepOneHelp);
    text("domainTitle", config.stepTwoTitle);
    text("domainHelp", config.stepTwoHelp);
    text("contextLabel", config.selectedLabel);
  }

  function bindEvents() {
    byId("nextButton").addEventListener("click", () => {
      if (state.selectedEntity) goToStep(2);
    });
    byId("backButton").addEventListener("click", () => goToStep(1));
    byId("changeEntityButton").addEventListener("click", () => goToStep(1));
    byId("accessButton").addEventListener("click", accessDestination);
    byId("searchForm").addEventListener("submit", submitSearch);
    const resetLink = document.querySelector("[data-action='reset']");
    if (resetLink) {
      resetLink.addEventListener("click", event => {
        event.preventDefault();
        resetNavigator();
      });
    }
  }

  function render() {
    const selectedEntity = entityByValue[state.selectedEntity];
    const selectedDomain = domainByValue[state.selectedDomain];
    const isStepTwo = state.step === 2;

    byId("entityStep").classList.toggle("hidden", isStepTwo);
    byId("domainStep").classList.toggle("hidden", !isStepTwo);

    byId("stepIndicatorEntity").classList.toggle("is-active", !isStepTwo);
    byId("stepIndicatorEntity").classList.toggle("is-complete", isStepTwo);
    byId("stepIndicatorDomain").classList.toggle("is-active", isStepTwo);
    byId("stepConnector").classList.toggle("is-complete", isStepTwo);

    byId("nextButton").disabled = !state.selectedEntity;
    byId("accessButton").disabled = !state.selectedDomain;

    text("selectedEntityLabel", selectedEntity ? selectedEntity.label : "-");
    text("entitySelectionPill", selectedEntity ? `Selected: ${selectedEntity.label}` : "");
    byId("entitySelectionPill").classList.toggle("hidden", !selectedEntity || isStepTwo);

    text("accessButtonText", selectedDomain ? `Access ${selectedDomain.label}` : "Access");

    renderEntityGroups();
    if (isStepTwo) renderDomains();
  }

  function renderEntityGroups() {
    const root = byId("entityGroups");
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
    const root = byId("domainGrid");
    root.innerHTML = "";

    config.domains.forEach(domain => {
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
    hideFeedback();
    render();
  }

  function selectDomain(domainValue) {
    state.selectedDomain = domainValue;
    hideFeedback();
    render();
  }

  function goToStep(stepNumber) {
    state.step = stepNumber;
    hideFeedback();
    render();
  }

  function resetNavigator() {
    state.step = 1;
    state.selectedEntity = null;
    state.selectedDomain = null;
    hideFeedback();
    render();
  }

  function getDestinationUrl() {
    if (!state.selectedEntity || !state.selectedDomain) return null;

    const viewId = config.matrix[state.selectedEntity] && config.matrix[state.selectedEntity][state.selectedDomain];
    return viewId ? buildViewUrl(viewId) : null;
  }

  function buildViewUrl(viewId) {
    const origin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "";
    return `${origin}${WEDATA_VIEW_PATH}${encodeURIComponent(viewId)}`;
  }

  function accessDestination() {
    const url = getDestinationUrl();

    if (!url) {
      const entityLabel = entityByValue[state.selectedEntity]?.label || "the selected item";
      const domainLabel = domainByValue[state.selectedDomain]?.label || "the selected domain";
      showFeedback(config.missingMessage.replace("{entity}", entityLabel).replace("{domain}", domainLabel));
      return;
    }

    window.location.href = url;
  }

  function submitSearch(event) {
    event.preventDefault();
    const query = byId("searchInput").value.trim();
    if (!query) return;
    window.top.location.replace(`${WEDATA_SEARCH_PATH}${encodeURIComponent(query)}`);
  }

  function showFeedback(message) {
    byId("feedback").textContent = message;
    byId("feedback").hidden = false;
  }

  function hideFeedback() {
    byId("feedback").textContent = "";
    byId("feedback").hidden = true;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function text(id, value) {
    byId(id).textContent = value;
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
