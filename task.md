# Task List: TitikLokal V2 Implementation

## Phase 1: Folder Restructuring & Core Infrastructure
- `[x]` **Restrukturisasi File & Direktori Dasar:** Menyiapkan struktur `js/core/`, `js/services/`, dan `js/components/`.
- `[x]` **Setup `index.html` & Library Bebas-API:** Menyuntikkan Tailwind, Lucide, Leaflet, Chart.js, dan Lottie via CDN.
- `[x]` **Setup `css/styles.css`:** Menerapkan 8pt Grid, Variabel Warna, dan Skala Tipografi.
- `[x]` **Layer 2: Core State & Routing:** Membuat `js/core/store.js` dan `js/core/router.js`.
- `[x]` **Layer 4 & 5: Repository & Storage:** Mengekspansi `js/config/data.js` (30 entitas) dan membangun `js/core/api.js` serta `js/core/storage.js`.

## Phase 2: Design System & Reusable Components
- `[x]` **Core UI Library (`js/components/ui-library.js`):** Membangun komponen dasar (Input, Button, Chip, Badge, Toast, Spinner).
- `[x]` **Cards Library (`js/components/cards.js`):** Membangun StoreCard, ProductCard, ReviewCard, OrderTracker.
- `[x]` **Layouts (`js/components/layout.js`):** Refactoring AppBar, BottomNav, dan Sidebar.
- `[ ]` **Utils (`js/utils/formatters.js`):** Membuat utilitas Regex, Format Rupiah, dan Algoritma Jarak (Haversine).

## Phase 3: "Jelajah Sekitar Saya" & Buyer Personalization
- `[ ]` **Map Service (`js/services/mapService.js`):** Menangani Leaflet, klaster marker, dan kalkulasi radius tanpa Google API.
- `[ ]` **Homepage & Dashboard Buyer (`js/views/buyer.js`):** Merombak beranda agar dinamis (Rekomendasi, Riwayat).
- `[ ]` **Notification & Profile Management:** Integrasi form Alamat, QR Code Dummy, pengaturan Akun.

## Phase 4: The 15-Step Checkout Service
- `[ ]` **Checkout Service (`js/services/checkoutService.js`):** Logika kalkulasi harga, jarak, ongkir, voucher.
- `[ ]` **Checkout UI (`js/views/checkout.js`):** Wizard 15-Langkah dari konfirmasi alamat hingga pembayaran.
- `[ ]` **Live Tracking UI:** Animasi marker kurir (GoRide/Grab) pada Leaflet Map yang bergerak menuju tujuan.

## Phase 5: Seller CMS & Real-Time Sync
- `[ ]` **Dashboard UI (`js/views/seller.js`):** Grafik Chart.js, Ringkasan Penjualan.
- `[ ]` **Order Kanban & Logistics:** Fitur "Terima Pesanan", "Cetak Resi", dan "Panggil Kurir".
- `[ ]` **Preview Toko:** Mode simulasi Viewport (Mobile/Tablet/Desktop).

## Phase 6: Chat System & Notification Center
- `[ ]` **Chat Service (`js/services/chatService.js`):** Logika polling dummy, penyimpanan pesan antar `buyer` dan `seller`.
- `[ ]` **Chat UI:** Komponen gelembung chat, indikator "Typing...", dan "Read Status".
