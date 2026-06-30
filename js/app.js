import { api } from './core/storage.js';
import { switchView, showToast, showModal, hideModal } from './components/ui.js';
import { renderBottomNav, renderSidebar } from './components/layout.js';
import { initBuyerHome, changeLocation, openMap, openShopProfile, addToCart, openCart, updateCartQty, removeCartItem, openCheckout, processCheckout, openOrders, initWishlist, toggleWishlist, initProfile, openNotifications } from './views/buyer.js';
import { initSellerDashboard } from './views/seller.js';
import { initAdminDashboard } from './views/admin.js';
import { initAuth } from './views/auth.js';
import { initialData } from './config/data.js';

// Global Event Bus for inline HTML handlers
window.TitikLokal = window.TitikLokal || {};
Object.assign(window.TitikLokal, {
    switchView,
    showToast,
    showModal,
    hideModal,
    changeLocation,
    openMap,
    openShopProfile,
    addToCart,
    openCart,
    updateCartQty,
    removeCartItem,
    openCheckout,
    processCheckout,
    openHome: async () => {
        await initBuyerHome();
        switchView('view-buyer-home');
        renderBottomNav('home', 'buyer');
        renderSidebar('buyer', 'home');
    },
    openWishlist: async () => {
        await initWishlist();
        switchView('view-wishlist');
        renderBottomNav('wishlist', 'buyer');
        renderSidebar('buyer', 'wishlist');
    },
    openOrdersTab: async () => {
        await openOrders();
        renderBottomNav('orders', 'buyer');
        renderSidebar('buyer', 'orders');
    },
    openProfile: async () => {
        await initProfile();
        switchView('view-profile');
        renderBottomNav('profile', 'buyer');
    },
    
    initAuth,
    toggleWishlist,
    openNotifications,
    doLogout: async () => {
        await api.logout();
        // Clear onboarding flag so next visit shows splash directly
        location.reload();
    },
    enterApp: async (user) => enterApp(user),
    // Utility: shows spinner on button for 300ms then runs callback
    simulateLoading: (btn, originalHTML, callback) => {
        if (!btn) { if (callback) callback(); return; }
        btn.disabled = true;
        const prev = btn.innerHTML;
        btn.style.opacity = '0.75';
        btn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
        setTimeout(() => {
            btn.disabled = false;
            btn.style.opacity = '';
            btn.innerHTML = originalHTML || prev;
            if (callback) callback();
        }, 300);
    }
});

const initApp = async () => {
    // Check session
    const user = await api.getCurrentUser();

    if (user) {
        enterApp(user);
    } else {
        initSplashFlow();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

const initSplashFlow = () => {
    if (!localStorage.getItem('titiklokal_onboarded')) {
        window.TitikLokal.initOnboarding();
    } else {
        switchView('view-splash');
    }
};

window.TitikLokal.showRoleSelection = (btn) => {
    if (btn) {
        window.TitikLokal.simulateLoading(btn, '<span class="relative z-10">Mulai Sekarang</span>', () => switchView('view-role-selection'));
    } else {
        switchView('view-role-selection');
    }
};




let currentOnboardingSlide = 0;
window.TitikLokal.initOnboarding = () => {
    switchView('view-onboarding');
    renderOnboarding();
};

const renderOnboarding = () => {
    const container = document.getElementById('view-onboarding');
    const slide = initialData.onboarding[currentOnboardingSlide];

    container.innerHTML = `
        <div class="flex-1 flex flex-col justify-end p-8 pb-12 relative onboarding-slide bg-gradient-to-br ${slide.gradient} animate-fade-in">
            <div class="absolute inset-0 bg-black/20"></div>
            
            <button class="absolute top-6 right-6 text-white/80 font-bold text-sm z-10 hover:text-white" onclick="window.TitikLokal.finishOnboarding()">Lewati</button>
            
            <div class="relative z-10 text-center text-white">
                <div class="mb-8 animate-float flex justify-center">${slide.image}</div>
                <h2 class="text-3xl font-bold mb-4 tracking-tight">${slide.title}</h2>
                <p class="text-white/80 leading-relaxed mb-10 max-w-xs mx-auto">${slide.subtitle}</p>
                
                <div class="flex justify-center gap-2 mb-10">
                    ${initialData.onboarding.map((_, i) => `
                        <div class="h-2 rounded-full transition-all duration-300 ${i === currentOnboardingSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'}"></div>
                    `).join('')}
                </div>
                
                <button class="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl shadow-xl hover:bg-slate-50 active:scale-95 transition-all" onclick="window.TitikLokal.nextOnboarding(this)">
                    ${currentOnboardingSlide === initialData.onboarding.length - 1 ? 'Mulai Eksplorasi' : 'Lanjut'}
                </button>
            </div>
        </div>
    `;
};

window.TitikLokal.nextOnboarding = (btn) => {
    const originalText = currentOnboardingSlide === initialData.onboarding.length - 1 ? 'Mulai Eksplorasi' : 'Lanjut';
    window.TitikLokal.simulateLoading(btn, originalText, () => {
        if (currentOnboardingSlide < initialData.onboarding.length - 1) {
            currentOnboardingSlide++;
            renderOnboarding();
        } else {
            window.TitikLokal.finishOnboarding();
        }
    });
};

window.TitikLokal.finishOnboarding = () => {
    localStorage.setItem('titiklokal_onboarded', 'true');
    switchView('view-splash');
};

window.TitikLokal.doLogout = async () => {
    await api.logout();
    location.reload();
};

export const enterApp = async (user) => {
    if (user.role === 'buyer') {
        renderBottomNav('home', 'buyer');
        renderSidebar('buyer', 'home');
        await initBuyerHome();
        await initWishlist();
        await initProfile();
        switchView('view-buyer-home');
    } else if (user.role === 'seller') {
        renderBottomNav('dashboard', 'seller');
        renderSidebar('seller', 'dashboard');
        initSellerDashboard();
        switchView('view-seller-dashboard');
    } else if (user.role === 'admin') {
        const nav = document.getElementById('bottom-nav');
        if (nav) nav.classList.add('hidden');
        initAdminDashboard();
        switchView('view-admin-dashboard');
    }
};

