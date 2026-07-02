/**
 * TitikLokal - Routing Layer
 * Bertanggung jawab untuk menyembunyikan/menampilkan View dan
 * mencegah akses tidak sah (Role Protection).
 */
import { store } from './store.js';

const routes = {
    // Public
    'view-splash': { auth: false },
    'view-auth-role': { auth: false },
    'view-login-buyer': { auth: false },
    'view-register-buyer': { auth: false },
    
    // Buyer
    'view-buyer-home': { auth: true, roles: ['buyer', 'guest'] },
    'view-explore-map': { auth: true, roles: ['buyer', 'guest'] },
    'view-shop-profile': { auth: true, roles: ['buyer', 'guest', 'seller'] },
    'view-auth': { auth: false },
    'view-wishlist': { auth: true, roles: ['buyer'] },
    'view-cart': { auth: true, roles: ['buyer'] },
    'view-checkout': { auth: true, roles: ['buyer'] },
    'view-profile': { auth: true, roles: ['buyer'] },
    'view-orders': { auth: true, roles: ['buyer'] },
    'view-tracking': { auth: true, roles: ['buyer'] },
    
    // Seller
    'view-seller-dashboard': { auth: true, roles: ['seller'] },
    'view-seller-products': { auth: true, roles: ['seller'] },
    'view-seller-orders': { auth: true, roles: ['seller'] },
    'view-seller-chat': { auth: true, roles: ['seller'] },
    'view-seller-profile': { auth: true, roles: ['seller'] },
};

let viewHistory = [];

export const router = {
    navigate: (viewId, payload = null) => {
        const route = routes[viewId];
        const state = store.getState();
        
        // Guard Clause
        if (route) {
            if (route.auth && !state.currentUser && !route.roles.includes('guest')) {
                console.warn(`[Router] Access Denied. Redirecting to auth.`);
                viewId = 'view-auth-role';
            }
            if (route.roles && state.currentUser && !route.roles.includes(state.currentRole)) {
                console.warn(`[Router] Role mismatch. User: ${state.currentRole}.`);
                return; // Silently deny or show toast
            }
        }

        // Hide all views
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.add('hidden');
        });

        // Show target view
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.remove('hidden');
            
            // Log history if not same
            if (viewHistory[viewHistory.length - 1] !== viewId) {
                viewHistory.push(viewId);
            }
            
            store.dispatch('SET_VIEW', { viewId, payload });
            
            // Custom payload hooks can be injected here
            if (payload && targetView.onNavigate) {
                targetView.onNavigate(payload);
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.error(`[Router] View ${viewId} not found in DOM.`);
        }
    },
    
    back: () => {
        if (viewHistory.length > 1) {
            viewHistory.pop(); // remove current
            const prev = viewHistory.pop(); // remove prev (to be added back by navigate)
            router.navigate(prev);
        } else {
            router.navigate('view-splash');
        }
    },
    
    getCurrentView: () => {
        return store.getState().activeView;
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.router = router;
