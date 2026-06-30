/**
 * TitikLokal - Utilities & Formatters
 * Kumpulan pure functions untuk memanipulasi string, angka, dan utilitas performa.
 */

export const formatters = {
    // ── CURRENCY & NUMBERS ──────────────────────────────────
    currency: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    number: (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    },

    // ── DATES ───────────────────────────────────────────────
    dateString: (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    },
    
    timeString: (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    // ── PERFORMANCE UTILS ───────────────────────────────────
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // ── GEOMETRY / LOGISTICS ────────────────────────────────
    // Haversine formula to calculate distance between two coordinates in km
    calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distance in km
        return parseFloat(d.toFixed(1));
    },

    // ── VALIDATORS ──────────────────────────────────────────
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.utils = formatters;
