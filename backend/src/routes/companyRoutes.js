const express = require('express');
const {
  getCompanies, getCompanyBySlug, getMyCompany, createOrUpdateCompany,
  uploadCompanyLogo, getTopSuppliers, getPremiumSuppliers, approveSeller,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { companyValidator } = require('../validators');

const router = express.Router();

router.get('/', getCompanies);
router.get('/top', getTopSuppliers);
router.get('/premium', getPremiumSuppliers);
router.get('/my', protect, authorize('seller'), getMyCompany);
router.get('/:slug', getCompanyBySlug);
router.post('/', protect, authorize('seller'), companyValidator, validate, createOrUpdateCompany);
router.put('/', protect, authorize('seller'), companyValidator, validate, createOrUpdateCompany);
router.post('/logo', protect, authorize('seller'), upload.single('logo'), uploadCompanyLogo);
router.patch('/:id/approve', protect, authorize('super_admin'), approveSeller);

module.exports = router;
