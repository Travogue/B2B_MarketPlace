const mongoose = require('mongoose');

const cmsPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, required: true },
    content: { type: String, required: true },
    pageType: {
      type: String,
      enum: ['about', 'contact', 'faq', 'privacy', 'terms', 'custom'],
      default: 'custom',
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CMSPage', cmsPageSchema);
