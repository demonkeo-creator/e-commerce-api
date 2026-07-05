const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database before listening
connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`  - Categories: http://localhost:${PORT}/api/categories`);
  console.log(`  - Products:   http://localhost:${PORT}/api/products`);
  console.log(`  - Cart:       http://localhost:${PORT}/api/cart`);
  console.log(`  - Orders:     http://localhost:${PORT}/api/orders`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});