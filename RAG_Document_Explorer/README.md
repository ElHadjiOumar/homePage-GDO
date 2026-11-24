# RAG Document Explorer — Dataiku Standard WebApp

A read-only document explorer for a Dataiku DSS project, focused on **Eligible Files** and **Failing Files**. It uses existing Dataiku datasets; no SharePoint or Collibra credentials are stored in this repository.

## Install in Dataiku

1. Open your Dataiku project and navigate to **Code → Webapps → New Webapp → Standard → Empty**.
2. Paste `HTML.html` into the **HTML** tab (without adding `<html>` or `<body>`).
3. Paste `CSS.css` into **CSS**.
4. Paste `JS.js` into **JS**.
5. Enable the **Python backend** and paste `PYTHON.py` into the Python tab.
6. Save and launch **Preview**.

## Dataset configuration

The backend reads two tabular datasets:

```python
DATASETS = {
    "eligible": "Eligible_files",
    "failing": "Failing_files_taxonomie_codes_result",
}
```

Update these names in `PYTHON.py` if your actual dataset names differ. The code attempts to recognize common column names, including `filename`, `filepath`, `taxonomy_summary`, and `wedata_link`.

## Features

- Two views: Eligible Files and Failing Files
- Search, file-type filters, and pagination
- Document details, including taxonomy issues for failing files
- Direct links to Collibra/WeData, when present in the dataset
- Dynamic counts from the source datasets

## Notes

- **Read only:** This version does not launch Dataiku jobs, modify files, or trigger remediation.
- **No secrets:** The app reads project datasets using Dataiku's execution context, not embedded credentials.
- **Managed folders:** If your Flow node is a managed folder, expose its metadata through a tabular dataset.
- **Access:** Configure dataset and webapp permissions in your Dataiku environment.
- **Testing:** Integration must be tested in your Dataiku environment. If no data appears, inspect the Python backend logs, dataset names, and column mapping.
