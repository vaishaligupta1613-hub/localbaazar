import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon in leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red icon for the user
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapView = () => {
  const { t } = useTranslation();
  const { user, products } = useStore();
  const navigate = useNavigate();
  
  if (!user || !user.location) return <div>Loading map...</div>;

  const center = [user.location.lat, user.location.lng];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: 'var(--bg-dark)', zIndex: 10 }}>
        <h2>Nearby Local Shops</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing sellers within your area</p>
      </div>
      
      <div style={{ flex: 1 }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={center} icon={userIcon}>
            <Popup>
              <strong>You are here</strong><br/>
              {user.role === 'seller' ? user.shopDetails?.name : 'Buyer'}
            </Popup>
          </Marker>
          
          {products.map(product => {
            if (!product.location) return null;
            return (
              <Marker key={product.id} position={[product.location.lat, product.location.lng]}>
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                    <h4 style={{ margin: '5px 0 0 0' }}>{product.seller}</h4>
                    <p style={{ margin: '2px 0' }}>{product.name}</p>
                    <button 
                      onClick={() => navigate(`/order/${product.id}`)}
                      style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}
                    >
                      Buy Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
