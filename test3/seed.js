const { connectDatabase, mongoose } = require('./backend/src/config/db');
const Product = require('./backend/src/models/Product');
const { resetAndSeedDatabase } = require('./backend/src/services/seedService');

async function seedDatabase() {
  try {
    await connectDatabase();
    const inserted = await resetAndSeedDatabase();

    console.log(`Successfully inserted ${inserted.length} products`);

    const allProducts = await Product.find();
    console.log('\nProducts in database:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock})`);
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
