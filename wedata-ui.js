// Ce fichier gere l'affichage ; les listes et URL se modifient dans wedata-data.js.
// Parcours : entite -> perimetre si BL regionale -> contenu -> ouverture ou erreur en bas.
(function () {
  // Memoire de la selection : etape 1 = liste ; etape 2 = perimetre ou contenu.
  const state = {
    step: 1,
    selectedEntity: null,
    selectedScope: null,
    selectedDomain: null
  };

  const config = WEDATA_NAVIGATOR;
  let entityByValue;

  // Attend que le HTML soit pret, puis branche les clics et affiche la page.
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
    text("navigatorAccessNote", config.accessNote);
    text("entityTitle", config.stepOneTitle);
    text("entityHelp", config.stepOneHelp);
    toggleClass("entityHelp", "hidden", !config.stepOneHelp);
    text("contextLabel", config.selectedLabel);
  }

  function bindEvents() {
    // Un seul retour : contenus regionaux -> perimetres -> liste des entites.
    on("changeEntityButton", "click", () => {
      if (state.selectedScope) {
        state.selectedScope = null;
        state.selectedDomain = null;
        hideFeedback();
        render();
      } else {
        goToStep(1);
      }
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

  // Met a jour la page a partir de state, sans recharger le navigateur.
  function render() {
    const selectedEntity = entityByValue[state.selectedEntity];
    const isStepTwo = state.step === 2;
    const flow = getSelectedFlow();
    const isBusinessLine = selectedEntity && selectedEntity.entityType === "business";
    text("entityStageLabel", isBusinessLine ? "Choose a BL" : "Choose a RF Filiere");
    const scopes = config.businessLineScopes[state.selectedEntity] || [];
    const choosingScope = scopes.length > 0 && !state.selectedScope;
    const selectedScope = scopes.find(scope => scope.value === state.selectedScope);
    text("destinationStageNumber", scopes.length && !choosingScope ? "3" : "2");
    text("destinationStageLabel", choosingScope ? "Choose a scope" : "Choose content");
    toggleClass("scopeContext", "hidden", !selectedScope);
    text("selectedScopeLabel", selectedScope ? selectedScope.label : "");

    toggleClass("entityStep", "hidden", isStepTwo);
    toggleClass("domainStep", "hidden", !isStepTwo);

    text("selectedEntityLabel", selectedEntity ? selectedEntity.label : "-");
    text("domainTitle", choosingScope ? "Choose a scope" : (flow ? flow.stepTwoTitle : ""));
    text("domainHelp", choosingScope ? "Choose the Business Line or a region to explore its content." : (flow ? flow.stepTwoHelp : ""));

    renderEntityGroups();
    if (isStepTwo) renderDomains();
  }

  function renderEntityGroups() {
    const root = getOrCreateContainer("entityGroups", "entityStep", "entity-groups");
    if (!root) return;
    root.innerHTML = "";

    config.groups.forEach(group => {
      const section = document.createElement("section");
      section.className = "group-block";
      const guideSteps = group.type === "business"
        ? ["Choose a BL", "Choose content"]
        : ["Choose a RF Filiere", "Choose content"];
      section.innerHTML = `
 <div class="group-header">
 <h3 class="group-title ${group.type === "business" ? "is-green" : ""}">${escapeHtml(group.title)}</h3>
 <div class="flow-guide" aria-label="${guideSteps.length} step${guideSteps.length > 1 ? "s" : ""}">
 ${guideSteps.map((label, index) => `
   <span class="flow-guide-step${index === 0 ? " is-active" : " is-pending"}">
     <span class="flow-guide-number">${index + 1}</span>
     <span>${escapeHtml(label)}</span>
   </span>${index < guideSteps.length - 1 ? '<span class="flow-guide-line" aria-hidden="true"></span>' : ""}
 `).join("")}
 </div>
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

  // Affiche les quatre contenus communs ; les liens restent propres a chaque entite.
  function renderDomains() {
    const root = getOrCreateContainer("domainGrid", "domainStep", "card-grid domain-grid");
    const flow = getSelectedFlow();

    if (!root) return;
    root.innerHTML = "";
    if (!flow) return;

    const scopes = config.businessLineScopes[state.selectedEntity] || [];
    const choosingScope = scopes.length > 0 && !state.selectedScope;
    const choices = choosingScope ? scopes : flow.domains;
    choices.forEach(domain => {
      root.appendChild(createChoiceCard(domain, {
        variant: "domain",
        selectedValue: state.selectedDomain,
        onSelect: choosingScope ? selectScope : selectDomain
      }));
    });
  }

  // Cree une carte cliquable. Un lien vide reste cliquable pour afficher une erreur.
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
 `;

    button.addEventListener("click", () => options.onSelect(item.value));
    return button;
  }

  // Une filiere RF et une BL passent toutes deux a la deuxieme etape.
  function selectEntity(entityValue) {

    state.selectedEntity = entityValue;
    state.selectedScope = null;
    state.selectedDomain = null;

    state.step = 2;
    hideFeedback();
    render();
  }

  // Le perimetre est obligatoire pour les trois BL regionales, Global inclus.
  function selectScope(scopeValue) {
    state.selectedScope = scopeValue;
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
    if (stepNumber === 1) {
      state.selectedEntity = null;
      state.selectedScope = null;
      state.selectedDomain = null;
    }
    hideFeedback();
    render();
  }

  // Retrouve les liens RF ou BL selon le type de l'entite selectionnee.
  function getSelectedFlow() {
    const selectedEntity = entityByValue[state.selectedEntity];
    if (!selectedEntity) return null;

    return config.domainFlows[selectedEntity.entityType] || null;
  }

  function getSelectedDomain() {
    const flow = getSelectedFlow();
    if (!flow || !state.selectedDomain) return null;
    return createLookup(flow.domains)[state.selectedDomain];
  }

  // Cherche le lien du couple selectionne ; null signifie lien non renseigne.
  function getDestinationUrl() {
    const flow = getSelectedFlow();
    if (!flow || !state.selectedEntity || !state.selectedDomain) return null;

    // Une region lit uniquement ses propres URL, sans utiliser celles d'une autre.
    const scopes = config.businessLineScopes[state.selectedEntity];
    const views = scopes
      ? config.scopeContentViews[state.selectedEntity]?.[state.selectedScope]
      : flow.matrix[state.selectedEntity];
    const viewId = views && views[state.selectedDomain];
    return viewId ? buildViewUrl(viewId) : null;
  }

  // Ajoute le serveur commun au chemin ; accepte aussi une URL complete.
  function buildViewUrl(viewPath) {
    const baseUrl = typeof WEDATA_VIEW_BASE_URL === "string" ? WEDATA_VIEW_BASE_URL : "";
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    if (/^https?:\/\//.test(viewPath)) return viewPath;
    return normalizedBaseUrl + (viewPath.startsWith("/") ? "" : "/") + viewPath;
  }

  // Lien absent : message existant en bas. Lien present : ouverture dans un autre onglet.
  function accessDestination() {
    const url = getDestinationUrl();
    if (!url) {
      const flow = getSelectedFlow();
      const scope = (config.businessLineScopes[state.selectedEntity] || [])
        .find(item => item.value === state.selectedScope);
      const entityLabel = (entityByValue[state.selectedEntity]?.label || "the selected item")
        + (scope ? " / " + scope.label : "");
      const domainLabel = getSelectedDomain()?.label || "the selected domain";
      showFeedback(flow.missingMessage.replace("{entity}", entityLabel).replace("{domain}", domainLabel));
      return;
    }

    openUrl(url);
  }

  function openUrl(url) {
    window.open(url, "_blank", "noopener");
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

  // Protege les libelles injectes dans le HTML en traitant les caracteres speciaux.
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
