/* RAG Document Explorer — Dataiku Standard WebApp frontend.
   Requires the Python backend below to be enabled in the Python tab. */
(function () {
  'use strict';
  const root = document.getElementById('rag-explorer');
  if (!root) return;
  const $ = id => root.querySelector('#' + id);
  const state = { view: 'eligible', q: '', type: 'all', page: 1, pageSize: 20, total: 0, docs: [], seq: 0 };
  const titles = {
    eligible: { title: 'Eligible Files', subtitle: 'Documents that passed the applicable quality checks.', table: 'Eligible documents' },
    failing: { title: 'Failing Files', subtitle: 'Understand document issues and prepare targeted remediation.', table: 'Documents requiring review' }
  };

  const escapeHtml = v => String(v ?? '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const formatName = n => String(n || 'Unnamed document');
  const ext = doc => (doc.extension || (doc.name.split('.').pop() || '')).toUpperCase().slice(0, 6);
  const safeUrl = v => /^https?:\/\//i.test(String(v || '')) ? String(v) : '';
  const backendUrl = path => getWebAppBackendUrl(path);

  function setMessage(message) {
    $('message').hidden = !message;
    $('message').textContent = message || '';
  }
  function loading() {
    $('documents-body').innerHTML = '<tr><td colspan="4" style="padding:38px;text-align:center;color:#78869b">Loading documents…</td></tr>';
    $('empty-state').hidden = true;
    setMessage('');
  }
  function renderRows() {
    const isFailing = state.view === 'failing';
    $('third-col').textContent = isFailing ? 'Detected issues' : 'Quality status';
    $('documents-body').innerHTML = state.docs.map((doc, i) => `
      <tr data-index="${i}" tabindex="0" aria-label="View details for ${escapeHtml(doc.name)}">
        <td><div class="filecell"><span class="file-icon">${escapeHtml(ext(doc))}</span><span class="filename">${escapeHtml(formatName(doc.name))}</span></div></td>
        <td><div class="subtext" title="${escapeHtml(doc.path)}">${escapeHtml(doc.path || '—')}</div></td>
        <td>${isFailing ? `<div class="subtext" title="${escapeHtml(doc.issues)}">${escapeHtml(doc.issues || 'See Collibra for details')}</div>` : '<span class="tag success">Eligible</span>'}</td>
        <td><span class="link-icon">›</span></td>
      </tr>`).join('');
    $('empty-state').hidden = state.docs.length !== 0;
    const start = state.total ? (state.page - 1) * state.pageSize + 1 : 0;
    const end = Math.min(state.total, state.page * state.pageSize);
    $('pagination-label').textContent = `${start}–${end} of ${state.total} documents`;
    $('page-label').textContent = `${state.page} / ${Math.max(1, Math.ceil(state.total / state.pageSize))}`;
    $('prev-btn').disabled = state.page <= 1;
    $('next-btn').disabled = state.page * state.pageSize >= state.total;
  }
  async function fetchDocuments() {
    const seq = ++state.seq;
    loading();
    const qs = new URLSearchParams({ kind: state.view, q: state.q, type: state.type, page: String(state.page), limit: String(state.pageSize) });
    try {
      const resp = await fetch(backendUrl('/documents?' + qs.toString()), { credentials: 'same-origin' });
      const payload = await resp.json();
      if (!resp.ok || payload.error) throw new Error(payload.error || `HTTP ${resp.status}`);
      if (seq !== state.seq) return;
      state.docs = payload.items || [];
      state.total = payload.total || 0;
      $('result-label').textContent = `${state.total} document(s) match your filters`;
      const countId = state.view === 'eligible' ? 'eligible-count' : 'failing-count';
      if (!state.q && state.type === 'all') {
        $(countId).textContent = state.total.toLocaleString('en-US');
        $('nav-' + state.view).textContent = state.total.toLocaleString('en-US');
      }
      renderRows();
    } catch (error) {
      if (seq !== state.seq) return;
      state.docs = []; state.total = 0;
      $('documents-body').innerHTML = '';
      $('result-label').textContent = 'Could not load this dataset';
      $('empty-state').hidden = false;
      $('pagination-label').textContent = '—';
      setMessage('Unable to read the Dataiku dataset. Check the Python backend, dataset name and access rights.\n' + error.message);
    }
  }
  async function loadCounts() {
    try {
      const resp = await fetch(backendUrl('/counts'), { credentials: 'same-origin' });
      const counts = await resp.json();
      for (const kind of ['eligible', 'failing']) {
        if (typeof counts[kind] === 'number') {
          $(kind + '-count').textContent = counts[kind].toLocaleString('en-US');
          $('nav-' + kind).textContent = counts[kind].toLocaleString('en-US');
        }
      }
    } catch (_) { /* Table route provides more detailed diagnostics. */ }
  }
  function changeView(view) {
    state.view = view; state.page = 1; state.q = ''; state.type = 'all';
    $('search-input').value = ''; $('type-filter').value = 'all';
    root.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    $('page-title').textContent = titles[view].title;
    $('page-description').textContent = titles[view].subtitle;
    $('table-title').textContent = titles[view].table;
    $('active-tag').className = 'tag ' + (view === 'eligible' ? 'success' : 'danger');
    $('active-tag').textContent = view === 'eligible' ? 'Eligible' : 'Failing';
    fetchDocuments();
  }
  function openDetails(doc) {
    $('detail-name').textContent = formatName(doc.name);
    $('detail-icon').textContent = ext(doc);
    $('detail-status').textContent = state.view === 'eligible' ? 'Eligible' : 'Failing';
    $('detail-status').className = 'tag ' + (state.view === 'eligible' ? 'success' : 'danger');
    $('detail-path').textContent = doc.path || 'Not specified';
    $('detail-format').textContent = ext(doc) || 'Unknown';
    $('issue-section').hidden = state.view === 'eligible';
    $('detail-issues').textContent = doc.issues || 'No issue details provided in this dataset.';
    const link = safeUrl(doc.collibra_url);
    $('detail-link').hidden = !link;
    $('detail-link-note').hidden = !!link;
    if (link) $('detail-link').href = link;
    $('drawer-overlay').hidden = false;
    $('detail-drawer').classList.add('open');
    $('detail-drawer').setAttribute('aria-hidden', 'false');
  }
  function closeDetails() {
    $('detail-drawer').classList.remove('open');
    $('detail-drawer').setAttribute('aria-hidden', 'true');
    $('drawer-overlay').hidden = true;
  }
  let debounce;
  $('search-input').addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.q = e.target.value.trim(); state.page = 1; fetchDocuments(); }, 300);
  });
  $('type-filter').addEventListener('change', e => { state.type = e.target.value; state.page = 1; fetchDocuments(); });
  root.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => changeView(button.dataset.view)));
  $('refresh-btn').addEventListener('click', () => { loadCounts(); fetchDocuments(); });
  $('prev-btn').addEventListener('click', () => { if (state.page > 1) { state.page--; fetchDocuments(); } });
  $('next-btn').addEventListener('click', () => { if (state.page * state.pageSize < state.total) { state.page++; fetchDocuments(); } });
  $('documents-body').addEventListener('click', e => {
    const row = e.target.closest('tr[data-index]');
    if (row) openDetails(state.docs[Number(row.dataset.index)]);
  });
  $('documents-body').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const row = e.target.closest('tr[data-index]');
      if (row) openDetails(state.docs[Number(row.dataset.index)]);
    }
  });
  $('close-drawer').addEventListener('click', closeDetails);
  $('drawer-overlay').addEventListener('click', closeDetails);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetails(); });
  loadCounts();
  fetchDocuments();
})();