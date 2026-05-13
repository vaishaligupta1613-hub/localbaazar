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

// Custom red icon for the current user
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const sellerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const buyerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapView = () => {
  const { t } = useTranslation();
  const { user, products, orders } = useStore();
  const navigate = useNavigate();
  
  if (!user || !user.location) return <div>Loading map...</div>;

  const center = [user.location.lat, user.location.lng];
  const isSeller = user.role === 'seller';

  // Get all buyers from all orders
  const buyerMarkers = orders
    .filter(order => order.buyerLocation)
    .map(order => ({
      id: `buyer-${order.id}`,
      position: [order.buyerLocation.lat, order.buyerLocation.lng],
      title: order.buyerName,
      subtitle: order.deliveryLocation || 'Buyer location',
      order
    }));

  // Get all sellers from products
  const sellerMarkers = products
    .filter(product => product.location)
    .map(product => ({
      id: `seller-${product.id}`,
      position: [product.location.lat, product.location.lng],
      title: product.seller,
      subtitle: product.name,
      product
    }));

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', background: 'var(--bg-dark)', zIndex: 10 }}>
        <h2>Sellers and Buyers Locations</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Browse all nearby sellers and buyers on the map
        </p>
      </div>
      
      <div style={{ flex: 1 }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={center} icon={userIcon}>
            <Popup>
              <strong>You are here</strong><br />
              {user.role === 'seller' ? user.shopDetails?.name || 'Seller' : 'Buyer'}
            </Popup>
          </Marker>

          {buyerMarkers.map(marker => (
            <Marker key={marker.id} position={marker.position} icon={buyerIcon}>
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong>{marker.title}</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem' }}>{marker.subtitle}</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order: {marker.order.id}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {sellerMarkers.map(marker => (
            <Marker key={marker.id} position={marker.position} icon={sellerIcon}>
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  {marker.product.image && (
                    <img src={marker.product.image} alt={marker.title} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' }} />
                  )}
                  <h4 style={{ margin: '8px 0 0 0' }}>{marker.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>{marker.subtitle}</p>
                  <button 
                    onClick={() => navigate(`/order/${marker.product.id}`)}
                    style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}
                  >
                    View Product
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
