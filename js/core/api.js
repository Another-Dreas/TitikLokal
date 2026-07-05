/**
 * TitikLokal - Repository / API Layer (SAD Compliant)
 * Mensimulasikan REST API dengan async/await + artificial network delay.
 * TIDAK memanipulasi DOM di sini.
 */

import { storage } from './storage.js';
import { formatters } from '../utils/formatters.js';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const api = {

    // ── AUTH ──────────────────────────────────────────────────
    login: async (email, password, role) => {
        await delay(500);
        const user = storage.findOne('users', u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password &&
            u.role === role
        );
        if (!user) throw new Error('Email atau kata sandi salah.');
        if (!user.isActive) throw new Error('Akun ini telah dinonaktifkan.');
        storage.setSession(user.id);
        const { password: _, ...safeUser } = user;
        return { token: `TL_SESS_${user.id}`, user: safeUser };
    },

    register: async (userData) => {
        await delay(600);
        const existing = storage.findOne('users', u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existing) throw new Error('Email sudah digunakan akun lain.');

        const newUser = {
            ...userData,
            id: `u_${Date.now()}`,
            isActive: true,
            memberLevel: 'Bronze',
            joinDate: new Date().toISOString()
        };
        storage.insert('users', newUser);
        storage.setSession(newUser.id);
        const { password: _, ...safeUser } = newUser;
        return { token: `TL_SESS_${newUser.id}`, user: safeUser };
    },

    logout: () => {
        storage.clearSession();
    },

    getCurrentUser: () => {
        return storage.getSession();
    },

    // ── USERS ─────────────────────────────────────────────────
    updateUser: async (userId, updates) => {
        await delay(300);
        return storage.updateById('users', userId, updates);
    },

    // ── SHOPS ─────────────────────────────────────────────────
    getShops: async () => {
        await delay(250);
        return storage.get('shops');
    },

    getShopById: async (shopId) => {
        await delay(200);
        const shop = storage.findOne('shops', s => s.id === shopId);
        if (!shop) throw new Error('Toko tidak ditemukan.');
        return shop;
    },

    getShopReviews: async (shopId) => {
        await delay(200);
        const reviews = storage.get('reviews') || [];
        const products = storage.get('products') || [];
        const users = storage.get('users') || [];
        return reviews
            .filter(r => r.shopId === shopId)
            .map(r => ({
                ...r,
                productName: (products.find(p => p.id === r.productId) || {}).name || 'Produk Tidak Ditemukan',
                userName: (users.find(u => u.id === r.userId) || {}).name || 'Pengguna'
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getShopsByOwnerId: async (ownerId) => {
        await delay(200);
        return storage.findMany('shops', s => s.ownerId === ownerId);
    },

    getShopByOwner: async (ownerId) => {
        await delay(200);
        return storage.findOne('shops', s => s.ownerId === ownerId);
    },

    updateShop: async (shopId, updates) => {
        await delay(300);
        return storage.updateById('shops', shopId, updates);
    },

    // ── PRODUCTS ──────────────────────────────────────────────
    getAllProducts: async () => {
        await delay(200);
        return storage.get('products');
    },

    getProductsByShop: async (shopId) => {
        await delay(200);
        return storage.findMany('products', p => p.shopId === shopId);
    },

    getProductById: async (productId) => {
        await delay(150);
        return storage.findOne('products', p => p.id === productId);
    },

    addProduct: async (productData) => {
        await delay(400);
        const product = { ...productData, id: `p_${Date.now()}` };
        return storage.insert('products', product);
    },

    updateProduct: async (productId, updates) => {
        await delay(300);
        return storage.updateById('products', productId, updates);
    },

    deleteProduct: async (productId) => {
        await delay(300);
        storage.deleteById('products', productId);
    },

    // ── CATEGORIES ────────────────────────────────────────────
    getCategories: async () => {
        await delay(100);
        return storage.get('categories');
    },

    // ── ADDRESSES ─────────────────────────────────────────────
    getAddresses: async (userId) => {
        await delay(200);
        return storage.findMany('addresses', a => a.userId === userId);
    },

    addAddress: async (addressData) => {
        await delay(300);
        // Jika isMain = true, hapus isMain dari yang lain
        if (addressData.isMain) {
            const existing = storage.findMany('addresses', a => a.userId === addressData.userId);
            existing.forEach(a => storage.updateById('addresses', a.id, { isMain: false }));
        }
        const newAddr = { ...addressData, id: `addr_${Date.now()}` };
        return storage.insert('addresses', newAddr);
    },

    updateAddress: async (addressId, updates) => {
        await delay(300);
        if (updates.isMain) {
            const addr = storage.findOne('addresses', a => a.id === addressId);
            if (addr) {
                const existing = storage.findMany('addresses', a => a.userId === addr.userId);
                existing.forEach(a => storage.updateById('addresses', a.id, { isMain: false }));
            }
        }
        return storage.updateById('addresses', addressId, updates);
    },

    deleteAddress: async (addressId) => {
        await delay(250);
        storage.deleteById('addresses', addressId);
    },

    // ── CART ──────────────────────────────────────────────────
    getCart: async (userId) => {
        await delay(150);
        const cartItems = storage.findMany('cart_items', ci => ci.userId === userId);
        const products = storage.get('products');
        const shops = storage.get('shops');

        return cartItems.map(item => {
            const product = products.find(p => p.id === item.productId);
            const shop = shops.find(s => s.id === item.shopId);
            return { ...item, product, shop };
        });
    },

    addToCart: async (userId, productId, qty = 1) => {
        await delay(250);
        const product = storage.findOne('products', p => p.id === productId);
        if (!product) throw new Error('Produk tidak ditemukan.');
        if (!product.status || product.stock < 1) throw new Error('Produk sedang tidak tersedia.');

        const existing = storage.findOne('cart_items', ci => ci.userId === userId && ci.productId === productId);
        if (existing) {
            const newQty = Math.min(existing.qty + qty, product.stock);
            return storage.updateById('cart_items', existing.id, { qty: newQty });
        }

        return storage.insert('cart_items', {
            id: `ci_${Date.now()}`,
            userId, productId, shopId: product.shopId,
            qty: Math.min(qty, product.stock),
            addedAt: new Date().toISOString()
        });
    },

    updateCartQty: async (cartItemId, qty) => {
        await delay(200);
        if (qty <= 0) {
            storage.deleteById('cart_items', cartItemId);
            return null;
        }
        return storage.updateById('cart_items', cartItemId, { qty });
    },

    removeFromCart: async (cartItemId) => {
        await delay(200);
        storage.deleteById('cart_items', cartItemId);
    },

    clearCart: async (userId) => {
        const items = storage.findMany('cart_items', ci => ci.userId === userId);
        items.forEach(item => storage.deleteById('cart_items', item.id));
    },

    // ── DELIVERY & DRIVERS ────────────────────────────────────
    getDeliveryProviders: async () => {
        await delay(200);
        return storage.get('delivery_providers');
    },

    getAvailableDrivers: async (providerId) => {
        await delay(400); // Simulate provider lookup
        return storage.findMany('drivers', d => d.providerId === providerId && d.status === 'available');
    },

    // ── SHIPPING PRICE CALCULATION ────────────────────────────
    calculateShipping: async (shopCoords, destCoords, methodId, providerId = null) => {
        await delay(600); // Simulate provider API call
        const distKm = formatters.calculateDistance(shopCoords[0], shopCoords[1], destCoords[0], destCoords[1]);
        const methods = storage.get('shipping_methods');
        const method = methods.find(m => m.id === methodId);
        if (!method) throw new Error('Metode pengiriman tidak valid.');

        let price = method.basePrice;
        if (method.isDriverRequired && providerId) {
            const providers = storage.get('delivery_providers');
            const provider = providers.find(p => p.id === providerId);
            if (provider) {
                price = provider.basePrice + Math.round(distKm * provider.pricePerKm);
            }
        }
        return { price, distKm, estimasi: method.estimasi };
    },

    // ── VOUCHERS ─────────────────────────────────────────────
    validateVoucher: async (code, subtotal) => {
        await delay(300);
        const voucher = storage.findOne('vouchers', v => v.code.toUpperCase() === code.toUpperCase());
        if (!voucher) throw new Error('Kode voucher tidak ditemukan.');
        if (voucher.usedCount >= voucher.quota) throw new Error('Kuota voucher sudah habis.');
        if (new Date() > new Date(voucher.validUntil)) throw new Error('Voucher sudah kedaluwarsa.');
        if (subtotal < voucher.minOrder) throw new Error(`Minimum pembelian ${formatters.currency(voucher.minOrder)}.`);

        let discount = 0;
        if (voucher.type === 'percent') discount = Math.min((subtotal * voucher.value) / 100, voucher.maxDiscount);
        else discount = Math.min(voucher.value, voucher.maxDiscount);

        return { ...voucher, discount };
    },

    // ── ORDERS ────────────────────────────────────────────────
    createOrder: async (orderPayload) => {
        await delay(800);
        const orderId = `ORD-${Date.now()}`;

        const isCOD = orderPayload.paymentMethodId === 'cod';
        const initialStatus = isCOD ? 'MENUNGGU_KONFIRMASI' : 'MENUNGGU_PEMBAYARAN';

        const newOrder = {
            ...orderPayload,
            id: orderId,
            status: initialStatus,
            statusHistory: [{ status: initialStatus, time: new Date().toISOString(), note: 'Pesanan dibuat.' }],
            createdAt: new Date().toISOString()
        };

        storage.insert('orders', newOrder);
        
        // Mulai simulasi alur pesanan
        api.simulateOrderFlow(orderId, isCOD);

        // Kurangi stok produk
        if (orderPayload.items) {
            orderPayload.items.forEach(item => {
                const product = storage.findOne('products', p => p.id === item.productId);
                if (product) {
                    storage.updateById('products', item.productId, { stock: Math.max(0, product.stock - item.qty) });
                }
            });
        }

        // Kosongkan keranjang pembeli
        if (orderPayload.buyerId) {
            const cartItems = storage.findMany('cart_items', ci => ci.userId === orderPayload.buyerId && ci.shopId === orderPayload.shopId);
            cartItems.forEach(ci => storage.deleteById('cart_items', ci.id));
        }

        // Buat notifikasi untuk seller
        const shop = storage.findOne('shops', s => s.id === orderPayload.shopId);
        if (shop) {
            storage.insert('notifications', {
                id: `notif_${Date.now()}`,
                userId: shop.ownerId,
                type: 'order_new',
                title: 'Pesanan Baru Masuk!',
                message: `Pesanan #${orderId} menunggu konfirmasi Anda.`,
                isRead: false,
                createdAt: new Date().toISOString()
            });
        }

        return newOrder;
    },

    getOrders: async (userId) => {
        await delay(300);
        return storage.findMany('orders', o => o.buyerId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getOrder: async (orderId) => {
        await delay(150);
        return storage.findOne('orders', o => o.id === orderId) || null;
    },

    clearCart: async (userId) => {
        await delay(100);
        const items = storage.findMany('cart_items', ci => ci.userId === userId);
        items.forEach(ci => storage.deleteById('cart_items', ci.id));
    },

    getSellerOrders: async (shopId) => {
        await delay(300);
        return storage.findMany('orders', o => o.shopId === shopId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getOrdersByShop: async (shopId) => {
        await delay(300);
        let orders = storage.findMany('orders', o => o.shopId === shopId);
        
        // Seed dummy orders if empty (useful if localstorage is stale)
        if (orders.length === 0) {
            const dummyOrders = [
                {
                    id: `ORD-${Date.now()}-1`, buyerId: 'u_1', shopId: shopId,
                    status: 'MENUNGGU_KONFIRMASI', paymentMethodId: 'transfer',
                    items: [{ productId: 'p1', qty: 2, price: 15000 }],
                    totalAmount: 30000, shippingFee: 5000,
                    deliveryAddress: { label: 'Rumah', address: 'Jl. Merdeka No 1, Pematang Siantar', notes: 'Pagar hitam' },
                    createdAt: new Date().toISOString(),
                    statusHistory: [{ status: 'MENUNGGU_KONFIRMASI', time: new Date().toISOString(), note: 'Pesanan dibuat' }]
                },
                {
                    id: `ORD-${Date.now()}-2`, buyerId: 'u_2', shopId: shopId,
                    status: 'DIPROSES', paymentMethodId: 'cod',
                    items: [{ productId: 'p4', qty: 1, price: 250000 }],
                    totalAmount: 250000, shippingFee: 0,
                    deliveryAddress: { label: 'Kantor', address: 'Jl. Sudirman No 10, Pematang Siantar', notes: 'Titip di resepsionis' },
                    createdAt: new Date().toISOString(),
                    statusHistory: [{ status: 'DIPROSES', time: new Date().toISOString(), note: 'Pesanan sedang disiapkan' }]
                }
            ];
            dummyOrders.forEach(o => storage.insert('orders', o));
            orders = storage.findMany('orders', o => o.shopId === shopId);
        }
        
        return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    simulateOrderFlow: (orderId, isCOD) => {
        const updateStatus = (newStatus, note, timeDelay) => {
            setTimeout(() => {
                const order = storage.findOne('orders', o => o.id === orderId);
                if (order && order.status !== 'SELESAI') {
                    order.status = newStatus;
                    order.statusHistory.push({ status: newStatus, time: new Date().toISOString(), note });
                    storage.updateById('orders', orderId, order);
                    // Force UI refresh if user is on orders view
                    if (window.TitikLokal && window.TitikLokal.initOrders) {
                        const ordersView = document.getElementById('view-orders');
                        if (ordersView && !ordersView.classList.contains('hidden')) {
                            window.TitikLokal.initOrders();
                        }
                    }
                }
            }, timeDelay);
        };

        if (!isCOD) {
            updateStatus('MENUNGGU_KONFIRMASI', 'Pembayaran berhasil dikonfirmasi.', 5000);
            updateStatus('DIPROSES', 'Pesanan sedang disiapkan oleh penjual.', 5000 + 8000);
            updateStatus('DIKIRIM', 'Pesanan sedang dalam perjalanan.', 5000 + 8000 + 10000);
            updateStatus('SELESAI', 'Pesanan telah diterima pembeli.', 5000 + 8000 + 10000 + 35000);
        } else {
            updateStatus('DIPROSES', 'Pesanan sedang disiapkan oleh penjual.', 5000);
            updateStatus('DIKIRIM', 'Pesanan sedang dalam perjalanan.', 5000 + 8000);
            updateStatus('SELESAI', 'Pesanan telah diterima pembeli.', 5000 + 8000 + 35000);
        }
    },

    updateOrderStatus: async (orderId, newStatus, note = '') => {
        await delay(300);
        const order = storage.findOne('orders', o => o.id === orderId);
        if (!order) throw new Error('Pesanan tidak ditemukan.');

        const updatedHistory = [...(order.statusHistory || []), { status: newStatus, time: new Date().toISOString(), note }];
        return storage.updateById('orders', orderId, { status: newStatus, statusHistory: updatedHistory });
    },

    // ── TRACKING ─────────────────────────────────────────────
    getOrderTracking: async (orderId) => {
        const order = storage.findOne('orders', o => o.id === orderId);
        return order?.statusHistory || [];
    },

    // ── NOTIFICATIONS ─────────────────────────────────────────
    getNotifications: async (userId) => {
        await delay(200);
        return storage.findMany('notifications', n => n.userId === userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    markNotifRead: async (notifId) => {
        storage.updateById('notifications', notifId, { isRead: true });
    },

    markAllNotifsRead: async (userId) => {
        const notifs = storage.findMany('notifications', n => n.userId === userId && !n.isRead);
        notifs.forEach(n => storage.updateById('notifications', n.id, { isRead: true }));
    },

    // ── WISHLIST ──────────────────────────────────────────────
    getWishlist: async (userId) => {
        await delay(200);
        const items = storage.findMany('wishlist_items', w => w.userId === userId);
        const products = storage.get('products');
        const shops = storage.get('shops');
        return items.map(w => {
            const product = products.find(p => p.id === w.productId);
            const shop = product ? shops.find(s => s.id === product.shopId) : null;
            return { ...w, product, shop };
        }).filter(w => w.product);
    },

    toggleWishlist: async (userId, productId) => {
        await delay(200);
        const existing = storage.findOne('wishlist_items', w => w.userId === userId && w.productId === productId);
        if (existing) {
            storage.deleteById('wishlist_items', existing.id);
            return { action: 'removed' };
        } else {
            storage.insert('wishlist_items', { id: `wl_${Date.now()}`, userId, productId, addedAt: new Date().toISOString() });
            return { action: 'added' };
        }
    },

    isWishlisted: (userId, productId) => {
        return !!storage.findOne('wishlist_items', w => w.userId === userId && w.productId === productId);
    },

    // ── CHAT ──────────────────────────────────────────────────
    getChatRooms: async (userId) => {
        await delay(250);
        const rooms = storage.findMany('chat_rooms', r => r.buyerId === userId || r.sellerId === userId);
        const shops = storage.get('shops');
        const users = storage.get('users');
        return rooms.map(room => {
            const messages = storage.findMany('messages', m => m.roomId === room.id);
            const lastMessage = messages[messages.length - 1] || null;
            const unread = messages.filter(m => !m.isRead && m.senderId !== userId).length;
            const shop = shops.find(s => s.id === room.shopId);
            return { ...room, lastMessage, unread, shop };
        }).sort((a, b) => {
            const aTime = a.lastMessage?.createdAt || a.createdAt;
            const bTime = b.lastMessage?.createdAt || b.createdAt;
            return new Date(bTime) - new Date(aTime);
        });
    },

    getChatMessages: async (roomId) => {
        await delay(200);
        return storage.findMany('messages', m => m.roomId === roomId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },

    sendMessage: async (roomId, senderId, text, imageUrl = null) => {
        await delay(200);
        const msg = {
            id: `msg_${Date.now()}`,
            roomId, senderId, text, imageUrl,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        return storage.insert('messages', msg);
    },

    openOrCreateRoom: async (buyerId, shopId) => {
        await delay(250);
        let room = storage.findOne('chat_rooms', r => r.buyerId === buyerId && r.shopId === shopId);
        if (!room) {
            const shop = storage.findOne('shops', s => s.id === shopId);
            room = storage.insert('chat_rooms', {
                id: `room_${Date.now()}`,
                buyerId,
                shopId,
                sellerId: shop?.ownerId,
                createdAt: new Date().toISOString()
            });
        }
        return room;
    },

    // ── REVIEWS ───────────────────────────────────────────────
    getReviewsByShop: async (shopId) => {
        await delay(200);
        const reviews = storage.findMany('reviews', r => r.shopId === shopId);
        const users = storage.get('users');
        return reviews.map(r => {
            const user = users.find(u => u.id === r.userId);
            return { ...r, user };
        });
    },

    addReview: async (reviewData) => {
        await delay(400);
        const review = { ...reviewData, id: `rev_${Date.now()}`, createdAt: new Date().toISOString() };
        storage.insert('reviews', review);

        // Update shop rating average
        const shopReviews = storage.findMany('reviews', r => r.shopId === reviewData.shopId);
        const avgRating = shopReviews.reduce((sum, r) => sum + r.rating, 0) / shopReviews.length;
        storage.updateById('shops', reviewData.shopId, { rating: parseFloat(avgRating.toFixed(1)), totalReviews: shopReviews.length });

        return review;
    },

    replyReview: async (reviewId, replyText) => {
        await delay(300);
        const review = storage.findOne('reviews', r => r.id === reviewId);
        if (!review) throw new Error('Ulasan tidak ditemukan.');
        return storage.updateById('reviews', reviewId, { sellerReply: replyText });
    },

    // ── WISHLIST ──────────────────────────────────────────────
    getWishlist: async (userId) => {
        await delay(200);
        const wishlist = storage.findMany('wishlist', w => w.userId === userId);
        const products = storage.get('products');
        return wishlist.map(w => {
            const product = products.find(p => p.id === w.productId);
            return { ...w, product };
        }).filter(w => w.product);
    },

    isWishlisted: (userId, productId) => {
        return !!storage.findOne('wishlist', w => w.userId === userId && w.productId === productId);
    },

    toggleWishlist: async (userId, productId) => {
        await delay(200);
        const existing = storage.findOne('wishlist', w => w.userId === userId && w.productId === productId);
        if (existing) {
            storage.deleteById('wishlist', existing.id);
            return false; // removed
        } else {
            storage.insert('wishlist', { id: `wish_${Date.now()}`, userId, productId, createdAt: new Date().toISOString() });
            return true; // added
        }
    },

    // ── STORE FOLLOWERS ───────────────────────────────────────
    toggleFollow: async (userId, shopId) => {
        await delay(250);
        const existing = storage.findOne('store_followers', f => f.userId === userId && f.shopId === shopId);
        if (existing) {
            storage.deleteById('store_followers', existing.id);
            return { action: 'unfollowed' };
        } else {
            storage.insert('store_followers', { id: `flw_${Date.now()}`, userId, shopId, followedAt: new Date().toISOString() });
            return { action: 'followed' };
        }
    },

    isFollowing: (userId, shopId) => {
        return !!storage.findOne('store_followers', f => f.userId === userId && f.shopId === shopId);
    },

    // ── SELLER STATS ──────────────────────────────────────────
    getSellerStats: async (shopId) => {
        await delay(300);
        const orders = storage.findMany('orders', o => o.shopId === shopId);
        const completedOrders = orders.filter(o => o.status === 'SELESAI');
        const pendingOrders = orders.filter(o => o.status === 'MENUNGGU_KONFIRMASI');
        const revenue = completedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        const products = storage.findMany('products', p => p.shopId === shopId);
        const lowStockProducts = products.filter(p => p.stock <= 3 && p.stock > 0);
        const outOfStockProducts = products.filter(p => p.stock <= 0);
        const reviews = storage.findMany('reviews', r => r.shopId === shopId);
        const followers = storage.findMany('store_followers', f => f.shopId === shopId);

        // Simulate monthly revenue data for chart
        const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
            const month = new Date();
            month.setMonth(month.getMonth() - (5 - i));
            return {
                label: month.toLocaleString('id-ID', { month: 'short' }),
                value: Math.floor(Math.random() * 2000000) + 500000
            };
        });

        return {
            totalOrders: orders.length,
            completedOrders: completedOrders.length,
            pendingOrders: pendingOrders.length,
            totalRevenue: revenue,
            totalProducts: products.length,
            lowStockProducts: lowStockProducts.length,
            outOfStockProducts: outOfStockProducts.length,
            totalReviews: reviews.length,
            avgRating: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0,
            totalFollowers: followers.length,
            monthlyRevenue
        };
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.api = api;
