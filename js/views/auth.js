/**
 * TitikLokal - Auth View Controller
 * Login Google Dummy + Phone OTP Simulator
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { storage } from '../core/storage.js';

window.TitikLokal = window.TitikLokal || {};

// Akun Google dummy yang bisa dipilih user
const GOOGLE_ACCOUNTS = [
    { name: 'Rina Situmorang', email: 'rina.situmorang@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Rina+S&background=2563eb&color=fff&bold=true' },
    { name: 'Budi Panjaitan', email: 'budi.panjaitan@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Budi+P&background=7c3aed&color=fff&bold=true' },
    { name: 'Siti Rahma', email: 'siti.rahma@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Siti+R&background=ec4899&color=fff&bold=true' },
    { name: 'Doni Siregar', email: 'doni.siregar@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Doni+S&background=10b981&color=fff&bold=true' }
];

export const initAuth = (role = 'buyer') => {
    window.TitikLokal.auth = window.TitikLokal.auth || {};
    window.TitikLokal.auth.currentRole = role;

    // Ensure view-auth exists
    let authContainer = document.getElementById('view-auth');
    if (!authContainer) {
        authContainer = document.createElement('section');
        authContainer.id = 'view-auth';
        authContainer.className = 'view-section hidden min-h-screen';
        document.getElementById('main-scroll-area')?.appendChild(authContainer);
    }

    const isSeller = role === 'seller';
    const accentBg = isSeller ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-primary-700 via-primary-600 to-cyan-500';

    authContainer.innerHTML = `
        <div class="flex w-full min-h-screen">
            <!-- Left Panel Desktop -->
            <div class="hidden lg:flex w-1/2 relative flex-col justify-between p-12 xl:p-16 overflow-hidden bg-gradient-to-br ${accentBg}">
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-0 left-0 w-96 h-96 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"></div>
                    <div class="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white translate-x-1/3 translate-y-1/3"></div>
                </div>
                <div class="relative z-10">
                    <div class="flex items-center gap-3 mb-16">
                        <div class="bg-white/20 backdrop-blur p-2.5 rounded-xl">
                            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <span class="text-white font-bold text-xl tracking-tight">TitikLokal</span>
                    </div>
                    <h2 class="text-4xl xl:text-5xl font-bold text-white leading-[1.2] tracking-tight">
                        ${isSeller ? 'Kelola Toko<br>Seperti Profesional' : 'Temukan UMKM<br>di Pematang Siantar'}
                    </h2>
                    <p class="text-white/70 mt-4 text-lg leading-relaxed">
                        ${isSeller ? 'Satu dashboard untuk ribuan pesanan, produk, dan analitik bisnis.' : 'Ribuan produk lokal dari pengusaha Siantar siap diantar ke rumahmu.'}
                    </p>
                </div>
                <div class="relative z-10 grid grid-cols-3 gap-4 mt-8">
                    ${['4+ Toko UMKM', '10+ Produk', '100% Lokal'].map(s => `
                    <div class="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                        <div class="text-white font-bold text-sm">${s}</div>
                    </div>`).join('')}
                </div>
            </div>

            <!-- Right Panel (Form) -->
            <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 bg-white overflow-y-auto">
                <div class="w-full max-w-md">
                    <button onclick="window.TitikLokal.router.navigate('view-splash')" class="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 group transition-colors">
                        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span class="text-sm font-medium">Kembali</span>
                    </button>

                    <!-- Tab: Masuk / Daftar -->
                    <div class="flex bg-slate-100 rounded-2xl p-1 mb-8" id="auth-tabs">
                        <button id="tab-login" onclick="window.TitikLokal.auth.switchTab('login')" class="flex-1 py-2.5 text-sm font-bold rounded-xl bg-white shadow-sm text-slate-800 transition-all">Masuk</button>
                        <button id="tab-register" onclick="window.TitikLokal.auth.switchTab('register')" class="flex-1 py-2.5 text-sm font-bold rounded-xl text-slate-500 transition-all">Daftar</button>
                    </div>

                    <!-- FORM MASUK -->
                    <div id="form-login" class="space-y-4">
                        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">${isSeller ? 'Masuk Seller Center' : 'Masuk ke Akun'}</h1>
                        <p class="text-slate-500 text-sm mb-6">Belum punya akun? <button class="text-primary-600 font-bold" onclick="window.TitikLokal.auth.switchTab('register')">Daftar Sekarang</button></p>

                        <div class="relative">
                            <span class="absolute inset-y-0 left-4 flex items-center font-bold text-slate-400 text-sm border-r border-slate-200 pr-3">+62</span>
                            <input type="tel" id="login-phone" class="w-full pl-16 pr-4 py-3.5 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" placeholder="Nomor Handphone">
                        </div>
                        <button onclick="window.TitikLokal.auth.requestOTP('login')" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm ${isSeller ? '!bg-slate-900 hover:!bg-slate-700' : ''}">
                            Lanjutkan
                        </button>

                        <div class="flex items-center my-5">
                            <div class="flex-1 border-t border-slate-200"></div>
                            <span class="px-4 text-xs text-slate-400 font-medium uppercase tracking-wider">atau</span>
                            <div class="flex-1 border-t border-slate-200"></div>
                        </div>

                        <button onclick="window.TitikLokal.auth.showGooglePicker()" class="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm shadow-sm">
                            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            Lanjutkan dengan Google
                        </button>
                    </div>

                    <!-- FORM DAFTAR -->
                    <div id="form-register" class="space-y-4 hidden">
                        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Buat Akun Baru</h1>
                        <p class="text-slate-500 text-sm mb-6">Sudah punya akun? <button class="text-primary-600 font-bold" onclick="window.TitikLokal.auth.switchTab('login')">Masuk</button></p>

                        <input type="text" id="reg-name" class="w-full px-4 py-3.5 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" placeholder="Nama Lengkap">
                        ${isSeller ? `<input type="text" id="reg-shop" class="w-full px-4 py-3.5 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" placeholder="Nama Toko">` : ''}
                        <div class="relative">
                            <span class="absolute inset-y-0 left-4 flex items-center font-bold text-slate-400 text-sm border-r border-slate-200 pr-3">+62</span>
                            <input type="tel" id="reg-phone" class="w-full pl-16 pr-4 py-3.5 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" placeholder="Nomor Handphone">
                        </div>
                        <button onclick="window.TitikLokal.auth.requestOTP('register')" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm ${isSeller ? '!bg-slate-900 hover:!bg-slate-700' : ''}">
                            Daftar & Verifikasi OTP
                        </button>
                        <div class="flex items-center my-5">
                            <div class="flex-1 border-t border-slate-200"></div>
                            <span class="px-4 text-xs text-slate-400 font-medium uppercase tracking-wider">atau</span>
                            <div class="flex-1 border-t border-slate-200"></div>
                        </div>
                        <button onclick="window.TitikLokal.auth.showGooglePicker()" class="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors font-semibold text-slate-700 text-sm shadow-sm">
                            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            Daftar dengan Google
                        </button>
                    </div>

                    <!-- OTP Form -->
                    <div id="form-otp" class="hidden space-y-6 text-center">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-900 mb-2">Verifikasi OTP</h2>
                            <p class="text-sm text-slate-500">Kode OTP dikirimkan ke <span id="otp-target" class="font-bold text-slate-800"></span></p>
                            <div class="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-700 font-medium">Kode OTP demo: <strong>1234</strong></div>
                        </div>
                        <div class="flex justify-center gap-3" id="otp-inputs">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all">
                        </div>
                        <button onclick="window.TitikLokal.auth.verifyOTP()" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-2xl transition-colors ${isSeller ? '!bg-slate-900' : ''}">
                            Verifikasi
                        </button>
                        <button onclick="window.TitikLokal.auth.cancelOTP()" class="w-full py-3 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                            Kembali
                        </button>
                    </div>

                    <p class="text-center text-xs text-slate-400 mt-8">Dengan masuk, Anda menyetujui <span class="text-primary-600 font-semibold">Syarat Ketentuan</span> dan <span class="text-primary-600 font-semibold">Kebijakan Privasi</span> TitikLokal.</p>
                </div>
            </div>
        </div>
    `;

    // Setup OTP input auto-advance
    setTimeout(() => {
        document.querySelectorAll('.otp-box').forEach((input, i, all) => {
            input.addEventListener('input', e => {
                if (e.target.value.length === 1 && i < all.length - 1) all[i + 1].focus();
            });
            input.addEventListener('keydown', e => {
                if (e.key === 'Backspace' && e.target.value === '' && i > 0) all[i - 1].focus();
            });
        });
    }, 100);

    window.TitikLokal.router.navigate('view-auth');
};

window.TitikLokal.auth = {
    currentRole: 'buyer',
    currentAction: 'login',
    tempData: {},

    switchTab: (tab) => {
        const loginForm = document.getElementById('form-login');
        const regForm = document.getElementById('form-register');
        const tabLogin = document.getElementById('tab-login');
        const tabReg = document.getElementById('tab-register');
        if (!loginForm) return;
        if (tab === 'login') {
            loginForm.classList.remove('hidden'); regForm.classList.add('hidden');
            tabLogin.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
            tabReg.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
            tabReg.classList.add('text-slate-500');
        } else {
            regForm.classList.remove('hidden'); loginForm.classList.add('hidden');
            tabReg.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
            tabLogin.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
            tabLogin.classList.add('text-slate-500');
        }
    },

    requestOTP: (action) => {
        window.TitikLokal.auth.currentAction = action;
        const phoneEl = document.getElementById(action === 'login' ? 'login-phone' : 'reg-phone');
        const phone = phoneEl?.value.trim();
        if (!phone || phone.length < 8) {
            window.TitikLokal.ui.showToast('Masukkan nomor HP yang valid', 'error'); return;
        }
        if (action === 'register') {
            const name = document.getElementById('reg-name')?.value.trim();
            if (!name) { window.TitikLokal.ui.showToast('Masukkan nama lengkap', 'error'); return; }
            window.TitikLokal.auth.tempData.name = name;
            window.TitikLokal.auth.tempData.shopName = document.getElementById('reg-shop')?.value.trim() || '';
        }
        window.TitikLokal.auth.tempData.phone = phone;
        document.getElementById('otp-target').innerText = '+62 ' + phone;
        document.getElementById('form-login').classList.add('hidden');
        document.getElementById('form-register').classList.add('hidden');
        document.getElementById('form-otp').classList.remove('hidden');
        setTimeout(() => document.querySelector('.otp-box')?.focus(), 100);
        window.TitikLokal.ui.showToast('Kode OTP: 1234 (demo)', 'info');
    },

    cancelOTP: () => {
        document.getElementById('form-otp').classList.add('hidden');
        document.getElementById('form-login').classList.remove('hidden');
    },

    verifyOTP: async () => {
        const code = Array.from(document.querySelectorAll('.otp-box')).map(i => i.value).join('');
        if (code !== '1234') { window.TitikLokal.ui.showToast('Kode OTP salah', 'error'); return; }
        const { phone, name, shopName } = window.TitikLokal.auth.tempData;
        const role = window.TitikLokal.auth.currentRole;
        const finalName = name || ('User ' + phone.substring(0, 4));
        await window.TitikLokal.auth.completeLogin(phone, finalName, role, shopName);
    },

    showGooglePicker: () => {
        const role = window.TitikLokal.auth.currentRole;
        const html = `
            <p class="text-sm text-slate-500 mb-4">Pilih akun Google untuk ${role === 'seller' ? 'Seller Center' : 'TitikLokal'}:</p>
            <div class="space-y-3">
                ${GOOGLE_ACCOUNTS.map(acc => `
                    <div class="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 hover:border-primary-300 transition-all" 
                         onclick="window.TitikLokal.ui.hideModal(); window.TitikLokal.auth.loginWithGoogle('${acc.email}', '${acc.name}', '${acc.avatar}')">
                        <img src="${acc.avatar}" class="w-12 h-12 rounded-full">
                        <div>
                            <div class="font-bold text-slate-800">${acc.name}</div>
                            <div class="text-xs text-slate-500">${acc.email}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        window.TitikLokal.ui.showModal('Pilih Akun Google', html);
    },

    loginWithGoogle: async (email, name, avatar) => {
        const role = window.TitikLokal.auth.currentRole;
        const shopName = document.getElementById('reg-shop')?.value || (name + ' Shop');
        await window.TitikLokal.auth.completeLogin(email, name, role, shopName, avatar);
    },

    completeLogin: async (identifier, name, role, shopName = '', avatarUrl = null) => {
        store.dispatch('isLoading', true);
        try {
            // Check existing user
            let user = storage.findOne('users', u => u.email === identifier || u.phone === identifier);
            if (!user) {
                // Auto-register
                user = {
                    id: `u_${Date.now()}`,
                    name,
                    email: identifier.includes('@') ? identifier : `${identifier}@titiklokal.id`,
                    phone: identifier.includes('@') ? '' : identifier,
                    role,
                    avatar: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&bold=true`,
                    isActive: true,
                    memberLevel: 'Bronze',
                    joinDate: new Date().toISOString()
                };
                storage.insert('users', user);
            }

            storage.setSession(user.id);
            store.dispatch('SET_USER', { ...user, role: user.role || role });
            window.TitikLokal.ui.showToast(`Selamat datang, ${user.name.split(' ')[0]}!`, 'success');

            const finalRole = user.role || role;
            if (finalRole === 'seller') {
                // Ensure shop exists
                let shop = storage.findOne('shops', s => s.ownerId === user.id);
                if (!shop && shopName) {
                    storage.insert('shops', {
                        id: `shop_${Date.now()}`, ownerId: user.id,
                        name: shopName, slug: shopName.toLowerCase().replace(/\s+/g, '-'),
                        categoryId: 'cat_kuliner', description: 'Toko UMKM Lokal Siantar',
                        rating: 5.0, totalReviews: 0, totalSales: 0, balance: 0,
                        coords: [2.9595, 99.0690],
                        address: 'Pematang Siantar, Sumatera Utara',
                        coverImg: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
                        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(shopName)}&background=0f172a&color=fff&bold=true`,
                        verificationStatus: 'pending', isOpen: true,
                        openHours: '08:00 - 20:00', whatsapp: user.phone || ''
                    });
                }
                window.TitikLokal.router.navigate('view-seller-dashboard');
                window.TitikLokal.layout.renderBottomNav('dashboard', 'seller');
                window.TitikLokal.layout.renderSidebar('seller', 'dashboard');
                if (window.TitikLokal.initSellerDashboard) window.TitikLokal.initSellerDashboard();
            } else {
                window.TitikLokal.router.navigate('view-buyer-home');
                window.TitikLokal.layout.renderBottomNav('home', 'buyer');
                window.TitikLokal.layout.renderSidebar('buyer', 'home');
                if (window.TitikLokal.initBuyerHome) window.TitikLokal.initBuyerHome();
            }
        } catch (err) {
            console.error(err);
            window.TitikLokal.ui.showToast('Terjadi kesalahan. Coba lagi.', 'error');
        } finally {
            store.dispatch('isLoading', false);
        }
    }
};

window.TitikLokal.initAuth = initAuth;
