import React from 'react';
import { useStore } from '../store';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Collections = () => {
  const { products, wishlist, toggleWishlist, user } = useStore();
  const navigate = useNavigate();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h2 className="text-gradient" style={{ fontSize: '2rem' }}>My Collections</h2>
        <p style={{ color: 'var(--text-muted)' }}>Items you've saved for later</p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center', marginTop: '40px' }}>
          <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 15px', opacity: 0.3 }} />
          <p style={{ color: 'var(--text-muted)' }}>Your collection is empty.</p>
          <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
            Explore Feed
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <AnimatePresence>
            {savedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel"
                style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                onClick={() => navigate(`/order/${product.id}`)}
              >
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  style={{
                    position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                  }}
                >
                  <Heart size={16} fill="var(--sakura)" color="var(--sakura)" />
                </button>
                <div style={{ padding: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{product.name}</h4>
                  <p style={{ fontWeight: 'bold', color: 'var(--chocolate)', fontSize: '0.85rem' }}>₹{product.price}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Collections;
