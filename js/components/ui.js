export const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');

    let bgColor = 'bg-slate-800';
    let icon = '';
    if (type === 'success') {
        bgColor = 'bg-emerald-500';
        icon = `<svg class="w-5 h-5 text-white mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === 'error') {
        bgColor = 'bg-red-500';
        icon = `<svg class="w-5 h-5 text-white mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    } else if (type === 'info') {
        bgColor = 'bg-blue-500';
        icon = `<svg class="w-5 h-5 text-white mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    toast.className = `${bgColor} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between transform transition-all duration-300 opacity-0 translate-y-2 pointer-events-auto`;

    toast.innerHTML = `
        <div class="flex items-center">
            ${icon}
            <span class="text-sm font-semibold">${message}</span>
        </div>
        <button class="ml-4 text-white/70 hover:text-white transition-colors p-1 shrink-0" onclick="this.closest('[class*=bg-]').remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        setTimeout(() => {
            toast.classList.remove('opacity-0', 'translate-y-2');
        }, 10);
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

export const createShopCard = (shop, formatRupiah, renderStars) => {
    const locationName = document.getElementById('current-location-text')?.innerText || 'Jakarta';
    const distance = shop.jarakDari?.[locationName] ?? '?';

    return `
        <div class="bg-surface rounded-3xl shadow-card border border-slate-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group" onclick="window.TitikLokal.openShopProfile('${shop.id}')">
            <div class="relative h-40 w-full overflow-hidden bg-slate-100">
                <img src="${shop.coverImg}" alt="${shop.namaToko}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'">
                <div class="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-primary-600 flex items-center gap-1 z-20 shadow-sm border border-white/20">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
                    ${distance} km
                </div>
            </div>
            <div class="p-4 relative">
                <img src="${shop.logo}" alt="Logo" class="w-12 h-12 rounded-xl border-2 border-surface bg-surface shadow-sm absolute -top-6 left-4 z-20 object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(shop.namaToko)}&background=2563eb&color=fff'">
                <div class="mt-5 flex justify-between items-start gap-2">
                    <div>
                        <h4 class="font-bold text-slate-800 text-base leading-tight group-hover:text-primary-600 transition-colors">${shop.namaToko}</h4>
                        <div class="text-xs text-slate-500 mt-1">${shop.kategori}</div>
                        <div class="flex items-center mt-2">
                            <svg class="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <span class="text-sm font-bold text-slate-700 mr-1">${shop.rating}</span>
                            <span class="text-xs text-slate-400">(${shop.ulasanCount})</span>
                        </div>
                    </div>
                    <span class="text-xs font-semibold px-2 py-1 rounded-full ${shop.isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'} shrink-0 mt-1">${shop.isOpen ? 'Buka' : 'Tutup'}</span>
                </div>
            </div>
        </div>
    `;
};

export const createEmptyState = (title, description, iconSvg) => {
    return `
        <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                ${iconSvg || `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>`}
            </div>
            <h3 class="text-lg font-bold text-slate-800 mb-2">${title}</h3>
            <p class="text-sm text-slate-500 max-w-sm">${description}</p>
        </div>
    `;
};

export const switchView = (viewId) => {
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.add('hidden');
        el.style.opacity = '';
        el.style.transition = '';
    });

    const target = document.getElementById(viewId);
    if (!target) {
        console.warn(`switchView: element #${viewId} not found`);
        return;
    }

    target.classList.remove('hidden');
    target.style.opacity = '0';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            target.style.transition = 'opacity 0.25s ease';
            target.style.opacity = '1';
        });
    });

    const main = document.getElementById('main-scroll-area');
    if (main) main.scrollTop = 0;
};

export const showModal = (modalId, title, bodyHTML) => {
    // If title+bodyHTML are provided, create the modal dynamically
    if (title && bodyHTML) {
        // Remove existing modal with same id
        document.getElementById(modalId)?.remove();

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 z-[9999] flex items-end sm:items-center justify-center';
        modal.innerHTML = `
            <div class="modal-overlay fixed inset-0 bg-black/40 backdrop-blur-sm opacity-0 transition-opacity duration-300" onclick="window.TitikLokal.hideModal('${modalId}')"></div>
            <div class="modal-content relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-6 pb-8 z-10 transform translate-y-full sm:translate-y-0 sm:scale-95 transition-all duration-300 shadow-2xl">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-slate-900">${title}</h3>
                    <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors" onclick="window.TitikLokal.hideModal('${modalId}')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                ${bodyHTML}
            </div>
        `;
        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const overlay = modal.querySelector('.modal-overlay');
                const content = modal.querySelector('.modal-content');
                if (overlay) overlay.classList.remove('opacity-0');
                if (content) { content.classList.remove('translate-y-full', 'sm:scale-95'); }
            });
        });
    } else {
        // Existing DOM modal
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            const overlay = modal.querySelector('.modal-overlay');
            const content = modal.querySelector('.modal-content');
            if (overlay) overlay.classList.remove('opacity-0');
            if (content) content.classList.remove('translate-y-full', 'sm:scale-95');
        });
    }
};

export const hideModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const overlay = modal.querySelector('.modal-overlay');
    const content = modal.querySelector('.modal-content');
    if (overlay) overlay.classList.add('opacity-0');
    if (content) content.classList.add('translate-y-full', 'sm:scale-95');
    setTimeout(() => {
        modal.remove(); // remove entirely (works for both static and dynamic)
    }, 300);
};
