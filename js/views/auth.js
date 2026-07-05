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
        <div class="flex w-full min-h-screen relative">
            <!-- Left Panel Desktop (Branding) -->
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
                        ${isSeller ? 'Kelola Toko<br>Seperti Profesional' : 'Temukan UMKM<br>di Sekitar Anda'}
                    </h2>
                    <p class="text-white/70 mt-4 text-lg leading-relaxed">
                        ${isSeller ? 'Satu dashboard terpadu untuk mengatur pesanan, melacak penjualan, dan memperluas jangkauan ke komunitas terdekat Anda.' : 'Ribuan produk asli buatan pengusaha Siantar siap diantar ke tempat Anda. Dukung ekonomi lokal.'}
                    </p>
                </div>
                <!-- Small feature cards on desktop -->
                <div class="relative z-10 grid grid-cols-3 gap-4 mt-8">
                    ${['Cepat & Dekat', 'Pembayaran Aman', '100% Karya Lokal'].map(s => `
                    <div class="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/5">
                        <div class="text-white font-medium text-xs tracking-wide">${s}</div>
                    </div>`).join('')}
                </div>
            </div>

            <!-- Right Panel (Form) -->
            <div class="w-full lg:w-1/2 relative flex flex-col items-center pt-12 pb-8 px-6 sm:px-10 lg:px-16 lg:pt-20 bg-white overflow-y-auto min-h-[100dvh] lg:min-h-screen">
                
                <!-- Abstract Local Pattern Background (Opacity 3-5%) -->
                <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0 text-slate-900">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="batik-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                                <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
                                <circle cx="0" cy="0" r="25" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
                                <circle cx="80" cy="0" r="25" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
                                <circle cx="0" cy="80" r="25" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
                                <circle cx="80" cy="80" r="25" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
                                <!-- Center ornament -->
                                <path d="M30,40 Q40,30 50,40 Q40,50 30,40" fill="currentColor"></path>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#batik-pattern)"></rect>
                    </svg>
                </div>

                <div class="w-full max-w-[380px] relative z-10">
                    <!-- Back Button -->
                    <button onclick="window.TitikLokal.router.navigate('view-splash')" class="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 group transition-colors -ml-2 p-2 rounded-xl">
                        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span class="text-sm font-medium">Kembali</span>
                    </button>

                    <!-- Mini Logo Center -->
                    <div class="w-12 h-12 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center mb-6 mx-auto ${isSeller ? 'bg-slate-900' : 'bg-primary-600'}">
                        <img src="https://ui-avatars.com/api/?name=TL&background=${isSeller ? '0f172a' : '2563eb'}&color=fff&bold=true&size=64&font-size=0.5" alt="Logo" class="w-full h-full object-cover">
                    </div>

                    <!-- Titles & Micro-copy -->
                    <div class="text-center mb-8">
                        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">${isSeller ? 'Masuk Seller Center' : 'Masuk ke Akun'}</h1>
                        <p class="text-slate-500 text-[13px] mt-2 px-4 leading-relaxed">
                            ${isSeller 
                                ? 'Kelola tokomu dan jangkau pembeli terdekat di sekitarmu.' 
                                : 'Temukan berbagai produk kreatif dan autentik di sekitarmu.'}
                        </p>
                    </div>

                    <!-- Modern Tab Design -->
                    <div class="flex relative border-b border-slate-100 mb-8" id="auth-tabs">
                        <button id="tab-login" onclick="window.TitikLokal.auth.switchTab('login')" class="flex-1 pb-3 text-sm font-bold text-slate-900 border-b-2 border-slate-900 transition-all z-10">Masuk</button>
                        <button id="tab-register" onclick="window.TitikLokal.auth.switchTab('register')" class="flex-1 pb-3 text-sm font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition-all z-10">Daftar Baru</button>
                    </div>

                    <!-- FORM MASUK -->
                    <div id="form-login" class="space-y-5">
                        <div class="relative shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-2xl">
                            <span class="absolute inset-y-0 left-4 flex items-center font-bold text-slate-400 text-sm border-r border-slate-100 pr-3">+62</span>
                            <input type="tel" id="login-phone" class="w-full pl-16 pr-4 py-4 text-sm font-medium bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all" placeholder="Nomor Handphone">
                        </div>
                        
                        <button onclick="window.TitikLokal.auth.requestOTP('login')" class="w-full font-bold py-4 rounded-2xl text-sm transition-all transform active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.08)] ${isSeller ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}">
                            Kirim Kode OTP
                        </button>

                        <div class="flex items-center my-6">
                            <div class="flex-1 border-t border-slate-100"></div>
                            <span class="px-4 text-[11px] text-slate-400 font-medium uppercase tracking-widest">Atau</span>
                            <div class="flex-1 border-t border-slate-100"></div>
                        </div>

                        <div class="space-y-3">
                            ${!isSeller ? `
                            <!-- Lihat Tanpa Login (Guest Mode) - hanya untuk Pembeli -->
                            <button onclick="window.TitikLokal.auth.loginAsGuest()" class="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors font-medium text-slate-500 text-[13px]">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                Lihat Tanpa Login
                            </button>` : ''}

                            <!-- Lanjutkan dengan Google (Soft Border) -->
                            <button onclick="window.TitikLokal.auth.showGooglePicker()" class="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition-colors font-medium text-slate-600 text-[13px]">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                Lanjutkan dengan Google
                            </button>
                        </div>
                    </div>

                    <!-- FORM DAFTAR -->
                    <div id="form-register" class="space-y-4 hidden">
                        <div class="relative shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-2xl">
                            <input type="text" id="reg-name" class="w-full px-5 py-4 text-sm font-medium bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all" placeholder="Nama Lengkap">
                        </div>
                        
                        ${isSeller ? `
                        <div class="relative shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-2xl">
                            <input type="text" id="reg-shop" class="w-full px-5 py-4 text-sm font-medium bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all" placeholder="Nama Toko">
                        </div>` : ''}
                        
                        <div class="relative shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-2xl">
                            <span class="absolute inset-y-0 left-4 flex items-center font-bold text-slate-400 text-sm border-r border-slate-100 pr-3">+62</span>
                            <input type="tel" id="reg-phone" class="w-full pl-16 pr-4 py-4 text-sm font-medium bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all" placeholder="Nomor Handphone">
                        </div>
                        
                        <button onclick="window.TitikLokal.auth.requestOTP('register')" class="w-full font-bold py-4 rounded-2xl text-sm transition-all transform active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.08)] mt-2 ${isSeller ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}">
                            Buat Akun & Kirim OTP
                        </button>
                        
                        <div class="flex items-center my-6">
                            <div class="flex-1 border-t border-slate-100"></div>
                            <span class="px-4 text-[11px] text-slate-400 font-medium uppercase tracking-widest">Atau</span>
                            <div class="flex-1 border-t border-slate-100"></div>
                        </div>
                        
                        <button onclick="window.TitikLokal.auth.showGooglePicker()" class="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition-colors font-medium text-slate-600 text-[13px]">
                            <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                            Daftar dengan Google
                        </button>
                    </div>

                    <!-- OTP Form -->
                    <div id="form-otp" class="hidden space-y-6 text-center mt-4">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-900 mb-2">Verifikasi OTP</h2>
                            <p class="text-sm text-slate-500">Kode OTP dikirimkan via WhatsApp ke<br><span id="otp-target" class="font-bold text-slate-800"></span></p>
                            <div class="mt-4 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] text-slate-500 font-medium tracking-wide">Kode OTP Demo: <strong class="text-slate-800 text-xs">1234</strong></div>
                        </div>
                        <div class="flex justify-center gap-3 pt-2" id="otp-inputs">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]">
                            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:border-primary-500 outline-none transition-all focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]">
                        </div>
                        <button onclick="window.TitikLokal.auth.verifyOTP()" class="w-full font-bold py-4 rounded-2xl text-sm transition-all transform active:scale-[0.98] shadow-[0_8px_20px_rgba(0,0,0,0.08)] mt-2 ${isSeller ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}">
                            Verifikasi
                        </button>
                        <button onclick="window.TitikLokal.auth.cancelOTP()" class="w-full py-3 text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors">
                            Kembali & Edit Nomor
                        </button>
                    </div>

                    <p class="text-center text-[10px] text-slate-400 mt-10">Dengan masuk, Anda menyetujui <span class="text-slate-600 font-semibold cursor-pointer underline underline-offset-2">Syarat Ketentuan</span> dan <span class="text-slate-600 font-semibold cursor-pointer underline underline-offset-2">Kebijakan Privasi</span> TitikLokal.</p>
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

        const activeClass = "flex-1 pb-3 text-sm font-bold text-slate-900 border-b-2 border-slate-900 transition-all z-10";
        const inactiveClass = "flex-1 pb-3 text-sm font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition-all z-10";

        if (tab === 'login') {
            loginForm.classList.remove('hidden'); regForm.classList.add('hidden');
            tabLogin.className = activeClass;
            tabReg.className = inactiveClass;
        } else {
            regForm.classList.remove('hidden'); loginForm.classList.add('hidden');
            tabReg.className = activeClass;
            tabLogin.className = inactiveClass;
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
    },

    // Guest Mode: masuk tanpa login, hanya bisa melihat produk
    loginAsGuest: () => {
        const guestUser = {
            id: 'guest',
            name: 'Tamu',
            email: '',
            phone: '',
            role: 'guest',
            avatar: 'https://ui-avatars.com/api/?name=G&background=94a3b8&color=fff&bold=true',
            isGuest: true
        };
        store.dispatch('SET_USER', guestUser);
        window.TitikLokal.ui.showToast('Anda masuk sebagai tamu. Beberapa fitur terbatas.', 'info');
        window.TitikLokal.router.navigate('view-buyer-home');
        window.TitikLokal.layout.renderBottomNav('home', 'buyer');
        window.TitikLokal.layout.renderSidebar('buyer', 'home');
        if (window.TitikLokal.initBuyerHome) window.TitikLokal.initBuyerHome();
    }
};

window.TitikLokal.initAuth = initAuth;
