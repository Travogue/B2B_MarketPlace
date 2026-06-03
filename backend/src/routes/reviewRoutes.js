const express = require('express');
const {
  createReview, getReviews, getFeaturedReviews, deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const validate = require('../middleware/validate');
const { reviewValidator } = require('../validators');

const router = express.Router();

router.get('/', getReviews);
router.get('/featured', getFeaturedReviews);
router.post('/', protect, reviewValidator, validate, createReview);
router.delete('/:id', protect, authorize('super_admin'), deleteReview);

module.exports = router;
