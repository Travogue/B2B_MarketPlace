const SubscriptionPlan = require('../models/SubscriptionPlan');
const Company = require('../models/Company');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createSlug } = require('../utils/slugify');

exports.getPlans = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const plans = await SubscriptionPlan.find(filter).sort('order price');
  res.status(200).json(new ApiResponse(200, plans));
});

exports.createPlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.create({
    ...req.body,
    slug: createSlug(req.body.name),
  });
  res.status(201).json(new ApiResponse(201, plan, 'Plan created'));
});

exports.updatePlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plan) throw new ApiError(404, 'Plan not found');
  res.status(200).json(new ApiResponse(200, plan, 'Plan updated'));
});

exports.deletePlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
  if (!plan) throw new ApiError(404, 'Plan not found');
  res.status(200).json(new ApiResponse(200, null, 'Plan deleted'));
});

exports.subscribe = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.body.planId);
  if (!plan || !plan.isActive) throw new ApiError(404, 'Plan not found');

  const company = await Company.findOne({ owner: req.user._id });
  if (!company) throw new ApiError(404, 'Company not found');

  const startDate = new Date();
  const endDate = new Date(startDate);
  const multipliers = { days: 1, months: 30, years: 365 };
  endDate.setDate(endDate.getDate() + plan.duration * (multipliers[plan.durationUnit] || 30));

  company.subscription = { plan: plan._id, startDate, endDate, isActive: true };
  company.isPremium = plan.isPremium;
  await company.save();

  res.status(200).json(new ApiResponse(200, company, 'Subscription activated'));
});
