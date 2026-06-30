/**
 * TitikLokal - Layout Components
 * Merender struktur shell aplikasi (Navigasi Bawah, Sidebar).
 */

export const layout = {
    renderBottomNav: (activeTab = 'home', role = 'buyer') => {
        const nav = document.getElementById('bottom-nav');
        if (!nav) return;

        if (role === 'buyer') {
            nav.innerHTML = `
                <div class="flex justify-around items-center h-16 max-w-md mx-auto relative">
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'home' ? 'text-primary-600' : 'text-slate-400'} hover:text-primary-600 transition-colors" onclick="window.TitikLokal.router.navigate('view-buyer-home')">
                        <svg class="w-6 h-6 mb-0.5" fill="${activeTab === 'home' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span class="text-[10px] font-medium">Beranda</span>
                    </button>
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'explore' ? 'text-primary-600' : 'text-slate-400'} hover:text-primary-600 transition-colors" onclick="window.TitikLokal.router.navigate('view-explore-map')">
                        <svg class="w-6 h-6 mb-0.5" fill="${activeTab === 'explore' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                        <span class="text-[10px] font-medium">Jelajah</span>
                    </button>
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'orders' ? 'text-primary-600' : 'text-slate-400'} hover:text-primary-600 transition-colors" onclick="window.TitikLokal.router.navigate('view-orders')">
                        <svg class="w-6 h-6 mb-0.5" fill="${activeTab === 'orders' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        <span class="text-[10px] font-medium">Pesanan</span>
                    </button>
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'wishlist' ? 'text-primary-600' : 'text-slate-400'} hover:text-primary-600 transition-colors" onclick="window.TitikLokal.router.navigate('view-wishlist')">
                        <svg class="w-6 h-6 mb-0.5" fill="${activeTab === 'wishlist' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span class="text-[10px] font-medium">Wishlist</span>
                    </button>
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'profile' ? 'text-primary-600' : 'text-slate-400'} hover:text-primary-600 transition-colors" onclick="window.TitikLokal.router.navigate('view-profile')">
                        <svg class="w-6 h-6 mb-0.5" fill="${activeTab === 'profile' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span class="text-[10px] font-medium">Akun</span>
                    </button>
                </div>
            `;
        } else if (role === 'seller') {
            nav.innerHTML = `
                <div class="flex justify-around items-center h-16 max-w-md mx-auto">
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'dashboard' ? 'text-primary-600' : 'text-slate-400'}" onclick="window.TitikLokal.router.navigate('view-seller-dashboard')">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span class="text-[10px] font-medium">Dashboard</span>
                    </button>
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'products' ? 'text-primary-600' : 'text-slate-400'}" onclick="window.TitikLokal.router.navigate('view-seller-products')">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        <span class="text-[10px] font-medium">Produk</span>
                    </button>
                    <button class="flex flex-col items-center justify-center w-full h-full ${activeTab === 'orders' ? 'text-primary-600' : 'text-slate-400'}" onclick="window.TitikLokal.router.navigate('view-seller-orders')">
                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        <span class="text-[10px] font-medium">Pesanan</span>
                    </button>
                </div>
            `;
        }
        nav.classList.remove('hidden');
    },

    renderSidebar: (role = 'buyer', activeTab = 'home') => {
        const sidebar = document.getElementById('sidebar-desktop');
        if (!sidebar) return;

        if (role === 'buyer') {
            sidebar.innerHTML = `
                <div class="flex items-center gap-3 mb-10 px-2 cursor-pointer" onclick="window.TitikLokal.router.navigate('view-splash')">
                    <div class="bg-primary-600 p-2 rounded-xl text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <span class="text-xl font-bold text-slate-800 tracking-tight">TitikLokal</span>
                </div>
                
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Menu Utama</span>
                <nav class="flex-1 space-y-1">
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 ${activeTab === 'home' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'} rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.router.navigate('view-buyer-home')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Beranda
                    </a>
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 ${activeTab === 'explore' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'} rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.router.navigate('view-explore-map')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                        Jelajah Sekitar
                    </a>
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 ${activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'} rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.router.navigate('view-orders')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        Pesanan Saya
                    </a>
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 ${activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'} rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.router.navigate('view-profile')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        Akun Saya
                    </a>
                </nav>
                
                <div class="mt-auto border-t border-slate-100 pt-4">
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 text-error hover:bg-red-50 rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.store.dispatch('LOGOUT'); window.TitikLokal.router.navigate('view-splash')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Keluar Akun
                    </a>
                </div>
            `;
        } else if (role === 'seller') {
            sidebar.innerHTML = `
                <div class="flex items-center gap-3 mb-10 px-2 cursor-pointer" onclick="window.TitikLokal.router.navigate('view-splash')">
                    <div class="bg-slate-800 p-2 rounded-xl text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <div>
                        <span class="text-lg font-bold text-slate-800 tracking-tight block">Seller Center</span>
                        <span class="text-xs text-slate-500">TitikLokal</span>
                    </div>
                </div>
                
                <nav class="flex-1 space-y-1">
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 ${activeTab === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'} rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.router.navigate('view-seller-dashboard')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        Dashboard
                    </a>
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 ${activeTab === 'products' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'} rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.router.navigate('view-seller-products')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        Manajemen Produk
                    </a>
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 ${activeTab === 'orders' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'} rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.router.navigate('view-seller-orders')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        Pesanan Masuk
                    </a>
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition-colors mt-8 border border-slate-200" onclick="window.TitikLokal.ui.showToast('Preview Mode Aktif', 'info')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        Preview Toko
                    </a>
                </nav>
                
                <div class="mt-auto border-t border-slate-100 pt-4">
                    <a href="#" class="flex items-center gap-3 px-3 py-2.5 text-error hover:bg-red-50 rounded-xl font-semibold transition-colors" onclick="window.TitikLokal.store.dispatch('LOGOUT'); window.TitikLokal.router.navigate('view-splash')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Keluar Akun
                    </a>
                </div>
            `;
        }
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.layout = layout;
