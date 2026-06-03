const express = require('express');
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');

const router = express.Router();

router.use(protect);
router.post('/', authorize('buyer'), createOrder);
router.get('/my', getMyOrders);
router.patch('/:id/status', authorize('seller', 'super_admin'), updateOrderStatus);

module.exports = router;
