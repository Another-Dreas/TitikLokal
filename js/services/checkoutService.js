/**
 * TitikLokal - Checkout Service (Business Logic Layer)
 * Menangani logika bisnis kompleks untuk proses checkout 15-langkah.
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { formatters } from '../utils/formatters.js';

export const checkoutService = {

    // Hitung subtotal dari item keranjang
    calculateSubtotal: (cartItems) => {
        return cartItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    },

    // Hitung ongkos kirim berdasarkan koordinat toko & alamat
    calculateShipping: async (shopCoords, destCoords, methodId, providerId = null) => {
        return api.calculateShipping(shopCoords, destCoords, methodId, providerId);
    },

    // Terapkan voucher dan kembalikan diskon final
    applyVoucher: async (code, subtotal) => {
        return api.validateVoucher(code, subtotal);
    },

    // Kalkulasi grand total lengkap
    calculateTotal: ({ subtotal, shippingFee, discount, adminFee = 2000 }) => {
        const total = subtotal + shippingFee - discount + adminFee;
        return Math.max(total, 0);
    },

    // Proses pembuatan pesanan (endpoint terakhir)
    processOrder: async (checkoutState, user) => {
        const { cartItems, selectedAddress, selectedMethod, selectedProvider, selectedDriver, selectedPayment, voucher, shippingFee, discount } = checkoutState;

        if (!selectedAddress) throw new Error('Pilih alamat pengiriman terlebih dahulu.');
        if (!selectedMethod) throw new Error('Pilih metode pengiriman terlebih dahulu.');
        if (!selectedPayment) throw new Error('Pilih metode pembayaran terlebih dahulu.');
        if (!cartItems || cartItems.length === 0) throw new Error('Keranjang belanja kosong.');

        const subtotal = checkoutService.calculateSubtotal(cartItems);
        const adminFee = selectedPayment.adminFee || 2000;
        const grandTotal = checkoutService.calculateTotal({ subtotal, shippingFee, discount, adminFee });

        const orderPayload = {
            buyerId: user.id,
            buyerName: user.name,
            shopId: cartItems[0].shopId,
            items: cartItems.map(i => ({ productId: i.productId, name: i.product.name, price: i.product.price, qty: i.qty, imgUrl: i.product.images?.[0]?.imgUrl })),
            addressId: selectedAddress.id,
            shippingAddress: `${selectedAddress.details}, ${selectedAddress.subdistrict}, ${selectedAddress.district}, ${selectedAddress.province} ${selectedAddress.postalCode}`,
            recipientName: selectedAddress.recipientName,
            recipientPhone: selectedAddress.recipientPhone,
            shippingMethodId: selectedMethod.id,
            shippingMethodName: selectedMethod.name,
            providerId: selectedProvider?.id || null,
            providerName: selectedProvider?.name || null,
            driverId: selectedDriver?.id || null,
            driverName: selectedDriver?.name || null,
            paymentMethodId: selectedPayment.id,
            paymentMethodName: selectedPayment.name,
            voucherId: voucher?.id || null,
            voucherCode: voucher?.code || null,
            subtotal, shippingFee, discount, adminFee, grandTotal
        };

        return api.createOrder(orderPayload);
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.checkoutService = checkoutService;
