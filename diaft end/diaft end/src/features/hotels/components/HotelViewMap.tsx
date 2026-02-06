
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Layers, ExternalLink } from 'lucide-react';
import { formatHotelDistance } from '../../../utils/formatters';

interface HotelViewMapProps {
    lat: string | number;
    lng: string | number;
    hotelName: string;
    distanceFromHaram?: string;
    city?: string;
}

const HotelViewMap: React.FC<HotelViewMapProps> = ({ lat, lng, hotelName, distanceFromHaram, city }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

    const latitude = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const longitude = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    const isValidCoords = !isNaN(latitude) && !isNaN(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180 && (latitude !== 0 || longitude !== 0);

    // Initialize Map
    useEffect(() => {
        if (!isValidCoords || !mapContainerRef.current || mapInstanceRef.current) return;
        if (!L) return;

        mapInstanceRef.current = L.map(mapContainerRef.current, {
            center: [latitude, longitude],
            zoom: 16,
            zoomControl: false,
            scrollWheelZoom: false,
            attributionControl: false
        });

        // Add Modern Light Layer (CartoDB Positron - cleaner than Voyager)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; CARTO'
        }).addTo(mapInstanceRef.current);

        // Custom Pulse Marker
        const pulseIcon = L.divIcon({
            className: 'custom-pulse-marker',
            html: `
                <div class="relative flex items-center justify-center">
                    <div class="absolute w-12 h-12 bg-emerald-500/20 rounded-full animate-ping"></div>
                    <div class="absolute w-8 h-8 bg-emerald-500/40 rounded-full animate-pulse"></div>
                    <div class="relative w-5 h-5 bg-white border-2 border-emerald-500 rounded-full shadow-lg flex items-center justify-center">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        markerRef.current = L.marker([latitude, longitude], {
            icon: pulseIcon
        }).addTo(mapInstanceRef.current);

        // Enhanced Modern Popup
        markerRef.current.bindPopup(`
            <div style="font-family: 'Cairo', sans-serif; text-align: right; min-width: 140px;">
                <div style="font-weight: 900; color: #0f172a; font-size: 13px; margin-bottom: 2px;">${hotelName}</div>
                <div style="height: 1px; background: linear-gradient(to left, #10b981, transparent); margin: 6px 0;"></div>
                <div style="font-size: 10px; color: #64748b; font-weight: 800; display: flex; align-items: center; gap: 4px; justify-content: flex-end;">
                    ${formatHotelDistance(distanceFromHaram, city) || 'موقع الفندق'}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: #10b981;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
            </div>
        `, {
            closeButton: false,
            className: 'modern-map-popup',
            offset: [0, -10]
        }).openPopup();

        setTimeout(() => {
            mapInstanceRef.current?.invalidateSize();
        }, 300);

    }, [latitude, longitude, hotelName, distanceFromHaram]);

    // Handle Map Type Change
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer instanceof L.TileLayer) {
                mapInstanceRef.current.removeLayer(layer);
            }
        });

        if (mapType === 'satellite') {
            L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
                attribution: '&copy; Google'
            }).addTo(mapInstanceRef.current);
        } else {
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; CARTO'
            }).addTo(mapInstanceRef.current);
        }

    }, [mapType]);

    const openInGoogleMaps = () => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    };


    return (
        <div className="relative w-full h-full min-h-[inherit] bg-slate-50 flex flex-col group transition-all duration-700">
            {!isValidCoords ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50 min-h-[400px]">
                    <MapPin size={32} className="mb-3 opacity-20" />
                    <span className="text-xs font-black uppercase tracking-widest">موقع غير متاح</span>
                </div>
            ) : (
                <div ref={mapContainerRef} className="absolute inset-0 z-0 pointer-events-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
            )}

            {/* Premium Controls - Top Right */}
            <div className="absolute top-4 right-4 z-[500] pointer-events-auto">
                <button
                    onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
                    className="bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl text-[11px] font-extrabold text-slate-800 shadow-xl border border-white/50 flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-all active:scale-95 group/btn"
                >
                    <Layers size={14} className="group-hover/btn:rotate-12 transition-transform" />
                    {mapType === 'street' ? 'خريطة الأقمار' : 'خريطة الشوارع'}
                </button>
            </div>

            {/* Bottom Floating Card - Bottom Left */}
            <div className="absolute bottom-4 left-4 z-[500] pointer-events-auto">
                <button
                    onClick={openInGoogleMaps}
                    className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl text-[11px] font-extrabold shadow-2xl flex items-center gap-3 hover:bg-emerald-600 transition-all active:scale-95"
                >
                    <ExternalLink size={14} />
                    فتح في الخرائط
                </button>
            </div>

            <style>{`
                .modern-map-popup .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    border-radius: 20px;
                    border: 1px solid white;
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1);
                }
                .modern-map-popup .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                }
                .leaflet-container {
                    background: #f8fafc !important;
                }
                /* Hide Leaflet Default Logo/Attribution if possible or style it cleaner */
                .leaflet-control-attribution {
                    font-size: 8px !important;
                    background: rgba(255,255,255,0.5) !important;
                    backdrop-filter: blur(4px);
                    border-radius: 4px;
                    margin: 4px !important;
                    border: none !important;
                }
            `}</style>
        </div>
    );
};

export default HotelViewMap;
