const express = require('express');
const {
  getPlans, createPlan, updatePlan, deletePlan, subscribe,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roles');

const router = express.Router();

router.get('/', getPlans);
router.post('/subscribe', protect, authorize('seller'), subscribe);
router.post('/', protect, authorize('super_admin'), createPlan);
router.put('/:id', protect, authorize('super_admin'), updatePlan);
router.delete('/:id', protect, authorize('super_admin'), deletePlan);

module.exports = router;
