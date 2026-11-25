"use strict";

const form = document.querySelector("#import-form");
const fileInput = document.querySelector("#file-input");
const dropZone = document.querySelector("#drop-zone");
const fileCard = document.querySelector("#selected-file");
const errorMessage = document.querySelector("#file-error");
const statusMessage = document.querySelector("#import-status");
const importButton = document.querySelector("#import-button");
let selectedFile = null;

function setError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = !message;
  fileInput.setAttribute("aria-invalid", String(Boolean(message)));
}

function clearFile() {
  selectedFile = null;
  fileInput.value = "";
  fileCard.hidden = true;
  importButton.disabled = true;
  statusMessage.textContent = "";
  setError("");
}

function selectFile(files) {
  clearFile();
  if (files.length !== 1) {
    setError("Please select one CSV or XLSX file at a time.");
    return;
  }
  const file = files[0];
  if (!/\.(csv|xlsx)$/i.test(file.name)) {
    setError("Unsupported format. Please choose a CSV or XLSX file.");
    return;
  }
  if (file.size === 0) {
    setError("This file is empty. Please choose a file containing assets.");
    return;
  }
  selectedFile = file;
  document.querySelector("#file-name").textContent = file.name;
  const size = file.size < 1024 ? `${file.size} bytes` : file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  document.querySelector("#file-details").textContent = `${size} · ${file.name.split(".").pop().toUpperCase()}`;
  fileCard.hidden = false;
  importButton.disabled = false;
  statusMessage.textContent = "";
}

fileInput.addEventListener("change", () => {
  // Copy before clearing the native input, including when choosing the same file again.
  const files = Array.from(fileInput.files);
  if (files.length) selectFile(files);
});
document.querySelector("#remove-file").addEventListener("click", () => {
  clearFile();
  fileInput.focus();
});
let dragDepth = 0;
dropZone.addEventListener("dragenter", (event) => {
  event.preventDefault();
  dragDepth += 1;
  dropZone.classList.add("dragging");
});
dropZone.addEventListener("dragover", (event) => event.preventDefault());
dropZone.addEventListener("dragleave", () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) dropZone.classList.remove("dragging");
});
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dragDepth = 0;
  dropZone.classList.remove("dragging");
  selectFile(Array.from(event.dataTransfer.files));
});
form.addEventListener("change", () => { statusMessage.textContent = ""; });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedFile || !form.reportValidity()) return;
  // Integration point: send selectedFile, form.elements.content.value and
  // form.elements.domain.value to the future backend via FormData.
  // Domain values are UI placeholders, not Collibra domain UUIDs.
  const domain = form.elements.domain.selectedOptions[0].textContent;
  statusMessage.textContent = `File ready for ${domain}. Import is not connected yet; no data has been sent to Collibra.`;
});
document.querySelector(".help-button").addEventListener("click", (event) => {
  const panel = document.querySelector("#help-panel");
  panel.hidden = !panel.hidden;
  event.currentTarget.setAttribute("aria-expanded", String(!panel.hidden));
});
