// ============================================================
// TitikLokal - Seed Data & Initial Configuration
// Fase 2: Full Relational Schema
// ============================================================

export const initialData = {
    // ----------------------------------------------------------
    // LOCATIONS
    // ----------------------------------------------------------
    locations: ["Medan", "Jakarta", "Bandung", "Surabaya", "Bali"],

    // ----------------------------------------------------------
    // CATEGORIES
    // ----------------------------------------------------------
    categories: [
        { id: "c1", name: "Kuliner", icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>` },
        { id: "c2", name: "Fashion", icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>` },
        { id: "c3", name: "Kriya", icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>` },
        { id: "c4", name: "Jasa", icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>` },
        { id: "c5", name: "Pertanian", icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` },
        { id: "c6", name: "Kesehatan", icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>` },
    ],

    // ----------------------------------------------------------
    // SHOPS (with full relational fields)
    // ----------------------------------------------------------
    shops: [
        {
            id: "toko_01",
            ownerId: "u_seller_1",
            namaToko: "Kue Balok Lumer Mang Asep",
            pemilik: "Asep Sunandar",
            kategori: "Kuliner",
            rating: 4.8,
            ulasanCount: 124,
            totalSales: 847,
            lokasi: "Bandung",
            alamat: "Jl. Braga No. 12, Bandung",
            operatingHours: {
                senin: { open: "08:00", close: "22:00", isOpen: true },
                selasa: { open: "08:00", close: "22:00", isOpen: true },
                rabu: { open: "08:00", close: "22:00", isOpen: true },
                kamis: { open: "08:00", close: "22:00", isOpen: true },
                jumat: { open: "08:00", close: "22:00", isOpen: true },
                sabtu: { open: "09:00", close: "23:00", isOpen: true },
                minggu: { open: "10:00", close: "21:00", isOpen: true },
            },
            jamBuka: "08:00 - 22:00",
            isOpen: true,
            jarakDari: { "Bandung": 0.8, "Jakarta": 150, "Medan": 1400, "Surabaya": 700, "Bali": 900 },
            saldo: 1250000,
            coverImg: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
            bannerImg: "https://images.unsplash.com/photo-1559181567-c3190aa9dbed?w=1200&q=80",
            logo: "https://ui-avatars.com/api/?name=Kue+Balok&background=2563eb&color=fff&size=128",
            deskripsi: "Menjual kue balok lumer khas Bandung dengan berbagai varian rasa premium. Dibuat dari bahan pilihan tanpa pengawet.",
            coords: [-6.917464, 107.619123],
            verificationStatus: "verified",
            bankAccount: { bank: "BCA", accountNumber: "1234567890", accountName: "Asep Sunandar" },
            produk: [
                { id: "p1", nama: "Kue Balok Cokelat Lumer (Isi 6)", harga: 25000, stok: 20, status: true, kategori: "Kuliner", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80", deskripsi: "Kue balok lumer dengan isian cokelat premium, tersedia isi 6 pcs." },
                { id: "p2", nama: "Kue Balok Keju Premium (Isi 6)", harga: 28000, stok: 15, status: true, kategori: "Kuliner", img: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=400&q=80", deskripsi: "Kue balok lumer dengan topping keju melimpah, rasa yang khas dan autentik." }
            ]
        },
        {
            id: "toko_02",
            ownerId: "system",
            namaToko: "Kripik Singkong Pedas Kraton",
            pemilik: "Dewi Sartika",
            kategori: "Kuliner",
            rating: 4.7,
            ulasanCount: 89,
            totalSales: 512,
            lokasi: "Jakarta",
            alamat: "Jl. Kemang Raya No. 45, Jakarta Selatan",
            operatingHours: { senin: { open: "09:00", close: "21:00", isOpen: true }, selasa: { open: "09:00", close: "21:00", isOpen: true }, rabu: { open: "09:00", close: "21:00", isOpen: true }, kamis: { open: "09:00", close: "21:00", isOpen: true }, jumat: { open: "09:00", close: "21:00", isOpen: true }, sabtu: { open: "10:00", close: "22:00", isOpen: true }, minggu: { open: "10:00", close: "20:00", isOpen: false } },
            jamBuka: "09:00 - 21:00",
            isOpen: true,
            jarakDari: { "Bandung": 140, "Jakarta": 2.1, "Medan": 1300, "Surabaya": 800, "Bali": 1100 },
            saldo: 850000,
            coverImg: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80",
            bannerImg: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=1200&q=80",
            logo: "https://ui-avatars.com/api/?name=Kripik+S&background=06b6d4&color=fff&size=128",
            deskripsi: "Keripik singkong legendaris dengan tingkat kepedasan yang bisa disesuaikan. Level 1-5, cocok untuk semua selera.",
            coords: [-6.208763, 106.845599],
            verificationStatus: "verified",
            bankAccount: { bank: "Mandiri", accountNumber: "0987654321", accountName: "Dewi Sartika" },
            produk: [
                { id: "p3", nama: "Keripik Level 3 (Daun Jeruk)", harga: 15000, stok: 50, status: true, kategori: "Kuliner", img: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80", deskripsi: "Keripik singkong rasa daun jeruk dengan pedas level 3 yang pas." },
                { id: "p4", nama: "Keripik Level 5 (Gila Pedas)", harga: 16000, stok: 30, status: true, kategori: "Kuliner", img: "https://images.unsplash.com/photo-1571167366136-b57e37e8e2b3?w=400&q=80", deskripsi: "Untuk pecinta pedas sejati! Level kepedasan tertinggi kami." }
            ]
        },
        {
            id: "toko_03",
            ownerId: "system",
            namaToko: "Tenun Ikat Jaya Bersama",
            pemilik: "Sitorus",
            kategori: "Fashion",
            rating: 4.9,
            ulasanCount: 45,
            totalSales: 213,
            lokasi: "Medan",
            alamat: "Jl. Sisingamangaraja No. 88, Medan",
            operatingHours: { senin: { open: "08:00", close: "18:00", isOpen: true }, selasa: { open: "08:00", close: "18:00", isOpen: true }, rabu: { open: "08:00", close: "18:00", isOpen: true }, kamis: { open: "08:00", close: "18:00", isOpen: true }, jumat: { open: "08:00", close: "17:00", isOpen: true }, sabtu: { open: "09:00", close: "16:00", isOpen: true }, minggu: { open: "00:00", close: "00:00", isOpen: false } },
            jamBuka: "08:00 - 18:00",
            isOpen: false,
            jarakDari: { "Bandung": 1450, "Jakarta": 1350, "Medan": 4.5, "Surabaya": 2100, "Bali": 2400 },
            saldo: 4300000,
            coverImg: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
            bannerImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
            logo: "https://ui-avatars.com/api/?name=Tenun+Ikat&background=7c3aed&color=fff&size=128",
            deskripsi: "Kain tenun ikat asli karya pengrajin lokal Medan. Setiap helai kain dibuat dengan tangan oleh pengrajin berpengalaman.",
            coords: [3.595196, 98.672223],
            verificationStatus: "verified",
            bankAccount: { bank: "BNI", accountNumber: "1122334455", accountName: "Sitorus" },
            produk: [
                { id: "p5", nama: "Kain Tenun Ikat Tradisional 2m", harga: 350000, stok: 5, status: true, kategori: "Fashion", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80", deskripsi: "Kain tenun ikat sepanjang 2 meter, dibuat secara tradisional oleh pengrajin lokal Medan." },
                { id: "p5b", nama: "Selendang Tenun Ikat Motif Batak", harga: 185000, stok: 8, status: true, kategori: "Fashion", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", deskripsi: "Selendang cantik dengan motif khas Batak, cocok untuk berbagai acara." }
            ]
        },
        {
            id: "toko_04",
            ownerId: "system",
            namaToko: "Sambal Bu Rudy Khas Surabaya",
            pemilik: "Rudy Hartono",
            kategori: "Kuliner",
            rating: 4.6,
            ulasanCount: 210,
            totalSales: 1024,
            lokasi: "Surabaya",
            alamat: "Jl. Dharmahusada No. 7, Surabaya",
            operatingHours: { senin: { open: "07:00", close: "20:00", isOpen: true }, selasa: { open: "07:00", close: "20:00", isOpen: true }, rabu: { open: "07:00", close: "20:00", isOpen: true }, kamis: { open: "07:00", close: "20:00", isOpen: true }, jumat: { open: "07:00", close: "19:00", isOpen: true }, sabtu: { open: "08:00", close: "20:00", isOpen: true }, minggu: { open: "08:00", close: "18:00", isOpen: true } },
            jamBuka: "07:00 - 20:00",
            isOpen: true,
            jarakDari: { "Bandung": 710, "Jakarta": 780, "Medan": 2100, "Surabaya": 1.5, "Bali": 400 },
            saldo: 1950000,
            coverImg: "https://images.unsplash.com/photo-1596450514735-111a2fe02935?w=800&q=80",
            bannerImg: "https://images.unsplash.com/photo-1601004890684-d8cbf643f572?w=1200&q=80",
            logo: "https://ui-avatars.com/api/?name=Sambal+R&background=ef4444&color=fff&size=128",
            deskripsi: "Sambal khas Surabaya yang pedasnya bikin nagih. Tersedia berbagai varian untuk menemani makan sehari-hari.",
            coords: [-7.250445, 112.768845],
            verificationStatus: "verified",
            bankAccount: { bank: "BRI", accountNumber: "5566778899", accountName: "Rudy Hartono" },
            produk: [
                { id: "p6", nama: "Sambal Bawang Pedas Botol 250gr", harga: 40000, stok: 40, status: true, kategori: "Kuliner", img: "https://images.unsplash.com/photo-1601004890684-d8cbf643f572?w=400&q=80", deskripsi: "Sambal bawang pedas dalam kemasan botol 250gr, tahan hingga 3 bulan." },
                { id: "p6b", nama: "Sambal Terasi Matang Botol 250gr", harga: 38000, stok: 35, status: true, kategori: "Kuliner", img: "https://images.unsplash.com/photo-1596450514735-111a2fe02935?w=400&q=80", deskripsi: "Sambal terasi asli dengan cita rasa khas yang menggugah selera." }
            ]
        },
        {
            id: "toko_05",
            ownerId: "system",
            namaToko: "Kerajinan Rotan Estetik Bali",
            pemilik: "I Wayan Sudana",
            kategori: "Kriya",
            rating: 4.9,
            ulasanCount: 76,
            totalSales: 389,
            lokasi: "Bali",
            alamat: "Jl. Raya Ubud No. 22, Gianyar, Bali",
            operatingHours: { senin: { open: "09:00", close: "17:00", isOpen: true }, selasa: { open: "09:00", close: "17:00", isOpen: true }, rabu: { open: "09:00", close: "17:00", isOpen: true }, kamis: { open: "09:00", close: "17:00", isOpen: true }, jumat: { open: "09:00", close: "17:00", isOpen: true }, sabtu: { open: "10:00", close: "16:00", isOpen: true }, minggu: { open: "00:00", close: "00:00", isOpen: false } },
            jamBuka: "09:00 - 17:00",
            isOpen: true,
            jarakDari: { "Bandung": 900, "Jakarta": 1100, "Medan": 2400, "Surabaya": 400, "Bali": 2.5 },
            saldo: 5700000,
            coverImg: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=800&q=80",
            bannerImg: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&q=80",
            logo: "https://ui-avatars.com/api/?name=Rotan+E&background=f59e0b&color=fff&size=128",
            deskripsi: "Kerajinan rotan estetik untuk dekorasi rumah modern. Setiap produk dibuat langsung oleh pengrajin Bali berpengalaman.",
            coords: [-8.409518, 115.188916],
            verificationStatus: "verified",
            bankAccount: { bank: "BCA", accountNumber: "9988776655", accountName: "I Wayan Sudana" },
            produk: [
                { id: "p7", nama: "Keranjang Baju Rotan Besar", harga: 120000, stok: 8, status: true, kategori: "Kriya", img: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=400&q=80", deskripsi: "Keranjang baju dari rotan alam yang kuat dan estetik." },
                { id: "p7b", nama: "Vas Bunga Rotan Minimalis", harga: 75000, stok: 12, status: true, kategori: "Kriya", img: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&q=80", deskripsi: "Vas bunga rotan dengan desain minimalis modern." }
            ]
        }
    ],

    // ----------------------------------------------------------
    // COURIERS
    // ----------------------------------------------------------
    couriers: [
        { id: "c_gosend", name: "GoSend Instant", logo: "GS", estTime: "1-2 Jam", basePrice: 15000, pricePerKm: 2500 },
        { id: "c_grab", name: "GrabExpress", logo: "GR", estTime: "1-2 Jam", basePrice: 16000, pricePerKm: 2500 },
        { id: "c_jnt", name: "J&T Reguler", logo: "JT", estTime: "2-3 Hari", basePrice: 10000, pricePerKm: 0 },
        { id: "c_jne", name: "JNE Reguler", logo: "JN", estTime: "2-4 Hari", basePrice: 9000, pricePerKm: 0 },
        { id: "c_sicepat", name: "SiCepat", logo: "SC", estTime: "1-2 Hari", basePrice: 12000, pricePerKm: 0 }
    ],

    // ----------------------------------------------------------
    // VOUCHERS
    // ----------------------------------------------------------
    vouchers: [
        { code: "LOKAL10", type: "percent", value: 10, minOrder: 50000, maxDiscount: 20000, description: "Diskon 10% untuk semua pesanan" },
        { code: "GRATIS15K", type: "flat", value: 15000, minOrder: 75000, maxDiscount: 15000, description: "Gratis ongkir Rp 15.000" },
        { code: "NEWUSER", type: "percent", value: 25, minOrder: 30000, maxDiscount: 50000, description: "Diskon 25% untuk pengguna baru" }
    ],

    // ----------------------------------------------------------
    // DUMMY BANKS
    // ----------------------------------------------------------
    banks: [
        { id: "bca", name: "BCA (Bank Central Asia)" },
        { id: "mandiri", name: "Bank Mandiri" },
        { id: "bni", name: "BNI (Bank Negara Indonesia)" },
        { id: "bri", name: "BRI (Bank Rakyat Indonesia)" },
        { id: "cimb", name: "CIMB Niaga" },
        { id: "danamon", name: "Bank Danamon" },
        { id: "bsi", name: "BSI (Bank Syariah Indonesia)" }
    ],

    // ----------------------------------------------------------
    // DUMMY GOOGLE ACCOUNTS (for simulation)
    // ----------------------------------------------------------
    googleAccounts: [
        { id: "ga_1", name: "Rina Dewi", email: "rina.dewi@gmail.com", avatar: "https://ui-avatars.com/api/?name=Rina+Dewi&background=ea4335&color=fff" },
        { id: "ga_2", name: "Budi Prasetyo", email: "budi.prasetyo@gmail.com", avatar: "https://ui-avatars.com/api/?name=Budi+Prasetyo&background=4285f4&color=fff" },
        { id: "ga_3", name: "Sari Indah", email: "sari.indah@gmail.com", avatar: "https://ui-avatars.com/api/?name=Sari+Indah&background=34a853&color=fff" }
    ],

    // ----------------------------------------------------------
    // DUMMY FACEBOOK ACCOUNTS (for simulation)
    // ----------------------------------------------------------
    facebookAccounts: [
        { id: "fb_1", name: "Ahmad Fauzi", email: "ahmad.fauzi@facebook.com", avatar: "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=1877f2&color=fff" },
        { id: "fb_2", name: "Mega Putri", email: "mega.putri@facebook.com", avatar: "https://ui-avatars.com/api/?name=Mega+Putri&background=1877f2&color=fff" }
    ],

    // ----------------------------------------------------------
    // ONBOARDING SLIDES
    // ----------------------------------------------------------
    onboarding: [
        {
            id: 1,
            title: "Temukan UMKM di Sekitarmu",
            subtitle: "Jelajahi dan temukan berbagai produk serta layanan dari UMKM terbaik di lokasi Anda.",
            image: "<svg class='w-40 h-40 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z'/><circle cx='12' cy='10' r='3' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'/></svg>",
            gradient: "from-blue-600 to-cyan-500"
        },
        {
            id: 2,
            title: "Belanja Langsung dari Pelaku Usaha",
            subtitle: "Dukung ekonomi lokal dengan bertransaksi langsung secara aman dan transparan di marketplace ini.",
            image: "<svg class='w-40 h-40 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M9 13h6'/></svg>",
            gradient: "from-violet-600 to-purple-500"
        },
        {
            id: 3,
            title: "Bantu UMKM Berkembang",
            subtitle: "Setiap pembelian Anda memberikan dampak positif bagi pertumbuhan komunitas dan ekosistem usaha lokal.",
            image: "<svg class='w-40 h-40 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M12 4v16m8-8H4M19.07 4.93l-14.14 14.14M4.93 4.93l14.14 14.14' opacity='0.2'/><path stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M17 20h5V4H2v16h5m5-10v10m-5-5h10'/></svg>",
            gradient: "from-emerald-500 to-teal-400"
        }
    ]
};
