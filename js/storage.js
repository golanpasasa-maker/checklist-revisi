/**
 * storage.js
 * Menyimpan & mensync state checklist via Supabase.
 * Fallback ke localStorage jika offline.
 */

// ============================================================
//  SUPABASE CONFIG
// ============================================================
const SUPABASE_URL  = "https://gsbfitynaoivzxstoknc.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzYmZpdHluYW9pdnp4c3Rva25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDkyMzYsImV4cCI6MjA4ODQ4NTIzNn0.EP2AYuICTIpGVGP_mAtcctIQk_8D3Qia0MZVp0by3nI";
const TABLE         = "checklist";
const ROW_ID        = 1; // ID baris tempat data disimpan

const STORAGE_KEY   = "skripsi-checklist-v1";

// Inisialisasi Supabase client
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ============================================================
//  SAVE
// ============================================================
async function saveState(state) {
  const payload = state.map(cat => cat.items.map(item => item.done));

  // Simpan ke localStorage sebagai cache offline
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("localStorage gagal:", e);
  }

  // Upsert ke Supabase
  try {
    await _supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, data: JSON.stringify(payload) });
  } catch (e) {
    console.warn("Supabase gagal menyimpan:", e);
  }
}

// ============================================================
//  LOAD
// ============================================================
async function loadState() {
  // Coba dari Supabase
  try {
    const { data, error } = await _supabase
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .single();

    if (!error && data && data.data) {
      return JSON.parse(data.data);
    }
  } catch (e) {
    console.warn("Supabase gagal memuat, pakai localStorage:", e);
  }

  // Fallback localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("localStorage gagal memuat:", e);
  }

  return null;
}

// ============================================================
//  APPLY
// ============================================================
function applyState(state, payload) {
  if (!payload) return;
  payload.forEach((catItems, ci) => {
    if (!state[ci]) return;
    catItems.forEach((done, ii) => {
      if (state[ci].items[ii] !== undefined) {
        state[ci].items[ii].done = done;
      }
    });
  });
}

// ============================================================
//  CLEAR
// ============================================================
async function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("localStorage gagal dihapus:", e);
  }

  try {
    await _supabase
      .from(TABLE)
      .delete()
      .eq("id", ROW_ID);
  } catch (e) {
    console.warn("Supabase gagal dihapus:", e);
  }
}

// ============================================================
//  REALTIME LISTENER
// ============================================================
function listenState(onChange) {
  _supabase
    .channel("checklist-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLE },
      (payload) => {
        if (payload.new && payload.new.data) {
          try {
            onChange(JSON.parse(payload.new.data));
          } catch (e) {
            console.warn("Gagal parse realtime payload:", e);
          }
        }
      }
    )
    .subscribe();
}
