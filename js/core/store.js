/**
 * TitikLokal - Global State Management (Zustand/Redux Pattern)
 * Mengatur seluruh Client State.
 */

const initialState = {
    currentUser: null,
    currentRole: null, // 'buyer', 'seller', 'guest'
    selectedShop: null,
    sellerShop: null,
    selectedProduct: null,
    cart: { items: [], shopId: null, subtotal: 0 },
    checkout: {
        addressId: null,
        providerId: null,
        driverId: null,
        paymentId: null,
        voucherId: null,
        shippingFee: 0,
        discount: 0,
        adminFee: 2000,
        grandTotal: 0
    },
    currentOrder: null,
    notifications: [],
    wishlist: [],
    following: [],
    chatRooms: [],
    theme: 'light',
    searchHistory: [],
    recentViewed: [],
    favoriteCategory: null,
    
    // UI States
    isLoading: false,
    activeView: 'view-splash',
    routePayload: null
};

let state = { ...initialState };
const listeners = {}; // { 'cart': [fn1, fn2], '*': [fn3] }

export const store = {
    getState: () => ({ ...state }),
    
    // Dipanggil untuk mengambil satu nilai spesifik
    get: (key) => state[key],

    // Memperbarui state parsial
    dispatch: (actionType, payload) => {
        console.log(`[Store] Dispatching: ${actionType}`, payload);
        
        switch (actionType) {
            case 'SET_USER':
                state.currentUser = payload;
                state.currentRole = payload?.role || 'guest';
                break;
            case 'LOGOUT':
                state = { ...initialState, theme: state.theme };
                break;
            case 'SET_VIEW':
                if (typeof payload === 'object' && payload.viewId) {
                    state.activeView = payload.viewId;
                    state.routePayload = payload.payload || null;
                } else {
                    state.activeView = payload;
                    state.routePayload = null;
                }
                break;
            case 'UPDATE_CART':
                state.cart = { ...state.cart, ...payload };
                break;
            case 'SET_CHECKOUT_STEP':
                state.checkout = { ...state.checkout, ...payload };
                break;
            case 'CLEAR_CHECKOUT':
                state.checkout = { ...initialState.checkout };
                break;
            case 'ADD_NOTIFICATION':
                state.notifications = [payload, ...state.notifications];
                break;
            case 'MARK_NOTIFICATIONS_READ':
                state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
                break;
            default:
                if (state.hasOwnProperty(actionType)) {
                    state[actionType] = payload;
                }
        }
        
        store.notify(actionType);
        store.notify('*'); // notify all
    },

    // UI dapat melakukan subcribe
    subscribe: (key, listener) => {
        if (!listeners[key]) listeners[key] = [];
        listeners[key].push(listener);
        return () => {
            listeners[key] = listeners[key].filter(l => l !== listener);
        };
    },

    notify: (key) => {
        if (listeners[key]) {
            listeners[key].forEach(listener => listener(state));
        }
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.store = store;
