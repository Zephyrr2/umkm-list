// ============================================================
// DATA UMKM — edit file ini untuk menambah/mengubah data
// Format per entri:
//   nama     : nama UMKM
//   kategori : kategori (contoh: Makanan, Fashion, Jasa, Kerajinan)
//   alamat   : alamat lengkap
//   lat, lng : koordinat Google Maps (ambil dari link share Maps)
//   maps     : link Google Maps (link share maps.app.goo.gl atau URL /maps/place/... — hindari place_id:)
// ============================================================

const UMKM = [
  {
    nama: "Mie Ayam Tanpa Nama",
    kategori: "Makanan",
    alamat: "Kanten, Kebon Agung, Kec. Imogiri, Kab. Bantul, DIY 55782",
    lat: -7.9343276,
    lng: 110.3662551,
    maps: "https://maps.app.goo.gl/wcrJKf2YP2rCoH3M9",
  },
  // Contoh entri kedua — tinggal salin blok di atas, hapus tanda //:
  // {
  //   nama: "Nama UMKM",
  //   kategori: "Jasa",
  //   alamat: "Alamat lengkap",
  //   lat: -7.0000000,
  //   lng: 110.0000000,
  //   maps: "https://maps.app.goo.gl/xxxxxxxx",
  // },
];
