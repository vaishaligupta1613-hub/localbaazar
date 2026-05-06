import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Search, MapPin, Star, Clock, Heart, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Feed = () => {
  const { t } = useTranslation();
  const { products, incrementProductViews, user, wishlist, toggleWishlist } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleProductClick = (product) => {
    incrementProductViews(product.id);
    navigate(`/order/${product.id}`);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.2rem' }}>Hi, {user?.name || 'Friend'}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('nearby_sellers')}</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '25px' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="input-field"
          placeholder="Search products or shops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '48px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredProducts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Search size={48} style={{ margin: '0 auto 15px', opacity: 0.2 }} />
            <p style={{ color: 'var(--text-muted)' }}>No products found matching "{searchQuery}"</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredProducts.map((product) => {
              const isSaved = wishlist.includes(product.id);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel"
                  style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    style={{
                      position: 'absolute', top: '15px', right: '15px', zIndex: 10,
                      background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%',
                      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Heart size={22} fill={isSaved ? "var(--sakura)" : "none"} color={isSaved ? "var(--sakura)" : "var(--chocolate)"} />
                  </button>

                  <div onClick={() => handleProductClick(product)}>
                    {product.media && product.media.length > 0 ? (
                      <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
                        {product.media.map((mediaItem, idx) => (
                          <div key={idx} style={{ flex: '0 0 100%', scrollSnapAlign: 'start' }}>
                            {mediaItem.startsWith('data:video/') ? (
                              <video 
                                src={mediaItem} 
                                style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
                                muted autoPlay loop playsInline
                              />
                            ) : (
                              <img 
                                src={mediaItem} 
                                alt={`${product.name} ${idx + 1}`} 
                                style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
                      />
                    )}
                    <div style={{ padding: '20px' }}>
                      <div className="flex-between" style={{ marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.3rem' }}>{product.name}</h3>
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--chocolate)' }}>₹{product.price}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} /> {product.distance}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={14} fill="var(--sakura)" color="var(--sakura)" /> 4.8
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Store size={14} /> {product.seller}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Feed;
