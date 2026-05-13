import React, { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Image as ImageIcon, CheckCircle, User, Calendar, ThumbsUp } from 'lucide-react';

const VerifiedReviews = ({ productId, sellerId }) => {
  const { user, orders } = useStore();
  const [reviews, setReviews] = useState([
    {
      id: 1,
      buyerId: 'buyer1',
      buyerName: 'Priya Sharma',
      rating: 5,
      text: 'Amazing fresh vegetables! Exactly as described. Will order again.',
      photos: ['photo1.jpg'],
      verified: true,
      verifiedPurchase: true,
      createdAt: '2026-05-11',
      helpful: 24
    },
    {
      id: 2,
      buyerId: 'buyer2',
      buyerName: 'Rajesh Kumar',
      rating: 4,
      text: 'Good quality but took a bit longer than expected.',
      photos: ['photo2.jpg'],
      verified: true,
      verifiedPurchase: true,
      createdAt: '2026-05-10',
      helpful: 12
    },
    {
      id: 3,
      buyerId: 'buyer3',
      buyerName: 'Asha Verma',
      rating: 5,
      text: 'Best homemade achar I\'ve had! Fresh ingredients, great taste.',
      photos: ['photo3.jpg', 'photo4.jpg'],
      verified: true,
      verifiedPurchase: true,
      createdAt: '2026-05-09',
      helpful: 38
    }
  ]);

  const [newReview, setNewReview] = useState({ rating: 5, text: '', photos: [] });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Check if current user can review (only verified buyers)
  const hasCompletedOrder = orders.some(
    order => order.buyerId === user?.phone && order.status === 'completed'
  );

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      {/* Rating Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '20px', marginBottom: '20px', margin: '0 20px 20px 20px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'center' }}>
          {/* Rating Score */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {avgRating}
              </span>
              <span style={{ fontSize: '1rem', opacity: 0.7 }}>/ 5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '8px' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  color={i < Math.round(avgRating) ? '#FFD700' : 'var(--border-glass)'}
                  fill={i < Math.round(avgRating) ? '#FFD700' : 'none'}
                />
              ))}
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
              {reviews.length} verified review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div>
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '2px', minWidth: '70px' }}>
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={12} fill="#FFD700" color="#FFD700" />
                  ))}
                </div>
                <div style={{
                  height: '8px',
                  flex: 1,
                  backgroundColor: 'var(--border-glass)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${reviews.length > 0 ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%`,
                    backgroundColor: '#FFD700'
                  }} />
                </div>
                <span style={{ fontSize: '0.8rem', minWidth: '25px', textAlign: 'right' }}>
                  {ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Write Review Button */}
      {hasCompletedOrder && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="btn btn-primary"
          onClick={() => setShowReviewForm(!showReviewForm)}
          style={{ width: 'calc(100% - 40px)', margin: '0 20px 20px 20px', padding: '12px' }}
        >
          📝 {showReviewForm ? 'Cancel' : 'Write a Review'}
        </motion.button>
      )}

      {!hasCompletedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel"
          style={{
            padding: '16px',
            margin: '0 20px 20px 20px',
            backgroundColor: 'rgba(100, 100, 100, 0.1)',
            borderLeft: '4px solid var(--text-muted)'
          }}
        >
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7 }}>
            💡 Complete a purchase to write a verified review
          </p>
        </motion.div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel"
            style={{ padding: '20px', margin: '0 20px 20px 20px' }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>Share Your Experience</h3>

            {/* Rating Selection */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 500 }}>How would you rate this product?</p>
              <div style={{ display: 'flex', gap: '8px', fontSize: '2rem' }}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setNewReview({ ...newReview, rating })}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: rating <= newReview.rating ? 1 : 0.3,
                      transform: rating <= newReview.rating ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 500 }}>Your Review (Optional)</p>
              <textarea
                className="input-field"
                placeholder="Share details about the product quality, packaging, delivery, etc."
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            {/* Photo Upload */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 500 }}>📸 Add Photos (Recommended)</p>
              <button className="btn btn-glass" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ImageIcon size={18} />
                <span>Choose Photos</span>
              </button>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', opacity: 0.6 }}>Photos help other buyers make better decisions</p>
            </div>

            {/* Verified Badge Info */}
            <div style={{
              backgroundColor: 'rgba(6, 167, 125, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}>
              <CheckCircle size={18} color="#06A77D" />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#06A77D' }}>Verified Purchase Review</p>
                <p style={{ margin: '2px 0 0 0', opacity: 0.7 }}>Only verified buyers can review. Your review helps the community.</p>
              </div>
            </div>

            {/* Submit Button */}
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              ✓ Post Review
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ padding: '0 20px 80px 20px' }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>Customer Reviews</h3>

        <AnimatePresence>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel"
                style={{ padding: '16px', marginBottom: '12px' }}
              >
                {/* Review Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1.2rem'
                    }}>
                      {review.buyerName[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{review.buyerName}</span>
                        {review.verified && (
                          <CheckCircle size={16} color="#06A77D" />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', opacity: 0.7 }}>
                        <Calendar size={14} />
                        {review.createdAt}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        color={i < review.rating ? '#FFD700' : 'var(--border-glass)'}
                        fill={i < review.rating ? '#FFD700' : 'none'}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                {review.text && (
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {review.text}
                  </p>
                )}

                {/* Review Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {review.photos.map((photo, i) => (
                      <div
                        key={i}
                        style={{
                          aspectRatio: '1',
                          borderRadius: '8px',
                          backgroundColor: 'var(--border-glass)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                          fontSize: '2rem'
                        }}
                      >
                        📷
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.7 }}>
                  <button className="btn btn-glass" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ThumbsUp size={14} />
                    {review.helpful} Helpful
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel"
              style={{ padding: '40px', textAlign: 'center' }}
            >
              <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '10px' }}>No reviews yet</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.5' }}>Be the first to review this product!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VerifiedReviews;
