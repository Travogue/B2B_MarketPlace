const express = require('express');
const {
  createQuotation, getMyQuotations, updateQuotationStatus,
} = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const validate = require('../middleware/validate');
const { quotationValidator } = require('../validators');

const router = express.Router();

router.post('/', protect, authorize('seller'), quotationValidator, validate, createQuotation);
router.get('/my', protect, getMyQuotations);
router.patch('/:id/status', protect, authorize('buyer'), updateQuotationStatus);

module.exports = router;
