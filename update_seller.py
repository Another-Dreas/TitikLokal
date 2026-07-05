import re

with open('js/views/seller.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace initSellerOrders
new_init = '''
export const initSellerOrders = async () => {
    window.TitikLokal.sellerOrders.init();
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.sellerOrders = {
    currentTab: 'MENUNGGU_KONFIRMASI',
    orders: [],
    
    init: async () => {
        const store = window.TitikLokal.store;
        const api = window.TitikLokal.api;
        
        store.dispatch('isLoading', true);
        try {
            const user = store.getState().currentUser;
            if (!user) return;
            const shop = await api.getShopByOwner(user.id);
            if (!shop) return;
            
            window.TitikLokal.sellerOrders.orders = await api.getOrdersByShop(shop.id);
            window.TitikLokal.sellerOrders.render();
        } catch(e) {
            console.error(e);
        } finally {
            store.dispatch('isLoading', false);
        }
    },
    
    switchTab: (tab) => {
        window.TitikLokal.sellerOrders.currentTab = tab;
        window.TitikLokal.sellerOrders.render();
    },
    
    updateStatus: async (orderId, newStatus) => {
        const store = window.TitikLokal.store;
        const api = window.TitikLokal.api;
        
        store.dispatch('isLoading', true);
        try {
            await api.updateOrderStatus(orderId, newStatus);
            // Refresh
            const user = store.getState().currentUser;
            const shop = await api.getShopByOwner(user.id);
            window.TitikLokal.sellerOrders.orders = await api.getOrdersByShop(shop.id);
            window.TitikLokal.sellerOrders.render();
        } catch(e) {
            console.error(e);
        } finally {
            store.dispatch('isLoading', false);
        }
    },
    
    showOjolModal: (orderId) => {
        const order = window.TitikLokal.sellerOrders.orders.find(o => o.id === orderId);
        if(!order) return;
        
        const content = `
            <div class="flex flex-col gap-4 text-sm">
                <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div class="flex-1">
                        <div class="font-bold text-slate-800">GrabExpress Instant</div>
                        <div class="text-xs text-slate-500">Estimasi: 15-30 Menit</div>
                    </div>
                    <div class="font-bold text-slate-800">Rp ${window.TitikLokal.formatters.number(order.shippingFee || 12000)}</div>
                </div>
                <div class="text-slate-600">
                    <p class="mb-1"><strong>Alamat Pengiriman:</strong></p>
                    <p class="text-xs">${order.deliveryAddress ? order.deliveryAddress.address : 'Alamat pembeli'}</p>
                </div>
            </div>
        `;
        
        const actions = `
            <button class="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm transition-colors" 
                onclick="window.TitikLokal.ui.hideModal(); window.TitikLokal.sellerOrders.updateStatus('${orderId}', 'DIKIRIM'); window.TitikLokal.ui.showToast('Kurir berhasil dipanggil!', 'success');">
                Panggil Kurir
            </button>
        `;
        
        window.TitikLokal.ui.showModal('Pilih Kurir Ojol', content, actions);
    },
    
    showOrderDetails: (orderId) => {
        const order = window.TitikLokal.sellerOrders.orders.find(o => o.id === orderId);
        if(!order) return;
        
        const content = `
            <div class="flex flex-col gap-4 text-sm">
                <div class="p-3 bg-slate-50 rounded-xl">
                    <p class="text-xs text-slate-500 mb-1">Order ID: ${order.id}</p>
                    <p class="font-bold text-slate-800">Total Pembayaran: Rp ${window.TitikLokal.formatters.number(order.totalAmount + (order.shippingFee||0))}</p>
                </div>
                
                <div>
                    <h4 class="font-bold text-slate-800 mb-2">Produk Dipesan</h4>
                    <div class="space-y-2">
                        ${order.items.map(item => {
                            const p = window.TitikLokal.store.getState().products ? window.TitikLokal.store.getState().products.find(x => x.id === item.productId) : null;
                            return \`<div class="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg">
                                <div>
                                    <div class="font-medium text-slate-800">\${p ? p.name : 'Produk'}</div>
                                    <div class="text-xs text-slate-500">\${item.qty} x Rp \${window.TitikLokal.formatters.number(item.price)}</div>
                                </div>
                                <div class="font-bold">Rp \${window.TitikLokal.formatters.number(item.qty * item.price)}</div>
                            </div>\`;
                        }).join('')}
                    </div>
                </div>
                
                <div>
                    <h4 class="font-bold text-slate-800 mb-1">Info Pengiriman</h4>
                    <p class="text-xs text-slate-600">${order.deliveryAddress ? order.deliveryAddress.address : 'Alamat pembeli'}</p>
                    ${order.deliveryAddress && order.deliveryAddress.notes ? `<p class="text-xs text-slate-500 mt-1">Catatan: ${order.deliveryAddress.notes}</p>` : ''}
                </div>
            </div>
        `;
        
        let actions = '';
        if(order.status === 'MENUNGGU_KONFIRMASI') {
            actions = `<button class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-sm transition-colors" 
                onclick="window.TitikLokal.ui.hideModal(); window.TitikLokal.sellerOrders.updateStatus('${orderId}', 'DIPROSES')">
                Terima Pesanan
            </button>`;
        } else if (order.status === 'DIPROSES') {
            actions = `<button class="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm transition-colors" 
                onclick="window.TitikLokal.ui.hideModal(); window.TitikLokal.sellerOrders.showOjolModal('${orderId}')">
                Pilih Kurir Ojol
            </button>`;
        } else if (order.status === 'DIKIRIM') {
            actions = `<button class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-sm transition-colors" 
                onclick="window.TitikLokal.ui.hideModal(); window.TitikLokal.sellerOrders.updateStatus('${orderId}', 'SELESAI')">
                Pesanan Selesai
            </button>`;
        }
        
        window.TitikLokal.ui.showModal('Detail Pesanan', content, actions);
    },
    
    render: () => {
        const container = document.getElementById('view-seller-orders');
        if (!container) return;
        
        const tabs = [
            { id: 'MENUNGGU_KONFIRMASI', label: 'Baru' },
            { id: 'DIPROSES', label: 'Diproses' },
            { id: 'DIKIRIM', label: 'Dikirim' },
            { id: 'SELESAI', label: 'Selesai' }
        ];
        
        const counts = {
            MENUNGGU_KONFIRMASI: window.TitikLokal.sellerOrders.orders.filter(o => o.status === 'MENUNGGU_KONFIRMASI').length,
            DIPROSES: window.TitikLokal.sellerOrders.orders.filter(o => o.status === 'DIPROSES').length,
            DIKIRIM: window.TitikLokal.sellerOrders.orders.filter(o => o.status === 'DIKIRIM').length,
            SELESAI: window.TitikLokal.sellerOrders.orders.filter(o => o.status === 'SELESAI').length
        };
        
        const currentOrders = window.TitikLokal.sellerOrders.orders.filter(o => o.status === window.TitikLokal.sellerOrders.currentTab);
        
        let ordersHtml = '';
        if (currentOrders.length === 0) {
            ordersHtml = `
                <div class="p-6 text-center mt-10">
                    <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    <p class="text-slate-500 font-medium">Tidak ada pesanan</p>
                </div>
            `;
        } else {
            ordersHtml = `<div class="p-4 space-y-4">${currentOrders.map(order => {
                return `
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 cursor-pointer hover:border-primary-300 transition-colors" onclick="window.TitikLokal.sellerOrders.showOrderDetails('${order.id}')">
                        <div class="flex justify-between items-center mb-3">
                            <div class="text-xs font-bold text-slate-500">${order.id}</div>
                            <div class="text-[10px] text-slate-400">${window.TitikLokal.formatters.date(order.createdAt)}</div>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-bold text-slate-800">${order.items.length} Produk</div>
                                <div class="text-primary-600 font-bold text-sm mt-1">Rp ${window.TitikLokal.formatters.number(order.totalAmount)}</div>
                            </div>
                            <div class="shrink-0">
                                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}</div>`;
        }
        
        container.innerHTML = `
            <div class="max-w-lg mx-auto bg-slate-50 min-h-screen pb-24">
                <div class="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
                    <button onclick="window.TitikLokal.router.back()" class="p-2 hover:bg-slate-50 rounded-xl transition-colors shrink-0">
                        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <h1 class="text-xl font-bold text-slate-900">Pesanan Masuk</h1>
                </div>
                
                <div class="flex overflow-x-auto bg-white border-b border-slate-200 scrollbar-hide">
                    ${tabs.map(tab => `
                        <button class="px-4 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${window.TitikLokal.sellerOrders.currentTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}" 
                            onclick="window.TitikLokal.sellerOrders.switchTab('${tab.id}')">
                            ${tab.label} (${counts[tab.id]})
                        </button>
                    `).join('')}
                </div>

                ${ordersHtml}
            </div>
        `;
    }
};
'''

content = re.sub(r'export const initSellerOrders = async \(\) => \{.*?\};', new_init, content, flags=re.DOTALL)

with open('js/views/seller.js', 'w', encoding='utf-8') as f:
    f.write(content)
