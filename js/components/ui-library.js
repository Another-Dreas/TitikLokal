/**
 * TitikLokal - Component Factory (UI Library)
 * Komponen dasar (Atoms) untuk membangun antarmuka secara dinamis.
 */

export const ui = {
    // ── ATOMS ───────────────────────────────────────────────
    
    Button: ({ text, onClick, variant = 'primary', icon = '', className = '', disabled = false }) => {
        const baseClass = variant === 'primary' ? 'btn-primary' : (variant === 'secondary' ? 'btn-secondary' : 'text-slate-600 hover:bg-slate-100 rounded-lg p-2');
        return `
            <button class="${baseClass} ${className}" ${disabled ? 'disabled' : ''} onclick="${onClick}">
                ${icon && `<span class="mr-2">${icon}</span>`}
                ${text}
            </button>
        `;
    },

    Badge: ({ text, variant = 'info' }) => {
        const variants = {
            success: 'bg-emerald-100 text-emerald-700',
            warning: 'bg-amber-100 text-amber-700',
            error: 'bg-red-100 text-red-700',
            info: 'bg-blue-100 text-blue-700',
            neutral: 'bg-slate-100 text-slate-700'
        };
        return `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant] || variants.neutral}">${text}</span>`;
    },

    Input: ({ label, type = 'text', name, value = '', placeholder = '', required = false, onChange = '' }) => {
        return `
            <div class="space-y-1">
                ${label ? `<label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">${label}</label>` : ''}
                <input type="${type}" name="${name}" value="${value}" placeholder="${placeholder}" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm" ${required ? 'required' : ''} ${onChange ? `onchange="${onChange}"` : ''}>
            </div>
        `;
    },

    // ── FEEDBACK (Modals, Toasts) ───────────────────────────
    
    EmptyState: (title, message = '') => {
        return `
            <div class="flex flex-col items-center justify-center p-8 text-center text-slate-500 min-h-[300px]">
                <div class="w-24 h-24 mb-4 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                </div>
                <h3 class="font-bold text-slate-700 text-lg mb-1">${title}</h3>
                ${message ? `<p class="text-sm">${message}</p>` : ''}
            </div>
        `;
    },
    
    showToast: (message, type = 'info') => {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-success' : (type === 'error' ? 'bg-error' : 'bg-slate-800');
        
        toast.className = `${bgColor} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up text-sm font-medium w-full max-w-sm mx-auto`;
        toast.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="ml-auto opacity-70 hover:opacity-100">×</button>
        `;

        container.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
    },

    showModal: (title, contentHTML, actionsHTML = '') => {
        const existing = document.getElementById('global-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'global-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay bg-slate-900/50 backdrop-blur-sm animate-fade-in';
        
        modal.innerHTML = `
            <div class="bg-surface rounded-2xl shadow-xl w-full max-w-lg modal-content animate-slide-up flex flex-col max-h-[90vh]">
                <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <h3 class="font-bold text-lg text-slate-800">${title}</h3>
                    <button onclick="window.TitikLokal.ui.hideModal()" class="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto scrollbar-hide flex-1">
                    ${contentHTML}
                </div>
                ${actionsHTML ? `
                <div class="px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50 rounded-b-2xl">
                    ${actionsHTML}
                </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    hideModal: () => {
        const modal = document.getElementById('global-modal');
        if (modal) modal.remove();
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.ui = ui;
