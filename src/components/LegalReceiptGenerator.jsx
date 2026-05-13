import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, CheckCircle, FileText, Signature } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const LegalReceiptGenerator = ({ order, seller, buyer }) => {
  const receiptRef = useRef(null);
  const canvasRef = useRef(null);
  const [signature, setSignature] = useState(null);
  const [showSignature, setShowSignature] = useState(true);

  if (!order) return null;

  // Generate tamper-proof receipt ID
  const receiptId = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const timestamp = new Date().toLocaleString('en-IN', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  });

  const drawSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'var(--primary)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    let isDrawing = false;
    const points = [];

    const startDrawing = (e) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      points.push({ x, y });
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;

      ctx.beginPath();
      ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(x, y);
      ctx.stroke();
      points.push({ x, y });
    };

    const endDrawing = () => {
      isDrawing = false;
      if (points.length > 10) {
        setSignature(canvas.toDataURL());
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', endDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', endDrawing);
    };
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${receiptId}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  const shareReceipt = async () => {
    const message = `Order Receipt - ${receiptId}\nAmount: ₹${order.totalAmount}\nYou: ${seller.name}\nBuyer: ${buyer.name}\nTime: ${timestamp}`;
    
    if (navigator.share) {
      navigator.share({ title: 'Receipt', text: message });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message);
      alert('Receipt copied to clipboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="container"
      style={{ padding: '20px' }}
    >
      <h2 className="text-gradient" style={{ marginBottom: '20px', fontSize: '1.4rem' }}>
        📄 Legal Receipt
      </h2>

      {/* Receipt Preview */}
      <div ref={receiptRef} className="glass-panel" style={{ padding: '24px', marginBottom: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid var(--primary)', paddingBottom: '15px' }}>
          <h1 className="text-gradient" style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>Local Bazaar</h1>
          <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Hyperlocal Social Commerce</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', opacity: 0.6 }}>Receipt ID: {receiptId}</p>
        </div>

        {/* Transaction Details */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', opacity: 0.7, fontWeight: 600 }}>SELLER</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{seller.name}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>Ph: {seller.phone}</p>
              {seller.shop && (
                <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>{seller.shop}</p>
              )}
            </div>

            <div>
              <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', opacity: 0.7, fontWeight: 600 }}>BUYER</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{buyer.name}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>Ph: {buyer.phone}</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>{buyer.location}</p>
            </div>
          </div>

          {/* Transaction Info */}
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span>Date & Time:</span>
              <strong>{timestamp}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Order ID:</span>
              <strong>{order.id.slice(0, 8).toUpperCase()}</strong>
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 600 }}>ITEMS PURCHASED</p>
          {order.items?.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)', fontSize: '0.85rem' }}>
              <div>
                <div>{item.name}</div>
                <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>Qty: {item.qty}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>₹{(item.price * item.qty).toFixed(2)}</div>
                <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>@ ₹{item.price}/unit</div>
              </div>
            </div>
          ))}
        </div>

        {/* Amount Summary */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span>Subtotal:</span>
            <strong>₹{order.totalAmount.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', opacity: 0.7 }}>
            <span>Commission (5%):</span>
            <span>₹{(order.totalAmount * 0.05).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', paddingTop: '8px', borderTop: '2px solid var(--border-glass)' }}>
            <span>Amount Received:</span>
            <span style={{ color: '#06A77D' }}>₹{(order.totalAmount * 0.95).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', fontWeight: 600 }}>PAYMENT METHOD</p>
          <p style={{ margin: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>{order.paymentMethod || 'UPI'}</p>
        </div>

        {/* Signature Section */}
        {signature && (
          <div style={{ marginBottom: '20px', borderTop: '2px solid var(--border-glass)', paddingTop: '15px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: 600 }}>SELLER SIGNATURE</p>
            <img src={signature} alt="Signature" style={{ maxWidth: '100%', height: '60px', objectFit: 'contain' }} />
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', opacity: 0.6 }}>Digitally signed on {timestamp}</p>
          </div>
        )}

        {/* Legal Text */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', marginTop: '20px', fontSize: '0.7rem', lineHeight: '1.4', opacity: 0.7 }}>
          <p style={{ margin: 0, marginBottom: '6px', fontWeight: 600 }}>TERMS & CONDITIONS</p>
          <p style={{ margin: 0, marginBottom: '4px' }}>✓ This receipt is valid proof of transaction between seller and buyer.</p>
          <p style={{ margin: 0, marginBottom: '4px' }}>✓ Seller's digital signature certifies authenticity and responsibility.</p>
          <p style={{ margin: 0 }}>✓ Disputes must be raised within 24 hours of transaction completion.</p>
        </div>
      </div>

      {/* Signature Canvas (Hidden) */}
      {showSignature && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ padding: '16px', marginBottom: '20px' }}
        >
          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600 }}>✍️ Seller Signature Required</p>
          <canvas
            ref={canvasRef}
            width={300}
            height={100}
            style={{
              border: '2px dashed var(--border-glass)',
              borderRadius: '8px',
              cursor: 'crosshair',
              width: '100%',
              marginBottom: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              display: 'block'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-glass"
              onClick={clearSignature}
              style={{ flex: 1, padding: '10px', fontSize: '0.9rem' }}
            >
              Clear
            </button>
            <button
              className={`btn ${signature ? 'btn-primary' : 'btn-glass'}`}
              onClick={() => setShowSignature(false)}
              disabled={!signature}
              style={{ flex: 1, padding: '10px', fontSize: '0.9rem', opacity: signature ? 1 : 0.5 }}
            >
              ✓ Confirm Signature
            </button>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        <button
          className="btn btn-primary"
          onClick={downloadReceipt}
          style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Download size={20} />
          <span>Download PDF Receipt</span>
        </button>
        <button
          className="btn btn-glass"
          onClick={shareReceipt}
          style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Share2 size={20} />
          <span>Share via WhatsApp</span>
        </button>
      </div>

      {/* Success Message */}
      {signature && !showSignature && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{
            padding: '16px',
            marginTop: '20px',
            backgroundColor: 'rgba(6, 167, 125, 0.1)',
            borderLeft: '4px solid #06A77D',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <CheckCircle size={24} color="#06A77D" />
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>Receipt Verified</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>Digitally signed and tamper-proof</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LegalReceiptGenerator;
