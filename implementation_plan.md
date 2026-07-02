# Rencana Redesign Total Seller Dashboard & Perbaikan Bug

## Tujuan
Memperbaiki *error* DOM (View tidak ditemukan), mengaudit rute aplikasi, dan merombak tampilan Dashboard Penjual (serta halaman-halaman pendukungnya) menjadi sangat sederhana, fokus pada *usability* untuk pemilik UMKM.

## User Review Required

> [!WARNING]
> Rencana ini akan menghapus banyak elemen "canggih" yang baru saja dibuat di Seller Dashboard sebelumnya, menggantinya dengan antarmuka yang jauh lebih bersih, besar, dan sederhana (Prinsip: *Less is Better*). Seluruh halaman pendukung (Produk, Pesanan, Chat, Profil) juga akan dibangun ulang dengan pendekatan minimalis.

## Open Questions
1. Apakah Anda setuju jika logika untuk halaman Produk, Pesanan, Chat, dan Profil khusus penjual disatukan ke dalam file `js/views/seller.js` agar pengelolaannya lebih terpusat, atau Anda lebih memilih dibuatkan file terpisah (misal: `js/views/seller_orders.js`)? *Untuk rencana ini, saya mengasumsikan penyatuan di `seller.js` demi kesederhanaan struktur file, karena tampilannya sangat minimalis.*

## Proposed Changes

### 1. Audit & Perbaikan Struktur DOM (`index.html`)
- **[MODIFY] `index.html`**:
  - Menambahkan *container* `<section>` yang hilang untuk mencegah *console error*:
    - `<section id="view-seller-products" ...>`
    - `<section id="view-seller-orders" ...>`
    - `<section id="view-seller-chat" ...>`
    - `<section id="view-seller-profile" ...>`

### 2. Perbaikan Routing & Navigasi
- **[MODIFY] `js/core/router.js`**:
  - Mendaftarkan rute baru: `view-seller-chat` dan `view-seller-profile` dengan izin akses *role* `'seller'`.
- **[MODIFY] `js/components/layout.js`**:
  - Memperbarui `renderBottomNav` khusus penjual menjadi 5 menu: **Dashboard, Produk, Pesanan, Chat, Profil**.
- **[MODIFY] `js/app.js`**:
  - Mendaftarkan fungsi *listener* untuk memanggil render UI saat rute berpindah (misal: memanggil `initSellerProducts()` saat rute `view-seller-products` aktif).

### 3. Redesign Dashboard Utama (`js/views/seller.js`)
- Merombak fungsi `renderSellerDashboard` menjadi sangat minimalis:
  - **Header**: Foto, Nama, Status (Buka/Tutup), Tombol Edit Profil.
  - **Ringkasan**: 4 kartu (Pesanan Baru, Diproses, Pendapatan, Produk Aktif) dengan ukuran besar.
  - **Quick Action**: 6 ikon besar (Tambah Produk, Daftar Produk, Pesanan, Chat Pembeli, Promosi, Keuangan).
  - **Statistik**: 1 Grafik (7 Hari) & 1 Angka Total Pendapatan.

### 4. Pembuatan Halaman Pendukung (Minimalis)
Di dalam `js/views/seller.js`, akan ditambahkan fungsi-fungsi render baru:
- **`initSellerProducts()`**: Menampilkan *search bar*, daftar produk (Foto, Nama, Harga, Stok, Status), tombol titik tiga (opsi: Edit, Nonaktifkan, Hapus), dan tombol melayang (FAB) Tambah Produk.
- **`initSellerOrders()`**: Menampilkan *Tabs* (Baru, Diproses, Dikirim, Selesai) dengan *list card* pesanan yang sangat simpel.
- **`initSellerChat()`**: Menampilkan riwayat *chat* dengan penanda belum dibaca. (Data akan di-*mock* menggunakan struktur *toast* "Fitur segera hadir" untuk interaksinya jika belum ada *realtime engine*).
- **`initSellerProfile()`**: Menampilkan *list menu* (Informasi Toko, Jam, Alamat, Rekening, Pengiriman, Logout) bergaya *Settings* di Android/iOS.

### 5. Cleanup
- Menghapus komponen, kode *chart*, dan *layout* yang tidak terpakai dari versi dashboard sebelumnya untuk menghemat memori.

## Verification Plan
1. Buka aplikasi dan *login* sebagai penjual.
2. Periksa *Console* peramban: pastikan tidak ada pesan "View view-seller-products not found in DOM".
3. Uji coba mengklik semua tombol di *Bottom Navigation* (Dashboard, Produk, Pesanan, Chat, Profil). Pastikan semuanya memuat halaman tanpa layar putih/kosong.
4. Pada setiap tombol yang belum memiliki fungsionalitas (seperti "Tambah Produk" atau "Pengaturan Rekening"), pastikan akan muncul *Toast* "Fitur ini akan segera hadir" alih-alih menyebabkan *error*.
