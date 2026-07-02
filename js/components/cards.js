/**
 * TitikLokal - Cards Library
 * Komponen Molekul (Molecule) untuk tampilan data berulang.
 */
import { formatters } from '../utils/formatters.js';

export const cards = {
    StoreCard: (shop, distance = null) => {
        return `
            <div class="bg-surface rounded-2xl shadow-card hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer group" onclick="window.TitikLokal.router.navigate('view-shop-profile', '${shop.id}')">
                <div class="h-32 relative bg-slate-200 overflow-hidden">
                    <img src="${shop.coverImg}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt="Cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-3 left-3 flex items-end gap-3 z-10">
                        <img src="${shop.logo}" class="w-12 h-12 rounded-xl border-2 border-white bg-white shadow-sm" alt="Logo">
                        <div class="text-white mb-1">
                            <div class="font-bold text-sm leading-tight truncate w-32">${shop.name}</div>
                            <div class="text-[10px] flex items-center gap-1 opacity-90">
                                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                ${shop.rating}
                            </div>
                        </div>
                    </div>
                    ${shop.verificationStatus === 'verified' ? `<div class="absolute top-2 right-2 bg-primary-500/90 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Terverifikasi</div>` : ''}
                </div>
                <div class="p-3">
                    <div class="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span class="bg-slate-100 px-2 py-0.5 rounded-md">${shop.categoryName || 'UMKM'}</span>
                        ${distance !== null ? `<span class="flex items-center gap-0.5"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>${distance} km</span>` : ''}
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
