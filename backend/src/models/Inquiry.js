const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'piece' },
    expectedPrice: Number,
    deliveryLocation: {
      city: String,
      state: String,
      country: { type: String, default: 'India' },
    },
    status: {
      type: String,
      enum: ['open', 'quoted', 'closed', 'cancelled'],
      default: 'open',
    },
    quotations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
