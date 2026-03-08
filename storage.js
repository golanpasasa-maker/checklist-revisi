/**
 * storage.js
 * Menangani penyimpanan dan pembacaan state checklist
 * menggunakan localStorage agar progress tersimpan di browser.
 */

const STORAGE_KEY = 'skripsi-checklist-v1';

/**
 * Simpan state saat ini ke localStorage.
 * Hanya menyimpan nilai `done` (boolean) per item, bukan seluruh objek.
 * @param {Array} state - Array kategori beserta items
 */
function saveState(state) {
  try {
    const payload = state.map(cat =>
      cat.items.map(item => item.done)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Gagal menyimpan progress:', e);
  }
}

/**
 * Muat state dari localStorage dan terapkan ke state aktif.
 * Jika belum ada data tersimpan, gunakan nilai default dari data.js.
 * @param {Array} state - Array kategori yang akan di-mutasi
 */
function loadState(state) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return; // Belum ada data tersimpan, pakai default

    const payload = JSON.parse(raw);

    payload.forEach((catItems, ci) => {
      if (!state[ci]) return;
      catItems.forEach((done, ii) => {
        if (state[ci].items[ii] !== undefined) {
          state[ci].items[ii].done = done;
        }
      });
    });
  } catch (e) {
    console.warn('Gagal memuat progress:', e);
  }
}

/**
 * Hapus semua data tersimpan dari localStorage.
 */
function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Gagal menghapus progress:', e);
  }
}
