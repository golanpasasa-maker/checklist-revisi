/**
 * app.js
 * Entry point aplikasi.
 * Mendukung sync realtime via Firebase Firestore.
 */

/* Buat state aktif dari data (deep copy) */
const state = CHECKLIST_DATA.map(cat => ({
  ...cat,
  collapsed: false,
  items: cat.items.map(item => ({ ...item })),
}));

/* Flag untuk mencegah loop saat listener Firestore aktif */
let isRemoteUpdate = false;

/* --------------------------------------------------
   INISIALISASI
   -------------------------------------------------- */
async function init() {
  // Muat data dari Firestore atau localStorage
  const saved = await loadState();
  applyState(state, saved);

  // Render awal
  renderChecklist(state, handleToggle);
  updateProgress(state);

  // Tampilkan indikator status sync
  showSyncStatus();

  // Aktifkan realtime listener (hanya jika Firebase aktif)
  listenState((payload) => {
    isRemoteUpdate = true;
    applyState(state, payload);
    renderChecklist(state, handleToggle);
    updateProgress(state);
    flashSyncIndicator();
    isRemoteUpdate = false;
  });
}

/* --------------------------------------------------
   HANDLER: Toggle item checklist
   -------------------------------------------------- */
function handleToggle(catIdx, itemIdx, itemEl) {
  const wasChecked = state[catIdx].items[itemIdx].done;

  state[catIdx].items[itemIdx].done = !wasChecked;

  itemEl.classList.toggle('done');
  updateCatPill(state, catIdx);
  updateProgress(state);

  saveState(state);

  if (!wasChecked) {
    const rect = itemEl.getBoundingClientRect();
    spawnConfetti(rect.left + 20, rect.top + 10 + window.scrollY);
  }
}

/* --------------------------------------------------
   HANDLER: Reset semua progress
   -------------------------------------------------- */
document.getElementById('resetBtn').addEventListener('click', async () => {
  const konfirmasi = confirm('Reset semua progress? Semua centang akan dihapus.');
  if (!konfirmasi) return;

  state.forEach(cat => {
    cat.items.forEach(item => { item.done = false; });
  });

  await clearState();

  renderChecklist(state, handleToggle);
  updateProgress(state);
});

/* --------------------------------------------------
   SYNC STATUS INDICATOR
   -------------------------------------------------- */
function showSyncStatus() {
  const wrap = document.querySelector('.reset-wrap');
  const indicator = document.createElement('div');
  indicator.id = 'syncIndicator';
  indicator.style.cssText = `
    text-align: center;
    font-size: 12px;
    margin-bottom: 12px;
    font-family: 'DM Mono', monospace;
    transition: all 0.3s;
  `;

  indicator.innerHTML = `<span style="color:#22d37a">⬤</span> <span style="color:#6b7280">Sync aktif — perubahan tersimpan di semua perangkat</span>`;

  wrap.insertBefore(indicator, wrap.firstChild);
}

function flashSyncIndicator() {
  const el = document.getElementById('syncIndicator');
  if (!el) return;
  el.style.opacity = '0.4';
  setTimeout(() => { el.style.opacity = '1'; }, 400);
}

/* --------------------------------------------------
   MULAI
   -------------------------------------------------- */
init();
