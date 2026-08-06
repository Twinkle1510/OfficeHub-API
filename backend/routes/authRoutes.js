const express = require('express');
const { register, login, getMe, seedDemo } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/seed-demo', protect, seedDemo);

module.exports = router;
