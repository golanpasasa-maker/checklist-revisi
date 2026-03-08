/**
 * data.js
 * Sumber data checklist revisi skripsi.
 * Untuk menambah/menghapus item, edit array ini saja.
 */

const CHECKLIST_DATA = [
  {
    title: "Format dan Tampilan",
    items: [
      { text: "Keterangan/judul tabel sudah dibuat rata tengah (center)", done: true },
      { text: "Seluruh tabel dalam skripsi sudah posisi tengah (center)", done: true },
      { text: "Format tabel sudah konsisten", done: true },
    ]
  },
  {
    title: "Deskripsi Dataset",
    items: [
      { text: "Sudah menambahkan penjelasan deskripsi dataset", done: true },
      { text: "Sudah menampilkan contoh data pada Bab IV", done: true },
      { text: "Sudah membuat tabel deskripsi variabel dataset", done: true },
    ]
  },
  {
    title: "Normalisasi Data",
    items: [
      { text: "Menjelaskan tahapan proses normalisasi data", done: false },
      { text: "Menampilkan rumus normalisasi yang digunakan", done: false },
      { text: "Memberikan contoh perhitungan normalisasi dari dataset", done: false },
    ]
  },
  {
    title: "Penerapan Model LSTM",
    items: [
      { text: "Menjelaskan proses penerapan metode Long Short-Term Memory (LSTM)", done: false },
      { text: "Menjelaskan alur pelatihan model", done: false },
      { text: "Menjelaskan input dan output model", done: false },
    ]
  },
  {
    title: "Data yang Diolah pada BAB IV",
    items: [
      { text: "Menampilkan contoh dataset pada Bab IV", done: true },
      { text: "Menjelaskan proses pengolahan data sebelum pelatihan model", done: false },
    ]
  },
  {
    title: "Evaluasi Model",
    items: [
      { text: "Menjelaskan proses evaluasi model", done: false },
      { text: "Menampilkan perhitungan RMSE", done: false },
      { text: "Menampilkan perhitungan MAE", done: false },
      { text: "Menampilkan perhitungan koefisien determinasi (R²)", done: false },
    ]
  },
  {
    title: "Tampilan Aplikasi",
    items: [
      { text: "Memperbaiki tampilan aplikasi", done: false },
      { text: "Memastikan data yang digunakan adalah data real", done: false },
      { text: "Menambahkan penjelasan hasil tampilan aplikasi", done: false },
    ]
  },
  {
    title: "Abstrak",
    items: [
      { text: "Membuat abstrak penelitian", done: false },
    ]
  },
  {
    title: "Jurnal Publikasi",
    items: [
      { text: "Membuat jurnal publikasi dari skripsi", done: false },
    ]
  },
  {
    title: "Kesimpulan",
    items: [
      { text: "Memperbaiki kesimpulan sesuai tujuan penelitian", done: false },
      { text: "Memastikan kesimpulan menjawab rumusan masalah", done: false },
      { text: "Menyusun kesimpulan berdasarkan hasil pengujian model", done: false },
    ]
  },
];
