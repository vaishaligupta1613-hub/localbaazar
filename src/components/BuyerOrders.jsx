import React, { useState } from 'react';
import { useStore } from '../store';
import { Package, FileText, CheckCircle2, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiptModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          backgroundColor: 'white', color: 'black', width: '100%', maxWidth: '400px', 
          padding: '25px', borderRadius: '16px', position: 'relative',
          fontFamily: 'monospace', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', borderBottom: '2px dashed #ccc', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>LOCAL BAZAAR</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '1px' }}>OFFICIAL PAYMENT RECEIPT</p>
        </div>

        <div style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '5px' }}>
            <span>RECEIPT NO:</span>
            <span>#LB-{order.id.toString().slice(-6)}</span>
          </div>
          <div className="flex-between" style={{ marginBottom: '5px' }}>
            <span>DATE:</span>
            <span>{new Date(order.date).toLocaleDateString()}</span>
          </div>
          <div className="flex-between">
            <span>SELLER:</span>
            <span style={{ fontWeight: 'bold' }}>{order.product.seller.toUpperCase()}</span>
          </div>
        </div>

        <div style={{ margin: '20px 0', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <div className="flex-between" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            <span>ITEM</span>
            <span>TOTAL</span>
          </div>
          <div className="flex-between" style={{ fontSize: '0.9rem' }}>
            <span>{order.product.name} x{order.quantity}</span>
            <span>₹{order.product.price * order.quantity}</span>
          </div>
          <div className="flex-between" style={{ fontSize: '0.9rem', color: '#4CAF50', marginTop: '5px' }}>
            <span>DELIVERY FEE</span>
            <span>FREE</span>
          </div>
        </div>

        <div style={{ borderTop: '2px dashed #ccc', margin: '20px 0', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.3rem' }}>
          <span>GRAND TOTAL:</span>
          <span>₹{order.product.price * order.quantity}</span>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', marginBottom: '10px', color: '#888' }}>TRUSTABLE & REFUNDABLE RECEIPT</p>
          {order.signature ? (
            <div style={{ border: '1px solid #eee', padding: '10px', borderRadius: '8px', display: 'inline-block', minWidth: '150px' }}>
              <img src={order.signature} alt="Seller Signature" style={{ height: '50px', maxWidth: '100%' }} />
              <div style={{ fontSize: '0.65rem', borderTop: '1px solid #eee', marginTop: '5px', paddingTop: '3px' }}>SELLER AUTHORIZED MARK</div>
            </div>
          ) : (
            <div style={{ color: '#ff5252', fontSize: '0.8rem', fontStyle: 'italic' }}>Pending Seller Signature...</div>
          )}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '30px', background: '#333' }}
          onClick={() => window.print()}
        >
          <Download size={18} /> Save as PDF
        </button>
      </motion.div>
    </div>
  );
};

const BuyerOrders = () => {
  const { orders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // In a real app, we'd filter by current user's phone, but here we show all local orders for demo
  const myOrders = orders; 

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Package size={24} color="var(--primary)" />
        <h2>My Purchases</h2>
      </div>

      {myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
          <p>You haven't bought anything yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '15px' }} onClick={() => window.location.href='/'}>Explore Shops</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {myOrders.slice().reverse().map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.date).toLocaleDateString()}</span>
                <div style={{ 
                  fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px',
                  backgroundColor: order.signature ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 193, 7, 0.15)',
                  color: order.signature ? 'var(--primary)' : 'var(--accent)'
                }}>
                  {order.signature ? 'DELIVERED & SIGNED' : 'PENDING SIGNATURE'}
                </div>
              </div>
              
              <div className="flex-between">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <img src={order.product.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{order.product.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {order.quantity}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>₹{order.product.price * order.quantity}</div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}
                  >
                    <FileText size={14} /> View Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <ReceiptModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyerOrders;
