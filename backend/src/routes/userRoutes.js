const express = require('express');
const {
  getUsers, getUserById, updateUserStatus, toggleWishlist, getWishlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');

const router = express.Router();

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.get('/', protect, authorize('super_admin'), getUsers);
router.get('/:id', protect, authorize('super_admin'), getUserById);
router.patch('/:id/status', protect, authorize('super_admin'), updateUserStatus);

module.exports = router;
