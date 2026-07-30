const express = require('express');
const router = express.Router();
const { 
  getLeaderboard, getUserStats, updateUserProfile, 
  getAllUsers, deleteUser, getUserSkills, assignUserSkill, deleteUserSkill 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/leaderboard', getLeaderboard);
router.get('/stats', protect, getUserStats);
router.put('/profile', protect, updateUserProfile);

// Directory and Admin routes
router.get('/', protect, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.get('/:id/skills', protect, admin, getUserSkills);
router.post('/:id/skills', protect, admin, assignUserSkill);
router.delete('/:id/skills/:skillId', protect, admin, deleteUserSkill);

module.exports = router;
