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
    // Ensure styles support full bleed
    container.className = "view-section hidden absolute inset-0 z-50 bg-surface lg:bg-slate-50 flex overflow-hidden";
    
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
