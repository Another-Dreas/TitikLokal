import { api } from '../core/storage.js';
import { formatRupiah, renderStars } from '../core/utils.js';
import { showToast, switchView, showModal, hideModal, createShopCard, createEmptyState } from '../components/ui.js';

window.TitikLokal = window.TitikLokal || {};


let currentLocation = 'Jakarta';
let mapInstance = null;
let currentCheckoutData = { discount: 0, shippingFee: 0, subtotal: 0, courierName: '' };
let currentShopInView = null; // for chat/profile context

// ── INITIALIZATION ────────────────────────────────────────

export const initBuyerHome = async () => {
    updateLocationText();
    await renderCategories();
    await renderNearbyShops();
    await updateCartBadge();
    await updateNotifBadge();
    renderPromoBanner();
    
    const user = await api.getCurrentUser();
    if (user) {
        document.getElementById('buyer-name-desktop').innerText = user.name;
        document.getElementById('buyer-avatar-desktop').innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover">`;
    }
};

const updateLocationText = () => {
    document.getElementById('current-location-text').innerText = currentLocation;
    document.getElementById('nearby-location-text').innerText = currentLocation;
};

// ── LOCATION SELECTOR ─────────────────────────────────────

export const changeLocation = async (loc) => {
    currentLocation = loc;
    updateLocationText();
    hideModal('modal-location');
    showToast(`Lokasi diubah ke ${loc}`, 'success');
    await renderNearbyShops();
};

document.getElementById('buyer-location-selector')?.addEventListener('click', async () => {
    const locations = await api.getLocations();
    const list = document.getElementById('location-list');
    
    list.innerHTML = locations.map(loc => `
        <div class="p-4 rounded-xl border ${currentLocation === loc ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-100 hover:border-primary-200'} flex items-center justify-between cursor-pointer transition-colors" onclick="window.TitikLokal.changeLocation('${loc}')">
            <span class="font-bold text-sm">${loc}</span>
            ${currentLocation === loc ? `<svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>` : ''}
        </div>
    `).join('');
    
    showModal('modal-location');
});

// ── RENDER DATA ───────────────────────────────────────────

const renderPromoBanner = () => {
    const container = document.getElementById('promo-banner-container');
    if (!container) return;
    container.innerHTML = `
        <div class="relative w-full rounded-3xl overflow-hidden shadow-lg bg-primary-600 cursor-pointer group">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-700 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=400&fit=crop" class="w-full h-32 lg:h-48 object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-700">
            <div class="absolute inset-0 z-20 flex flex-col justify-center p-6 lg:p-10">
                <span class="bg-accent-500 text-white text-[10px] lg:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md w-max mb-2">Promo Spesial</span>
                <h3 class="text-white font-bold text-lg lg:text-2xl w-2/3 lg:w-1/2 leading-tight">Dukung UMKM Sekitar, Dapatkan Diskon 50%</h3>
            </div>
        </div>
    `;
};

const renderCategories = async () => {
    const container = document.getElementById('category-container');
    if (!container) return;
    const categories = await api.getCategories();
    container.innerHTML = categories.map(cat => `
        <div class="snap-center shrink-0 w-[72px] lg:w-24 cursor-pointer group flex flex-col items-center">
            <div class="w-16 h-16 lg:w-20 lg:h-20 bg-surface border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:shadow-md group-hover:border-primary-200 group-hover:-translate-y-1 transition-all duration-300">
                ${cat.icon}
            </div>
            <span class="text-[11px] lg:text-xs font-semibold text-slate-600 text-center line-clamp-1 group-hover:text-primary-600 transition-colors">${cat.name}</span>
        </div>
    `).join('');
};

const renderNearbyShops = async () => {
    const container = document.getElementById('nearby-umkm-container');
    if (!container) return;
    
    // Skeleton
    container.innerHTML = Array(4).fill(0).map(() => `
        <div class="bg-surface rounded-3xl shadow-card border border-slate-100 overflow-hidden">
            <div class="h-40 skeleton"></div>
            <div class="p-4"><div class="w-3/4 h-5 skeleton mb-2"></div><div class="w-1/2 h-4 skeleton"></div></div>
        </div>
    `).join('');

    const shops = await api.getNearbyShops(currentLocation);
    
    if(shops.length === 0) {
        container.innerHTML = `<div class="col-span-full">${createEmptyState('Belum Ada UMKM', `Belum ada UMKM yang terdaftar di area ${currentLocation}.`)}</div>`;
        return;
    }
    
    container.innerHTML = shops.map(shop => createShopCard(shop, formatRupiah, renderStars)).join('');
};

// ── BADGES ────────────────────────────────────────────────

const updateCartBadge = async () => {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cartItems = await api.getCart();
    const count = cartItems.reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = count;
    if (count > 0) badge.classList.remove('hidden');
    else badge.classList.add('hidden');
};

const updateNotifBadge = async () => {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const notifs = await api.getNotifications();
    const count = notifs.filter(n => !n.isRead).length;
    badge.innerText = count;
    if (count > 0) badge.classList.remove('hidden');
    else badge.classList.add('hidden');
};

// ── SHOP PROFILE ──────────────────────────────────────────

export const openShopProfile = async (shopId) => {
    try {
        const shop = await api.getShopById(shopId);
        currentShopInView = shop;
        const container = document.getElementById('view-umkm-profile');
        
        const isFollowing = api.isFollowing(shopId);
        
        container.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <!-- Header / Cover -->
                <div class="relative h-48 lg:h-64 w-full group">
                    <img src="${shop.coverImg}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                    <button class="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-xl text-white hover:bg-white/40 transition-colors z-10 shadow-sm border border-white/20" onclick="window.TitikLokal.switchView('view-buyer-home')">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    </button>
                    
                    <div class="absolute -bottom-8 left-4 lg:left-8 flex items-end gap-4 z-20">
                        <img src="${shop.logo}" class="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border-4 border-surface shadow-md bg-surface object-cover">
                        <div class="mb-2 text-white drop-shadow-md">
                            <h2 class="text-2xl font-bold leading-tight">${shop.namaToko}</h2>
                            <div class="flex items-center gap-2 text-sm opacity-90">
                                <span>${shop.kategori}</span>
                                <span>•</span>
                                <span class="flex items-center gap-1"><svg class="w-4 h-4 text-accent-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> ${shop.rating} (${shop.ulasanCount})</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="absolute bottom-4 right-4 z-20 flex gap-2">
                        <button class="bg-white/20 backdrop-blur-md border border-white/20 p-2.5 rounded-xl text-white hover:bg-white/40 shadow-sm" onclick="window.TitikLokal.openChat('${shop.id}')">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                        </button>
                        <button id="btn-follow-${shop.id}" class="follow-btn ${isFollowing ? 'following' : 'bg-primary-600 text-white border-primary-600'} border px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2" onclick="window.TitikLokal.toggleFollowShop('${shop.id}')">
                            ${isFollowing ? 'Mengikuti' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Ikuti'}
                        </button>
                    </div>
                </div>

                <!-- Info & Products -->
                <div class="p-4 lg:p-8 mt-10">
                    <div class="bg-surface rounded-2xl p-4 shadow-sm border border-slate-100 mb-8">
                        <div class="flex items-start gap-3 mb-3 pb-3 border-b border-slate-50">
                            <svg class="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <p class="text-sm text-slate-600">${shop.deskripsi}</p>
                        </div>
                        <div class="flex items-start gap-3">
                            <svg class="w-5 h-5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"/></svg>
                            <div>
                                <div class="text-sm font-semibold text-slate-800">${shop.lokasi}</div>
                                <div class="text-xs text-slate-500">${shop.alamat}</div>
                            </div>
                        </div>
                    </div>

                    <h3 class="font-bold text-slate-800 text-lg tracking-tight mb-4 flex justify-between items-center">
                        Etalase Produk
                        <span class="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">${shop.products.length} item</span>
                    </h3>
                    
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6">
                        ${shop.products.length === 0 ? `<div class="col-span-full">${createEmptyState('Katalog Kosong', 'Toko ini belum menambahkan produk aktif.')}</div>` : ''}
                        ${shop.products.map(p => {
                            const isW = api.isWishlisted(p.id);
                            return `
                            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden flex flex-col product-card">
                                <div class="relative aspect-square overflow-hidden bg-slate-100 group">
                                    <img src="${p.img}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                                    ${p.stok < 5 ? `<div class="absolute top-2 left-2 bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Sisa ${p.stok}</div>` : ''}
                                    <button class="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white wishlist-btn ${isW ? 'active' : ''}" onclick="window.TitikLokal.toggleWishlist('${p.id}', this)">
                                        <svg class="w-5 h-5 text-slate-400 transition-colors" fill="${isW ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </button>
                                </div>
                                <div class="p-3 flex flex-col flex-1">
                                    <h4 class="font-semibold text-slate-800 text-sm line-clamp-2 mb-1 flex-1 leading-tight">${p.nama}</h4>
                                    <div class="font-bold text-primary-600 text-sm mb-3">${formatRupiah(p.harga)}</div>
                                    <button class="btn-primary !py-2 !text-xs !rounded-xl" onclick="window.TitikLokal.addToCart('${p.id}')">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                        Keranjang
                                    </button>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                </div>
            </div>
        `;
        switchView('view-umkm-profile');
    } catch(e) {
        showToast(e.message, 'error');
    }
};

window.TitikLokal.toggleFollowShop = async (shopId) => {
    try {
        const isFollowed = await api.toggleFollow(shopId);
        const btn = document.getElementById(`btn-follow-${shopId}`);
        if(btn) {
            if(isFollowed) {
                btn.classList.add('following');
                btn.classList.remove('bg-primary-600', 'text-white', 'border-primary-600');
                btn.innerHTML = 'Mengikuti';
            } else {
                btn.classList.remove('following');
                btn.classList.add('bg-primary-600', 'text-white', 'border-primary-600');
                btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Ikuti';
            }
        }
        showToast(isFollowed ? 'Berhasil mengikuti toko' : 'Batal mengikuti toko', 'success');
    } catch(e) {
        showToast(e.message, 'error');
    }
};

// ── WISHLIST ──────────────────────────────────────────────

export const toggleWishlist = async (productId, btnEl = null) => {
    try {
        const isW = await api.toggleWishlist(productId);
        if (btnEl) {
            if(isW) {
                btnEl.classList.add('active');
                btnEl.querySelector('svg').setAttribute('fill', 'currentColor');
            } else {
                btnEl.classList.remove('active');
                btnEl.querySelector('svg').setAttribute('fill', 'none');
            }
        }
        showToast(isW ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist', 'success');
        
        // If we are currently on wishlist page, re-render it
        if(!document.getElementById('view-wishlist').classList.contains('hidden')) {
            initWishlist();
        }
    } catch (e) {
        showToast(e.message, 'error');
    }
};

export const initWishlist = async () => {
    const container = document.getElementById('view-wishlist');
    try {
        const items = await api.getWishlist();
        container.innerHTML = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 p-4 flex items-center gap-4 shadow-sm lg:hidden">
                <h1 class="font-bold text-xl text-slate-800 tracking-tight">Wishlist Saya</h1>
            </header>
            <div class="p-4 lg:p-8 max-w-5xl mx-auto">
                <h1 class="font-bold text-2xl text-slate-800 tracking-tight hidden lg:block mb-6">Wishlist Saya</h1>
                ${items.length === 0 ? createEmptyState("Wishlist Kosong", "Temukan produk lokal favorit Anda dan simpan di sini.") : ''}
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                    ${items.map(p => `
                        <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden flex flex-col product-card relative">
                            <button class="absolute top-2 right-2 p-1.5 bg-white backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform z-10 text-error" onclick="window.TitikLokal.toggleWishlist('${p.id}')">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                            <div class="relative aspect-square overflow-hidden bg-slate-100" onclick="window.TitikLokal.openShopProfile('${p.shopId}')">
                                <img src="${p.img}" class="w-full h-full object-cover">
                            </div>
                            <div class="p-3 flex flex-col flex-1">
                                <div class="text-[10px] text-slate-500 font-medium mb-1">${p.shopName}</div>
                                <h4 class="font-semibold text-slate-800 text-sm line-clamp-2 mb-1 flex-1 leading-tight">${p.nama}</h4>
                                <div class="font-bold text-primary-600 text-sm mb-3">${formatRupiah(p.harga)}</div>
                                <button class="btn-primary !py-2 !text-xs !rounded-xl" onclick="window.TitikLokal.addToCart('${p.id}')">Masuk Keranjang</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch(e) {
        showToast(e.message, 'error');
    }
};

// ── CART ──────────────────────────────────────────────────

export const addToCart = async (productId, qty = 1) => {
    try {
        await api.addToCart(productId, qty);
        showToast('Berhasil ditambahkan ke keranjang', 'success');
        updateCartBadge();
    } catch (e) {
        showToast(e.message, 'error');
    }
};

export const updateCartQty = async (productId, delta) => {
    try {
        await api.updateCartItemQty(productId, delta);
        openCart(); // re-render
        updateCartBadge();
    } catch (e) {
        showToast(e.message, 'error');
    }
};

export const removeCartItem = async (productId) => {
    try {
        await api.removeCartItem(productId);
        openCart();
        updateCartBadge();
    } catch (e) {
        showToast(e.message, 'error');
    }
};

export const openCart = async () => {
    try {
        const cartItems = await api.getCart();
        const container = document.getElementById('view-cart');
        
        let html = `
            <div class="max-w-3xl mx-auto min-h-screen bg-slate-50 relative pb-24">
                <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 p-4 flex items-center gap-4 shadow-sm">
                    <button class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100" onclick="window.TitikLokal.switchView('view-buyer-home')">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <h1 class="font-bold text-xl text-slate-800 tracking-tight">Keranjang Belanja</h1>
                </header>
        `;

        if (cartItems.length === 0) {
            html += createEmptyState(
                "Keranjang Kosong",
                "Temukan berbagai produk lokal menarik dan tambahkan ke keranjang Anda.",
                `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`
            );
        } else {
            // Group by shop
            const grouped = cartItems.reduce((acc, item) => {
                if (!acc[item.shopId]) acc[item.shopId] = { shopName: item.shopName, items: [] };
                acc[item.shopId].items.push(item);
                return acc;
            }, {});

            let subtotal = 0;
            
            html += `<div class="p-4 space-y-4">`;
            
            Object.values(grouped).forEach(group => {
                html += `
                    <div class="card overflow-hidden">
                        <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700 text-sm">
                            <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            ${group.shopName}
                        </div>
                        <div class="p-4 space-y-4">
                `;
                
                group.items.forEach(item => {
                    subtotal += item.price * item.qty;
                    html += `
                        <div class="flex gap-4">
                            <img src="${item.img}" class="w-20 h-20 rounded-xl object-cover border border-slate-100">
                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 class="font-semibold text-slate-800 text-sm leading-tight">${item.productName}</h4>
                                    <div class="font-bold text-primary-600 text-sm mt-1">${formatRupiah(item.price)}</div>
                                </div>
                                <div class="flex justify-between items-end mt-2">
                                    <button class="text-xs font-semibold text-slate-400 hover:text-error flex items-center gap-1 transition-colors" onclick="window.TitikLokal.removeCartItem('${item.productId}')">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        Hapus
                                    </button>
                                    <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
                                        <button class="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-primary-600 disabled:opacity-50" onclick="window.TitikLokal.updateCartQty('${item.productId}', -1)" ${item.qty <= 1 ? 'disabled' : ''}>-</button>
                                        <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                                        <button class="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-primary-600 disabled:opacity-50" onclick="window.TitikLokal.updateCartQty('${item.productId}', 1)" ${item.qty >= item.stock ? 'disabled' : ''}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div></div>`;
            });
            
            html += `</div>
                <div class="fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-100 p-4 pb-safe z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    <div class="max-w-3xl mx-auto flex justify-between items-center gap-4">
                        <div>
                            <div class="text-xs text-slate-500 font-medium mb-1">Total Belanja</div>
                            <div class="font-bold text-xl text-slate-800 tracking-tight">${formatRupiah(subtotal)}</div>
                        </div>
                        <button class="btn-primary flex-1 max-w-[200px]" onclick="window.TitikLokal.openCheckout()">Checkout</button>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        container.innerHTML = html;
        switchView('view-cart');
        
    } catch(e) {
        showToast(e.message, 'error');
    }
};

// ── CHECKOUT ──────────────────────────────────────────────

export const openCheckout = async () => {
    try {
        const cartItems = await api.getCart();
        if(cartItems.length === 0) return showToast('Keranjang kosong', 'error');
        
        const user = await api.getCurrentUser();
        const couriers = await api.getCouriers();
        
        const subtotal = cartItems.reduce((s, i) => s + (i.price * i.qty), 0);
        currentCheckoutData = { subtotal, discount: 0, shippingFee: couriers[0].price, courierName: couriers[0].name, address: user.address };
        
        const container = document.getElementById('view-checkout');
        
        container.innerHTML = `
            <div class="max-w-3xl mx-auto min-h-screen bg-slate-50 relative pb-28">
                <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 p-4 flex items-center gap-4 shadow-sm">
                    <button class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100" onclick="window.TitikLokal.openCart()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <h1 class="font-bold text-xl text-slate-800 tracking-tight">Checkout</h1>
                </header>
                
                <div class="p-4 space-y-4">
                    <!-- Address -->
                    <div class="card card-p border-l-4 border-l-primary-500">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
                                Alamat Pengiriman
                            </h3>
                            <button class="text-primary-600 text-xs font-bold hover:underline">Ubah</button>
                        </div>
                        <div class="text-sm font-bold text-slate-700 mb-1">${user.name} | ${user.phone}</div>
                        <div class="text-sm text-slate-500 leading-relaxed">${user.address || 'Belum ada alamat. Silakan isi.'}</div>
                    </div>

                    <!-- Items Summary -->
                    <div class="card">
                        <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 font-bold text-slate-700 text-sm">Ringkasan Pesanan</div>
                        <div class="p-4 space-y-3">
                            ${cartItems.map(item => `
                                <div class="flex justify-between text-sm">
                                    <div class="flex gap-3">
                                        <div class="font-semibold text-slate-600">${item.qty}x</div>
                                        <div class="text-slate-700 truncate max-w-[150px] sm:max-w-[300px]">${item.productName}</div>
                                    </div>
                                    <div class="font-bold text-slate-800">${formatRupiah(item.price * item.qty)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Shipping -->
                    <div class="card card-p">
                        <h3 class="font-bold text-slate-800 text-sm mb-3">Opsi Pengiriman</h3>
                        <select id="checkout-courier" class="form-input text-sm font-semibold" onchange="window.TitikLokal.changeShipping(this)">
                            ${couriers.map(c => `<option value="${c.name}" data-price="${c.price}" ${c.name === currentCheckoutData.courierName ? 'selected' : ''}>${c.name} (${c.eta}) - ${formatRupiah(c.price)}</option>`).join('')}
                        </select>
                    </div>

                    <!-- Voucher -->
                    <div class="card card-p">
                        <div class="flex gap-2">
                            <input type="text" id="checkout-voucher" class="form-input !py-2.5 uppercase font-bold" placeholder="KODE VOUCHER (Cth: LOKAL50)">
                            <button class="bg-slate-800 text-white px-4 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors" onclick="window.TitikLokal.applyVoucher()">Terapkan</button>
                        </div>
                        <div id="voucher-msg" class="text-xs font-semibold mt-2 hidden"></div>
                    </div>
                </div>

                <!-- Footer Total -->
                <div class="fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-100 p-4 pb-safe z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    <div class="max-w-3xl mx-auto space-y-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Subtotal Produk</span>
                            <span class="font-semibold text-slate-800">${formatRupiah(currentCheckoutData.subtotal)}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Ongkos Kirim</span>
                            <span class="font-semibold text-slate-800" id="display-shipping">${formatRupiah(currentCheckoutData.shippingFee)}</span>
                        </div>
                        <div class="flex justify-between text-sm hidden text-success" id="display-discount-row">
                            <span class="font-medium flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg> Diskon</span>
                            <span class="font-bold" id="display-discount"></span>
                        </div>
                        
                        <div class="border-t border-slate-100 pt-3 flex justify-between items-center gap-4">
                            <div>
                                <div class="text-xs text-slate-500 font-medium mb-1">Total Pembayaran</div>
                                <div class="font-bold text-xl text-primary-600 tracking-tight" id="display-total">${formatRupiah(currentCheckoutData.subtotal + currentCheckoutData.shippingFee - currentCheckoutData.discount)}</div>
                            </div>
                            <button id="btn-process-checkout" class="btn-primary flex-1 max-w-[200px]" onclick="window.TitikLokal.processCheckout()">Bayar Sekarang</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        switchView('view-checkout');
    } catch(e) {
        showToast(e.message, 'error');
    }
};

window.TitikLokal.changeShipping = (selectEl) => {
    const opt = selectEl.options[selectEl.selectedIndex];
    currentCheckoutData.shippingFee = parseInt(opt.getAttribute('data-price'));
    currentCheckoutData.courierName = opt.value;
    updateCheckoutTotal();
};

window.TitikLokal.applyVoucher = async () => {
    const code = document.getElementById('checkout-voucher').value;
    const msg = document.getElementById('voucher-msg');
    
    if(!code) return;
    
    try {
        const res = await api.applyVoucher(code, currentCheckoutData.subtotal);
        currentCheckoutData.discount = res.discount;
        msg.innerHTML = `Voucher ${res.code} berhasil digunakan!`;
        msg.className = 'text-xs font-semibold mt-2 text-success block';
        document.getElementById('display-discount-row').classList.remove('hidden');
        document.getElementById('display-discount').innerText = `-${formatRupiah(res.discount)}`;
        updateCheckoutTotal();
    } catch(e) {
        currentCheckoutData.discount = 0;
        msg.innerHTML = `${e.message}`;
        msg.className = 'text-xs font-semibold mt-2 text-error block';
        document.getElementById('display-discount-row').classList.add('hidden');
        updateCheckoutTotal();
    }
};

const updateCheckoutTotal = () => {
    document.getElementById('display-shipping').innerText = formatRupiah(currentCheckoutData.shippingFee);
    const total = currentCheckoutData.subtotal + currentCheckoutData.shippingFee - currentCheckoutData.discount;
    document.getElementById('display-total').innerText = formatRupiah(total);
};

export const processCheckout = async () => {
    const btn = document.getElementById('btn-process-checkout');
    btn.innerHTML = `<span class="spinner"></span> Memproses...`;
    btn.disabled = true;
    
    try {
        await api.createOrder(currentCheckoutData);
        showToast('Pesanan berhasil dibuat!', 'success');
        updateCartBadge();
        // Go to orders
        openOrders();
    } catch(e) {
        showToast(e.message, 'error');
        btn.innerHTML = 'Bayar Sekarang';
        btn.disabled = false;
    }
};

// ── ORDERS ────────────────────────────────────────────────

export const openOrders = async () => {
    try {
        const orders = await api.getOrders();
        const container = document.getElementById('view-orders');
        
        let html = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 p-4 shadow-sm lg:hidden">
                <h1 class="font-bold text-xl text-slate-800 tracking-tight">Pesanan Saya</h1>
            </header>
            <div class="p-4 lg:p-8 max-w-4xl mx-auto space-y-4">
                <h1 class="font-bold text-2xl text-slate-800 tracking-tight hidden lg:block mb-6">Riwayat Pesanan</h1>
        `;

        if(orders.length === 0) {
            html += createEmptyState("Belum Ada Pesanan", "Anda belum pernah melakukan pemesanan. Yuk mulai eksplorasi produk UMKM!");
        } else {
            html += orders.map(o => {
                const firstItem = o.items[0];
                const moreItems = o.items.length - 1;
                
                return `
                    <div class="card p-4 hover:border-primary-200 transition-colors cursor-pointer" onclick="window.TitikLokal.showOrderModal('${o.id}')">
                        <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-50">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                <span class="font-bold text-sm text-slate-800">${o.shopName}</span>
                            </div>
                            <span class="badge badge-${o.status}">${o.status}</span>
                        </div>
                        
                        <div class="flex gap-4">
                            <img src="${firstItem.img}" class="w-16 h-16 rounded-xl object-cover border border-slate-100">
                            <div class="flex-1">
                                <h4 class="font-semibold text-slate-800 text-sm mb-1">${firstItem.productName}</h4>
                                <div class="text-xs text-slate-500 mb-2">${firstItem.qty} barang x ${formatRupiah(firstItem.price)}</div>
                                ${moreItems > 0 ? `<div class="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded w-max">+${moreItems} produk lainnya</div>` : ''}
                            </div>
                        </div>
                        
                        <div class="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                            <div>
                                <div class="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Total Belanja</div>
                                <div class="font-bold text-primary-600">${formatRupiah(o.total)}</div>
                            </div>
                            ${o.status === 'shipping' ? `
                                <button class="btn-primary !py-2 !px-4 !text-xs !w-auto" onclick="event.stopPropagation(); window.TitikLokal.completeOrder('${o.id}')">Selesaikan Pesanan</button>
                            ` : o.status === 'completed' ? `
                                <button class="btn-secondary !py-2 !px-4 !text-xs !w-auto border-primary-200 text-primary-700" onclick="event.stopPropagation(); window.TitikLokal.showReviewModal('${o.shopId}', '${firstItem.productId}')">Beri Ulasan</button>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        html += `</div>`;
        container.innerHTML = html;
        switchView('view-orders');
        
    } catch(e) {
        showToast(e.message, 'error');
    }
};

window.TitikLokal.showOrderModal = async (orderId) => {
    const orders = await api.getOrders();
    const o = orders.find(x => x.id === orderId);
    if(!o) return;
    
    const content = document.getElementById('modal-generic-content');
    
    const timelines = o.statusHistory.slice().reverse();
    
    content.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                <div>
                    <h3 class="font-bold text-lg text-slate-800 mb-1">Detail Pesanan</h3>
                    <div class="text-xs text-slate-500 font-mono">${o.id}</div>
                </div>
                <div class="badge badge-${o.status}">${o.status}</div>
            </div>
            
            <div class="mb-6">
                <h4 class="text-sm font-bold text-slate-800 mb-3">Status Pengiriman (${o.courier})</h4>
                <div class="space-y-0 pl-2">
                    ${timelines.map((t, idx) => `
                        <div class="timeline-item">
                            <div class="timeline-dot ${idx === 0 ? 'active' : 'done'}">
                                ${idx === 0 ? `<svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` : `<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`}
                            </div>
                            <div class="pt-1 flex-1">
                                <div class="text-sm font-bold text-slate-800">${t.note}</div>
                                <div class="text-[10px] text-slate-400 mt-1">${new Date(t.time).toLocaleString('id-ID')}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-slate-50 rounded-xl p-4 text-sm space-y-2">
                <div class="flex justify-between"><span class="text-slate-500">Subtotal</span><span class="font-semibold text-slate-800">${formatRupiah(o.subtotal)}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Ongkos Kirim</span><span class="font-semibold text-slate-800">${formatRupiah(o.shippingFee)}</span></div>
                ${o.discount > 0 ? `<div class="flex justify-between text-success"><span class="font-semibold">Diskon</span><span class="font-bold">-${formatRupiah(o.discount)}</span></div>` : ''}
                <div class="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-base"><span class="text-slate-800">Total</span><span class="text-primary-600">${formatRupiah(o.total)}</span></div>
            </div>
        </div>
    `;
    
    showModal('modal-generic');
};

window.TitikLokal.completeOrder = async (orderId) => {
    if(confirm('Pastikan pesanan telah Anda terima dengan baik. Selesaikan pesanan?')) {
        try {
            await api.updateOrderStatus(orderId, 'completed', 'Pesanan telah diterima oleh pembeli');
            showToast('Pesanan diselesaikan!', 'success');
            openOrders();
        } catch(e) {
            showToast(e.message, 'error');
        }
    }
};

window.TitikLokal.showReviewModal = (shopId, productId) => {
    const content = document.getElementById('modal-generic-content');
    content.innerHTML = `
        <div class="p-6 text-center">
            <h3 class="font-bold text-xl text-slate-800 mb-2">Beri Ulasan</h3>
            <p class="text-sm text-slate-500 mb-6">Bagaimana kualitas produk dan pelayanan UMKM ini?</p>
            
            <div class="star-rating justify-center mb-6">
                <input type="radio" name="rating" id="star5" value="5" class="hidden"><label for="star5"><svg class="w-6 h-6 inline-block cursor-pointer text-slate-300 hover:text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></label>
                <input type="radio" name="rating" id="star4" value="4" class="hidden"><label for="star4"><svg class="w-6 h-6 inline-block cursor-pointer text-slate-300 hover:text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></label>
                <input type="radio" name="rating" id="star3" value="3" class="hidden"><label for="star3"><svg class="w-6 h-6 inline-block cursor-pointer text-slate-300 hover:text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></label>
                <input type="radio" name="rating" id="star2" value="2" class="hidden"><label for="star2"><svg class="w-6 h-6 inline-block cursor-pointer text-slate-300 hover:text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></label>
                <input type="radio" name="rating" id="star1" value="1" class="hidden"><label for="star1"><svg class="w-6 h-6 inline-block cursor-pointer text-slate-300 hover:text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></label>
            </div>
            
            <textarea id="review-text" class="form-input mb-4" rows="3" placeholder="Tulis pengalaman jujur Anda berbelanja di sini..."></textarea>
            
            <button class="btn-primary w-full" onclick="window.TitikLokal.submitReview('${shopId}', '${productId}')">Kirim Ulasan</button>
        </div>
    `;
    showModal('modal-generic');
};

window.TitikLokal.submitReview = async (shopId, productId) => {
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const text = document.getElementById('review-text').value;
    
    if(!ratingInput) return showToast('Pilih bintang rating terlebih dahulu', 'error');
    
    try {
        await api.addReview(shopId, productId, parseInt(ratingInput.value), text);
        hideModal('modal-generic');
        showToast('Terima kasih atas ulasannya!', 'success');
    } catch(e) {
        showToast(e.message, 'error');
    }
};

// ── CHAT ──────────────────────────────────────────────────

export const openChat = async (shopId) => {
    try {
        const chat = await api.getOrCreateChat(shopId);
        const container = document.getElementById('view-chat-room');
        
        container.innerHTML = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 p-4 flex items-center gap-4 shadow-sm">
                <button class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100" onclick="window.TitikLokal.switchView('view-umkm-profile')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <img src="${chat.shopLogo}" class="w-10 h-10 rounded-full object-cover border border-slate-200">
                <div>
                    <h2 class="font-bold text-sm text-slate-800">${chat.shopName}</h2>
                    <span class="text-[10px] text-success font-medium flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-success"></span> Online</span>
                </div>
            </header>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-4 pb-24" id="chat-messages-container">
                <div class="text-center text-xs text-slate-400 font-medium mb-4 uppercase tracking-wider bg-slate-100 py-1 px-3 rounded-full w-max mx-auto">Hari Ini</div>
                ${chat.messages.map(m => `
                    <div class="flex flex-col ${m.senderId === chat.buyerId ? 'items-end' : 'items-start'}">
                        <div class="chat-bubble ${m.senderId === chat.buyerId ? 'sent' : 'received'}">${m.text}</div>
                        <div class="text-[10px] text-slate-400 mt-1 mx-1">${new Date(m.time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="chat-input-area fixed bottom-0 left-0 right-0 max-w-4xl mx-auto lg:border-x">
                <button class="p-2 text-slate-400 hover:text-primary-600 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
                <input type="text" id="chat-input-text" class="flex-1 form-input !rounded-full !py-2.5 !bg-slate-100" placeholder="Ketik pesan...">
                <button class="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 shadow-md transition-all active:scale-95" onclick="window.TitikLokal.sendMessage('${chat.id}')">
                    <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </div>
        `;
        switchView('view-chat-room');
        // scroll to bottom
        setTimeout(() => {
            const el = document.getElementById('chat-messages-container');
            if(el) el.scrollTop = el.scrollHeight;
        }, 100);
        
    } catch(e) {
        showToast(e.message, 'error');
    }
};

window.TitikLokal.sendMessage = async (chatId) => {
    const input = document.getElementById('chat-input-text');
    const text = input.value.trim();
    if(!text) return;
    
    try {
        input.value = '';
        const msg = await api.sendMessage(chatId, text);
        
        // Append UI
        const container = document.getElementById('chat-messages-container');
        container.insertAdjacentHTML('beforeend', `
            <div class="flex flex-col items-end animate-slide-up">
                <div class="chat-bubble sent">${msg.text}</div>
                <div class="text-[10px] text-slate-400 mt-1 mx-1">${new Date(msg.time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</div>
            </div>
        `);
        container.scrollTop = container.scrollHeight;
    } catch(e) {
        showToast(e.message, 'error');
    }
};


// ── NOTIFICATIONS ─────────────────────────────────────────

export const openNotifications = async () => {
    const content = document.getElementById('modal-generic-content');
    
    try {
        const notifs = await api.getNotifications();
        
        let html = `
            <div class="p-6 max-h-[80vh] flex flex-col">
                <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 class="font-bold text-xl text-slate-800">Notifikasi</h3>
                    ${notifs.length > 0 ? `<button class="text-sm font-bold text-primary-600 hover:underline" onclick="window.TitikLokal.markAllNotifsRead()">Tandai Baca</button>` : ''}
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-3 -mx-2 px-2">
        `;
        
        if(notifs.length === 0) {
            html += createEmptyState("Belum Ada Notifikasi", "Anda belum memiliki notifikasi terbaru.");
        } else {
            html += notifs.map(n => `
                <div class="p-3 rounded-xl border ${n.isRead ? 'bg-surface border-slate-100' : 'bg-primary-50 border-primary-100'} flex gap-3 cursor-pointer" onclick="window.TitikLokal.clickNotif('${n.id}', '${n.orderId}')">
                    <div class="w-10 h-10 rounded-full ${n.isRead ? 'bg-slate-100 text-slate-500' : 'bg-primary-600 text-white'} flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                    </div>
                    <div>
                        <div class="font-bold text-sm text-slate-800 mb-0.5">${n.title}</div>
                        <div class="text-xs text-slate-600">${n.body}</div>
                        <div class="text-[10px] text-slate-400 mt-1">${new Date(n.createdAt).toLocaleDateString('id-ID', {hour:'2-digit', minute:'2-digit'})}</div>
                    </div>
                </div>
            `).join('');
        }
        
        html += `</div></div>`;
        content.innerHTML = html;
        showModal('modal-generic');
        
    } catch(e) {
        showToast(e.message, 'error');
    }
};

window.TitikLokal.markAllNotifsRead = async () => {
    await api.markNotifRead('all');
    openNotifications(); // reload modal
    updateNotifBadge(); // update icon
};

window.TitikLokal.clickNotif = async (notifId, orderId) => {
    await api.markNotifRead(notifId);
    hideModal('modal-generic');
    updateNotifBadge();
    
    if(orderId) {
        // Assume buyer for now. If seller, they'll just see it in seller orders tab
        const user = await api.getCurrentUser();
        if(user.role === 'buyer') {
            await openOrders();
            setTimeout(() => window.TitikLokal.showOrderModal(orderId), 300);
        } else {
            // Seller click notif
            document.querySelectorAll('.seller-tab-btn')[2].click();
        }
    }
};

// ── PROFILE ───────────────────────────────────────────────

export const initProfile = async () => {
    // Basic init, we just show a toast for now as per layout.js 'Akun' click
    // But if we want a real view:
    const user = await api.getCurrentUser();
    const container = document.getElementById('view-profile');
    if(!container || !user) return;
    
    container.innerHTML = `
        <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 p-4 shadow-sm lg:hidden flex justify-between items-center">
            <h1 class="font-bold text-xl text-slate-800 tracking-tight">Akun Saya</h1>
            <button class="text-error font-bold text-sm" onclick="window.TitikLokal.doLogout()">Logout</button>
        </header>
        
        <div class="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
            <div class="flex flex-col items-center justify-center p-6 bg-surface rounded-3xl shadow-card border border-slate-100 text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary-500 to-indigo-600 opacity-20 pointer-events-none"></div>
                <img src="${user.avatar}" class="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 relative z-10 object-cover bg-white">
                <h2 class="text-2xl font-bold text-slate-800 relative z-10">${user.name}</h2>
                <div class="text-sm font-semibold text-slate-500 mt-1 relative z-10">${user.email} | ${user.phone}</div>
                <button class="mt-6 btn-secondary !py-2 !px-6 bg-white relative z-10 shadow-sm" onclick="window.TitikLokal.showEditProfileModal()">Edit Profil</button>
            </div>
            
            <div class="space-y-3">
                <div class="card p-4 hover:border-primary-200 cursor-pointer flex justify-between items-center group" onclick="window.TitikLokal.openOrdersTab()">
                    <div class="flex items-center gap-3 font-semibold text-slate-700 group-hover:text-primary-600 transition-colors">
                        <div class="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></div>
                        Riwayat Pesanan
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <div class="card p-4 hover:border-primary-200 cursor-pointer flex justify-between items-center group" onclick="window.TitikLokal.openWishlist()">
                    <div class="flex items-center gap-3 font-semibold text-slate-700 group-hover:text-error transition-colors">
                        <div class="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-error group-hover:text-white transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></div>
                        Wishlist Saya
                    </div>
                    <svg class="w-5 h-5 text-slate-400 group-hover:text-error transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <div class="card p-4 hover:border-red-200 cursor-pointer flex justify-between items-center lg:flex group" onclick="window.TitikLokal.doLogout()">
                    <div class="flex items-center gap-3 font-semibold text-error">
                        <div class="p-2 bg-red-50 rounded-lg group-hover:bg-error group-hover:text-white transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg></div>
                        Keluar Akun
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.TitikLokal.showEditProfileModal = async () => {
    const user = await api.getCurrentUser();
    if (!user) return;
    
    const html = `
        <form id="edit-profile-form" onsubmit="event.preventDefault(); window.TitikLokal.submitEditProfile(this)" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap</label>
                <input type="text" name="name" class="form-input" value="${user.name}" required>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                <input type="email" name="email" class="form-input" value="${user.email}" required>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nomor Telepon</label>
                <input type="tel" name="phone" class="form-input" value="${user.phone}" required>
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Alamat Pengiriman</label>
                <textarea name="address" class="form-input" rows="3" required>${user.address || ''}</textarea>
            </div>
            <button type="submit" class="btn-primary w-full mt-2">Simpan Perubahan</button>
        </form>
    `;
    showModal('modal-generic', 'Edit Profil', html);
};

window.TitikLokal.submitEditProfile = async (form) => {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    window.TitikLokal.simulateLoading(btn, originalText, async () => {
        try {
            const updates = Object.fromEntries(new FormData(form).entries());
            await api.updateUser(updates);
            hideModal('modal-generic');
            showToast('Profil berhasil diperbarui!', 'success');
            initProfile(); // re-render profile
        } catch(e) {
            showToast(e.message, 'error');
        }
    });
};


// ── MAP ───────────────────────────────────────────────────

export const openMap = async () => {
    switchView('view-map');
    
    if (!mapInstance) {
        // Init Map
        mapInstance = L.map('map-container', { zoomControl: false }).setView([-6.200000, 106.816666], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; TitikLokal',
            maxZoom: 19
        }).addTo(mapInstance);
    }
    
    // Clear old markers
    mapInstance.eachLayer(l => { if(l instanceof L.Marker) mapInstance.removeLayer(l) });
    
    const shops = await api.getNearbyShops('Jakarta'); // Load all for demo
    
    const bounds = L.latLngBounds();
    shops.forEach(shop => {
        if(shop.coords) {
            const el = document.createElement('div');
            el.className = 'w-10 h-10 bg-white rounded-full border-2 border-primary-600 shadow-lg flex items-center justify-center p-0.5 overflow-hidden transition-transform hover:scale-110';
            el.innerHTML = `<img src="${shop.logo}" class="w-full h-full object-cover rounded-full">`;
            
            const icon = L.divIcon({ html: el, className: '', iconSize: [40, 40], iconAnchor: [20, 20] });
            const marker = L.marker(shop.coords, { icon }).addTo(mapInstance);
            
            marker.on('click', () => showMapSheet(shop));
            bounds.extend(shop.coords);
        }
    });
    
    if(shops.length > 0) mapInstance.fitBounds(bounds, { padding: [50, 50] });
};

const showMapSheet = (shop) => {
    const sheet = document.getElementById('map-bottom-sheet');
    sheet.innerHTML = `
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 lg:hidden cursor-pointer" onclick="this.parentElement.classList.add('translate-y-full')"></div>
        <div class="flex gap-4 mb-4">
            <img src="${shop.logo}" class="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-100">
            <div>
                <h3 class="font-bold text-lg text-slate-800 leading-tight">${shop.namaToko}</h3>
                <div class="text-sm font-semibold text-primary-600 mb-1">${shop.kategori}</div>
                <div class="text-xs text-slate-500 line-clamp-1">${shop.alamat}</div>
            </div>
        </div>
        <div class="flex gap-2">
            <button class="flex-1 btn-primary !py-2.5 shadow-sm" onclick="window.TitikLokal.openShopProfile('${shop.id}')">Kunjungi Toko</button>
            <button class="w-12 btn-secondary !p-0 flex items-center justify-center" onclick="window.TitikLokal.openMapDirections('${shop.coords[0]}','${shop.coords[1]}')">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            </button>
        </div>
    `;
    sheet.classList.remove('hidden');
    // small delay for transform
    requestAnimationFrame(() => sheet.classList.remove('translate-y-full'));
};

window.TitikLokal.openMapDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
};
