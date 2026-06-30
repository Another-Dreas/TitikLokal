import { api } from '../core/storage.js';
import { showToast, switchView } from '../components/ui.js';

window.TitikLokal = window.TitikLokal || {};


export const initAdminDashboard = async () => {
    const container = document.getElementById('view-admin-dashboard');
    if (!container) return;

    try {
        const db = JSON.parse(localStorage.getItem('titiklokal_db') || '{}');
        const allShops = db.shops || [];
        const allUsers = db.users || [];
        const allOrders = db.orders || [];

        const activeShops = allShops.filter(s => s.isOpen).length;
        const totalProducts = allShops.reduce((sum, s) => sum + (s.produk ? s.produk.length : 0), 0);
        const totalRevenue = allOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0);
        const buyerCount = allUsers.filter(u => u.role === 'buyer').length;
        const sellerCount = allUsers.filter(u => u.role === 'seller').length;

        const formatRp = (n) => 'Rp ' + (n || 0).toLocaleString('id-ID');

        container.innerHTML = `
        <div class="max-w-5xl mx-auto p-4 lg:p-0">
            <header class="bg-slate-900 text-white rounded-3xl p-6 mb-8 shadow-xl shadow-slate-900/20 relative overflow-hidden">
                <div class="absolute -right-10 -top-10 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div class="flex justify-between items-center relative z-10">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-xl shadow-inner border border-white/10">A</div>
                        <div>
                            <h2 class="font-bold text-2xl leading-tight tracking-tight">Admin Console</h2>
                            <span class="text-sm text-slate-400 font-medium">TitikLokal System Overview</span>
                        </div>
                    </div>
                    <button class="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors" onclick="window.TitikLokal.doLogout()">Logout</button>
                </div>
            </header>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-surface rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div class="text-2xl font-bold text-primary-600">${allShops.length}</div>
                    <div class="text-sm text-slate-500 mt-1">Total Toko</div>
                    <div class="text-xs text-slate-400">${activeShops} aktif</div>
                </div>
                <div class="bg-surface rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div class="text-2xl font-bold text-emerald-600">${totalProducts}</div>
                    <div class="text-sm text-slate-500 mt-1">Total Produk</div>
                </div>
                <div class="bg-surface rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div class="text-2xl font-bold text-violet-600">${allUsers.length}</div>
                    <div class="text-sm text-slate-500 mt-1">Total Pengguna</div>
                    <div class="text-xs text-slate-400">${buyerCount} pembeli, ${sellerCount} penjual</div>
                </div>
                <div class="bg-surface rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <div class="text-2xl font-bold text-amber-600">${allOrders.length}</div>
                    <div class="text-sm text-slate-500 mt-1">Total Pesanan</div>
                    <div class="text-xs text-slate-400">${formatRp(totalRevenue)} revenue</div>
                </div>
            </div>

            <div class="bg-surface rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                <div class="p-5 border-b border-slate-100">
                    <h3 class="font-bold text-slate-800">Daftar Toko</h3>
                </div>
                <div class="divide-y divide-slate-100">
                    ${allShops.length === 0 ? '<div class="p-8 text-center text-slate-400">Belum ada toko terdaftar</div>' :
                    allShops.map(shop => `
                        <div class="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                            <img src="${shop.logo || 'https://ui-avatars.com/api/?name=Toko&background=2563eb&color=fff'}" class="w-10 h-10 rounded-xl object-cover">
                            <div class="flex-1 min-w-0">
                                <div class="font-semibold text-slate-800 text-sm truncate">${shop.namaToko}</div>
                                <div class="text-xs text-slate-500">${shop.kategori} &bull; ${shop.lokasi}</div>
                            </div>
                            <span class="text-xs font-bold px-2 py-1 rounded-full ${shop.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}">${shop.isOpen ? 'Buka' : 'Tutup'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="bg-surface rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-5 border-b border-slate-100">
                    <h3 class="font-bold text-slate-800">Daftar Pengguna</h3>
                </div>
                <div class="divide-y divide-slate-100">
                    ${allUsers.filter(u => u.role !== 'admin').map(u => `
                        <div class="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                            <img src="${u.avatar}" class="w-10 h-10 rounded-full object-cover">
                            <div class="flex-1 min-w-0">
                                <div class="font-semibold text-slate-800 text-sm">${u.name}</div>
                                <div class="text-xs text-slate-500">${u.email}</div>
                            </div>
                            <span class="text-xs font-bold px-2 py-1 rounded-full ${u.role === 'seller' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}">${u.role}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    } catch (e) {
        console.error('Admin dashboard error:', e);
        if (container) container.innerHTML = `<div class="p-8 text-center text-red-500">Error: ${e.message}</div>`;
    }
};
