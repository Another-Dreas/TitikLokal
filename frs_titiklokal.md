# Functional Requirement Specification (FRS): TitikLokal V2

## 1. Konsep Bisnis & Strategi Produk

### Gambaran Umum
TitikLokal adalah sebuah platform *e-commerce* hiperlokal yang mempertemukan UMKM dengan konsumen di sekitarnya. Arsitektur aplikasi ini dikembangkan untuk menyerupai *startup marketplace* modern berskala besar, yang dirancang siap untuk dimigrasikan ke kerangka kerja sesungguhnya (React/Flutter/Node.js) di masa depan. 

### Signature Feature: "Jelajah Sekitar Saya"
Fitur utama yang menjadi ciri khas dan membedakan TitikLokal dari marketplace lain. Saat aplikasi dibuka, antarmuka dapat langsung beralih ke Peta Interaktif (Leaflet) yang menampilkan seluruh UMKM di sekitar pengguna. 
- **Radius Interaktif:** Filter jarak otomatis 2km, 5km, 10km.
- **Marker Pintar:** Pin peta dibedakan berdasarkan warna/ikon kategori usaha.
- **Mini Store Card:** Menekan pin pada peta akan memunculkan kartu melayang (foto, nama, kategori, rating, jarak, status buka/tutup, dan promo) dengan tombol aksi langsung menuju halaman profil toko.

---

## 2. Design System & Standar UI

Sistem aplikasi mematuhi panduan desain yang ketat agar selaras secara visual di seluruh halaman:
- **Grid & Spacing:** Menggunakan kelipatan **8pt Grid System** (8, 16, 24, 32, 40, dst) untuk margin dan padding.
- **Color Palette:** 
  - *Primary:* Nuansa Biru (#2563EB - #1D4ED8)
  - *Secondary:* Abu-abu Slate (#F8FAFC - #334155)
  - *Status:* Success (Emerald), Error (Red), Warning (Amber), Info (Blue).
- **Typography Scale:** Skala font dinamis (Inter / Roboto) mulai dari 10px (xs) hingga 32px (3xl).
- **Shadow & Radius Standard:** *Card* menggunakan radius 16px-24px (`rounded-2xl`, `rounded-3xl`) dengan bayangan *soft-shadow*.
- **Animation & Transitions:** Standar transisi 300ms *ease-in-out* untuk perpindahan halaman, *hover*, dan *loading*.
- **UI States:** Menyediakan desain standar untuk *Empty State*, *Error State*, *Success State*, dan *Loading/Skeleton State*.

---

## 3. Component Library (Reusable)

Aplikasi dibangun dari komponen independen yang dapat didaur ulang:
- **Layout & Navigation:** AppBar, Bottom Navigation, Sidebar, Drawer, Floating Action Button (FAB), Breadcrumb.
- **Data Display:** StoreCard, ProductCard, ReviewCard, NotificationCard, OrderCard, VoucherCard, AddressCard, PaymentCard, DriverCard.
- **Interactions & Inputs:** SearchBar (dengan autocomplete), CategoryChip, Quantity Selector, Button Variants (Primary, Secondary, Ghost, Danger), Input Variants (Text, Select, Textarea).
- **Feedback:** Toast, Snackbar, Modal, Bottom Sheet, Dialog, Rating Component, Chat Bubble.
- **Complex & Visual:** Carousel, Horizontal List, Grid Layout, Checkout Stepper, Timeline Tracking, Map Card, Statistic Card, Chart Card.

---

## 4. State Management (Frontend States)

Simulasi *State Management* (di-*mock* menggunakan variabel *store* global yang disinkronisasi ke LocalStorage):
- `currentUser` & `currentRole`: Menyimpan data sesi otentikasi.
- `selectedShop` & `selectedProduct`: State aktif saat bernavigasi di halaman profil UMKM.
- `cart` & `checkout`: State keranjang dinamis dan *payload* checkout multi-langkah.
- `selectedAddress`, `selectedProvider`, `selectedDriver`, `selectedPayment`: State kondisional di tengah alur *checkout*.
- `currentOrder`: State pesanan aktif untuk layar *Tracking*.
- `notification`, `wishlist`, `following`, `chatRoom`: Array reaktif untuk lencana (*badge*) dan tampilan UI.
- `theme` & `language`: Konfigurasi personalisasi.
- `searchHistory`, `recentViewed`, `promoBanner`, `favoriteCategory`: Log algoritma rekomendasi UI.

---

## 5. Fitur Utama & Dashboard

### Buyer Dashboard (Homepage)
Homepage bukan sekadar katalog, melainkan *Personalized Landing Page*:
- *Greeting:* "Halo, [Nama User]".
- *Widget Dinamis:* Pesanan Berjalan (mini-tracking), Voucher Aktif pengguna.
- *Carousels:* Rekomendasi "UMKM Terdekat", "Produk Baru", "Sedang Trending", "Diskon Khusus", dan "Riwayat Terakhir".

### Seller Dashboard (CMS Grade)
Bukan sekadar form, melainkan *Super-App* untuk UMKM:
- **Analitik & Statistik:** Menampilkan Omzet, Total Pesanan, Produk Terjual, Grafik Penjualan (Harian/Bulanan), Grafik Pengunjung, Jam Ramai.
- **Katalog & Stok:** Manajemen Produk, Kategori, peringatan stok menipis.
- **Marketing:** Promosi, Pembuatan Voucher.
- **Operasional:** Daftar Pesanan Kanban (New, Process, Shipping, Done), Pengiriman, Laporan Keuangan/Tarikan Dana.
- **Preview Toko (Advanced):** Simulator tampilan (*Viewport Desktop, Tablet, Mobile*) yang merefleksikan perubahan toko secara seketika (*hot-reload* visual) tanpa perlu memuat ulang halaman.

---

## 6. Kompleksitas Sistem Lanjutan

### Search System (Advanced)
- **Realtime & Autocomplete:** Suggestion muncul selagi mengetik.
- **Log Data:** Menyimpan *Recent Search* dan menampilkan *Popular Search*.
- **Filter & Sort:** Berdasarkan Kategori, Rentang Harga, Rating Bintang, Jarak Geografis, Buka/Tutup, Promo, Gratis Ongkir, dan UMKM Terverifikasi.

### Notification Center
- **Tipe Buyer:** Pesanan Baru, Pesanan Diproses, Driver Menuju Toko, Driver Mengantar, Promo, Voucher, Chat Baru.
- **Tipe Seller:** Pesanan Baru, Produk Hampir Habis, Review Baru, Promo Berakhir, Chat Baru.

### Chat System
- Simulasi komunikasi dua arah yang menyimpan *Chat Rooms*, *Messages*, *Read Status*, rentang *Timestamp*, indikator *Typing* (dummy animasi), pengiriman gambar (dummy), *Quick Replies*, dan daftar percakapan (*history*).

### Flow Checkout Interaktif (15 Steps)
1. **Keranjang:** Kalkulasi subtotal awal.
2. **Konfirmasi Produk:** Modifikasi varian/catatan (*notes*).
3. **Pilih Alamat:** Menarik *state* alamat utama pembeli.
4. **Pilih Metode Pengiriman:** Instan, Same Day, Reguler.
5. **Pilih Mitra Pengiriman:** Berkonsep API *Gateway*.
6. **Pilih Driver (Khusus Instan):** Menampilkan simulasi opsi GoRide/Grab (Logo, Est. Harga, Est. Waktu, Status Driver).
7. **Pilih Pembayaran:** Opsi Bank, E-Wallet, QRIS, COD.
8. **Review Pesanan:** Rincian final ongkos kirim dan biaya admin.
9. **Pembayaran:** Simulasi gateway bayar.
10. **Pesanan Dibuat:** Masuk ke notifikasi Penjual.
11. **Seller Menerima:** Update state jadi diproses.
12. **Driver Ditugaskan:** Koordinat kurir mulai diaktifkan.
13. **Tracking Live:** Animasi Leaflet kurir mendekati tujuan.
14. **Pesanan Sampai:** Kurir menyelesaikan rute.
15. **Selesai & Riwayat:** Review form terbuka -> Masuk *History* -> Laporan omzet seller.

---

## 7. Database & ERD Terperinci (Schema Level)

30 Entitas Utama tetap dipertahankan dengan relasi mendalam:
- **`users` (1:N)** ke `addresses`, `cart_items`, `orders`, `reviews`, `activity_logs`.
- **`shops` (1:N)** ke `products`, `orders`, `vouchers`, `store_gallery`.
- **`orders` (1:1)** terikat ketat ke entitas relasional: `addressId`, `shippingMethodId`, `driverId`, `paymentId`.
- **`delivery_providers` (1:N)** ke `drivers` (Gojek memiliki banyak driver di area spesifik).
- **`chat_rooms` (1:N)** ke `messages` yang dimiliki kolaboratif oleh `buyerId` dan `shopId`.

Seluruh *Business Rules* (Aturan Bisnis) mengatur agar siklus hidup (kapan stok dipotong, kapan pesanan tak bisa dibatalkan, dsb) mengikat secara rasional. Ketiadaan struktur dalam suatu siklus tidak diperbolehkan.
