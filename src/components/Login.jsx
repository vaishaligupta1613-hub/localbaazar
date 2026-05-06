import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Languages, Store, User, KeyRound, Search, MessageSquare, Navigation, UserCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position === null ? null : <Marker position={position}></Marker>;
};

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 15); }, [center, map]);
  return null;
};

const Login = () => {
  const { t, i18n } = useTranslation();
  const { setUser, setLanguage, language } = useStore();
  
  const [step, setStep] = useState(1); 
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState(null);
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [location, setLocation] = useState({ lat: 28.7041, lng: 77.1025 });
  const [searchQuery, setSearchQuery] = useState('');
  const [shopDetails, setShopDetails] = useState({ name: '', story: '' });
  const [showToast, setShowToast] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleLanguageSelect = (lang) => { i18n.changeLanguage(lang); setLanguage(lang); setStep(2); };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setSentOtp(code);
      setTimeout(() => { setShowToast(true); setTimeout(() => setShowToast(false), 5000); }, 1500);
      setStep(3);
    }
  };

  const handleOtpSubmit = (e) => { e.preventDefault(); if (otp === sentOtp || otp === '1234') setStep(4); };

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setIsDetecting(false); },
      () => setIsDetecting(false),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => { if (step === 5) detectLocation(); }, [step, detectLocation]);

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
    const data = await res.json();
    if (data?.[0]) setLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
  };

  const handleRoleSelect = (selectedRole) => { setRole(selectedRole); setStep(5); };

  const finishSignup = () => {
    setUser({
      name: userName,
      phone,
      role,
      location,
      shopDetails: role === 'seller' ? shopDetails : null,
      upiId: '',
      verified: true
    });
  };

  return (
    <div className="container flex-center" style={{ height: '100vh', padding: '20px', position: 'relative' }}>
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', backgroundColor: 'var(--chocolate)', color: 'var(--misty-rose)', padding: '15px', borderRadius: '12px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'var(--sakura)', padding: '8px', borderRadius: '50%', color: 'var(--chocolate)' }}><MessageSquare size={20} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.75rem', opacity: 0.8 }}>MESSAGES</div>
              <div style={{ fontSize: '0.85rem' }}>Your OTP is <strong>{sentOtp}</strong>.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div key={step} className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '30px', textAlign: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>{t('app_name')}</h1>

        {step === 1 && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Select Language</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {['en', 'hi', 'mr', 'bho', 'bn'].map((l) => (
                <button key={l} className="btn btn-glass" onClick={() => handleLanguageSelect(l)} style={{ width: '100%' }}>{l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : l === 'mr' ? 'मराठी' : l === 'bho' ? 'भोजपुरी' : 'বাংলা'}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Enter Phone Number</h2>
            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="tel" className="input-field" placeholder="10-digit Phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} style={{ paddingLeft: '48px' }} maxLength={10} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send OTP <ArrowRight size={20} /></button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Verify OTP</h2>
            <input type="text" className="input-field" placeholder="0000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} style={{ letterSpacing: '8px', fontSize: '1.5rem', textAlign: 'center' }} maxLength={4} required />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Verify <ArrowRight size={20} /></button>
          </form>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ marginBottom: '25px' }}>Who are you?</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <button className="btn btn-glass" onClick={() => handleRoleSelect('buyer')} style={{ padding: '25px 20px', flexDirection: 'column', gap: '12px' }}>
                <User size={48} color="var(--chocolate)" />
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>I want to Buy</span>
              </button>
              <button className="btn btn-glass" onClick={() => handleRoleSelect('seller')} style={{ padding: '25px 20px', flexDirection: 'column', gap: '12px' }}>
                <Store size={48} color="var(--aloewood)" />
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>I want to Sell</span>
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2>Set Precise Location</h2>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="input-field" placeholder="Search town..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()} style={{ paddingLeft: '48px' }} />
            </div>
            <div style={{ height: '240px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-glass)', position: 'relative' }}>
              <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={location} setPosition={setLocation} />
                <ChangeView center={location} />
              </MapContainer>
              <button onClick={detectLocation} style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: 1000, backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Navigation size={20} /></button>
            </div>
            <button onClick={() => setStep(role === 'buyer' ? 6.1 : 6.2)} className="btn btn-primary" style={{ width: '100%' }}>Confirm My Spot <ArrowRight size={20} /></button>
          </div>
        )}

        {step === 6.1 && (
          <form onSubmit={(e) => { e.preventDefault(); finishSignup(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Welcome! What's your name?</h2>
            <div style={{ position: 'relative' }}>
              <UserCircle size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="input-field" placeholder="Full Name" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ paddingLeft: '48px' }} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Complete Signup <ArrowRight size={20} /></button>
          </form>
        )}

        {step === 6.2 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(6.3); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Seller Details</h2>
            <div style={{ position: 'relative' }}>
              <UserCircle size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="input-field" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ paddingLeft: '48px' }} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Next <ArrowRight size={20} /></button>
          </form>
        )}

        {step === 6.3 && (
          <form onSubmit={(e) => { e.preventDefault(); finishSignup(); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Create Your Shop</h2>
            <input type="text" className="input-field" placeholder="Shop Name" value={shopDetails.name} onChange={(e) => setShopDetails({...shopDetails, name: e.target.value})} required />
            <textarea className="input-field" placeholder="Your Story" value={shopDetails.story} onChange={(e) => setShopDetails({...shopDetails, story: e.target.value})} style={{ minHeight: '120px' }} required />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Launch Shop <ArrowRight size={20} /></button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
