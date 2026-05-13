import React from 'react';
import { Home, Map as MapIcon, User, LayoutDashboard, PlusCircle, Package, Wallet, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, mode } = useStore();

  if (!user) return null;

  const buyerNav = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/map', icon: MapIcon, label: 'Map' },
    { path: '/collections', icon: Heart, label: 'Saved' },
    { path: '/buyer-orders', icon: Package, label: 'Orders' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const sellerNav = [
    { path: '/seller-dashboard', icon: LayoutDashboard, label: 'Stats' },
    { path: '/map', icon: MapIcon, label: 'Map' },
    { path: '/add-product', icon: PlusCircle, label: 'Sell' },
    { path: '/seller-orders', icon: Package, label: 'Orders' },
    { path: '/wallet', icon: Wallet, label: 'Earnings' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const navItems = mode === 'seller' ? sellerNav : buyerNav;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: '75px',
      background: 'rgba(253, 249, 246, 0.95)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(61, 43, 31, 0.1)', display: 'flex',
      justifyContent: 'space-around', alignItems: 'center', zIndex: 1000,
      paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -10px 40px rgba(61, 43, 31, 0.08)'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none', border: 'none', color: isActive ? 'var(--chocolate)' : 'var(--text-muted)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px', padding: '10px 0', cursor: 'pointer', transition: 'all 0.3s ease', flex: 1
            }}
          >
            <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
            {isActive && <motion.div layoutId="activeNav" style={{ width: '18px', height: '3px', borderRadius: '2px', backgroundColor: 'var(--sakura)', marginTop: '4px' }} />}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
