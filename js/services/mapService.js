/**
 * TitikLokal - Map Service
 * Menangani logika Peta Interaktif (Leaflet JS) tanpa Google Maps API.
 */
import { store } from '../core/store.js';
import { api } from '../core/api.js';
import { formatters } from '../utils/formatters.js';

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
        if(!mapContainer) return null;

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
            className: '',
            html: `<div class="w-5 h-5 bg-blue-600 rounded-full border-3 border-white shadow-lg ring-4 ring-blue-200"></div>`,
            iconSize: [20, 20], iconAnchor: [10, 10]
        });
        L.marker([lat, lng], { icon: userIcon }).addTo(mapInstance).bindPopup('Lokasi Anda');
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
