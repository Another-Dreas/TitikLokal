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
