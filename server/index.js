const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, 'localbazaar.db');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'Local Bazaar backend running',
    api: '/api/products',
    message: 'Use /api routes for product, order, receipt, review, and user endpoints.'
  });
});

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open database', err);
    process.exit(1);
  }
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve(this);
  });
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

const initialize = async () => {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT UNIQUE,
    role TEXT,
    language TEXT,
    shopName TEXT,
    shopStory TEXT,
    lat REAL,
    lng REAL,
    upiId TEXT
  );`);

  await run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    distance TEXT,
    lat REAL,
    lng REAL,
    seller TEXT,
    verified INTEGER,
    image TEXT,
    media TEXT,
    views INTEGER
  );`);

  await run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    buyerId TEXT,
    sellerId TEXT,
    buyerName TEXT,
    buyerPhone TEXT,
    buyerLat REAL,
    buyerLng REAL,
    sellerName TEXT,
    sellerPhone TEXT,
    sellerLat REAL,
    sellerLng REAL,
    deliveryLocation TEXT,
    items TEXT,
    totalAmount REAL,
    status TEXT,
    createdAt TEXT,
    paymentMethod TEXT,
    signature TEXT
  );`);

  await run(`CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT,
    sellerPhone TEXT,
    buyerPhone TEXT,
    amount REAL,
    receiptData TEXT,
    createdAt TEXT
  );`);

  await run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT,
    buyerName TEXT,
    sellerName TEXT,
    rating INTEGER,
    comment TEXT,
    photos TEXT,
    createdAt TEXT
  );`);

  const productCount = await get('SELECT COUNT(*) AS count FROM products');
  if (productCount.count === 0) {
    const products = [
      { id: 1, name: 'Fresh Farm Tomatoes', price: 40, distance: '1.2 km', lat: 28.7090, lng: 77.1080, seller: 'Ramu Kaka', verified: 1, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', media: JSON.stringify(['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400']), views: 120 },
      { id: 2, name: 'Handmade Clay Pots', price: 150, distance: '0.8 km', lat: 28.7040, lng: 77.1000, seller: 'Shanti Devi', verified: 1, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400', media: JSON.stringify(['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400']), views: 85 },
      { id: 3, name: 'Local Honey', price: 250, distance: '3.5 km', lat: 28.7200, lng: 77.1200, seller: 'Bhaiya Ji', verified: 1, image: 'https://images.unsplash.com/photo-1587049352847-4d4b1ed74dd7?w=400', media: JSON.stringify(['https://images.unsplash.com/photo-1587049352847-4d4b1ed74dd7?w=400']), views: 210 }
    ];

    const insertProduct = db.prepare(`INSERT INTO products (id, name, price, distance, lat, lng, seller, verified, image, media, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    products.forEach((p) => insertProduct.run([p.id, p.name, p.price, p.distance, p.lat, p.lng, p.seller, p.verified, p.image, p.media, p.views]));
    insertProduct.finalize();
  }
};

app.get('/api/products', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM products ORDER BY id ASC');
    const products = rows.map((row) => ({
      ...row,
      verified: Boolean(row.verified),
      location: { lat: row.lat, lng: row.lng },
      media: JSON.parse(row.media || '[]')
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/orders', async (req, res) => {
  const { buyerPhone, sellerPhone } = req.query;
  let sql = 'SELECT * FROM orders';
  const params = [];

  if (buyerPhone) {
    sql += ' WHERE buyerPhone = ?';
    params.push(buyerPhone);
  } else if (sellerPhone) {
    sql += ' WHERE sellerPhone = ?';
    params.push(sellerPhone);
  }

  try {
    const rows = await all(sql, params);
    const orders = rows.map((row) => ({
      ...row,
      items: JSON.parse(row.items || '[]'),
      buyerLocation: row.buyerLat && row.buyerLng ? { lat: row.buyerLat, lng: row.buyerLng } : null,
      sellerLocation: row.sellerLat && row.sellerLng ? { lat: row.sellerLat, lng: row.sellerLng } : null
    }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  const {
    id,
    buyerId,
    sellerId,
    buyerName,
    buyerPhone,
    buyerLocation,
    sellerName,
    sellerPhone,
    sellerLocation,
    deliveryLocation,
    items,
    totalAmount,
    status,
    createdAt,
    paymentMethod,
    product
  } = req.body;

  const orderId = id || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  const payload = {
    id: orderId,
    buyerId,
    sellerId,
    buyerName,
    buyerPhone,
    buyerLat: buyerLocation?.lat || null,
    buyerLng: buyerLocation?.lng || null,
    sellerName,
    sellerPhone,
    sellerLat: sellerLocation?.lat || product?.location?.lat || null,
    sellerLng: sellerLocation?.lng || product?.location?.lng || null,
    deliveryLocation,
    items: JSON.stringify(items || []),
    totalAmount,
    status: status || 'pending',
    createdAt: createdAt || new Date().toISOString(),
    paymentMethod,
    signature: null
  };

  try {
    await run(
      `INSERT INTO orders (id, buyerId, sellerId, buyerName, buyerPhone, buyerLat, buyerLng, sellerName, sellerPhone, sellerLat, sellerLng, deliveryLocation, items, totalAmount, status, createdAt, paymentMethod, signature)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.id,
        payload.buyerId,
        payload.sellerId,
        payload.buyerName,
        payload.buyerPhone,
        payload.buyerLat,
        payload.buyerLng,
        payload.sellerName,
        payload.sellerPhone,
        payload.sellerLat,
        payload.sellerLng,
        payload.deliveryLocation,
        payload.items,
        payload.totalAmount,
        payload.status,
        payload.createdAt,
        payload.paymentMethod,
        payload.signature
      ]
    );

    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    const order = await get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.get('/api/receipts', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM receipts ORDER BY createdAt DESC');
    res.json(rows.map((row) => ({
      ...row,
      receiptData: JSON.parse(row.receiptData || '{}')
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load receipts' });
  }
});

app.post('/api/receipts', async (req, res) => {
  const { orderId, sellerPhone, buyerPhone, amount, receiptData } = req.body;
  try {
    const createdAt = new Date().toISOString();
    const result = await run(
      'INSERT INTO receipts (orderId, sellerPhone, buyerPhone, amount, receiptData, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, sellerPhone, buyerPhone, amount, JSON.stringify(receiptData), createdAt]
    );
    res.json({ id: result.lastID, orderId, sellerPhone, buyerPhone, amount, receiptData, createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save receipt' });
  }
});

app.get('/api/reviews', async (req, res) => {
  const { sellerName, buyerName, orderId } = req.query;
  const filters = [];
  let sql = 'SELECT * FROM reviews';
  if (sellerName) filters.push(`sellerName = '${sellerName.replace("'", "''")}'`);
  if (buyerName) filters.push(`buyerName = '${buyerName.replace("'", "''")}'`);
  if (orderId) filters.push(`orderId = '${orderId.replace("'", "''")}'`);
  if (filters.length) sql += ' WHERE ' + filters.join(' AND ');
  sql += ' ORDER BY createdAt DESC';

  try {
    const rows = await all(sql);
    res.json(rows.map((row) => ({
      ...row,
      photos: JSON.parse(row.photos || '[]')
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load reviews' });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { orderId, buyerName, sellerName, rating, comment, photos } = req.body;
  try {
    const createdAt = new Date().toISOString();
    const result = await run(
      'INSERT INTO reviews (orderId, buyerName, sellerName, rating, comment, photos, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orderId, buyerName, sellerName, rating, comment, JSON.stringify(photos || []), createdAt]
    );
    res.json({ id: result.lastID, orderId, buyerName, sellerName, rating, comment, photos: photos || [], createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { phone, name, role, language, shopDetails, location, upiId } = req.body;
  try {
    const user = await get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (user) {
      return res.json({
        ...user,
        location: { lat: user.lat, lng: user.lng },
        shopDetails: { name: user.shopName, story: user.shopStory }
      });
    }

    const result = await run(
      'INSERT INTO users (name, phone, role, language, shopName, shopStory, lat, lng, upiId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, phone, role, language || 'en', shopDetails?.name || null, shopDetails?.story || null, location?.lat || null, location?.lng || null, upiId || null]
    );

    const newUser = await get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    res.json({
      ...newUser,
      location: { lat: newUser.lat, lng: newUser.lng },
      shopDetails: { name: newUser.shopName, story: newUser.shopStory }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login user' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Local Bazaar backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Initialization error', err);
    process.exit(1);
  });
