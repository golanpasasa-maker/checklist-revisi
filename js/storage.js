/**
 * storage.js
 * Menangani penyimpanan & sinkronisasi state checklist
 * menggunakan Supabase sebagai database online.
 * Fallback otomatis ke localStorage jika offline.
 */

// ============================================================
//  CONFIG SUPABASE
// ============================================================
const SUPABASE_URL  = "https://gsbfitynaoivzxstoknc.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzYmZpdHluYW9pdnp4c3Rva25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDkyMzYsImV4cCI6MjA4ODQ4NTIzNn0.EP2AYuICTIpGVGP_mAtcctIQk_8D3Qia0MZVp0by3nI";
const DB_TABLE      = "checklist";
const DB_ROW_ID     = 1;
const LOCAL_KEY     = "skripsi-checklist-v1";

// Inisialisasi Supabase client
const _db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ============================================================
//  SAVE — simpan state ke Supabase + localStorage
// ============================================================
async function saveState(state) {
  const payload = state.map(cat => cat.items.map(item => item.done));
  const json    = JSON.stringify(payload);

  // Cache lokal
  try { localStorage.setItem(LOCAL_KEY, json); }
  catch (e) { console.warn("[storage] localStorage save gagal:", e); }

  // Simpan ke Supabase (upsert = insert/update otomatis)
  try {
    const { error } = await _db
      .from(DB_TABLE)
      .upsert({ id: DB_ROW_ID, data: json }, { onConflict: "id" });
    if (error) console.warn("[storage] Supabase save error:", error.message);
  } catch (e) {
    console.warn("[storage] Supabase save gagal:", e);
  }
}

// ============================================================
//  LOAD — ambil state dari Supabase, fallback localStorage
// ============================================================
async function loadState() {
  // Coba Supabase terlebih dahulu
  try {
    const { data, error } = await _db
      .from(DB_TABLE)
      .select("data")
      .eq("id", DB_ROW_ID)
      .maybeSingle();

    if (!error && data && data.data) {
      return JSON.parse(data.data);
    }
  } catch (e) {
    console.warn("[storage] Supabase load gagal, pakai localStorage:", e);
  }

  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("[storage] localStorage load gagal:", e);
  }

  return null; // Belum ada data sama sekali
}

// ============================================================
//  APPLY — terapkan payload ke state aktif
// ============================================================
function applyState(state, payload) {
  if (!payload) return;
  payload.forEach((catItems, ci) => {
    if (!state[ci]) return;
    catItems.forEach((done, ii) => {
      if (state[ci].items[ii] !== undefined) {
        state[ci].items[ii].done = Boolean(done);
      }
    });
  });
}

// ============================================================
//  CLEAR — hapus semua progress
// ============================================================
async function clearState() {
  try { localStorage.removeItem(LOCAL_KEY); }
  catch (e) { console.warn("[storage] localStorage clear gagal:", e); }

  try {
    const { error } = await _db
      .from(DB_TABLE)
      .delete()
      .eq("id", DB_ROW_ID);
    if (error) console.warn("[storage] Supabase clear error:", error.message);
  } catch (e) {
    console.warn("[storage] Supabase clear gagal:", e);
  }
}

// ============================================================
//  LISTEN — dengarkan perubahan realtime dari Supabase
// ============================================================
function listenState(onChange) {
  _db
    .channel("checklist-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: DB_TABLE, filter: `id=eq.${DB_ROW_ID}` },
      (event) => {
        try {
          const newData = event.new && event.new.data;
          if (newData) onChange(JSON.parse(newData));
        } catch (e) {
          console.warn("[storage] Realtime parse gagal:", e);
        }
      }
    )
    .subscribe((status) => {
      console.log("[storage] Realtime status:", status);
    });
}
