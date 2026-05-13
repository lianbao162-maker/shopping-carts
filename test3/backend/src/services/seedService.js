const Product = require('../models/Product');
const sampleProducts = require('../data/sampleProducts');

async function seedDatabaseIfEmpty() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log('Auto-seeded sample products:', sampleProducts.length);
  }
}

async function resetAndSeedDatabase() {
  await Product.deleteMany({});
  const inserted = await Product.insertMany(sampleProducts);
  return inserted;
}

module.exports = {
  seedDatabaseIfEmpty,
  resetAndSeedDatabase
};
