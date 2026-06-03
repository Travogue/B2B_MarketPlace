const Banner = require('../models/Banner');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

exports.getBanners = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.position) filter.position = req.query.position;
  if (req.query.all !== 'true') {
    filter.$or = [
      { startDate: { $lte: new Date() }, endDate: { $gte: new Date() } },
      { startDate: null, endDate: null },
    ];
  }

  const banners = await Banner.find(req.query.all === 'true' ? {} : filter).sort('order');
  res.status(200).json(new ApiResponse(200, banners));
});

exports.createBanner = asyncHandler(async (req, res) => {
  let imageData = {};
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'banners');
    imageData = { image: result.secure_url, imagePublicId: result.public_id };
  }

  const banner = await Banner.create({ ...req.body, ...imageData });
  res.status(201).json(new ApiResponse(201, banner, 'Banner created'));
});

exports.updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');

  if (req.file) {
    if (banner.imagePublicId) await deleteFromCloudinary(banner.imagePublicId);
    const result = await uploadToCloudinary(req.file.buffer, 'banners');
    banner.image = result.secure_url;
    banner.imagePublicId = result.public_id;
  }

  Object.assign(banner, req.body);
  await banner.save();

  res.status(200).json(new ApiResponse(200, banner, 'Banner updated'));
});

exports.deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  if (banner.imagePublicId) await deleteFromCloudinary(banner.imagePublicId);
  await banner.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Banner deleted'));
});
