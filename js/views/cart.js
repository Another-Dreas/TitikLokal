/**
 * TitikLokal - Cart View Controller
 * Menangani tampilan Keranjang Belanja.
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { formatters } from '../utils/formatters.js';

window.TitikLokal = window.TitikLokal || {};

export const initCart = async () => {
    const user = store.getState().currentUser;
    if (!user) return;

    const container = document.getElementById('view-cart');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const cartItems = await api.getCart(user.id);
        renderCart(container, cartItems, user.id);
    } catch (err) {
        console.error(err);
        window.TitikLokal.ui.showToast('Gagal memuat keranjang', 'error');
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderCart = (container, items, userId) => {
    if (items.length === 0) {
        container.innerHTML = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 lg:py-6 flex items-center gap-4 w-full">
                <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <h1 class="text-xl font-bold text-slate-800 tracking-tight">Keranjang Belanja</h1>
            </header>
            <div class="px-4 py-6">
                ${window.TitikLokal.ui.EmptyState('Keranjang Kosong', 'Yuk, cari produk UMKM incaranmu sekarang!')}
                <div class="text-center mt-4">
                    <button class="btn-primary" onclick="window.TitikLokal.router.navigate('view-buyer-home')">Belanja Sekarang</button>
                </div>
            </div>
        `;
        return;
    }

    // Group items by shop
    const grouped = items.reduce((acc, item) => {
        if (!acc[item.shopId]) {
            acc[item.shopId] = { shop: item.shop, items: [] };
        }
        acc[item.shopId].items.push(item);
        return acc;
    }, {});

    let subtotal = items.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    let html = `
        <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 lg:py-6 flex items-center gap-4 w-full">
            <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h1 class="text-xl font-bold text-slate-800 tracking-tight">Keranjang Belanja</h1>
        </header>

        <div class="px-4 py-6 pb-32 max-w-3xl mx-auto space-y-6">
    `;

    Object.values(grouped).forEach(group => {
        html += `
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-4 lg:p-6">
                <div class="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50">
                    <img src="${group.shop.logo}" class="w-8 h-8 rounded-full border border-slate-200">
                    <span class="font-bold text-slate-800 text-sm">${group.shop.name}</span>
                </div>
                <div class="space-y-4">
        `;

        group.items.forEach(item => {
            html += `
                    <div class="flex gap-4">
                        <img src="${item.product.images?.[0]?.imgUrl || 'https://via.placeholder.com/150'}" class="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0">
                        <div class="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm line-clamp-2">${item.product.name}</h4>
                                <div class="font-bold text-primary-600 text-sm mt-1">${formatters.currency(item.product.price)}</div>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <button class="text-slate-400 hover:text-error transition-colors" onclick="window.TitikLokal.cart.removeItem('${item.id}')">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                                <div class="flex items-center gap-3 border border-slate-200 rounded-lg p-1">
                                    <button class="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-md transition-colors" onclick="window.TitikLokal.cart.updateQty('${item.id}', ${item.qty - 1})">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                                    </button>
                                    <span class="text-sm font-semibold w-4 text-center">${item.qty}</span>
                                    <button class="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-md transition-colors" onclick="window.TitikLokal.cart.updateQty('${item.id}', ${item.qty + 1})">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += `</div>`; // End container

    // Floating Bottom Bar for Checkout
    html += `
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:px-8 lg:py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
            <div class="max-w-3xl mx-auto flex items-center justify-between">
                <div>
                    <p class="text-xs text-slate-500 font-medium mb-0.5">Subtotal Belanja</p>
                    <p class="text-lg lg:text-xl font-bold text-primary-600">${formatters.currency(subtotal)}</p>
                </div>
                <button class="btn-primary px-8 !py-3.5" onclick="window.TitikLokal.router.navigate('view-checkout')">
                    Checkout Sekarang
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;
};

window.TitikLokal.cart = {
    updateQty: async (cartItemId, qty) => {
        if (qty <= 0) return;
        store.dispatch('isLoading', true);
        await api.updateCartQty(cartItemId, qty);
        await initCart();
    },
    removeItem: async (cartItemId) => {
        store.dispatch('isLoading', true);
        await api.removeFromCart(cartItemId);
        await initCart();
    }
};

window.TitikLokal.initCart = initCart;
