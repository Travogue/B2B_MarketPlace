const CMSPage = require('../models/CMSPage');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createSlug } = require('../utils/slugify');
const sendEmail = require('../utils/sendEmail');

exports.getPages = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isPublished: true };
  const pages = await CMSPage.find(filter).select('title slug pageType updatedAt');
  res.status(200).json(new ApiResponse(200, pages));
});

exports.getPageBySlug = asyncHandler(async (req, res) => {
  const page = await CMSPage.findOne({ slug: req.params.slug, isPublished: true });
  if (!page) throw new ApiError(404, 'Page not found');
  res.status(200).json(new ApiResponse(200, page));
});

exports.createPage = asyncHandler(async (req, res) => {
  const page = await CMSPage.create({
    ...req.body,
    slug: req.body.slug || createSlug(req.body.title),
    updatedBy: req.user._id,
  });
  res.status(201).json(new ApiResponse(201, page, 'Page created'));
});

exports.updatePage = asyncHandler(async (req, res) => {
  const page = await CMSPage.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );
  if (!page) throw new ApiError(404, 'Page not found');
  res.status(200).json(new ApiResponse(200, page, 'Page updated'));
});

exports.deletePage = asyncHandler(async (req, res) => {
  const page = await CMSPage.findByIdAndDelete(req.params.id);
  if (!page) throw new ApiError(404, 'Page not found');
  res.status(200).json(new ApiResponse(200, null, 'Page deleted'));
});

exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  await sendEmail({
    email: process.env.SMTP_EMAIL,
    subject: `Contact Form: ${subject || 'General Inquiry'}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p>${message}</p>`,
  });

  res.status(200).json(new ApiResponse(200, null, 'Message sent successfully'));
});
