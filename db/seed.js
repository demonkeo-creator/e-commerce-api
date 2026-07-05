const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

dotenv.config();

// Sample Data - At least 3 Categories
const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Books', description: 'Books and educational materials' },
  { name: 'Home & Garden', description: 'Furniture and home decor' },
  { name: 'Sports', description: 'Sports equipment and gear' },
  { name: 'Toys', description: 'Toys and games for all ages' }
];

// Sample Data - At least 6 Products
const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium frame and A17 chip',
    price: 999.99,
    category: 'Electronics',
    stock: 50,
    brand: 'Apple',
    images: ['iphone15.jpg'],
    isFeatured: true
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone with AI features',
    price: 899.99,
    category: 'Electronics',
    stock: 30,
    brand: 'Samsung',
    images: ['samsung-s24.jpg']
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with air cushioning',
    price: 149.99,
    category: 'Clothing',
    stock: 100,
    brand: 'Nike',
    images: ['nike-airmax.jpg']
  },
  {
    name: "Levi's 501 Jeans",
    description: 'Classic straight fit jeans with original styling',
    price: 89.99,
    category: 'Clothing',
    stock: 200,
    brand: "Levi's",
    images: ['levis-501.jpg']
  },
  {
    name: 'The Pragmatic Programmer',
    description: 'Your journey to mastery in software development',
    price: 39.99,
    category: 'Books',
    stock: 150,
    brand: 'Addison-Wesley',
    images: ['pragmatic.jpg']
  },
  {
    name: 'Dyson V15 Vacuum',
    description: 'Cordless vacuum with laser detection technology',
    price: 699.99,
    category: 'Home & Garden',
    stock: 25,
    brand: 'Dyson',
    images: ['dyson-v15.jpg']
  },
  {
    name: 'MacBook Pro 14"',
    description: 'Apple M3 Pro chip, 16GB RAM, 512GB SSD',
    price: 1999.99,
    category: 'Electronics',
    stock: 20,
    brand: 'Apple',
    images: ['macbook-pro.jpg'],
    isFeatured: true
  }
];

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