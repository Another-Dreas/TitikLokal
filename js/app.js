/**
 * TitikLokal - Application Entry Point (App.js)
 */

import { store } from './core/store.js';
import { router } from './core/router.js';
import { api } from './core/api.js';
import { ui } from './components/ui-library.js';
import { layout } from './components/layout.js';
import { cards } from './components/cards.js';
import { formatters } from './utils/formatters.js';
import { mapService } from './services/mapService.js';
import { initBuyerHome, initExploreMap, initProfile, initOrders, initWishlist, initShopProfile, initNearbyUmkm } from './views/buyer.js';
import { initAuth } from './views/auth.js';
import { initSellerDashboard, initSellerProducts, initSellerOrders, initSellerChat, initSellerProfile } from './views/seller.js';
import { initCart } from './views/cart.js';
import { initCheckout } from './views/checkout.js';

window.TitikLokal = window.TitikLokal || {};

Object.assign(window.TitikLokal, {
    store, router, api, ui, layout, cards, mapService, formatters,
    initAuth, initBuyerHome, initExploreMap, initProfile,
    initOrders, initWishlist, initShopProfile, initCart, initCheckout, initNearbyUmkm,

    // Reset localStorage (untuk development)
    resetData: () => {
        localStorage.clear();
        window.location.reload();
    },

    // Update cart badge count
    updateCartBadge: async () => {
        const user = store.getState().currentUser;
        if (!user) return;
        const items = await api.getCart(user.id);
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.textContent = items.length;
            badge.classList.toggle('hidden', items.length === 0);
            badge.classList.toggle('flex', items.length > 0);
        }
    },

    openCart: () => {
        router.navigate('view-cart');
    },

    openMap: () => {
        router.navigate('view-explore-map');
        layout.renderBottomNav('explore', 'buyer');
    },

    openProfile: () => {
        router.navigate('view-profile');
        layout.renderBottomNav('profile', 'buyer');
    },

    openNotifications: () => {
        const user = store.getState().currentUser;
        if (!user) { ui.showToast('Silakan login terlebih dahulu', 'info'); return; }
        api.getNotifications(user.id).then(notifs => {
            const html = notifs.length === 0
                ? '<p class="text-slate-500 text-sm text-center py-8">Tidak ada notifikasi.</p>'
                : notifs.map(n => `
                    <div class="flex items-start gap-3 p-3 rounded-xl ${n.isRead ? '' : 'bg-blue-50'} cursor-pointer hover:bg-slate-50"
                         onclick="window.TitikLokal.api.markNotifRead('${n.id}')">
                        <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.type === 'promo' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </div>
                        <div>
                            <div class="font-bold text-sm text-slate-800">${n.title}</div>
                            <div class="text-xs text-slate-500 mt-0.5">${n.message}</div>
                        </div>
                    </div>`).join('');
            ui.showModal('Notifikasi', html);
        });
    },

    addToCart: async (productId) => {
        const user = store.getState().currentUser;
        if (!user) { ui.showToast('Silakan login terlebih dahulu', 'info'); return; }
        try {
            await api.addToCart(user.id, productId, 1);
            ui.showToast('Ditambahkan ke keranjang!', 'success');
            window.TitikLokal.updateCartBadge();
        } catch (e) {
            ui.showToast(e.message || 'Gagal menambah ke keranjang', 'error');
        }
    }
});

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const state = store.getState();
        if (state.currentUser) {
            const role = state.currentUser.role || state.currentRole;
            if (role === 'seller') {
                router.navigate('view-seller-dashboard');
                layout.renderBottomNav('dashboard', 'seller');
                layout.renderSidebar('seller', 'dashboard');
                initSellerDashboard();
            } else {
                router.navigate('view-buyer-home');
                layout.renderBottomNav('home', 'buyer');
                layout.renderSidebar('buyer', 'home');
                initBuyerHome();
            }
        } else {
            router.navigate('view-splash');
        }
    }, 1200);

    // Route observer - must subscribe to 'SET_VIEW' (the action type dispatched by store)
    store.subscribe('SET_VIEW', (state) => {
        const v = state.activeView;
        const payload = state.routePayload;

        if (v === 'view-buyer-home') {
            initBuyerHome();
            layout.renderBottomNav('home', 'buyer');
            layout.renderSidebar('buyer', 'home');
            window.TitikLokal.updateCartBadge();
        } else if (v === 'view-explore-map') {
            initExploreMap();
            layout.renderBottomNav('explore', 'buyer');
        } else if (v === 'view-profile') {
            initProfile();
            layout.renderBottomNav('profile', 'buyer');
        } else if (v === 'view-orders') {
            initOrders();
            layout.renderBottomNav('orders', 'buyer');
        } else if (v === 'view-wishlist') {
            initWishlist();
        } else if (v === 'view-cart') {
            initCart();
        } else if (v === 'view-checkout') {
            initCheckout();
        } else if (v === 'view-shop-profile') {
            if (payload) initShopProfile(payload);
        } else if (v === 'view-nearby-umkm') {
            initNearbyUmkm();
        } else if (v === 'view-seller-dashboard') {
            initSellerDashboard();
            layout.renderBottomNav('dashboard', 'seller');
            layout.renderSidebar('seller', 'dashboard');
        } else if (v === 'view-seller-products') {
            initSellerProducts();
            layout.renderBottomNav('products', 'seller');
            layout.renderSidebar('seller', 'products');
        } else if (v === 'view-seller-orders') {
            initSellerOrders();
            layout.renderBottomNav('orders', 'seller');
            layout.renderSidebar('seller', 'orders');
        } else if (v === 'view-seller-chat') {
            initSellerChat();
            layout.renderBottomNav('chat', 'seller');
            layout.renderSidebar('seller', 'chat');
        } else if (v === 'view-seller-profile') {
            initSellerProfile();
            layout.renderBottomNav('profile', 'seller');
            layout.renderSidebar('seller', 'profile');
        }
    });
});
