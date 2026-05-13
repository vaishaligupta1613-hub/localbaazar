import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Store, User, CheckCircle, Search } from 'lucide-react';
import { AUTHORIZED_DEMO_CONTACTS, getOperatorInfo } from '../utils/indianPhoneUtils';

const AuthorizedContacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState(null);

  const filteredContacts = AUTHORIZED_DEMO_CONTACTS.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.shop?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || contact.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '25px', padding: '0 20px' }}
      >
        <h1 className="text-gradient" style={{ margin: '10px 0', fontSize: '1.6rem' }}>Authorized Indian Contacts</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '0.9rem' }}>Real-time verified sellers and buyers</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '0 20px', marginBottom: '20px' }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search name, phone, or shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterRole(null)}
            className={`btn ${!filterRole ? 'btn-primary' : 'btn-glass'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            All
          </button>
          <button
            onClick={() => setFilterRole('seller')}
            className={`btn ${filterRole === 'seller' ? 'btn-primary' : 'btn-glass'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Sellers
          </button>
          <button
            onClick={() => setFilterRole('buyer')}
            className={`btn ${filterRole === 'buyer' ? 'btn-primary' : 'btn-glass'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Buyers
          </button>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '0 20px', marginBottom: '15px' }}
      >
        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
          {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
        </p>
      </motion.div>

      {/* Contacts Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ padding: '0 20px 80px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}
      >
        <AnimatePresence mode="wait">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <motion.div
                key={contact.id}
                variants={cardVariants}
                exit={{ opacity: 0, y: -10 }}
                className="glass-panel"
                style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 600 }}>{contact.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.7rem', 
                        fontWeight: 600,
                        backgroundColor: contact.role === 'seller' ? 'rgba(181, 101, 29, 0.2)' : 'rgba(139, 69, 19, 0.2)',
                        color: contact.role === 'seller' ? 'var(--aloewood)' : 'var(--chocolate)'
                      }}>
                        {contact.role.toUpperCase()}
                      </span>
                      {contact.verified && (
                        <CheckCircle size={16} color="#06A77D" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <Phone size={16} color="var(--primary)" />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Phone</p>
                    <p style={{ margin: '2px 0 0 0', fontFamily: 'monospace', fontWeight: 500 }}>+91 {contact.phone}</p>
                  </div>
                </div>

                {/* Operator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: getOperatorInfo(contact.phone).color }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Operator</p>
                    <p style={{ margin: '2px 0 0 0', fontWeight: 500 }}>{contact.operator}</p>
                  </div>
                </div>

                {/* Shop (if seller) */}
                {contact.shop && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(181, 101, 29, 0.1)' }}>
                    <Store size={16} color="var(--aloewood)" />
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>Shop</p>
                      <p style={{ margin: '2px 0 0 0', fontWeight: 500 }}>{contact.shop}</p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}>
                  {contact.role === 'seller' ? 'View Shop' : 'Send Message'}
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div
              variants={cardVariants}
              className="glass-panel"
              style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}
            >
              <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '10px' }}>No contacts found</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>Try adjusting your search or filters</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthorizedContacts;
