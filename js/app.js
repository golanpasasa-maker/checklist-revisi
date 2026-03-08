/**
 * app.js
 * Entry point aplikasi checklist revisi skripsi.
 * Menghubungkan data.js + storage.js + ui.js.
 */

// Buat state aktif (deep copy dari CHECKLIST_DATA)
const state = CHECKLIST_DATA.map(cat => ({
  ...cat,
  collapsed: false,
  items: cat.items.map(item => ({ ...item })),
}));

// Flag untuk mencegah infinite loop saat ada update realtime
let _ignoreRemote = false;

// ============================================================
//  INIT — jalankan saat halaman pertama kali dibuka
// ============================================================
async function init() {
  // 1. Muat data dari Supabase (atau localStorage jika offline)
  const saved = await loadState();

  // 2. Terapkan data ke state
  applyState(state, saved);

  // 3. Render tampilan
  renderChecklist(state, handleToggle);
  updateProgress(state);

  // 4. Tampilkan status sync
  showSyncStatus(true);

  // 5. Aktifkan realtime listener
  //    Jika perangkat lain mengubah checklist, halaman ini ikut update
  listenState((payload) => {
    if (_ignoreRemote) return;
    applyState(state, payload);
    renderChecklist(state, handleToggle);
    updateProgress(state);
    flashSyncIndicator();
  });
}

// ============================================================
//  TOGGLE ITEM
// ============================================================
function handleToggle(catIdx, itemIdx, itemEl) {
  const wasChecked = state[catIdx].items[itemIdx].done;

  // Update state
  state[catIdx].items[itemIdx].done = !wasChecked;

  // Update DOM
  itemEl.classList.toggle("done");
  updateCatPill(state, catIdx);
  updateProgress(state);

  // Simpan ke Supabase + localStorage
  _ignoreRemote = true;
  saveState(state).finally(() => {
    setTimeout(() => { _ignoreRemote = false; }, 1000);
  });

  // Efek confetti saat dicentang
  if (!wasChecked) {
    const rect = itemEl.getBoundingClientRect();
    spawnConfetti(rect.left + 20, rect.top + 10 + window.scrollY);
  }
}

// ============================================================
//  RESET SEMUA PROGRESS
// ============================================================
document.getElementById("resetBtn").addEventListener("click", async () => {
  const ok = confirm("Reset semua progress? Semua centang akan dihapus.");
  if (!ok) return;

  // Kosongkan semua item
  state.forEach(cat => {
    cat.items.forEach(item => { item.done = false; });
  });

  // Hapus dari Supabase + localStorage
  await clearState();

  // Re-render
  renderChecklist(state, handleToggle);
  updateProgress(state);
});

// ============================================================
//  JALANKAN
// ============================================================
init();
