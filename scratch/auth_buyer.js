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
