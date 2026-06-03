const express = require('express');
const {
  getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct,
  uploadProductImages, approveProduct, getTrendingProducts, getFeaturedProducts,
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { productValidator } = require('../validators');

const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/trending', getTrendingProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protect, authorize('seller'), productValidator, validate, createProduct);
router.put('/:id', protect, authorize('seller', 'super_admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'super_admin'), deleteProduct);
router.post('/:id/images', protect, authorize('seller'), upload.array('images', 10), uploadProductImages);
router.patch('/:id/approve', protect, authorize('super_admin'), approveProduct);

module.exports = router;
