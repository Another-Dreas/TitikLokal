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
