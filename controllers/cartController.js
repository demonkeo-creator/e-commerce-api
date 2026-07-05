const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../middleware/AppError');

// Helper to calculate totalPrice
const calculateTotal = (cart) => {
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.query.userId || '67c4e8a2b1d5c3e9f8a7b6c5';
  
  let cart = await Cart.findOne({ user: userId });
  
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.query.userId || '67c4e8a2b1d5c3e9f8a7b6c5';

  if (!productId || !quantity) {
    throw new AppError('Please provide productId and quantity', 400);
  }

  // Validate stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  if (product.stock < quantity) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Increase quantity if already in cart
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item with price snapshot
    cart.items.push({
      product: productId,
      quantity: quantity,
      price: product.price
    });
  }

  calculateTotal(cart);
  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.query.userId || '67c4e8a2b1d5c3e9f8a7b6c5';

  if (!quantity || quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new AppError('Product not in cart', 404);
  }

  cart.items[itemIndex].quantity = quantity;
  calculateTotal(cart);
  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.query.userId || '67c4e8a2b1d5c3e9f8a7b6c5';

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  calculateTotal(cart);
  await cart.save();
  await cart.populate('items.product', 'name price images stock');

  res.status(200).json({
    status: 'success',
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.query.userId || '67c4e8a2b1d5c3e9f8a7b6c5';

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  cart.items = [];
  calculateTotal(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully',
    data: cart
  });
});