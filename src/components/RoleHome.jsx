import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, User, TrendingUp, PackageOpen, Eye, ClipboardList, Plus, Settings } from 'lucide-react';

const RoleHome = () => {
  const { user, setMode } = useStore();
  const navigate = useNavigate();

  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const BuyerBlock = () => (
    <motion.div variants={cardVariants} className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'rgba(139, 69, 19, 0.1)', padding: '12px', borderRadius: '12px' }}>
          <ShoppingBag size={32} color="var(--chocolate)" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Shopping Mode</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>Browse & buy products</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={() => { setMode('buyer'); navigate('/feed'); }}
          className="btn btn-primary" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <Eye size={24} />
          <span>Browse Products</span>
        </button>
        <button 
          onClick={() => { setMode('buyer'); navigate('/buyer-orders'); }}
          className="btn btn-glass" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <ClipboardList size={24} />
          <span>My Orders</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button 
          onClick={() => { setMode('buyer'); navigate('/collections'); }}
          className="btn btn-glass" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <ShoppingBag size={24} />
          <span>Collections</span>
        </button>
        <button 
          onClick={() => { setMode('buyer'); navigate('/map'); }}
          className="btn btn-glass" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <TrendingUp size={24} />
          <span>Map View</span>
        </button>
      </div>
    </motion.div>
  );

  const SellerBlock = () => (
    <motion.div variants={cardVariants} className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'rgba(181, 101, 29, 0.1)', padding: '12px', borderRadius: '12px' }}>
          <Store size={32} color="var(--aloewood)" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>Seller Mode</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>Manage your shop & products</p>
        </div>
      </div>

      {user?.shopDetails && (
        <div style={{ 
          backgroundColor: 'rgba(181, 101, 29, 0.05)', 
          padding: '12px', 
          borderRadius: '10px', 
          marginBottom: '15px',
          borderLeft: '3px solid var(--aloewood)'
        }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{user.shopDetails.name}</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>{user.shopDetails.story}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <button 
          onClick={() => { setMode('seller'); navigate('/add-product'); }}
          className="btn btn-primary" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <Plus size={24} />
          <span>Add Product</span>
        </button>
        <button 
          onClick={() => { setMode('seller'); navigate('/seller-dashboard'); }}
          className="btn btn-glass" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <Store size={24} />
          <span>Dashboard</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button 
          onClick={() => { setMode('seller'); navigate('/sequential-orders'); }}
          className="btn btn-glass" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <PackageOpen size={24} />
          <span>Order Queue</span>
        </button>
        <button 
          onClick={() => { setMode('seller'); navigate('/profile'); }}
          className="btn btn-glass" 
          style={{ padding: '12px', fontSize: '0.9rem', flexDirection: 'column', gap: '8px', height: '100%' }}
        >
          <Settings size={24} />
          <span>Shop Settings</span>
        </button>
      </div>
    </motion.div>
  );

  const DualRoleNotice = () => (
    <motion.div 
      variants={cardVariants}
      className="glass-panel" 
      style={{ 
        padding: '16px', 
        marginBottom: '20px',
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.5rem' }}>✨</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>You're a Dual User!</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Switch between buying & selling modes</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '30px', padding: '0 20px' }}
      >
        <h1 className="text-gradient" style={{ margin: '10px 0', fontSize: '1.8rem' }}>Welcome, {user.name}!</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '0.95rem' }}>Location: {user.location?.lat?.toFixed(2)}, {user.location?.lng?.toFixed(2)}</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ padding: '0 20px 80px 20px' }}
      >
        {/* Show notice if user has both roles */}
        {user.roles && user.roles.length > 1 && <DualRoleNotice />}

        {/* Buyer Block */}
        {user.roles && user.roles.includes('buyer') && <BuyerBlock />}

        {/* Seller Block */}
        {user.roles && user.roles.includes('seller') && <SellerBlock />}

        {/* Fallback for old user data structure */}
        {!user.roles && user.role === 'buyer' && <BuyerBlock />}
        {!user.roles && user.role === 'seller' && <SellerBlock />}
      </motion.div>
    </div>
  );
};

export default RoleHome;
