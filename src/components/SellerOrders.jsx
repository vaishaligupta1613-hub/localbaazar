import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Package, CheckCircle2, PenTool, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SignaturePad = ({ onSave, onCancel }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    onSave(dataUrl);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: 'white', color: 'black' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Seller Signature</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>Please sign below to confirm delivery/payment.</p>
        <canvas
          ref={canvasRef}
          width={360}
          height={200}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ border: '1px solid #ccc', borderRadius: '8px', cursor: 'crosshair', backgroundColor: '#f9f9f9', touchAction: 'none' }}
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={clear} className="btn btn-glass" style={{ flex: 1, color: '#666', borderColor: '#ccc' }}>
            <Trash2 size={18} /> Clear
          </button>
          <button onClick={save} className="btn btn-primary" style={{ flex: 2 }}>
            Confirm & Sign
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SellerOrders = () => {
  const { user, orders, signOrder } = useStore();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const myOrders = orders.filter(order => order.product.seller === user.shopDetails?.name);

  const handleSign = (signature) => {
    signOrder(selectedOrderId, signature);
    setSelectedOrderId(null);
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Package size={24} color="var(--primary)" />
        <h2>Manage Orders</h2>
      </div>

      {myOrders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>
          <p>No orders yet.</p>
          <p>When someone buys your product, it will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {myOrders.map(order => (
            <div key={order.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{order.product.name} x{order.quantity}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ordered: {new Date(order.date).toLocaleTimeString()}</p>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent)' }}>
                  ₹{order.product.price * order.quantity}
                </div>
              </div>

              {order.signature ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', padding: '10px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px' }}>
                    <CheckCircle2 size={18} /> Delivered & Signed
                  </div>
                  <img src={order.signature} alt="Signature" style={{ height: '60px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '4px', border: '1px solid var(--border-glass)' }} />
                </div>
              ) : (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <PenTool size={18} /> Confirm & Sign Receipt
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedOrderId && (
        <SignaturePad 
          onSave={handleSign}
          onCancel={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default SellerOrders;
