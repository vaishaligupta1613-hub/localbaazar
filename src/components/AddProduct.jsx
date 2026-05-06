import React, { useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user, addProduct } = useStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]); // Array of { type: 'image'|'video', data: base64 }

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(prev => [...prev, { type: isVideo ? 'video' : 'image', data: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      name,
      price: parseFloat(price),
      description,
      image: media.length > 0 ? media[0].data : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      media: media.length > 0 ? media.map(m => m.data) : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'],
      seller: user.shopDetails.name,
      location: user.location,
      distance: '0.0 km', // Mock distance for seller view
      verified: true
    });
    navigate('/seller-dashboard');
  };

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h2>Post a Product</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Reach buyers within 5km instantly.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ 
          border: '2px dashed var(--border-glass)', 
          borderRadius: '12px', 
          padding: media.length > 0 ? '20px' : '40px 20px', 
          textAlign: 'center',
          position: 'relative',
          background: 'var(--bg-glass)'
        }}>
          {media.length > 0 ? (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
              {media.map((item, index) => (
                <div key={index} style={{ position: 'relative', flexShrink: 0 }}>
                  {item.type === 'video' ? (
                    <video src={item.data} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} muted />
                  ) : (
                    <img src={item.data} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeMedia(index); }}
                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div style={{ width: '100px', height: '100px', borderRadius: '8px', border: '2px dashed var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                <Plus size={24} color="var(--text-muted)" />
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple
                  onChange={handleMediaUpload} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
            </div>
          ) : (
            <>
              <Camera size={48} color="var(--text-muted)" style={{ margin: '0 auto', marginBottom: '10px' }} />
              <p>Add Photos / Videos</p>
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple
                capture="environment"
                onChange={handleMediaUpload} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
            </>
          )}
        </div>

        <input
          type="text"
          className="input-field"
          placeholder="Product Name (e.g., Fresh Mangoes)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</span>
          <input
            type="number"
            className="input-field"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ paddingLeft: '32px' }}
            required
          />
        </div>

        <textarea
          className="input-field"
          placeholder="Product Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ minHeight: '100px', resize: 'vertical' }}
        />

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
          <Plus size={20} /> Publish to Local Feed
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
