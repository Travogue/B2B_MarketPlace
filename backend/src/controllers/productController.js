const Product = require('../models/Product');
const Company = require('../models/Company');
const Category = require('../models/Category');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createSlug } = require('../utils/slugify');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const buildProductFilter = (query, user) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  } else if (user?.role === 'seller') {
    // sellers see all their products
  } else {
    filter.status = 'approved';
  }

  if (query.category) filter.category = query.category;
  if (query.subcategory) filter.subcategory = query.subcategory;
  if (query.company) filter.company = query.company;
  if (query.seller) filter.seller = query.seller;
  if (query.isFeatured === 'true') filter.isFeatured = true;
  if (query.isTrending === 'true') filter.isTrending = true;
  if (query.minPrice || query.maxPrice) {
    filter['priceRange.min'] = {};
    if (query.minPrice) filter['priceRange.min'].$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter['priceRange.max'] = { $lte: parseFloat(query.maxPrice) };
  }
  if (query.search) filter.$text = { $search: query.search };
  if (query.tags) filter.tags = { $in: query.tags.split(',') };

  return filter;
};

exports.getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const filter = buildProductFilter(req.query, req.user);

  if (req.user?.role === 'seller' && !req.query.status) {
    filter.seller = req.user._id;
  }

  const sortMap = {
    price_asc: 'priceRange.min',
    price_desc: '-priceRange.max',
    newest: '-createdAt',
    popular: '-viewCount',
    rating: '-rating',
  };
  const sort = sortMap[req.query.sort] || '-createdAt';

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('company', 'companyName slug logo isVerified rating')
      .skip(skip)
      .limit(limit)
      .sort(sort),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(new ApiResponse(200, {
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }));
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .populate('company', 'companyName slug logo isVerified rating address contactPhone contactEmail')
    .populate('seller', 'name email phone');

  if (!product) throw new ApiError(404, 'Product not found');

  product.viewCount += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, product));
});

exports.createProduct = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) throw new ApiError(400, 'Please complete your company profile first');

  const slug = createSlug(`${req.body.name}-${Date.now()}`);
  const product = await Product.create({
    ...req.body,
    slug,
    seller: req.user._id,
    company: company._id,
    status: 'pending',
  });

  company.productCount += 1;
  await company.save();

  res.status(201).json(new ApiResponse(201, product, 'Product created and pending approval'));
});

exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
  if (!product && req.user.role === 'super_admin') {
    product = await Product.findById(req.params.id);
  }
  if (!product) throw new ApiError(404, 'Product not found');

  Object.assign(product, req.body);
  if (req.body.name) product.slug = createSlug(`${req.body.name}-${product._id}`);
  if (req.user.role !== 'super_admin') product.status = 'pending';
  await product.save();

  res.status(200).json(new ApiResponse(200, product, 'Product updated'));
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
  if (!product && req.user.role !== 'super_admin') throw new ApiError(404, 'Product not found');

  const toDelete = product || await Product.findById(req.params.id);
  for (const img of toDelete.images) {
    if (img.publicId) await deleteFromCloudinary(img.publicId);
  }

  await toDelete.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Product deleted'));
});

exports.uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'Please upload images');

  const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
  if (!product) throw new ApiError(404, 'Product not found');

  const uploaded = [];
  for (const file of req.files) {
    const result = await uploadToCloudinary(file.buffer, 'products');
    uploaded.push({
      url: result.secure_url,
      publicId: result.public_id,
      alt: product.name,
      isPrimary: product.images.length === 0 && uploaded.length === 0,
    });
  }

  product.images.push(...uploaded);
  await product.save();

  res.status(200).json(new ApiResponse(200, product.images, 'Images uploaded'));
});

exports.approveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      rejectionReason: req.body.rejectionReason,
    },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');
  res.status(200).json(new ApiResponse(200, product, 'Product status updated'));
});

exports.getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'approved', isTrending: true })
    .populate('company', 'companyName slug logo isVerified')
    .limit(8)
    .sort('-viewCount');
  res.status(200).json(new ApiResponse(200, products));
});

exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'approved', isFeatured: true })
    .populate('company', 'companyName slug logo isVerified')
    .limit(8)
    .sort('-createdAt');
  res.status(200).json(new ApiResponse(200, products));
});
