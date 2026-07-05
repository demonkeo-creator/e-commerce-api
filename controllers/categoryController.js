const Category = require('../models/Category');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../middleware/AppError');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: 'success',
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category with products
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  await category.populate('products');

  res.status(200).json({
    status: 'success',
    data: category
  });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Public (Admin only in production)
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    status: 'success',
    data: category
  });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Public (Admin only in production)
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: category
  });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Public (Admin only in production)
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    throw new AppError(
      `Cannot delete category. It has ${productCount} products associated with it.`,
      400
    );
  }

  await category.deleteOne();
  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully'
  });
});