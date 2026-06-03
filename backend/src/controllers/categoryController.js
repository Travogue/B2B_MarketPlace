const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createSlug } = require('../utils/slugify');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

exports.getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort('order name');
  res.status(200).json(new ApiResponse(200, categories));
});

exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(404, 'Category not found');

  const subcategories = await Subcategory.find({ category: category._id, isActive: true }).sort('order');
  res.status(200).json(new ApiResponse(200, { category, subcategories }));
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    ...req.body,
    slug: createSlug(req.body.name),
  });
  res.status(201).json(new ApiResponse(201, category, 'Category created'));
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { ...req.body, slug: req.body.name ? createSlug(req.body.name) : undefined },
    { new: true, runValidators: true }
  );
  if (!category) throw new ApiError(404, 'Category not found');
  res.status(200).json(new ApiResponse(200, category, 'Category updated'));
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  await Subcategory.deleteMany({ category: category._id });
  res.status(200).json(new ApiResponse(200, null, 'Category deleted'));
});

exports.getSubcategories = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  const subcategories = await Subcategory.find(filter).populate('category', 'name slug').sort('order');
  res.status(200).json(new ApiResponse(200, subcategories));
});

exports.createSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.create({
    ...req.body,
    slug: createSlug(req.body.name),
  });
  res.status(201).json(new ApiResponse(201, subcategory, 'Subcategory created'));
});

exports.updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!subcategory) throw new ApiError(404, 'Subcategory not found');
  res.status(200).json(new ApiResponse(200, subcategory, 'Subcategory updated'));
});

exports.deleteSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
  if (!subcategory) throw new ApiError(404, 'Subcategory not found');
  res.status(200).json(new ApiResponse(200, null, 'Subcategory deleted'));
});

exports.uploadCategoryImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please upload an image');
  const result = await uploadToCloudinary(req.file.buffer, 'categories');
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { image: result.secure_url },
    { new: true }
  );
  res.status(200).json(new ApiResponse(200, category, 'Image uploaded'));
});
