const Quotation = require('../models/Quotation');
const Inquiry = require('../models/Inquiry');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.createQuotation = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.body.inquiry);
  if (!inquiry) throw new ApiError(404, 'Inquiry not found');
  if (inquiry.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to quote this inquiry');
  }

  const totalPrice = req.body.unitPrice * req.body.quantity;
  const quotation = await Quotation.create({
    ...req.body,
    seller: req.user._id,
    buyer: inquiry.buyer,
    product: inquiry.product,
    totalPrice,
  });

  inquiry.quotations.push(quotation._id);
  inquiry.status = 'quoted';
  await inquiry.save();

  await Notification.create({
    recipient: inquiry.buyer,
    type: 'quotation',
    title: 'New Quotation Received',
    message: 'A supplier has sent you a quotation for your inquiry',
    link: `/buyer/inquiries/${inquiry._id}`,
    metadata: { quotationId: quotation._id },
  });

  res.status(201).json(new ApiResponse(201, quotation, 'Quotation sent'));
});

exports.getMyQuotations = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'seller'
    ? { seller: req.user._id }
    : { buyer: req.user._id };

  const quotations = await Quotation.find(filter)
    .populate('product', 'name slug images')
    .populate('inquiry')
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, quotations));
});

exports.updateQuotationStatus = asyncHandler(async (req, res) => {
  const quotation = await Quotation.findById(req.params.id);
  if (!quotation) throw new ApiError(404, 'Quotation not found');
  if (quotation.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  quotation.status = req.body.status;
  await quotation.save();

  res.status(200).json(new ApiResponse(200, quotation, 'Quotation status updated'));
});
