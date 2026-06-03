const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

exports.createOrder = asyncHandler(async (req, res) => {
  const quotation = await Quotation.findById(req.body.quotationId).populate('product');
  if (!quotation) throw new ApiError(404, 'Quotation not found');
  if (quotation.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }
  if (quotation.status !== 'accepted') {
    throw new ApiError(400, 'Quotation must be accepted first');
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    buyer: quotation.buyer,
    seller: quotation.seller,
    company: req.body.company,
    quotation: quotation._id,
    items: [{
      product: quotation.product._id,
      name: quotation.product.name,
      quantity: quotation.quantity,
      unitPrice: quotation.unitPrice,
      totalPrice: quotation.totalPrice,
    }],
    subtotal: quotation.totalPrice,
    total: quotation.totalPrice,
    shippingAddress: req.body.shippingAddress,
  });

  res.status(201).json(new ApiResponse(201, order, 'Order created'));
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'seller'
    ? { seller: req.user._id }
    : { buyer: req.user._id };

  const orders = await Order.find(filter)
    .populate('buyer', 'name email')
    .populate('company', 'companyName')
    .sort('-createdAt');

  res.status(200).json(new ApiResponse(200, orders));
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) throw new ApiError(404, 'Order not found');
  res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});
