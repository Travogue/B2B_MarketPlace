const express = require('express');
const {
  globalSearch, getAdminDashboard, getSellerDashboard, getBuyerDashboard, getReports,
} = require('../controllers/searchController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');

const router = express.Router();

router.get('/', globalSearch);
router.get('/admin/dashboard', protect, authorize('super_admin'), getAdminDashboard);
router.get('/seller/dashboard', protect, authorize('seller'), getSellerDashboard);
router.get('/buyer/dashboard', protect, authorize('buyer'), getBuyerDashboard);
router.get('/admin/reports', protect, authorize('super_admin'), getReports);

module.exports = router;
