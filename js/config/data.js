// ============================================================
// TitikLokal - Seed Data (Pematang Siantar, Sumatera Utara)
// ============================================================

export const initialData = {

    orders: [
        {
            id: 'ORD-1001', buyerId: 'u_1', shopId: 'toko_01',
            status: 'MENUNGGU_KONFIRMASI', paymentMethodId: 'transfer',
            items: [{ productId: 'p1', qty: 2, price: 15000 }],
            totalAmount: 30000, shippingFee: 5000,
            deliveryAddress: { label: 'Rumah', address: 'Jl. Merdeka No 1', notes: 'Pagar hitam' },
            createdAt: new Date().toISOString(),
            statusHistory: [{ status: 'MENUNGGU_KONFIRMASI', time: new Date().toISOString(), note: 'Pesanan dibuat' }]
        },
        {
            id: 'ORD-1002', buyerId: 'u_2', shopId: 'toko_02',
            status: 'DIPROSES', paymentMethodId: 'cod',
            items: [{ productId: 'p4', qty: 1, price: 250000 }],
            totalAmount: 250000, shippingFee: 0,
            deliveryAddress: { label: 'Kantor', address: 'Jl. Sudirman No 10', notes: 'Titip di resepsionis' },
            createdAt: new Date().toISOString(),
            statusHistory: [{ status: 'DIPROSES', time: new Date().toISOString(), note: 'Pesanan sedang disiapkan' }]
        },
        {
            id: 'ORD-1003', buyerId: 'u_1', shopId: 'toko_01',
            status: 'DIKIRIM', paymentMethodId: 'transfer',
            items: [{ productId: 'p2', qty: 5, price: 5000 }],
            totalAmount: 25000, shippingFee: 10000,
            deliveryAddress: { label: 'Rumah', address: 'Jl. Merdeka No 1', notes: 'Pagar hitam' },
            createdAt: new Date().toISOString(),
            statusHistory: [{ status: 'DIKIRIM', time: new Date().toISOString(), note: 'Pesanan dibawa oleh kurir' }]
        },
        {
            id: 'ORD-1004', buyerId: 'u_2', shopId: 'toko_01',
            status: 'SELESAI', paymentMethodId: 'transfer',
            items: [{ productId: 'p1', qty: 1, price: 15000 }],
            totalAmount: 15000, shippingFee: 5000,
            deliveryAddress: { label: 'Kantor', address: 'Jl. Sudirman No 10', notes: '' },
            createdAt: new Date().toISOString(),
            statusHistory: [{ status: 'SELESAI', time: new Date().toISOString(), note: 'Pesanan telah diterima' }]
        }
    ],

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
        },
        {
            id: 'u_seller_4', name: 'Martha Tampubolon', username: 'marthakue', email: 'martha@mail.com',
            password: 'password123', role: 'seller', phone: '086789012345',
            avatar: 'https://ui-avatars.com/api/?name=Martha+T&background=ec4899&color=fff&bold=true',
            isActive: true, memberLevel: 'Gold', bio: 'Pembuat kue tradisional Siantar.',
            joinDate: '2023-04-20T00:00:00.000Z'
        },
        {
            id: 'u_seller_5', name: 'Tomas Sinaga', username: 'tomasikan', email: 'tomas@mail.com',
            password: 'password123', role: 'seller', phone: '087890123456',
            avatar: 'https://ui-avatars.com/api/?name=Tomas+S&background=0891b2&color=fff&bold=true',
            isActive: true, memberLevel: 'Silver', bio: 'Penjual ikan arsik dan masakan Batak.',
            joinDate: '2023-11-05T00:00:00.000Z'
        },
        {
            id: 'u_seller_6', name: 'Linda Purba', username: 'lindabatik', email: 'linda@mail.com',
            password: 'password123', role: 'seller', phone: '088901234567',
            avatar: 'https://ui-avatars.com/api/?name=Linda+P&background=7c3aed&color=fff&bold=true',
            isActive: true, memberLevel: 'Bronze', bio: 'Pengrajin batik Siantar modern.',
            joinDate: '2024-05-12T00:00:00.000Z'
        },
        {
            id: 'u_seller_7', name: 'Robert Sihotang', username: 'robertherbal', email: 'robert@mail.com',
            password: 'password123', role: 'seller', phone: '089012345678',
            avatar: 'https://ui-avatars.com/api/?name=Robert+S&background=16a34a&color=fff&bold=true',
            isActive: true, memberLevel: 'Silver', bio: 'Produsen jamu dan herbal Simalungun.',
            joinDate: '2023-07-18T00:00:00.000Z'
        },
        {
            id: 'u_seller_8', name: 'Fransisca Nainggolan', username: 'fransiscasouvenir', email: 'fransisca@mail.com',
            password: 'password123', role: 'seller', phone: '081122334455',
            avatar: 'https://ui-avatars.com/api/?name=Fransisca+N&background=d97706&color=fff&bold=true',
            isActive: true, memberLevel: 'Gold', bio: 'Toko oleh-oleh khas Siantar terlengkap.',
            joinDate: '2023-01-10T00:00:00.000Z'
        },
        {
            id: 'u_seller_9', name: 'Mangasi Simbolon', username: 'mangasielectronic', email: 'mangasi@mail.com',
            password: 'password123', role: 'seller', phone: '082233445566',
            avatar: 'https://ui-avatars.com/api/?name=Mangasi+S&background=1e40af&color=fff&bold=true',
            isActive: true, memberLevel: 'Bronze', bio: 'Service dan aksesoris elektronik.',
            joinDate: '2024-01-25T00:00:00.000Z'
        },
        {
            id: 'u_seller_10', name: 'Yanti Manullang', username: 'yantiflower', email: 'yanti@mail.com',
            password: 'password123', role: 'seller', phone: '083344556677',
            avatar: 'https://ui-avatars.com/api/?name=Yanti+M&background=be185d&color=fff&bold=true',
            isActive: true, memberLevel: 'Silver', bio: 'Florist dan dekorasi acara Siantar.',
            joinDate: '2023-08-30T00:00:00.000Z'
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
            coords: [2.9650, 99.0770],
            address: 'Jl. Wahidin No. 12, Siantar Barat, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Roti+Ganda&background=f59e0b&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 97, isOpen: true,
            openHours: '06:00 - 21:00', whatsapp: '083456789012',
            gmapsLink: 'https://www.google.com/maps/search/Roti+Ganda+Pematang+Siantar/@2.9595,99.0690,15z'
        },
        {
            id: 'toko_02', ownerId: 'u_seller_2',
            name: 'Ulos Saragih Craft', slug: 'ulos-saragih-craft',
            categoryId: 'cat_kriya',
            description: 'Kerajinan tenun ulos Batak asli berkualitas tinggi. Dari ulos ragi hotang, sibolang, hingga sadum. Setiap helai ditenun tangan oleh pengrajin berpengalaman dari Simalungun.',
            rating: 4.7, totalReviews: 98, totalSales: 421, balance: 1850000,
            coords: [2.9635, 99.0760],
            address: 'Jl. Sutomo No. 45, Siantar Utara, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1604762433015-bc8399580df7?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Ulos+Saragih&background=10b981&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 99, isOpen: true,
            openHours: '08:00 - 17:00', whatsapp: '084567890123',
            gmapsLink: 'https://www.google.com/maps/search/Toko+Ulos+Pematang+Siantar/@2.9640,99.0730,15z'
        },
        {
            id: 'toko_03', ownerId: 'u_seller_3',
            name: 'Bakso Siantar Pak Parulian', slug: 'bakso-pak-parulian',
            categoryId: 'cat_kuliner',
            description: 'Bakso dan mie ayam kuah khas Siantar dengan cita rasa autentik. Bahan baku segar pilihan, kaldu sapi asli, dan bumbu rahasia yang membuat pelanggan selalu kembali sejak 1998.',
            rating: 4.8, totalReviews: 487, totalSales: 3201, balance: 4500000,
            coords: [2.9410, 99.0700],
            address: 'Jl. Diponegoro No. 8, Siantar Selatan, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Bakso+Siantar&background=ef4444&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 90, isOpen: true,
            openHours: '09:00 - 22:00', whatsapp: '085678901234',
            gmapsLink: 'https://www.google.com/maps/search/Bakso+Pematang+Siantar/@2.9570,99.0650,15z'
        },
        {
            id: 'toko_04', ownerId: 'u_seller_1',
            name: 'Kopi Tradisi Simalungun', slug: 'kopi-tradisi-simalungun',
            categoryId: 'cat_kuliner',
            description: 'Kopi arabika dan robusta asli dari perkebunan Simalungun. Disangrai manual dengan metode tradisional untuk menghasilkan cita rasa yang kaya dan aroma yang kuat. Tersedia biji dan bubuk.',
            rating: 4.6, totalReviews: 143, totalSales: 892, balance: 2100000,
            coords: [2.9645, 99.0755],
            address: 'Jl. Ahmad Yani No. 33, Siantar Tengah, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Kopi+Tradisi&background=92400e&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 95, isOpen: true,
            openHours: '07:00 - 20:00', whatsapp: '083456789012',
            gmapsLink: 'https://www.google.com/maps/search/Kopi+Simalungun+Pematang+Siantar/@2.9610,99.0700,15z'
        },
        {
            id: 'toko_05', ownerId: 'u_seller_4',
            name: 'Kue Tradisional Martha', slug: 'kue-tradisional-martha',
            categoryId: 'cat_kuliner',
            description: 'Aneka kue tradisional khas Batak dan jajanan pasar segar setiap hari. Lapet, ombus-ombus, dan kue basah lainnya dibuat dengan bahan alami tanpa pengawet.',
            rating: 4.8, totalReviews: 215, totalSales: 1540, balance: 1200000,
            coords: [2.9580, 99.0620],
            address: 'Jl. Melati No. 10, Siantar Barat, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Kue+Martha&background=ec4899&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 96, isOpen: true,
            openHours: '06:00 - 15:00', whatsapp: '086789012345',
            gmapsLink: 'https://www.google.com/maps/search/Kue+Martha+Pematang+Siantar/@2.9650,99.0620,15z'
        },
        {
            id: 'toko_06', ownerId: 'u_seller_5',
            name: 'RM Toba Nauli (Tomas)', slug: 'rm-toba-nauli',
            categoryId: 'cat_kuliner',
            description: 'Rumah makan khas Batak Toba yang menyajikan ikan mas arsik, naniura, sangsang, dan babi panggang karo (BPK) dengan resep asli Toba. Halal & Non-Halal terpisah.',
            rating: 4.7, totalReviews: 320, totalSales: 2100, balance: 5400000,
            coords: [2.9380, 99.0820],
            address: 'Jl. Sisingamangaraja No. 88, Siantar Utara, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=RM+Toba+Nauli&background=0891b2&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 85, isOpen: true,
            openHours: '10:00 - 22:00', whatsapp: '087890123456',
            gmapsLink: 'https://www.google.com/maps/search/RM+Toba+Nauli+Pematang+Siantar/@2.9550,99.0750,15z'
        },
        {
            id: 'toko_07', ownerId: 'u_seller_6',
            name: 'Batik Siantar Linda', slug: 'batik-siantar-linda',
            categoryId: 'cat_fashion',
            description: 'Pusat batik khas Pematang Siantar dengan motif gabungan corak ulos dan flora Simalungun. Tersedia bahan kain, kemeja pria, dan dress wanita untuk acara formal.',
            rating: 4.9, totalReviews: 145, totalSales: 890, balance: 3500000,
            coords: [2.9630, 99.0780],
            address: 'Jl. Merdeka No. 45, Siantar Timur, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Batik+Linda&background=7c3aed&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 89, isOpen: true,
            openHours: '09:00 - 18:00', whatsapp: '088901234567',
            gmapsLink: 'https://www.google.com/maps/search/Batik+Linda+Pematang+Siantar/@2.9580,99.0610,15z'
        },
        {
            id: 'toko_08', ownerId: 'u_seller_7',
            name: 'Jamu Herbal Simalungun', slug: 'jamu-herbal-simalungun',
            categoryId: 'cat_kesehatan',
            description: 'Toko herbal yang menyediakan jamu tradisional khas Simalungun dan Nusantara. Diramu dari empon-empon segar pilihan setiap hari untuk menjaga daya tahan tubuh.',
            rating: 4.6, totalReviews: 89, totalSales: 540, balance: 950000,
            coords: [2.9450, 99.0650],
            address: 'Jl. Cokroaminoto No. 12, Siantar Utara, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1615486511484-92e172a2754c?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Jamu+Herbal&background=16a34a&color=fff&bold=true',
            verificationStatus: 'unverified', chatResponseRate: 94, isOpen: true,
            openHours: '07:00 - 17:00', whatsapp: '089012345678',
            gmapsLink: 'https://www.google.com/maps/search/Jamu+Simalungun+Pematang+Siantar/@2.9630,99.0680,15z'
        },
        {
            id: 'toko_09', ownerId: 'u_seller_8',
            name: 'Pusat Oleh-Oleh Fransisca', slug: 'pusat-oleh-oleh-fransisca',
            categoryId: 'cat_kuliner',
            description: 'Pusat oleh-oleh terlengkap di Pematang Siantar. Menyediakan kacang tumbuk, ting-ting, teng-teng, sirup markisa, dan aneka snack khas Sumatera Utara.',
            rating: 4.8, totalReviews: 450, totalSales: 3200, balance: 7200000,
            coords: [2.9655, 99.0765],
            address: 'Jl. Sutomo No. 100, Siantar Timur, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Oleh+Oleh+Fransisca&background=d97706&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 91, isOpen: true,
            openHours: '08:00 - 21:00', whatsapp: '081122334455',
            gmapsLink: 'https://www.google.com/maps/search/Oleh-oleh+Siantar/@2.9600,99.0720,15z'
        },
        {
            id: 'toko_10', ownerId: 'u_seller_9',
            name: 'Mangasi Service & Elektronik', slug: 'mangasi-elektronik',
            categoryId: 'cat_jasa',
            description: 'Jasa servis laptop, handphone, dan penjualan aksesoris komputer. Berpengalaman lebih dari 10 tahun melayani mahasiswa dan pekerja di Pematang Siantar.',
            rating: 4.5, totalReviews: 120, totalSales: 450, balance: 1800000,
            coords: [2.9440, 99.0580],
            address: 'Jl. Vihara No. 25, Siantar Selatan, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Mangasi+Elektronik&background=1e40af&color=fff&bold=true',
            verificationStatus: 'unverified', chatResponseRate: 99, isOpen: true,
            openHours: '09:00 - 20:00', whatsapp: '082233445566',
            gmapsLink: 'https://www.google.com/maps/search/Service+Laptop+Siantar/@2.9560,99.0670,15z'
        },
        {
            id: 'toko_11', ownerId: 'u_seller_10',
            name: 'Yanti Florist & Dekor', slug: 'yanti-florist',
            categoryId: 'cat_jasa',
            description: 'Melayani pembuatan buket bunga segar, papan bunga ucapan (papan bunga khas Medan/Siantar), dan dekorasi pelaminan untuk acara adat maupun nasional.',
            rating: 4.9, totalReviews: 310, totalSales: 1800, balance: 4500000,
            coords: [2.9350, 99.0750],
            address: 'Jl. Asahan Km 1, Siantar Timur, Pematang Siantar',
            coverImg: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80',
            logo: 'https://ui-avatars.com/api/?name=Yanti+Florist&background=be185d&color=fff&bold=true',
            verificationStatus: 'verified', chatResponseRate: 99, isOpen: true,
            openHours: '07:00 - 19:00', whatsapp: '083344556677',
            gmapsLink: 'https://www.google.com/maps/search/Papan+Bunga+Siantar/@2.9625,99.0710,15z'
        },
        { id: 'toko_12', ownerId: 'u_seller_1', name: 'Warung Nasi Mpok Atik', slug: 'warung-nasi-mpok-atik', categoryId: 'cat_kuliner', description: 'Nasi campur murah meriah.', rating: 4.3, totalReviews: 45, totalSales: 300, balance: 120000, coords: [2.9540, 99.0630], address: 'Jl. Merdeka No 10', coverImg: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Warung+Nasi&background=eab308&color=fff&bold=true', verificationStatus: 'unverified', chatResponseRate: 87, isOpen: true, openHours: '08:00 - 15:00', whatsapp: '0812' },
        { id: 'toko_13', ownerId: 'u_seller_2', name: 'Kopi Kenangan Senja', slug: 'kopi-kenangan-senja', categoryId: 'cat_kuliner', description: 'Kopi susu gula aren.', rating: 4.8, totalReviews: 210, totalSales: 890, balance: 400000, coords: [2.9555, 99.0660], address: 'Jl. Sutomo No 15', coverImg: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Kopi+Kenangan&background=8b5cf6&color=fff&bold=true', verificationStatus: 'verified', chatResponseRate: 93, isOpen: true, openHours: '09:00 - 22:00', whatsapp: '0812' },
        { id: 'toko_14', ownerId: 'u_seller_3', name: 'Toko Baju Kekinian', slug: 'toko-baju-kekinian', categoryId: 'cat_fashion', description: 'Pakaian pria dan wanita.', rating: 4.5, totalReviews: 80, totalSales: 400, balance: 350000, coords: [2.9565, 99.0680], address: 'Jl. Sutomo No 18', coverImg: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Toko+Baju&background=ec4899&color=fff&bold=true', verificationStatus: 'verified', chatResponseRate: 95, isOpen: true, openHours: '10:00 - 20:00', whatsapp: '0812' },
        { id: 'toko_15', ownerId: 'u_seller_4', name: 'Laundry Bersih Kilat', slug: 'laundry-bersih-kilat', categoryId: 'cat_jasa', description: 'Laundry kiloan dan satuan.', rating: 4.6, totalReviews: 120, totalSales: 500, balance: 250000, coords: [2.9575, 99.0700], address: 'Jl. Ahmad Yani No 2', coverImg: 'https://images.unsplash.com/photo-1582735689149-c5615d971578?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Laundry+Bersih&background=0ea5e9&color=fff&bold=true', verificationStatus: 'unverified', chatResponseRate: 85, isOpen: true, openHours: '07:00 - 21:00', whatsapp: '0812' },
        { id: 'toko_16', ownerId: 'u_seller_5', name: 'Apotek Sehat Selalu', slug: 'apotek-sehat-selalu', categoryId: 'cat_kesehatan', description: 'Obat generik dan resep dokter.', rating: 4.9, totalReviews: 300, totalSales: 1500, balance: 800000, coords: [2.9585, 99.0720], address: 'Jl. Merdeka No 55', coverImg: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Apotek+Sehat&background=10b981&color=fff&bold=true', verificationStatus: 'verified', chatResponseRate: 88, isOpen: true, openHours: '08:00 - 22:00', whatsapp: '0812' },
        { id: 'toko_17', ownerId: 'u_seller_6', name: 'Toko Sepatu Langkah', slug: 'toko-sepatu-langkah', categoryId: 'cat_fashion', description: 'Sepatu sekolah dan olahraga.', rating: 4.4, totalReviews: 95, totalSales: 350, balance: 180000, coords: [2.9595, 99.0740], address: 'Jl. Vihara No 8', coverImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Toko+Sepatu&background=f97316&color=fff&bold=true', verificationStatus: 'unverified', chatResponseRate: 86, isOpen: true, openHours: '09:00 - 18:00', whatsapp: '0812' },
        { id: 'toko_18', ownerId: 'u_seller_7', name: 'Mie Pangsit Siantar', slug: 'mie-pangsit-siantar', categoryId: 'cat_kuliner', description: 'Mie pangsit babi khas.', rating: 4.7, totalReviews: 400, totalSales: 2000, balance: 900000, coords: [2.9605, 99.0610], address: 'Jl. Surabaya No 12', coverImg: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Mie+Pangsit&background=f43f5e&color=fff&bold=true', verificationStatus: 'verified', chatResponseRate: 91, isOpen: true, openHours: '06:00 - 15:00', whatsapp: '0812' },
        { id: 'toko_19', ownerId: 'u_seller_8', name: 'Bengkel Motor Maju', slug: 'bengkel-motor-maju', categoryId: 'cat_jasa', description: 'Servis motor semua merk.', rating: 4.2, totalReviews: 60, totalSales: 200, balance: 150000, coords: [2.9615, 99.0630], address: 'Jl. Cokroaminoto No 20', coverImg: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Bengkel+Motor&background=64748b&color=fff&bold=true', verificationStatus: 'unverified', chatResponseRate: 93, isOpen: true, openHours: '08:00 - 17:00', whatsapp: '0812' },
        { id: 'toko_20', ownerId: 'u_seller_9', name: 'Sayur Segar Makmur', slug: 'sayur-segar-makmur', categoryId: 'cat_pertanian', description: 'Sayuran segar dari petani.', rating: 4.8, totalReviews: 150, totalSales: 800, balance: 300000, coords: [2.9625, 99.0650], address: 'Pasar Parluasan', coverImg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Sayur+Segar&background=22c55e&color=fff&bold=true', verificationStatus: 'verified', chatResponseRate: 96, isOpen: true, openHours: '05:00 - 12:00', whatsapp: '0812' },
        { id: 'toko_21', ownerId: 'u_seller_10', name: 'Toko Elektronik Cahaya', slug: 'toko-elektronik-cahaya', categoryId: 'cat_jasa', description: 'Sparepart dan aksesoris HP.', rating: 4.5, totalReviews: 110, totalSales: 600, balance: 400000, coords: [2.9635, 99.0670], address: 'Jl. Sutomo No 100', coverImg: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80', logo: 'https://ui-avatars.com/api/?name=Toko+Elektronik&background=6366f1&color=fff&bold=true', verificationStatus: 'verified', chatResponseRate: 88, isOpen: true, openHours: '10:00 - 21:00', whatsapp: '0812' }
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
        },
        {
            id: 'p11', shopId: 'toko_05', name: 'Kue Ombus-Ombus (Isi 10)',
            description: 'Kue tradisional Batak dari tepung beras dan kelapa parut dengan isian gula merah lumer. Disajikan hangat lebih nikmat.',
            price: 25000, stock: 50, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80', isPrimary: true }],
            totalSold: 890, rating: 4.9, reviews: 145, weight: 500
        },
        {
            id: 'p12', shopId: 'toko_06', name: 'Ikan Mas Arsik Porsi Keluarga',
            description: 'Ikan mas segar dimasak dengan bumbu arsik khas Toba (andaliman, asam cikala, rias). Rasanya asam, pedas, dan gurih.',
            price: 120000, stock: 15, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', isPrimary: true }],
            totalSold: 432, rating: 4.8, reviews: 112, weight: 1000
        },
        {
            id: 'p13', shopId: 'toko_07', name: 'Kemeja Batik Pria Motif Ulos',
            description: 'Kemeja lengan pendek bahan katun premium dengan motif cetak ulos modern. Nyaman dipakai untuk acara formal maupun kasual.',
            price: 185000, stock: 40, categoryId: 'cat_fashion', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80', isPrimary: true }],
            totalSold: 210, rating: 4.7, reviews: 85, weight: 250
        },
        {
            id: 'p14', shopId: 'toko_08', name: 'Jamu Kunyit Asam Botol 1 Liter',
            description: 'Minuman kesehatan tradisional dari kunyit dan asam jawa asli. Menyegarkan dan baik untuk pencernaan serta daya tahan tubuh.',
            price: 35000, stock: 30, categoryId: 'cat_kesehatan', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1615486511484-92e172a2754c?w=400&q=80', isPrimary: true }],
            totalSold: 560, rating: 4.8, reviews: 120, weight: 1100
        },
        {
            id: 'p15', shopId: 'toko_09', name: 'Kacang Tumbuk Khas Siantar (500g)',
            description: 'Cemilan manis dan renyah dari kacang tanah pilihan bermutu tinggi. Oleh-oleh wajib saat berkunjung ke Siantar.',
            price: 45000, stock: 80, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400&q=80', isPrimary: true }],
            totalSold: 1250, rating: 4.9, reviews: 310, weight: 550
        },
        {
            id: 'p16', shopId: 'toko_10', name: 'Service Laptop Install Ulang Windows',
            description: 'Jasa instal ulang Windows 10/11 lengkap dengan aplikasi standar (Office, Browser, PDF Reader). Pengerjaan 2-3 jam.',
            price: 150000, stock: 99, categoryId: 'cat_jasa', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80', isPrimary: true }],
            totalSold: 340, rating: 4.6, reviews: 88, weight: 0
        },
        {
            id: 'p17', shopId: 'toko_11', name: 'Papan Bunga Ukuran Double (2x3m)',
            description: 'Papan bunga ucapan selamat atau duka cita ukuran besar. Bebas pilih warna dasar dan jenis font. Free ongkir area Siantar.',
            price: 350000, stock: 10, categoryId: 'cat_jasa', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80', isPrimary: true }],
            totalSold: 120, rating: 4.9, reviews: 65, weight: 0
        },
        {
            id: 'p18', shopId: 'toko_09', name: 'Ting-Ting Kacang Asli Siantar',
            description: 'Cemilan manis dan gurih khas Siantar, dibuat dari kacang pilihan dan gula berkualitas. Cocok untuk oleh-oleh keluarga.',
            price: 35000, stock: 50, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400&q=80', isPrimary: true }],
            totalSold: 845, rating: 4.8, reviews: 156, weight: 300
        },
        {
            id: 'p19', shopId: 'toko_09', name: 'Sirup Markisa Asli Simalungun',
            description: 'Sirup buah markisa murni tanpa pemanis buatan. Rasanya asam manis menyegarkan, oleh-oleh wajib khas Sumatera Utara.',
            price: 65000, stock: 40, categoryId: 'cat_kuliner', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=400&q=80', isPrimary: true }],
            totalSold: 1102, rating: 4.9, reviews: 290, weight: 800
        },
        {
            id: 'p20', shopId: 'toko_02', name: 'Gantungan Kunci Motif Ulos',
            description: 'Gantungan kunci cantik dengan paduan motif ulos asli dan kayu ukir. Pilihan souvenir kerajinan khas lokal yang menarik.',
            price: 15000, stock: 120, categoryId: 'cat_kriya', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=400&q=80', isPrimary: true }],
            totalSold: 420, rating: 4.6, reviews: 85, weight: 50
        },
        {
            id: 'p21', shopId: 'toko_02', name: 'Syal Tenun Ulos Batak',
            description: 'Syal tenun tangan motif Batak yang elegan dan hangat. Dapat digunakan untuk acara formal maupun aksesoris sehari-hari.',
            price: 125000, stock: 25, categoryId: 'cat_kriya', status: true,
            images: [{ imgUrl: 'https://images.unsplash.com/photo-1604762433015-bc8399580df7?w=400&q=80', isPrimary: true }],
            totalSold: 215, rating: 4.8, reviews: 92, weight: 200
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
        // ── toko_01: Roti Ganda Siantar (seller test account) ──────────────────
        { id: 'rev_1',  productId: 'p1', userId: 'u_2', shopId: 'toko_01', rating: 5, comment: 'Rotinya enak banget! Lembut dan legit, sudah langganan sejak lama. Setiap pagi pasti beli sini deh.', sellerReply: 'Terima kasih banyak kak Budi! Senang sekali bisa jadi pilihan sarapan keluarga. Sampai jumpa besok pagi ya!', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 'rev_5',  productId: 'p2', userId: 'u_1', shopId: 'toko_01', rating: 5, comment: 'Roti isi coklat kejunya melimpah banget, anak-anak suka banget! Kemarin beli 2 bungkus langsung habis. Highly recommended!', sellerReply: '', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'rev_6',  productId: 'p3', userId: 'u_2', shopId: 'toko_01', rating: 4, comment: 'Bolu gulungnya enak tapi menurut saya sedikit terlalu manis. Teksturnya lembut banget sih, mungkin next time minta yang versi less sugar.', sellerReply: '', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: 'rev_7',  productId: 'p1', userId: 'u_1', shopId: 'toko_01', rating: 5, comment: 'Sudah jadi oleh-oleh favorit saya kalau dari Siantar. Dibawa ke Jakarta masih enak dan tahan 3 hari. Packagingnya juga rapi.', sellerReply: '', createdAt: new Date(Date.now() - 10800000).toISOString() },
        { id: 'rev_8',  productId: 'p2', userId: 'u_2', shopId: 'toko_01', rating: 5, comment: 'Pesenan saya cepat banget diproses. Roti masih hangat waktu sampai, isinya penuh tidak pelit. Penjual ramah dan responsif juga.', sellerReply: 'Wah terima kasih kak! Kami selalu usahakan kirim selagi hangat. Senang bisa melayani!', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'rev_9',  productId: 'p3', userId: 'u_1', shopId: 'toko_01', rating: 4, comment: 'Bolu gulung pandannya harum banget, krimnya tidak terlalu berat. Cocok untuk teman ngopi pagi. Ukurannya cukup besar untuk harganya.', sellerReply: '', createdAt: new Date(Date.now() - 14400000).toISOString() },
        { id: 'rev_10', productId: 'p1', userId: 'u_2', shopId: 'toko_01', rating: 3, comment: 'Rotinya masih enak tapi kali ini terasa agak kurang empuk dibanding biasanya. Mungkin karena saya ambil sore hari jadi kurang fresh? Tetap akan balik lagi kok.', sellerReply: '', createdAt: new Date(Date.now() - 18000000).toISOString() },
        { id: 'rev_11', productId: 'p2', userId: 'u_1', shopId: 'toko_01', rating: 5, comment: 'Kualitasnya konsisten! Sudah berlangganan hampir 2 tahun, tidak pernah kecewa. Roti isi kejunya selalu juara. Teruskan ya kak!', sellerReply: '', createdAt: new Date(Date.now() - 21600000).toISOString() },
        { id: 'rev_12', productId: 'p3', userId: 'u_2', shopId: 'toko_01', rating: 5, comment: 'Saya pesan buat ulang tahun ponakan, dikemas cantik dan rapi sekali. Rasanya juga tidak mengecewakan. Pasti order lagi untuk acara berikutnya!', sellerReply: '', createdAt: new Date(Date.now() - 43200000).toISOString() },

        // ── toko lain (untuk kelengkapan data) ───────────────────────────────
        { id: 'rev_2',  productId: 'p7',  userId: 'u_1', shopId: 'toko_03', rating: 5, comment: 'Baksonya juara! Kuahnya segar, baksonya kenyal. Recommended!', sellerReply: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'rev_3',  productId: 'p4',  userId: 'u_2', shopId: 'toko_02', rating: 5, comment: 'Kualitas ulosnya sangat bagus, motif tradisionalnya indah. Pengiriman cepat.', sellerReply: 'Terima kasih kak, semoga bermanfaat!', createdAt: new Date(Date.now() - 43200000).toISOString() },
        { id: 'rev_4',  productId: 'p9',  userId: 'u_1', shopId: 'toko_04', rating: 4, comment: 'Kopinya harum sekali, rasa arabikanya kuat. Suka!', sellerReply: '', createdAt: new Date(Date.now() - 21600000).toISOString() }
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
