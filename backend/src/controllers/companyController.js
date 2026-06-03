const Company = require('../models/Company');
const Product = require('../models/Product');
const Review = require('../models/Review');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createSlug } = require('../utils/slugify');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.getCompanies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const filter = { verificationStatus: 'approved' };

  if (req.user?.role === 'super_admin' && req.query.all === 'true') {
    delete filter.verificationStatus;
  }
  if (req.query.status) filter.verificationStatus = req.query.status;

  if (req.query.search) filter.$text = { $search: req.query.search };
  if (req.query.city) filter['address.city'] = { $regex: req.query.city, $options: 'i' };
  if (req.query.state) filter['address.state'] = { $regex: req.query.state, $options: 'i' };
  if (req.query.isPremium === 'true') filter.isPremium = true;
  if (req.query.businessType) filter.businessType = req.query.businessType;

  const sort = req.query.sort === 'rating' ? '-rating' : req.query.sort === 'products' ? '-productCount' : '-createdAt';

  const [companies, total] = await Promise.all([
    Company.find(filter).populate('owner', 'name email phone').skip(skip).limit(limit).sort(sort),
    Company.countDocuments(filter),
  ]);

  res.status(200).json(new ApiResponse(200, {
    companies,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  }));
});

exports.getCompanyBySlug = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ slug: req.params.slug })
    .populate('owner', 'name email phone')
    .populate('subscription.plan');

  if (!company) throw new ApiError(404, 'Company not found');

  const [products, reviews] = await Promise.all([
    Product.find({ company: company._id, status: 'approved' }).limit(12),
    Review.find({ company: company._id, isApproved: true }).populate('reviewer', 'name avatar').limit(10),
  ]);

  res.status(200).json(new ApiResponse(200, { company, products, reviews }));
});

exports.getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) throw new ApiError(404, 'Company profile not found');
  res.status(200).json(new ApiResponse(200, company));
});

exports.createOrUpdateCompany = asyncHandler(async (req, res) => {
  const data = req.body;
  let company = await Company.findOne({ owner: req.user._id });

  if (company) {
    Object.assign(company, data);
    if (data.companyName) company.slug = createSlug(data.companyName);
    await company.save();
  } else {
    company = await Company.create({
      ...data,
      owner: req.user._id,
      slug: createSlug(data.companyName),
    });
    req.user.company = company._id;
    await req.user.save();
  }

  res.status(200).json(new ApiResponse(200, company, 'Company profile saved'));
});

exports.uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please upload an image');

  const company = await Company.findOne({ owner: req.user._id });
  if (!company) throw new ApiError(404, 'Company not found');

  if (company.logoPublicId) await deleteFromCloudinary(company.logoPublicId);

  const result = await uploadToCloudinary(req.file.buffer, 'companies');
  company.logo = result.secure_url;
  company.logoPublicId = result.public_id;
  await company.save();

  res.status(200).json(new ApiResponse(200, { logo: company.logo }, 'Logo uploaded'));
});

exports.getTopSuppliers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const companies = await Company.find({ verificationStatus: 'approved' })
    .sort('-rating')
    .limit(limit);
  res.status(200).json(new ApiResponse(200, companies));
});

exports.getPremiumSuppliers = asyncHandler(async (req, res) => {
  const companies = await Company.find({ verificationStatus: 'approved', isPremium: true })
    .sort('-rating')
    .limit(8);
  res.status(200).json(new ApiResponse(200, companies));
});

exports.approveSeller = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus: req.body.status,
      isVerified: req.body.status === 'approved',
    },
    { new: true }
  );
  if (!company) throw new ApiError(404, 'Company not found');
  res.status(200).json(new ApiResponse(200, company, 'Seller status updated'));
});
