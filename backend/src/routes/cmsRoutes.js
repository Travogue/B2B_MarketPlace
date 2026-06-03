const express = require('express');
const {
  getPages, getPageBySlug, createPage, updatePage, deletePage, submitContact,
} = require('../controllers/cmsController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const validate = require('../middleware/validate');
const { contactValidator } = require('../validators');

const router = express.Router();

router.get('/', getPages);
router.get('/:slug', getPageBySlug);
router.post('/contact', contactValidator, validate, submitContact);
router.post('/', protect, authorize('super_admin'), createPage);
router.put('/:id', protect, authorize('super_admin'), updatePage);
router.delete('/:id', protect, authorize('super_admin'), deletePage);

module.exports = router;
