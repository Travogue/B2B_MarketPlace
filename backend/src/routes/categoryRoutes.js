const express = require('express');
const {
  getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory,
  getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory, uploadCategoryImage,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { categoryValidator } = require('../validators');

const router = express.Router();

router.get('/', getCategories);
router.get('/subcategories/all', getSubcategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', protect, authorize('super_admin'), categoryValidator, validate, createCategory);
router.put('/:id', protect, authorize('super_admin'), updateCategory);
router.delete('/:id', protect, authorize('super_admin'), deleteCategory);
router.post('/:id/image', protect, authorize('super_admin'), upload.single('image'), uploadCategoryImage);
router.post('/subcategories', protect, authorize('super_admin'), createSubcategory);
router.put('/subcategories/:id', protect, authorize('super_admin'), updateSubcategory);
router.delete('/subcategories/:id', protect, authorize('super_admin'), deleteSubcategory);

module.exports = router;
