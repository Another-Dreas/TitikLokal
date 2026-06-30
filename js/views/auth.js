import { api } from '../core/storage.js';
import { switchView, showToast, showModal, hideModal } from '../components/ui.js';
import { initialData } from '../config/data.js';

window.TitikLokal = window.TitikLokal || {};

let currentRole = 'buyer'; // 'buyer' or 'seller'

// Shared input template for high-fidelity floating labels
export const renderInput = (id, label, type = 'text', icon = '', props = '') => `
    <div class="relative w-full group">
        ${icon ? `<div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">${icon}</div>` : ''}
        <input type="${type}" id="${id}" name="${id}" class="block w-full px-4 ${icon ? 'pl-11' : ''} pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" placeholder=" " ${props} />
        <label for="${id}" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] ${icon ? 'left-11' : 'left-4'} peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 bg-surface px-1 peer-focus:text-primary-600 pointer-events-none">${label}</label>
        <div id="${id}-error" class="hidden text-xs text-red-500 mt-1 ml-1 font-medium"></div>
    </div>
`;

export const renderPasswordInput = (id, label, props = '') => `
    <div class="relative w-full group">
        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <input type="password" id="${id}" name="${id}" class="block w-full px-4 pl-11 pr-12 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" placeholder=" " ${props} oninput="window.TitikLokal.checkPasswordStrength(this.value, '${id}')" />
        <label for="${id}" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 bg-surface px-1 peer-focus:text-primary-600 pointer-events-none">${label}</label>
        <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none" onclick="window.TitikLokal.togglePassword('${id}')">
            <svg id="${id}-icon-show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            <svg id="${id}-icon-hide" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
        </button>
        <div id="${id}-strength" class="w-full flex gap-1 mt-2 hidden">
            <div class="h-1 flex-1 rounded-full bg-slate-200 transition-colors" id="${id}-strength-1"></div>
            <div class="h-1 flex-1 rounded-full bg-slate-200 transition-colors" id="${id}-strength-2"></div>
            <div class="h-1 flex-1 rounded-full bg-slate-200 transition-colors" id="${id}-strength-3"></div>
            <div class="h-1 flex-1 rounded-full bg-slate-200 transition-colors" id="${id}-strength-4"></div>
        </div>
        <div id="${id}-error" class="hidden text-xs text-red-500 mt-1 ml-1 font-medium"></div>
    </div>
`;

window.TitikLokal.togglePassword = (id) => {
    const input = document.getElementById(id);
    const showIcon = document.getElementById(`${id}-icon-show`);
    const hideIcon = document.getElementById(`${id}-icon-hide`);
    if(input.type === 'password') {
        input.type = 'text';
        showIcon.classList.add('hidden');
        hideIcon.classList.remove('hidden');
    } else {
        input.type = 'password';
        showIcon.classList.remove('hidden');
        hideIcon.classList.add('hidden');
    }
};

window.TitikLokal.checkPasswordStrength = (val, id) => {
    const container = document.getElementById(`${id}-strength`);
    if(!container) return;
    if(!val) { container.classList.add('hidden'); return; }
    container.classList.remove('hidden');
    
    let strength = 0;
    if(val.length >= 8) strength++;
    if(/[A-Z]/.test(val)) strength++;
    if(/[0-9]/.test(val)) strength++;
    if(/[^A-Za-z0-9]/.test(val)) strength++;
    
    for(let i=1; i<=4; i++) {
        const bar = document.getElementById(`${id}-strength-${i}`);
        bar.className = 'h-1 flex-1 rounded-full transition-colors';
        if(i <= strength) {
            if(strength <= 1) bar.classList.add('bg-red-500');
            else if(strength === 2) bar.classList.add('bg-orange-500');
            else if(strength === 3) bar.classList.add('bg-yellow-500');
            else bar.classList.add('bg-emerald-500');
        } else {
            bar.classList.add('bg-slate-200');
        }
    }
};

window.TitikLokal.showError = (id, msg) => {
    const input = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if(input) {
        input.classList.remove('border-slate-200', 'focus:border-primary-600');
        input.classList.add('border-red-500', 'focus:border-red-500');
    }
    if(err) {
        err.innerText = msg;
        err.classList.remove('hidden');
    }
};

window.TitikLokal.clearError = (id) => {
    const input = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if(input) {
        input.classList.remove('border-red-500', 'focus:border-red-500');
        input.classList.add('border-slate-200', 'focus:border-primary-600');
    }
    if(err) err.classList.add('hidden');
};

export const initAuth = (role, btn) => {
    const proceed = () => {
        currentRole = role;
        document.getElementById('view-onboarding')?.classList.add('hidden');
        switchView('view-auth');
        renderAuthLayout();
    };

    if (btn) {
        window.TitikLokal.simulateLoading(btn, btn.innerHTML, proceed);
    } else {
        proceed();
    }
};

const renderAuthLayout = () => {
    const container = document.getElementById('view-auth');
    // DO NOT add 'hidden' here — switchView already removed it
    container.className = "view-section absolute inset-0 z-50 bg-surface lg:bg-slate-50 flex overflow-hidden";
    
    const isSeller = currentRole === 'seller';
    
    container.innerHTML = `
        <div class="hidden lg:flex w-1/2 relative bg-gradient-to-br ${isSeller ? 'from-amber-600 to-orange-800' : 'from-primary-600 to-indigo-800'} items-center justify-center p-12 overflow-hidden">
            <div class="absolute inset-0 bg-black/10"></div>
            <!-- Decorative Elements -->
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute w-full h-full">
                    <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                        </pattern>
                    </defs>
                </svg>
            </div>
            
            <div class="relative z-10 w-full max-w-lg text-center text-white animate-slide-up">
                <div class="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center mb-8 border border-white/20 shadow-xl">
                    ${isSeller ? `
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    ` : `
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    `}
                </div>
                <h1 class="text-4xl font-bold mb-4">${isSeller ? 'Bangun Usaha Anda' : 'Temukan Keunikan Lokal'}</h1>
                <p class="text-lg text-white/80 leading-relaxed">
                    ${isSeller ? 'Kelola toko, pantau pesanan, dan jangkau lebih banyak pelanggan dengan ekosistem digital TitikLokal.' : 'Dukung pertumbuhan ekonomi lokal dengan berbelanja produk asli dari UMKM terpercaya di sekitar Anda.'}
                </p>
                <div class="mt-12 flex justify-center gap-4">
                    <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                        <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span class="text-sm font-medium text-white/90">Sistem Aktif & Terhubung</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="w-full lg:w-1/2 flex flex-col h-full bg-surface relative overflow-y-auto" id="auth-scroll-area">
            <div class="flex-1 w-full max-w-md mx-auto p-6 md:p-12 flex flex-col justify-center min-h-full" id="auth-form-container">
                <!-- Forms Injected Here -->
            </div>
        </div>
        
        <!-- Mobile Back Button -->
        <button class="lg:hidden absolute top-4 left-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 z-50 hover:bg-slate-200 transition-colors" onclick="window.TitikLokal.switchView('view-splash')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
    `;
    
    window.TitikLokal.showLoginForm();
};


window.TitikLokal.showLoginForm = () => {
    const container = document.getElementById('auth-form-container');
    if(!container) return;
    
    container.innerHTML = `
        <div class="mb-8 animate-slide-up">
            <button class="hidden lg:inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6" onclick="window.TitikLokal.switchView('view-splash')">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Kembali ke Beranda
            </button>
            <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
            <p class="text-slate-500 mt-2">Silakan masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <div class="flex p-1 bg-slate-100/80 backdrop-blur rounded-2xl mb-8 animate-slide-up" style="animation-delay: 50ms;">
            <button id="tab-login-email" class="flex-1 py-3 px-4 text-sm font-bold rounded-xl bg-white shadow-sm text-slate-800 transition-all" onclick="window.TitikLokal.switchLoginTab('email')">Email</button>
            <button id="tab-login-phone" class="flex-1 py-3 px-4 text-sm font-bold rounded-xl text-slate-500 hover:text-slate-700 transition-all" onclick="window.TitikLokal.switchLoginTab('phone')">Nomor HP</button>
        </div>

        <!-- EMAIL FORM -->
        <form id="form-login-email" class="space-y-5 animate-slide-up" style="animation-delay: 100ms;" onsubmit="event.preventDefault(); window.TitikLokal.processLoginEmail(this);">
            ${renderInput('login-email', 'Email Address', 'email', '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>', 'required')}
            
            ${renderPasswordInput('login-password', 'Password', 'required')}
            
            <div class="flex items-center justify-between mt-2">
                <label class="flex items-center cursor-pointer group">
                    <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer">
                    <span class="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Ingat Saya</span>
                </label>
                <button type="button" class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors" onclick="window.TitikLokal.showForgotModal()">Lupa Password?</button>
            </div>
            
            <button type="submit" class="btn-primary w-full !py-4 shadow-primary text-base font-bold mt-4" id="btn-submit-login-email">
                Masuk
            </button>
        </form>

        <!-- PHONE FORM -->
        <form id="form-login-phone" class="space-y-5 hidden animate-slide-up" style="animation-delay: 100ms;" onsubmit="event.preventDefault(); window.TitikLokal.requestOTP(this);">
            <div class="relative w-full group">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 font-bold text-slate-700">+62</div>
                <input type="tel" id="login-phone" name="login-phone" class="block w-full px-4 pl-14 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" placeholder=" " required oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                <label for="login-phone" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-14 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 bg-surface px-1 peer-focus:text-primary-600 pointer-events-none">Nomor HP</label>
            </div>
            <p class="text-xs text-slate-500">Kami akan mengirimkan kode OTP via SMS atau WhatsApp untuk verifikasi.</p>
            <button type="submit" class="btn-primary w-full !py-4 shadow-primary text-base font-bold" id="btn-submit-login-phone">
                Kirim OTP
            </button>
        </form>
        
        <!-- OTP VERIFICATION -->
        <form id="form-login-otp" class="space-y-5 hidden animate-slide-up" style="animation-delay: 100ms;" onsubmit="event.preventDefault(); window.TitikLokal.verifyOTP(this);">
            <p class="text-sm text-slate-600 text-center mb-6">Masukkan 4 digit kode OTP yang telah dikirim ke nomor <br><b id="display-otp-phone" class="text-slate-900"></b></p>
            
            <div class="flex justify-center gap-3 mb-6" id="otp-inputs">
                <input type="text" maxlength="1" class="w-14 h-16 text-center text-2xl font-bold rounded-2xl border-2 border-slate-200 focus:border-primary-600 focus:ring-0 transition-colors" onkeyup="window.TitikLokal.focusNext(this, 1)" onfocus="this.select()">
                <input type="text" maxlength="1" class="w-14 h-16 text-center text-2xl font-bold rounded-2xl border-2 border-slate-200 focus:border-primary-600 focus:ring-0 transition-colors" onkeyup="window.TitikLokal.focusNext(this, 2)" onfocus="this.select()">
                <input type="text" maxlength="1" class="w-14 h-16 text-center text-2xl font-bold rounded-2xl border-2 border-slate-200 focus:border-primary-600 focus:ring-0 transition-colors" onkeyup="window.TitikLokal.focusNext(this, 3)" onfocus="this.select()">
                <input type="text" maxlength="1" class="w-14 h-16 text-center text-2xl font-bold rounded-2xl border-2 border-slate-200 focus:border-primary-600 focus:ring-0 transition-colors" onkeyup="window.TitikLokal.focusNext(this, 4)" onfocus="this.select()">
            </div>
            
            <button type="submit" class="btn-primary w-full !py-4 shadow-primary text-base font-bold" id="btn-submit-otp">
                Verifikasi & Masuk
            </button>
            <div class="text-center mt-4">
                <button type="button" class="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors" onclick="window.TitikLokal.switchLoginTab('phone')">Kembali</button>
            </div>
        </form>

        <div class="relative flex items-center py-6 animate-slide-up" style="animation-delay: 150ms;">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="shrink-0 px-4 text-sm text-slate-400 font-medium bg-surface">Atau masuk dengan</span>
            <div class="flex-grow border-t border-slate-200"></div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8 animate-slide-up" style="animation-delay: 200ms;">
            <button class="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-bold text-slate-700 transition-all hover:bg-slate-50" onclick="window.TitikLokal.simulateSocialLogin('Google')">
                <svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
            </button>
            <button class="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-bold text-slate-700 transition-all hover:bg-slate-50" onclick="window.TitikLokal.simulateSocialLogin('Facebook')">
                <svg class="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
            </button>
        </div>

        <p class="text-center text-sm text-slate-600 animate-slide-up" style="animation-delay: 250ms;">
            Belum punya akun? 
            <button class="font-bold text-primary-600 hover:text-primary-700 transition-colors ml-1" onclick="window.TitikLokal.startRegister${currentRole === 'seller' ? 'Seller' : 'Buyer'}()">Daftar Sekarang</button>
        </p>
    `;
};

window.TitikLokal.switchLoginTab = (tab) => {
    const btnEmail = document.getElementById('tab-login-email');
    const btnPhone = document.getElementById('tab-login-phone');
    const formEmail = document.getElementById('form-login-email');
    const formPhone = document.getElementById('form-login-phone');
    const formOtp = document.getElementById('form-login-otp');
    
    if(!btnEmail) return;

    if(tab === 'email') {
        btnEmail.className = 'flex-1 py-3 px-4 text-sm font-bold rounded-xl bg-white shadow-sm text-slate-800 transition-all';
        btnPhone.className = 'flex-1 py-3 px-4 text-sm font-bold rounded-xl text-slate-500 hover:text-slate-700 transition-all';
        formEmail.classList.remove('hidden');
        formPhone.classList.add('hidden');
        formOtp.classList.add('hidden');
    } else {
        btnPhone.className = 'flex-1 py-3 px-4 text-sm font-bold rounded-xl bg-white shadow-sm text-slate-800 transition-all';
        btnEmail.className = 'flex-1 py-3 px-4 text-sm font-bold rounded-xl text-slate-500 hover:text-slate-700 transition-all';
        formPhone.classList.remove('hidden');
        formEmail.classList.add('hidden');
        formOtp.classList.add('hidden');
    }
};

window.TitikLokal.processLoginEmail = (form) => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-submit-login-email');
    
    window.TitikLokal.clearError('login-email');
    window.TitikLokal.clearError('login-password');
    
    if(!email.includes('@')) {
        window.TitikLokal.showError('login-email', 'Format email tidak valid');
        return;
    }
    if(!password) {
        window.TitikLokal.showError('login-password', 'Password wajib diisi');
        return;
    }

    window.TitikLokal.simulateLoading(btn, 'Masuk', async () => {
        try {
            const db = JSON.parse(localStorage.getItem('titiklokal_db'));
            const user = db.users.find(u => u.email === email && u.password === password && u.role === currentRole);
            if(user) {
                db.session = user.id;
                localStorage.setItem('titiklokal_db', JSON.stringify(db));
                window.location.reload();
            } else {
                window.TitikLokal.showError('login-email', 'Email atau password salah');
                showToast('Kredensial tidak cocok', 'error');
            }
        } catch(e) {
            showToast('Terjadi kesalahan', 'error');
        }
    });
};

window.TitikLokal.requestOTP = (form) => {
    const phone = document.getElementById('login-phone').value;
    if(phone.length < 8) {
        window.TitikLokal.showError('login-phone', 'Nomor HP tidak valid');
        return;
    }
    window.TitikLokal.clearError('login-phone');
    
    const btn = document.getElementById('btn-submit-login-phone');
    window.TitikLokal.simulateLoading(btn, 'Kirim OTP', () => {
        document.getElementById('form-login-phone').classList.add('hidden');
        document.getElementById('form-login-otp').classList.remove('hidden');
        document.getElementById('display-otp-phone').innerText = '+62 ' + phone;
        
        // Focus first OTP input
        setTimeout(() => {
            document.querySelector('#otp-inputs input').focus();
        }, 100);
        showToast('OTP Dummy (1234) telah dikirim!', 'info');
    });
};

window.TitikLokal.focusNext = (input, index) => {
    if(input.value.length === 1 && index < 4) {
        document.querySelectorAll('#otp-inputs input')[index].focus();
    } else if(input.value.length === 0 && index > 1) {
        document.querySelectorAll('#otp-inputs input')[index-2].focus();
    }
};

window.TitikLokal.verifyOTP = (form) => {
    const inputs = document.querySelectorAll('#otp-inputs input');
    const otp = Array.from(inputs).map(i => i.value).join('');
    
    if(otp.length !== 4) {
        showToast('Masukkan 4 digit OTP', 'error');
        return;
    }
    
    const btn = document.getElementById('btn-submit-otp');
    window.TitikLokal.simulateLoading(btn, 'Verifikasi & Masuk', async () => {
        if(otp === '1234') { // Dummy valid OTP
            try {
                const phone = document.getElementById('login-phone').value;
                const db = JSON.parse(localStorage.getItem('titiklokal_db'));
                const user = db.users.find(u => u.phone.includes(phone) && u.role === currentRole);
                if(user) {
                    db.session = user.id;
                    localStorage.setItem('titiklokal_db', JSON.stringify(db));
                    window.location.reload();
                } else {
                    showToast('Nomor HP tidak terdaftar sebagai ' + currentRole, 'error');
                    window.TitikLokal.switchLoginTab('phone'); // Back
                }
            } catch(e) {
                showToast('Terjadi kesalahan', 'error');
            }
        } else {
            showToast('OTP Salah (Gunakan 1234)', 'error');
            inputs.forEach(i => i.value = '');
            inputs[0].focus();
        }
    });
};

window.TitikLokal.showForgotModal = () => {
    showModal('forgot-modal', 'Lupa Password', `
        <div class="space-y-4">
            <p class="text-sm text-slate-500">Masukkan email Anda untuk menerima link reset password.</p>
            ${renderInput('forgot-email', 'Email Address', 'email')}
            <button class="btn-primary w-full !py-3 shadow-primary mt-2" onclick="showToast('Link reset password berhasil dikirim ke email (Simulasi)', 'success'); window.TitikLokal.hideModal('forgot-modal')">Kirim Link Reset</button>
        </div>
    `);
};

window.TitikLokal.simulateSocialLogin = (provider) => {
    const accounts = provider === 'Google' ? initialData.googleAccounts : initialData.facebookAccounts;
    
    let html = `<div class="space-y-3">
        <p class="text-sm text-slate-500 mb-4">Pilih akun ${provider} Anda untuk masuk ke TitikLokal</p>
    `;
    
    accounts.forEach(acc => {
        html += `
            <div class="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all" onclick="window.TitikLokal.processSocialLogin('${acc.id}', '${provider}')">
                <img src="${acc.avatar}" class="w-10 h-10 rounded-full border border-slate-200" alt="${acc.name}">
                <div class="flex-1 min-w-0">
                    <h5 class="text-sm font-bold text-slate-900 truncate">${acc.name}</h5>
                    <p class="text-xs text-slate-500 truncate">${acc.email}</p>
                </div>
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
        `;
    });
    
    html += `</div>`;
    
    showModal('social-modal', `Login dengan ${provider}`, html);
};

window.TitikLokal.processSocialLogin = async (accountId, provider) => {
    hideModal('social-modal');
    showToast(`Memproses login dengan ${provider}...`, 'info');
    
    setTimeout(() => {
        const db = JSON.parse(localStorage.getItem('titiklokal_db'));
        // Simulasi: Paksa login sebagai Budi Santoso atau user pertama di role
        const user = db.users.find(u => u.role === currentRole);
        if(user) {
            db.session = user.id;
            localStorage.setItem('titiklokal_db', JSON.stringify(db));
            window.location.reload();
        } else {
            showToast('User tidak ditemukan', 'error');
        }
    }, 1500);
};


window.TitikLokal.startRegisterBuyer = () => {
    const container = document.getElementById('auth-form-container');
    if(!container) return;
    
    buyerRegData = { avatar: '' };
    
    container.innerHTML = `
        <div class="mb-6 animate-slide-up">
            <button class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4" onclick="window.TitikLokal.showLoginForm()">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Kembali ke Login
            </button>
            <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Daftar Pembeli</h2>
            <p class="text-slate-500 mt-2">Lengkapi data diri Anda untuk mulai berbelanja di TitikLokal</p>
        </div>

        <form id="form-register-buyer" class="space-y-6 animate-slide-up" style="animation-delay: 50ms;" onsubmit="event.preventDefault(); window.TitikLokal.processRegisterBuyer(this);">
            
            <!-- Avatar Upload -->
            <div class="flex flex-col items-center mb-6">
                <div class="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group cursor-pointer" onclick="document.getElementById('buyer-avatar').click()">
                    <img id="buyer-avatar-preview" src="" class="w-full h-full object-cover hidden">
                    <div id="buyer-avatar-placeholder" class="text-slate-400 group-hover:text-primary-600 transition-colors text-center">
                        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span class="text-[10px] font-bold block mt-1">FOTO PROFIL</span>
                    </div>
                </div>
                <input type="file" id="buyer-avatar" accept="image/*" class="hidden" onchange="window.TitikLokal.handleBuyerAvatar(this)">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${renderInput('reg-nama', 'Nama Lengkap', 'text', '', 'required')}
                ${renderInput('reg-username', 'Username', 'text', '', 'required')}
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${renderInput('reg-email', 'Email Address', 'email', '', 'required')}
                ${renderInput('reg-phone', 'Nomor HP', 'tel', '', 'required')}
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${renderPasswordInput('reg-password', 'Password', 'required minlength="8"')}
                ${renderPasswordInput('reg-password-confirm', 'Konfirmasi Password', 'required')}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="relative w-full group">
                    <input type="date" id="reg-dob" name="reg-dob" class="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" required />
                    <label for="reg-dob" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 bg-surface px-1 pointer-events-none">Tanggal Lahir</label>
                </div>
                <div class="relative w-full group">
                    <select id="reg-gender" class="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" required>
                        <option value="" disabled selected></option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                    <label for="reg-gender" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 bg-surface px-1 pointer-events-none">Jenis Kelamin</label>
                </div>
            </div>

            <div class="border-t border-slate-100 pt-6 mt-6">
                <h3 class="text-sm font-bold text-slate-800 mb-4">Informasi Alamat</h3>
                <div class="space-y-4">
                    ${renderInput('reg-alamat', 'Alamat Lengkap (Jalan, RT/RW, No. Rumah)', 'text', '', 'required')}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="relative w-full group">
                            <select id="reg-provinsi" class="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" required>
                                <option value="" disabled selected></option>
                                <option value="DKI Jakarta">DKI Jakarta</option>
                                <option value="Jawa Barat">Jawa Barat</option>
                                <option value="Jawa Tengah">Jawa Tengah</option>
                                <option value="Jawa Timur">Jawa Timur</option>
                                <option value="Bali">Bali</option>
                                <option value="Sumatera Utara">Sumatera Utara</option>
                            </select>
                            <label for="reg-provinsi" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 bg-surface px-1 pointer-events-none">Provinsi</label>
                        </div>
                        ${renderInput('reg-kabupaten', 'Kabupaten / Kota', 'text', '', 'required')}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        ${renderInput('reg-kecamatan', 'Kecamatan', 'text', '', 'required')}
                        ${renderInput('reg-kelurahan', 'Kelurahan', 'text', '', 'required')}
                        ${renderInput('reg-kodepos', 'Kode Pos', 'number', '', 'required')}
                    </div>
                </div>
            </div>

            <label class="flex items-start mt-6 cursor-pointer group">
                <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer mt-0.5" required>
                <span class="ml-3 text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                    Saya menyetujui <a href="#" class="text-primary-600 font-bold hover:underline">Syarat & Ketentuan</a> serta <a href="#" class="text-primary-600 font-bold hover:underline">Kebijakan Privasi</a> TitikLokal.
                </span>
            </label>

            <button type="submit" class="btn-primary w-full !py-4 shadow-primary text-base font-bold mt-6" id="btn-submit-reg-buyer">
                Daftar Sekarang
            </button>
        </form>
    `;
};

window.TitikLokal.handleBuyerAvatar = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('buyer-avatar-preview').src = e.target.result;
            document.getElementById('buyer-avatar-preview').classList.remove('hidden');
            document.getElementById('buyer-avatar-placeholder').classList.add('hidden');
            buyerRegData.avatar = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.TitikLokal.processRegisterBuyer = (form) => {
    const pw1 = document.getElementById('reg-password').value;
    const pw2 = document.getElementById('reg-password-confirm').value;
    
    if(pw1 !== pw2) {
        window.TitikLokal.showError('reg-password-confirm', 'Password tidak cocok');
        showToast('Password dan Konfirmasi harus sama', 'error');
        return;
    }
    
    window.TitikLokal.clearError('reg-password-confirm');
    
    const btn = document.getElementById('btn-submit-reg-buyer');
    window.TitikLokal.simulateLoading(btn, 'Mendaftar...', async () => {
        try {
            const db = JSON.parse(localStorage.getItem('titiklokal_db'));
            const email = document.getElementById('reg-email').value;
            if(db.users.some(u => u.email === email)) {
                showToast('Email sudah terdaftar', 'error');
                return;
            }
            
            const name = document.getElementById('reg-nama').value;
            const newUser = {
                id: 'u_' + Date.now(),
                name: name,
                username: document.getElementById('reg-username').value,
                email: email,
                password: pw1,
                role: 'buyer',
                phone: document.getElementById('reg-phone').value,
                dob: document.getElementById('reg-dob').value,
                gender: document.getElementById('reg-gender').value,
                avatar: buyerRegData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
                address: document.getElementById('reg-alamat').value,
                location: document.getElementById('reg-kabupaten').value,
                addresses: [{
                    id: 'addr_' + Date.now(),
                    label: 'Rumah',
                    recipient: name,
                    phone: document.getElementById('reg-phone').value,
                    detail: `${document.getElementById('reg-alamat').value}, Kel. ${document.getElementById('reg-kelurahan').value}, Kec. ${document.getElementById('reg-kecamatan').value}, ${document.getElementById('reg-kabupaten').value}, ${document.getElementById('reg-provinsi').value} ${document.getElementById('reg-kodepos').value}`,
                    isDefault: true
                }],
                wishlist: [],
                following: [],
                createdAt: new Date().toISOString()
            };
            
            db.users.push(newUser);
            db.session = newUser.id;
            localStorage.setItem('titiklokal_db', JSON.stringify(db));
            
            showToast('Pendaftaran Berhasil!', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } catch (e) {
            showToast('Terjadi kesalahan sistem', 'error');
        }
    });
};


window.TitikLokal.startRegisterSeller = () => {
    currentSellerWizardStep = 1;
    sellerWizardData = {
        owner: {}, shop: {}, location: {},
        hours: {
            senin: { open: "08:00", close: "20:00", isOpen: true }, selasa: { open: "08:00", close: "20:00", isOpen: true },
            rabu: { open: "08:00", close: "20:00", isOpen: true }, kamis: { open: "08:00", close: "20:00", isOpen: true },
            jumat: { open: "08:00", close: "20:00", isOpen: true }, sabtu: { open: "09:00", close: "18:00", isOpen: true },
            minggu: { open: "09:00", close: "15:00", isOpen: false },
        },
        logo: '', banner: '', bank: {}, password: ''
    };
    renderWizardStep();
};

const wizardStepsData = [
    { id: 1, title: 'Data Pemilik', desc: 'Informasi dasar pemilik usaha' },
    { id: 2, title: 'Data Usaha', desc: 'Informasi umum tentang toko Anda' },
    { id: 3, title: 'Kategori', desc: 'Pilih kategori usaha yang sesuai' },
    { id: 4, title: 'Alamat', desc: 'Detail alamat pengiriman dan operasional' },
    { id: 5, title: 'Lokasi Peta', desc: 'Titik lokasi akurat di Google Maps' },
    { id: 6, title: 'Jam Operasional', desc: 'Jadwal buka dan tutup toko' },
    { id: 7, title: 'Logo', desc: 'Identitas visual utama' },
    { id: 8, title: 'Banner', desc: 'Gambar latar belakang toko' },
    { id: 9, title: 'Rekening', desc: 'Rekening penerimaan dana' },
    { id: 10, title: 'Review', desc: 'Periksa kembali seluruh data' },
    { id: 11, title: 'Selesai', desc: 'Pendaftaran berhasil' }
];

const renderWizardStep = () => {
    const container = document.getElementById('auth-form-container');
    if(!container) return;
    
    const stepInfo = wizardStepsData[currentSellerWizardStep - 1];
    
    // Progress Bar
    const progress = ((currentSellerWizardStep - 1) / (totalWizardSteps)) * 100;
    
    let html = `
        <div class="mb-8 animate-slide-up">
            ${currentSellerWizardStep === 1 ? `
            <button class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4" onclick="window.TitikLokal.showLoginForm()">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Kembali ke Login
            </button>
            ` : currentSellerWizardStep < 11 ? `
            <button class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4" onclick="window.TitikLokal.wizardPrev()">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Kembali
            </button>
            ` : ''}
            
            ${currentSellerWizardStep < 11 ? `
            <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-primary-600 uppercase tracking-wider">Langkah ${currentSellerWizardStep} dari ${totalWizardSteps}</span>
                <span class="text-xs font-bold text-slate-400">${Math.round(progress)}%</span>
            </div>
            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div class="h-full bg-primary-600 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
            </div>
            ` : ''}
            
            <h2 class="text-3xl font-bold text-slate-900 tracking-tight">${stepInfo.title}</h2>
            <p class="text-slate-500 mt-2">${stepInfo.desc}</p>
        </div>
        
        <form id="wizard-form" class="animate-slide-up" style="animation-delay: 50ms;" onsubmit="event.preventDefault(); window.TitikLokal.wizardNext(this);">
    `;
    
    // STEP 1: Data Pemilik
    if (currentSellerWizardStep === 1) {
        html += `
            <div class="space-y-4">
                ${renderInput('wiz-nama', 'Nama Lengkap Pemilik', 'text', '', `required value="${sellerWizardData.owner.nama || ''}"`)}
                ${renderInput('wiz-email', 'Email Pemilik', 'email', '', `required value="${sellerWizardData.owner.email || ''}"`)}
                ${renderInput('wiz-phone', 'Nomor HP (WhatsApp)', 'tel', '', `required value="${sellerWizardData.owner.phone || ''}"`)}
                ${renderPasswordInput('wiz-password', 'Password Baru', 'required')}
            </div>
        `;
    }
    // STEP 2: Data Usaha
    else if (currentSellerWizardStep === 2) {
        html += `
            <div class="space-y-4">
                ${renderInput('wiz-toko', 'Nama Toko / Usaha', 'text', '', `required value="${sellerWizardData.shop.nama || ''}"`)}
                <div class="relative w-full group">
                    <textarea id="wiz-deskripsi" rows="3" class="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" required>${sellerWizardData.shop.deskripsi || ''}</textarea>
                    <label for="wiz-deskripsi" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 bg-surface px-1 peer-focus:text-primary-600 pointer-events-none">Deskripsi Singkat Usaha</label>
                </div>
            </div>
        `;
    }
    // STEP 3: Kategori
    else if (currentSellerWizardStep === 3) {
        html += `<div class="grid grid-cols-2 gap-3">`;
        initialData.categories.forEach(cat => {
            const isSelected = sellerWizardData.shop.kategori === cat.name;
            html += `
                <label class="relative cursor-pointer">
                    <input type="radio" name="wiz-kategori" value="${cat.name}" class="peer hidden" required ${isSelected ? 'checked' : ''}>
                    <div class="p-4 border-2 border-slate-200 rounded-2xl peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:border-primary-300 transition-all text-center">
                        <div class="text-slate-400 peer-checked:text-primary-600 mx-auto w-8 h-8 mb-2">${cat.icon}</div>
                        <span class="text-sm font-bold text-slate-700 peer-checked:text-primary-700">${cat.name}</span>
                    </div>
                </label>
            `;
        });
        html += `</div>`;
    }
    // STEP 4: Alamat
    else if (currentSellerWizardStep === 4) {
        html += `
            <div class="space-y-4">
                <div class="relative w-full group">
                    <select id="wiz-kota" class="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" required>
                        <option value="" disabled ${!sellerWizardData.location.kota ? 'selected' : ''}></option>
                        ${initialData.locations.map(l => `<option value="${l}" ${sellerWizardData.location.kota === l ? 'selected' : ''}>${l}</option>`).join('')}
                    </select>
                    <label for="wiz-kota" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 bg-surface px-1 pointer-events-none">Kota / Kabupaten</label>
                </div>
                ${renderInput('wiz-alamat', 'Alamat Lengkap (Jalan, RT/RW, Patokan)', 'text', '', `required value="${sellerWizardData.location.alamat || ''}"`)}
            </div>
        `;
    }
    // STEP 5: Lokasi Peta
    else if (currentSellerWizardStep === 5) {
        html += `
            <div class="space-y-4">
                <div class="w-full h-48 bg-slate-100 rounded-2xl overflow-hidden relative border-2 border-slate-200 flex items-center justify-center">
                    <div class="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/12/3268/2281.png')] bg-cover bg-center opacity-50 blur-[1px]"></div>
                    <svg class="w-10 h-10 text-red-500 relative z-10 drop-shadow-md animate-bounce" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <p class="text-xs text-slate-500 text-center">Geser peta untuk menentukan titik lokasi akurat toko Anda (Simulasi)</p>
            </div>
        `;
    }
    // STEP 6: Jam Operasional
    else if (currentSellerWizardStep === 6) {
        html += `<div class="space-y-3">`;
        const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        days.forEach(day => {
            const data = sellerWizardData.hours[day];
            html += `
                <div class="flex items-center justify-between p-3 border-2 border-slate-100 rounded-xl bg-slate-50/50">
                    <label class="flex items-center cursor-pointer">
                        <input type="checkbox" id="wiz-day-${day}" class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" ${data.isOpen ? 'checked' : ''} onchange="window.TitikLokal.toggleWizardDay('${day}', this.checked)">
                        <span class="ml-3 text-sm font-bold text-slate-700 capitalize w-16">${day}</span>
                    </label>
                    <div class="flex items-center gap-2 ${!data.isOpen ? 'opacity-30 pointer-events-none' : ''}" id="wiz-time-${day}">
                        <input type="time" id="wiz-open-${day}" value="${data.open}" class="text-sm border-slate-200 rounded-lg focus:border-primary-500 px-2 py-1 bg-white border">
                        <span class="text-slate-400">-</span>
                        <input type="time" id="wiz-close-${day}" value="${data.close}" class="text-sm border-slate-200 rounded-lg focus:border-primary-500 px-2 py-1 bg-white border">
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }
    // STEP 7: Logo
    else if (currentSellerWizardStep === 7) {
        html += `
            <div class="flex flex-col items-center">
                <div class="relative w-32 h-32 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group cursor-pointer" onclick="document.getElementById('wiz-logo').click()">
                    <img id="wiz-logo-preview" src="${sellerWizardData.logo || ''}" class="w-full h-full object-cover ${sellerWizardData.logo ? '' : 'hidden'}">
                    <div id="wiz-logo-placeholder" class="text-slate-400 group-hover:text-primary-600 transition-colors text-center ${sellerWizardData.logo ? 'hidden' : ''}">
                        <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span class="text-[10px] font-bold">UPLOAD LOGO</span>
                    </div>
                </div>
                <input type="file" id="wiz-logo" accept="image/*" class="hidden" onchange="window.TitikLokal.handleImageUpload(this, 'wiz-logo-preview', 'wiz-logo-placeholder', 'logo')">
                <p class="text-xs text-slate-400 mt-4 text-center">Format PNG/JPG max 2MB. Rasio 1:1.</p>
            </div>
        `;
    }
    // STEP 8: Banner
    else if (currentSellerWizardStep === 8) {
        html += `
            <div class="flex flex-col items-center">
                <div class="relative w-full h-40 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group cursor-pointer" onclick="document.getElementById('wiz-banner').click()">
                    <img id="wiz-banner-preview" src="${sellerWizardData.banner || ''}" class="w-full h-full object-cover ${sellerWizardData.banner ? '' : 'hidden'}">
                    <div id="wiz-banner-placeholder" class="text-slate-400 group-hover:text-primary-600 transition-colors text-center ${sellerWizardData.banner ? 'hidden' : ''}">
                        <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span class="text-[10px] font-bold">UPLOAD BANNER</span>
                    </div>
                </div>
                <input type="file" id="wiz-banner" accept="image/*" class="hidden" onchange="window.TitikLokal.handleImageUpload(this, 'wiz-banner-preview', 'wiz-banner-placeholder', 'banner')">
                <p class="text-xs text-slate-400 mt-4 text-center">Format PNG/JPG max 5MB. Rasio 16:9.</p>
            </div>
        `;
    }
    // STEP 9: Rekening
    else if (currentSellerWizardStep === 9) {
        html += `
            <div class="space-y-4">
                <div class="relative w-full group">
                    <select id="wiz-bank" class="block w-full px-4 pt-6 pb-2 text-sm text-slate-900 bg-transparent border-2 border-slate-200 rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 peer transition-colors" required>
                        <option value="" disabled ${!sellerWizardData.bank.bankName ? 'selected' : ''}></option>
                        ${initialData.banks.map(b => `<option value="${b.id}" ${sellerWizardData.bank.bankName === b.id ? 'selected' : ''}>${b.name}</option>`).join('')}
                    </select>
                    <label for="wiz-bank" class="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 bg-surface px-1 pointer-events-none">Nama Bank</label>
                </div>
                ${renderInput('wiz-acc-no', 'Nomor Rekening', 'number', '', `required value="${sellerWizardData.bank.accountNumber || ''}"`)}
                ${renderInput('wiz-acc-name', 'Atas Nama', 'text', '', `required value="${sellerWizardData.bank.accountName || ''}"`)}
            </div>
        `;
    }
    // STEP 10: Review
    else if (currentSellerWizardStep === 10) {
        html += `
            <div class="space-y-4 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div class="flex justify-between border-b border-slate-200 pb-2"><span class="text-slate-500">Pemilik</span><span class="font-bold text-slate-800 text-right">${sellerWizardData.owner.nama}</span></div>
                <div class="flex justify-between border-b border-slate-200 pb-2"><span class="text-slate-500">Toko</span><span class="font-bold text-slate-800 text-right">${sellerWizardData.shop.nama}</span></div>
                <div class="flex justify-between border-b border-slate-200 pb-2"><span class="text-slate-500">Kategori</span><span class="font-bold text-slate-800 text-right">${sellerWizardData.shop.kategori}</span></div>
                <div class="flex justify-between border-b border-slate-200 pb-2"><span class="text-slate-500">Kota</span><span class="font-bold text-slate-800 text-right">${sellerWizardData.location.kota}</span></div>
                <div class="flex justify-between pb-2"><span class="text-slate-500">Bank</span><span class="font-bold text-slate-800 text-right uppercase">${sellerWizardData.bank.bankName}</span></div>
            </div>
            
            <label class="flex items-start mt-6 cursor-pointer group">
                <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer mt-0.5" required>
                <span class="ml-3 text-sm text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                    Data yang saya masukkan sudah benar dan saya menyetujui Ketentuan Penjual TitikLokal.
                </span>
            </label>
        `;
    }
    // STEP 11: Success
    else if (currentSellerWizardStep === 11) {
        html += `
            <div class="flex flex-col items-center justify-center py-8 text-center">
                <div class="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 class="text-2xl font-bold text-slate-900 mb-2">Toko Berhasil Dibuat!</h3>
                <p class="text-slate-500 mb-8">Selamat datang di ekosistem TitikLokal. Mulai kelola toko Anda sekarang.</p>
                <button type="button" class="btn-primary w-full !py-4 shadow-primary text-base font-bold" onclick="window.TitikLokal.finishWizard()">
                    Masuk ke Dashboard Seller
                </button>
            </div>
        `;
    }
    
    if (currentSellerWizardStep < 11) {
        html += `
            <button type="submit" class="btn-primary w-full !py-4 shadow-primary text-base font-bold mt-8" id="btn-wizard-next">
                ${currentSellerWizardStep === 10 ? 'Konfirmasi & Daftar' : 'Selanjutnya'}
            </button>
        `;
    }
    
    html += `</form>`;
    container.innerHTML = html;
};

window.TitikLokal.toggleWizardDay = (day, checked) => {
    sellerWizardData.hours[day].isOpen = checked;
    const timeContainer = document.getElementById(`wiz-time-${day}`);
    if(checked) {
        timeContainer.classList.remove('opacity-30', 'pointer-events-none');
    } else {
        timeContainer.classList.add('opacity-30', 'pointer-events-none');
    }
};

window.TitikLokal.handleImageUpload = (input, imgId, placeholderId, key) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(imgId).src = e.target.result;
            document.getElementById(imgId).classList.remove('hidden');
            document.getElementById(placeholderId).classList.add('hidden');
            sellerWizardData[key] = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.TitikLokal.wizardPrev = () => {
    if(currentSellerWizardStep > 1) {
        currentSellerWizardStep--;
        renderWizardStep();
    }
};

window.TitikLokal.wizardNext = (form) => {
    if (currentSellerWizardStep === 1) {
        const pw = document.getElementById('wiz-password').value;
        sellerWizardData.owner = {
            nama: document.getElementById('wiz-nama').value,
            email: document.getElementById('wiz-email').value,
            phone: document.getElementById('wiz-phone').value
        };
        sellerWizardData.password = pw;
    } 
    else if (currentSellerWizardStep === 2) {
        sellerWizardData.shop.nama = document.getElementById('wiz-toko').value;
        sellerWizardData.shop.deskripsi = document.getElementById('wiz-deskripsi').value;
    }
    else if (currentSellerWizardStep === 3) {
        const checked = form.querySelector('input[name="wiz-kategori"]:checked');
        if(!checked) { showToast('Pilih salah satu kategori', 'error'); return; }
        sellerWizardData.shop.kategori = checked.value;
    }
    else if (currentSellerWizardStep === 4) {
        sellerWizardData.location.kota = document.getElementById('wiz-kota').value;
        sellerWizardData.location.alamat = document.getElementById('wiz-alamat').value;
    }
    else if (currentSellerWizardStep === 6) {
        const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        days.forEach(day => {
            sellerWizardData.hours[day].open = document.getElementById(`wiz-open-${day}`).value;
            sellerWizardData.hours[day].close = document.getElementById(`wiz-close-${day}`).value;
        });
    }
    else if (currentSellerWizardStep === 9) {
        sellerWizardData.bank = {
            bankName: document.getElementById('wiz-bank').value,
            accountNumber: document.getElementById('wiz-acc-no').value,
            accountName: document.getElementById('wiz-acc-name').value
        };
    }
    else if (currentSellerWizardStep === 10) {
        const btn = document.getElementById('btn-wizard-next');
        window.TitikLokal.simulateLoading(btn, 'Memproses Pendaftaran...', () => {
            saveNewSeller();
            currentSellerWizardStep++;
            renderWizardStep();
        });
        return;
    }
    
    currentSellerWizardStep++;
    renderWizardStep();
};

const saveNewSeller = () => {
    const db = JSON.parse(localStorage.getItem('titiklokal_db'));
    const userId = 'u_seller_' + Date.now();
    const shopId = 'toko_' + Date.now();
    
    const newUser = {
        id: userId,
        name: sellerWizardData.owner.nama,
        email: sellerWizardData.owner.email,
        phone: sellerWizardData.owner.phone,
        password: sellerWizardData.password,
        role: 'seller',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerWizardData.owner.nama)}&background=06b6d4&color=fff`,
        address: sellerWizardData.location.alamat,
        location: sellerWizardData.location.kota,
        createdAt: new Date().toISOString()
    };
    
    const newShop = {
        id: shopId,
        ownerId: userId,
        namaToko: sellerWizardData.shop.nama,
        pemilik: sellerWizardData.owner.nama,
        kategori: sellerWizardData.shop.kategori,
        rating: 0,
        ulasanCount: 0,
        totalSales: 0,
        lokasi: sellerWizardData.location.kota,
        alamat: sellerWizardData.location.alamat,
        operatingHours: sellerWizardData.hours,
        jamBuka: `${sellerWizardData.hours.senin.open} - ${sellerWizardData.hours.senin.close}`,
        isOpen: true,
        jarakDari: { "Bandung": 1.5, "Jakarta": 15, "Medan": 1400, "Surabaya": 700, "Bali": 900 },
        saldo: 0,
        coverImg: sellerWizardData.banner || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
        bannerImg: sellerWizardData.banner || "https://images.unsplash.com/photo-1559181567-c3190aa9dbed?w=1200&q=80",
        logo: sellerWizardData.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerWizardData.shop.nama)}&background=f59e0b&color=fff`,
        deskripsi: sellerWizardData.shop.deskripsi,
        coords: [-6.200000, 106.816666], // dummy
        verificationStatus: "verified",
        bankAccount: sellerWizardData.bank,
        produk: []
    };
    
    db.users.push(newUser);
    db.shops.push(newShop);
    db.session = userId;
    localStorage.setItem('titiklokal_db', JSON.stringify(db));
};

window.TitikLokal.finishWizard = () => {
    window.location.reload();
};
