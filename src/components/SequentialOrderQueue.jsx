import React, { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, MapPin, User, Phone, MessageCircle, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import LegalReceiptGenerator from './LegalReceiptGenerator';

const SequentialOrderQueue = () => {
  const { user, orders, updateOrderStatus, addNotification, addTestOrders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);

  // Handler functions for order status updates
  const handleConfirmOrder = (orderId) => {
    updateOrderStatus(orderId, 'confirmed');
    addNotification('Order confirmed successfully', 'success');
  };

  const handleDeclineOrder = (orderId) => {
    updateOrderStatus(orderId, 'declined');
    addNotification('Order declined', 'warning');
  };

  const handleMarkPicked = (orderId) => {
    updateOrderStatus(orderId, 'picked');
    addNotification('Order marked as picked', 'success');
  };

  const handleDeliveryConfirmed = (orderId) => {
    updateOrderStatus(orderId, 'delivered');
    const order = orders.find(o => o.id === orderId);
    setReceiptOrder(order);
    setShowReceiptModal(true);
    addNotification('Delivery confirmed - Generate receipt', 'success');
  };

  // Filter seller's orders and sort by creation time (sequential)
  const sellerOrders = orders
    .filter(order => order.sellerId === user?.phone)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const statusColors = {
    pending: { bg: 'rgba(255, 107, 53, 0.1)', text: '#FF6B35', label: 'Awaiting Response' },
    confirmed: { bg: 'rgba(255, 215, 0, 0.1)', text: '#FFD700', label: 'Confirmed' },
    picked: { bg: 'rgba(6, 167, 125, 0.1)', text: '#06A77D', label: 'Picked & Ready' },
    in_delivery: { bg: 'rgba(0, 78, 137, 0.1)', text: '#004E89', label: 'Out for Delivery' },
    delivered: { bg: 'rgba(6, 167, 125, 0.1)', text: '#06A77D', label: 'Delivered' },
    completed: { bg: 'rgba(100, 100, 100, 0.1)', text: '#666', label: 'Completed' }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle size={20} />;
      case 'confirmed': return <Clock size={20} />;
      case 'picked': return <Package size={20} />;
      case 'in_delivery': return <Zap size={20} />;
      case 'delivered': return <CheckCircle size={20} />;
      case 'completed': return <CheckCircle size={20} />;
      default: return <Package size={20} />;
    }
  };

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '25px', padding: '0 20px' }}
      >
        <h1 className="text-gradient" style={{ margin: '10px 0', fontSize: '1.6rem' }}>
          🎯 Order Queue
        </h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '0.9rem' }}>
          {sellerOrders.length} order{sellerOrders.length !== 1 ? 's' : ''} (oldest first)
        </p>
        {sellerOrders.length === 0 && (
          <button 
            className="btn btn-accent" 
            style={{ marginTop: '10px', padding: '8px 15px', fontSize: '0.8rem' }}
            onClick={addTestOrders}
          >
            ➕ Add Test Orders (Demo)
          </button>
        )}
      </motion.div>

      {/* Queue Statistics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '0 20px', marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}
      >
        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {sellerOrders.filter(o => o.status === 'pending').length}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Awaiting Response</p>
        </div>
        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#FFD700' }}>
            {sellerOrders.filter(o => o.status === 'confirmed').length}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Confirmed</p>
        </div>
        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#06A77D' }}>
            {sellerOrders.filter(o => o.status === 'picked').length}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>Ready to Deliver</p>
        </div>
      </motion.div>

      {/* Orders Queue */}
      {sellerOrders.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: '0 20px 80px 20px' }}
        >
          <AnimatePresence>
            {sellerOrders.map((order, index) => {
              const colors = statusColors[order.status] || statusColors.pending;
              const isFirst = index === 0;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    marginBottom: '12px',
                    borderLeft: `4px solid ${colors.text}`,
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: isFirst ? 'rgba(255, 215, 0, 0.05)' : 'transparent',
                    transform: isFirst ? 'scale(1.02)' : 'scale(1)',
                  }}
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                >
                  {/* Priority Badge */}
                  {isFirst && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      backgroundColor: '#FFD700',
                      color: '#333',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      zIndex: 10
                    }}>
                      🚀 NEXT
                    </div>
                  )}

                  {/* Order Number & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Order #{order.id.slice(0, 6).toUpperCase()}</h3>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                        {new Date(order.createdAt).toLocaleTimeString('en-IN')}
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: colors.bg,
                      color: colors.text
                    }}>
                      {getStatusIcon(order.status)}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{colors.label}</span>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <User size={16} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 500 }}>{order.buyerName}</p>
                      <p style={{ margin: '2px 0 0 0', opacity: 0.7, fontSize: '0.8rem' }}>{order.buyerPhone}</p>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <MapPin size={16} />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Delivery to</p>
                      <p style={{ margin: '2px 0 0 0', fontWeight: 500 }}>{order.location}</p>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: 600 }}>Items:</p>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span>{item.name} × {item.qty}</span>
                        <span style={{ opacity: 0.7 }}>₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-glass)' }}>
                    <span>Total Amount:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount}</span>
                  </div>

                  {/* Expandable Details */}
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}
                    >
                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', marginBottom: '12px' }}>
                        {order.status === 'pending' && (
                          <>
                            <button className="btn btn-primary" style={{ padding: '10px', fontSize: '0.9rem' }} onClick={() => handleConfirmOrder(order.id)}>
                              ✅ Confirm Order
                            </button>
                            <button className="btn btn-glass" style={{ padding: '10px', fontSize: '0.9rem', color: '#FF6B35' }} onClick={() => handleDeclineOrder(order.id)}>
                              ❌ Decline Order
                            </button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <button className="btn btn-primary" style={{ padding: '10px', fontSize: '0.9rem' }} onClick={() => handleMarkPicked(order.id)}>
                            📦 Mark as Picked
                          </button>
                        )}
                        {(order.status === 'picked' || order.status === 'in_delivery') && (
                          <button className="btn btn-primary" style={{ padding: '10px', fontSize: '0.9rem' }} onClick={() => handleDeliveryConfirmed(order.id)}>
                            ✔️ Delivery Confirmed
                          </button>
                        )}
                      </div>

                      {/* Chat Section */}
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <MessageCircle size={16} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Quick Message</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button className="btn btn-glass" style={{ padding: '6px', fontSize: '0.75rem' }}>
                            ✨ Order Received
                          </button>
                          <button className="btn btn-glass" style={{ padding: '6px', fontSize: '0.75rem' }}>
                            ⏰ 15 min prep
                          </button>
                          <button className="btn btn-glass" style={{ padding: '6px', fontSize: '0.75rem' }}>
                            🚗 On the way
                          </button>
                          <button className="btn btn-glass" style={{ padding: '6px', fontSize: '0.75rem' }}>
                            📍 Here now
                          </button>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '6px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: 600 }}>Payment Details:</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span>Subtotal:</span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span>Commission (5%):</span>
                          <span style={{ opacity: 0.7 }}>-₹{(order.totalAmount * 0.05).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                          <span>You Earn:</span>
                          <span style={{ color: '#06A77D' }}>₹{(order.totalAmount * 0.95).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel"
          style={{ padding: '40px', textAlign: 'center', margin: '0 20px' }}
        >
          <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '10px' }}>No orders yet</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>Your orders will appear here in sequence</p>
        </motion.div>
      )}
      
      {/* Receipt Generation Modal */}
      {showReceiptModal && receiptOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Generate Legal Receipt</h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <LegalReceiptGenerator
              order={receiptOrder}
              seller={{
                name: receiptOrder.sellerName,
                phone: receiptOrder.sellerPhone,
                shop: receiptOrder.sellerShop
              }}
              buyer={{
                name: receiptOrder.buyerName,
                phone: receiptOrder.buyerPhone,
                location: receiptOrder.deliveryLocation
              }}
              onComplete={() => setShowReceiptModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SequentialOrderQueue;
