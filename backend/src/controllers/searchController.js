const Product = require('../models/Product');
const Company = require('../models/Company');
const Category = require('../models/Category');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const Order = require('../models/Order');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

exports.globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(200).json(new ApiResponse(200, { products: [], companies: [], categories: [] }));

  const [products, companies, categories] = await Promise.all([
    Product.find({ $text: { $search: q }, status: 'approved' })
      .populate('company', 'companyName slug logo')
      .limit(8),
    Company.find({ $text: { $search: q }, verificationStatus: 'approved' }).limit(6),
    Category.find({ name: { $regex: q, $options: 'i' }, isActive: true }).limit(4),
  ]);

  res.status(200).json(new ApiResponse(200, { products, companies, categories }));
});

exports.getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalSellers,
    totalBuyers,
    pendingSellers,
    pendingProducts,
    totalProducts,
    totalInquiries,
    totalOrders,
    recentInquiries,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ role: 'buyer' }),
    Company.countDocuments({ verificationStatus: 'pending' }),
    Product.countDocuments({ status: 'pending' }),
    Product.countDocuments({ status: 'approved' }),
    Inquiry.countDocuments(),
    Order.countDocuments(),
    Inquiry.find().populate('product', 'name').populate('buyer', 'name').sort('-createdAt').limit(5),
  ]);

  res.status(200).json(new ApiResponse(200, {
    stats: {
      totalUsers,
      totalSellers,
      totalBuyers,
      pendingSellers,
      pendingProducts,
      totalProducts,
      totalInquiries,
      totalOrders,
    },
    recentInquiries,
  }));
});

exports.getSellerDashboard = asyncHandler(async (req, res) => {
  const [products, inquiries, quotations, orders] = await Promise.all([
    Product.countDocuments({ seller: req.user._id }),
    Inquiry.countDocuments({ seller: req.user._id }),
    Inquiry.countDocuments({ seller: req.user._id, status: 'open' }),
    Order.countDocuments({ seller: req.user._id }),
  ]);

  const recentInquiries = await Inquiry.find({ seller: req.user._id })
    .populate('product', 'name')
    .populate('buyer', 'name')
    .sort('-createdAt')
    .limit(5);

  const topProducts = await Product.find({ seller: req.user._id })
    .sort('-viewCount')
    .limit(5)
    .select('name viewCount inquiryCount');

  res.status(200).json(new ApiResponse(200, {
    stats: { products, inquiries, openInquiries: quotations, orders },
    recentInquiries,
    topProducts,
  }));
});

exports.getBuyerDashboard = asyncHandler(async (req, res) => {
  const [inquiries, orders, wishlistCount] = await Promise.all([
    Inquiry.countDocuments({ buyer: req.user._id }),
    Order.countDocuments({ buyer: req.user._id }),
    User.findById(req.user._id).select('wishlist'),
  ]);

  const recentInquiries = await Inquiry.find({ buyer: req.user._id })
    .populate('product', 'name slug images')
    .populate('company', 'companyName')
    .sort('-createdAt')
    .limit(5);

  res.status(200).json(new ApiResponse(200, {
    stats: {
      inquiries,
      orders,
      wishlistCount: wishlistCount?.wishlist?.length || 0,
    },
    recentInquiries,
  }));
});

exports.getReports = asyncHandler(async (req, res) => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({ month: date.getMonth() + 1, year: date.getFullYear() });
  }

  const inquiryTrend = await Promise.all(
    months.map(async ({ month, year }) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      const count = await Inquiry.countDocuments({ createdAt: { $gte: start, $lte: end } });
      return { month: `${year}-${String(month).padStart(2, '0')}`, count };
    })
  );

  res.status(200).json(new ApiResponse(200, { inquiryTrend }));
});
