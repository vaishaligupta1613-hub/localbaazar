import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './components/Feed';
import OrderFlow from './components/OrderFlow';
import MapView from './components/MapView';
import ReviewUpload from './components/ReviewUpload';
import SellerDashboard from './components/SellerDashboard';
import AddProduct from './components/AddProduct';
import SellerOrders from './components/SellerOrders';
import BuyerOrders from './components/BuyerOrders';
import Wallet from './components/Wallet';
import Collections from './components/Collections';
import Login from './components/Login';
import RoleHome from './components/RoleHome';
import AuthorizedContacts from './components/AuthorizedContacts';
import SequentialOrderQueue from './components/SequentialOrderQueue';
import LegalReceiptGenerator from './components/LegalReceiptGenerator';
import { useStore } from './store';

function App() {
  const { user, mode, setMode } = useStore();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Common Routes */}
          <Route path="/profile" element={
            <div className="container" style={{padding: '20px'}}>
              <h2 className="text-gradient">My Profile</h2>
              <div className="glass-panel" style={{ padding: '20px', margin: '20px 0' }}>
                <p><strong>Name:</strong> {user?.name || 'Anonymous'}</p>
                <p><strong>Phone:</strong> {user?.phone}</p>
                <p><strong>Account Type:</strong> {user?.role?.toUpperCase()}</p>
                {user?.shopDetails && <p><strong>Shop:</strong> {user?.shopDetails?.name}</p>}
                
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-glass)' }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Current Mode: <span style={{ color: 'var(--primary)' }}>{mode === 'seller' ? 'Selling' : 'Shopping'}</span></p>
                  <button 
                    className="btn btn-accent" 
                    style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}
                    onClick={() => setMode(mode === 'seller' ? 'buyer' : 'seller')}
                  >
                    Switch to {mode === 'seller' ? 'Shopping' : 'Selling'} Mode
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    throw new Error("Simulated system crash to test backup functionality!");
                  }}
                >
                  Test System Crash (Backup)
                </button>
                <button 
                  className="btn btn-glass" 
                  style={{ width: '100%', borderColor: 'var(--error)', color: 'var(--error)' }}
                  onClick={() => {
                    useStore.getState().logout();
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          } />

          <Route path="/wallet" element={<Wallet />} />

          {/* Authorized Contacts Directory */}
          <Route path="/contacts" element={<AuthorizedContacts />} />

          {/* Unified Routes (Available to all logged-in users) */}
          {user && (
            <>
              {/* Buyer Features */}
              <Route path="/feed" element={<Feed />} />
              <Route path="/order/:id" element={<OrderFlow />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/buyer-orders" element={<BuyerOrders />} />
              <Route path="/review" element={<ReviewUpload />} />
              <Route path="/cart" element={<div className="container" style={{padding: '20px'}}><h2>Cart</h2><p>No minimum order required.</p></div>} />
              
              {/* Seller Features */}
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/seller-orders" element={<SellerOrders />} />
              <Route path="/sequential-orders" element={<SequentialOrderQueue />} />

              {/* Receipt Generation */}
              <Route path="/receipt/:orderId" element={<LegalReceiptGenerator />} />

              {/* Role Selection Home */}
              <Route path="/" element={<RoleHome />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {!user && (
            <>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
