# Implementation Plan: TitikLokal V2 (Architecture-Driven)

Rencana implementasi ini dirancang secara ketat untuk mematuhi **[Functional Requirement Specification (FRS) V2](file:///C:/Users/Another/.gemini/antigravity/brain/fdebef0a-3d58-4227-aca9-c2062d707ac9/frs_titiklokal.md)** dan **[Software Architecture Document (SAD)](file:///C:/Users/Another/.gemini/antigravity/brain/fdebef0a-3d58-4227-aca9-c2062d707ac9/sad_titiklokal.md)**. 

Karena skala proyek yang luar biasa masif dan memiliki arsitektur 5-Layer (Presentation, State, Business Logic, Repository, Storage), pembangunan akan dipecah ke dalam **6 Fase Eksekusi Strategis** dengan melakukan perombakan struktur *folder*.

## User Review Required

> [!IMPORTANT]
> Sesuai SAD, struktur folder proyek saat ini (`js/app.js`, `js/views/`, dll) harus dipecah/dipindahkan ke dalam struktur layer arsitektur (`js/core/`, `js/services/`, `js/components/`).
> 
> **Mohon persetujuan akhir Anda:** Jika Anda menyetujui SAD dan rencana restrukturisasi *folder* ini, saya akan langsung memulai **Fase 1**.

---

## Proposed Changes (Execution Strategy)

### Phase 1: Folder Restructuring & Core Infrastructure
**Fokus:** Membangun *Layer Architecture* dan merombak struktur folder *Frontend*.
- #### [MODIFY] `index.html` & `css/styles.css`
  Menyiapkan kontainer *Root* dan *CSS System* (variabel 8pt Grid, Typografi).
- #### [NEW] Folder System
  Membuat `js/core/store.js` (State Manager), `js/core/router.js` (Interceptor SPA), dan `js/core/api.js` (Repository Layer).
- #### [MODIFY] `js/config/data.js` & `js/core/storage.js`
  Mengekspansi *Database Schema* menjadi 30 Tabel Relasional (menambahkan *Chats*, *Drivers*, *Notifications*).

### Phase 2: Design System & Reusable Components
**Fokus:** Mengubah UI manual menjadi UI berbasis fungsi/komponen statis.
- #### [NEW] `js/components/ui-library.js` & `js/components/cards.js`
  Menulis fungsi pembuat komponen seperti `Button()`, `AppBar()`, `StoreCard()`, `OrderTracker()`.
- #### [NEW] `js/utils/formatters.js`
  Pembuatan alat bantu untuk validasi form, format rupiah, dan algoritma *Debounce*.

### Phase 3: "Jelajah Sekitar Saya" & Map Integration
**Fokus:** Mengintegrasikan Leaflet JS sebagai fitur *Core Explorer*.
- #### [NEW] `js/services/mapService.js`
  Lapisan *Business Logic* untuk menangani klaster *marker*, perhitungan radius, dan sinkronisasi dengan *UI Layer*.
- #### [MODIFY] `js/views/buyer.js`
  Merekonstruksi *Homepage Buyer* dengan konsep personalisasi (*Greeting*, *Recent Viewed*).

### Phase 4: The 15-Step Checkout Service
**Fokus:** Simulasi Transaksi tingkat lanjut.
- #### [NEW] `js/services/checkoutService.js` & `js/views/checkout.js`
  Membangun logika kalkulasi jarak, harga ongkir dinamis, dan seleksi *Driver* Instan. Semua akan dilindungi oleh *Error Boundary*.

### Phase 5: Seller CMS & Real-Time Sync
**Fokus:** Dashboard Penjual dan Sinkronisasi *State*.
- #### [MODIFY] `js/views/seller.js`
  Menyuntikkan analitik *dummy*, kanban *Orders*, manajemen katalog produk, dan tombol fungsi "Preview Mode" (Desktop/Tablet/Mobile *Viewport Simulation*).

### Phase 6: Chat System & Notification Center
**Fokus:** Komunikasi Dua Arah.
- #### [NEW] `js/services/chatService.js`
  Membuat *polling* tiruan dan *event listeners* untuk merender UI daftar *chat*, penanda telah dibaca, dan pengiriman pesan.

## Verification Plan

Sesuai SAD, strategi validasi akan difokuskan pada isolasi modul:
1. **Dependency Audit:** Memastikan *Views* tidak pernah mengakses *Storage Layer* secara langsung (Wajib melewati *API/Service*).
2. **Performance Audit:** Memastikan perenderan list produk jumlah besar menggunakan *DocumentFragment* untuk mencegah kebocoran memori DOM.
3. **End-to-End Simulation Check:** Menguji simulasi pesanan menggunakan *Driver*, memverifikasi animasi peta, *chat* dengan penjual, dan keamanan rute (Pencegahan *Buyer* masuk ke tautan *Seller*).
