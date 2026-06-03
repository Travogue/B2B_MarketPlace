const express = require('express');
const {
  getMyChats, getOrCreateChat, sendMessage, getChatMessages,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getMyChats);
router.post('/', getOrCreateChat);
router.get('/:id/messages', getChatMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;
