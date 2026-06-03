const express = require('express');
const { getBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getBanners);
router.post('/', protect, authorize('super_admin'), upload.single('image'), createBanner);
router.put('/:id', protect, authorize('super_admin'), upload.single('image'), updateBanner);
router.delete('/:id', protect, authorize('super_admin'), deleteBanner);

module.exports = router;
