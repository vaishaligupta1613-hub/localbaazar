import React, { useEffect } from 'react';
import { useStore } from '../store';
import BottomNav from './BottomNav';
import Login from './Login';
import { WifiOff, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, seedProducts, notifications } = useStore();
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  useEffect(() => {
    seedProducts();
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!user) return <Login />;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* Global Real-time Notifications */}
      <div style={{ 
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', 
        zIndex: 2000, width: '90%', maxWidth: '400px', pointerEvents: 'none' 
      }}>
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              style={{
                backgroundColor: 'var(--chocolate)', color: 'white', padding: '15px 20px',
                borderRadius: '16px', marginBottom: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', gap: '15px', pointerEvents: 'auto',
                border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ backgroundColor: 'var(--sakura)', padding: '8px', borderRadius: '50%', color: 'var(--chocolate)' }}>
                <Bell size={20} />
              </div>
              <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: '500' }}>{notif.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isOffline && (
        <div style={{ background: 'var(--error)', color: 'white', padding: '8px', textAlign: 'center', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1000 }}>
          <WifiOff size={16} /> {t('offline_mode')}
        </div>
      )}
      
      <main>
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Layout;
