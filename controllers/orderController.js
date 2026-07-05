const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../middleware/AppError');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
  const userId = req.query.userId || '67c4e8a2b1d5c3e9f8a7b6c5';
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    throw new AppError('Please provide shipping address and payment method', 400);
  }

  // Get user's cart with populated products
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty. Cannot create order.', 400);
  }

  // Validate stock availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product) {
      throw new AppError(`Product ${item.product.name} not found`, 404);
    }
    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        400
      );
    }
  }

  // Create order items with name/price snapshot
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.price
  }));

  // Calculate totals
  const subtotal = cart.totalPrice;
  const taxPrice = subtotal * 0.1; // 10% tax
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  // Reduce stock for each product
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(
      item.product._id,
      { $inc: { stock: -item.quantity } }
    );
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: order
  });
});

// @desc    Get all user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res) => {
  const userId = req.query.userId || '67c4e8a2b1d5c3e9f8a7b6c5';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('items.product', 'name images');

  const total = await Order.countDocuments({ user: userId });

  res.status(200).json({
    status: 'success',
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name images price');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});

// @desc    Update order status - validates enum
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    throw new AppError('Please provide status', 400);
  }

  const validStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatus.includes(status)) {
    throw new AppError(
      `Invalid status. Must be one of: ${validStatus.join(', ')}`,
      400
    );
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.status = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    data: order
  });
});

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updatePayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id || 'pay_' + Date.now(),
    status: 'completed',
    update_time: new Date().toISOString(),
    email_address: req.body.email || 'customer@example.com'
  };

  await order.save();

  res.status(200).json({
    status: 'success',
    data: order
  });
});