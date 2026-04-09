import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Seller } from '@/types';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone } from 'lucide-react';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for selected marker
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon.Default();

interface MapComponentProps {
  sellers: Seller[];
  selectedSellerId?: string | null;
  className?: string;
}

// Component to handle map centering when selected seller changes
const MapController = ({ sellers, selectedSellerId }: { sellers: Seller[], selectedSellerId?: string | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedSellerId) {
      const seller = sellers.find(s => s.id === selectedSellerId);
      if (seller && seller.coordinates) {
        map.flyTo([seller.coordinates.lat, seller.coordinates.lng], 15, {
          duration: 1.5
        });
      }
    } else if (sellers.length > 0) {
      // Fit bounds to all sellers if no specific one is selected
      const bounds = L.latLngBounds(
        sellers.filter(s => s.coordinates).map(s => [s.coordinates!.lat, s.coordinates!.lng])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedSellerId, sellers, map]);

  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({ sellers, selectedSellerId, className = "h-[400px] w-full rounded-xl z-0" }) => {
  // Default center (Bishkek)
  const defaultCenter: [number, number] = [42.8746, 74.5698];
  
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

  useEffect(() => {
    if (selectedSellerId && markerRefs.current[selectedSellerId]) {
      markerRefs.current[selectedSellerId]?.openPopup();
    }
  }, [selectedSellerId]);

  return (
    <div className={`overflow-hidden relative ${className}`}>
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController sellers={sellers} selectedSellerId={selectedSellerId} />

        {sellers.filter(s => s.coordinates).map((seller) => (
          <Marker 
            key={seller.id} 
            position={[seller.coordinates!.lat, seller.coordinates!.lng]}
            icon={selectedSellerId === seller.id ? selectedIcon : defaultIcon}
            ref={(ref) => {
              markerRefs.current[seller.id] = ref;
            }}
          >
            <Popup className="seller-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-base m-0">{seller.name}</h3>
                  {seller.verified && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      PRO
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-medium text-gray-900">{seller.rating}</span>
                  <span className="text-gray-500">({seller.reviewCount})</span>
                </div>
                
                <div className="flex items-start gap-1.5 text-xs text-gray-600 mb-1">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{seller.location}</span>
                </div>
                
                {seller.contacts.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{seller.contacts.phone}</span>
                  </div>
                )}
                
                <Link 
                  to={`/seller/${seller.id}`}
                  className="block w-full text-center bg-blue-600 text-white text-xs font-medium py-1.5 rounded hover:bg-blue-700 transition-colors"
                >
                  Перейти в магазин
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
