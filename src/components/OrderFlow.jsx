import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { PhoneCall, Mic, FileText, CheckCircle2, Smartphone, CreditCard, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';

const OrderFlow = () => {
  const { id } = useParams();
  const { products, addOrder, user } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  
  const product = products.find(p => p.id === parseInt(id));
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!product) return <div>Product not found</div>;

  const handleNext = () => {
    if (step === 2 && paymentMethod === 'upi') {
      setStep(2.5); // Move to UPI processing
    } else {
      setStep(step + 1);
    }
  };

  const processUpiPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep(3); // Move to receipt generation
    }, 2500);
  };

  const generateReceipt = async () => {
    setIsGeneratingReceipt(true);
    try {
      const canvas = await html2canvas(receiptRef.current);
      const image = canvas.toDataURL('image/png');
      
      const a = document.createElement('a');
      a.href = image;
      a.download = `Receipt_${Date.now()}.png`;
      a.click();
      
      addOrder({ product, quantity, date: new Date().toISOString(), paymentMethod });
      setStep(4); // Success screen
    } catch (error) {
      console.error("Receipt generation failed", error);
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      {step === 1 && (
        <div className="glass-panel animate-slide-up" style={{ padding: '25px' }}>
          <h2>{t('order_3_taps')} - Tap 1</h2>
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>{product.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{product.price}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('free_delivery')}</p>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <label style={{ display: 'block', marginBottom: '15px', fontWeight: 500 }}>Quantity ({t('no_minimum')})</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button className="btn btn-glass" style={{ width: '50px', height: '50px', borderRadius: '50%' }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{quantity}</span>
              <button className="btn btn-glass" style={{ width: '50px', height: '50px', borderRadius: '50%' }} onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button className="btn btn-glass" style={{ flexDirection: 'column', padding: '15px' }}>
              <PhoneCall size={24} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>{t('call_us')}</span>
            </button>
            <button className="btn btn-glass" style={{ flexDirection: 'column', padding: '15px' }}>
              <Mic size={24} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', marginTop: '5px' }}>{t('voice_message')}</span>
            </button>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '30px', padding: '18px' }} onClick={handleNext}>
            Confirm Quantity (Tap 1)
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="glass-panel animate-slide-up" style={{ padding: '25px' }}>
          <h2>Delivery & Payment - Tap 2</h2>
          <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid var(--border-glass)' }}>
            <div className="flex-between">
              <span style={{ color: 'var(--text-muted)' }}>Item Total:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>₹{product.price * quantity}</span>
            </div>
            <div className="flex-between" style={{ marginTop: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery:</span>
              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>FREE</span>
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label 
              onClick={() => setPaymentMethod('cod')}
              style={{ 
                padding: '20px', border: paymentMethod === 'cod' ? '2px solid var(--chocolate)' : '1px solid var(--border-glass)', 
                borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                backgroundColor: paymentMethod === 'cod' ? 'rgba(61,43,31,0.05)' : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              <CreditCard size={24} color={paymentMethod === 'cod' ? 'var(--chocolate)' : 'var(--text-muted)'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>Cash on Delivery (COD)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay at your doorstep</div>
              </div>
              <input type="radio" checked={paymentMethod === 'cod'} readOnly style={{ accentColor: 'var(--chocolate)' }} />
            </label>

            <label 
              onClick={() => setPaymentMethod('upi')}
              style={{ 
                padding: '20px', border: paymentMethod === 'upi' ? '2px solid var(--chocolate)' : '1px solid var(--border-glass)', 
                borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer',
                backgroundColor: paymentMethod === 'upi' ? 'rgba(61,43,31,0.05)' : 'transparent',
                transition: 'all 0.3s'
              }}
            >
              <Smartphone size={24} color={paymentMethod === 'upi' ? 'var(--chocolate)' : 'var(--text-muted)'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>Online Payment (UPI)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay, Paytm, PhonePe</div>
              </div>
              <input type="radio" checked={paymentMethod === 'upi'} readOnly style={{ accentColor: 'var(--chocolate)' }} />
            </label>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '40px', padding: '18px' }} onClick={handleNext}>
            Place Order (Tap 2)
          </button>
        </div>
      )}

      {step === 2.5 && (
        <div className="glass-panel flex-center" style={{ padding: '50px 20px', flexDirection: 'column', textAlign: 'center' }}>
          {isProcessingPayment ? (
            <>
              <Loader2 size={64} className="animate-spin" color="var(--chocolate)" style={{ marginBottom: '20px' }} />
              <h2>Connecting to UPI Apps...</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Please complete the payment in GPay/Paytm</p>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '30px' }}>
                <Smartphone size={64} color="var(--chocolate)" style={{ margin: '0 auto', marginBottom: '20px' }} />
                <h2>Pay ₹{product.price * quantity} via UPI</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Secure direct payment to {product.seller}</p>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: '15px' }} onClick={processUpiPayment}>
                Pay Now
              </button>
              <button className="btn btn-glass" style={{ width: '100%' }} onClick={() => setStep(2)}>
                Back
              </button>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="animate-slide-up">
          <div 
            ref={receiptRef} 
            style={{ 
              background: 'white', 
              color: 'black', 
              padding: '30px', 
              borderRadius: '16px',
              fontFamily: 'monospace',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #ccc', paddingBottom: '15px', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>LOCAL BAZAAR</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '2px' }}>OFFICIAL RECEIPT</p>
            </div>
            
            <div style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              <div className="flex-between"><span>DATE:</span><span>{new Date().toLocaleDateString()}</span></div>
              <div className="flex-between"><span>SELLER:</span><span>{product.seller.toUpperCase()}</span></div>
              <div className="flex-between"><span>PAYMENT:</span><span>{paymentMethod.toUpperCase()}</span></div>
            </div>
            
            <div style={{ margin: '20px 0', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{product.name} x{quantity}</span>
                <span>₹{product.price * quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4CAF50', marginTop: '5px' }}>
                <span>DELIVERY FEE</span>
                <span>FREE</span>
              </div>
            </div>
            
            <div style={{ borderTop: '2px dashed #ccc', marginTop: '20px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.4rem' }}>
              <span>TOTAL:</span>
              <span>₹{product.price * quantity}</span>
            </div>

            <div style={{ marginTop: '50px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
                <div style={{ width: '120px', height: '40px', fontFamily: 'cursive', fontSize: '1.5rem', lineHeight: '40px' }}>
                  {product.seller.charAt(0)}...
                </div>
                <div style={{ fontSize: '0.65rem', borderTop: '1px solid #eee', marginTop: '5px' }}>Seller Authorized Sign</div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '30px', padding: '18px' }} 
            onClick={generateReceipt}
            disabled={isGeneratingReceipt}
          >
            {isGeneratingReceipt ? <Loader2 size={24} className="animate-spin" /> : <><FileText size={20} /> Generate & Save Receipt (Tap 3)</>}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="glass-panel animate-slide-up" style={{ padding: '50px 30px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(61,43,31,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle2 size={48} color="var(--chocolate)" />
          </div>
          <h2 style={{ fontSize: '1.8rem' }}>Order Successful!</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Your trustable receipt has been saved to your device.</p>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '40px' }} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderFlow;
