# Local Bazaar Integration Guide

## Overview

This guide provides step-by-step instructions to integrate the newly created SequentialOrderQueue and LegalReceiptGenerator components into the Local Bazaar application. These components implement core SHUDDH PRD features while preserving the existing Local Bazaar visual identity and branding.

### Components to Integrate
- **SequentialOrderQueue.jsx**: FIFO order management system for sellers with status tracking and action buttons
- **LegalReceiptGenerator.jsx**: Tamper-proof receipt generation with digital signature and PDF export

### Prerequisites
- SequentialOrderQueue.jsx (380 lines) and LegalReceiptGenerator.jsx (420 lines) are created in src/components/
- Store.js has orders array with structure: `{id, buyerId, sellerId, totalAmount, status, items, createdAt, paymentMethod, sellerName, sellerPhone, sellerShop, buyerName, buyerPhone, deliveryLocation}`
- App.jsx has existing routes and imports structure
- Development server running at http://localhost:5173/

## Step 1: Add Routes to App.jsx

### Objective
Add /sequential-orders and /receipt/:orderId routes to enable navigation to the new components.

### Changes Required
1. Open `src/App.jsx`
2. Add imports at the top:
```javascript
import SequentialOrderQueue from './components/SequentialOrderQueue';
import LegalReceiptGenerator from './components/LegalReceiptGenerator';
```

3. Add routes in the Routes section (after existing routes):
```javascript
<Route path="/sequential-orders" element={<SequentialOrderQueue />} />
<Route path="/receipt/:orderId" element={<LegalReceiptGenerator />} />
```

### Full Code Context
```javascript
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ... existing imports ...
import SequentialOrderQueue from './components/SequentialOrderQueue';
import LegalReceiptGenerator from './components/LegalReceiptGenerator';
// ... rest of imports ...

function App() {
  // ... existing code ...

  return (
    <Router>
      {/* ... existing router setup ... */}
      <Routes>
        {/* ... existing routes ... */}
        <Route path="/sequential-orders" element={<SequentialOrderQueue />} />
        <Route path="/receipt/:orderId" element={<LegalReceiptGenerator />} />
        {/* ... existing routes ... */}
      </Routes>
    </Router>
  );
}
```

### Testing
1. Start development server: `npm run dev`
2. Navigate to http://localhost:5173/sequential-orders
3. Navigate to http://localhost:5173/receipt/test-order-id
4. Verify components render without errors

## Step 2: Add Store Methods for Order Status Updates

### Objective
Create `updateOrderStatus(orderId, newStatus)` method in Zustand store to enable status transitions.

### Changes Required
1. Open `src/store.js`
2. Add the method to the store object:
```javascript
updateOrderStatus: (orderId, newStatus) => set((state) => ({
  orders: state.orders.map(order =>
    order.id === orderId ? { ...order, status: newStatus } : order
  )
}))
```

### Full Code Context
```javascript
// src/store.js
// ... existing imports and setup ...

const useStore = create(
  persist(
    (set, get) => ({
      // ... existing store properties ...

      // Add this method
      updateOrderStatus: (orderId, newStatus) => set((state) => ({
        orders: state.orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      })),

      // ... existing methods ...
    }),
    // ... persist config ...
  )
);
```

### Testing
1. Import useStore in a test component
2. Call `updateOrderStatus('test-id', 'confirmed')`
3. Verify order status updates in store.orders array

## Step 3: Wire Action Buttons in SequentialOrderQueue

### Objective
Connect UI buttons to store actions for order status management.

### Changes Required
1. Open `src/components/SequentialOrderQueue.jsx`
2. Import useStore and destructure updateOrderStatus and addNotification:
```javascript
const { orders, user, updateOrderStatus, addNotification } = useStore();
```

3. Update button handlers (around lines 150-200):
```javascript
// For pending orders
const handleConfirmOrder = (orderId) => {
  updateOrderStatus(orderId, 'confirmed');
  addNotification('Order confirmed successfully', 'success');
};

const handleDeclineOrder = (orderId) => {
  updateOrderStatus(orderId, 'declined');
  addNotification('Order declined', 'warning');
};

// For confirmed orders
const handleMarkPicked = (orderId) => {
  updateOrderStatus(orderId, 'picked');
  addNotification('Order marked as picked', 'success');
};

// For picked orders
const handleDeliveryConfirmed = (orderId) => {
  updateOrderStatus(orderId, 'delivered');
  addNotification('Delivery confirmed', 'success');
};
```

4. Update button onClick handlers:
```javascript
// Confirm button
<Button onClick={() => handleConfirmOrder(order.id)} ...>

// Decline button
<Button onClick={() => handleDeclineOrder(order.id)} ...>

// Mark Picked button
<Button onClick={() => handleMarkPicked(order.id)} ...>

// Delivery Confirmed button
<Button onClick={() => handleDeliveryConfirmed(order.id)} ...>
```

### Testing
1. Login as seller with orders
2. Navigate to /sequential-orders
3. Click status buttons (Confirm, Mark Picked, etc.)
4. Verify order status updates and notifications appear

## Step 4: Add Receipt Storage to Store

### Objective
Extend store to persist generated receipts.

### Changes Required
1. Open `src/store.js`
2. Add receipts array to initial state:
```javascript
receipts: [],
```

3. Add receipt management methods:
```javascript
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
```

### Full Code Context
```javascript
// src/store.js
const useStore = create(
  persist(
    (set, get) => ({
      // ... existing properties ...
      orders: [],
      receipts: [], // Add this

      // ... existing methods ...

      // Add these methods
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

      // ... existing methods ...
    }),
    // ... persist config ...
  )
);
```

### Testing
1. Call `saveReceipt({receiptId: 'test', orderId: 'order-1', ...})`
2. Verify receipt appears in store.receipts
3. Refresh page and verify receipts persist

## Step 5: Integrate Receipt Generation on Order Delivery

### Objective
Trigger receipt generation when seller marks order as delivered.

### Changes Required
1. Open `src/components/SequentialOrderQueue.jsx`
2. Add state for receipt modal:
```javascript
const [showReceiptModal, setShowReceiptModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
```

3. Modify handleDeliveryConfirmed:
```javascript
const handleDeliveryConfirmed = (orderId) => {
  updateOrderStatus(orderId, 'delivered');
  const order = orders.find(o => o.id === orderId);
  setSelectedOrder(order);
  setShowReceiptModal(true);
  addNotification('Delivery confirmed - Generate receipt', 'success');
};
```

4. Add modal at end of component:
```javascript
{showReceiptModal && selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Generate Legal Receipt</h2>
        <button
          onClick={() => setShowReceiptModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <LegalReceiptGenerator
        order={selectedOrder}
        seller={{
          name: user.name,
          phone: user.phone,
          shop: user.shop
        }}
        buyer={{
          name: selectedOrder.buyerName,
          phone: selectedOrder.buyerPhone,
          location: selectedOrder.deliveryLocation
        }}
        onComplete={() => setShowReceiptModal(false)}
      />
    </div>
  </div>
)}
```

5. Import useState in SequentialOrderQueue:
```javascript
import { useState } from 'react';
```

### Testing
1. Mark an order as "Delivery Confirmed"
2. Verify receipt modal appears with LegalReceiptGenerator
3. Sign receipt and verify PDF download works

## Step 6: Enable Receipt Access via URL

### Objective
Allow direct access to receipts via /receipt/:orderId route.

### Changes Required
1. Open `src/components/LegalReceiptGenerator.jsx`
2. Add useParams import:
```javascript
import { useParams } from 'react-router-dom';
```

3. Add params handling at component start:
```javascript
const { orderId } = useParams();
const { getReceiptByOrderId, orders } = useStore();

// If accessed via URL, load receipt data
const existingReceipt = orderId ? getReceiptByOrderId(orderId) : null;
const orderFromUrl = orderId ? orders.find(o => o.id === orderId) : null;

// Use existingReceipt if available, otherwise use props
const displayOrder = existingReceipt ? existingReceipt.order : (orderFromUrl || order);
const displaySeller = existingReceipt ? existingReceipt.seller : seller;
const displayBuyer = existingReceipt ? existingReceipt.buyer : buyer;
```

4. Update component to use display* variables instead of props directly

### Testing
1. Generate a receipt for an order
2. Navigate to /receipt/[order-id]
3. Verify receipt displays with signature and download option

## Step 7: Add Buyer Receipt Download Link

### Objective
Allow buyers to download receipts from their order history.

### Changes Required
1. Open `src/components/Orders.jsx` (or relevant order display component)
2. For delivered orders, add download button:
```javascript
{order.status === 'delivered' && (
  <Link
    to={`/receipt/${order.id}`}
    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
  >
    Download Receipt
  </Link>
)}
```

### Testing
1. Login as buyer
2. View order history
3. For delivered orders, click "Download Receipt"
4. Verify receipt page loads

## Testing Checklist

### Functional Testing
- [ ] Sequential orders route accessible at /sequential-orders
- [ ] Receipt route accessible at /receipt/:orderId
- [ ] Order status updates work (pending → confirmed → picked → delivered)
- [ ] Receipt modal appears on delivery confirmation
- [ ] Digital signature canvas works
- [ ] PDF export downloads correctly
- [ ] WhatsApp share formats message properly
- [ ] Receipts persist across page reloads
- [ ] Buyer can access receipts from order history

### Visual Testing
- [ ] SequentialOrderQueue maintains Local Bazaar glass-panel styling
- [ ] LegalReceiptGenerator uses consistent fonts and colors
- [ ] No branding changes (remains "Local Bazaar" not "Shuddh")
- [ ] Responsive design works on mobile/desktop
- [ ] Animations and transitions smooth

### Integration Testing
- [ ] End-to-end flow: Order placement → Seller acceptance → Status updates → Receipt generation
- [ ] Multi-role users can access both buyer and seller features
- [ ] Phone validation works with authorized contacts
- [ ] Store persistence works across browser sessions

## Troubleshooting

### Common Issues
1. **Route not found**: Ensure imports and routes added to App.jsx
2. **Store method undefined**: Check method names match exactly
3. **Component not rendering**: Verify file paths and exports
4. **Receipt not saving**: Check store.receipts array structure
5. **PDF not downloading**: Verify html2canvas and jsPDF imports

### Debug Steps
1. Check browser console for errors
2. Verify store state with React DevTools
3. Test individual components in isolation
4. Check network tab for failed requests

## Next Steps

After completing this integration, consider implementing remaining SHUDDH PRD features:

### Phase 6: Advanced Features
- Offline-first SQLite sync
- Battery optimization (GPS on-demand)
- Voice input for sellers
- Group buying system
- Delivery agent assignment
- Real-time order tracking
- WhatsApp order placement
- Toll-free support (Twilio)
- Premium seller tiers (1% commission)
- Analytics dashboard

### Performance Optimizations
- Lazy loading for heavy components
- Image optimization for product photos
- Caching strategies for order data
- Background sync for offline operations

### Security Enhancements
- Receipt tampering detection
- Secure signature storage
- Order fraud prevention
- User data encryption

## Support

For issues with this integration:
1. Check the troubleshooting section above
2. Review component code for prop mismatches
3. Verify store structure matches documented schema
4. Test with authorized demo contacts first

This integration maintains all existing Local Bazaar design elements while adding comprehensive order management and legal receipt functionality as specified in the SHUDDH PRD.
