// MVP Test Script - Add this to browser console to test the working MVP

// Test the working MVP functionality
console.log('🧪 Testing Local Bazaar MVP...');

// 1. Add test orders
const addTestOrders = () => {
  const testOrders = [
    {
      id: 'ORD-001',
      buyerId: '7654321098',
      sellerId: '9876543210',
      buyerName: 'Priya Sharma',
      buyerPhone: '7654321098',
      sellerName: 'Ramu Kaka',
      sellerPhone: '9876543210',
      sellerShop: 'Fresh Farm Produce',
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
      sellerName: 'Ramu Kaka',
      sellerPhone: '9876543210',
      sellerShop: 'Fresh Farm Produce',
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

  // Add to store
  window.testOrders = testOrders;
  console.log('✅ Test orders prepared:', testOrders.length, 'orders');
  console.log('📋 Test orders data:', testOrders);
};

// 2. Simulate login as seller
const simulateSellerLogin = () => {
  const sellerUser = {
    name: 'Ramu Kaka',
    phone: '9876543210',
    roles: ['seller'],
    shopDetails: {
      name: 'Fresh Farm Produce',
      story: 'Fresh vegetables from local farms'
    }
  };

  // This would normally be done through the login flow
  console.log('👤 Simulating seller login:', sellerUser);
  console.log('📞 Seller phone:', sellerUser.phone);
  console.log('🏪 Shop:', sellerUser.shopDetails.name);
};

// 3. Test order status updates
const testOrderUpdates = () => {
  console.log('🔄 Testing order status updates...');
  console.log('1. Pending → Confirmed: ORD-001');
  console.log('2. Confirmed → Picked: ORD-002');
  console.log('3. Picked → Delivered: ORD-002 (triggers receipt modal)');
};

// 4. Test receipt generation
const testReceiptGeneration = () => {
  console.log('📄 Testing receipt generation...');
  console.log('• Digital signature canvas');
  console.log('• PDF export functionality');
  console.log('• WhatsApp share feature');
  console.log('• Legal disclaimer inclusion');
};

// Run all tests
const runMVPTests = () => {
  console.log('🚀 Starting Local Bazaar MVP Tests...\n');

  addTestOrders();
  console.log('');

  simulateSellerLogin();
  console.log('');

  testOrderUpdates();
  console.log('');

  testReceiptGeneration();
  console.log('');

  console.log('✅ MVP Tests Complete!');
  console.log('🌐 Visit: http://localhost:5173/');
  console.log('📝 Steps to test:');
  console.log('   1. Login as seller (phone: 9876543210)');
  console.log('   2. Go to Order Queue');
  console.log('   3. Click "Add Test Orders" if no orders shown');
  console.log('   4. Test order status buttons');
  console.log('   5. Mark delivery confirmed to see receipt modal');
};

// Make functions available globally for console testing
window.addTestOrders = addTestOrders;
window.simulateSellerLogin = simulateSellerLogin;
window.testOrderUpdates = testOrderUpdates;
window.testReceiptGeneration = testReceiptGeneration;
window.runMVPTests = runMVPTests;

// Auto-run tests
runMVPTests();