const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.createInquiry = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.product).populate('company');
  if (!product) throw new ApiError(404, 'Product not found');

  const inquiry = await Inquiry.create({
    ...req.body,
    buyer: req.user._id,
    seller: product.seller,
    company: product.company._id,
  });

  product.inquiryCount += 1;
  await product.save({ validateBeforeSave: false });

  await Notification.create({
    recipient: product.seller,
    type: 'inquiry',
    title: 'New Inquiry Received',
    message: `${req.user.name} sent an inquiry for ${product.name}`,
    link: `/seller/inquiries/${inquiry._id}`,
    metadata: { inquiryId: inquiry._id },
  });

  res.status(201).json(new ApiResponse(201, inquiry, 'Inquiry submitted successfully'));
});

exports.getMyInquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = req.user.role === 'seller'
    ? { seller: req.user._id }
    : { buyer: req.user._id };

  if (req.query.status) filter.status = req.query.status;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('product', 'name slug images priceRange')
      .populate('buyer', 'name email phone')
      .populate('company', 'companyName slug logo')
      .populate('quotations')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Inquiry.countDocuments(filter),
  ]);

  res.status(200).json(new ApiResponse(200, {
    inquiries,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }));
});

exports.getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('product')
    .populate('buyer', 'name email phone')
    .populate('seller', 'name email phone')
    .populate('company')
    .populate({ path: 'quotations', populate: { path: 'seller', select: 'name' } });

  if (!inquiry) throw new ApiError(404, 'Inquiry not found');

  const isAuthorized =
    inquiry.buyer._id.toString() === req.user._id.toString() ||
    inquiry.seller._id.toString() === req.user._id.toString() ||
    req.user.role === 'super_admin';

  if (!isAuthorized) throw new ApiError(403, 'Access denied');

  res.status(200).json(new ApiResponse(200, inquiry));
});

exports.updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');

  inquiry.status = req.body.status;
  await inquiry.save();

  res.status(200).json(new ApiResponse(200, inquiry, 'Inquiry status updated'));
});

exports.getAllInquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [inquiries, total] = await Promise.all([
    Inquiry.find()
      .populate('product', 'name')
      .populate('buyer', 'name email')
      .populate('company', 'companyName')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Inquiry.countDocuments(),
  ]);

  res.status(200).json(new ApiResponse(200, {
    inquiries,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }));
});
