const Review = require('../models/Review');
const Company = require('../models/Company');
const Product = require('../models/Product');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const updateRating = async (Model, id) => {
  const stats = await Review.aggregate([
    { $match: { [Model.modelName === 'Company' ? 'company' : 'product']: id, isApproved: true } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const rating = stats[0]?.avgRating || 0;
  const count = stats[0]?.count || 0;
  await Model.findByIdAndUpdate(id, { rating: Math.round(rating * 10) / 10, reviewCount: count });
};

exports.createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({ ...req.body, reviewer: req.user._id });

  if (req.body.company) await updateRating(Company, req.body.company);
  if (req.body.product) await updateRating(Product, req.body.product);

  res.status(201).json(new ApiResponse(201, review, 'Review submitted'));
});

exports.getReviews = asyncHandler(async (req, res) => {
  const filter = { isApproved: true };
  if (req.query.company) filter.company = req.query.company;
  if (req.query.product) filter.product = req.query.product;

  const reviews = await Review.find(filter)
    .populate('reviewer', 'name avatar')
    .sort('-createdAt')
    .limit(parseInt(req.query.limit) || 10);

  res.status(200).json(new ApiResponse(200, reviews));
});

exports.getFeaturedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isApproved: true })
    .populate('reviewer', 'name avatar')
    .populate('company', 'companyName logo')
    .sort('-rating')
    .limit(6);
  res.status(200).json(new ApiResponse(200, reviews));
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  res.status(200).json(new ApiResponse(200, null, 'Review deleted'));
});
