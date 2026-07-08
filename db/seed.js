const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { categories, products } = require('../utils/seedData');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Cleanup order: Orders → Cart → Products → Categories
    await Order.deleteMany();
    console.log('🗑️  Orders cleared');
    await Cart.deleteMany();
    console.log('🗑️  Cart cleared');
    await Product.deleteMany();
    console.log('🗑️  Products cleared');
    await Category.deleteMany();
    console.log('🗑️  Categories cleared');

    // Seed Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories seeded`);

    // Map categories to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Seed Products with category reference
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ ${createdProducts.length} products seeded`);

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`  - ${createdCategories.length} Categories`);
    console.log(`  - ${createdProducts.length} Products`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();