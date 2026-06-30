/**
 * TitikLokal - Buyer View Controller
 * Mengatur interaksi DOM untuk Dashboard Pembeli, Profil, dan Integrasi Peta.
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { formatters } from '../utils/formatters.js';

window.TitikLokal = window.TitikLokal || {};

export const initBuyerHome = async () => {
    store.dispatch('isLoading', true);
    try {
        const user = store.getState().currentUser;
        if (user) {
            const nameEl = document.getElementById('buyer-name-desktop');
            const avatarEl = document.getElementById('buyer-avatar-desktop');
            if (nameEl) nameEl.innerText = user.name.split(' ')[0];
            if (avatarEl) avatarEl.innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover">`;
        }
        const locEl = document.getElementById('current-location-text');
        if (locEl) locEl.innerText = 'Pematang Siantar';
        const nearbyLocEl = document.getElementById('nearby-location-text');
        if (nearbyLocEl) nearbyLocEl.innerText = 'Pematang Siantar';

        await renderCategories();
        await renderRecommendedShops();
        await renderPromoBanner();
    } catch (err) {
        console.error(err);
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderCategories = async () => {
    const container = document.getElementById('category-container');
    if (!container) return;
    
    // Using mock categories since it's just static UI structure usually
    const categories = [
        { id: 'c1', name: 'Kuliner', icon: '<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6zM4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4M9 11v2m6-2v2"></path></svg>' },
        { id: 'c2', name: 'Fashion', icon: '<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>' },
        { id: 'c3', name: 'Kriya', icon: '<svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>' },
        { id: 'c4', name: 'Jasa', icon: '<svg class="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' }
    ];
    
    container.innerHTML = categories.map(cat => `
        <div class="snap-center shrink-0 w-[72px] lg:w-24 cursor-pointer group flex flex-col items-center" onclick="window.TitikLokal.ui.showToast('Filter kategori ${cat.name} aktif', 'info')">
            <div class="w-16 h-16 lg:w-20 lg:h-20 bg-surface border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:shadow-md group-hover:border-primary-200 group-hover:-translate-y-1 transition-all duration-300">
                ${cat.icon}
            </div>
            <span class="text-[11px] lg:text-xs font-semibold text-slate-600 text-center line-clamp-1 group-hover:text-primary-600 transition-colors">${cat.name}</span>
        </div>
    `).join('');
};

const renderRecommendedShops = async () => {
    const container = document.getElementById('nearby-umkm-container');
    if (!container) return;
    
    const shops = await api.getShops();
    // Koordinat Pematang Siantar
    const userLat = 2.9595;
    const userLng = 99.0690;
    
    let html = '';
    shops.forEach(shop => {
        const dist = formatters.calculateDistance(userLat, userLng, shop.coords[0], shop.coords[1]);
        html += window.TitikLokal.cards.StoreCard(shop, dist);
    });
    
    container.innerHTML = html || window.TitikLokal.ui.EmptyState('Belum ada UMKM di area ini.');
};

const renderPromoBanner = () => {
    const container = document.getElementById('promo-banner-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="relative w-full rounded-3xl overflow-hidden shadow-lg bg-primary-600 cursor-pointer group" onclick="window.TitikLokal.ui.showToast('Voucher disalin!', 'success')">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-700 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=400&fit=crop" class="w-full h-32 lg:h-48 object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-700">
            <div class="absolute inset-0 z-20 flex flex-col justify-center p-6 lg:p-10">
                <span class="bg-accent-500 text-white text-[10px] lg:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md w-max mb-2">Promo Spesial</span>
                <h3 class="text-white font-bold text-lg lg:text-2xl w-2/3 lg:w-1/2 leading-tight">Dukung UMKM Sekitar, Diskon 50%</h3>
            </div>
        </div>
    `;
};

export const initExploreMap = () => {
    setTimeout(() => {
        window.TitikLokal.mapService.initMap('explore-map-container', 2.9595, 99.0690, 14);
        window.TitikLokal.mapService.loadShops(2.9595, 99.0690, 20);
        window.TitikLokal.mapService.addUserMarker(2.9595, 99.0690);
    }, 350);
};

export const initProfile = async () => {
    const user = store.getState().currentUser;
    if (!user) return;

    const container = document.getElementById('view-profile');
    if (!container) return;

    container.innerHTML = `
        <header class="bg-primary-600 text-white pt-8 pb-16 px-6 lg:px-8 rounded-b-[40px] relative">
            <div class="absolute inset-0 bg-gradient-to-t from-primary-700 to-transparent rounded-b-[40px] z-0"></div>
            <div class="relative z-10 flex justify-between items-center mb-6 max-w-lg mx-auto">
                <h1 class="text-2xl font-bold tracking-tight">Akun Saya</h1>
                <button class="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl transition-colors" onclick="window.TitikLokal.ui.showToast('Pengaturan Segera Hadir', 'info')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </div>
            <div class="relative z-10 flex items-center gap-4 max-w-lg mx-auto">
                <div class="relative">
                    <img src="${user.avatar}" class="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover bg-primary-100">
                    <div class="absolute -bottom-1 -right-1 bg-accent-500 text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-primary-700 shadow-sm cursor-pointer" onclick="window.TitikLokal.ui.showToast('Ganti Foto Profil', 'info')">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                </div>
                <div>
                    <h2 class="font-bold text-xl">${user.name}</h2>
                    <p class="text-primary-100 text-sm flex items-center gap-1 opacity-90">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z"></path></svg>
                        ${user.phone || 'Belum ada nomor HP'}
                    </p>
                </div>
            </div>
        </header>

        <div class="px-4 -mt-8 relative z-20 max-w-lg mx-auto space-y-4">
            <!-- Member Card -->
            <div class="bg-surface rounded-2xl p-5 shadow-card border border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="bg-accent-100 p-2.5 rounded-xl text-accent-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <div>
                        <div class="text-xs text-slate-500 font-medium">Level Membership</div>
                        <div class="font-bold text-slate-800">${user.memberLevel || 'Basic'} Member</div>
                    </div>
                </div>
                <button class="text-primary-600 text-sm font-semibold hover:text-primary-700">Detail</button>
            </div>

            <!-- Menus -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.router.navigate('view-orders')">
                    <div class="bg-blue-50 p-2 rounded-lg text-blue-600 mr-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Pesanan Saya</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.router.navigate('view-wishlist'); window.TitikLokal.layout.renderBottomNav('wishlist','buyer')">
                    <div class="bg-red-50 p-2 rounded-lg text-red-600 mr-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Wishlist Tersimpan</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.ui.showToast('Fitur Alamat Segera Hadir', 'info')">
                    <div class="bg-emerald-50 p-2 rounded-lg text-emerald-600 mr-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Daftar Alamat</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <div class="flex items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.ui.showToast('Fitur QR Code Segera Hadir', 'info')">
                    <div class="bg-violet-50 p-2 rounded-lg text-violet-600 mr-4">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">QR Code Akun</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </div>

            <!-- Logout -->
            <button class="w-full mt-4 flex items-center justify-center gap-2 p-4 text-error bg-red-50 hover:bg-red-100 rounded-2xl font-bold transition-colors" onclick="window.TitikLokal.store.dispatch('LOGOUT'); window.TitikLokal.router.navigate('view-splash')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Keluar Akun
            </button>
        </div>
    `;
};

export const initOrders = async () => {
    const user = store.getState().currentUser;
    if (!user) return;

    const container = document.getElementById('view-orders');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const orders = await api.getOrders(user.id);
        
        container.innerHTML = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 lg:py-6 flex items-center gap-4 max-w-2xl mx-auto w-full">
                <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <h1 class="text-xl font-bold text-slate-800 tracking-tight">Pesanan Saya</h1>
            </header>
            
            <div class="px-4 py-6 max-w-2xl mx-auto space-y-4">
                ${orders.length === 0 ? window.TitikLokal.ui.EmptyState('Belum ada pesanan.', 'Mulai berbelanja dan dukung UMKM lokal di sekitarmu.') : 
                orders.map(order => `
                    <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-5 cursor-pointer hover:border-primary-300 transition-colors" onclick="window.TitikLokal.ui.showToast('Detail pesanan ${order.id} segera hadir', 'info')">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                <span class="font-bold text-sm text-slate-700">Belanja</span>
                            </div>
                            <span class="text-xs font-semibold px-2 py-1 rounded-md ${order.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${order.status}</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <img src="${order.items[0]?.imgUrl || 'https://via.placeholder.com/150'}" class="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100">
                            <div class="flex-1">
                                <h4 class="font-bold text-slate-800 text-sm line-clamp-1 mb-1">${order.items[0]?.name || 'Produk'}</h4>
                                <p class="text-xs text-slate-500">${order.items.length > 1 ? `+${order.items.length - 1} produk lainnya` : `${order.items[0]?.qty} barang`}</p>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                            <div>
                                <div class="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Total Belanja</div>
                                <div class="font-bold text-slate-800">${formatters.currency(order.grandTotal)}</div>
                            </div>
                            <button class="bg-primary-50 text-primary-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-100 transition-colors">Lihat Detail</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        console.error(err);
    } finally {
        store.dispatch('isLoading', false);
    }
};

export const initWishlist = async () => {
    const user = store.getState().currentUser;
    if (!user) return;

    const container = document.getElementById('view-wishlist');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const wishlist = await api.getWishlist(user.id);
        
        container.innerHTML = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 lg:py-6 flex items-center gap-4 max-w-2xl mx-auto w-full">
                <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <h1 class="text-xl font-bold text-slate-800 tracking-tight">Wishlist Tersimpan</h1>
            </header>
            
            <div class="px-4 py-6 max-w-2xl mx-auto">
                ${wishlist.length === 0 ? window.TitikLokal.ui.EmptyState('Wishlist Kosong.', 'Cari dan simpan produk favoritmu untuk dibeli nanti.') : 
                `<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    ${wishlist.map(item => `
                        <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden group">
                            <div class="relative aspect-square overflow-hidden bg-slate-100">
                                <img src="${item.product.images?.[0]?.imgUrl || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                <button class="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm" onclick="window.TitikLokal.api.toggleWishlist('${user.id}', '${item.productId}'); window.TitikLokal.initWishlist();">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </button>
                            </div>
                            <div class="p-3">
                                <h3 class="font-bold text-slate-800 text-sm line-clamp-2 mb-1">${item.product.name}</h3>
                                <div class="font-bold text-primary-600 mb-2">${formatters.currency(item.product.price)}</div>
                                <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl text-xs font-bold transition-colors" onclick="window.TitikLokal.api.addToCart('${user.id}', '${item.productId}', 1); window.TitikLokal.ui.showToast('Ditambahkan ke keranjang!', 'success');">
                                    + Keranjang
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>`
                }
            </div>
        `;
    } catch (err) {
        console.error(err);
    } finally {
        store.dispatch('isLoading', false);
    }
};

export const initShopProfile = async (payload) => {
    const shopId = typeof payload === 'string' ? payload : payload?.shopId;
    if (!shopId) return;

    const container = document.getElementById('view-shop-profile');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const shop = await api.getShopById(shopId);
        const products = await api.getProductsByShop(shopId);
        const reviews = await api.getReviewsByShop(shopId);
        const user = store.getState().currentUser;

        container.innerHTML = `
            <header class="relative h-52 lg:h-72 bg-slate-200 shrink-0">
                <img src="${shop.coverImg}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <button onclick="window.TitikLokal.router.back()" class="absolute top-4 left-4 p-2.5 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40 transition-colors z-10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <div class="absolute bottom-4 left-4 right-4 z-10 flex items-end gap-3">
                    <img src="${shop.logo}" class="w-16 h-16 rounded-2xl border-2 border-white bg-white shadow-sm object-cover shrink-0">
                    <div class="text-white">
                        <div class="font-bold text-xl flex items-center gap-2">
                            ${shop.name}
                            ${shop.verificationStatus === 'verified' ? '<svg class="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' : ''}
                        </div>
                        <div class="flex items-center gap-3 text-xs text-white/80 mt-0.5">
                            <span class="flex items-center gap-1"><svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${shop.rating}</span>
                            <span>${shop.totalReviews} Ulasan</span>
                            <span class="${shop.isOpen ? 'text-emerald-300' : 'text-red-300'} font-semibold">${shop.isOpen ? 'Buka' : 'Tutup'}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="max-w-4xl mx-auto px-4 lg:px-6 pb-24">
                <!-- Info Bar -->
                <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100 my-4 grid grid-cols-3 divide-x divide-slate-100 text-center">
                    <div class="px-4">
                        <div class="font-bold text-lg text-slate-800">${shop.totalSales}+</div>
                        <div class="text-xs text-slate-500 font-medium">Terjual</div>
                    </div>
                    <div class="px-4">
                        <div class="font-bold text-lg text-slate-800">${shop.totalReviews}</div>
                        <div class="text-xs text-slate-500 font-medium">Ulasan</div>
                    </div>
                    <div class="px-4">
                        <div class="font-bold text-lg text-slate-800">${shop.openHours}</div>
                        <div class="text-xs text-slate-500 font-medium">Jam Buka</div>
                    </div>
                </div>

                <!-- Description -->
                <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100 mb-4">
                    <h3 class="font-bold text-slate-800 mb-2 text-sm">Tentang Toko</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${shop.description}</p>
                </div>

                <!-- Location -->
                <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100 mb-4">
                    <h3 class="font-bold text-slate-800 mb-2 text-sm">Lokasi</h3>
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-start gap-2 text-sm text-slate-600">
                            <svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span>${shop.address}</span>
                        </div>
                        <a href="${shop.gmapsLink || `https://www.google.com/maps/search/${encodeURIComponent(shop.name)}/@${shop.coords[0]},${shop.coords[1]},15z`}" target="_blank" class="shrink-0 bg-primary-50 text-primary-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            Lihat di Maps
                        </a>
                    </div>
                </div>

                <!-- Products -->
                <h3 class="font-bold text-lg text-slate-800 mb-3 mt-6">Produk Tersedia</h3>
                ${products.length === 0 ? window.TitikLokal.ui.EmptyState('Belum ada produk') :
                `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    ${products.map(product => `
                        <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden group">
                            <div class="relative pt-[100%] bg-slate-50 overflow-hidden">
                                <img src="${product.images?.[0]?.imgUrl || 'https://via.placeholder.com/400'}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                <button class="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm transition-colors ${user && window.TitikLokal.api.isWishlisted(user.id, product.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}" 
                                    onclick="window.TitikLokal.api.toggleWishlist('${user?.id}', '${product.id}').then(() => window.TitikLokal.ui.showToast('Wishlist diperbarui', 'success'))">
                                    <svg class="w-4 h-4" fill="${user && window.TitikLokal.api.isWishlisted(user.id, product.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </button>
                                ${!product.status || product.stock < 1 ? '<div class="absolute inset-0 bg-white/70 flex items-center justify-center"><span class="bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold">Habis</span></div>' : ''}
                            </div>
                            <div class="p-3">
                                <h4 class="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">${product.name}</h4>
                                <div class="flex items-center gap-1 mb-2">
                                    <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <span class="text-[10px] text-slate-500">${product.rating} (${product.reviews})</span>
                                </div>
                                <div class="font-bold text-primary-600 text-sm mb-2">${formatters.currency(product.price)}</div>
                                ${product.status && product.stock > 0 && user ? `
                                <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl text-xs font-bold transition-colors"
                                    onclick="window.TitikLokal.api.addToCart('${user.id}', '${product.id}', 1).then(() => { window.TitikLokal.ui.showToast('Masuk Keranjang!', 'success'); window.TitikLokal.updateCartBadge(); })">
                                    + Keranjang
                                </button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>`}

                <!-- Reviews -->
                <h3 class="font-bold text-lg text-slate-800 mb-3 mt-6">Ulasan Pembeli (${reviews.length})</h3>
                ${reviews.length === 0 ? `<div class="text-slate-500 text-sm text-center py-8 bg-surface rounded-2xl border border-slate-100">Belum ada ulasan.</div>` :
                `<div class="space-y-4">
                    ${reviews.slice(0, 5).map(rev => `
                        <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100">
                            <div class="flex items-center gap-3 mb-2">
                                <img src="${rev.user?.avatar || 'https://ui-avatars.com/api/?name=User'}" class="w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200">
                                <div>
                                    <div class="font-bold text-sm text-slate-800">${rev.user?.name || 'Pengguna'}</div>
                                    <div class="flex items-center gap-0.5 mt-0.5">
                                        ${Array.from({length: 5}, (_, i) => `<svg class="w-3.5 h-3.5 ${i < rev.rating ? 'text-yellow-400' : 'text-slate-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`).join('')}
                                    </div>
                                </div>
                            </div>
                            <p class="text-sm text-slate-600 leading-relaxed">${rev.comment}</p>
                            ${rev.sellerReply ? `<div class="mt-3 bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border-l-2 border-primary-400"><span class="font-bold text-primary-600">Penjual:</span> ${rev.sellerReply}</div>` : ''}
                        </div>
                    `).join('')}
                </div>`}
            </div>
        `;
    } catch (err) {
        console.error(err);
        container.innerHTML = window.TitikLokal.ui.EmptyState('Toko tidak ditemukan.');
    } finally {
        store.dispatch('isLoading', false);
    }
};

// Global Exposure
window.TitikLokal.initBuyerHome = initBuyerHome;
window.TitikLokal.initExploreMap = initExploreMap;
window.TitikLokal.initProfile = initProfile;
window.TitikLokal.initOrders = initOrders;
window.TitikLokal.initWishlist = initWishlist;
window.TitikLokal.initShopProfile = initShopProfile;
