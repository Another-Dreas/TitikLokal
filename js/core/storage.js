import { initialData } from '../config/data.js';

const STORAGE_KEY = 'titiklokal_db';
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

const getDB = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const db = {
        users: [
            { id: 'u_1', name: 'Budi Santoso', email: 'budi@mail.com', password: 'password123', role: 'buyer', phone: '08123456789', avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=2563eb&color=fff', address: 'Jl. Sudirman No. 1, Jakarta Pusat', addresses: [{ id: 'addr_1', label: 'Rumah', recipient: 'Budi Santoso', phone: '08123456789', detail: 'Jl. Sudirman No. 1, Jakarta Pusat', isDefault: true }], location: 'Jakarta', wishlist: [], following: [], bio: '', createdAt: new Date().toISOString() },
            { id: 'u_seller_1', name: 'Asep Sunandar', email: 'asep@mail.com', password: 'password123', role: 'seller', phone: '08987654321', avatar: 'https://ui-avatars.com/api/?name=Asep+Sunandar&background=06b6d4&color=fff', address: 'Jl. Braga No. 12, Bandung', addresses: [], location: 'Bandung', wishlist: [], following: [], bio: '', createdAt: new Date().toISOString() },
            { id: 'u_admin_1', name: 'Admin TitikLokal', email: 'admin@titiklokal.id', password: 'admin123', role: 'admin', phone: '081000000000', avatar: 'https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff', address: 'HQ TitikLokal', addresses: [], location: 'Jakarta', wishlist: [], following: [], bio: '', createdAt: new Date().toISOString() }
        ],
        shops: initialData.shops.map(s => ({ ...s })),
        products: initialData.shops.flatMap(s => s.produk.map(p => ({ ...p, shopId: s.id }))),
        orders: [],
        cart: [],
        chats: [],
        reviews: [],
        notifications: [],
        session: null
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
};

const saveDB = db => localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

export const api = {
    // ── AUTH ──────────────────────────────────────────────────
    login: async (email, password) => {
        await delay();
        const db = getDB();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (!user) throw new Error('Email atau password salah.');
        db.session = user.id;
        saveDB(db);
        return { ...user };
    },

    loginWithPhone: async (phone, otp) => {
        await delay(800);
        if (otp !== '123456') throw new Error('Kode OTP salah. Coba lagi.');
        const db = getDB();
        let user = db.users.find(u => u.phone === phone);
        if (!user) {
            user = { id: 'u_' + Date.now(), name: 'Pengguna ' + phone.slice(-4), email: phone + '@hp.titiklokal', password: '', role: 'buyer', phone, avatar: `https://ui-avatars.com/api/?name=User&background=2563eb&color=fff`, address: '', addresses: [], location: 'Jakarta', wishlist: [], following: [], bio: '', createdAt: new Date().toISOString() };
            db.users.push(user);
        }
        db.session = user.id;
        saveDB(db);
        return { ...user };
    },

    loginWithSocial: async (provider, accountData, role = 'buyer') => {
        await delay(1000);
        const db = getDB();
        let user = db.users.find(u => u.email === accountData.email);
        if (!user) {
            user = { id: 'u_' + Date.now(), name: accountData.name, email: accountData.email, password: '', role, phone: '', avatar: accountData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(accountData.name)}&background=2563eb&color=fff`, address: '', addresses: [], location: 'Jakarta', wishlist: [], following: [], bio: '', provider, createdAt: new Date().toISOString() };
            db.users.push(user);
        }
        db.session = user.id;
        saveDB(db);
        return { ...user };
    },

    register: async (userData) => {
        await delay(600);
        const db = getDB();
        if (db.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) throw new Error('Email sudah terdaftar.');
        const newUser = { 
            id: 'u_' + Date.now(), 
            ...userData, 
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=2563eb&color=fff`, 
            addresses: userData.address ? [{ id: 'addr_' + Date.now(), label: 'Utama', recipient: userData.name, phone: userData.phone, detail: userData.address, isDefault: true }] : [], 
            wishlist: [], 
            following: [], 
            bio: '', 
            createdAt: new Date().toISOString() 
        };
        db.users.push(newUser);
        db.session = newUser.id;
        saveDB(db);
        return { ...newUser };
    },

    registerSeller: async (wizardData) => {
        await delay(800);
        const db = getDB();
        const { owner, shop, location, hours, logo, banner, bank, password } = wizardData;
        if (db.users.find(u => u.email.toLowerCase() === owner.email.toLowerCase())) throw new Error('Email sudah terdaftar.');
        const userId = 'u_' + Date.now();
        const shopId = 'toko_' + Date.now();
        
        const newUser = { id: userId, name: owner.name, email: owner.email, password, role: 'seller', phone: owner.phone, avatar: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.name)}&background=06b6d4&color=fff`, address: location.address, addresses: [], location: location.city, wishlist: [], following: [], bio: '', createdAt: new Date().toISOString() };
        
        const newShop = { 
            id: shopId, 
            ownerId: userId, 
            namaToko: shop.name, 
            pemilik: owner.name, 
            kategori: shop.category, 
            rating: 0, 
            ulasanCount: 0, 
            totalSales: 0, 
            lokasi: location.city, 
            alamat: location.address, 
            operatingHours: hours, 
            jamBuka: '08:00 - 22:00', 
            isOpen: true, 
            jarakDari: { Bandung: 999, Jakarta: 999, Medan: 999, Surabaya: 999, Bali: 999 }, 
            saldo: 0, 
            coverImg: banner || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 
            bannerImg: banner || '', 
            logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.name)}&background=2563eb&color=fff&size=128`, 
            deskripsi: shop.description, 
            coords: [-6.2088, 106.8456], 
            verificationStatus: 'pending', 
            bankAccount: bank, 
            produk: [] 
        };
        
        db.users.push(newUser);
        db.shops.push(newShop);
        db.session = userId;
        saveDB(db);
        return { user: { ...newUser }, shop: { ...newShop } };
    },

    logout: async () => { await delay(100); const db = getDB(); db.session = null; saveDB(db); },

    getCurrentUser: async () => {
        const db = getDB();
        if (!db.session) return null;
        const u = db.users.find(u => u.id === db.session);
        return u ? { ...u } : null;
    },

    updateUser: async (updates) => {
        await delay(300);
        const db = getDB();
        const idx = db.users.findIndex(u => u.id === db.session);
        if (idx === -1) throw new Error('User tidak ditemukan');
        db.users[idx] = { ...db.users[idx], ...updates };
        if (updates.name) db.users[idx].avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updates.name)}&background=2563eb&color=fff`;
        saveDB(db);
        return { ...db.users[idx] };
    },

    // ── SHOPS & PRODUCTS ──────────────────────────────────────
    getNearbyShops: async (location) => {
        await delay(300);
        const db = getDB();
        return db.shops.map(s => { const d = initialData.shops.find(x => x.id === s.id)?.jarakDari?.[location] ?? (s.jarakDari?.[location] ?? 999); return { ...s, distance: d }; }).sort((a, b) => a.distance - b.distance);
    },

    getShopById: async (shopId) => {
        await delay(150);
        const db = getDB();
        const shop = db.shops.find(s => s.id === shopId);
        if (!shop) throw new Error('Toko tidak ditemukan');
        const products = db.products.filter(p => p.shopId === shopId && p.status);
        const reviews = db.reviews.filter(r => r.shopId === shopId);
        return { ...shop, products, reviews };
    },

    getSellerShop: async () => {
        await delay(150);
        const db = getDB();
        if (!db.session) throw new Error('Belum login');
        const shop = db.shops.find(s => s.ownerId === db.session);
        if (!shop) throw new Error('Toko tidak ditemukan');
        const products = db.products.filter(p => p.shopId === shop.id);
        const orders = db.orders.filter(o => o.shopId === shop.id);
        return { ...shop, products, orders };
    },

    // ── SELLER PRODUCT CRUD ───────────────────────────────────
    addProduct: async (productData) => {
        await delay(400);
        const db = getDB();
        const shop = db.shops.find(s => s.ownerId === db.session);
        if (!shop) throw new Error('Toko tidak ditemukan');
        const newProduct = { id: 'p_' + Date.now(), shopId: shop.id, status: true, ...productData };
        db.products.push(newProduct);
        if (!shop.produk) shop.produk = [];
        shop.produk.push(newProduct);
        saveDB(db);
        return { ...newProduct };
    },

    updateProduct: async (productId, updates) => {
        await delay(300);
        const db = getDB();
        const idx = db.products.findIndex(p => p.id === productId);
        if (idx !== -1) db.products[idx] = { ...db.products[idx], ...updates };
        const shop = db.shops.find(s => s.ownerId === db.session);
        if (shop && shop.produk) { const pi = shop.produk.findIndex(p => p.id === productId); if (pi !== -1) shop.produk[pi] = { ...shop.produk[pi], ...updates }; }
        saveDB(db);
    },

    deleteProduct: async (productId) => {
        await delay(300);
        const db = getDB();
        db.products = db.products.filter(p => p.id !== productId);
        const shop = db.shops.find(s => s.ownerId === db.session);
        if (shop && shop.produk) shop.produk = shop.produk.filter(p => p.id !== productId);
        saveDB(db);
    },

    updateShop: async (updates) => {
        await delay(400);
        const db = getDB();
        const idx = db.shops.findIndex(s => s.ownerId === db.session);
        if (idx === -1) throw new Error('Toko tidak ditemukan');
        db.shops[idx] = { ...db.shops[idx], ...updates };
        saveDB(db);
        return { ...db.shops[idx] };
    },

    // ── ORDERS ────────────────────────────────────────────────
    getCart: async () => {
        const db = getDB();
        if (!db.session) return [];
        const uc = db.cart.find(c => c.userId === db.session);
        if (!uc) return [];
        return uc.items.map(item => {
            const p = db.products.find(x => x.id === item.productId);
            if (!p) return null;
            const s = db.shops.find(x => x.id === p.shopId);
            return { ...item, productName: p.nama, price: p.harga, img: p.img, shopId: s?.id, shopName: s?.namaToko, stock: p.stok };
        }).filter(Boolean);
    },

    addToCart: async (productId, qty = 1) => {
        await delay(100);
        const db = getDB();
        if (!db.session) throw new Error('Silakan login terlebih dahulu');
        const p = db.products.find(x => x.id === productId);
        if (!p) throw new Error('Produk tidak ditemukan');
        if (p.stok < qty) throw new Error('Stok tidak mencukupi');
        let uc = db.cart.find(c => c.userId === db.session);
        if (!uc) { uc = { userId: db.session, items: [] }; db.cart.push(uc); }
        const ex = uc.items.find(i => i.productId === productId);
        if (ex) { if (ex.qty + qty > p.stok) throw new Error('Stok tidak mencukupi'); ex.qty += qty; } else { uc.items.push({ productId, qty }); }
        saveDB(db);
    },

    updateCartItemQty: async (productId, delta) => {
        const db = getDB();
        if (!db.session) return;
        const uc = db.cart.find(c => c.userId === db.session);
        if (!uc) return;
        const item = uc.items.find(i => i.productId === productId);
        if (item) {
            const p = db.products.find(x => x.id === productId);
            const nq = item.qty + delta;
            if (nq > p.stok) throw new Error('Maksimal stok tercapai');
            if (nq < 1) throw new Error('Minimal 1 item');
            item.qty = nq;
            saveDB(db);
        }
    },

    removeCartItem: async (productId) => {
        const db = getDB();
        if (!db.session) return;
        const uc = db.cart.find(c => c.userId === db.session);
        if (uc) { uc.items = uc.items.filter(i => i.productId !== productId); saveDB(db); }
    },

    createOrder: async (checkoutData) => {
        await delay(700);
        const db = getDB();
        if (!db.session) throw new Error('Silakan login terlebih dahulu');
        const uc = db.cart.find(c => c.userId === db.session);
        if (!uc || !uc.items.length) throw new Error('Keranjang kosong');
        const shopIds = [...new Set(uc.items.map(i => db.products.find(p => p.id === i.productId)?.shopId).filter(Boolean))];
        const created = [];
        shopIds.forEach(shopId => {
            const items = uc.items.filter(i => db.products.find(p => p.id === i.productId)?.shopId === shopId);
            let sub = 0;
            const enriched = items.map(item => {
                const p = db.products.find(x => x.id === item.productId);
                sub += p.harga * item.qty;
                p.stok -= item.qty;
                return { ...item, price: p.harga, productName: p.nama, img: p.img };
            });
            const order = { id: 'ORD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(), buyerId: db.session, shopId, items: enriched, subtotal: sub, discount: checkoutData.discount || 0, shippingFee: checkoutData.shippingFee, total: sub - (checkoutData.discount || 0) + checkoutData.shippingFee, courier: checkoutData.courierName, address: checkoutData.address, status: 'pending', statusHistory: [{ status: 'pending', time: new Date().toISOString(), note: 'Pesanan diterima sistem' }], createdAt: new Date().toISOString() };
            db.orders.push(order);
            created.push(order);
            // Notif for seller
            db.notifications.push({ id: 'notif_' + Date.now(), userId: db.shops.find(s => s.id === shopId)?.ownerId, type: 'new_order', title: 'Pesanan Baru!', body: `Ada ${enriched.length} item baru masuk.`, orderId: order.id, isRead: false, createdAt: new Date().toISOString() });
        });
        uc.items = [];
        saveDB(db);
        return created;
    },

    getOrders: async () => {
        await delay(200);
        const db = getDB();
        if (!db.session) return [];
        return db.orders.filter(o => o.buyerId === db.session).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => {
            const s = db.shops.find(x => x.id === o.shopId);
            return { ...o, shopName: s?.namaToko, shopLogo: s?.logo };
        });
    },

    getSellerOrders: async () => {
        await delay(200);
        const db = getDB();
        if (!db.session) return [];
        const shop = db.shops.find(s => s.ownerId === db.session);
        if (!shop) return [];
        return db.orders.filter(o => o.shopId === shop.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => {
            const buyer = db.users.find(u => u.id === o.buyerId);
            return { ...o, buyerName: buyer?.name, buyerPhone: buyer?.phone };
        });
    },

    updateOrderStatus: async (orderId, status, note = '') => {
        await delay(400);
        const db = getDB();
        const o = db.orders.find(x => x.id === orderId);
        if (!o) throw new Error('Pesanan tidak ditemukan');
        o.status = status;
        if (!o.statusHistory) o.statusHistory = [];
        o.statusHistory.push({ status, time: new Date().toISOString(), note: note || status });
        // Notif buyer
        const labels = { accepted: 'Pesanan Dikonfirmasi', shipping: 'Pesanan Dikirim', completed: 'Pesanan Selesai', cancelled: 'Pesanan Dibatalkan' };
        db.notifications.push({ id: 'notif_' + Date.now(), userId: o.buyerId, type: 'order_update', title: labels[status] || status, body: `Pesanan ${o.id} diperbarui.`, orderId, isRead: false, createdAt: new Date().toISOString() });
        if (status === 'completed') {
            const shop = db.shops.find(s => s.id === o.shopId);
            if (shop) { shop.saldo = (shop.saldo || 0) + o.subtotal; shop.totalSales = (shop.totalSales || 0) + 1; }
        }
        saveDB(db);
    },

    applyVoucher: async (code, subtotal) => {
        await delay(400);
        const v = initialData.vouchers.find(x => x.code.toUpperCase() === code.toUpperCase());
        if (!v) throw new Error('Kode voucher tidak valid');
        if (subtotal < v.minOrder) throw new Error(`Minimum belanja ${v.minOrder.toLocaleString('id-ID')} untuk voucher ini`);
        const disc = v.type === 'percent' ? Math.min(Math.floor(subtotal * v.value / 100), v.maxDiscount) : v.value;
        return { ...v, discount: disc };
    },

    // ── WISHLIST & FOLLOWING ──────────────────────────────────
    getWishlist: async () => {
        await delay(200);
        const db = getDB();
        if (!db.session) return [];
        const u = db.users.find(x => x.id === db.session);
        if (!u || !u.wishlist?.length) return [];
        return u.wishlist.map(pid => {
            const p = db.products.find(x => x.id === pid);
            if (!p) return null;
            const s = db.shops.find(x => x.id === p.shopId);
            return { ...p, shopName: s?.namaToko, shopId: s?.id };
        }).filter(Boolean);
    },

    toggleWishlist: async (productId) => {
        await delay(150);
        const db = getDB();
        if (!db.session) throw new Error('Silakan login terlebih dahulu');
        const u = db.users.find(x => x.id === db.session);
        if (!u.wishlist) u.wishlist = [];
        const exists = u.wishlist.includes(productId);
        u.wishlist = exists ? u.wishlist.filter(id => id !== productId) : [...u.wishlist, productId];
        saveDB(db);
        return !exists;
    },

    isWishlisted: (productId) => {
        const db = getDB();
        if (!db.session) return false;
        const u = db.users.find(x => x.id === db.session);
        return u?.wishlist?.includes(productId) || false;
    },

    toggleFollow: async (shopId) => {
        await delay(150);
        const db = getDB();
        if (!db.session) throw new Error('Silakan login terlebih dahulu');
        const u = db.users.find(x => x.id === db.session);
        if (!u.following) u.following = [];
        const exists = u.following.includes(shopId);
        u.following = exists ? u.following.filter(id => id !== shopId) : [...u.following, shopId];
        saveDB(db);
        return !exists;
    },

    isFollowing: (shopId) => {
        const db = getDB();
        if (!db.session) return false;
        const u = db.users.find(x => x.id === db.session);
        return u?.following?.includes(shopId) || false;
    },

    // ── REVIEWS ───────────────────────────────────────────────
    getReviews: async (shopId) => {
        await delay(200);
        const db = getDB();
        return db.reviews.filter(r => r.shopId === shopId).map(r => {
            const u = db.users.find(x => x.id === r.userId);
            return { ...r, userName: u?.name || 'Anonim', userAvatar: u?.avatar };
        });
    },

    addReview: async (shopId, productId, rating, comment) => {
        await delay(400);
        const db = getDB();
        if (!db.session) throw new Error('Silakan login terlebih dahulu');
        const review = { id: 'rev_' + Date.now(), shopId, productId, userId: db.session, rating, comment, createdAt: new Date().toISOString() };
        db.reviews.push(review);
        const shopReviews = db.reviews.filter(r => r.shopId === shopId);
        const shop = db.shops.find(s => s.id === shopId);
        if (shop) { shop.ulasanCount = shopReviews.length; shop.rating = parseFloat((shopReviews.reduce((s, r) => s + r.rating, 0) / shopReviews.length).toFixed(1)); }
        saveDB(db);
        return { ...review };
    },

    // ── CHAT ─────────────────────────────────────────────────
    getOrCreateChat: async (shopId) => {
        await delay(200);
        const db = getDB();
        if (!db.session) throw new Error('Silakan login terlebih dahulu');
        const shop = db.shops.find(s => s.id === shopId);
        if (!shop) throw new Error('Toko tidak ditemukan');
        let chat = db.chats.find(c => c.buyerId === db.session && c.shopId === shopId);
        if (!chat) {
            chat = { id: 'chat_' + Date.now(), buyerId: db.session, shopId, sellerId: shop.ownerId, messages: [{ id: 'msg_0', senderId: shop.ownerId, text: `Halo! Selamat datang di ${shop.namaToko}. Ada yang bisa kami bantu? 😊`, time: new Date().toISOString(), isRead: true }], createdAt: new Date().toISOString() };
            db.chats.push(chat);
            saveDB(db);
        }
        return { ...chat, shopName: shop.namaToko, shopLogo: shop.logo };
    },

    getChats: async () => {
        await delay(200);
        const db = getDB();
        if (!db.session) return [];
        const u = db.users.find(x => x.id === db.session);
        let userChats = [];
        if (u.role === 'buyer') userChats = db.chats.filter(c => c.buyerId === db.session);
        else userChats = db.chats.filter(c => { const s = db.shops.find(x => x.id === c.shopId); return s?.ownerId === db.session; });
        return userChats.map(c => {
            const shop = db.shops.find(s => s.id === c.shopId);
            const buyer = db.users.find(x => x.id === c.buyerId);
            const last = c.messages[c.messages.length - 1];
            return { ...c, shopName: shop?.namaToko, shopLogo: shop?.logo, buyerName: buyer?.name, lastMessage: last?.text, lastTime: last?.time };
        });
    },

    sendMessage: async (chatId, text) => {
        await delay(200);
        const db = getDB();
        if (!db.session) throw new Error('Belum login');
        const chat = db.chats.find(c => c.id === chatId);
        if (!chat) throw new Error('Chat tidak ditemukan');
        const msg = { id: 'msg_' + Date.now(), senderId: db.session, text, time: new Date().toISOString(), isRead: false };
        chat.messages.push(msg);
        saveDB(db);
        return { ...msg };
    },

    // ── NOTIFICATIONS ─────────────────────────────────────────
    getNotifications: async () => {
        await delay(150);
        const db = getDB();
        if (!db.session) return [];
        return db.notifications.filter(n => n.userId === db.session).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    markNotifRead: async (id) => {
        const db = getDB();
        const n = id === 'all' ? db.notifications.filter(x => x.userId === db.session) : [db.notifications.find(x => x.id === id)];
        n.forEach(x => { if (x) x.isRead = true; });
        saveDB(db);
    },

    // ── STATIC DATA ───────────────────────────────────────────
    getCouriers: async () => initialData.couriers,
    getLocations: async () => initialData.locations,
    getCategories: async () => initialData.categories,
    getBanks: async () => initialData.banks,
    getGoogleAccounts: async () => initialData.googleAccounts,
    getFacebookAccounts: async () => initialData.facebookAccounts,
};

getDB(); // init on load
