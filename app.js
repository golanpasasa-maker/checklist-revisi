/**
 * app.js
 * Entry point aplikasi.
 * Menginisialisasi state, memuat data tersimpan,
 * dan menghubungkan semua modul (data, storage, ui).
 */

/* Buat state aktif dari data (deep copy agar data asli tidak termutasi) */
const state = CHECKLIST_DATA.map(cat => ({
  ...cat,
  collapsed: false,
  items: cat.items.map(item => ({ ...item })),
}));

/* Muat progress tersimpan dari localStorage */
loadState(state);

/* Render awal */
renderChecklist(state, handleToggle);
updateProgress(state);

/* --------------------------------------------------
   HANDLER: Toggle item checklist
   -------------------------------------------------- */
function handleToggle(catIdx, itemIdx, itemEl) {
  const wasChecked = state[catIdx].items[itemIdx].done;

  /* Update state */
  state[catIdx].items[itemIdx].done = !wasChecked;

  /* Update DOM */
  itemEl.classList.toggle('done');
  updateCatPill(state, catIdx);
  updateProgress(state);

  /* Simpan ke localStorage */
  saveState(state);

  /* Efek confetti saat mencentang */
  if (!wasChecked) {
    const rect = itemEl.getBoundingClientRect();
    spawnConfetti(rect.left + 20, rect.top + 10 + window.scrollY);
  }
}

/* --------------------------------------------------
   HANDLER: Reset semua progress
   -------------------------------------------------- */
document.getElementById('resetBtn').addEventListener('click', () => {
  const konfirmasi = confirm(
    'Reset semua progress? Centang yang sudah dibuat akan dihapus.'
  );
  if (!konfirmasi) return;

  /* Reset state ke nilai default dari data.js */
  CHECKLIST_DATA.forEach((cat, ci) => {
    cat.items.forEach((item, ii) => {
      state[ci].items[ii].done = item.done;
    });
  });

  /* Hapus localStorage */
  clearState();

  /* Re-render */
  renderChecklist(state, handleToggle);
  updateProgress(state);
});
