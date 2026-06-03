const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: String,
    image: { type: String, required: true },
    imagePublicId: String,
    link: String,
    linkText: String,
    position: {
      type: String,
      enum: ['hero', 'sidebar', 'footer', 'popup'],
      default: 'hero',
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
