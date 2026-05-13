# Local Bazaar - Components Quick Reference

## Implemented Components Summary

### 1. **SequentialOrderQueue.jsx**
**Purpose:** Seller's order queue showing orders one-by-one in received order  
**Location:** `/src/components/SequentialOrderQueue.jsx`  
**Integration Point:** Should replace `/seller-orders` route

**Features:**
- Orders displayed in sequence (oldest first)
- "NEXT" badge highlighting priority order
- Queue statistics (pending, confirmed, picked)
- Order details with buyer info, location, items
- Expandable section with action buttons
- Quick message templates
- Commission breakdown (seller gets 95%)

**Props:** None required (uses Zustand store)  
**Store Dependencies:** `orders`, `user`

**Usage:**
```jsx
import SequentialOrderQueue from './components/SequentialOrderQueue';

// In SellerDashboard or seller-orders route
<SequentialOrderQueue />
```

---

### 2. **LegalReceiptGenerator.jsx**
**Purpose:** Generate tamper-proof legal receipts with digital seller signature  
**Location:** `/src/components/LegalReceiptGenerator.jsx`  
**Integration Point:** After order confirmation, on receipt detail page

**Features:**
- Professional receipt layout with tamper-proof ID
- Seller & buyer information
- Date/time stamped
- Items list with quantity
- Amount breakdown with commission deduction
- Digital signature canvas (seller draws)
- Download as PDF
- Share via WhatsApp
- Legal terms & conditions

**Props:**
```jsx
{
  order: {
    id: 'ORD-xxx',
    items: [{name, qty, price}],
    totalAmount: 500,
    paymentMethod: 'UPI'
  },
  seller: {
    name: 'Ramu Kaka',
    phone: '9876543210',
    shop: 'Fresh Farm Produce'
  },
  buyer: {
    name: 'Priya Sharma',
    phone: '7654321098',
    location: 'Sector 5, Colony'
  }
}
```

**Usage:**
```jsx
import LegalReceiptGenerator from './components/LegalReceiptGenerator';

<LegalReceiptGenerator 
  order={order}
  seller={seller}
  buyer={buyer}
/>
```

---

### 3. **VerifiedReviews.jsx**
**Purpose:** Display and collect reviews from verified buyers only  
**Location:** `/src/components/VerifiedReviews.jsx`  
**Integration Point:** Product detail page or seller shop page

**Features:**
- 5-star rating system
- Verified purchase badge (order completion required)
- Photo uploads with review
- Rating distribution chart
- Helpful count tracking
- Review text & photos display
- Average rating calculation

**Props:**
```jsx
{
  productId: 'product-123',
  sellerId: 'seller-456'
}
```

**Usage:**
```jsx
import VerifiedReviews from './components/VerifiedReviews';

<VerifiedReviews 
  productId={productId}
  sellerId={sellerId}
/>
```

---

### 4. **indianPhoneUtils.js**
**Purpose:** Utility functions for Indian phone validation  
**Location:** `/src/utils/indianPhoneUtils.js`

**Exported Functions:**

#### `validateIndianPhone(phone)`
Validates Indian phone number format and operator
```jsx
const result = validateIndianPhone('9876543210');
// Returns: {
//   isValid: true,
//   message: 'Valid Indian phone number',
//   operator: 'Jio/Airtel/VI',
//   operatorColor: '#FF6B35'
// }
```

#### `formatIndianPhone(phone)`
Formats to standard Indian format: +91 XXXXX XXXXX
```jsx
const formatted = formatIndianPhone('9876543210');
// Returns: '+91 98765 43210'
```

#### `getOperatorInfo(phone)`
Returns operator color and name
```jsx
const info = getOperatorInfo('9876543210');
// Returns: { name: 'Jio/Airtel/VI', color: '#FF6B35' }
```

#### `searchAuthorizedContact(phone)`
Searches authorized demo contacts
```jsx
const contact = searchAuthorizedContact('9876543210');
// Returns: { id, name, phone, role, shop, verified, operator }
```

#### `verifyPhoneNumber(phone)`
Checks if phone is authorized
```jsx
const verification = verifyPhoneNumber('9876543210');
// Returns: { isAuthorized: true, contact: {...}, message: '...' }
```

#### `AUTHORIZED_DEMO_CONTACTS`
Array of 8 demo contacts (sellers + buyers)

---

## Demo Data

### Authorized Contacts (8 total)
1. **Ramu Kaka** - 9876543210 (Seller, Fresh Farm Produce)
2. **Shanti Devi** - 9123456789 (Seller, Handmade Crafts)
3. **Bhaiya Ji** - 8765432109 (Seller, Local Honey & Products)
4. **Priya Sharma** - 7654321098 (Buyer)
5. **Vikram Singh** - 9988776655 (Buyer)
6. **Asha Verma** - 8899776655 (Seller, Organic Vegetables)
7. **Rohit Patel** - 7766554433 (Buyer)
8. **Meera Dutta** - 6677889900 (Seller, Spices & Seasonings)

### Indian Operators
- **9** → Jio/Airtel/VI (Orange #FF6B35)
- **8** → Vodafone/Airtel (Blue #004E89)
- **7** → Jio/BSNL (Orange #F77F00)
- **6** → BSNL/MTNL (Green #06A77D)

---

## Routes to Update

| Route | Component | Status |
|-------|-----------|--------|
| `/seller-orders` | SequentialOrderQueue | Ready |
| `/order/:id/receipt` | LegalReceiptGenerator | Ready |
| `/product/:id/reviews` | VerifiedReviews | Ready |
| `/contacts` | AuthorizedContacts | Done |
| `/` | RoleHome | Done |

---

## Testing Checklist

### Phone Validation
- [ ] Valid Indian number (9876543210) → Success
- [ ] Invalid prefix (1234567890) → Error
- [ ] Short number (123456) → Error
- [ ] Authorized contact detection (Ramu Kaka) → Shows name
- [ ] New number (9999888877) → New user

### Sequential Order Queue
- [ ] Orders sorted by creation time (oldest first)
- [ ] First pending order highlighted with "NEXT" badge
- [ ] Status indicators colored correctly
- [ ] Action buttons visible when expanded
- [ ] Commission calculation correct (95% seller)
- [ ] Quick messages display properly

### Legal Receipt Generator
- [ ] Receipt ID generated and tamper-proof
- [ ] Seller signature canvas works
- [ ] PDF download creates valid PDF
- [ ] WhatsApp share shows message
- [ ] All items and amounts display correctly
- [ ] Terms and conditions visible

### Verified Reviews
- [ ] Only completed orders can review
- [ ] Star rating selector works
- [ ] Photo upload button visible
- [ ] Review form shows for eligible users
- [ ] Rating distribution calculated correctly
- [ ] Average rating displayed

---

## Common Issues & Solutions

### Issue: Zustand store not accessible
**Solution:** Import at top of component:
```jsx
import { useStore } from '../store';
```

### Issue: Orders not showing in queue
**Solution:** Ensure orders exist in store with proper structure:
```jsx
{ id, buyerId, sellerId, status, items, totalAmount, createdAt }
```

### Issue: Receipt PDF not downloading
**Solution:** Check browser console, may need html2canvas/jsPDF imports

### Issue: Phone validation not working
**Solution:** Use exactly 10 digits, no +91 prefix in validation

---

## Environment Setup

### Dependencies Already Installed
```json
{
  "react": "^19.2.5",
  "framer-motion": "^12.38.0",
  "zustand": "^5.0.12",
  "react-leaflet": "^5.0.0",
  "html2canvas": "^1.4.1",
  "react-i18next": "^17.0.6"
}
```

### Optional Additions (if needed)
```bash
npm install jspdf  # For PDF generation
```

---

## Performance Notes

- **SequentialOrderQueue:** Uses memo for list items
- **VerifiedReviews:** Lazy loads photos
- **LegalReceiptGenerator:** HTML2Canvas can be slow for large receipts
- **indianPhoneUtils:** Zero dependencies, very fast

---

**Last Updated:** May 13, 2026  
**Platform:** Local Bazaar (SHUDDH PRD Implementation)
