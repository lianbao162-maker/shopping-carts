const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');

app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageURL: String,
  description: String,
  stock: Number
});

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number
});

const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

// Sample products data
const sampleProducts = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    imageURL: '/pic/Wireless headphones.jpg',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    stock: 15
  },
  {
    name: 'USB-C Cable',
    price: 12.99,
    imageURL: '/pic/USB-C Cable.jpg',
    description: 'Durable 2-meter USB-C charging and data transfer cable.',
    stock: 50
  },
  {
    name: 'Phone Stand',
    price: 24.99,
    imageURL: '/pic/Phone Stand.jpg',
    description: 'Adjustable aluminum phone stand for desks and tables.',
    stock: 25
  },
  {
    name: 'Screen Protector Pack',
    price: 9.99,
    imageURL: '/pic/Screen Protector Pack.jpg',
    description: 'Pack of 3 tempered glass screen protectors.',
    stock: 100
  },
  {
    name: 'Portable Charger',
    price: 34.99,
    imageURL: '/pic/Portable Charger.jpg',
    description: '20000mAh portable charger with dual USB ports and LED display.',
    stock: 20
  },
  {
    name: 'Bluetooth Speaker',
    price: 49.99,
    imageURL: '/pic/Bluetooth Speaker.jpg',
    description: 'Waterproof portable Bluetooth speaker with 12-hour battery.',
    stock: 18
  }
];

// Auto-seed database on startup if empty
async function seedDatabaseIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Auto-seeding with sample products...');
      await Product.insertMany(sampleProducts);
      console.log('✓ Successfully auto-seeded ' + sampleProducts.length + ' products');
    }
  } catch (error) {
    console.error('Error during auto-seed:', error);
  }
}

// Routes
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/cart', async (req, res) => {
  const cartItems = await Cart.find().populate('productId');
  res.json(cartItems);
});

app.post('/cart', async (req, res) => {
  const { productId, quantity } = req.body;
  let item = await Cart.findOne({ productId });
  if (item) {
    item.quantity += quantity;
  } else {
    item = new Cart({ productId, quantity });
  }
  await item.save();
  res.json(item);
});

app.put('/cart/:id', async (req, res) => {
  const { quantity } = req.body;
  const item = await Cart.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
  res.json(item);
});

app.delete('/cart/:id', async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

app.delete('/cart', async (req, res) => {
  await Cart.deleteMany({});
  res.json({ message: 'Cart cleared' });
});

// Start server and auto-seed if needed
seedDatabaseIfEmpty().then(() => {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});