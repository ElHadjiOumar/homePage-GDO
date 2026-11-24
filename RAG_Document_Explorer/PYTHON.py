# Dataiku Standard WebApp — Python backend (Flask)
# Enable the Python backend in the Dataiku editor before using this code.
# IMPORTANT: Dataiku provides the Flask object `app` automatically.
# Do not create a second Flask(__name__) object.

import os
import re
import math
import dataiku
from flask import jsonify, request

# Update ONLY these names if your datasets differ in the Flow.
DATASETS = {
    "eligible": "Eligible_files",
    "failing": "Failing_files_taxonomie_codes_result",
}

# Column names are automatically recognized where possible.
COLUMNS = {
    "name": ["filename", "file_name", "fileName", "name", "document_name", "file", "title"],
    "path": ["filepath", "file_path", "filePath", "path", "source_path", "sharepoint_path", "relative_path"],
    "issues": ["taxonomy_summary", "taxonomy_codes", "taxonomy_code", "issues", "issue_summary", "failing_reasons", "failure_reason"],
    "collibra_url": ["wedata_link", "collibra_link", "collibra_url", "asset_url", "asset_link", "url"],
}


def find_column(df, options):
    lookup = {str(c).strip().lower(): c for c in df.columns}
    for option in options:
        if option.lower() in lookup:
            return lookup[option.lower()]
    return None


def as_text(value):
    if value is None:
        return ""
    try:
        if math.isnan(value):
            return ""
    except (TypeError, ValueError):
        pass
    s = str(value).strip()
    return "" if s.lower() in ("nan", "none", "null") else s


def load_dataset(kind):
    name = DATASETS[kind]
    df = dataiku.Dataset(name).get_dataframe()
    mapping = {field: find_column(df, choices) for field, choices in COLUMNS.items()}
    if not mapping["name"]:
        raise ValueError(
            "Could not find a filename column in dataset '%s'. Available columns: %s. "
            "Update COLUMNS['name'] in the Python code." % (name, ", ".join(map(str, df.columns)))
        )
    return df, mapping


def get_field(row, mapping, key):
    column = mapping.get(key)
    return as_text(row[column]) if column else ""


def make_item(row, mapping, kind):
    name = get_field(row, mapping, "name")
    path = get_field(row, mapping, "path")
    issues = get_field(row, mapping, "issues") if kind == "failing" else ""
    collibra_url = get_field(row, mapping, "collibra_url")
    extension = os.path.splitext(name)[1].lstrip(".").lower()
    if not extension and path:
        extension = os.path.splitext(path)[1].lstrip(".").lower()
    return {
        "name": name,
        "path": path,
        "issues": issues,
        "collibra_url": collibra_url,
        "extension": extension,
    }


@app.route('/counts', methods=['GET'])
def rag_counts():
    counts = {}
    for kind in DATASETS:
        try:
            df, _ = load_dataset(kind)
            counts[kind] = len(df)
        except Exception:
            # Keep each count independent: the documents endpoint gives explicit errors.
            counts[kind] = None
    return jsonify(counts)


@app.route('/documents', methods=['GET'])
def rag_documents():
    kind = request.args.get('kind', 'eligible')
    if kind not in DATASETS:
        return jsonify(error='Invalid kind. Expected eligible or failing.'), 400

    try:
        page = max(1, int(request.args.get('page', 1)))
        limit = min(100, max(1, int(request.args.get('limit', 20))))
    except ValueError:
        return jsonify(error='Invalid pagination parameters.'), 400

    q = request.args.get('q', '').strip().lower()[:200]
    file_type = request.args.get('type', 'all').strip().lower()
    if file_type not in ('all', 'pdf', 'docx', 'pptx', 'xlsx'):
        return jsonify(error='Unsupported file type filter.'), 400

    try:
        df, mapping = load_dataset(kind)
        # Data volumes in this POC are small (~1,300 documents).
        items = [make_item(row, mapping, kind) for _, row in df.iterrows()]
        if q:
            items = [item for item in items if q in ' '.join(
                (item['name'], item['path'], item['issues'])
            ).lower()]
        if file_type != 'all':
            items = [item for item in items if item['extension'] == file_type]
        items.sort(key=lambda d: d['name'].lower())
        total = len(items)
        first = (page - 1) * limit
        return jsonify(items=items[first:first + limit], total=total, page=page, limit=limit)
    except Exception as exc:
        return jsonify(error=(
            'Cannot read dataset %s: %s' % (DATASETS[kind], str(exc))
        )), 500