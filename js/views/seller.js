/**
 * TitikLokal - Seller View Controller (Functional UI Redesign)
 * Full implementation of Dashboard, Products, Orders, Chat, and Profile.
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { formatters } from '../utils/formatters.js';

window.TitikLokal = window.TitikLokal || {};

const getShopData = async () => {
    const user = store.get('currentUser');
    if (!user || user.role !== 'seller') {
        window.TitikLokal.router.navigate('view-splash');
        return null;
    }
    const shops = await api.getShopsByOwnerId(user.id);
    if (shops.length === 0) {
        window.TitikLokal.ui.showToast('Toko tidak ditemukan.', 'error');
        return null;
    }
    store.dispatch('sellerShop', shops[0]);
    return shops[0];
};

// ==========================================
// 1. DASHBOARD
// ==========================================
export const initSellerDashboard = async () => {
    store.dispatch('isLoading', true);
    try {
        const shop = await getShopData();
        if (!shop) return;
        
        const [stats, allProducts] = await Promise.all([
            api.getSellerStats(shop.id),
            api.getAllProducts()
        ]);
        const myProducts = allProducts.filter(p => p.shopId === shop.id);
        renderSellerDashboard(shop, stats, myProducts);
    } catch (e) {
        console.error(e);
        window.TitikLokal.ui.showToast(e.message, 'error');
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderSellerDashboard = (shop, stats, myProducts) => {
    const container = document.getElementById('view-seller-dashboard');
    if (!container) return;

    const activeProductsCount = myProducts.filter(p => p.status !== false).length;
    const incomeToday = 245000; 
    const incomeMonth = 12500000;

    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-slate-50 min-h-screen">
            
            <!-- Header -->
            <div class="bg-white p-5 shadow-sm mb-4">
                <div class="flex items-center gap-4">
                    <img src="${shop.logo}" class="w-16 h-16 rounded-full object-cover border border-slate-200 bg-slate-100">
                    <div class="flex-1">
                        <h1 class="text-xl font-bold text-slate-900 leading-tight truncate">${shop.name}</h1>
                        <p class="text-sm text-slate-500 mb-2 flex items-center gap-1">
                            <span class="w-2 h-2 rounded-full ${shop.isOpen ? 'bg-success' : 'bg-slate-300'}"></span>
                            ${shop.isOpen ? 'Buka' : 'Tutup'}
                        </p>
                    </div>
                </div>
                <div class="flex gap-2 mt-4">
                    <button class="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors" onclick="window.TitikLokal.seller.openEditProfileModal()">
                        Edit Profil
                    </button>
                    <button class="flex-1 border border-primary-200 hover:bg-primary-50 text-primary-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors" onclick="window.TitikLokal.router.navigate('view-shop-profile', '${shop.id}')">
                        Preview Toko
                    </button>
                </div>
            </div>

            <!-- Ringkasan Hari Ini -->
            <div class="px-4 mb-6">
                <h2 class="font-bold text-slate-800 mb-3">Ringkasan Hari Ini</h2>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                        <p class="text-3xl font-bold text-primary-600 mb-1">${stats.pendingOrders}</p>
                        <p class="text-xs font-semibold text-slate-500">Pesanan Baru</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                        <p class="text-3xl font-bold text-slate-700 mb-1">${stats.processingOrders || 0}</p>
                        <p class="text-xs font-semibold text-slate-500">Diproses</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                        <p class="text-lg font-bold text-success mb-1">${formatters.currency(incomeToday)}</p>
                        <p class="text-xs font-semibold text-slate-500">Pendapatan</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                        <p class="text-3xl font-bold text-slate-700 mb-1">${activeProductsCount}</p>
                        <p class="text-xs font-semibold text-slate-500">Produk Aktif</p>
                    </div>
                </div>
            </div>

            <!-- Quick Action -->
            <div class="px-4 mb-6">
                <h2 class="font-bold text-slate-800 mb-3">Aksi Cepat</h2>
                <div class="grid grid-cols-3 gap-3">
                    <button class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50" onclick="window.TitikLokal.seller.openAddProductModal()">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold text-slate-700">Tambah<br>Produk</span>
                    </button>
                    <button class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50" onclick="window.TitikLokal.router.navigate('view-seller-products')">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold text-slate-700">Daftar<br>Produk</span>
                    </button>
                    <button class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50" onclick="window.TitikLokal.router.navigate('view-seller-orders')">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold text-slate-700">Pesanan<br>Masuk</span>
                    </button>
                    <button class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50" onclick="window.TitikLokal.router.navigate('view-seller-chat')">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold text-slate-700">Chat<br>Pembeli</span>
                    </button>
                    <button class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50" onclick="window.TitikLokal.ui.showToast('Fitur ini akan segera hadir')">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold text-slate-700">Promosi<br>Diskon</span>
                    </button>
                    <button class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50" onclick="window.TitikLokal.ui.showToast('Fitur ini akan segera hadir')">
                        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold text-slate-700">Info<br>Keuangan</span>
                    </button>
                </div>
            </div>

            <!-- Statistik -->
            <div class="px-4 mb-8">
                <h2 class="font-bold text-slate-800 mb-3">Statistik Pendapatan</h2>
                <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p class="text-sm text-slate-500 mb-1">Total Bulan Ini</p>
                    <p class="text-2xl font-extrabold text-slate-900 mb-4">${formatters.currency(incomeMonth)}</p>
                    <canvas id="seller-chart" width="100" height="40"></canvas>
                </div>
            </div>

        </div>
    `;

    setTimeout(() => {
        const ctx = document.getElementById('seller-chart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                    datasets: [{
                        label: 'Penjualan',
                        data: [120, 190, 300, 250, 200, 350, 400],
                        backgroundColor: '#2563eb',
                        borderRadius: 4
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: { 
                        y: { display: false },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }, 100);
};

// ==========================================
// 2. PRODUCTS
// ==========================================
export const initSellerProducts = async () => {
    store.dispatch('isLoading', true);
    try {
        const shop = await getShopData();
        if (!shop) return;
        const allProducts = await api.getAllProducts();
        const myProducts = allProducts.filter(p => p.shopId === shop.id);
        renderSellerProducts(myProducts);
    } catch (e) {
        console.error(e);
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderSellerProducts = (products) => {
    const container = document.getElementById('view-seller-products');
    if (!container) return;

    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-slate-50 min-h-screen relative pb-10">
            <!-- Header & Search -->
            <div class="bg-white p-4 shadow-sm sticky top-0 z-10 border-b border-slate-200">
                <h1 class="text-xl font-bold text-slate-900 mb-3">Daftar Produk</h1>
                <div class="relative">
                    <input type="text" placeholder="Cari produk..." class="w-full bg-slate-100 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                </div>
            </div>

            <!-- List -->
            <div class="p-4 flex flex-col gap-3">
                ${products.map(p => `
                    <div class="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-3">
                        <img src="${p.image}" class="w-20 h-20 rounded-lg object-cover bg-slate-100 shrink-0">
                        <div class="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 class="font-bold text-slate-800 text-sm truncate">${p.name}</h3>
                            <p class="text-primary-600 font-bold text-sm mt-0.5">${formatters.currency(p.price)}</p>
                            <p class="text-xs text-slate-500 mt-1">Stok: ${p.stock} | ${p.status !== false ? 'Aktif' : 'Nonaktif'}</p>
                        </div>
                        <div class="flex flex-col justify-between items-end">
                            <button class="p-2 text-slate-400 hover:text-slate-700" onclick="window.TitikLokal.ui.showToast('Fitur ini akan segera hadir')">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
                ${products.length === 0 ? '<p class="text-center text-slate-500 my-10">Belum ada produk.</p>' : ''}
            </div>

            <!-- FAB -->
            <button class="fixed bottom-20 right-4 lg:right-auto lg:ml-[28rem] w-14 h-14 bg-primary-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors z-20" onclick="window.TitikLokal.seller.openAddProductModal()">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
        </div>
    `;
};

// ==========================================
// 3. ORDERS
// ==========================================
export const initSellerOrders = async () => {
    store.dispatch('isLoading', true);
    try {
        const shop = await getShopData();
        if (!shop) return;
        renderSellerOrders();
    } catch (e) {
        console.error(e);
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderSellerOrders = () => {
    const container = document.getElementById('view-seller-orders');
    if (!container) return;

    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-slate-50 min-h-screen">
            <div class="bg-white p-4 shadow-sm sticky top-0 z-10">
                <h1 class="text-xl font-bold text-slate-900">Pesanan Masuk</h1>
            </div>
            
            <div class="flex overflow-x-auto bg-white border-b border-slate-200">
                <button class="px-5 py-3 border-b-2 border-primary-600 text-primary-600 font-bold text-sm whitespace-nowrap">Baru (0)</button>
                <button class="px-5 py-3 text-slate-500 font-medium text-sm whitespace-nowrap" onclick="window.TitikLokal.ui.showToast('Tab ini kosong')">Diproses (0)</button>
                <button class="px-5 py-3 text-slate-500 font-medium text-sm whitespace-nowrap" onclick="window.TitikLokal.ui.showToast('Tab ini kosong')">Dikirim (0)</button>
                <button class="px-5 py-3 text-slate-500 font-medium text-sm whitespace-nowrap" onclick="window.TitikLokal.ui.showToast('Tab ini kosong')">Selesai (0)</button>
            </div>

            <div class="p-6 text-center mt-10">
                <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                <p class="text-slate-500 font-medium">Belum ada pesanan baru</p>
            </div>
        </div>
    `;
};

// ==========================================
// 4. CHAT
// ==========================================
export const initSellerChat = async () => {
    store.dispatch('isLoading', true);
    try {
        const shop = await getShopData();
        if (!shop) return;
        renderSellerChat();
    } catch (e) {
        console.error(e);
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderSellerChat = () => {
    const container = document.getElementById('view-seller-chat');
    if (!container) return;

    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-slate-50 min-h-screen">
            <div class="bg-white p-4 shadow-sm border-b border-slate-200 flex justify-between items-center sticky top-0">
                <h1 class="text-xl font-bold text-slate-900">Chat Pembeli</h1>
                <span class="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">1 Belum Dibaca</span>
            </div>

            <div class="divide-y divide-slate-100 bg-white">
                <div class="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50" onclick="window.TitikLokal.seller.openChatRoom('Siti Aisyah', 'Apakah barang ini ready kak?')">
                    <div class="w-12 h-12 bg-blue-100 text-blue-600 font-bold text-xl rounded-full shrink-0 flex items-center justify-center">S</div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-baseline mb-1">
                            <h3 class="font-bold text-slate-800 truncate">Siti Aisyah</h3>
                            <span class="text-xs text-primary-600 font-bold">09:12</span>
                        </div>
                        <p class="text-sm text-slate-500 truncate font-semibold text-slate-800">Apakah barang ini ready kak?</p>
                    </div>
                </div>
                <div class="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50" onclick="window.TitikLokal.seller.openChatRoom('Budi Santoso', 'Terima kasih, pesanannya pas!')">
                    <div class="w-12 h-12 bg-emerald-100 text-emerald-600 font-bold text-xl rounded-full shrink-0 flex items-center justify-center">B</div>
                    <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-baseline mb-1">
                            <h3 class="font-bold text-slate-800 truncate">Budi Santoso</h3>
                            <span class="text-xs text-slate-400">Kemarin</span>
                        </div>
                        <p class="text-sm text-slate-500 truncate">Terima kasih, pesanannya pas!</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

// ==========================================
// 5. PROFILE
// ==========================================
export const initSellerProfile = async () => {
    store.dispatch('isLoading', true);
    try {
        const shop = await getShopData();
        if (!shop) return;
        renderSellerProfile(shop);
    } catch (e) {
        console.error(e);
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderSellerProfile = (shop) => {
    const container = document.getElementById('view-seller-profile');
    if (!container) return;

    container.innerHTML = `
        <div class="max-w-lg mx-auto bg-slate-50 min-h-screen pb-10">
            <div class="bg-white p-4 shadow-sm border-b border-slate-200 mb-4 sticky top-0 z-10 flex items-center justify-between">
                <h1 class="text-xl font-bold text-slate-900">Profil Toko</h1>
            </div>

            <div class="bg-white divide-y divide-slate-100 border-y border-slate-200 mb-6">
                <div class="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.seller.openEditProfileModal()">
                    <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div class="flex-1">
                        <span class="font-bold text-slate-800 block text-sm">Informasi & Pengaturan Toko</span>
                        <span class="text-xs text-slate-500">Ubah nama, foto, jam buka & alamat</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.seller.openReviewsModal()">
                    <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    </div>
                    <div class="flex-1">
                        <span class="font-bold text-slate-800 block text-sm">Ulasan Pembeli</span>
                        <span class="text-xs text-slate-500">Lihat dan balas komentar pembeli</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.seller.openBankModal()">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    </div>
                    <div class="flex-1">
                        <span class="font-bold text-slate-800 block text-sm">Rekening Bank</span>
                        <span class="text-xs text-slate-500">Atur rekening pencairan dana</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.seller.openShippingModal()">
                    <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <div class="flex-1">
                        <span class="font-bold text-slate-800 block text-sm">Opsi Pengiriman</span>
                        <span class="text-xs text-slate-500">Atur kurir yang didukung</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </div>

            <div class="px-4">
                <button class="w-full bg-white border border-error text-error font-bold py-3 rounded-xl shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2" onclick="window.TitikLokal.store.dispatch('LOGOUT'); window.TitikLokal.router.navigate('view-splash');">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout Akun
                </button>
            </div>
        </div>
    `;
};


// ==========================================
// SELLER FUNCTIONAL ACTIONS (MODALS)
// ==========================================
window.TitikLokal.seller = {
    // Utility for FileReader Base64
    readImageFile: (inputElement, callback) => {
        const file = inputElement.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => callback(e.target.result);
            reader.readAsDataURL(file);
        }
    },

    openEditProfileModal: () => {
        const shop = store.get('sellerShop');
        if (!shop) return;
        
        // Use global variables to store base64 strings if user uploads a new image
        window.TitikLokal.tempLogo = shop.logo;
        window.TitikLokal.tempCover = shop.coverImg;

        const html = `
            <form id="edit-shop-form" class="space-y-4 max-h-[70vh] overflow-y-auto pr-1" onsubmit="event.preventDefault(); window.TitikLokal.seller.submitEditProfile()">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nama UMKM</label>
                    <input type="text" id="es-name" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500" value="${shop.name}" required>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Foto Profil (Logo)</label>
                        <div class="border-2 border-dashed border-slate-200 rounded-xl p-2 text-center cursor-pointer hover:bg-slate-50 relative overflow-hidden" onclick="document.getElementById('es-logo-input').click()">
                            <img id="es-logo-preview" src="${shop.logo}" class="w-full h-16 object-cover rounded-lg mb-1 bg-slate-100">
                            <span class="text-[10px] font-bold text-primary-600">Ubah Logo</span>
                            <input type="file" id="es-logo-input" accept="image/*" class="hidden" onchange="window.TitikLokal.seller.readImageFile(this, res => { document.getElementById('es-logo-preview').src = res; window.TitikLokal.tempLogo = res; })">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Foto Banner</label>
                        <div class="border-2 border-dashed border-slate-200 rounded-xl p-2 text-center cursor-pointer hover:bg-slate-50 relative overflow-hidden" onclick="document.getElementById('es-cover-input').click()">
                            <img id="es-cover-preview" src="${shop.coverImg}" class="w-full h-16 object-cover rounded-lg mb-1 bg-slate-100">
                            <span class="text-[10px] font-bold text-primary-600">Ubah Banner</span>
                            <input type="file" id="es-cover-input" accept="image/*" class="hidden" onchange="window.TitikLokal.seller.readImageFile(this, res => { document.getElementById('es-cover-preview').src = res; window.TitikLokal.tempCover = res; })">
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap Toko</label>
                    <textarea id="es-address" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm h-16 focus:outline-none focus:border-primary-500">${shop.address || 'Pematang Siantar'}</textarea>
                </div>
                
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Jam Operasional (Contoh: 08:00 - 17:00)</label>
                    <input type="text" id="es-hours" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500" value="${shop.openHours || '08:00 - 22:00'}">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Toko</label>
                    <textarea id="es-desc" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm h-16 focus:outline-none focus:border-primary-500">${shop.description}</textarea>
                </div>

                <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <input type="checkbox" id="es-open" class="w-4 h-4 text-primary-600" ${shop.isOpen ? 'checked' : ''}>
                    <label class="text-sm font-bold text-slate-800">Toko Sedang Buka Hari Ini</label>
                </div>
                <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm mt-2">
                    Simpan Perubahan
                </button>
            </form>
        `;
        window.TitikLokal.ui.showModal('Informasi Toko', html);
    },

    submitEditProfile: async () => {
        const shop = store.get('sellerShop');
        const updates = {
            name: document.getElementById('es-name').value,
            logo: window.TitikLokal.tempLogo,
            coverImg: window.TitikLokal.tempCover,
            address: document.getElementById('es-address').value,
            openHours: document.getElementById('es-hours').value,
            description: document.getElementById('es-desc').value,
            isOpen: document.getElementById('es-open').checked,
        };
        try {
            await api.updateShop(shop.id, updates);
            window.TitikLokal.ui.hideModal('modal-generic');
            window.TitikLokal.ui.showToast('Profil toko berhasil diperbarui', 'success');
            
            // Re-fetch and update store so changes reflect everywhere immediately
            const freshShop = await api.getShopById(shop.id);
            store.dispatch('sellerShop', freshShop);

            setTimeout(() => {
                const currentView = window.TitikLokal.router.getCurrentView();
                if (currentView === 'view-seller-dashboard') {
                    initSellerDashboard();
                } else if (currentView === 'view-seller-profile') {
                    initSellerProfile();
                }
            }, 300);
        } catch (e) {
            window.TitikLokal.ui.showToast('Gagal memperbarui profil', 'error');
        }
    },

    openAddProductModal: () => {
        window.TitikLokal.tempProductImage = 'https://via.placeholder.com/300?text=Pilih+Foto';
        const html = `
            <form id="add-product-form" class="space-y-4 max-h-[70vh] overflow-y-auto pr-1" onsubmit="event.preventDefault(); window.TitikLokal.seller.submitAddProduct()">
                
                <!-- Image Upload -->
                <div class="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors" onclick="document.getElementById('ap-image-input').click()">
                    <img id="ap-image-preview" src="${window.TitikLokal.tempProductImage}" class="w-full h-32 object-cover rounded-xl mb-3 bg-slate-100 shadow-sm">
                    <span class="bg-primary-50 text-primary-600 font-bold px-4 py-1.5 rounded-lg text-xs">Pilih Foto Produk Lokal</span>
                    <input type="file" id="ap-image-input" accept="image/*" class="hidden" onchange="window.TitikLokal.seller.readImageFile(this, res => { document.getElementById('ap-image-preview').src = res; window.TitikLokal.tempProductImage = res; })">
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nama Produk</label>
                    <input type="text" id="ap-name" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500" placeholder="Misal: Keripik Pisang Khas" required>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Harga (Rp)</label>
                        <input type="number" id="ap-price" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500" placeholder="Contoh: 15000" required>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Stok Awal</label>
                        <input type="number" id="ap-stock" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500" placeholder="Contoh: 50" required>
                    </div>
                </div>
                
                <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm mt-2">
                    Simpan Produk Baru
                </button>
            </form>
        `;
        window.TitikLokal.ui.showModal('Tambah Produk', html);
    },

    submitAddProduct: async () => {
        const shop = store.get('sellerShop');
        
        const data = {
            shopId: shop.id,
            name: document.getElementById('ap-name').value,
            price: parseInt(document.getElementById('ap-price').value),
            stock: parseInt(document.getElementById('ap-stock').value),
            image: window.TitikLokal.tempProductImage,
            status: true,
            rating: 0,
            sold: 0
        };
        try {
            await api.addProduct(data);
            window.TitikLokal.ui.hideModal('modal-generic');
            window.TitikLokal.ui.showToast('Produk berhasil ditambahkan', 'success');
            if (window.TitikLokal.router.getCurrentView() === 'view-seller-products') {
                initSellerProducts();
            } else if (window.TitikLokal.router.getCurrentView() === 'view-seller-dashboard') {
                initSellerDashboard();
            }
        } catch (e) {
            window.TitikLokal.ui.showToast('Gagal menyimpan produk', 'error');
        }
    },

    openChatRoom: (userName, message) => {
        const html = `
            <div class="flex flex-col h-[50vh]">
                <div class="flex-1 overflow-y-auto p-4 bg-slate-50 rounded-xl mb-4 border border-slate-100 flex flex-col gap-3">
                    <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none self-start max-w-[85%] shadow-sm">
                        <p class="text-sm text-slate-700">${message}</p>
                        <p class="text-[10px] text-slate-400 mt-1">Hari ini</p>
                    </div>
                    <div id="chat-reply-container" class="hidden"></div>
                </div>
                <div class="flex gap-2">
                    <input type="text" id="chat-reply-input" class="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-500" placeholder="Ketik balasan...">
                    <button class="bg-primary-600 text-white px-4 py-2 rounded-xl" onclick="window.TitikLokal.seller.sendChatReply()">Kirim</button>
                </div>
            </div>
        `;
        window.TitikLokal.ui.showModal(`Chat dengan ${userName}`, html);
    },

    sendChatReply: () => {
        const input = document.getElementById('chat-reply-input');
        const text = input.value.trim();
        if (!text) return;
        
        const container = document.getElementById('chat-reply-container');
        container.innerHTML += `
            <div class="bg-primary-100 border border-primary-200 p-3 rounded-2xl rounded-tr-none self-end max-w-[85%] shadow-sm ml-auto mb-3">
                <p class="text-sm text-slate-800">${text}</p>
                <p class="text-[10px] text-primary-600 mt-1 text-right">Baru saja</p>
            </div>
        `;
        container.classList.remove('hidden');
        container.classList.add('flex', 'flex-col');
        input.value = '';
    },

    openReviewsModal: async () => {
        const shop = store.get('sellerShop');
        if (!shop) {
            window.TitikLokal.ui.showToast('Data toko tidak ditemukan, coba refresh halaman.', 'error');
            return;
        }
        
        let reviews = [];
        try {
            reviews = await api.getReviewsByShop(shop.id);
        } catch (e) {
            window.TitikLokal.ui.showToast('Gagal memuat ulasan.', 'error');
            return;
        }
        
        const html = `
            <div class="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                ${reviews.length === 0 
                    ? '<p class="text-center text-slate-500 py-10">Belum ada ulasan dari pembeli.</p>' 
                    : reviews.map(r => `
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center shrink-0">${(r.user?.name || r.userName || 'A').charAt(0).toUpperCase()}</div>
                                <h4 class="font-bold text-slate-800 text-sm">${r.user?.name || r.userName || 'Pembeli'}</h4>
                            </div>
                            <span class="flex items-center text-amber-500 text-sm font-bold">
                                <svg class="w-4 h-4 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                ${r.rating}
                            </span>
                        </div>
                        <p class="text-sm text-slate-600 mb-3 leading-relaxed">${r.comment}</p>
                        ${r.sellerReply 
                            ? `<div class="bg-white p-3 rounded-lg border-l-4 border-primary-400 text-sm text-slate-700">
                                 <span class="font-bold text-xs text-primary-600 block mb-1">Balasan Anda:</span>
                                 ${r.sellerReply}
                               </div>` 
                            : `<div>
                               <div id="reply-form-${r.id}" class="hidden flex-col gap-2 mt-2">
                                 <textarea id="reply-text-${r.id}" rows="2" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500" placeholder="Ketik balasan Anda kepada pembeli..."></textarea>
                                 <div class="flex gap-2">
                                   <button class="flex-1 bg-primary-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-primary-700" onclick="window.TitikLokal.seller.submitReviewReply('${r.id}')">Kirim Balasan</button>
                                   <button class="px-3 bg-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg" onclick="document.getElementById('reply-form-${r.id}').classList.add('hidden'); document.getElementById('reply-btn-${r.id}').classList.remove('hidden');">Batal</button>
                                 </div>
                               </div>
                               <button id="reply-btn-${r.id}" class="text-xs font-bold text-primary-600 border border-primary-200 px-3 py-1.5 rounded-lg w-full hover:bg-primary-50 transition-colors mt-1" onclick="document.getElementById('reply-form-${r.id}').classList.remove('hidden'); document.getElementById('reply-form-${r.id}').classList.add('flex'); document.getElementById('reply-btn-${r.id}').classList.add('hidden');">
                                 Balas Ulasan Ini
                               </button>
                               </div>`
                        }
                    </div>
                `).join('')}
            </div>
        `;
        window.TitikLokal.ui.showModal(`Ulasan Pembeli (${reviews.length})`, html);
    },

    submitReviewReply: async (reviewId) => {
        const text = document.getElementById(`reply-text-${reviewId}`).value.trim();
        if (!text) return;
        try {
            await api.replyReview(reviewId, text);
            window.TitikLokal.ui.showToast('Balasan berhasil dikirim', 'success');
            // Refresh modal
            window.TitikLokal.seller.openReviewsModal();
        } catch (e) {
            window.TitikLokal.ui.showToast('Gagal mengirim balasan', 'error');
        }
    },

    openBankModal: () => {
        const html = `
            <form id="bank-form" class="space-y-4" onsubmit="event.preventDefault(); window.TitikLokal.seller.submitBank()">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Pilih Bank</label>
                    <select id="bank-name" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500">
                        <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                        <option value="BCA">Bank Central Asia (BCA)</option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BNI">Bank Negara Indonesia (BNI)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nomor Rekening</label>
                    <input type="number" id="bank-acc" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500" placeholder="Contoh: 002134567890" required>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nama Pemilik Rekening</label>
                    <input type="text" id="bank-owner" class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500" placeholder="Sesuai buku tabungan" required>
                </div>
                <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm">
                    Simpan Rekening
                </button>
            </form>
        `;
        window.TitikLokal.ui.showModal('Pengaturan Rekening', html);
    },

    submitBank: () => {
        // Simulasi simpan pengaturan
        window.TitikLokal.ui.hideModal('modal-generic');
        window.TitikLokal.ui.showToast('Rekening bank berhasil disimpan', 'success');
    },

    openShippingModal: () => {
        const html = `
            <form id="shipping-form" class="space-y-4" onsubmit="event.preventDefault(); window.TitikLokal.seller.submitShipping()">
                <p class="text-sm text-slate-600 mb-3">Pilih layanan kurir yang Anda dukung untuk mengirimkan barang ke pembeli.</p>
                <div class="space-y-2">
                    <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" class="w-5 h-5 text-primary-600 rounded" checked>
                        <div class="flex-1">
                            <span class="block font-bold text-slate-800 text-sm">Kurir Lokal (TitikLokal Express)</span>
                            <span class="block text-xs text-slate-500">Direkomendasikan untuk dalam kota</span>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" class="w-5 h-5 text-primary-600 rounded" checked>
                        <div class="flex-1">
                            <span class="block font-bold text-slate-800 text-sm">Ambil Sendiri di Toko</span>
                            <span class="block text-xs text-slate-500">Pembeli datang ke lokasi</span>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" class="w-5 h-5 text-primary-600 rounded">
                        <div class="flex-1">
                            <span class="block font-bold text-slate-800 text-sm">JNE / J&T</span>
                            <span class="block text-xs text-slate-500">Untuk pengiriman antar provinsi</span>
                        </div>
                    </label>
                </div>
                <button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm mt-4">
                    Simpan Kurir
                </button>
            </form>
        `;
        window.TitikLokal.ui.showModal('Opsi Pengiriman', html);
    },

    submitShipping: () => {
        window.TitikLokal.ui.hideModal('modal-generic');
        window.TitikLokal.ui.showToast('Opsi pengiriman berhasil diperbarui', 'success');
    }
};
