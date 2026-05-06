import React, { useState } from 'react';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewUpload = () => {
  const [photo, setPhoto] = useState(null);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock save to localforage or zustand would happen here
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="container flex-center" style={{ height: '80vh', flexDirection: 'column', gap: '20px' }}>
        <CheckCircle size={64} color="var(--primary)" />
        <h2>Review Submitted!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for your feedback.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h2>Submit Product Review</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Help others by sharing your experience.</p>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ 
          border: '2px dashed var(--border-glass)', 
          borderRadius: '12px', 
          padding: '40px 20px', 
          textAlign: 'center',
          position: 'relative',
          background: 'rgba(255,255,255,0.02)'
        }}>
          {photo ? (
            <img src={photo} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} />
          ) : (
            <>
              <Camera size={48} color="var(--text-muted)" style={{ margin: '0 auto', marginBottom: '10px' }} />
              <p>Tap to take photo or upload</p>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handlePhotoUpload} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px' }}>Your Feedback</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '120px', resize: 'vertical' }} 
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          <Upload size={20} /> Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewUpload;
