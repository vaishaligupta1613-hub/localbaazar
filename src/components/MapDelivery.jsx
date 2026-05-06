import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapDelivery = () => {
  const { t } = useTranslation();
  
  // Mock coordinates for a village/town setting
  const buyerPos = [28.7041, 77.1025]; // Delhi mock
  const sellerPos = [28.7090, 77.1080];
  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: 'var(--bg-dark)', zIndex: 10 }}>
        <h2>Delivery Map</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', color: 'var(--primary)' }}>
          <Navigation size={20} />
          <span>Distance: 1.2 km (Free Delivery Active)</span>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <MapContainer center={buyerPos} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={buyerPos}>
            <Popup>Your Location</Popup>
          </Marker>
          
          <Marker position={sellerPos}>
            <Popup>Seller Location</Popup>
          </Marker>
          
          <Polyline positions={[buyerPos, sellerPos]} color="var(--primary)" weight={4} dashArray="10, 10" />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapDelivery;
