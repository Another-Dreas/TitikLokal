/**
 * TitikLokal - Cards Library
 * Komponen Molekul (Molecule) untuk tampilan data berulang.
 */
import { formatters } from '../utils/formatters.js';

export const cards = {
    StoreCard: (shop, distance = null, productCount = 0, wrapperClass = 'flex-none w-48 snap-center') => {
        const isOpen = shop.isOpen;
        const distLabel = distance !== null
            ? (distance < 1 ? Math.round(distance * 1000) + ' m' : distance.toFixed(1) + ' km')
            : (Math.random() > 0.5 ? Math.floor(Math.random() * 800 + 200) + ' m' : (Math.random() * 4 + 0.8).toFixed(1) + ' km');
        return `
            <div class="bg-surface rounded-2xl shadow-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer group ${wrapperClass}" onclick="window.TitikLokal.router.navigate('view-shop-profile', '${shop.id}')">
                <div class="h-28 relative bg-slate-100 overflow-hidden">
                    <img src="${shop.coverImg}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt="${shop.name}">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                </div>
                <div class="p-3">
                    <div class="flex items-center gap-2 mb-1.5">
                        <img src="${shop.logo}" class="w-7 h-7 rounded-lg border border-slate-100 shrink-0" alt="Logo ${shop.name}">
                        <h4 class="font-bold text-slate-800 text-xs leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">${shop.name}</h4>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-500">
                        <div class="flex items-center gap-0.5">
                            <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <span class="font-bold text-slate-700 text-[11px]">${shop.rating}</span>
                            <span class="text-[10px] text-slate-400">(${shop.totalReviews || 0})</span>
                        </div>
                        <span class="text-slate-400 text-[10px]">${productCount} produk</span>
                    </div>
                    
                    <div class="mt-2.5 pt-2.5 border-t border-slate-100">
                        <div class="flex items-start justify-between gap-1">
                            <div class="flex flex-col items-center gap-0.5 flex-1 ${shop.verificationStatus === 'verified' ? '' : 'opacity-30'}">
                                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                <span class="text-[9px] font-medium text-emerald-600 text-center leading-tight">Terverifikasi</span>
                            </div>
                            <div class="flex flex-col items-center gap-0.5 flex-1 ${isOpen ? '' : 'opacity-30'}">
                                <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18v4l-1.5 5H4.5L3 7z M3 12v8a2 2 0 002 2h14a2 2 0 002-2v-8 M12 12v10"/></svg>
                                <span class="text-[9px] font-medium text-emerald-600 text-center leading-tight">Buka Sekarang</span>
                            </div>
                            <div class="flex flex-col items-center gap-0.5 flex-1">
                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 18h.01M19 18h.01M3 6h11v12H3zm11 3h4l3 3v6h-7zM8 18a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"/></svg>
                                <span class="text-[9px] font-medium text-blue-600 text-center leading-tight">Bisa Diantar</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-slate-100">
                            <div class="flex items-center gap-0.5 text-slate-500">
                                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                <span class="text-[9px] font-medium truncate">${distLabel} dari Anda</span>
                            </div>
                            <div class="inline-flex items-center gap-0.5 h-5 px-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                                <span class="text-[9px] font-medium">Pilihan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    ProductCard: (product, shop = null, onAddToCart = null) => {
        return `
            <div class="bg-surface rounded-2xl shadow-card border border-slate-100 overflow-hidden flex flex-col relative group hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer" ${shop ? `onclick="window.TitikLokal.router.navigate('view-shop-profile', '${shop.id}')"` : ''}>
                <div class="relative pt-[100%] bg-slate-50 overflow-hidden">
                    <img src="${product.imgUrl || (product.images?.[0]?.imgUrl) || 'https://via.placeholder.com/400'}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt="${product.name}">
                    ${!product.status || product.stock < 1 ? `<div class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center"><span class="bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Habis</span></div>` : ''}
                </div>
                <div class="p-3 flex-1 flex flex-col">
                    <h3 class="text-sm font-semibold text-slate-800 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">${product.name}</h3>
                    <div class="font-bold text-primary-600 mb-2">${formatters.currency(product.price)}</div>
                    
                    ${shop ? `<div class="text-xs text-slate-500 mt-auto flex items-center gap-1 line-clamp-1 border-t border-slate-50 pt-2"><svg class="w-3 h-3 text-primary-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>${shop.name}</div>` : ''}
                </div>
                
                ${onAddToCart && product.status && product.stock > 0 ? `
                <button onclick="event.stopPropagation(); ${onAddToCart}" class="absolute bottom-3 right-3 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-xl shadow-md transition-transform active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </button>
                ` : ''}
            </div>
        `;
    },
    
    OrderTracker: (timeline = []) => {
        if (!timeline || timeline.length === 0) return '';
        
        let html = '<div class="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">';
        
        timeline.forEach((item, idx) => {
            const isLast = idx === timeline.length - 1;
            const colorClass = isLast ? 'bg-primary-500 border-primary-100' : 'bg-slate-300 border-white';
            const textClass = isLast ? 'text-primary-700 font-bold' : 'text-slate-600 font-medium';
            
            html += `
                <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div class="flex items-center justify-center w-6 h-6 rounded-full border-4 ${colorClass} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"></div>
                    <div class="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-soft">
                        <div class="flex items-center justify-between mb-1">
                            <div class="${textClass} text-sm">${item.status}</div>
                            <time class="text-xs text-slate-400 font-medium">${formatters.timeString(item.timestamp)}</time>
                        </div>
                        <div class="text-slate-500 text-xs leading-relaxed">${item.description}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.cards = cards;
