import React, { useState } from 'react';
import { useStore } from '../store';
import { Wallet as WalletIcon, ArrowDownRight, ArrowUpRight, Plus, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Wallet = () => {
  const { user, transactions, setUpiId } = useStore();
  const [editingUpi, setEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState(user?.upiId || '');

  const handleSaveUpi = () => {
    setUpiId(upiInput);
    setEditingUpi(false);
  };

  const totalIn = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
  const balance = user?.role === 'seller' ? totalIn - totalOut : totalOut; // Simplified for prototype

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <WalletIcon size={24} color="var(--primary)" />
        <h2>Your Wallet & UPI</h2>
      </div>

      <div className="glass-panel" style={{ padding: '25px', marginBottom: '30px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Current Balance</p>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>₹{Math.abs(balance).toLocaleString()}</h2>
        
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'left' }}>
          <div className="flex-between" style={{ marginBottom: '5px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Linked UPI ID</span>
            {!editingUpi && <button onClick={() => setEditingUpi(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>}
          </div>
          
          {editingUpi ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                className="input-field" 
                value={upiInput} 
                onChange={(e) => setUpiInput(e.target.value)} 
                placeholder="username@paytm"
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              />
              <button onClick={handleSaveUpi} className="btn btn-primary" style={{ padding: '8px 15px', fontSize: '0.8rem' }}>Save</button>
            </div>
          ) : (
            <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={16} /> {user?.upiId || 'Not Linked'}
            </div>
          )}
        </div>
      </div>

      <h3>Transaction History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>No transactions found.</p>
        ) : (
          transactions.slice().reverse().map(t => (
            <div key={t.id} className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                backgroundColor: t.type === 'in' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 82, 82, 0.15)', 
                color: t.type === 'in' ? 'var(--primary)' : 'var(--error)',
                padding: '10px', borderRadius: '50%'
              }}>
                {t.type === 'in' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500' }}>{t.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(t.date).toLocaleDateString()} • {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div style={{ fontWeight: 'bold', color: t.type === 'in' ? 'var(--primary)' : 'white' }}>
                {t.type === 'in' ? '+' : '-'}₹{t.amount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wallet;
