const mongoose = require('mongoose');

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

const Product = mongoose.model('Product', productSchema);

// Sample products with real Unsplash photos
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

async function seedDatabase() {
  try {
    await Product.deleteMany({});
    console.log('Cleared existing products');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✓ Successfully inserted ${inserted.length} products`);

    const allProducts = await Product.find();
    console.log('\nProducts in database:');
    allProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - $${p.price} (Stock: ${p.stock})`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedDatabase();
