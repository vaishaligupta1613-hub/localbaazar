import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

localforage.config({
  name: 'LocalBazaarDB',
  storeName: 'appData',
});

const storage = {
  getItem: async (name) => await localforage.getItem(name),
  setItem: async (name, value) => await localforage.setItem(name, value),
  removeItem: async (name) => await localforage.removeItem(name),
};

const syncChannel = new BroadcastChannel('local-bazaar-sync');

export const useStore = create(
  persist(
    (set, get) => ({
      user: null, 
      mode: 'buyer', // 'buyer' or 'seller'
      language: 'en',
      cart: [],
      products: [],
      orders: [],
      receipts: [],
      transactions: [],
      notifications: [],
      wishlist: [],
      
      setUser: (user) => {
        set({ user, mode: user?.role || 'buyer' });
      },
      setMode: (mode) => set({ mode }),
      setLanguage: (language) => set({ language }),
      logout: () => set({ user: null, mode: 'buyer', cart: [], orders: [], transactions: [], notifications: [], wishlist: [] }),
      
      setUpiId: (upiId) => {
        set((state) => ({ user: { ...state.user, upiId } }));
        get().syncWithOthers();
      },

      toggleWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter(id => id !== productId)
            : [...state.wishlist, productId]
        }));
        get().syncWithOthers();
      },
      
      addNotification: (message, type = 'info') => {
        const id = Date.now() + Math.random();
        set((state) => ({
          notifications: [...state.notifications, { id, message, type, time: new Date().toISOString() }]
        }));
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }));
        }, 8000); // Slightly longer for real-time impact
      },

      // Notify other tabs that a data change occurred
      syncWithOthers: (notification = null) => {
        syncChannel.postMessage({ type: 'DATA_CHANGED', notification });
      },

      addProduct: (product) => {
        const newProduct = { 
          ...product, 
          id: Date.now(), 
          views: 0,
          timestamp: new Date().toISOString()
        };
        set((state) => ({
          products: [newProduct, ...state.products]
        }));
        const msg = `New from ${product.seller}: ${product.name}!`;
        // Only trigger local notification if NOT the one who added it (optional, but good for demo)
        get().addNotification(msg, 'success');
        get().syncWithOthers(msg);
      },
      
      incrementProductViews: (productId) => {
        set((state) => ({
          products: state.products.map(p => p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p)
        }));
        get().syncWithOthers();
      },

      addOrder: (order) => {
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        set((state) => {
          const newOrder = { 
            ...order, 
            id: orderId, 
            status: 'pending',
            createdAt: new Date().toISOString(),
            buyerId: state.user?.phone,
            sellerId: order.sellerId,
            buyerName: state.user?.name,
            buyerPhone: state.user?.phone,
            buyerLocation: state.user?.location,
            sellerLocation: order.product?.location || null,
            sellerName: order.product?.seller || state.user?.shopDetails?.name,
            deliveryLocation: state.user?.location ? `${state.user.location.lat.toFixed(3)}, ${state.user.location.lng.toFixed(3)}` : order.deliveryLocation || 'Unknown'
          };
          return {
            orders: [newOrder, ...state.orders]
          };
        });
        get().addNotification(`New order created: ${orderId}`, 'success');
        get().syncWithOthers();
      },

      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === orderId 
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        }));
        get().addNotification(`Order ${orderId} updated to ${newStatus}`, 'success');
        get().syncWithOthers();
      },

      saveReceipt: (receiptData) => set((state) => ({
        receipts: [...state.receipts, receiptData]
      })),

      getReceiptByOrderId: (orderId) => {
        const state = get();
        return state.receipts.find(receipt => receipt.orderId === orderId);
      },

      getAllReceiptsBySellerPhone: (phone) => {
        const state = get();
        return state.receipts.filter(receipt => receipt.sellerPhone === phone);
      },

      // Test function to add sample orders for MVP
      addTestOrders: () => {
        const testOrders = [
          {
            id: 'ORD-001',
            buyerId: '7654321098',
            sellerId: '9876543210',
            buyerName: 'Priya Sharma',
            buyerPhone: '7654321098',
            buyerLocation: { lat: 28.7180, lng: 77.1100 },
            sellerName: 'Ramu Kaka',
            sellerPhone: '9876543210',
            sellerShop: 'Fresh Farm Produce',
            sellerLocation: { lat: 28.7090, lng: 77.1080 },
            deliveryLocation: 'Sector 5, Colony',
            items: [
              { name: 'Fresh Tomatoes', qty: 2, price: 40 },
              { name: 'Organic Spinach', qty: 1, price: 30 }
            ],
            totalAmount: 110,
            status: 'pending',
            createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
            paymentMethod: 'UPI'
          },
          {
            id: 'ORD-002',
            buyerId: '9988776655',
            sellerId: '9876543210',
            buyerName: 'Vikram Singh',
            buyerPhone: '9988776655',
            buyerLocation: { lat: 28.7000, lng: 77.0950 },
            sellerName: 'Ramu Kaka',
            sellerPhone: '9876543210',
            sellerShop: 'Fresh Farm Produce',
            sellerLocation: { lat: 28.7090, lng: 77.1080 },
            deliveryLocation: 'Green Heights Apartment',
            items: [
              { name: 'Fresh Milk (1L)', qty: 2, price: 50 },
              { name: 'Homemade Butter', qty: 1, price: 150 }
            ],
            totalAmount: 250,
            status: 'confirmed',
            createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
            paymentMethod: 'Cash'
          }
        ];
        set((state) => ({ orders: [...state.orders, ...testOrders] }));
        get().addNotification('Test orders added for demo', 'success');
      },

      signOrder: (orderId, signature) => {
        set((state) => {
          const updatedOrders = state.orders.map(o => {
            if (o.id === orderId) return { ...o, signature, status: 'delivered', transactionAdded: true };
            return o;
          });
          
          const signedOrder = updatedOrders.find(o => o.id === orderId && o.transactionAdded);
          if (signedOrder) {
              const newTransaction = {
                  id: Date.now() + 2,
                  amount: signedOrder.product.price * signedOrder.quantity,
                  type: 'in',
                  date: new Date().toISOString(),
                  description: `Sold ${signedOrder.product.name}`
              };
              return { 
                  orders: updatedOrders.map(({transactionAdded, ...o}) => o), 
                  transactions: [...state.transactions, newTransaction] 
              };
          }
          return { orders: updatedOrders };
        });
        get().syncWithOthers();
      },

      seedProducts: () => set((state) => {
        if (state.products.length > 0) return state;
        return {
          products: [
            { id: 1, name: 'Fresh Farm Tomatoes', price: 40, distance: '1.2 km', location: {lat: 28.7090, lng: 77.1080}, seller: 'Ramu Kaka', verified: true, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', media: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'], views: 120 },
            { id: 2, name: 'Handmade Clay Pots', price: 150, distance: '0.8 km', location: {lat: 28.7040, lng: 77.1000}, seller: 'Shanti Devi', verified: true, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400', media: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400'], views: 85 },
            { id: 3, name: 'Local Honey', price: 250, distance: '3.5 km', location: {lat: 28.7200, lng: 77.1200}, seller: 'Bhaiya Ji', verified: true, image: 'https://images.unsplash.com/photo-1587049352847-4d4b1ed74dd7?w=400', media: ['https://images.unsplash.com/photo-1587049352847-4d4b1ed74dd7?w=400'], views: 210 },
          ]
        };
      })
    }),
    {
      name: 'local-bazaar-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);

// Listen for sync messages from other tabs
syncChannel.onmessage = async (event) => {
  if (event.data.type === 'DATA_CHANGED') {
    // Re-fetch only shared data from the persisted storage to avoid overwriting user session
    const persisted = await localforage.getItem('local-bazaar-storage');
    if (persisted && persisted.state) {
      const { products, orders, transactions, wishlist } = persisted.state;
      useStore.setState({ products, orders, transactions, wishlist });
      
      if (event.data.notification) {
        useStore.getState().addNotification(event.data.notification);
      }
    }
  }
};
