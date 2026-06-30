/**
 * TitikLokal - Seller View Controller
 * Mengatur interaksi DOM untuk Dashboard Penjual.
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { formatters } from '../utils/formatters.js';

window.TitikLokal = window.TitikLokal || {};

export const initSellerDashboard = async () => {
    store.dispatch('isLoading', true);
    try {
        const user = store.get('currentUser');
        if (!user || user.role !== 'seller') {
            window.TitikLokal.router.navigate('view-splash');
            return;
        }

        const shops = await api.getShopsByOwnerId(user.id);
        if (shops.length === 0) {
            window.TitikLokal.ui.showToast('Toko tidak ditemukan.', 'error');
            return;
        }
        
        const shop = shops[0]; // For MVP, assume 1 shop per seller
        store.dispatch('sellerShop', shop);
        
        const stats = await api.getSellerStats(shop.id);
        renderSellerDashboard(shop, stats);
        
    } catch (e) {
        console.error(e);
        window.TitikLokal.ui.showToast(e.message, 'error');
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderSellerDashboard = (shop, stats) => {
    const container = document.getElementById('view-seller-dashboard');
    if (!container) return;
    
    container.innerHTML = `
        <div class="max-w-5xl mx-auto">
            <header class="bg-surface lg:bg-transparent lg:border-none border-b border-slate-100 p-4 lg:p-0 mb-6 sticky top-0 z-30 lg:relative">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <img src="${shop.logo}" class="w-12 h-12 rounded-2xl border-2 border-surface shadow-sm object-cover">
                        <div>
                            <h2 class="font-bold text-xl text-slate-800 leading-tight">${shop.name}</h2>
                            <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">Seller Center</span>
                        </div>
                    </div>
                    <button class="bg-surface border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm lg:hidden" onclick="window.TitikLokal.router.navigate('view-splash')">
                        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            </header>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 px-4 lg:px-0">
                <!-- Saldo -->
                <div class="bg-primary-600 rounded-3xl p-6 shadow-lg shadow-primary-500/20 text-white relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div class="text-primary-100 text-sm font-medium mb-1 flex justify-between">
                        Saldo Tersedia
                        <svg class="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div class="text-3xl font-bold tracking-tight mb-6">${formatters.currency(shop.balance)}</div>
                    <div class="flex gap-3 relative z-10">
                        <button class="flex-1 bg-white text-primary-600 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-50 active:scale-95 transition-all shadow-sm" onclick="window.TitikLokal.ui.showToast('Fitur Tarik Saldo Segera Hadir', 'info')">Tarik Dana</button>
                    </div>
                </div>
                
                <!-- Stats -->
                <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100 flex flex-col justify-center cursor-pointer hover:border-primary-200 transition-colors" onclick="window.TitikLokal.router.navigate('view-seller-orders')">
                    <div class="text-slate-500 text-sm font-medium mb-1 flex justify-between items-center">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            Pesanan Perlu Diproses
                        </span>
                        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                    <div class="text-3xl font-bold text-slate-800">${stats.pendingOrders}</div>
                    <div class="text-xs ${stats.pendingOrders > 0 ? 'text-error' : 'text-slate-500'} font-bold mt-2">
                        ${stats.pendingOrders > 0 ? `<span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ${stats.pendingOrders} pesanan perlu diproses</span>` : '<span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Semua pesanan telah diproses</span>'}
                    </div>
                </div>
                
                <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100 flex flex-col justify-center cursor-pointer hover:border-primary-200 transition-colors" onclick="window.TitikLokal.router.navigate('view-seller-products')">
                    <div class="text-slate-500 text-sm font-medium mb-1 flex justify-between items-center">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            Total Produk
                        </span>
                    </div>
                    <div class="flex items-baseline gap-2">
                        <div class="text-3xl font-bold text-slate-800">${stats.totalProducts}</div>
                        <div class="text-sm font-normal text-slate-400">Aktif</div>
                    </div>
                    <div class="text-xs text-slate-500 font-bold mt-2">
                        ${stats.outOfStockProducts > 0 ? `<span class="text-error">${stats.outOfStockProducts} stok habis</span>` : 'Semua stok tersedia'}
                    </div>
                </div>
            </div>
            
            <div class="mt-8 px-4 lg:px-0">
                <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100">
                    <h3 class="font-bold text-lg text-slate-800 mb-4">Grafik Penjualan</h3>
                    <canvas id="salesChart" height="100"></canvas>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        renderChart(stats.monthlyRevenue);
    }, 100);
};

let chartInstance = null;
const renderChart = (monthlyRevenue) => {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyRevenue.map(m => m.label),
            datasets: [{
                label: 'Pendapatan (Rp)',
                data: monthlyRevenue.map(m => m.value),
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + (value/1000) + 'k';
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
};

window.TitikLokal.initSellerDashboard = initSellerDashboard;
