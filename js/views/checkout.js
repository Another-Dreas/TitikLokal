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

        currentCheckoutState = {
            cartItems,
            selectedAddress: mainAddress,
            selectedMethod: { id: 'grab', name: 'GrabExpress', basePrice: 12000, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Grab_%28application%29_logo.svg' },
            selectedProvider: null,
            selectedDriver: null,
            selectedPayment: { id: 'bca', name: 'BCA Virtual Account', adminFee: 1000, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
            voucher: null,
            shippingFee: 12000,
            discount: 0,
            appFee: 1000
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
    const appFee = state.appFee || 1000;
    const grandTotal = checkoutService.calculateTotal({ subtotal, shippingFee, discount, adminFee, appFee });

    container.innerHTML = `
        <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 lg:py-6 flex items-center gap-4 w-full">
            <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </button>
            <h1 class="text-xl font-bold text-slate-800 tracking-tight">Pengiriman & Pembayaran</h1>
        </header>

        <div class="px-4 py-6 pb-36 max-w-2xl mx-auto space-y-4">
            
            <!-- Address Section -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-5 cursor-pointer hover:border-primary-300 transition-colors" onclick="window.TitikLokal.checkout.showAddressSelector()">
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
            
            <!-- Voucher Selection -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-4 cursor-pointer hover:border-primary-300 transition-colors flex items-center justify-between" onclick="window.TitikLokal.checkout.showVoucherSelector()">
                <div class="flex items-center gap-3">
                    <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    <div>
                        <h3 class="font-bold text-slate-800 text-sm">Makin hemat pakai promo</h3>
                        <p class="text-xs text-slate-500">${voucher ? voucher.name : 'Pilih voucher yang tersedia'}</p>
                    </div>
                </div>
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
        </div>

        <!-- Floating Checkout Bar (above bottom nav) -->
        <div class="fixed bottom-16 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30">
            <div class="max-w-2xl mx-auto flex items-center justify-between">
                <div class="cursor-pointer" onclick="window.TitikLokal.checkout.showSummary()">
                    <p class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        Total Tagihan 
                        <svg class="w-3 h-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                    </p>
                    <p class="text-base font-bold text-primary-600">${formatters.currency(grandTotal)}</p>
                </div>
                <button class="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm" onclick="window.TitikLokal.checkout.processOrder()">
                    Buat Pesanan
                </button>
            </div>
        </div>
    `;
};

window.TitikLokal.checkout = {
    showSummary: () => {
        if(!currentCheckoutState) return;
        const subtotal = checkoutService.calculateSubtotal(currentCheckoutState.cartItems);
        const { shippingFee, discount, voucher, appFee = 1000 } = currentCheckoutState;
        const adminFee = currentCheckoutState.selectedPayment.adminFee || 0;
        const grandTotal = checkoutService.calculateTotal({ subtotal, shippingFee, discount, adminFee, appFee });

        const html = `
            <div class="space-y-4">
                <div class="flex justify-between text-sm text-slate-600">
                    <span>Subtotal Produk</span>
                    <span class="font-medium text-slate-800">${formatters.currency(subtotal)}</span>
                </div>
                <div class="flex justify-between text-sm text-slate-600">
                    <span>Ongkos Kirim</span>
                    <span class="font-medium text-slate-800">${formatters.currency(shippingFee)}</span>
                </div>
                ${discount > 0 ? `
                <div class="flex justify-between text-sm text-emerald-600">
                    <span>Diskon Promo ${voucher?.name ? `(${voucher.name})` : ''}</span>
                    <span class="font-medium">- ${formatters.currency(discount)}</span>
                </div>
                ` : ''}
                <div class="flex justify-between text-sm text-slate-600">
                    <span>Biaya Layanan/Aplikasi</span>
                    <span class="font-medium text-slate-800">${formatters.currency(appFee)}</span>
                </div>
                <div class="flex justify-between text-sm text-slate-600">
                    <span>Biaya Penanganan (Admin)</span>
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

    showVoucherSelector: () => {
        if(!currentCheckoutState) return;
        
        const vouchers = [
            { id: 'v_ongkir', name: 'Gratis Ongkir Pengguna Baru', type: 'shipping', value: currentCheckoutState.shippingFee, desc: 'Potongan senilai ongkos kirim (Maks. Rp 20.000)' },
            { id: 'v_disc50', name: 'Diskon Spesial 50%', type: 'product', value: Math.min(checkoutService.calculateSubtotal(currentCheckoutState.cartItems) * 0.5, 20000), desc: 'Potongan 50% hingga Rp 20.000' }
        ];

        const html = `
            <div class="space-y-3">
                ${vouchers.map(v => `
                    <div class="flex items-center justify-between p-4 rounded-xl border ${currentCheckoutState.voucher?.id === v.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-300'} cursor-pointer transition-colors" 
                         onclick="window.TitikLokal.checkout.setVoucher('${v.id}', '${v.name}', ${v.value})">
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                            </div>
                            <div>
                                <div class="font-bold text-slate-800 text-sm mb-1">${v.name}</div>
                                <div class="text-xs text-slate-500">${v.desc}</div>
                            </div>
                        </div>
                        ${currentCheckoutState.voucher?.id === v.id ? '<svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' : ''}
                    </div>
                `).join('')}
                ${currentCheckoutState.voucher ? `
                    <div class="pt-2">
                        <button class="w-full py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" onclick="window.TitikLokal.checkout.setVoucher(null, null, 0)">
                            Hapus Penggunaan Voucher
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        window.TitikLokal.ui.showModal('Pilih Voucher', html);
    },

    setVoucher: (id, name, discountAmount) => {
        if (!currentCheckoutState) return;
        
        if (id) {
            currentCheckoutState.voucher = { id, name };
            currentCheckoutState.discount = discountAmount;
        } else {
            currentCheckoutState.voucher = null;
            currentCheckoutState.discount = 0;
        }
        
        window.TitikLokal.ui.hideModal();
        renderCheckout(document.getElementById('view-checkout'), currentCheckoutState);
    },

    showAddressSelector: async () => {
        const user = store.getState().currentUser;
        if (!user) return;
        
        // Mock addresses for the prototype if the user has none setup
        const addresses = await api.getAddresses(user.id);
        const mockAddresses = addresses.length > 0 ? addresses : [
            {
                id: 'addr_mock1',
                recipientName: user.name,
                recipientPhone: user.phone || '081234567890',
                details: 'Jl. Merdeka No. 123',
                subdistrict: 'Siantar Timur',
                district: 'Pematang Siantar',
                isMain: true
            },
            {
                id: 'addr_mock2',
                recipientName: user.name + ' (Kantor)',
                recipientPhone: user.phone || '081234567890',
                details: 'Jl. Sutomo No. 45, Gedung Plaza',
                subdistrict: 'Siantar Barat',
                district: 'Pematang Siantar',
                isMain: false
            }
        ];

        const html = `
            <div class="space-y-4">
                ${mockAddresses.map(addr => `
                    <div class="flex items-start gap-3 p-4 rounded-xl border ${currentCheckoutState.selectedAddress?.id === addr.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-300'} cursor-pointer transition-colors relative" 
                         onclick="window.TitikLokal.checkout.setAddress('${addr.id}', '${addr.recipientName}', '${addr.recipientPhone}', '${addr.details}', '${addr.subdistrict}', '${addr.district}')">
                        
                        <div class="mt-1">
                            ${currentCheckoutState.selectedAddress?.id === addr.id 
                                ? '<div class="w-5 h-5 rounded-full border-4 border-primary-500 bg-white"></div>' 
                                : '<div class="w-5 h-5 rounded-full border-2 border-slate-300"></div>'}
                        </div>
                        
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-bold text-slate-800">${addr.recipientName}</span>
                                ${addr.isMain ? '<span class="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md">Utama</span>' : ''}
                            </div>
                            <p class="text-sm text-slate-600 mb-1">${addr.recipientPhone}</p>
                            <p class="text-xs text-slate-500 leading-relaxed">${addr.details}, ${addr.subdistrict}, ${addr.district}</p>
                        </div>
                    </div>
                `).join('')}
                
                <button class="w-full mt-4 py-3 border-2 border-dashed border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center justify-center gap-2" onclick="window.TitikLokal.ui.showToast('Tambah alamat baru - Segera Hadir', 'info')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Alamat Baru
                </button>
            </div>
        `;
        window.TitikLokal.ui.showModal('Pilih Alamat Pengiriman', html);
    },

    setAddress: (id, name, phone, details, subdistrict, district) => {
        if (!currentCheckoutState) return;
        currentCheckoutState.selectedAddress = {
            id,
            recipientName: name,
            recipientPhone: phone,
            details,
            subdistrict,
            district,
            isMain: false // Doesn't matter for checkout state
        };
        window.TitikLokal.ui.hideModal();
        renderCheckout(document.getElementById('view-checkout'), currentCheckoutState);
    },

    showCourierSelector: () => {
        const couriers = [
            { id: 'grab', name: 'GrabExpress', price: 12000, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Grab_%28application%29_logo.svg' },
            { id: 'gojek', name: 'GoSend', price: 14000, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Gojek_logo_2019.svg' },
            { id: 'maxim', name: 'Maxim Delivery', price: 10000, logo: 'https://cdn-icons-png.flaticon.com/512/758/758099.png' },
            { id: 'indrive', name: 'inDrive Courier', price: 11000, logo: 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png' }
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
        window.TitikLokal.ui.hideModal();
        renderCheckout(document.getElementById('view-checkout'), currentCheckoutState);
    },

    showPaymentSelector: () => {
        const payments = [
            { id: 'bca', name: 'BCA Virtual Account', adminFee: 1000, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
            { id: 'mandiri', name: 'Mandiri Virtual Account', adminFee: 1000, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
            { id: 'gopay', name: 'GoPay', adminFee: 1500, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
            { id: 'ovo', name: 'OVO', adminFee: 1500, logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
            { id: 'qris', name: 'QRIS', adminFee: 0, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' },
            { id: 'cod', name: 'Bayar di Tempat (COD)', adminFee: 0, logo: 'https://cdn-icons-png.flaticon.com/512/2800/2800209.png' }
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
        window.TitikLokal.ui.hideModal();
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
            
            store.dispatch('isLoading', false);

            if (currentCheckoutState.selectedPayment.id === 'cod') {
                window.TitikLokal.ui.showToast('Pesanan berhasil dibuat!', 'success');
                window.TitikLokal.router.navigate('view-orders');
            } else {
                // Tampilkan halaman menunggu pembayaran
                const container = document.getElementById('view-checkout');
                const isQRIS = currentCheckoutState.selectedPayment.id === 'qris';
                
                const paymentDetailHtml = isQRIS ? `
                    <div class="flex justify-center p-4 bg-white rounded-xl border border-slate-100 mb-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" class="w-48 h-48 object-contain">
                    </div>
                    <p class="text-[10px] text-slate-500 mb-4">Scan QR Code di atas menggunakan aplikasi e-Wallet atau m-Banking Anda.</p>
                ` : `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                        <span class="text-sm font-bold text-slate-700 tracking-widest">8810 2341 9901</span>
                        <button class="text-primary-600 text-sm font-bold">Salin</button>
                    </div>
                `;

                container.innerHTML = `
                    <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                        <div class="w-16 h-16 mb-6 relative">
                            <div class="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                            <div class="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                        </div>
                        <h2 class="text-xl font-bold text-slate-800 mb-2">Menunggu Pembayaran</h2>
                        <p class="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Silakan selesaikan pembayaran menggunakan <b>${currentCheckoutState.selectedPayment.name}</b>.</p>
                        
                        <div class="bg-white p-6 rounded-2xl shadow-card w-full max-w-sm mb-6">
                            <p class="text-xs text-slate-500 mb-1">Total Tagihan</p>
                            <p class="text-3xl font-bold text-primary-600 mb-4">${formatters.currency(newOrder.grandTotal)}</p>
                            ${paymentDetailHtml}
                        </div>
                        
                        <p class="text-xs text-slate-400">Pembayaran akan dikonfirmasi otomatis dalam 5 detik (Simulasi)...</p>
                    </div>
                `;

                // Simulasi auto-redirect setelah 5 detik
                setTimeout(() => {
                    window.TitikLokal.ui.showToast('Pembayaran Berhasil!', 'success');
                    window.TitikLokal.router.navigate('view-orders');
                }, 5000);
            }
            
        } catch (err) {
            console.error(err);
            window.TitikLokal.ui.showToast(err.message, 'error');
            store.dispatch('isLoading', false);
        }
    }
};

window.TitikLokal.initCheckout = initCheckout;
