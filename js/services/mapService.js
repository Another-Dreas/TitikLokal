/**
 * TitikLokal - Map Service
 * Menangani logika Peta Interaktif (Leaflet JS) tanpa Google Maps API.
 */
import { store } from '../core/store.js';
import { api } from '../core/api.js';
import { formatters } from '../utils/formatters.js';
import { storage } from '../core/storage.js';

let mapInstance = null;
let markersLayer = null;

export const mapService = {
    initMap: (containerId, lat = 2.9595, lng = 99.0690, zoom = 14) => {
        if (!window.L) {
            console.error('[MapService] Leaflet library not loaded.');
            return null;
        }

        if (mapInstance) {
            setTimeout(() => {
                mapInstance.invalidateSize();
                mapInstance.setView([lat, lng], zoom);
            }, 100);
            return mapInstance;
        }

        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) return null;

        mapInstance = L.map(containerId, {
            zoomControl: false // custom position later
        }).setView([lat, lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);

        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

        markersLayer = L.layerGroup().addTo(mapInstance);
        return mapInstance;
    },

    loadShops: async (centerLat, centerLng, radiusKm = 5) => {
        if (!mapInstance || !markersLayer) return;

        markersLayer.clearLayers();
        store.dispatch('isLoading', true);

        try {
            const shops = await api.getShops(); // Fetch all shops

            // Filter by distance
            const nearbyShops = shops.map(shop => {
                const dist = formatters.calculateDistance(centerLat, centerLng, shop.coords[0], shop.coords[1]);
                return { ...shop, distance: dist };
            }).filter(s => s.distance <= radiusKm);

            nearbyShops.forEach(shop => {
                // Determine icon color by category (mock logic)
                const pinColor = shop.categoryId === 'c1' ? '#f59e0b' : '#2563eb'; // amber for food, blue for fashion

                const customIcon = L.divIcon({
                    className: 'custom-pin',
                    html: `<div class="relative w-8 h-8 group cursor-pointer animate-slide-up">
                               <div class="absolute inset-0 bg-[${pinColor}] rounded-full opacity-20 group-hover:animate-ping"></div>
                               <div class="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden bg-white">
                                   <img src="${shop.logo}" class="w-full h-full object-cover">
                               </div>
                           </div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });

                const marker = L.marker(shop.coords, { icon: customIcon }).addTo(markersLayer);

                // Add mini store card popup logic
                marker.on('click', () => {
                    const cardHtml = window.TitikLokal.cards.StoreCard(shop, shop.distance);
                    store.dispatch('selectedShop', shop);
                    window.TitikLokal.ui.showModal('Preview Toko', cardHtml);
                });
            });

            // Adjust view to fit bounds if there are markers
            if (nearbyShops.length > 0) {
                const group = new L.featureGroup(markersLayer.getLayers());
                mapInstance.fitBounds(group.getBounds().pad(0.1));
            }

        } catch (err) {
            console.error('[MapService]', err);
            window.TitikLokal.ui.showToast('Gagal memuat peta UMKM', 'error');
        } finally {
            store.dispatch('isLoading', false);
        }
    },

    addUserMarker: (lat = 2.9595, lng = 99.0690) => {
        if (!mapInstance) return;
        const userIcon = L.divIcon({
            className: 'user-location-pin',
            html: `
                <div class="relative flex items-center justify-center w-8 h-8">
                    <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    <div class="relative w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
                </div>
            `,
            iconSize: [32, 32], iconAnchor: [16, 16]
        });

        // Remove existing user marker if any
        if (window.userMapMarker) {
            mapInstance.removeLayer(window.userMapMarker);
        }

        window.userMapMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstance).bindPopup('Lokasi Anda Saat Ini');
        window.userCurrentLoc = [lat, lng];
    },

    centerToUser: () => {
        if (mapInstance && window.userCurrentLoc) {
            mapInstance.flyTo(window.userCurrentLoc, 15, { duration: 1.5 });
        } else {
            window.TitikLokal.ui.showToast('Mencari lokasi...', 'info');
            setTimeout(() => {
                mapService.addUserMarker(2.9595, 99.0690);
                mapService.centerToUser();
            }, 500);
        }
    },

    initTrackingMap: (containerId, startCoords, endCoords, orderId) => {
        if (!window.L) return null;
        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) return null;

        const trackMap = L.map(containerId, {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OSM'
        }).addTo(trackMap);

        // Store pin
        const storeIcon = L.divIcon({
            className: 'store-pin',
            html: `<div class="w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-md"></div>`,
            iconSize: [16, 16]
        });
        L.marker(startCoords, { icon: storeIcon }).addTo(trackMap);

        // Destination pin
        const destIcon = L.divIcon({
            className: 'dest-pin',
            html: `<div class="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>`,
            iconSize: [16, 16]
        });
        L.marker(endCoords, { icon: destIcon }).addTo(trackMap);

        // Draw line
        const routeLine = L.polyline([startCoords, endCoords], { color: '#94a3b8', weight: 3, dashArray: '5, 5' }).addTo(trackMap);
        trackMap.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

        // Driver pin
        const driverIcon = L.divIcon({
            className: 'driver-pin',
            html: `<div class="w-8 h-8 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-xl transition-transform transform">🛵</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const driverMarker = L.marker(startCoords, { icon: driverIcon, zIndexOffset: 1000 }).addTo(trackMap);

        // Animation logic
        const duration = 30000; // 30 seconds total journey
        const fps = 30;
        const steps = (duration / 1000) * fps;
        let currentStep = 0;

        const latStep = (endCoords[0] - startCoords[0]) / steps;
        const lngStep = (endCoords[1] - startCoords[1]) / steps;

        const animInterval = setInterval(() => {
            currentStep++;
            const newLat = startCoords[0] + (latStep * currentStep);
            const newLng = startCoords[1] + (lngStep * currentStep);

            driverMarker.setLatLng([newLat, newLng]);

            if (currentStep >= steps) {
                clearInterval(animInterval);
                driverMarker.setLatLng(endCoords); // Snap to end

                // Arrived! Update order status to SELESAI
                const order = storage.findOne('orders', o => o.id === orderId);
                if (order && order.status !== 'SELESAI') {
                    order.status = 'SELESAI';
                    order.statusHistory.push({ status: 'SELESAI', time: new Date().toISOString(), note: 'Pesanan telah diterima pembeli.' });
                    storage.updateById('orders', orderId, order);

                    window.TitikLokal.ui.showToast('Pesanan Tiba!', 'success');

                    // Re-render modal details if still open
                    if (document.getElementById(`order-detail-modal-${orderId}`)) {
                        document.getElementById(`order-detail-modal-${orderId}`).remove();
                        window.TitikLokal.ordersPage.showOrderDetail(orderId);
                    }

                    // Re-render orders view if visible
                    if (window.TitikLokal.initOrders) {
                        const ordersView = document.getElementById('view-orders');
                        if (ordersView && !ordersView.classList.contains('hidden')) {
                            window.TitikLokal.initOrders();
                        }
                    }
                }
            }
        }, 1000 / fps);

        return trackMap;
    },

    destroyMap: () => {
        if (mapInstance) {
            mapInstance.remove();
            mapInstance = null;
            markersLayer = null;
        }
    }
};

window.TitikLokal = window.TitikLokal || {};
window.TitikLokal.mapService = mapService;
