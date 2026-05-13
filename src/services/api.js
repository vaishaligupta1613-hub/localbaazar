const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'API request failed');
  }
  return res.json();
};

export const getProducts = () => request('/products');
export const getOrders = (query = '') => request(`/orders${query}`);
export const createOrder = (order) => request('/orders', { method: 'POST', body: JSON.stringify(order) });
export const updateOrderStatus = (orderId, status) => request(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
export const getReceipts = () => request('/receipts');
export const saveReceipt = (receiptData) => request('/receipts', { method: 'POST', body: JSON.stringify(receiptData) });
export const getReviews = (query = '') => request(`/reviews${query}`);
export const saveReview = (review) => request('/reviews', { method: 'POST', body: JSON.stringify(review) });
export const loginUser = (user) => request('/users/login', { method: 'POST', body: JSON.stringify(user) });
