const express = require('express');
const {
  createInquiry, getMyInquiries, getInquiryById, updateInquiryStatus, getAllInquiries,
} = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const validate = require('../middleware/validate');
const { inquiryValidator } = require('../validators');

const router = express.Router();

router.post('/', protect, authorize('buyer'), inquiryValidator, validate, createInquiry);
router.get('/my', protect, getMyInquiries);
router.get('/all', protect, authorize('super_admin'), getAllInquiries);
router.get('/:id', protect, getInquiryById);
router.patch('/:id/status', protect, updateInquiryStatus);

module.exports = router;
