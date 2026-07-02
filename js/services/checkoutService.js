/**
 * TitikLokal - Checkout Service (Business Logic Layer)
 *
 * ARSITEKTUR:
 *  - Hanya berisi kalkulasi dan penyusunan payload (Business Logic).
 *  - TIDAK mengakses localStorage secara langsung.
 *  - Semua akses data dilakukan melalui api.js (Repository Layer).
 *
 * KOMPATIBILITAS FIELD:
 *  - buyer.js membaca: order.shippingFee, order.adminFee, order.grandTotal,
 *    order.appFee, order.discount, order.voucherCode, order.statusHistory[].note
 *  - buyer.js membaca items sebagai FLAT: item.name, item.price, item.qty, item.imgUrl
 *  - api.js createOrder membaca: paymentMethodId, buyerId, shopId, items[].productId, items[].qty
 */

import { api } from '../core/api.js';

export const checkoutService = {

    // ═══════════════════════════════════════════════════════
    // SECTION 1: KALKULASI HARGA
    // ═══════════════════════════════════════════════════════

    /**
     * Menghitung subtotal dari semua item di keranjang.
     * @param {Array} cartItems - Array item dari api.getCart()
     * @returns {number}
     */
    calculateSubtotal(cartItems) {
        if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;
        return cartItems.reduce((total, item) => {
            const price = item.product?.price || 0;
            const qty = item.qty || 0;
            return total + (price * qty);
        }, 0);
    },

    /**
     * Menghitung nilai diskon berdasarkan voucher yang dipilih.
     * @param {number} subtotal
     * @param {Object|null} voucher - Voucher dari state checkout
     * @returns {number} Nilai potongan dalam Rupiah
     */
    calculateDiscount(subtotal, voucher) {
        if (!voucher) return 0;
        if (voucher.id === 'v_disc50') {
            // Diskon 50% dari subtotal, maksimal 20.000
            return Math.min(subtotal * 0.5, 20000);
        }
        if (voucher.id === 'v_ongkir') {
            // Gratis ongkir, nilai = shippingFee yang sudah disimpan di voucher.value
            return voucher.value || 0;
        }
        // Fallback untuk voucher dengan value eksplisit
        return voucher.value || 0;
    },

    /**
     * Mendapatkan harga ongkos kirim dari metode yang dipilih.
     * @param {Object} method - selectedMethod dari checkout state
     * @returns {number}
     */
    calculateShipping(method) {
        if (!method) return 0;
        return method.basePrice || method.price || 0;
    },

    /**
     * Mendapatkan biaya admin dari metode pembayaran yang dipilih.
     * COD dan QRIS tidak dikenakan biaya admin.
     * @param {Object} payment - selectedPayment dari checkout state
     * @returns {number}
     */
    calculateAdminFee(payment) {
        if (!payment) return 0;
        // COD tidak ada biaya admin
        if (payment.id === 'cod') return 0;
        return payment.adminFee || 0;
    },

    /**
     * Menghitung Grand Total dari semua komponen biaya.
     * Rumus: subtotal + shippingFee + adminFee + appFee - discount
     * @param {Object} params
     * @param {number} params.subtotal
     * @param {number} params.shippingFee
     * @param {number} params.discount
     * @param {number} params.adminFee
     * @param {number} params.appFee
     * @returns {number} Total akhir (minimum 0)
     */
    calculateTotal({ subtotal, shippingFee = 0, discount = 0, adminFee = 0, appFee = 0 }) {
        const total = subtotal + shippingFee + adminFee + appFee - discount;
        return Math.max(0, total);
    },


    // ═══════════════════════════════════════════════════════
    // SECTION 2: MENYUSUN PAYLOAD ORDER
    // ═══════════════════════════════════════════════════════

    /**
     * Membangun payload order yang kompatibel penuh dengan:
     *  - api.js (baca: paymentMethodId, buyerId, shopId, items[].productId)
     *  - buyer.js (baca: shippingFee, adminFee, grandTotal, items[].name/price/qty/imgUrl)
     *
     * @param {Object} checkoutState - State lengkap dari checkout.js
     * @param {Object} user - User yang sedang login
     * @returns {Object} Payload siap dikirim ke api.createOrder()
     */
    buildOrderPayload(checkoutState, user) {
        const {
            cartItems,
            selectedAddress,
            selectedMethod,
            selectedPayment,
            voucher,
            shippingFee,
            discount,
            appFee = 1000
        } = checkoutState;

        // Hitung semua komponen biaya
        const subtotal = this.calculateSubtotal(cartItems);
        const adminFee = this.calculateAdminFee(selectedPayment);
        const grandTotal = this.calculateTotal({ subtotal, shippingFee, discount, adminFee, appFee });

        // Dapatkan shopId dari item pertama
        const shopId = cartItems[0]?.shopId || cartItems[0]?.shop?.id || null;

        // Format items sebagai FLAT object (sesuai yang dibaca buyer.js)
        // buyer.js membaca: item.name, item.price, item.qty, item.imgUrl
        const items = cartItems.map(item => ({
            productId: item.productId || item.product?.id,
            name: item.product?.name || 'Produk',
            price: item.product?.price || 0,
            qty: item.qty || 1,
            imgUrl: item.product?.images?.[0]?.imgUrl || item.product?.image || null
        }));

        // Format alamat pengiriman lengkap
        const shippingAddress = selectedAddress
            ? `${selectedAddress.details}, ${selectedAddress.subdistrict}, ${selectedAddress.district}`
            : 'Alamat belum dipilih';

        return {
            // ── Identitas Buyer & Toko ──
            buyerId: user.id,
            buyerName: user.name,
            shopId: shopId,

            // ── Produk ── (FLAT, bukan nested di bawah product:{})
            items,

            // ── Alamat ──
            addressId: selectedAddress?.id || null,
            shippingAddress,
            recipientName: selectedAddress?.recipientName || user.name,
            recipientPhone: selectedAddress?.recipientPhone || '',

            // ── Pengiriman ──
            shippingMethodId: selectedMethod?.id || null,
            shippingMethodName: selectedMethod?.name || null,
            shippingFee,       // buyer.js membaca: order.shippingFee

            // ── Pembayaran ──
            paymentMethodId: selectedPayment?.id || null,     // WAJIB: api.js baca ini untuk cek COD
            paymentMethodName: selectedPayment?.name || null,

            // ── Voucher ──
            voucherId: voucher?.id || null,
            voucherCode: voucher?.code || voucher?.name || null,  // buyer.js membaca: order.voucherCode

            // ── Rincian Biaya ──
            subtotal,          // buyer.js membaca: order.subtotal
            discount,          // buyer.js membaca: order.discount
            adminFee,          // buyer.js membaca: order.adminFee
            appFee,            // buyer.js membaca: order.appFee
            grandTotal,        // buyer.js membaca: order.grandTotal
        };
    },


    // ═══════════════════════════════════════════════════════
    // SECTION 3: PROSES ORDER
    // ═══════════════════════════════════════════════════════

    /**
     * Memproses pesanan dari awal hingga akhir:
     * 1. Hitung subtotal & grand total
     * 2. Susun payload yang kompatibel
     * 3. Panggil api.createOrder() (Repository Layer)
     * 4. Kembalikan order yang berhasil dibuat
     *
     * @param {Object} checkoutState
     * @param {Object} user
     * @returns {Promise<Object>} Order yang baru dibuat
     */
    async processOrder(checkoutState, user) {
        // Validasi input
        if (!checkoutState.selectedAddress) {
            throw new Error('Pilih alamat pengiriman terlebih dahulu.');
        }
        if (!checkoutState.selectedMethod) {
            throw new Error('Pilih metode pengiriman terlebih dahulu.');
        }
        if (!checkoutState.selectedPayment) {
            throw new Error('Pilih metode pembayaran terlebih dahulu.');
        }
        if (!checkoutState.cartItems || checkoutState.cartItems.length === 0) {
            throw new Error('Keranjang belanja kosong.');
        }

        // 1 & 2: Susun payload lengkap
        const payload = this.buildOrderPayload(checkoutState, user);

        // 3: Serahkan ke Repository Layer (api.js)
        const createdOrder = await api.createOrder(payload);

        // 4: Kembalikan order yang berhasil dibuat
        return createdOrder;
    },


    // ═══════════════════════════════════════════════════════
    // SECTION 4: GENERATOR & HELPER
    // ═══════════════════════════════════════════════════════

    /**
     * Menghasilkan nomor invoice unik.
     * Contoh: INV-TL-20250702-00123
     * @returns {string}
     */
    generateInvoiceNumber() {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const seq = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
        return `INV-TL-${yyyy}${mm}${dd}-${seq}`;
    },

    /**
     * Menghasilkan nomor resi pengiriman unik.
     * Contoh: TL260702123456
     * @returns {string}
     */
    generateTrackingNumber() {
        const date = new Date();
        const yy = String(date.getFullYear()).slice(-2);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const seq = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        return `TL${yy}${mm}${dd}${seq}`;
    },

    /**
     * Menghasilkan data driver kurir secara acak (simulasi).
     * @returns {Object}
     */
    generateRandomDriver() {
        const driverPool = [
            { name: 'Budi Santoso', phone: '0812-3456-7890', vehicle: 'Honda Vario 125', plateNumber: 'BK 1234 AB' },
            { name: 'Andi Setiawan', phone: '0813-9876-5432', vehicle: 'Yamaha NMAX 155', plateNumber: 'BK 5678 CD' },
            { name: 'Rizky Pratama', phone: '0857-1111-2222', vehicle: 'Honda Beat Street', plateNumber: 'BK 9012 EF' },
            { name: 'Dedi Kurniawan', phone: '0821-3333-4444', vehicle: 'Yamaha Aerox', plateNumber: 'BK 3456 GH' }
        ];
        const chosen = driverPool[Math.floor(Math.random() * driverPool.length)];
        return {
            id: `drv_${Date.now()}`,
            photo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            ...chosen
        };
    },

    /**
     * Menghitung estimasi waktu kedatangan.
     * Default: 30 menit dari sekarang.
     * @param {number} minutesFromNow
     * @returns {string} ISO string
     */
    estimateArrival(minutesFromNow = 30) {
        const eta = new Date();
        eta.setMinutes(eta.getMinutes() + minutesFromNow);
        return eta.toISOString();
    },


    // ═══════════════════════════════════════════════════════
    // SECTION 5: MANAJEMEN LIFECYCLE ORDER
    // ═══════════════════════════════════════════════════════

    /**
     * Membatalkan pesanan. Meneruskan ke Repository Layer.
     * @param {string} orderId
     * @param {string} reason
     */
    async cancelOrder(orderId, reason = 'Dibatalkan oleh pembeli.') {
        return await api.updateOrderStatus(orderId, 'DIBATALKAN', reason);
    },

    /**
     * Menyelesaikan pesanan (konfirmasi penerimaan oleh pembeli).
     * @param {string} orderId
     */
    async completeOrder(orderId) {
        return await api.updateOrderStatus(orderId, 'SELESAI', 'Pesanan telah diterima pembeli.');
    },

    /**
     * Mendapatkan progress/detail terbaru sebuah order.
     * @param {string} orderId
     */
    async getOrderProgress(orderId) {
        return await api.getOrder ? api.getOrder(orderId) : null;
    },


    // ═══════════════════════════════════════════════════════
    // SECTION 6: SIMULASI TRACKING KURIR (MATH LAYER)
    // ═══════════════════════════════════════════════════════

    /**
     * Membuat data tracking awal untuk sebuah order.
     * @param {string} orderId
     * @param {Array} origin [lat, lng] - Koordinat toko
     * @param {Array} destination [lat, lng] - Koordinat tujuan
     * @returns {Object} trackingData
     */
    createTrackingData(orderId, origin, destination) {
        const driver = this.generateRandomDriver();
        return {
            orderId,
            driver,
            origin: { lat: origin[0], lng: origin[1] },
            destination: { lat: destination[0], lng: destination[1] },
            currentLocation: { lat: origin[0], lng: origin[1] },
            speed: 40,      // km/h simulasi
            heading: 0,
            eta: this.estimateArrival(30),
            distanceRemaining: this.calculateRemainingDistance(
                { lat: origin[0], lng: origin[1] },
                { lat: destination[0], lng: destination[1] }
            ),
            route: [
                { lat: origin[0], lng: origin[1] },
                { lat: destination[0], lng: destination[1] }
            ]
        };
    },

    /**
     * Interpolasi posisi antara dua titik berdasarkan persentase kemajuan.
     * Digunakan oleh mapService untuk menggerakkan marker.
     * @param {Object} start {lat, lng}
     * @param {Object} end {lat, lng}
     * @param {number} progress 0.0 sampai 1.0
     * @returns {Object} {lat, lng}
     */
    interpolateLocation(start, end, progress) {
        return {
            lat: start.lat + (end.lat - start.lat) * progress,
            lng: start.lng + (end.lng - start.lng) * progress
        };
    },

    /**
     * Menghitung sisa jarak antara dua titik GPS menggunakan formula Haversine.
     * @param {Object} current {lat, lng}
     * @param {Object} destination {lat, lng}
     * @returns {number} Jarak dalam kilometer
     */
    calculateRemainingDistance(current, destination) {
        const R = 6371; // Radius bumi dalam km
        const dLat = (destination.lat - current.lat) * (Math.PI / 180);
        const dLng = (destination.lng - current.lng) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(current.lat * (Math.PI / 180)) * Math.cos(destination.lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    /**
     * Menghitung ETA (Estimated Time of Arrival) dalam menit.
     * @param {number} distanceKm - Sisa jarak dalam km
     * @param {number} speedKmH - Kecepatan dalam km/jam
     * @returns {number} Menit tersisa
     */
    calculateETA(distanceKm, speedKmH = 40) {
        if (speedKmH <= 0) return 0;
        return Math.ceil((distanceKm / speedKmH) * 60);
    },

    /**
     * Mensimulasikan pergerakan kurir dari origin ke destination.
     * Memanggil onUpdate setiap beberapa detik, dan onArrival saat tiba.
     *
     * @param {Object} trackingData - Data dari createTrackingData()
     * @param {Function} onUpdate - Callback dipanggil setiap update posisi: (trackingData) => void
     * @param {Function} onArrival - Callback dipanggil saat driver tiba: (trackingData) => void
     * @param {number} totalDurationMs - Total durasi animasi (default 30 detik)
     * @param {number} intervalMs - Interval update (default 1 detik)
     * @returns {number} intervalId (bisa di-clearInterval jika diperlukan)
     */
    simulateCourierMovement(trackingData, onUpdate, onArrival, totalDurationMs = 30000, intervalMs = 1000) {
        const totalSteps = totalDurationMs / intervalMs;
        let currentStep = 0;

        const intervalId = setInterval(() => {
            currentStep++;
            const progress = Math.min(currentStep / totalSteps, 1);

            // Update posisi saat ini
            trackingData.currentLocation = this.interpolateLocation(
                trackingData.origin,
                trackingData.destination,
                progress
            );

            // Hitung sisa jarak
            trackingData.distanceRemaining = this.calculateRemainingDistance(
                trackingData.currentLocation,
                trackingData.destination
            );

            // Update ETA
            const etaMinutes = this.calculateETA(trackingData.distanceRemaining, trackingData.speed);
            const etaTime = new Date();
            etaTime.setMinutes(etaTime.getMinutes() + etaMinutes);
            trackingData.eta = etaTime.toISOString();

            // Panggil callback update
            if (typeof onUpdate === 'function') {
                onUpdate({ ...trackingData });
            }

            // Cek apakah sudah sampai tujuan
            if (progress >= 1) {
                clearInterval(intervalId);
                trackingData.currentLocation = { ...trackingData.destination };
                trackingData.distanceRemaining = 0;
                if (typeof onArrival === 'function') {
                    onArrival({ ...trackingData });
                }
            }
        }, intervalMs);

        return intervalId;
    }
};

// Expose ke window untuk akses dari HTML inline events
window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.checkoutService = checkoutService;