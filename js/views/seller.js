import { api } from '../core/storage.js';
import { formatRupiah, generateId } from '../core/utils.js';
import { showToast, switchView, showModal, hideModal, createEmptyState } from '../components/ui.js';

window.TitikLokal = window.TitikLokal || {};


let salesChart = null;

export const initSellerDashboard = async () => {
    try {
        const shop = await api.getSellerShop();
        renderSellerDashboard(shop);
    } catch (e) {
        showToast(e.message, 'error');
        window.TitikLokal.initAuth('seller');
    }
};

const renderSellerDashboard = (shop) => {
    const container = document.getElementById('view-seller-dashboard');
    
    // Group active orders
    const activeOrders = shop.orders.filter(o => o.status === 'pending' || o.status === 'accepted' || o.status === 'shipping');
    const newOrdersCount = shop.orders.filter(o => o.status === 'pending').length;
    
    container.innerHTML = `
        <div class="max-w-5xl mx-auto">
            <header class="bg-surface lg:bg-transparent lg:border-none border-b border-slate-100 p-4 lg:p-0 mb-6 sticky top-0 z-30 lg:relative">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <img src="${shop.logo}" class="w-12 h-12 rounded-2xl border-2 border-surface shadow-sm object-cover">
                        <div>
                            <h2 class="font-bold text-xl text-slate-800 leading-tight">${shop.namaToko}</h2>
                            <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">Seller Center</span>
                        </div>
                    </div>
                    <button class="bg-surface border border-slate-200 p-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm lg:hidden" onclick="window.TitikLokal.switchView('view-splash')">
                        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            </header>
            
            <!-- SELLER NAV TABS -->
            <div class="px-4 lg:px-0 mb-6 overflow-x-auto scrollbar-hide">
                <div class="flex gap-2 min-w-max bg-slate-100/50 p-1 rounded-xl">
                    <button class="seller-tab-btn active" onclick="window.TitikLokal.switchSellerTab('dashboard', this)">Dashboard</button>
                    <button class="seller-tab-btn" onclick="window.TitikLokal.switchSellerTab('products', this)">Produk</button>
                    <button class="seller-tab-btn flex items-center gap-2" onclick="window.TitikLokal.switchSellerTab('orders', this)">
                        Pesanan
                        ${newOrdersCount > 0 ? `<span class="bg-error text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">${newOrdersCount}</span>` : ''}
                    </button>
                    <button class="seller-tab-btn" onclick="window.TitikLokal.switchSellerTab('finance', this)">Keuangan</button>
                    <button class="seller-tab-btn" onclick="window.TitikLokal.switchSellerTab('settings', this)">Pengaturan</button>
                </div>
            </div>

            <div class="p-4 lg:p-0">
                <!-- TAB: DASHBOARD -->
                <div id="seller-tab-dashboard" class="seller-tab-content active space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        <!-- Saldo -->
                        <div class="bg-primary-600 rounded-3xl p-6 shadow-lg shadow-primary-500/20 text-white relative overflow-hidden group">
                            <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div class="text-primary-100 text-sm font-medium mb-1 flex justify-between">
                                Saldo Tersedia
                                <svg class="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div class="text-3xl font-bold tracking-tight mb-6">${formatRupiah(shop.saldo)}</div>
                            <div class="flex gap-3 relative z-10">
                                <button class="flex-1 bg-white text-primary-600 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-50 active:scale-95 transition-all shadow-sm" onclick="window.TitikLokal.showToast('Fitur Tarik Saldo Segera Hadir', 'info')">Tarik Dana</button>
                            </div>
                        </div>
                        
                        <!-- Stats -->
                        <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100 flex flex-col justify-center cursor-pointer hover:border-primary-200 transition-colors" onclick="document.querySelectorAll('.seller-tab-btn')[2].click()">
                            <div class="text-slate-500 text-sm font-medium mb-1 flex justify-between items-center">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                    Pesanan Aktif
                                </span>
                                <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <div class="text-3xl font-bold text-slate-800">${activeOrders.length}</div>
                            <div class="text-xs ${newOrdersCount > 0 ? 'text-error' : 'text-slate-500'} font-bold mt-2">
                                ${newOrdersCount > 0 ? `🚨 ${newOrdersCount} pesanan perlu diproses` : '✓ Semua pesanan telah diproses'}
                            </div>
                        </div>
                        
                        <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100 flex flex-col justify-center">
                            <div class="text-slate-500 text-sm font-medium mb-1 flex justify-between items-center">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                    Performa Toko
                                </span>
                            </div>
                            <div class="flex items-baseline gap-2">
                                <div class="text-3xl font-bold text-slate-800">${shop.rating}</div>
                                <div class="text-sm font-normal text-slate-400">/ 5.0</div>
                            </div>
                            <div class="text-xs text-slate-500 mt-2">${shop.totalSales} Produk Terjual • ${shop.ulasanCount} Ulasan</div>
                        </div>
                    </div>

                    <!-- Chart -->
                    <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="font-bold text-slate-800 text-lg tracking-tight">Tren Penjualan (7 Hari)</h3>
                        </div>
                        <div class="w-full h-48 lg:h-64">
                            <canvas id="sellerChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- TAB: PRODUCTS -->
                <div id="seller-tab-products" class="seller-tab-content">
                    <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100 min-h-[500px]">
                        <div class="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 class="font-bold text-slate-800 text-lg tracking-tight">Daftar Produk (${shop.produk.length})</h3>
                            <button class="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-100 transition-colors flex items-center gap-2" onclick="window.TitikLokal.showProductModal()">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                Tambah
                            </button>
                        </div>
                        <div class="space-y-4" id="seller-product-list">
                            ${shop.produk.map(p => `
                                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary-100 hover:bg-slate-50 transition-all group">
                                    <div class="flex gap-4 flex-1 w-full">
                                        <img src="${p.img}" class="w-16 h-16 rounded-xl object-cover shadow-sm">
                                        <div class="flex-1">
                                            <h4 class="text-sm font-bold text-slate-800 line-clamp-1 mb-1">${p.nama}</h4>
                                            <div class="text-primary-600 font-bold text-sm">${formatRupiah(p.harga)}</div>
                                            <div class="text-xs text-slate-500 mt-1 line-clamp-1">${p.deskripsi || ''}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                                        <div class="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex gap-2 items-center">
                                            Stok: <span class="text-slate-900 font-bold">${p.stok}</span>
                                        </div>
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" class="sr-only peer" ${p.status ? 'checked' : ''} onchange="window.TitikLokal.toggleProductStatus('${p.id}')">
                                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                        <button class="p-2 text-slate-400 hover:text-primary-600 bg-white rounded-lg border border-slate-200 hover:border-primary-200 transition-colors" onclick="window.TitikLokal.showProductModal('${p.id}')">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button class="p-2 text-slate-400 hover:text-error bg-white rounded-lg border border-slate-200 hover:border-red-200 transition-colors" onclick="window.TitikLokal.deleteProduct('${p.id}')">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- TAB: ORDERS -->
                <div id="seller-tab-orders" class="seller-tab-content">
                    <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100 min-h-[500px]">
                        <h3 class="font-bold text-slate-800 text-lg tracking-tight mb-6">Kelola Pesanan</h3>
                        <div class="space-y-4" id="seller-orders-list">
                            ${shop.orders.length === 0 ? createEmptyState("Belum Ada Pesanan", "Toko Anda belum menerima pesanan baru.") : ''}
                            ${shop.orders.map(o => `
                                <div class="border border-slate-100 rounded-2xl p-5 hover:border-primary-100 transition-colors">
                                    <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-50">
                                        <div>
                                            <div class="text-xs text-slate-500 mb-1">${o.id} • ${new Date(o.createdAt).toLocaleDateString('id-ID')}</div>
                                            <div class="font-bold text-slate-800 text-sm">Pembeli: ${o.buyerName}</div>
                                        </div>
                                        <div class="badge badge-${o.status}">${o.status}</div>
                                    </div>
                                    
                                    <div class="space-y-3 mb-4">
                                        ${o.items.map(item => `
                                            <div class="flex gap-3 text-sm">
                                                <img src="${item.img}" class="w-12 h-12 rounded-lg object-cover">
                                                <div class="flex-1">
                                                    <div class="font-semibold text-slate-800">${item.productName}</div>
                                                    <div class="text-xs text-slate-500">${item.qty}x ${formatRupiah(item.price)}</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                    
                                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-50">
                                        <div>
                                            <div class="text-xs text-slate-500">Total Pendapatan</div>
                                            <div class="font-bold text-primary-600 text-lg">${formatRupiah(o.subtotal)}</div>
                                        </div>
                                        
                                        <div class="flex gap-2 w-full sm:w-auto">
                                            ${o.status === 'pending' ? `
                                                <button class="flex-1 sm:flex-none btn-secondary !py-2 !text-xs !rounded-lg" onclick="window.TitikLokal.updateOrderStatus('${o.id}', 'cancelled')">Tolak</button>
                                                <button class="flex-1 sm:flex-none btn-primary !py-2 !text-xs !rounded-lg bg-primary-600" onclick="window.TitikLokal.updateOrderStatus('${o.id}', 'accepted')">Terima Pesanan</button>
                                            ` : ''}
                                            ${o.status === 'accepted' ? `
                                                <button class="w-full sm:w-auto btn-primary !py-2 !text-xs !rounded-lg" onclick="window.TitikLokal.updateOrderStatus('${o.id}', 'shipping')">Kirim Pesanan (Resi)</button>
                                            ` : ''}
                                            ${o.status === 'shipping' ? `
                                                <span class="text-xs font-semibold text-slate-500 italic">Menunggu pembeli mengkonfirmasi penerimaan.</span>
                                            ` : ''}
                                            ${o.status === 'completed' ? `
                                                <span class="text-xs font-bold text-success flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Selesai & Dana Cair</span>
                                            ` : ''}
                                            ${o.status === 'cancelled' ? `
                                                <span class="text-xs font-bold text-error">Pesanan Dibatalkan</span>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- TAB: FINANCE -->
                <div id="seller-tab-finance" class="seller-tab-content">
                    <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100 min-h-[500px] flex items-center justify-center">
                        ${createEmptyState("Modul Keuangan", "Laporan detail pendapatan dan penarikan dana akan hadir di iterasi berikutnya.")}
                    </div>
                </div>

                <!-- TAB: SETTINGS -->
                <div id="seller-tab-settings" class="seller-tab-content">
                    <div class="bg-surface rounded-3xl p-6 shadow-card border border-slate-100">
                        <h3 class="font-bold text-slate-800 text-lg tracking-tight mb-6">Pengaturan Toko</h3>
                        <form onsubmit="event.preventDefault(); window.TitikLokal.saveShopSettings()" class="space-y-4 max-w-xl">
                            <div>
                                <label class="form-label">Nama Toko</label>
                                <input type="text" id="set-shop-name" class="form-input" required value="${shop.namaToko}">
                            </div>
                            <div>
                                <label class="form-label">Deskripsi</label>
                                <textarea id="set-shop-desc" class="form-input" rows="4">${shop.deskripsi}</textarea>
                            </div>
                            <div class="pt-4 flex justify-between items-center">
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="set-shop-open" class="sr-only peer" ${shop.isOpen ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                                    <span class="ml-3 text-sm font-bold text-slate-700 peer-checked:text-success">Status Toko Buka</span>
                                </label>
                                <button type="submit" id="btn-save-shop" class="btn-primary !w-auto !py-2.5 !px-6 !text-sm">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Wait for DOM
    requestAnimationFrame(() => initChart());
};

window.TitikLokal.switchSellerTab = (tabId, btn) => {
    document.querySelectorAll('.seller-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.seller-tab-content').forEach(c => c.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(`seller-tab-${tabId}`).classList.add('active');
    
    if(tabId === 'dashboard' && salesChart) {
        // Redraw to fix size issues when hidden
        salesChart.resize();
    }
};

const initChart = () => {
    const ctx = document.getElementById('sellerChart');
    if (!ctx) return;
    
    if (salesChart) salesChart.destroy();
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            datasets: [{
                label: 'Penjualan (Juta)',
                data: [1.2, 1.9, 1.5, 2.5, 2.2, 3.0, 2.8],
                borderColor: '#2563eb', 
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#2563eb',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, display: true, grid: { color: '#f1f5f9' }, border: { display: false } },
                x: { grid: { display: false }, border: { display: false } }
            }
        }
    });
};

window.TitikLokal.toggleProductStatus = async (productId) => {
    try {
        await api.updateProduct(productId, { status: event.target.checked });
        showToast(`Status produk diperbarui`, 'success');
    } catch(e) {
        showToast(e.message, 'error');
        event.target.checked = !event.target.checked; // revert UI
    }
};

window.TitikLokal.deleteProduct = async (productId) => {
    if(confirm('Hapus produk ini?')) {
        try {
            await api.deleteProduct(productId);
            showToast('Produk dihapus', 'success');
            initSellerDashboard(); // reload dashboard
        } catch(e) {
            showToast(e.message, 'error');
        }
    }
};

window.TitikLokal.showProductModal = async (productId = null) => {
    const modalContent = document.getElementById('modal-generic-content');
    let product = { nama: '', harga: '', stok: '', deskripsi: '', img: '', kategori: 'Kuliner' };
    
    if (productId) {
        const shop = await api.getSellerShop();
        product = shop.produk.find(p => p.id === productId) || product;
    }
    
    const categories = await api.getCategories();

    modalContent.innerHTML = `
        <div class="p-6">
            <h3 class="text-xl font-bold text-slate-800 mb-6">${productId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
            <form onsubmit="event.preventDefault(); window.TitikLokal.saveProduct('${productId || ''}')" class="space-y-4">
                <div>
                    <label class="form-label">Foto URL</label>
                    <input type="url" id="prod-img" class="form-input" required value="${product.img}" placeholder="https://images.unsplash.com/...">
                </div>
                <div>
                    <label class="form-label">Nama Produk</label>
                    <input type="text" id="prod-name" class="form-input" required value="${product.nama}">
                </div>
                <div>
                    <label class="form-label">Kategori</label>
                    <select id="prod-cat" class="form-input" required>
                        ${categories.map(c => `<option value="${c.name}" ${product.kategori === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="flex gap-4">
                    <div class="flex-1">
                        <label class="form-label">Harga (Rp)</label>
                        <input type="number" id="prod-price" class="form-input" required value="${product.harga}">
                    </div>
                    <div class="flex-1">
                        <label class="form-label">Stok</label>
                        <input type="number" id="prod-stock" class="form-input" required value="${product.stok}">
                    </div>
                </div>
                <div>
                    <label class="form-label">Deskripsi</label>
                    <textarea id="prod-desc" class="form-input" rows="3" required>${product.deskripsi}</textarea>
                </div>
                
                <div class="flex gap-3 pt-4 border-t border-slate-100">
                    <button type="button" class="btn-secondary flex-1 !py-2.5" onclick="window.TitikLokal.hideModal('modal-generic')">Batal</button>
                    <button type="submit" id="btn-save-prod" class="btn-primary flex-1 !py-2.5">Simpan</button>
                </div>
            </form>
        </div>
    `;
    showModal('modal-generic');
};

window.TitikLokal.saveProduct = async (productId) => {
    const data = {
        nama: document.getElementById('prod-name').value,
        img: document.getElementById('prod-img').value,
        kategori: document.getElementById('prod-cat').value,
        harga: parseInt(document.getElementById('prod-price').value),
        stok: parseInt(document.getElementById('prod-stock').value),
        deskripsi: document.getElementById('prod-desc').value,
    };
    
    const btn = document.getElementById('btn-save-prod');
    try {
        btn.innerHTML = `<span class="spinner"></span>`;
        if (productId) {
            await api.updateProduct(productId, data);
        } else {
            await api.addProduct(data);
        }
        hideModal('modal-generic');
        showToast('Produk disimpan', 'success');
        initSellerDashboard(); // reload dashboard
    } catch(e) {
        showToast(e.message, 'error');
        btn.innerHTML = 'Simpan';
    }
};

window.TitikLokal.updateOrderStatus = async (orderId, status) => {
    try {
        await api.updateOrderStatus(orderId, status);
        showToast(`Status pesanan diubah ke: ${status}`, 'success');
        initSellerDashboard(); // reload
    } catch(e) {
        showToast(e.message, 'error');
    }
};

window.TitikLokal.saveShopSettings = async () => {
    const data = {
        namaToko: document.getElementById('set-shop-name').value,
        deskripsi: document.getElementById('set-shop-desc').value,
        isOpen: document.getElementById('set-shop-open').checked
    };
    const btn = document.getElementById('btn-save-shop');
    
    try {
        btn.innerHTML = `<span class="spinner"></span>`;
        await api.updateShop(data);
        showToast('Pengaturan disimpan', 'success');
        btn.innerHTML = 'Simpan';
    } catch(e) {
        showToast(e.message, 'error');
        btn.innerHTML = 'Simpan';
    }
};
