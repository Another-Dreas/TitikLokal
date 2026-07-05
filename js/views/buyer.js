/**
 * TitikLokal - Buyer View Controller
 * Mengatur interaksi DOM untuk Dashboard Pembeli, Profil, dan Integrasi Peta.
 */

import { api } from '../core/api.js';
import { store } from '../core/store.js';
import { storage } from '../core/storage.js';
import { formatters } from '../utils/formatters.js';

window.TitikLokal = window.TitikLokal || {};

export const initBuyerHome = async () => {
    store.dispatch('isLoading', true);
    try {
        const user = store.getState().currentUser;
        if (user) {
            const nameEl = document.getElementById('buyer-name-desktop');
            const avatarElMobile = document.getElementById('buyer-avatar-desktop');
            const avatarElDesktop = document.getElementById('buyer-avatar-desktop-lg');
            if (nameEl) nameEl.innerText = user.name.split(' ')[0];
            if (avatarElMobile) avatarElMobile.innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover">`;
            if (avatarElDesktop) avatarElDesktop.innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover">`;
        }

        // Location texts
        const locEl = document.getElementById('current-location-text');
        if (locEl) locEl.innerText = 'Pematang Siantar';
        const nearbyLocEl = document.getElementById('nearby-location-text');
        if (nearbyLocEl) nearbyLocEl.innerText = 'Pematang Siantar';
        const souvenirLocEl = document.getElementById('souvenir-location-text');
        if (souvenirLocEl) souvenirLocEl.innerText = 'Pematang Siantar';

        // Fetch all data once
        const [shops, allProducts] = await Promise.all([
            api.getShops(),
            api.getAllProducts()
        ]);

        // Update UMKM count in header
        const umkmCountEl = document.getElementById('nearby-umkm-count-text');
        if (umkmCountEl) umkmCountEl.innerText = `${shops.length} UMKM di sekitar Anda`;

        // Render all sections concurrently
        await Promise.all([
            renderPromoBanner(),
            renderCategories(),
            renderNearbyUMKM(shops, allProducts),
            renderTopProducts(allProducts, shops),
            renderSouvenirs(allProducts, shops),
            renderLocalFood(allProducts, shops),
            renderLocalCrafts(allProducts, shops),
        ]);
    } catch (err) {
        console.error('[initBuyerHome] Error:', err);
    } finally {
        store.dispatch('isLoading', false);
    }
};

const renderCategories = async () => {
    const container = document.getElementById('category-container');
    if (!container) return;

    const categories = [
        {
            id: 'makanan', name: 'Makanan',
            color: 'bg-amber-50 text-amber-600', border: 'border-amber-200',
            gradient: 'from-amber-400 to-orange-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 3c-4.97 0-9 4.03-9 9v2h18v-2c0-4.97-4.03-9-9-9zm-9 13h18v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z"/>
            </svg>`
        },
        {
            id: 'minuman', name: 'Minuman',
            color: 'bg-sky-50 text-sky-600', border: 'border-sky-200',
            gradient: 'from-sky-400 to-cyan-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10 2v4m4-4v4M6 6h12l-1.5 13.5a2.5 2.5 0 01-2.5 2.5h-4a2.5 2.5 0 01-2.5-2.5L6 6z"/>
            </svg>`
        },
        {
            id: 'kue-snack', name: 'Kue & Snack',
            color: 'bg-pink-50 text-pink-600', border: 'border-pink-200',
            gradient: 'from-pink-400 to-rose-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 15a2 2 0 01-2 2H5a2 2 0 01-2-2v-1h18v1z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 14V9a3 3 0 013-3h12a3 3 0 013 3v5"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 6V5a4 4 0 018 0v1"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 17v3m5-3v3m5-3v3"/>
            </svg>`
        },
        {
            id: 'oleh-oleh', name: 'Oleh-oleh',
            color: 'bg-orange-50 text-orange-600', border: 'border-orange-200',
            gradient: 'from-orange-400 to-yellow-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 8h18v4H3z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8V4"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 4c0-1.5 1.5-2 3-2s3 .5 3 2c0 1-1.5 1.5-3 1.5S9 5 9 4z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 8v12"/>
            </svg>`
        },
        {
            id: 'fashion', name: 'Fashion',
            color: 'bg-rose-50 text-rose-600', border: 'border-rose-200',
            gradient: 'from-rose-400 to-pink-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M7 4h10l4 4-3 2v11a1 1 0 01-1 1H7a1 1 0 01-1-1V10L3 8l4-4z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10 4a2 2 0 104 0"/>
            </svg>`
        },
        {
            id: 'kecantikan', name: 'Kecantikan',
            color: 'bg-fuchsia-50 text-fuchsia-600', border: 'border-fuchsia-200',
            gradient: 'from-fuchsia-400 to-purple-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 11V5l3-3 3 3v6M7 11h10v10a2 2 0 01-2 2H9a2 2 0 01-2-2V11zm2 0v10m6-10v10"/>
            </svg>`
        },
        {
            id: 'kerajinan', name: 'Kerajinan',
            color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200',
            gradient: 'from-emerald-400 to-teal-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M14.121 14.121L19 19m-7-7l5.657-5.657M12 12l-5.657 5.657M12 12L6.343 6.343"/>
                <circle cx="5" cy="5" r="2" stroke="currentColor" stroke-width="1.75"/>
                <circle cx="19" cy="5" r="2" stroke="currentColor" stroke-width="1.75"/>
                <circle cx="5" cy="19" r="2" stroke="currentColor" stroke-width="1.75"/>
                <circle cx="19" cy="19" r="2" stroke="currentColor" stroke-width="1.75"/>
                <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="1.75"/>
            </svg>`
        },
        {
            id: 'jasa', name: 'Jasa',
            color: 'bg-violet-50 text-violet-600', border: 'border-violet-200',
            gradient: 'from-violet-400 to-indigo-400',
            icon: `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
            </svg>`
        },
    ];

    container.innerHTML = categories.map(cat => `
        <div class="snap-center shrink-0 flex flex-col items-center gap-2 cursor-pointer group" onclick="window.TitikLokal.ui.showToast('Kategori ${cat.name}', 'info')">
            <div class="w-16 h-16 rounded-2xl ${cat.color} border ${cat.border} flex items-center justify-center group-hover:-translate-y-1.5 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
                ${cat.icon}
            </div>
            <span class="text-[11px] font-semibold text-slate-600 text-center w-16 leading-tight group-hover:text-primary-600 transition-colors">${cat.name}</span>
        </div>
    `).join('');
};

// Souvenir shop IDs — toko yang menjual oleh-oleh khas daerah
const SOUVENIR_SHOP_IDS = ['toko_09'];
const FOOD_CATEGORY = 'cat_kuliner';
const CRAFT_CATEGORY = 'cat_kriya';
const USER_CITY = 'Pematang Siantar';

const renderNearbyUMKM = async (allShops, allProducts) => {
    const container = document.getElementById('nearby-umkm-container');
    if (!container) return;

    const userLat = 2.9641;
    const userLng = 99.0767;

    // Build product count map
    const productCountMap = {};
    allProducts.forEach(p => {
        productCountMap[p.shopId] = (productCountMap[p.shopId] || 0) + 1;
    });

    // Sort by distance
    const sorted = allShops
        .map(shop => ({
            shop,
            dist: formatters.calculateDistance(userLat, userLng, shop.coords[0], shop.coords[1])
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 8);

    let html = '';
    sorted.forEach(({ shop, dist }) => {
        html += window.TitikLokal.cards.StoreCard(shop, dist, productCountMap[shop.id] || 0, 'flex-none w-48 snap-center');
    });

    container.innerHTML = html || window.TitikLokal.ui.EmptyState('Belum ada UMKM di area ini.');
};

const renderTopProducts = async (allProducts, allShops) => {
    const container = document.getElementById('top-products-container');
    if (!container) return;

    const shopMap = {};
    allShops.forEach(s => { shopMap[s.id] = s; });

    const sorted = [...allProducts]
        .filter(p => p.status && p.stock > 0)
        .sort((a, b) => (b.rating * b.totalSold) - (a.rating * a.totalSold))
        .slice(0, 6);

    container.innerHTML = sorted
        .map(p => window.TitikLokal.cards.ProductCard(p, shopMap[p.shopId] || null, `window.TitikLokal.addToCart('${p.id}')`))
        .join('') || window.TitikLokal.ui.EmptyState('Belum ada produk terlaris.');
};

const renderSouvenirs = async (allProducts, allShops) => {
    const container = document.getElementById('souvenirs-container');
    if (!container) return;

    const shopMap = {};
    allShops.forEach(s => { shopMap[s.id] = s; });

    // Filter produk dari toko oleh-oleh + produk kuliner yang paling sering terjual
    const souvenir = [...allProducts]
        .filter(p => {
            const shop = shopMap[p.shopId];
            if (!shop) return false;
            const isSouvenirShop = SOUVENIR_SHOP_IDS.includes(p.shopId);
            const isFromCity = shop.address && shop.address.toLowerCase().includes('siantar');
            return (isSouvenirShop || isFromCity) && p.status && p.stock > 0;
        })
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 6);

    container.innerHTML = souvenir
        .map(p => window.TitikLokal.cards.ProductCard(p, shopMap[p.shopId] || null, `window.TitikLokal.addToCart('${p.id}')`))
        .join('') || window.TitikLokal.ui.EmptyState('Belum ada oleh-oleh.');
};

const renderLocalFood = async (allProducts, allShops) => {
    const container = document.getElementById('local-food-container');
    if (!container) return;

    const shopMap = {};
    allShops.forEach(s => { shopMap[s.id] = s; });

    const food = [...allProducts]
        .filter(p => p.categoryId === FOOD_CATEGORY && p.status && p.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    container.innerHTML = food
        .map(p => window.TitikLokal.cards.ProductCard(p, shopMap[p.shopId] || null, `window.TitikLokal.addToCart('${p.id}')`))
        .join('') || window.TitikLokal.ui.EmptyState('Belum ada makanan khas.');
};

const renderLocalCrafts = async (allProducts, allShops) => {
    const container = document.getElementById('local-crafts-container');
    if (!container) return;

    const shopMap = {};
    allShops.forEach(s => { shopMap[s.id] = s; });

    const crafts = [...allProducts]
        .filter(p => p.categoryId === CRAFT_CATEGORY && p.status && p.stock > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    container.innerHTML = crafts
        .map(p => window.TitikLokal.cards.ProductCard(p, shopMap[p.shopId] || null, `window.TitikLokal.addToCart('${p.id}')`))
        .join('') || window.TitikLokal.ui.EmptyState('Belum ada kerajinan lokal.');
};


const renderPromoBanner = () => {
    const container = document.getElementById('promo-banner-container');
    if (!container) return;

    const banners = [
        {
            title: 'Belanja Produk Lokal',
            subtitle: 'Dukung UMKM di kotamu, hemat lebih banyak!',
            badge: 'Produk Lokal',
            gradient: 'from-primary-900/90 via-primary-800/80 to-transparent',
            img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop'
        },
        {
            title: 'Festival UMKM 2025',
            subtitle: 'Ratusan UMKM, ribuan pilihan produk terbaik',
            badge: 'Festival',
            gradient: 'from-violet-900/90 via-purple-800/80 to-transparent',
            img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=300&fit=crop'
        },
        {
            title: 'Gratis Ongkir UMKM',
            subtitle: 'Nikmati gratis ongkir untuk pembelian pertama',
            badge: 'Gratis Ongkir',
            gradient: 'from-emerald-900/90 via-emerald-800/80 to-transparent',
            img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop'
        },
        {
            title: 'Diskon Oleh-Oleh Daerah',
            subtitle: 'Oleh-oleh khas Siantar diskon hingga 50%',
            badge: 'Diskon 50%',
            gradient: 'from-orange-900/90 via-amber-800/80 to-transparent',
            img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=300&fit=crop'
        }
    ];

    const slidesHtml = banners.map((b, i) => `
        <div class="promo-slide shrink-0 w-full relative rounded-2xl overflow-hidden cursor-pointer group" data-index="${i}">
            <img src="${b.img}" class="w-full h-36 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-r ${b.gradient}"></div>
            <div class="absolute inset-0 flex flex-col justify-center p-5 lg:p-8 z-10">
                <span class="inline-flex items-center bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-max mb-3 border border-white/30">${b.badge}</span>
                <h3 class="text-white font-bold text-xl lg:text-3xl leading-tight mb-1.5">${b.title}</h3>
                <p class="text-white/90 text-xs lg:text-sm hidden sm:block font-medium">${b.subtitle}</p>
            </div>
        </div>
    `).join('');

    const dotsHtml = banners.map((_, i) => `
        <button class="promo-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-primary-500 w-5' : 'bg-slate-300'}" data-dot="${i}"></button>
    `).join('');

    container.innerHTML = `
        <div class="relative select-none">
            <div id="promo-track" class="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl scroll-smooth">
                ${slidesHtml}
            </div>
            <div class="flex items-center justify-center gap-1.5 mt-3" id="promo-dots">
                ${dotsHtml}
            </div>
        </div>
    `;

    // Make each slide snap-aligned
    container.querySelectorAll('.promo-slide').forEach(slide => {
        slide.classList.add('snap-center');
    });

    // Auto-slide logic
    const track = container.querySelector('#promo-track');
    const dots = container.querySelectorAll('.promo-dot');
    let currentSlide = 0;
    let autoSlideTimer = null;

    const goToSlide = (index) => {
        const slides = track.querySelectorAll('.promo-slide');
        if (!slides[index]) return;
        currentSlide = index;
        track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        dots.forEach((d, i) => {
            d.classList.toggle('bg-primary-500', i === index);
            d.classList.toggle('w-5', i === index);
            d.classList.toggle('bg-slate-300', i !== index);
            d.classList.toggle('w-2', i !== index);
        });
    };

    const startAutoSlide = () => {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(() => {
            goToSlide((currentSlide + 1) % banners.length);
        }, 5000);
    };

    // Dot click
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); startAutoSlide(); });
    });

    // Pause on user interaction
    track.addEventListener('touchstart', () => clearInterval(autoSlideTimer), { passive: true });
    track.addEventListener('touchend', () => startAutoSlide(), { passive: true });

    // Sync dots on scroll
    track.addEventListener('scroll', () => {
        const slides = track.querySelectorAll('.promo-slide');
        let closest = 0;
        let minDiff = Infinity;
        slides.forEach((slide, i) => {
            const diff = Math.abs(slide.offsetLeft - track.scrollLeft);
            if (diff < minDiff) { minDiff = diff; closest = i; }
        });
        if (closest !== currentSlide) {
            currentSlide = closest;
            dots.forEach((d, i) => {
                d.classList.toggle('bg-primary-500', i === closest);
                d.classList.toggle('w-5', i === closest);
                d.classList.toggle('bg-slate-300', i !== closest);
                d.classList.toggle('w-2', i !== closest);
            });
        }
    }, { passive: true });

    startAutoSlide();
};



export const initExploreMap = () => {
    setTimeout(() => {
        window.TitikLokal.mapService.initMap('explore-map-container', 2.9641, 99.0767, 14);
        window.TitikLokal.mapService.loadShops(2.9641, 99.0767, 20);
        window.TitikLokal.mapService.addUserMarker(2.9641, 99.0767);
    }, 350);
};

export const initProfile = async () => {
    const user = store.getState().currentUser;
    const container = document.getElementById('view-profile');
    if (!container) return;

    // ── TAMPILAN TAMU (GUEST) ──────────────────────────────────
    if (!user || user.isGuest) {
        container.innerHTML = `
            <header class="bg-primary-600 text-white pt-8 pb-16 px-6 rounded-b-[40px] relative">
                <div class="absolute inset-0 bg-gradient-to-t from-primary-700 to-transparent rounded-b-[40px] z-0"></div>
                <div class="relative z-10 max-w-lg mx-auto">
                    <h1 class="text-2xl font-bold tracking-tight mb-6">Akun</h1>
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                            <svg class="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        </div>
                        <div>
                            <h2 class="font-bold text-xl">Mode Tamu</h2>
                            <p class="text-primary-100 text-sm opacity-90">Anda belum login</p>
                        </div>
                    </div>
                </div>
            </header>
            <div class="px-4 -mt-8 relative z-20 max-w-lg mx-auto space-y-4">
                <div class="bg-white rounded-2xl p-6 shadow-card border border-slate-100 text-center">
                    <div class="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </div>
                    <h3 class="font-bold text-slate-800 text-lg mb-2">Login untuk Akses Penuh</h3>
                    <p class="text-slate-500 text-sm mb-6 leading-relaxed">Login atau daftar untuk menikmati pengalaman belanja UMKM lokal secara penuh.</p>
                    <button onclick="window.TitikLokal.initAuth('buyer')" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl text-sm transition-all transform active:scale-[0.98]">
                        Login / Daftar Sekarang
                    </button>
                </div>
                
                <div class="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                    <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.router.navigate('view-orders')">
                        <div class="bg-blue-50 group-hover:bg-blue-100 p-2.5 rounded-xl text-blue-600 mr-4 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <div class="flex-1 font-semibold text-slate-700 text-sm">Pesanan Saya</div>
                        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                    
                    <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.router.navigate('view-wishlist'); window.TitikLokal.layout.renderBottomNav('wishlist','buyer')">
                        <div class="bg-red-50 group-hover:bg-red-100 p-2.5 rounded-xl text-red-600 mr-4 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        </div>
                        <div class="flex-1 font-semibold text-slate-700 text-sm">Wishlist Tersimpan</div>
                        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                    <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 group" onclick="window.TitikLokal.ui.showModal('Tentang Aplikasi', '<div class=&quot;text-center py-4&quot;><h4 class=&quot;font-bold text-slate-800 text-lg&quot;>TitikLokal</h4><p class=&quot;text-xs text-slate-500 mb-4&quot;>Versi 1.0.0</p><p class=&quot;text-sm text-slate-600&quot;>Didesain oleh <strong>Pratama</strong> untuk memajukan UMKM lokal.</p></div>')">
                        <div class="bg-amber-50 group-hover:bg-amber-100 p-2.5 rounded-xl text-amber-600 mr-4 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                        <div class="flex-1 font-semibold text-slate-700 text-sm">Tentang Aplikasi</div>
                        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </div>
                    <div class="flex items-center p-4 cursor-pointer hover:bg-slate-50 group" onclick="window.TitikLokal.ui.showModal('Pusat Bantuan', '<p class=&quot;text-sm text-slate-600&quot;>Butuh bantuan?<br><br><strong>WhatsApp:</strong> 0812-3456-7890<br><strong>Email:</strong> support@titiklokal.id</p>')">
                        <div class="bg-cyan-50 group-hover:bg-cyan-100 p-2.5 rounded-xl text-cyan-600 mr-4 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg></div>
                        <div class="flex-1 font-semibold text-slate-700 text-sm">Pusat Bantuan</div>
                        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </div>
                </div>

                <!-- Logout -->
                <button class="w-full mt-2 flex items-center justify-center gap-2 p-4 text-error bg-red-50 hover:bg-red-100 rounded-2xl font-bold transition-colors shadow-sm" onclick="window.TitikLokal.ui.confirmLogout()">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Keluar Akun
                </button>
            </div>
        `;
        return;
    }

    // ── TAMPILAN USER YANG SUDAH LOGIN ─────────────────────────

    container.innerHTML = `
        <header class="bg-primary-600 text-white pt-8 pb-16 px-6 lg:px-8 rounded-b-[40px] relative">
            <div class="absolute inset-0 bg-gradient-to-t from-primary-700 to-transparent rounded-b-[40px] z-0"></div>
            <div class="relative z-10 flex justify-between items-center mb-6 max-w-lg mx-auto">
                <h1 class="text-2xl font-bold tracking-tight">Akun Saya</h1>
                <button class="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl transition-colors" onclick="window.TitikLokal.ui.showToast('Pengaturan Segera Hadir', 'info')">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </div>
            <div class="relative z-10 flex items-center gap-4 max-w-lg mx-auto">
                <div class="relative">
                    <img src="${user.avatar}" class="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover bg-primary-100">
                    <div class="absolute -bottom-1 -right-1 bg-accent-500 text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-primary-700 shadow-sm cursor-pointer" onclick="window.TitikLokal.ui.showToast('Ganti Foto Profil', 'info')">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                </div>
                <div>
                    <h2 class="font-bold text-xl">${user.name}</h2>
                    <p class="text-primary-100 text-sm flex items-center gap-1 opacity-90">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z"></path></svg>
                        ${user.phone || 'Belum ada nomor HP'}
                    </p>
                </div>
            </div>
        </header>

        <div class="px-4 -mt-8 relative z-20 max-w-lg mx-auto space-y-4">
            <!-- Order Status Section -->
            <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-slate-800 text-sm">Pesanan Saya</h3>
                    <button class="text-xs text-primary-600 font-bold hover:text-primary-700" onclick="window.TitikLokal.router.navigate('view-orders')">Riwayat Lengkap</button>
                </div>
                <div class="flex justify-between items-start px-2">
                    <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="window.TitikLokal.router.navigate('view-orders')">
                        <div class="w-11 h-11 rounded-full bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-slate-600 group-hover:text-primary-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        <span class="text-[10px] font-medium text-slate-600 text-center">Belum<br>Bayar</span>
                    </div>
                    <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="window.TitikLokal.router.navigate('view-orders')">
                        <div class="w-11 h-11 rounded-full bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-slate-600 group-hover:text-primary-600 transition-colors relative">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                            <span class="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">1</span>
                        </div>
                        <span class="text-[10px] font-medium text-slate-600 text-center">Dikemas</span>
                    </div>
                    <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="window.TitikLokal.router.navigate('view-orders')">
                        <div class="w-11 h-11 rounded-full bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-slate-600 group-hover:text-primary-600 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        </div>
                        <span class="text-[10px] font-medium text-slate-600 text-center">Dikirim</span>
                    </div>
                    <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="window.TitikLokal.router.navigate('view-orders')">
                        <div class="w-11 h-11 rounded-full bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-slate-600 group-hover:text-primary-600 transition-colors relative">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                        </div>
                        <span class="text-[10px] font-medium text-slate-600 text-center">Beri<br>Ulasan</span>
                    </div>
                </div>
            </div>

            <!-- Menus -->
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.router.navigate('view-orders')">
                    <div class="bg-blue-50 group-hover:bg-blue-100 p-2.5 rounded-xl text-blue-600 mr-4 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Pesanan Saya</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.router.navigate('view-wishlist'); window.TitikLokal.layout.renderBottomNav('wishlist','buyer')">
                    <div class="bg-red-50 group-hover:bg-red-100 p-2.5 rounded-xl text-red-600 mr-4 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Wishlist Tersimpan</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.ui.showModal('Daftar Alamat', '<p class=&quot;text-sm text-slate-600&quot;>Belum ada alamat tersimpan. Silakan tambahkan alamat pengiriman Anda.</p>')">
                    <div class="bg-emerald-50 group-hover:bg-emerald-100 p-2.5 rounded-xl text-emerald-600 mr-4 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Daftar Alamat</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.ui.showModal('Pengaturan Akun', '<p class=&quot;text-sm text-slate-600&quot;>Ubah profil, kata sandi, dan notifikasi Anda di sini.</p>')">
                    <div class="bg-slate-100 group-hover:bg-slate-200 p-2.5 rounded-xl text-slate-600 mr-4 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Pengaturan Akun</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="flex items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.ui.showModal('Tentang Aplikasi', '<div class=&quot;text-center py-4&quot;><div class=&quot;w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3&quot;><svg class=&quot;w-8 h-8&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; viewBox=&quot;0 0 24 24&quot;><path stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; stroke-width=&quot;2&quot; d=&quot;M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z&quot;></path></svg></div><h4 class=&quot;font-bold text-slate-800 text-lg&quot;>TitikLokal</h4><p class=&quot;text-xs text-slate-500 mb-4&quot;>Versi 1.0.0</p><p class=&quot;text-sm text-slate-600&quot;>Didesain dan dikembangkan secara khusus oleh <strong>Pratama</strong> untuk memajukan jangkauan UMKM lokal secara modern dan efisien.</p></div>')">
                    <div class="bg-amber-50 group-hover:bg-amber-100 p-2.5 rounded-xl text-amber-600 mr-4 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Tentang Aplikasi</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                
                <div class="flex items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors group" onclick="window.TitikLokal.ui.showModal('Pusat Bantuan', '<p class=&quot;text-sm text-slate-600&quot;>Butuh bantuan? Tim support kami siap membantu.<br><br><strong>WhatsApp:</strong> 0812-3456-7890<br><strong>Email:</strong> support@titiklokal.id</p>')">
                    <div class="bg-cyan-50 group-hover:bg-cyan-100 p-2.5 rounded-xl text-cyan-600 mr-4 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <div class="flex-1 font-semibold text-slate-700 text-sm">Pusat Bantuan</div>
                    <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            </div>

            <!-- Logout -->
            <button class="w-full mt-2 flex items-center justify-center gap-2 p-4 text-error bg-red-50 hover:bg-red-100 rounded-2xl font-bold transition-colors shadow-sm" onclick="window.TitikLokal.ui.confirmLogout()">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Keluar Akun
            </button>
        </div>
    `;
};

export const initOrders = async () => {
    const user = store.getState().currentUser;
    if (!user) return;

    const container = document.getElementById('view-orders');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const [orders, cartItems] = await Promise.all([
            api.getOrders(user.id),
            api.getCart(user.id)
        ]);
        
        // Group cart items by shop
        const cartByShop = {};
        cartItems.forEach(item => {
            if (!cartByShop[item.shop.id]) {
                cartByShop[item.shop.id] = { shop: item.shop, items: [] };
            }
            cartByShop[item.shop.id].items.push(item);
        });
        
        const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
        const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
        
        // ── CART SECTION (Shopee-style inline cart) ──
        let cartHtml = '';
        if (cartItems.length > 0) {
            cartHtml = `
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
                            <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Keranjang (${totalItems} barang)
                        </h2>
                    </div>
                    <div class="space-y-3">
                        ${Object.values(cartByShop).map(group => `
                            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                                <div class="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                                    <img src="${group.shop.logo}" class="w-6 h-6 rounded-full border border-slate-200">
                                    <span class="font-bold text-slate-700 text-sm">${group.shop.name}</span>
                                </div>
                                <div class="divide-y divide-slate-50">
                                    ${group.items.map(item => `
                                        <div class="flex gap-3 p-4">
                                            <img src="${item.product.images?.[0]?.imgUrl || 'https://via.placeholder.com/100'}" class="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0">
                                            <div class="flex-1 min-w-0">
                                                <h4 class="font-semibold text-slate-800 text-sm line-clamp-1">${item.product.name}</h4>
                                                <div class="font-bold text-primary-600 text-sm mt-0.5">${formatters.currency(item.product.price)}</div>
                                                <div class="flex items-center justify-between mt-2">
                                                    <button class="text-slate-400 hover:text-red-500 transition-colors p-1" onclick="window.TitikLokal.ordersPage.removeItem('${item.id}')">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                    <div class="flex items-center gap-0 border border-slate-200 rounded-lg overflow-hidden">
                                                        <button class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors" onclick="window.TitikLokal.ordersPage.updateQty('${item.id}', ${item.qty - 1})">
                                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                                                        </button>
                                                        <span class="text-sm font-bold w-8 text-center text-slate-800">${item.qty}</span>
                                                        <button class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors" onclick="window.TitikLokal.ordersPage.updateQty('${item.id}', ${item.qty + 1})">
                                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // ── ORDER HISTORY SECTION ──
        let ordersHtml = '';
        if (orders.length > 0 || cartItems.length === 0) {
            ordersHtml = `
                <div>
                    <h2 class="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        Riwayat Pesanan
                    </h2>
                    ${orders.length === 0 ? window.TitikLokal.ui.EmptyState('Belum ada pesanan.', 'Mulai berbelanja dan dukung UMKM lokal di sekitarmu.') : 
                    `<div class="space-y-3">
                        ${orders.map(order => `
                            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 p-4 cursor-pointer hover:border-primary-300 transition-colors" onclick="window.TitikLokal.ordersPage.showOrderDetail('${order.id}')">
                                <div class="flex justify-between items-center mb-3">
                                    <span class="font-bold text-xs text-slate-500">${order.id}</span>
                                    <span class="text-xs font-semibold px-2 py-1 rounded-md 
                                        ${order.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700' : 
                                        order.status === 'DIKIRIM' ? 'bg-blue-100 text-blue-700' : 
                                        order.status === 'MENUNGGU_PEMBAYARAN' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}">
                                        ${order.status}
                                    </span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <img src="${order.items[0]?.imgUrl || 'https://via.placeholder.com/150'}" class="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0">
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-bold text-slate-800 text-sm line-clamp-1">${order.items[0]?.name || 'Produk'}</h4>
                                        <p class="text-xs text-slate-500">${order.items.length > 1 ? `+${order.items.length - 1} produk lainnya` : `${order.items[0]?.qty} barang`}</p>
                                    </div>
                                    <div class="text-right shrink-0">
                                        <div class="font-bold text-slate-800 text-sm">${formatters.currency(order.grandTotal)}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                    }
                </div>
            `;
        }
        
        // ── FLOATING CHECKOUT BAR (above bottom nav = bottom-16) ──
        let checkoutBar = '';
        if (cartItems.length > 0) {
            checkoutBar = `
                <div class="fixed bottom-16 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30">
                    <div class="max-w-2xl mx-auto flex items-center justify-between">
                        <div>
                            <p class="text-[11px] text-slate-400 font-medium">Total (${totalItems} barang)</p>
                            <p class="text-base font-bold text-primary-600">${formatters.currency(subtotal)}</p>
                        </div>
                        <button class="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm text-sm" onclick="window.TitikLokal.router.navigate('view-checkout')">
                            Checkout
                        </button>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 flex items-center gap-4 max-w-2xl mx-auto w-full">
                <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <h1 class="text-xl font-bold text-slate-800 tracking-tight">Pesanan Saya</h1>
            </header>
            
            <div class="px-4 py-4 max-w-2xl mx-auto ${cartItems.length > 0 ? 'pb-36' : 'pb-24'}">
                ${cartItems.length === 0 && orders.length === 0 ? window.TitikLokal.ui.EmptyState('Belum ada pesanan.', 'Mulai berbelanja dan dukung UMKM lokal di sekitarmu.') : cartHtml + ordersHtml}
            </div>
            ${checkoutBar}
        `;
    } catch (err) {
        console.error(err);
    } finally {
        store.dispatch('isLoading', false);
    }
};

// Cart controls for the Orders page (avoids duplicate with cart.js)
window.TitikLokal.ordersPage = {
    updateQty: async (cartItemId, qty) => {
        if (qty <= 0) {
            await api.removeFromCart(cartItemId);
        } else {
            await api.updateCartQty(cartItemId, qty);
        }
        await initOrders();
        window.TitikLokal.updateCartBadge?.();
    },
    removeItem: async (cartItemId) => {
        await api.removeFromCart(cartItemId);
        await initOrders();
        window.TitikLokal.updateCartBadge?.();
    },
    showOrderDetail: async (orderId) => {
        const order = storage.findOne('orders', o => o.id === orderId);
        if (!order) return;

        const shop = storage.findOne('shops', s => s.id === order.shopId);
        
        let mapHtml = '';
        if (order.status === 'DIKIRIM' || order.status === 'SELESAI') {
            mapHtml = `
                <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-4 mb-4">
                    <h3 class="font-bold text-slate-800 text-sm mb-3">Lacak Pengiriman</h3>
                    <div id="tracking-map-${order.id}" class="w-full h-48 rounded-xl bg-slate-100 z-10 overflow-hidden relative border border-slate-200">
                        ${order.status === 'SELESAI' ? '<div class="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center"><span class="font-bold text-emerald-600 bg-white px-4 py-2 rounded-full shadow-sm">Pesanan Tiba</span></div>' : ''}
                    </div>
                </div>
            `;
        }

        const html = `
            <div class="fixed inset-0 bg-slate-50 z-50 overflow-y-auto flex flex-col">
                <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-4 py-4 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <button onclick="document.getElementById('order-detail-modal-${order.id}').remove(); window.TitikLokal.initOrders();" class="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <h1 class="text-lg font-bold text-slate-800 tracking-tight">Detail Pesanan</h1>
                    </div>
                    <span class="text-xs font-semibold px-2 py-1 rounded-md 
                        ${order.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700' : 
                        order.status === 'DIKIRIM' ? 'bg-blue-100 text-blue-700' : 
                        order.status === 'MENUNGGU_PEMBAYARAN' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}">
                        ${order.status}
                    </span>
                </header>
                
                <div class="flex-1 p-4 max-w-2xl mx-auto w-full pb-24">
                    ${mapHtml}

                    <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-4 mb-4">
                        <h3 class="font-bold text-slate-800 text-sm mb-3">Informasi Pesanan</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-500">No. Pesanan</span>
                                <span class="font-medium text-slate-800">${order.id}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Waktu Pemesanan</span>
                                <span class="font-medium text-slate-800">${new Date(order.createdAt).toLocaleString('id-ID', { hour12: false })}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden mb-4">
                        <div class="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                            <img src="${shop?.logo || 'https://via.placeholder.com/50'}" class="w-6 h-6 rounded-full border border-slate-200">
                            <span class="font-bold text-slate-700 text-sm">${shop?.name || 'Toko UMKM'}</span>
                        </div>
                        <div class="divide-y divide-slate-50">
                            ${order.items.map(item => `
                                <div class="flex gap-3 p-4">
                                    <img src="${item.imgUrl || 'https://via.placeholder.com/100'}" class="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0">
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-semibold text-slate-800 text-sm line-clamp-2">${item.name}</h4>
                                        <p class="text-xs text-slate-500 mt-1">${item.qty} x ${window.TitikLokal.formatters.currency(item.price)}</p>
                                    </div>
                                    <div class="font-bold text-slate-800 text-sm">
                                        ${window.TitikLokal.formatters.currency(item.price * item.qty)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-4 mb-4">
                        <h3 class="font-bold text-slate-800 text-sm mb-3">Rincian Pembayaran</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-500">Subtotal Produk</span>
                                <span class="font-medium text-slate-800">${window.TitikLokal.formatters.currency(order.subtotal)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Ongkos Kirim</span>
                                <span class="font-medium text-slate-800">${window.TitikLokal.formatters.currency(order.shippingFee)}</span>
                            </div>
                            ${order.discount > 0 ? `
                            <div class="flex justify-between text-emerald-600">
                                <span>Diskon Promo ${order.voucherCode ? `(${order.voucherCode})` : ''}</span>
                                <span class="font-medium">- ${window.TitikLokal.formatters.currency(order.discount)}</span>
                            </div>
                            ` : ''}
                            <div class="flex justify-between">
                                <span class="text-slate-500">Biaya Layanan/Aplikasi</span>
                                <span class="font-medium text-slate-800">${window.TitikLokal.formatters.currency(order.appFee || 0)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Biaya Penanganan (Admin)</span>
                                <span class="font-medium text-slate-800">${window.TitikLokal.formatters.currency(order.adminFee || 0)}</span>
                            </div>
                            <div class="border-t border-slate-100 pt-3 flex justify-between items-center mt-2">
                                <span class="font-bold text-slate-800">Total Pembayaran</span>
                                <span class="font-bold text-lg text-primary-600">${window.TitikLokal.formatters.currency(order.grandTotal)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-2xl shadow-card border border-slate-100 p-4">
                        <h3 class="font-bold text-slate-800 text-sm mb-3">Riwayat Status</h3>
                        <div class="space-y-4">
                            ${[...order.statusHistory].reverse().map((h, i) => `
                                <div class="flex gap-4">
                                    <div class="flex flex-col items-center">
                                        <div class="w-3 h-3 rounded-full ${i === 0 ? 'bg-primary-500' : 'bg-slate-300'}"></div>
                                        ${i !== order.statusHistory.length - 1 ? '<div class="w-0.5 h-full bg-slate-200 my-1"></div>' : ''}
                                    </div>
                                    <div class="pb-2">
                                        <p class="font-bold text-slate-800 text-sm">${h.status}</p>
                                        <p class="text-xs text-slate-500 mt-0.5">${h.note || ''}</p>
                                        <p class="text-[10px] text-slate-400 mt-1">${new Date(h.time).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.id = `order-detail-modal-${order.id}`;
        modalContainer.innerHTML = html;
        document.body.appendChild(modalContainer);

        // Inisialisasi peta tracking jika status DIKIRIM
        if (order.status === 'DIKIRIM' && window.TitikLokal.mapService && shop) {
            // Kita butuh koordinat asal (toko) dan tujuan (pembeli)
            // Karena belum ada alamat fix untuk pembeli, kita mock lokasi pembeli sedikit bergeser dari toko
            const startCoords = shop.coords;
            const endCoords = [shop.coords[0] + 0.005, shop.coords[1] + 0.005]; 
            
            setTimeout(() => {
                window.TitikLokal.mapService.initTrackingMap(`tracking-map-${order.id}`, startCoords, endCoords, order.id);
            }, 300); // Wait for modal animation/render
        }
    }
};

export const initWishlist = async () => {
    const user = store.getState().currentUser;
    if (!user) return;

    const container = document.getElementById('view-wishlist');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const wishlist = await api.getWishlist(user.id);
        
        container.innerHTML = `
            <header class="bg-surface sticky top-0 z-30 border-b border-slate-100 px-6 py-4 lg:py-6 flex items-center gap-4 max-w-2xl mx-auto w-full">
                <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900 lg:hidden">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <h1 class="text-xl font-bold text-slate-800 tracking-tight">Wishlist Tersimpan</h1>
            </header>
            
            <div class="px-4 py-6 max-w-2xl mx-auto">
                ${wishlist.length === 0 ? window.TitikLokal.ui.EmptyState('Wishlist Kosong.', 'Cari dan simpan produk favoritmu untuk dibeli nanti.') : 
                `<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    ${wishlist.map(item => `
                        <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden group">
                            <div class="relative aspect-square overflow-hidden bg-slate-100">
                                <img src="${item.product.images?.[0]?.imgUrl || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                <button class="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm" onclick="window.TitikLokal.toggleWishlist('${item.productId}'); window.TitikLokal.initWishlist();">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </button>
                            </div>
                            <div class="p-3">
                                <h3 class="font-bold text-slate-800 text-sm line-clamp-2 mb-1">${item.product.name}</h3>
                                <div class="font-bold text-primary-600 mb-2">${formatters.currency(item.product.price)}</div>
                                <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl text-xs font-bold transition-colors" onclick="window.TitikLokal.addToCart('${item.productId}');">
                                    + Keranjang
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>`
                }
            </div>
        `;
    } catch (err) {
        console.error(err);
    } finally {
        store.dispatch('isLoading', false);
    }
};

export const initShopProfile = async (payload) => {
    const shopId = typeof payload === 'string' ? payload : payload?.shopId;
    if (!shopId) return;

    const container = document.getElementById('view-shop-profile');
    if (!container) return;

    store.dispatch('isLoading', true);
    try {
        const shop = await api.getShopById(shopId);
        const products = await api.getProductsByShop(shopId);
        const reviews = await api.getReviewsByShop(shopId);
        const user = store.getState().currentUser;

        container.innerHTML = `
            <header class="relative h-52 lg:h-72 bg-slate-200 shrink-0">
                <img src="${shop.coverImg}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <button onclick="window.TitikLokal.router.back()" class="absolute top-4 left-4 p-2.5 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40 transition-colors z-10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                <div class="absolute bottom-4 left-4 right-4 z-10 flex items-end gap-3">
                    <img src="${shop.logo}" class="w-16 h-16 rounded-2xl border-2 border-white bg-white shadow-sm object-cover shrink-0">
                    <div class="text-white">
                        <div class="font-bold text-xl flex items-center gap-2">
                            ${shop.name}
                            ${shop.verificationStatus === 'verified' ? '<svg class="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' : ''}
                        </div>
                        <div class="flex items-center gap-3 text-xs text-white/80 mt-0.5">
                            <span class="flex items-center gap-1"><svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> ${shop.rating}</span>
                            <span>${shop.totalReviews} Ulasan</span>
                            <span class="${shop.isOpen ? 'text-emerald-300' : 'text-red-300'} font-semibold">${shop.isOpen ? 'Buka' : 'Tutup'}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="max-w-4xl mx-auto px-4 lg:px-6 pb-24">
                <!-- Info Bar -->
                <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100 my-4 grid grid-cols-4 divide-x divide-slate-100 text-center">
                    <div class="px-2">
                        <div class="font-bold text-lg text-slate-800">${shop.totalSales}+</div>
                        <div class="text-[10px] text-slate-500 font-medium">Terjual</div>
                    </div>
                    <div class="px-2">
                        <div class="font-bold text-lg text-slate-800">${shop.totalReviews}</div>
                        <div class="text-[10px] text-slate-500 font-medium">Ulasan</div>
                    </div>
                    <div class="px-2">
                        <div class="font-bold text-lg text-emerald-600">${shop.chatResponseRate || 95}%</div>
                        <div class="text-[10px] text-slate-500 font-medium">Performa Balas</div>
                    </div>
                    <div class="px-1 flex flex-col justify-center">
                        <div class="font-bold text-[13px] text-slate-800 leading-tight">${shop.openHours}</div>
                        <div class="text-[10px] text-slate-500 font-medium mt-0.5">Jam Buka</div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3 mb-4">
                    <button class="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors" onclick="window.TitikLokal.ui.showToast('Toko berhasil diikuti', 'success')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Ikuti
                    </button>
                    <button class="flex-1 py-3 bg-primary-50 text-primary-600 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors border border-primary-100" onclick="window.TitikLokal.ui.showToast('Fitur Chat Toko akan segera hadir', 'info')">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        Chat Toko
                    </button>
                </div>

                <!-- Description -->
                <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100 mb-4">
                    <h3 class="font-bold text-slate-800 mb-2 text-sm">Tentang Toko</h3>
                    <p class="text-slate-600 text-sm leading-relaxed">${shop.description}</p>
                </div>

                <!-- Location -->
                <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100 mb-4">
                    <h3 class="font-bold text-slate-800 mb-2 text-sm">Lokasi</h3>
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-start gap-2 text-sm text-slate-600">
                            <svg class="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span>${shop.address}</span>
                        </div>
                        <a href="${shop.gmapsLink || `https://www.google.com/maps/search/${encodeURIComponent(shop.name)}/@${shop.coords[0]},${shop.coords[1]},15z`}" target="_blank" class="shrink-0 bg-primary-50 text-primary-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            Lihat di Maps
                        </a>
                    </div>
                </div>

                <!-- Products -->
                <h3 class="font-bold text-lg text-slate-800 mb-3 mt-6">Produk Tersedia</h3>
                ${products.length === 0 ? window.TitikLokal.ui.EmptyState('Belum ada produk') :
                `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    ${products.map(product => `
                        <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden group">
                            <div class="relative pt-[100%] bg-slate-50 overflow-hidden">
                                <img src="${product.images?.[0]?.imgUrl || 'https://via.placeholder.com/400'}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                                <button class="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm transition-colors ${user && window.TitikLokal.api.isWishlisted(user.id, product.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}" 
                                    onclick="window.TitikLokal.toggleWishlist('${product.id}').then(() => window.TitikLokal.ui.showToast('Wishlist diperbarui', 'success'))">
                                    <svg class="w-4 h-4" fill="${user && window.TitikLokal.api.isWishlisted(user.id, product.id) ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </button>
                                ${!product.status || product.stock < 1 ? '<div class="absolute inset-0 bg-white/70 flex items-center justify-center"><span class="bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold">Habis</span></div>' : ''}
                            </div>
                            <div class="p-3">
                                <h4 class="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">${product.name}</h4>
                                <div class="flex items-center gap-1 mb-2">
                                    <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    <span class="text-[10px] text-slate-500">${product.rating} (${product.reviews})</span>
                                </div>
                                <div class="font-bold text-primary-600 text-sm mb-2">${formatters.currency(product.price)}</div>
                                ${product.status && product.stock > 0 && user ? `
                                <button class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl text-xs font-bold transition-colors"
                                    onclick="window.TitikLokal.addToCart('${product.id}')">
                                    + Keranjang
                                </button>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>`}

                <!-- Reviews -->
                <h3 class="font-bold text-lg text-slate-800 mb-3 mt-6">Ulasan Pembeli (${reviews.length})</h3>
                ${reviews.length === 0 ? `<div class="text-slate-500 text-sm text-center py-8 bg-surface rounded-2xl border border-slate-100">Belum ada ulasan.</div>` :
                `<div class="space-y-4">
                    ${reviews.slice(0, 5).map(rev => `
                        <div class="bg-surface rounded-2xl p-4 shadow-card border border-slate-100">
                            <div class="flex items-center gap-3 mb-2">
                                <img src="${rev.user?.avatar || 'https://ui-avatars.com/api/?name=User'}" class="w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-200">
                                <div>
                                    <div class="font-bold text-sm text-slate-800">${rev.user?.name || 'Pengguna'}</div>
                                    <div class="flex items-center gap-0.5 mt-0.5">
                                        ${Array.from({length: 5}, (_, i) => `<svg class="w-3.5 h-3.5 ${i < rev.rating ? 'text-yellow-400' : 'text-slate-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`).join('')}
                                    </div>
                                </div>
                            </div>
                            <p class="text-sm text-slate-600 leading-relaxed">${rev.comment}</p>
                            ${rev.sellerReply ? `<div class="mt-3 bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border-l-2 border-primary-400"><span class="font-bold text-primary-600">Penjual:</span> ${rev.sellerReply}</div>` : ''}
                        </div>
                    `).join('')}
                </div>`}
            </div>
        `;
    } catch (err) {
        console.error(err);
        container.innerHTML = window.TitikLokal.ui.EmptyState('Toko tidak ditemukan.');
    } finally {
        store.dispatch('isLoading', false);
    }
};

export const initNearbyUmkm = async () => {
    store.dispatch('isLoading', true);
    try {
        const [shops, allProducts] = await Promise.all([
            api.getShops(),
            api.getAllProducts()
        ]);

        const container = document.getElementById('all-nearby-umkm-container');
        if (!container) return;

        const userLat = 2.9641;
        const userLng = 99.0767;

        const productCountMap = {};
        allProducts.forEach(p => {
            productCountMap[p.shopId] = (productCountMap[p.shopId] || 0) + 1;
        });

        const sorted = shops
            .map(shop => {
                let dist = formatters.calculateDistance(userLat, userLng, shop.coords[0], shop.coords[1]);
                if (dist < 0.1) dist = parseFloat((Math.random() * 2 + 0.5).toFixed(1)); 
                return { shop, dist };
            })
            .sort((a, b) => a.dist - b.dist);

        let html = '';
        sorted.forEach(({ shop, dist }) => {
            html += window.TitikLokal.cards.StoreCard(shop, dist, productCountMap[shop.id] || 0, 'w-full');
        });

        container.innerHTML = html || window.TitikLokal.ui.EmptyState('Belum ada UMKM di area ini.');
    } catch (e) {
        console.error('[initNearbyUmkm]', e);
    } finally {
        store.dispatch('isLoading', false);
    }
};

// Global Exposure
window.TitikLokal.initBuyerHome = initBuyerHome;
window.TitikLokal.initExploreMap = initExploreMap;
window.TitikLokal.initProfile = initProfile;
window.TitikLokal.initOrders = initOrders;
window.TitikLokal.initWishlist = initWishlist;
window.TitikLokal.initShopProfile = initShopProfile;
window.TitikLokal.initNearbyUmkm = initNearbyUmkm;
