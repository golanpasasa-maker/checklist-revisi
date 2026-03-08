# ✅ Checklist Revisi Skripsi

Aplikasi checklist interaktif untuk memantau progres revisi skripsi, lengkap dengan penyimpanan otomatis via `localStorage`.

## 🗂️ Struktur File

```
skripsi-checklist/
├── index.html        ← Halaman utama
├── css/
│   └── style.css     ← Semua styling & animasi
├── js/
│   ├── data.js       ← Data checklist (edit di sini untuk tambah item)
│   ├── storage.js    ← Logika localStorage (save/load/clear)
│   ├── ui.js         ← Render DOM & animasi
│   └── app.js        ← Entry point & event handler
└── README.md
```

## 🚀 Deploy ke GitHub Pages

1. Push semua file ke repository GitHub
2. Buka **Settings → Pages**
3. Set **Source** ke branch `main`, folder `/ (root)`
4. Akses via `https://<username>.github.io/<repo-name>/`

## ✨ Fitur

- Progress bar real-time
- State tersimpan otomatis di browser (`localStorage`)
- Animasi confetti saat item dicentang
- Collapse/expand per kategori
- Tombol reset progress
- Responsif untuk mobile

## 🛠️ Menambah Item

Edit array `CHECKLIST_DATA` di `js/data.js`:

```js
{
  title: "Nama Kategori Baru",
  items: [
    { text: "Deskripsi item", done: false },
  ]
},
```
