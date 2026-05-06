import React from 'react';
import { useStore } from '../store';
import { TrendingUp, Eye, Package, IndianRupee, TrendingDown, BarChart3, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SellerDashboard = () => {
  const { user, products, orders, transactions } = useStore();

  const myProducts = products.filter(p => p.seller === user.shopDetails?.name);
  const myOrders = orders.filter(o => o.product.seller === user.shopDetails?.name);
  
  const totalRevenue = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
  
  // Mock profit calculation (assuming 70% is cost, 30% is profit)
  const estimatedCost = totalRevenue * 0.7;
  const estimatedProfit = totalRevenue - estimatedCost;
  const totalLoss = myOrders.filter(o => o.status === 'canceled').reduce((sum, o) => sum + (o.product.price * o.quantity), 0);
  
  const totalViews = myProducts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h2 className="text-gradient">Shop Analytics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Detailed performance of <strong>{user.shopDetails?.name}</strong></p>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
        <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '15px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><IndianRupee size={14} /> Revenue</div>
          <h3 style={{ fontSize: '1.4rem', margin: '5px 0' }}>₹{totalRevenue.toLocaleString()}</h3>
          <div style={{ fontSize: '0.7rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px' }}><TrendingUp size={12} /> +12%</div>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '15px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={14} /> Profit</div>
          <h3 style={{ fontSize: '1.4rem', margin: '5px 0', color: 'var(--primary)' }}>₹{estimatedProfit.toLocaleString()}</h3>
          <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>30% Margin</div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '15px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Eye size={14} /> Shop Views</div>
          <h3 style={{ fontSize: '1.4rem', margin: '5px 0' }}>{totalViews.toLocaleString()}</h3>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Top 5% in area</div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '15px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><TrendingDown size={14} /> Potential Loss</div>
          <h3 style={{ fontSize: '1.4rem', margin: '5px 0', color: 'var(--error)' }}>₹{totalLoss}</h3>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Canceled orders</div>
        </motion.div>
      </div>

      {/* Item-level Statistics */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><BarChart3 size={20} color="var(--primary)" /> Item Performance</h3>
          <button className="btn btn-glass" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Monthly Report</button>
        </div>

        {myProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 10px' }} />
            <p>No products yet to track performance.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {myProducts.map(p => {
              const sales = myOrders.filter(o => o.product.id === p.id && o.signature).reduce((sum, o) => sum + o.quantity, 0);
              const views = p.views || 0;
              const conversion = views > 0 ? Math.round((sales / views) * 100) : 0;
              
              return (
                <div key={p.id}>
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                      <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{sales} Sales</span>
                  </div>
                  
                  {/* Performance Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, conversion * 5)}%` }}
                      style={{ height: '100%', backgroundColor: 'var(--primary)' }} 
                    />
                  </div>
                  
                  <div className="flex-between" style={{ marginTop: '5px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>{views} Views</span>
                    <span>{conversion}% Conversion</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
