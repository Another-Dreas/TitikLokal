// ============================================================
// TitikLokal - Seed Data (Pematang Siantar, Sumatera Utara)
// ============================================================

export const initialData = {
    users: [
        {
            id: 'u_1', name: 'Rina Situmorang', username: 'rinasitu', email: 'rina@mail.com',
            password: 'password123', role: 'buyer', phone: '081234567890',
            avatar: 'https://ui-avatars.com/api/?name=Rina+Situmorang&background=2563eb&color=fff&bold=true',
            isActive: true, memberLevel: 'Silver', bio: 'Pelanggan setia UMKM lokal Siantar.',
            joinDate: '2024-01-15T00:00:00.000Z'
        },
        {
            id: 'u_2', name: 'Budi Panjaitan', username: 'budipanj', email: 'budi@mail.com',
            password: 'password123', role: 'buyer', phone: '082345678901',
            avatar: 'https://ui-avatars.com/api/?name=Budi+Panjaitan&background=7c3aed&color=fff&bold=true',
            isActive: true, memberLevel: 'Bronze', bio: 'Suka jajan UMKM lokal.',
            joinDate: '2024-03-10T00:00:00.000Z'
        },
        {
            id: 'u_seller_1', name: 'Asep Damanik', username: 'asepkuliner', email: 'asep@mail.com',
            password: 'password123', role: 'seller', phone: '083456789012',
            avatar: 'https://ui-avatars.com/api/?name=Asep+Damanik&background=f59e0b&color=fff&bold=true',
            isActive: true, memberLevel: 'Gold', bio: 'Pengusaha kuliner khas Siantar.',
            joinDate: '2023-06-10T00:00:00.000Z'
        },
        {
            id: 'u_seller_2', name: 'Dewi Saragih', username: 'dewikryta', email: 'dewi@mail.com',
            password: 'password123', role: 'seller', phone: '084567890123',
            avatar: 'https://ui-avatars.com/api/?name=Dewi+Saragih&background=10b981&color=fff&bold=true',
            isActive: true, memberLevel: 'Silver', bio: 'Perajin tenun ulos dan kerajinan Batak.',
            joinDate: '2024-02-01T00:00:00.000Z'
        },
        {
            id: 'u_seller_3', name: 'Parulian Hutabarat', username: 'parulianbakso', email: 'parulian@mail.com',
            password: 'password123', role: 'seller', phone: '085678901234',
            avatar: 'https://ui-avatars.com/api/?name=Parulian+H&background=ef4444&color=fff&bold=true',
            isActive: true, memberLevel: 'Silver', bio: 'Bakso dan mie ayam khas Siantar sejak 1998.',
            joinDate: '2023-09-15T00:00:00.000Z'
        }
    ],

    addresses: [
        {
            id: 'addr_1', userId: 'u_1', label: 'Rumah',
            province: 'Sumatera Utara', district: 'Kota Pematang Siantar',
            subdistrict: 'Siantar Barat', village: 'Simarito',
            postalCode: '21111', details: 'Jl. Merdeka No. 12, RT 03/RW 02',
            recipientName: 'Rina Situmorang', recipientPhone: '081234567890',
            lat: 2.9595, lng: 99.0687, isMain: true
        },
        {
            id: 'addr_2', userId: 'u_1', label: 'Kantor',
            province: 'Sumatera Utara', district: 'Kota Pematang Siantar',
            subdistrict: 'Siantar Timur', village: 'Tomuan',
            postalCode: '21114', details: 'Jl. Sangnawaluh No. 5, Gedung B',
            recipientName: 'Rina Situmorang', recipientPhone: '081234567890',
            lat: 2.9620, lng: 99.0720, isMain: false
        }
    ],

    shops: [
        {
            id: 'toko_01', ownerId: 'u_seller_1',
            name: 'Roti Ganda Siantar', slug: 'roti-ganda-siantar',
            categoryId: 'cat_kuliner',
            description: 'Roti legendaris khas Pematang Siantar sejak 1935. Dibuat dari resep turun-temurun dengan cita rasa yang tidak pernah berubah. Tersedia roti tawar, roti isi, dan berbagai kue basah segar setiap hari.',
            rating: 4.9, totalReviews: 312, totalSales: 2841, balance: 3200000,
            coords: [2.9595, 99.0690],
            address: 'Jl. Wahidin No. 12, Siantar Barat, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Roti+Ganda&background=f59e0b&color=fff&bold=true',
            verificationStatus: 'verified', isOpen: true,
            openHours: '06:00 - 21:00', whatsapp: '083456789012',
            gmapsLink: 'https://www.google.com/maps/search/Roti+Ganda+Pematang+Siantar/@2.9595,99.0690,15z'
        },
        {
            id: 'toko_02', ownerId: 'u_seller_2',
            name: 'Ulos Saragih Craft', slug: 'ulos-saragih-craft',
            categoryId: 'cat_kriya',
            description: 'Kerajinan tenun ulos Batak asli berkualitas tinggi. Dari ulos ragi hotang, sibolang, hingga sadum. Setiap helai ditenun tangan oleh pengrajin berpengalaman dari Simalungun.',
            rating: 4.7, totalReviews: 98, totalSales: 421, balance: 1850000,
            coords: [2.9640, 99.0730],
            address: 'Jl. Sutomo No. 45, Siantar Utara, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1604762433015-bc8399580df7?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Ulos+Saragih&background=10b981&color=fff&bold=true',
            verificationStatus: 'verified', isOpen: true,
            openHours: '08:00 - 17:00', whatsapp: '084567890123',
            gmapsLink: 'https://www.google.com/maps/search/Toko+Ulos+Pematang+Siantar/@2.9640,99.0730,15z'
        },
        {
            id: 'toko_03', ownerId: 'u_seller_3',
            name: 'Bakso Siantar Pak Parulian', slug: 'bakso-pak-parulian',
            categoryId: 'cat_kuliner',
            description: 'Bakso dan mie ayam kuah khas Siantar dengan cita rasa autentik. Bahan baku segar pilihan, kaldu sapi asli, dan bumbu rahasia yang membuat pelanggan selalu kembali sejak 1998.',
            rating: 4.8, totalReviews: 487, totalSales: 3201, balance: 4500000,
            coords: [2.9570, 99.0650],
            address: 'Jl. Diponegoro No. 8, Siantar Selatan, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Bakso+Siantar&background=ef4444&color=fff&bold=true',
            verificationStatus: 'verified', isOpen: true,
            openHours: '09:00 - 22:00', whatsapp: '085678901234',
            gmapsLink: 'https://www.google.com/maps/search/Bakso+Pematang+Siantar/@2.9570,99.0650,15z'
        },
        {
            id: 'toko_04', ownerId: 'u_seller_1',
            name: 'Kopi Tradisi Simalungun', slug: 'kopi-tradisi-simalungun',
            categoryId: 'cat_kuliner',
            description: 'Kopi arabika dan robusta asli dari perkebunan Simalungun. Disangrai manual dengan metode tradisional untuk menghasilkan cita rasa yang kaya dan aroma yang kuat. Tersedia biji dan bubuk.',
            rating: 4.6, totalReviews: 143, totalSales: 892, balance: 2100000,
            coords: [2.9610, 99.0700],
            address: 'Jl. Ahmad Yani No. 33, Siantar Tengah, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Kopi+Tradisi&background=92400e&color=fff&bold=true',
            verificationStatus: 'verified', isOpen: true,
            openHours: '07:00 - 20:00', whatsapp: '083456789012',
            gmapsLink: 'https://www.google.com/maps/search/Kopi+Simalungun+Pematang+Siantar/@2.9610,99.0700,15z'
        }
    ],

    products: [
        {
            id: 'p1', shopId: 'toko_01', name: 'Roti Tawar Ganda (1 Loaf)',
            description: 'Roti tawar legendaris khas Siantar. Tekstur lembut, empuk, dan tahan hingga 4 hari tanpa pengawet.',
            price: 22000, stock: 30, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', isPrimary: true }],
            totalSold: 1240, rating: 4.9, reviews: 213, weight: 400
        },
        {
            id: 'p2', shopId: 'toko_01', name: 'Roti Isi Cokelat Keju (6 Pcs)',
            description: 'Roti isi dengan kombinasi cokelat dan keju premium. Lembut, manis, dan mengenyangkan.',
            price: 35000, stock: 20, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', isPrimary: true }],
            totalSold: 876, rating: 4.8, reviews: 148, weight: 300
        },
        {
            id: 'p3', shopId: 'toko_01', name: 'Bolu Gulung Pandan (1 Roll)',
            description: 'Bolu gulung pandan dengan lapisan krim susu lembut. Oleh-oleh khas favorit dari Siantar.',
            price: 45000, stock: 15, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', isPrimary: true }],
            totalSold: 543, rating: 4.9, reviews: 97, weight: 350
        },
        {
            id: 'p4', shopId: 'toko_02', name: 'Ulos Ragi Hotang (Motif Tradisional)',
            description: 'Ulos ragi hotang tenun tangan, bermotif tradisional Simalungun. Cocok untuk upacara adat dan koleksi.',
            price: 450000, stock: 5, categoryId: 'cat_kriya', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1604762433015-bc8399580df7?w=400&q=80', isPrimary: true }],
            totalSold: 87, rating: 4.7, reviews: 43, weight: 600
        },
        {
            id: 'p5', shopId: 'toko_02', name: 'Tas Anyam Rotan Batak',
            description: 'Tas anyam dari rotan pilihan, desain motif Batak modern. Kuat, ringan, dan elegan.',
            price: 185000, stock: 8, categoryId: 'cat_kriya', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=400&q=80', isPrimary: true }],
            totalSold: 124, rating: 4.6, reviews: 38, weight: 400
        },
        {
            id: 'p6', shopId: 'toko_02', name: 'Miniatur Gorga Batak (Kayu)',
            description: 'Miniatur ukiran gorga Batak dari kayu jati pilihan. Dekorasi rumah bernilai seni tinggi.',
            price: 120000, stock: 12, categoryId: 'cat_kriya', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80', isPrimary: true }],
            totalSold: 76, rating: 4.8, reviews: 29, weight: 500
        },
        {
            id: 'p7', shopId: 'toko_03', name: 'Bakso Sapi Spesial (Isi 10)',
            description: 'Bakso sapi murni ukuran besar, kenyal dan gurih. Disajikan dengan kuah kaldu sapi asli dan mie bihun.',
            price: 28000, stock: 100, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', isPrimary: true }],
            totalSold: 2341, rating: 4.9, reviews: 387, weight: 400
        },
        {
            id: 'p8', shopId: 'toko_03', name: 'Mie Ayam Siantar Porsi Jumbo',
            description: 'Mie ayam khas Siantar dengan topping ayam cincang bumbu kecap, pangsit goreng, dan bakso tambahan.',
            price: 22000, stock: 80, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', isPrimary: true }],
            totalSold: 1876, rating: 4.8, reviews: 231, weight: 350
        },
        {
            id: 'p9', shopId: 'toko_04', name: 'Kopi Arabika Simalungun 200gr',
            description: 'Biji kopi arabika single origin dari kebun Simalungun, ketinggian 1200 mdpl. Proses natural, rasa fruity.',
            price: 85000, stock: 25, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', isPrimary: true }],
            totalSold: 432, rating: 4.7, reviews: 89, weight: 220
        },
        {
            id: 'p10', shopId: 'toko_04', name: 'Kopi Robusta Simalungun 250gr',
            description: 'Kopi robusta sangrai kuat dari perkebunan Simalungun. Rasa bold, pahit ringan, cocok untuk espresso.',
            price: 65000, stock: 30, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', isPrimary: true }],
            totalSold: 321, rating: 4.6, reviews: 67, weight: 270
        }
    ],

    categories: [
        { id: 'cat_kuliner', name: 'Kuliner', color: '#f59e0b' },
        { id: 'cat_fashion', name: 'Fashion', color: '#3b82f6' },
        { id: 'cat_kriya', name: 'Kriya', color: '#7c3aed' },
        { id: 'cat_jasa', name: 'Jasa', color: '#10b981' },
        { id: 'cat_pertanian', name: 'Tani & Kebun', color: '#22c55e' },
        { id: 'cat_kecantikan', name: 'Kecantikan', color: '#ec4899' }
    ],

    carts: [],
    cart_items: [],
    orders: [],
    order_items: [],

    payment_methods: [
        { id: 'pm_bca', type: 'Bank Transfer', code: 'BCA', name: 'BCA Virtual Account', adminFee: 4000 },
        { id: 'pm_mandiri', type: 'Bank Transfer', code: 'MDR', name: 'Mandiri Virtual Account', adminFee: 4000 },
        { id: 'pm_gopay', type: 'E-Wallet', code: 'GOPAY', name: 'GoPay', adminFee: 0 },
        { id: 'pm_ovo', type: 'E-Wallet', code: 'OVO', name: 'OVO', adminFee: 0 },
        { id: 'pm_qris', type: 'QRIS', code: 'QRIS', name: 'QRIS (Semua Bank)', adminFee: 0 },
        { id: 'pm_cod', type: 'COD', code: 'COD', name: 'Bayar di Tempat (COD)', adminFee: 0 }
    ],

    shipping_methods: [
        { id: 'sm_instan', name: 'Instan (< 2 Jam)', type: 'instant', basePrice: 0, pricePerKm: 2500, estimasi: '< 2 Jam', isDriverRequired: true },
        { id: 'sm_sameday', name: 'Same Day', type: 'sameday', basePrice: 12000, pricePerKm: 0, estimasi: 'Hari ini', isDriverRequired: false },
        { id: 'sm_reguler', name: 'Reguler (2-3 Hari)', type: 'regular', basePrice: 9000, pricePerKm: 0, estimasi: '2-3 Hari', isDriverRequired: false }
    ],

    delivery_providers: [
        { id: 'dp_goride', type: 'instant', name: 'GoRide / GoSend', basePrice: 8000, pricePerKm: 2200 },
        { id: 'dp_grab', type: 'instant', name: 'GrabExpress', basePrice: 9000, pricePerKm: 2400 },
        { id: 'dp_maxim', type: 'instant', name: 'Maxim Courier', basePrice: 7000, pricePerKm: 2000 }
    ],

    drivers: [
        { id: 'drv_1', providerId: 'dp_goride', name: 'Doni Siahaan', phone: '081999888777', plateNo: 'BK 1234 AAA', photo: 'https://ui-avatars.com/api/?name=Doni+S&background=10b981&color=fff&bold=true', rating: 4.9, totalTrips: 1240, status: 'available', currentLat: 2.9590, currentLng: 99.0680 },
        { id: 'drv_2', providerId: 'dp_grab', name: 'Eko Manurung', phone: '082222333444', plateNo: 'BK 4321 BBB', photo: 'https://ui-avatars.com/api/?name=Eko+M&background=3b82f6&color=fff&bold=true', rating: 4.7, totalTrips: 876, status: 'available', currentLat: 2.9600, currentLng: 99.0710 },
        { id: 'drv_3', providerId: 'dp_maxim', name: 'Rudi Sinaga', phone: '085600011122', plateNo: 'BK 9876 CCC', photo: 'https://ui-avatars.com/api/?name=Rudi+S&background=f59e0b&color=fff&bold=true', rating: 4.6, totalTrips: 654, status: 'available', currentLat: 2.9580, currentLng: 99.0660 }
    ],

    tracking_logs: [],
    notifications: [
        { id: 'notif_1', userId: 'u_1', type: 'promo', title: 'Promo Spesial Siantar!', message: 'Gunakan kode SIANTAR10 untuk diskon 10% pesananmu hari ini.', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'notif_2', userId: 'u_1', type: 'system', title: 'Selamat Datang di TitikLokal', message: 'Mulai jelajahi UMKM lokal di Pematang Siantar sekarang.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],

    wishlist_items: [],

    reviews: [
        { id: 'rev_1', productId: 'p1', userId: 'u_2', shopId: 'toko_01', rating: 5, comment: 'Rotinya enak banget! Lembut dan legit, sudah langganan sejak lama.', sellerReply: 'Terima kasih kak, semoga selalu puas!', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 'rev_2', productId: 'p7', userId: 'u_1', shopId: 'toko_03', rating: 5, comment: 'Baksonya juara! Kuahnya segar, baksonya kenyal. Recommended!', sellerReply: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'rev_3', productId: 'p4', userId: 'u_2', shopId: 'toko_02', rating: 5, comment: 'Kualitas ulosnya sangat bagus, motif tradisionalnya indah. Pengiriman cepat.', sellerReply: 'Terima kasih kak, semoga bermanfaat!', createdAt: new Date(Date.now() - 43200000).toISOString() },
        { id: 'rev_4', productId: 'p9', userId: 'u_1', shopId: 'toko_04', rating: 4, comment: 'Kopinya harum sekali, rasa arabikanya kuat. Suka!', sellerReply: '', createdAt: new Date(Date.now() - 21600000).toISOString() }
    ],

    vouchers: [
        { id: 'v_1', code: 'SIANTAR10', shopId: null, type: 'percent', value: 10, minOrder: 50000, maxDiscount: 20000, quota: 100, usedCount: 12, validFrom: '2025-01-01T00:00:00Z', validUntil: '2027-12-31T00:00:00Z', description: 'Diskon 10% untuk semua pesanan' },
        { id: 'v_2', code: 'GRATIS15K', shopId: null, type: 'flat', value: 15000, minOrder: 75000, maxDiscount: 15000, quota: 50, usedCount: 8, validFrom: '2025-01-01T00:00:00Z', validUntil: '2027-12-31T00:00:00Z', description: 'Potongan ongkir Rp 15.000' },
        { id: 'v_3', code: 'NEWUSER25', shopId: null, type: 'percent', value: 25, minOrder: 30000, maxDiscount: 50000, quota: 200, usedCount: 150, validFrom: '2025-01-01T00:00:00Z', validUntil: '2027-12-31T00:00:00Z', description: 'Diskon 25% untuk pengguna baru' }
    ],

    chat_rooms: [],
    messages: [],
    store_followers: [],
    activity_logs: [],
    promotions: [
        { id: 'promo_1', shopId: 'toko_01', title: 'Flash Sale Pagi', description: 'Beli 2 gratis 1 setiap pagi jam 6-9', discount: 0, type: 'bundling', validUntil: '2027-12-31T00:00:00Z', isActive: true }
    ],
    store_settings: [
        { shopId: 'toko_01', allowCod: true, autoAcceptOrders: false, minimumOrder: 20000 }
    ],
    onboarding: [
        { id: 1, title: 'Temukan UMKM di Pematang Siantar', subtitle: 'Jelajahi peta interaktif dan temukan ratusan UMKM lokal di sekitar lokasi Anda.', gradient: 'from-blue-600 to-cyan-500' },
        { id: 2, title: 'Belanja Langsung dari Pengusaha', subtitle: 'Dukung ekonomi lokal dengan bertransaksi langsung secara aman dan transparan.', gradient: 'from-violet-600 to-purple-500' },
        { id: 3, title: 'Lacak Pesananmu Secara Langsung', subtitle: 'Pantau pergerakan kurir secara real-time dari toko hingga ke pintu rumahmu.', gradient: 'from-emerald-500 to-teal-400' }
    ]
};
