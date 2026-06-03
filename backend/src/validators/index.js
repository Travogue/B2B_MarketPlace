const { body } = require('express-validator');

exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['buyer', 'seller']).withMessage('Invalid role'),
  body('phone').optional().trim(),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

exports.resetPasswordValidator = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('priceRange.min').isNumeric().withMessage('Min price is required'),
  body('priceRange.max').isNumeric().withMessage('Max price is required'),
  body('moq').optional().isInt({ min: 1 }),
];

exports.inquiryValidator = [
  body('product').notEmpty().withMessage('Product is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

exports.quotationValidator = [
  body('inquiry').notEmpty().withMessage('Inquiry is required'),
  body('unitPrice').isNumeric().withMessage('Unit price is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity is required'),
  body('validUntil').isISO8601().withMessage('Valid until date is required'),
];

exports.categoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
];

exports.companyValidator = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('businessType').optional().isIn(['manufacturer', 'trader', 'distributor', 'service_provider', 'other']),
];

exports.reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
];

exports.contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];
