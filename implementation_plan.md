# TitikLokal - Architecture, Design System & Interactive High-Fidelity Implementation Plan

## Deskripsi Tujuan

Membangun **Interactive High-Fidelity Prototype** untuk ekosistem TitikLokal. Prototype ini tidak boleh memiliki tombol "Coming Soon" atau fitur *placeholder*. Seluruh interaksi (Auth, Buyer, Seller, Admin) harus 100% fungsional di sisi klien menggunakan struktur data relasional simulasi berbasis `localStorage`. Perubahan state (misal: penjual menerima pesanan) harus seketika terefleksikan di sisi pembeli (status tracking berubah). 

Aplikasi dirancang setara startup production-ready (Vercel/Stripe-like UI) dengan arsitektur file modular berbasis ES Modules yang siap di-porting ke React/Vue/Backend nyata.

## User Review Required

> [!IMPORTANT]
> **Skala Pengembangan High-Fidelity (No-Placeholder Rule)**
> Mengingat aturan ketat Anda bahwa **tidak boleh ada satupun tombol mati**, pengembangan ini setara dengan menulis logika ribuan baris kode frontend kompleks. 
> Untuk memastikan kualitas sempurna tanpa bug di setiap langkah, saya telah merinci ulang **Fase 2**. 
> Di Fase 2 ini, kita HANYA akan fokus menyelesaikan:
> 1. **Autentikasi Penuh**: Register/Login, Logout, Session User.
> 2. **Ekosistem Pembeli Sempurna**: Beranda interaktif (Filter/Kategori hidup), Wishlist (tambah/hapus), Follow Toko, Review/Rating interaktif, Chat (Simulasi UI Chat Room), Checkout Flow Lengkap (Pilih Alamat, Kurir dengan harga dinamis, Pembayaran, Simulasi Voucher), dan Tracking Pesanan Real-time (membaca state localStorage terbaru).
> 
> *Catatan: Menu "Notifikasi" dan "Pengaturan Akun" pembeli juga akan dibuat layarnya dengan fungsi update data ke localStorage.*
> 
> Apakah Anda setuju kita kunci ruang lingkup **Fase 2** pada Pembeli & Auth ini terlebih dahulu, agar saya bisa langsung menulis ratusan baris logika JS untuk membuatnya hidup secara presisi?

## Arsitektur Data `localStorage` (Simulasi Relasional)

Untuk mendukung interaksi antar-role, `localStorage` (`titiklokal_data`) akan distrukturkan mirip database:
- `users`: Array of user objects (id, role, name, email, password, address, wishlist_ids, followed_shop_ids).
- `shops`: Array of shop objects (id, owner_id, status, promo_banners, settings).
- `products`: Array of product objects (id, shop_id, category, name, price, stock, is_active, reviews).
- `orders`: Array of order objects (id, buyer_id, shop_id, items, total, shipping, status: 'pending'|'accepted'|'shipping'|'completed').
- `chats`: Array of chat sessions.

## Pembagian Fase Eksekusi

### Fase 1: Design System & Fondasi UI (SELESAI ✅)
- Royal Blue Vercel/Stripe styling, responsivitas Desktop/Mobile, skeleton loader, Heroicons.

### Fase 2: Auth & Full Buyer Experience (FOKUS SAAT INI ⏳)
- Layar Login & Register (Multi-role).
- Implementasi fungsional `data.js` ke `storage.js` secara mendalam.
- **Interaksi Penuh**: Wishlist (togle ikon hati), Follow Toko, Simulasi Chat UI.
- **Checkout Interaktif**: Validasi keranjang -> Pilih Alamat Dummy -> Pilih Kurir -> Bayar -> Pindah ke "Riwayat Pesanan".
- Layar Pengaturan Akun (Edit nama, alamat).

### Fase 3: Full Seller Dashboard (Mendatang)
- Manajemen Produk utuh (CRUD via form, update ke array `products`).
- Manajemen Pesanan (Terima/Tolak mengubah state `orders` dan notifikasi pembeli).
- Promosi & Keuangan (Pembuatan Voucher, Chart Penjualan dinamis berdasarkan pesanan "Completed").
- Pengaturan Toko.

### Fase 4: Full Admin Dashboard (Mendatang)
- Approval Toko/Produk, Manajemen User, Laporan Statistik Keseluruhan berbasis agregasi array `orders` dan `users`.

## Verification Plan (Fase 2)
1. **Auth**: Buat akun pembeli baru -> Login -> Logout. State tersimpan.
2. **Wishlist/Follow**: Klik "Wishlist" pada produk -> Pergi ke tab Wishlist -> Produk ada di sana.
3. **Checkout -> Tracking**: Masukkan barang ke keranjang -> Checkout -> Buka akun Penjual di tab/window baru untuk merubah status -> Kembali ke tab Pembeli, status tracking otomatis berubah.
