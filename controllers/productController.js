const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../middleware/AppError');

// @desc    Get all products with filtering
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtering
  const filter = {};
  
  // Search filter
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }
  
  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }
  
  // Stock filter
  if (req.query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  // Sorting
  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('category', 'name description');

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    count: products.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: products
  });
});

// @desc    Get single product with populated category
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name description');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

// @desc    Create product with category validation
// @route   POST /api/products
// @access  Public (Admin only in production)
exports.createProduct = asyncHandler(async (req, res) => {
  // Check if category exists - returns 404 if missing
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      throw new AppError('Category not found. Please provide a valid category ID.', 404);
    }
  }

  const product = await Product.create(req.body);
  await product.populate('category', 'name');

  res.status(201).json({
    status: 'success',
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public (Admin only in production)
exports.updateProduct = asyncHandler(async (req, res) => {
  // Validate category if being updated
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      throw new AppError('Category not found. Please provide a valid category ID.', 404);
    }
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name');

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public (Admin only in production)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await product.deleteOne();
  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Public
exports.updateStock = asyncHandler(async (req, res) => {
  const { stock } = req.body;
  if (stock === undefined) {
    throw new AppError('Please provide stock quantity', 400);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});