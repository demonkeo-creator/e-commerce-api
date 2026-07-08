// Sample Data for Seeding

// Categories
const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Clothing', description: 'Fashion and apparel' },
  { name: 'Books', description: 'Books and educational materials' },
  { name: 'Home & Garden', description: 'Furniture and home decor' },
  { name: 'Sports', description: 'Sports equipment and gear' },
  { name: 'Toys', description: 'Toys and games for all ages' }
];

// Products
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

module.exports = { categories, products };