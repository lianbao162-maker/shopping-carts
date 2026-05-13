const express = require('express');
const cors = require('cors');
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

const rootDir = path.resolve(__dirname, '../../');
const publicDir = path.join(rootDir, 'frontend', 'public');
const picDir = path.join(rootDir, '..', 'pic');

app.use(cors());
app.use(express.json());

app.use(express.static(publicDir));
app.use('/pic', express.static(picDir));

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

module.exports = app;
