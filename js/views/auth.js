import { api } from '../core/storage.js';
import { switchView, showToast, showModal, hideModal } from '../components/ui.js';
import { initialData } from '../config/data.js';

window.TitikLokal = window.TitikLokal || {};


let currentRole = 'buyer'; // default
let currentAuthTab = 'login';
let currentSellerWizardStep = 1;
const totalWizardSteps = 10;
let sellerWizardData = {
    owner: {},
    shop: {},
    location: {},
    hours: {
        senin: { open: "08:00", close: "20:00", isOpen: true },
        selasa: { open: "08:00", close: "20:00", isOpen: true },
        rabu: { open: "08:00", close: "20:00", isOpen: true },
        kamis: { open: "08:00", close: "20:00", isOpen: true },
        jumat: { open: "08:00", close: "20:00", isOpen: true },
        sabtu: { open: "09:00", close: "18:00", isOpen: true },
        minggu: { open: "09:00", close: "15:00", isOpen: false },
    },
    logo: '',
    banner: '',
    bank: {},
    password: ''
};

let buyerRegData = { avatar: '' };

export const initAuth = (role, btn) => {
    const originalContent = btn ? btn.innerHTML : '';
    const proceed = () => {
        currentRole = role;
        currentAuthTab = 'login';
        
        // Hide onboarding if coming from there
        document.getElementById('view-onboarding')?.classList.add('hidden');
        
        switchView('view-auth');
        renderAuthHub();
    };

    if (btn) {
        window.TitikLokal.simulateLoading(btn, originalContent, proceed);
    } else {
        proceed();
    }
};

const renderAuthHub = () => {
    const container = document.getElementById('view-auth');
    
    const isSeller = currentRole === 'seller';
    const isGeneral = currentRole === 'general';
    
    let welcomeMessage = 'Selamat Datang Kembali!';
    if (!isGeneral) {
        welcomeMessage = `Selamat Datang, ${isSeller ? 'Pemilik Usaha' : 'Sobat Lokal'}!`;
    }
    
    container.innerHTML = `
        <div class="w-full max-w-md bg-surface p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <!-- Decorative blobs -->
            <div class="absolute -top-16 -right-16 w-32 h-32 ${isSeller ? 'bg-amber-100' : 'bg-primary-100'} rounded-full blur-2xl opacity-60"></div>
            <div class="absolute -bottom-16 -left-16 w-32 h-32 ${isSeller ? 'bg-orange-500/10' : 'bg-secondary-500/10'} rounded-full blur-2xl opacity-60"></div>
            
            <button class="absolute top-6 left-6 text-slate-400 hover:text-slate-700 transition-colors" onclick="window.TitikLokal.switchView('view-splash')">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>

            <div class="text-center mt-4 mb-8 relative z-10">
                <!-- Modern Top Illustration (SVG) -->
                <div class="mx-auto w-32 h-24 mb-4 flex items-center justify-center">
                    ${isSeller ? `
                    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                        <path d="M40 90 L100 50 L160 90" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M60 90 V130 H140 V90" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M50 90 L100 110 L150 90" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="100" cy="50" r="18" fill="#f59e0b" opacity="0.1"/>
                        <circle cx="100" cy="50" r="8" fill="#f59e0b"/>
                        <path d="M100 50 L100 100" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
                    </svg>
                    ` : `
                    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                        <path d="M40 100 L100 60 L160 100" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M60 100 V130 H140 V100" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="100" cy="50" r="20" fill="#2563eb" opacity="0.1"/>
                        <circle cx="100" cy="50" r="10" fill="#2563eb"/>
                        <path d="M100 50 L100 110" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
                    </svg>
                    `}
                </div>
                
                <h2 class="text-2xl font-bold text-slate-800 tracking-tight">${welcomeMessage}</h2>
                <p class="text-slate-500 text-sm mt-1">Silakan masuk${isGeneral ? '' : ' atau daftar'} untuk melanjutkan.</p>
            </div>

            <!-- Tabs -->
            ${isGeneral ? '' : `
            <div class="flex p-1 bg-slate-100 rounded-xl mb-8 relative z-10">
                <button class="flex-1 auth-tab-btn ${currentAuthTab === 'login' ? 'active' : ''}" onclick="window.TitikLokal.switchAuthTab('login')">Masuk</button>
                <button class="flex-1 auth-tab-btn ${currentAuthTab === 'register' ? 'active' : ''}" onclick="window.TitikLokal.switchAuthTab('register')">Daftar</button>
            </div>
            `}

            <!-- Dynamic Content -->
            <div id="auth-content-area" class="relative z-10">
                ${currentAuthTab === 'login' ? renderLoginOptions() : renderRegisterIntro()}
            </div>
        </div>
    `;
};

window.TitikLokal.switchAuthTab = (tab) => {
    currentAuthTab = tab;
    renderAuthHub();
};

const renderLoginOptions = () => {
    return `
        <div class="space-y-3">
            <button class="auth-method-btn" onclick="window.TitikLokal.showLoginForm('email')">
                <div class="icon bg-slate-100 text-slate-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                <span class="flex-1 text-left">Lanjutkan dengan Email</span>
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            <button class="auth-method-btn" onclick="window.TitikLokal.showLoginForm('phone')">
                <div class="icon bg-slate-100 text-slate-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                <span class="flex-1 text-left">Lanjutkan dengan Nomor HP</span>
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
            
            <div class="relative py-4">
                <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
                <div class="relative flex justify-center"><span class="bg-surface px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Atau</span></div>
            </div>

            <button class="auth-method-btn btn-apple" onclick="window.TitikLokal.simulateSocialLogin('Apple')">
                <div class="icon"><svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.689.827-1.35 2.282-1.156 3.626 1.352.104 2.597-.598 3.442-1.614z"/></svg></div>
                <span class="flex-1 text-left font-medium">Lanjutkan dengan Apple</span>
            </button>
            <button class="auth-method-btn btn-google" onclick="window.TitikLokal.simulateGoogleLogin()">
                <div class="icon"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" class="w-5 h-5"></div>
                <span class="flex-1 text-left font-medium">Lanjutkan dengan Google</span>
            </button>
            <button class="auth-method-btn btn-facebook" onclick="window.TitikLokal.simulateFacebookLogin()">
                <div class="icon bg-[#1877f2] text-white"><svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                <span class="flex-1 text-left font-medium">Lanjutkan dengan Facebook</span>
            </button>
        </div>
    `;
};

const renderRegisterIntro = () => {
    if (currentRole === 'buyer') {
        return `
            <div class="text-center py-4">
                <p class="text-sm text-slate-600 mb-6 leading-relaxed">Buat akun untuk mulai berbelanja, menyimpan wishlist, dan mendukung UMKM lokal.</p>
                <button class="btn-primary" onclick="window.TitikLokal.startRegisterBuyer()">
                    Daftar Sekarang
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
            </div>
        `;
    } else {
        return `
            <div class="text-center py-4">
                <div class="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm text-left mb-6 font-medium border border-amber-100 flex gap-3">
                    <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Pendaftaran Mitra UMKM memerlukan verifikasi data usaha dan lokasi toko Anda.
                </div>
                <button class="btn-primary" onclick="window.TitikLokal.startRegisterSeller()">
                    Mulai Buka Toko (10 Tahap)
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
            </div>
        `;
    }
};

// ── FORMS ──────────────────────────────────────────────────

window.TitikLokal.showLoginForm = (method) => {
    const area = document.getElementById('auth-content-area');
    
    let defaultEmail = currentRole === 'buyer' ? 'budi@mail.com' : currentRole === 'admin' ? 'admin@titiklokal.id' : 'asep@mail.com';
    let defaultPass = currentRole === 'admin' ? 'admin123' : 'password123';
    
    if (method === 'email') {
        area.innerHTML = `
            <button class="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6 transition-colors" onclick="window.TitikLokal.switchAuthTab('login')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                Kembali
            </button>
            <form onsubmit="event.preventDefault(); window.TitikLokal.processLoginEmail()" class="space-y-4">
                <div>
                    <label class="form-label">Email</label>
                    <input type="email" id="login-email" class="form-input" required value="${defaultEmail}">
                </div>
                <div>
                    <label class="form-label">Password</label>
                    <input type="password" id="login-password" class="form-input" required value="${defaultPass}">
                </div>
                <div class="flex justify-end">
                    <button type="button" class="text-xs font-bold text-primary-600 hover:underline">Lupa Password?</button>
                </div>
                <button type="submit" id="btn-login-submit" class="btn-primary mt-4">
                    Masuk
                </button>
            </form>
        `;
    } else if (method === 'phone') {
        area.innerHTML = `
            <button class="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6 transition-colors" onclick="window.TitikLokal.switchAuthTab('login')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                Kembali
            </button>
            <div id="phone-input-step">
                <label class="form-label">Nomor WhatsApp / HP</label>
                <div class="flex gap-2">
                    <div class="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 flex items-center">+62</div>
                    <input type="tel" id="login-phone" class="form-input flex-1" placeholder="81234567890" required value="${currentRole==='seller'?'8987654321':'8123456789'}">
                </div>
                <p class="text-xs text-slate-500 mt-2">Kami akan mengirimkan kode OTP via WhatsApp (Simulasi).</p>
                <button type="button" class="btn-primary mt-6" onclick="window.TitikLokal.requestOTP()">
                    Kirim Kode OTP
                </button>
            </div>
            <div id="otp-step" class="hidden">
                <div class="text-center mb-6">
                    <h3 class="font-bold text-slate-800 mb-1">Masukkan Kode OTP</h3>
                    <p class="text-sm text-slate-500">Kode telah dikirim ke <span id="display-phone" class="font-bold"></span></p>
                    <div class="text-xs font-bold text-amber-600 bg-amber-50 py-1.5 px-3 rounded-lg mt-3 inline-block border border-amber-100">Hint: Gunakan OTP "123456"</div>
                </div>
                <div class="otp-grid mb-6">
                    <input type="text" maxlength="1" class="otp-input" onkeyup="window.TitikLokal.focusNext(this, 1)">
                    <input type="text" maxlength="1" class="otp-input" onkeyup="window.TitikLokal.focusNext(this, 2)">
                    <input type="text" maxlength="1" class="otp-input" onkeyup="window.TitikLokal.focusNext(this, 3)">
                    <input type="text" maxlength="1" class="otp-input" onkeyup="window.TitikLokal.focusNext(this, 4)">
                    <input type="text" maxlength="1" class="otp-input" onkeyup="window.TitikLokal.focusNext(this, 5)">
                    <input type="text" maxlength="1" class="otp-input" onkeyup="window.TitikLokal.verifyOTP(this)">
                </div>
                <div class="text-center text-sm font-semibold text-slate-500">
                    Kirim ulang dalam <span class="text-primary-600">00:59</span>
                </div>
            </div>
        `;
    }
};

window.TitikLokal.processLoginEmail = async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login-submit');
    
    try {
        btn.innerHTML = `<span class="spinner"></span>`;
        btn.disabled = true;
        
        const user = await api.login(email, pass);
        if (currentRole !== 'general' && user.role !== currentRole && currentRole !== 'buyer') {
            throw new Error(`Akun ini tidak terdaftar sebagai ${currentRole}.`);
        }
        showToast('Login berhasil!', 'success');
        window.TitikLokal.enterApp(user);
    } catch (e) {
        showToast(e.message, 'error');
        btn.innerHTML = 'Masuk';
        btn.disabled = false;
    }
};

window.TitikLokal.requestOTP = () => {
    const phone = document.getElementById('login-phone').value;
    if(!phone) return showToast('Masukkan nomor HP', 'error');
    
    document.getElementById('phone-input-step').classList.add('hidden');
    document.getElementById('otp-step').classList.remove('hidden');
    document.getElementById('display-phone').innerText = '+62 ' + phone;
    document.querySelector('.otp-input').focus();
    showToast('OTP "123456" berhasil dikirim', 'info');
};

window.TitikLokal.focusNext = (el, idx) => {
    if(el.value.length === 1 && idx < 6) {
        document.querySelectorAll('.otp-input')[idx].focus();
    }
};

window.TitikLokal.verifyOTP = async (lastEl) => {
    const inputs = document.querySelectorAll('.otp-input');
    let otp = '';
    inputs.forEach(i => otp += i.value);
    
    if (otp.length === 6) {
        lastEl.blur();
        const phone = '0' + document.getElementById('login-phone').value; // Convert back to 08...
        
        try {
            showToast('Memverifikasi...', 'info');
            const user = await api.loginWithPhone(phone, otp);
            showToast('Verifikasi berhasil!', 'success');
            window.TitikLokal.enterApp(user);
        } catch (e) {
            showToast(e.message, 'error');
            inputs.forEach(i => i.value = '');
            inputs[0].focus();
        }
    }
};

// ── SOCIAL LOGIN SIMULATION ────────────────────────────────

window.TitikLokal.simulateSocialLogin = (platform) => {
    showToast(`Membuka jendela autentikasi ${platform}...`, 'info');
    setTimeout(() => {
        showToast(`Login ${platform} gagal disimulasikan. Gunakan Google atau Email.`, 'error');
    }, 1500);
};

window.TitikLokal.simulateGoogleLogin = async () => {
    const modalContent = document.getElementById('modal-generic-content');
    const accounts = await api.getGoogleAccounts();
    
    modalContent.innerHTML = `
        <div class="p-6">
            <div class="flex justify-center mb-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" class="w-8 h-8">
            </div>
            <h3 class="text-xl font-bold text-center text-slate-800 mb-2">Pilih akun Google</h3>
            <p class="text-sm text-center text-slate-500 mb-6">untuk melanjutkan ke TitikLokal</p>
            
            <div class="space-y-2 mb-6">
                ${accounts.map(acc => `
                    <div class="google-account-item border border-slate-100" onclick="window.TitikLokal.processSocialLogin('google', '${acc.id}')">
                        <img src="${acc.avatar}" class="w-10 h-10 rounded-full">
                        <div>
                            <div class="font-bold text-slate-800 text-sm">${acc.name}</div>
                            <div class="text-xs text-slate-500">${acc.email}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <p class="text-[10px] text-center text-slate-400">Untuk terus menggunakan aplikasi ini, Google akan membagikan nama, alamat email, dan foto profil Anda ke TitikLokal.</p>
        </div>
    `;
    showModal('modal-generic');
};

window.TitikLokal.simulateFacebookLogin = async () => {
    const accounts = await api.getFacebookAccounts();
    window.TitikLokal.processSocialLogin('facebook', accounts[0].id); // Just auto pick first for FB
};

window.TitikLokal.processSocialLogin = async (provider, accId) => {
    hideModal('modal-generic');
    showToast('Sedang autentikasi...', 'info');
    
    try {
        let accountData;
        if(provider === 'google') {
            const accs = await api.getGoogleAccounts();
            accountData = accs.find(a => a.id === accId);
        } else {
            const accs = await api.getFacebookAccounts();
            accountData = accs.find(a => a.id === accId);
        }
        
        const user = await api.loginWithSocial(provider, accountData, currentRole);
        showToast('Login berhasil!', 'success');
        window.TitikLokal.enterApp(user);
    } catch(e) {
        showToast(e.message, 'error');
    }
};

// ── BUYER REGISTRATION (EXTENDED) ──────────────────────────

window.TitikLokal.startRegisterBuyer = () => {
    buyerRegData = { avatar: '' };
    switchView('view-register-buyer');
    const container = document.getElementById('view-register-buyer');
    
    container.innerHTML = `
        <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
            <div class="w-full max-w-md bg-surface p-8 rounded-3xl shadow-xl">
                <button class="text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6 transition-colors" onclick="window.TitikLokal.initAuth('buyer')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    Kembali
                </button>
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Daftar Akun Baru</h2>
                <p class="text-slate-500 text-sm mb-6">Lengkapi data Anda untuk pengalaman terbaik.</p>
                
                <form id="reg-buyer-form" onsubmit="event.preventDefault(); window.TitikLokal.processRegisterBuyer()" class="space-y-4">
                    <div class="flex justify-center mb-6">
                        <div class="relative group cursor-pointer" onclick="document.getElementById('reg-b-avatar').click()">
                            <div class="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden group-hover:border-primary-500 transition-colors" id="reg-b-avatar-preview">
                                <svg class="w-6 h-6 text-slate-400 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                <span class="text-[10px] text-slate-400 mt-1">Upload Foto</span>
                            </div>
                        </div>
                        <input type="file" id="reg-b-avatar" class="hidden" accept="image/*" onchange="window.TitikLokal.handleBuyerAvatar(this)">
                    </div>

                    <div>
                        <label class="form-label">Nama Lengkap</label>
                        <input type="text" id="reg-b-name" class="form-input" required placeholder="Cth: Budi Santoso">
                    </div>
                    <div>
                        <label class="form-label">Email</label>
                        <input type="email" id="reg-b-email" class="form-input" required placeholder="budi@email.com">
                    </div>
                    <div>
                        <label class="form-label">Nomor HP</label>
                        <input type="tel" id="reg-b-phone" class="form-input" required placeholder="08123456789">
                    </div>
                    <div>
                        <label class="form-label">Alamat Lengkap</label>
                        <textarea id="reg-b-addr" class="form-input" rows="2" required placeholder="Jalan, RT/RW, Kelurahan, Kota"></textarea>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="form-label">Password</label>
                            <input type="password" id="reg-b-pass" class="form-input" required minlength="6" placeholder="Min. 6 char">
                        </div>
                        <div>
                            <label class="form-label">Konfirmasi Password</label>
                            <input type="password" id="reg-b-pass-conf" class="form-input" required minlength="6" placeholder="Ketik ulang">
                        </div>
                    </div>
                    
                    <button type="submit" id="btn-reg-b-submit" class="btn-primary mt-6 !py-4 shadow-primary">Daftar Sekarang</button>
                </form>
            </div>
        </div>
    `;
};

window.TitikLokal.handleBuyerAvatar = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            buyerRegData.avatar = e.target.result;
            const preview = document.getElementById('reg-b-avatar-preview');
            preview.innerHTML = `<img src="${buyerRegData.avatar}" class="w-full h-full object-cover">`;
            preview.classList.remove('border-dashed', 'border-slate-300');
            preview.classList.add('border-primary-500');
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.TitikLokal.processRegisterBuyer = async () => {
    const pass = document.getElementById('reg-b-pass').value;
    const conf = document.getElementById('reg-b-pass-conf').value;

    if (pass !== conf) {
        return showToast('Password dan Konfirmasi Password tidak cocok!', 'error');
    }

    const data = {
        name: document.getElementById('reg-b-name').value,
        email: document.getElementById('reg-b-email').value,
        phone: document.getElementById('reg-b-phone').value,
        address: document.getElementById('reg-b-addr').value,
        password: pass,
        avatar: buyerRegData.avatar || 'https://ui-avatars.com/api/?name=' + document.getElementById('reg-b-name').value + '&background=eff6ff&color=2563eb',
        role: 'buyer'
    };
    
    const btn = document.getElementById('btn-reg-b-submit');
    try {
        btn.innerHTML = `<span class="spinner"></span>`;
        btn.disabled = true;
        const user = await api.register(data);
        showToast('Pendaftaran berhasil!', 'success');
        window.TitikLokal.enterApp(user);
    } catch(e) {
        showToast(e.message, 'error');
        btn.innerHTML = 'Daftar Sekarang';
        btn.disabled = false;
    }
};

// ── SELLER WIZARD (10 STEPS) ────────────────────────────────

window.TitikLokal.startRegisterSeller = () => {
    currentSellerWizardStep = 1;
    sellerWizardData = { owner: {}, shop: {}, location: {}, hours: {}, logo: '', banner: '', bank: {}, password: '' };
    switchView('view-register-seller');
    renderSellerWizard();
};

const renderSellerWizard = async () => {
    const container = document.getElementById('view-register-seller');
    const progress = (currentSellerWizardStep / totalWizardSteps) * 100;
    
    let html = `
        <div class="min-h-screen bg-slate-50 pb-24">
            <header class="bg-surface sticky top-0 z-40 border-b border-slate-100 p-4 shadow-sm">
                <div class="max-w-3xl mx-auto flex items-center gap-4">
                    <button class="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100" onclick="window.TitikLokal.wizardPrev()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${currentSellerWizardStep === 1 ? 'M6 18L18 6M6 6l12 12' : 'M15 19l-7-7 7-7'}"/></svg>
                    </button>
                    <div class="flex-1">
                        <div class="flex justify-between text-xs font-bold text-slate-500 mb-2">
                            <span>Langkah ${currentSellerWizardStep} dari ${totalWizardSteps}</span>
                            <span class="text-primary-600">${Math.round(progress)}%</span>
                        </div>
                        <div class="wizard-progress-bar">
                            <div class="wizard-progress-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            </header>
            
            <div class="max-w-2xl mx-auto p-4 mt-4">
                <form id="wizard-form" onsubmit="event.preventDefault(); window.TitikLokal.wizardNext()">
    `;

    // ── STEPS (1-10) ──
    if (currentSellerWizardStep === 1) {
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Informasi Pemilik</h2>
                <p class="text-slate-500 text-sm mb-6">Data diri Anda sebagai penanggung jawab utama toko.</p>
                <div class="card card-p space-y-4">
                    <div>
                        <label class="form-label">Nama Lengkap (Sesuai KTP)</label>
                        <input type="text" id="wz-name" class="form-input" required value="${sellerWizardData.owner.name || ''}" placeholder="Cth: Asep Sunandar">
                    </div>
                    <div>
                        <label class="form-label">Nomor Induk Kependudukan (NIK)</label>
                        <input type="text" id="wz-nik" class="form-input" required value="${sellerWizardData.owner.nik || ''}" placeholder="16 digit angka" pattern="[0-9]{16}">
                    </div>
                    <div>
                        <label class="form-label">Email Pemilik</label>
                        <input type="email" id="wz-email" class="form-input" required value="${sellerWizardData.owner.email || ''}">
                    </div>
                    <div>
                        <label class="form-label">No WhatsApp Aktif</label>
                        <input type="tel" id="wz-phone" class="form-input" required value="${sellerWizardData.owner.phone || ''}">
                    </div>
                    <div>
                        <label class="form-label">Buat Password Akun</label>
                        <input type="password" id="wz-pass" class="form-input" required value="${sellerWizardData.password || ''}" minlength="6">
                    </div>
                </div>
            </div>
        `;
    } 
    else if (currentSellerWizardStep === 2) {
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Profil Toko</h2>
                <p class="text-slate-500 text-sm mb-6">Informasi dasar tentang nama dan deskripsi toko Anda.</p>
                <div class="card card-p space-y-4">
                    <div>
                        <label class="form-label">Nama Toko</label>
                        <input type="text" id="wz-shop-name" class="form-input" required value="${sellerWizardData.shop.name || ''}" placeholder="Cth: Kripik Singkong Mang Asep">
                    </div>
                    <div>
                        <label class="form-label">Slogan Singkat (Opsional)</label>
                        <input type="text" id="wz-shop-slogan" class="form-input" value="${sellerWizardData.shop.slogan || ''}" placeholder="Cth: Renyah dan Gurih Setiap Saat">
                    </div>
                    <div>
                        <label class="form-label">Deskripsi Lengkap Toko</label>
                        <textarea id="wz-shop-desc" class="form-input" rows="5" required placeholder="Jelaskan keunggulan produk atau sejarah singkat usaha Anda...">${sellerWizardData.shop.description || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 3) {
        const categories = await api.getCategories();
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Kategori Bisnis</h2>
                <p class="text-slate-500 text-sm mb-6">Pilih kategori yang paling sesuai dengan jenis produk Anda.</p>
                <div class="grid grid-cols-2 gap-3">
                    ${categories.map(c => `
                        <label class="relative cursor-pointer group">
                            <input type="radio" name="wz_cat" class="sr-only peer" value="${c.name}" required ${sellerWizardData.shop.category === c.name ? 'checked' : ''}>
                            <div class="p-4 border border-slate-200 rounded-2xl bg-surface hover:border-primary-300 peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:ring-1 peer-checked:ring-primary-600 transition-all text-center flex flex-col items-center gap-2">
                                <span class="text-3xl">${c.icon}</span>
                                <span class="font-bold text-slate-700 text-sm peer-checked:text-primary-700">${c.name}</span>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 4) {
        const locations = await api.getLocations();
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Alamat Toko</h2>
                <p class="text-slate-500 text-sm mb-6">Alamat lengkap fisik toko atau tempat operasional Anda.</p>
                <div class="card card-p space-y-4">
                    <div>
                        <label class="form-label">Kota / Kabupaten</label>
                        <select id="wz-loc-city" class="form-input" required>
                            <option value="">Pilih Kota</option>
                            ${locations.map(c => `<option value="${c}" ${sellerWizardData.location.city === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Kode Pos</label>
                        <input type="text" id="wz-loc-zip" class="form-input" required value="${sellerWizardData.location.zip || ''}" pattern="[0-9]{5}">
                    </div>
                    <div>
                        <label class="form-label">Alamat Lengkap</label>
                        <textarea id="wz-loc-addr" class="form-input" rows="3" required placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan...">${sellerWizardData.location.address || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 5) {
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Lokasi Peta</h2>
                <p class="text-slate-500 text-sm mb-6">Tentukan koordinat presisi agar kurir mudah menjemput paket.</p>
                
                <div class="card card-p">
                    <div class="aspect-video bg-slate-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-slate-200">
                        <!-- Simulated map view -->
                        <div class="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&fit=crop')] bg-cover bg-center"></div>
                        <div class="relative z-10 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-600/40 animate-bounce">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
                        </div>
                    </div>
                    <button type="button" class="btn-secondary w-full" onclick="window.TitikLokal.showToast('Koordinat berhasil dikunci (Simulasi)', 'success')">
                        <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                        Gunakan Lokasi Saat Ini
                    </button>
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 6) {
        const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        const dayNames = { senin: 'Senin', selasa: 'Selasa', rabu: 'Rabu', kamis: 'Kamis', jumat: 'Jumat', sabtu: 'Sabtu', minggu: 'Minggu' };
        
        if(Object.keys(sellerWizardData.hours).length === 0) {
            days.forEach(d => { sellerWizardData.hours[d] = { open: "08:00", close: "17:00", isOpen: d !== 'minggu' }; });
        }

        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Jam Operasional</h2>
                <p class="text-slate-500 text-sm mb-6">Kapan toko Anda siap menerima pesanan?</p>
                <div class="card card-p space-y-4">
                    ${days.map(d => `
                        <div class="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                            <label class="relative inline-flex items-center cursor-pointer w-24">
                                <input type="checkbox" class="sr-only peer wz-day-cb" data-day="${d}" ${sellerWizardData.hours[d].isOpen ? 'checked' : ''} onchange="window.TitikLokal.toggleWizardDay(this)">
                                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                                <span class="ml-2 text-sm font-semibold text-slate-700">${dayNames[d]}</span>
                            </label>
                            
                            <div class="flex-1 flex items-center gap-2 transition-opacity ${sellerWizardData.hours[d].isOpen ? 'opacity-100' : 'opacity-30 pointer-events-none'}" id="wz-time-${d}">
                                <input type="time" class="form-input py-1.5 px-3 text-sm wz-time-open" data-day="${d}" value="${sellerWizardData.hours[d].open}">
                                <span class="text-slate-400 font-bold">-</span>
                                <input type="time" class="form-input py-1.5 px-3 text-sm wz-time-close" data-day="${d}" value="${sellerWizardData.hours[d].close}">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 7) {
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Logo Toko</h2>
                <p class="text-slate-500 text-sm mb-6">Identitas visual usaha Anda (Rasio 1:1).</p>
                <div class="card card-p">
                    <div class="upload-zone flex flex-col items-center" onclick="document.getElementById('wz-logo-input').click()">
                        ${sellerWizardData.logo ? `
                            <img src="${sellerWizardData.logo}" class="w-24 h-24 object-cover rounded-2xl shadow-sm mb-3 border-2 border-surface bg-surface">
                            <span class="text-sm font-bold text-primary-600">Ganti Logo</span>
                        ` : `
                            <div class="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-3">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <span class="text-sm font-bold text-slate-700">Tap untuk upload logo</span>
                            <span class="text-xs text-slate-400 mt-1">PNG, JPG (Max 2MB)</span>
                        `}
                    </div>
                    <input type="file" id="wz-logo-input" class="hidden" accept="image/*" required onchange="window.TitikLokal.handleImageUpload(this, 'logo')">
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 8) {
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Banner Toko</h2>
                <p class="text-slate-500 text-sm mb-6">Gambar latar belakang yang menarik untuk header halaman profil toko Anda (Rasio 2:1).</p>
                <div class="card card-p">
                    <div class="upload-zone flex flex-col items-center aspect-video justify-center" onclick="document.getElementById('wz-banner-input').click()">
                        ${sellerWizardData.banner ? `
                            <img src="${sellerWizardData.banner}" class="w-full h-full object-cover rounded-xl shadow-sm mb-3">
                            <span class="text-sm font-bold text-primary-600 mt-2">Ganti Banner</span>
                        ` : `
                            <div class="w-16 h-16 bg-cyan-50 text-secondary-500 rounded-full flex items-center justify-center mb-3">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            </div>
                            <span class="text-sm font-bold text-slate-700">Tap untuk upload banner</span>
                            <span class="text-xs text-slate-400 mt-1">Gunakan gambar produk terbaik Anda</span>
                        `}
                    </div>
                    <input type="file" id="wz-banner-input" class="hidden" accept="image/*" required onchange="window.TitikLokal.handleImageUpload(this, 'banner')">
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 9) {
        const banks = await api.getBanks();
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Rekening Pencairan</h2>
                <p class="text-slate-500 text-sm mb-6">Kemana kami harus mentransfer penghasilan Anda?</p>
                <div class="card card-p space-y-4">
                    <div class="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs font-semibold mb-4 border border-blue-100 flex gap-2">
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Pastikan nama pemilik rekening sesuai dengan KTP yang didaftarkan.
                    </div>
                    <div>
                        <label class="form-label">Pilih Bank</label>
                        <select id="wz-bank-name" class="form-input" required>
                            <option value="">Pilih Bank...</option>
                            ${banks.map(b => `<option value="${b.name}" ${sellerWizardData.bank.bank === b.name ? 'selected' : ''}>${b.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">Nomor Rekening</label>
                        <input type="text" id="wz-bank-acc" class="form-input" required value="${sellerWizardData.bank.accountNumber || ''}" pattern="[0-9]+">
                    </div>
                    <div>
                        <label class="form-label">Nama Pemilik Rekening</label>
                        <input type="text" id="wz-bank-owner" class="form-input" required value="${sellerWizardData.bank.accountName || sellerWizardData.owner.name || ''}">
                    </div>
                </div>
            </div>
        `;
    }
    else if (currentSellerWizardStep === 10) {
        html += `
            <div class="wizard-step active">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Review & Konfirmasi</h2>
                <p class="text-slate-500 text-sm mb-6">Pastikan semua data sudah benar sebelum mengirimkan pendaftaran.</p>
                
                <div class="space-y-4 mb-6">
                    <div class="card overflow-hidden">
                        <div class="h-24 bg-slate-200 w-full relative">
                            ${sellerWizardData.banner ? `<img src="${sellerWizardData.banner}" class="w-full h-full object-cover">` : ''}
                        </div>
                        <div class="px-4 pb-4 relative -mt-8 flex gap-4 items-end">
                            ${sellerWizardData.logo ? `<img src="${sellerWizardData.logo}" class="w-16 h-16 rounded-xl object-cover shadow-sm border-2 border-surface bg-surface">` : `<div class="w-16 h-16 bg-slate-100 rounded-xl border-2 border-surface"></div>`}
                            <div class="pb-1">
                                <h4 class="font-bold text-lg text-slate-800 leading-tight">${sellerWizardData.shop.name}</h4>
                                <div class="text-xs font-semibold text-primary-600">${sellerWizardData.shop.category}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card p-5 space-y-3 text-sm">
                        <div class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">Pemilik</span>
                            <span class="font-bold text-slate-800 text-right">${sellerWizardData.owner.name}</span>
                        </div>
                        <div class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">Kontak</span>
                            <span class="font-bold text-slate-800 text-right">${sellerWizardData.owner.phone}</span>
                        </div>
                        <div class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">Kota</span>
                            <span class="font-bold text-slate-800 text-right">${sellerWizardData.location.city}</span>
                        </div>
                        <div class="flex justify-between border-b border-slate-50 pb-2">
                            <span class="text-slate-500">Bank Pencairan</span>
                            <span class="font-bold text-slate-800 text-right">${sellerWizardData.bank.bank}</span>
                        </div>
                    </div>
                </div>
                
                <label class="flex items-start gap-3 cursor-pointer p-4 bg-primary-50 rounded-xl border border-primary-100 mb-6">
                    <input type="checkbox" required class="mt-1 w-4 h-4 text-primary-600 rounded">
                    <span class="text-xs text-primary-900 font-medium leading-relaxed">
                        Saya menyatakan bahwa seluruh data yang dimasukkan adalah benar, dan saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi TitikLokal.
                    </span>
                </label>
            </div>
        `;
    }

    // Success Screen override
    if (currentSellerWizardStep > 10) {
        html = `
            <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-slide-up">
                <div class="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 relative">
                    <svg class="w-12 h-12 checkmark-circle" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-3xl font-bold text-slate-800 mb-2">Selamat!</h2>
                <p class="text-slate-500 mb-8 max-w-sm leading-relaxed">Toko <strong>${sellerWizardData.shop.name}</strong> berhasil dibuat dan sudah aktif. Mulai tambahkan produk pertama Anda sekarang!</p>
                <button type="button" class="btn-primary w-full max-w-xs shadow-primary" onclick="window.TitikLokal.finishWizard()">
                    Masuk ke Dashboard
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
            </div>
        `;
        container.innerHTML = html;
        return;
    }

    // Footer actions
    html += `
            <div class="fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-100 p-4 pb-safe z-40">
                <div class="max-w-2xl mx-auto flex justify-between gap-4">
                    ${currentSellerWizardStep > 1 ? `
                        <button type="button" class="btn-secondary w-1/3" onclick="window.TitikLokal.wizardPrev()">Kembali</button>
                    ` : `<div></div>`}
                    <button type="submit" class="btn-primary flex-1 shadow-sm" id="btn-wz-next">
                        ${currentSellerWizardStep === 10 ? 'Kirim Pendaftaran' : 'Selanjutnya'}
                    </button>
                </div>
            </div>
        </form></div></div>
    `;
    
    container.innerHTML = html;
};

window.TitikLokal.wizardNext = async () => {
    // Save current step data
    if (currentSellerWizardStep === 1) {
        sellerWizardData.owner = {
            name: document.getElementById('wz-name').value,
            nik: document.getElementById('wz-nik').value,
            email: document.getElementById('wz-email').value,
            phone: document.getElementById('wz-phone').value,
        };
        sellerWizardData.password = document.getElementById('wz-pass').value;
    } 
    else if (currentSellerWizardStep === 2) {
        sellerWizardData.shop = {
            name: document.getElementById('wz-shop-name').value,
            slogan: document.getElementById('wz-shop-slogan').value,
            description: document.getElementById('wz-shop-desc').value,
        };
    }
    else if (currentSellerWizardStep === 3) {
        const cat = document.querySelector('input[name="wz_cat"]:checked');
        if(!cat) return showToast('Pilih kategori', 'error');
        sellerWizardData.shop.category = cat.value;
    }
    else if (currentSellerWizardStep === 4) {
        sellerWizardData.location = {
            city: document.getElementById('wz-loc-city').value,
            zip: document.getElementById('wz-loc-zip').value,
            address: document.getElementById('wz-loc-addr').value,
        };
    }
    else if (currentSellerWizardStep === 6) {
        const days = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
        days.forEach(d => {
            const cb = document.querySelector(`.wz-day-cb[data-day="${d}"]`);
            const op = document.querySelector(`.wz-time-open[data-day="${d}"]`);
            const cl = document.querySelector(`.wz-time-close[data-day="${d}"]`);
            if(cb && op && cl) {
                sellerWizardData.hours[d] = { isOpen: cb.checked, open: op.value, close: cl.value };
            }
        });
    }
    else if (currentSellerWizardStep === 7) {
        if(!sellerWizardData.logo) return showToast('Silakan upload logo terlebih dahulu', 'error');
    }
    else if (currentSellerWizardStep === 8) {
        if(!sellerWizardData.banner) return showToast('Silakan upload banner terlebih dahulu', 'error');
    }
    else if (currentSellerWizardStep === 9) {
        sellerWizardData.bank = {
            bank: document.getElementById('wz-bank-name').value,
            accountNumber: document.getElementById('wz-bank-acc').value,
            accountName: document.getElementById('wz-bank-owner').value,
        };
    }
    else if (currentSellerWizardStep === 10) {
        const btn = document.getElementById('btn-wz-next');
        btn.innerHTML = `<span class="spinner"></span>`;
        btn.disabled = true;
        
        try {
            await api.registerSeller(sellerWizardData);
            // Move to success step 11
        } catch(e) {
            showToast(e.message, 'error');
            btn.innerHTML = 'Kirim Pendaftaran';
            btn.disabled = false;
            return;
        }
    }

    currentSellerWizardStep++;
    renderSellerWizard();
    window.scrollTo(0,0);
};

window.TitikLokal.wizardPrev = () => {
    if (currentSellerWizardStep > 1) {
        currentSellerWizardStep--;
        renderSellerWizard();
    } else {
        window.TitikLokal.showRoleSelection();
    }
};

window.TitikLokal.toggleWizardDay = (cb) => {
    const day = cb.getAttribute('data-day');
    const container = document.getElementById(`wz-time-${day}`);
    if (cb.checked) {
        container.classList.remove('opacity-30', 'pointer-events-none');
        container.classList.add('opacity-100');
    } else {
        container.classList.add('opacity-30', 'pointer-events-none');
        container.classList.remove('opacity-100');
    }
};

window.TitikLokal.handleImageUpload = (input, type) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if(type === 'logo') sellerWizardData.logo = e.target.result;
            if(type === 'banner') sellerWizardData.banner = e.target.result;
            renderSellerWizard();
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.TitikLokal.finishWizard = async () => {
    // Already logged in during step 10 API call
    const user = await api.getCurrentUser();
    window.TitikLokal.enterApp(user);
};
