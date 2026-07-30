const express = require('express');
const router = express.Router();
const { getTaskMessages, sendMessage, getDirectMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/task/:taskId', protect, getTaskMessages);
router.get('/direct/:userId', protect, getDirectMessages);
router.post('/', protect, sendMessage);

module.exports = router;
