const express = require('express');
const { getSkills, addSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getSkills)
  .post(protect, addSkill);

router.route('/:id')
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
