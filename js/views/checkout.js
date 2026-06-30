/**
 * TitikLokal - Checkout View Controller
 * Menangani tampilan Ringkasan Belanja dan Proses Order.
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { formatters } from '../utils/formatters.js';
import { checkoutService } from '../services/checkoutService.js';

window.TitikLokal = window.TitikLokal || {};

let currentCheckoutState = null;

export const initCheckout = async () => {
    const user = store.getState().currentUser;
    if (!user) return;

    const container = document.getElementById('view-checkout');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const cartItems = await api.getCart(user.id);
        if (cartItems.length === 0) {
            window.TitikLokal.router.navigate('view-cart');
            return;
        }

        // Initialize state for checkout
        const addresses = await api.getAddresses(user.id);
        const mainAddress = addresses.find(a => a.isMain) || addresses[0] || {
            id: 'addr_mock1',
            recipientName: user.name,
            recipientPhone: user.phone || '081234567890',
            details: 'Jl. Merdeka No. 123',
            subdistrict: 'Siantar Timur',
            district: 'Pematang Siantar',
            isMain: true
        };
        const subtotal = checkoutService.calculateSubtotal(cartItems);

        currentCheckoutState = {
            cartItems,
            selectedAddress: mainAddress,
            selectedMethod: { id: 'grab', name: 'GrabExpress', basePrice: 12000, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Grab_%28application%29_logo.svg' },
            selectedProvider: null,
            selectedDriver: null,
            selectedPayment: { id: 'bca', name: 'BCA Virtual Account', adminFee: 1000, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
            voucher: null,
            shippingFee: 12000,
            discount: 0
        };

        renderCheckout(container, currentCheckoutState);
    } catch (err) {
        console.error(err);
        window.TitikLokal.ui.showToast('Gagal memuat checkout', 'error');
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderCheckout = (container, state) => {
    const { cartItems, selectedAddress, selectedMethod, selectedPayment, voucher, shippingFee, discount } = state;
    const shop = cartItems[0].shop; // Assume single shop checkout for now
    const subtotal = checkoutService.calculateSubtotal(cartItems);
    const adminFee = selectedPayment.adminFee || 0;
    const grandTotal = checkoutService.calculateTotal({ subtotal, shippingFee, discount, adminFee });

    container.innerHTML = `
        <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 lg:py-6 flex items-center gap-4 w-full">
            <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h1 class="text-xl font-bold text-slate-800 tracking-tight">Pengiriman & Pembayaran</h1>
        </header>

        <div class="px-4 py-6 pb-40 max-w-2xl mx-auto space-y-4">
            
            <!-- Address Section -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-5 cursor-pointer hover:border-primary-300 transition-colors" onclick="window.TitikLokal.ui.showToast('Pilih Alamat - Segera Hadir', 'info')">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Alamat Pengiriman
                    </h3>
                    <span class="text-primary-600 text-xs font-bold">Ubah</span>
                </div>
                ${selectedAddress ? `
                    <p class="font-bold text-slate-800 text-sm">${selectedAddress.recipientName} <span class="font-normal text-slate-500">(${selectedAddress.recipientPhone})</span></p>
                    <p class="text-slate-500 text-xs mt-1 leading-relaxed">${selectedAddress.details}, ${selectedAddress.subdistrict}, ${selectedAddress.district}</p>
                ` : `
                    <p class="text-slate-500 text-sm">Belum ada alamat. Silakan tambah alamat baru.</p>
                `}
            </div>

            <!-- Order Items -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-5">
                <div class="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50">
                    <img src="${shop.logo}" class="w-6 h-6 rounded-full border border-slate-200">
                    <span class="font-bold text-slate-800 text-sm">${shop.name}</span>
                </div>
                <div class="space-y-4">
                    ${cartItems.map(item => `
                        <div class="flex gap-4">
                            <img src="${item.product.images?.[0]?.imgUrl || 'https://via.placeholder.com/150'}" class="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100">
                            <div class="flex-1">
                                <h4 class="font-bold text-slate-800 text-sm line-clamp-1 mb-1">${item.product.name}</h4>
                                <p class="text-xs text-slate-500 mb-1">${item.qty} Barang</p>
                                <div class="font-bold text-slate-800 text-sm">${formatters.currency(item.product.price)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Shipping Options -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-5 cursor-pointer hover:border-primary-300 transition-colors" onclick="window.TitikLokal.checkout.showCourierSelector()">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Pilih Pengiriman
                    </h3>
                    <span class="text-primary-600 text-xs font-bold">Ubah</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <img src="${selectedMethod.logo}" class="h-6 w-auto object-contain">
                        <div>
                            <h3 class="font-bold text-slate-800 text-sm mb-0.5">${selectedMethod.name}</h3>
                            <p class="text-slate-500 text-xs font-medium">${formatters.currency(shippingFee)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Options -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-5 cursor-pointer hover:border-primary-300 transition-colors" onclick="window.TitikLokal.checkout.showPaymentSelector()">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        Metode Pembayaran
                    </h3>
                    <span class="text-primary-600 text-xs font-bold">Ubah</span>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <img src="${selectedPayment.logo}" class="h-6 w-auto object-contain">
                        <div>
                            <h3 class="font-bold text-slate-800 text-sm mb-0.5">${selectedPayment.name}</h3>
                            <p class="text-slate-500 text-xs">Biaya Admin: ${formatters.currency(adminFee)}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Floating Checkout Bar -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:px-8 lg:py-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
            <div class="max-w-2xl mx-auto flex items-center justify-between">
                <div class="cursor-pointer" onclick="window.TitikLokal.checkout.showSummary()">
                    <p class="text-xs text-slate-500 font-medium mb-0.5 flex items-center gap-1">
                        Total Tagihan 
                        <svg class="w-3 h-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                    </p>
                    <p class="text-lg lg:text-xl font-bold text-primary-600">${formatters.currency(grandTotal)}</p>
                </div>
                <button class="btn-primary px-8 !py-3.5" onclick="window.TitikLokal.checkout.processOrder()">
                    Buat Pesanan
                </button>
            </div>
        </div>
    `;
};

window.TitikLokal.checkout = {
    showSummary: () => {
        if(!currentCheckoutState) return;
        const { cartItems, shippingFee, discount, selectedPayment } = currentCheckoutState;
        const subtotal = checkoutService.calculateSubtotal(cartItems);
        const adminFee = selectedPayment.adminFee || 0;
        const grandTotal = checkoutService.calculateTotal({ subtotal, shippingFee, discount, adminFee });

        const html = `
            <div class="space-y-3 text-sm">
                <div class="flex justify-between text-slate-600">
                    <span>Subtotal Produk</span>
                    <span class="font-medium text-slate-800">${formatters.currency(subtotal)}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                    <span>Ongkos Kirim</span>
                    <span class="font-medium text-slate-800">${formatters.currency(shippingFee)}</span>
                </div>
                ${discount > 0 ? `
                <div class="flex justify-between text-emerald-600">
                    <span>Diskon Voucher</span>
                    <span class="font-medium">- ${formatters.currency(discount)}</span>
                </div>
                ` : ''}
                <div class="flex justify-between text-slate-600">
                    <span>Biaya Layanan/Admin</span>
                    <span class="font-medium text-slate-800">${formatters.currency(adminFee)}</span>
                </div>
                <div class="border-t border-slate-100 pt-3 flex justify-between items-center mt-2">
                    <span class="font-bold text-slate-800">Total Pembayaran</span>
                    <span class="font-bold text-lg text-primary-600">${formatters.currency(grandTotal)}</span>
                </div>
            </div>
        `;
        window.TitikLokal.ui.showModal('Ringkasan Belanja', html);
    },

    showCourierSelector: () => {
        const couriers = [
            { id: 'grab', name: 'GrabExpress', price: 12000, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Grab_%28application%29_logo.svg' },
            { id: 'gojek', name: 'GoSend', price: 14000, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Gojek_logo_2019.svg' },
            { id: 'maxim', name: 'Maxim Delivery', price: 10000, logo: 'https://taximaxim.com/images/default_logo.png' },
            { id: 'indrive', name: 'inDrive Courier', price: 11000, logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/InDrive_Logo.svg/512px-InDrive_Logo.svg.png' }
        ];

        const html = `
            <div class="space-y-3">
                ${couriers.map(c => `
                    <div class="flex items-center justify-between p-4 rounded-xl border ${currentCheckoutState.selectedMethod.id === c.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-300'} cursor-pointer transition-colors" 
                         onclick="window.TitikLokal.checkout.setCourier('${c.id}', '${c.name}', ${c.price}, '${c.logo}')">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center p-2 shrink-0">
                                <img src="${c.logo}" class="max-w-full max-h-full object-contain">
                            </div>
                            <div>
                                <div class="font-bold text-slate-800 text-sm">${c.name}</div>
                                <div class="text-primary-600 font-bold mt-1">${formatters.currency(c.price)}</div>
                            </div>
                        </div>
                        ${currentCheckoutState.selectedMethod.id === c.id ? '<svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        window.TitikLokal.ui.showModal('Pilih Pengiriman', html);
    },

    setCourier: (id, name, price, logo) => {
        if (!currentCheckoutState) return;
        currentCheckoutState.selectedMethod = { id, name, basePrice: price, logo };
        currentCheckoutState.shippingFee = price;
        window.TitikLokal.ui.closeModal();
        renderCheckout(document.getElementById('view-checkout'), currentCheckoutState);
    },

    showPaymentSelector: () => {
        const payments = [
            { id: 'bca', name: 'BCA Virtual Account', adminFee: 1000, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
            { id: 'mandiri', name: 'Mandiri Virtual Account', adminFee: 1000, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
            { id: 'gopay', name: 'GoPay', adminFee: 1500, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
            { id: 'ovo', name: 'OVO', adminFee: 1500, logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
            { id: 'qris', name: 'QRIS', adminFee: 0, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' },
            { id: 'cod', name: 'Bayar di Tempat (COD)', adminFee: 2000, logo: 'https://cdn-icons-png.flaticon.com/512/2800/2800209.png' }
        ];

        const html = `
            <div class="space-y-3">
                ${payments.map(p => `
                    <div class="flex items-center justify-between p-4 rounded-xl border ${currentCheckoutState.selectedPayment.id === p.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-300'} cursor-pointer transition-colors" 
                         onclick="window.TitikLokal.checkout.setPayment('${p.id}', '${p.name}', ${p.adminFee}, '${p.logo}')">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center p-2 shrink-0">
                                <img src="${p.logo}" class="max-w-full max-h-full object-contain">
                            </div>
                            <div>
                                <div class="font-bold text-slate-800 text-sm">${p.name}</div>
                                <div class="text-slate-500 text-xs mt-1">Admin: ${formatters.currency(p.adminFee)}</div>
                            </div>
                        </div>
                        ${currentCheckoutState.selectedPayment.id === p.id ? '<svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
        window.TitikLokal.ui.showModal('Pilih Metode Pembayaran', html);
    },

    setPayment: (id, name, adminFee, logo) => {
        if (!currentCheckoutState) return;
        currentCheckoutState.selectedPayment = { id, name, adminFee, logo };
        window.TitikLokal.ui.closeModal();
        renderCheckout(document.getElementById('view-checkout'), currentCheckoutState);
    },

    processOrder: async () => {
        if(!currentCheckoutState) return;
        if(!currentCheckoutState.selectedAddress) {
            window.TitikLokal.ui.showToast('Silakan pilih alamat pengiriman', 'error');
            return;
        }

        store.dispatch('isLoading', true);
        try {
            const user = store.getState().currentUser;
            const newOrder = await checkoutService.processOrder(currentCheckoutState, user);
            
            window.TitikLokal.ui.showToast('Pesanan berhasil dibuat!', 'success');
            window.TitikLokal.router.navigate('view-orders');
            
        } catch (err) {
            console.error(err);
            window.TitikLokal.ui.showToast(err.message, 'error');
        } finally {
            store.dispatch('isLoading', false);
        }
    }
};

window.TitikLokal.initCheckout = initCheckout;
