const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    slug: { type: String, unique: true, lowercase: true },
    logo: { type: String, default: '' },
    logoPublicId: String,
    banner: { type: String, default: '' },
    description: { type: String, default: '' },
    businessType: {
      type: String,
      enum: ['manufacturer', 'trader', 'distributor', 'service_provider', 'other'],
      default: 'manufacturer',
    },
    yearEstablished: Number,
    employeeCount: String,
    annualTurnover: String,
    gstNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    cinNumber: { type: String, trim: true },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
      pincode: String,
    },
    contactEmail: String,
    contactPhone: String,
    website: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    subscription: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: false },
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
    documents: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    socialLinks: {
      linkedin: String,
      facebook: String,
      twitter: String,
    },
  },
  { timestamps: true }
);

companySchema.index({ companyName: 'text', description: 'text' });
companySchema.index({ 'address.city': 1, 'address.state': 1 });

module.exports = mongoose.model('Company', companySchema);
