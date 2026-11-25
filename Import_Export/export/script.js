"use strict";

// Proposed field lists for the three other content types; adapt to the source schema.
const common = ["Name", "Definition", "Status", "Owner", "Domain", "Community", "Data ID"];
const contentTypes = {
  dictionary: { label: "Business Data Dictionary", attributes: common, relations: ["Applicability", "Critical data flag", "Last validation date", "Business steward", "Technical steward", "Related Data Concepts", "Contains", "Follows", "Related DQ Rules", "Attachments"] },
  rules: { label: "Data Quality Rules", attributes: common, relations: ["Applicability", "Critical data flag", "Last validation date", "Business steward", "Technical steward", "Related Data Concepts", "Quality dimension", "Rule expression", "Related DQ Issues", "Attachments"] },
  labeling: { label: "Data Labeling", attributes: common, relations: ["Applicability", "Critical data flag", "Last validation date", "Business steward", "Technical steward", "Related Data Concepts", "Classification", "Sensitivity level", "Related labels", "Attachments"] },
  issues: { label: "Data Quality Issues Register", attributes: common, relations: ["Applicability", "Critical data flag", "Last validation date", "Business steward", "Technical steward", "Related Data Concepts", "Severity", "Resolution date", "Related DQ Rules", "Attachments"] }
};
const form = document.querySelector("#export-form");
const attributes = document.querySelector("#attributes");
const status = document.querySelector("#export-status");
const generateButton = form.querySelector('[type="submit"]');
const selections = new Map();
const defaults = (type) => [...contentTypes[type].attributes, ...contentTypes[type].relations.slice(0, 3)];
const selectedType = () => form.elements.content.value;

function renderAttributes() {
  const type = selectedType();
  if (!selections.has(type)) selections.set(type, new Set(defaults(type)));
  attributes.replaceChildren();
  for (const fields of [contentTypes[type].attributes, contentTypes[type].relations]) {
    const column = document.createElement("div");
    column.className = "attribute-column";
    for (const field of fields) {
      const label = document.createElement("label");
      label.className = "attribute-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "fields";
      checkbox.value = field;
      checkbox.checked = selections.get(type).has(field);
      const text = document.createElement("span");
      text.textContent = field;
      label.append(checkbox, text);
      column.append(label);
    }
    attributes.append(column);
  }
  updateValidity();
}

function updateValidity() {
  const empty = selections.get(selectedType()).size === 0;
  generateButton.disabled = empty;
  status.textContent = empty ? "Select at least one field to generate an export." : "";
}

form.addEventListener("change", (event) => {
  if (event.target.name === "content") renderAttributes();
  if (event.target.name === "fields") {
    const selection = selections.get(selectedType());
    if (event.target.checked) selection.add(event.target.value);
    else selection.delete(event.target.value);
    updateValidity();
  }
});

form.addEventListener("reset", (event) => {
  event.preventDefault();
  form.querySelector('[value="dictionary"]').checked = true;
  selections.clear();
  renderAttributes();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const type = selectedType();
  const fields = [...attributes.querySelectorAll("input:checked")].map((input) => input.value);
  if (!fields.length) return;
  // Frontend only: download the selection, not business records.
  // Replace this download with the export API call once a backend is connected.
  const configuration = { contentType: type, contentLabel: contentTypes[type].label, fields };
  const blob = new Blob([JSON.stringify(configuration, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `wedata-export-${type}-configuration.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = "Export configuration downloaded. Connect a data source to export records.";
});

renderAttributes();
