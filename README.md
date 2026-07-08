# 🛒 E-Commerce API

A complete RESTful API for e-commerce applications with Products, Categories, Cart, and Order management built with Node.js, Express, and MongoDB.

## ✨ Features

- ✅ Category Management (CRUD)
- ✅ Product Management (CRUD with filtering, sorting, pagination)
- ✅ Shopping Cart (Add, update, remove items)
- ✅ Order Management (Create, view, update status)
- ✅ Stock Management (Auto-reduces on order)
- ✅ MongoDB with Mongoose ODM
- ✅ Error Handling Middleware (AppError, asyncHandler)
- ✅ Environment Configuration
- ✅ Database Seeding (3+ Categories, 6+ Products)

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **dotenv** - Environment variables
- **express-mongo-sanitize** - Security middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## 🚀 Installation

```bash
# 1. Clone the repository
git clone (https://github.com/demonkeo-creator/e-commerce-api.git)
cd ecommerce-api

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# 4. Start MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 5. Seed the database
npm run seed

# 6. Start the server
npm run dev

📋 Complete Postman Test Commands (With Your IDs)
🔹 1. Health Check
text
GET http://localhost:5000/health
🔹 2. Categories
Get All Categories:
text
GET http://localhost:5000/api/categories
Create Category:
text
POST http://localhost:5000/api/categories
json
{
  "name": "Gaming",
  "description": "Video games and gaming accessories"
}
Get Single Category:
text
GET http://localhost:5000/api/categories/6a4a7152e27048bbda0bdae3
Update Category:
text
PUT http://localhost:5000/api/categories/6a4a7152e27048bbda0bdae3
json
{
  "name": "Electronics & Gadgets",
  "description": "Updated description"
}
Delete Category:
text
DELETE http://localhost:5000/api/categories/6a4a7152e27048bbda0bdae3
🔹 3. Products
Get All Products:
text
GET http://localhost:5000/api/products
Get Products with Filters:
text
GET http://localhost:5000/api/products?page=1&limit=10&search=iPhone&minPrice=500&maxPrice=1500&sortBy=price:desc
Get Single Product:
text
GET http://localhost:5000/api/products/6a4a7152e27048bbda0bdae9
Create Product:
text
POST http://localhost:5000/api/products
json
{
  "name": "PlayStation 5",
  "description": "Next-gen gaming console",
  "price": 499.99,
  "category": "6a4a7152e27048bbda0bdae3",
  "stock": 30,
  "brand": "Sony",
  "isFeatured": true
}
Update Product:
text
PUT http://localhost:5000/api/products/6a4a7152e27048bbda0bdae9
json
{
  "name": "iPhone 15 Pro Max",
  "price": 1099.99,
  "stock": 45
}
Update Product Stock:
text
PATCH http://localhost:5000/api/products/6a4a7152e27048bbda0bdae9/stock
json
{
  "stock": 50
}
Delete Product:
text
DELETE http://localhost:5000/api/products/6a4a7152e27048bbda0bdae9
🔹 4. Cart
Get Cart:
text
GET http://localhost:5000/api/cart?userId=67c4e8a2b1d5c3e9f8a7b6c5
Add iPhone to Cart:
text
POST http://localhost:5000/api/cart?userId=67c4e8a2b1d5c3e9f8a7b6c5
json
{
  "productId": "6a4a7152e27048bbda0bdae9",
  "quantity": 2
}
Add Samsung to Cart:
text
POST http://localhost:5000/api/cart?userId=67c4e8a2b1d5c3e9f8a7b6c5
json
{
  "productId": "6a4a7152e27048bbda0bdaea",
  "quantity": 1
}
Add MacBook to Cart:
text
POST http://localhost:5000/api/cart?userId=67c4e8a2b1d5c3e9f8a7b6c5
json
{
  "productId": "6a4a7152e27048bbda0bdaef",
  "quantity": 1
}
Update iPhone Quantity:
text
PUT http://localhost:5000/api/cart/6a4a7152e27048bbda0bdae9?userId=67c4e8a2b1d5c3e9f8a7b6c5
json
{
  "quantity": 5
}
Remove Samsung from Cart:
text
DELETE http://localhost:5000/api/cart/6a4a7152e27048bbda0bdaea?userId=67c4e8a2b1d5c3e9f8a7b6c5
Clear Cart:
text
DELETE http://localhost:5000/api/cart?userId=67c4e8a2b1d5c3e9f8a7b6c5
🔹 5. Orders
Create Order:
text
POST http://localhost:5000/api/orders?userId=67c4e8a2b1d5c3e9f8a7b6c5
json
{
  "shippingAddress": {
    "address": "123 Main Street",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
Get All Orders:
text
GET http://localhost:5000/api/orders?userId=67c4e8a2b1d5c3e9f8a7b6c5
Get Your Order:
text
GET http://localhost:5000/api/orders/6a4a78befa892dd9a13fbe25
Update Order Status to Processing:
text
PUT http://localhost:5000/api/orders/6a4a78befa892dd9a13fbe25/status
json
{
  "status": "processing"
}
Update Order Status to Shipped:
text
PUT http://localhost:5000/api/orders/6a4a78befa892dd9a13fbe25/status
json
{
  "status": "shipped"
}
Mark Order as Paid:
text
PUT http://localhost:5000/api/orders/6a4a78befa892dd9a13fbe25/pay
json
{
  "id": "pay_12345",
  "email": "customer@example.com"
}
Update Order Status to Delivered:
text
PUT http://localhost:5000/api/orders/6a4a78befa892dd9a13fbe25/status
json
{
  "status": "delivered"
}
Cancel Order:
text
PUT http://localhost:5000/api/orders/6a4a78befa892dd9a13fbe25/status
json
{
  "status": "cancelled"
}
