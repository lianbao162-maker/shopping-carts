const app = require('./app');
const { connectDatabase } = require('./config/db');
const { seedDatabaseIfEmpty } = require('./services/seedService');
const { ensureDefaultAdmin } = require('./services/userService');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    await seedDatabaseIfEmpty();
    await ensureDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
