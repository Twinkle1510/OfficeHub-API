const Skill = require('../models/Skill');
const Activity = require('../models/Activity');

// @desc    Get all skills for a user
// @route   GET /api/skills
// @access  Private
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add a new skill task
// @route   POST /api/skills
// @access  Private
exports.addSkill = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const skill = await Skill.create(req.body);

    // Log Activity for starting a skill
    await Activity.create({
      user: req.user.id,
      action: 'started',
      skillTitle: skill.task,
      category: skill.category
    });

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('Error in addSkill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update skill status
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill task not found' });
    }

    // Make sure user owns the skill task
    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this skill' });
    }

    const wasCompleted = skill.status === 'completed';
    const isNowCompleted = req.body.status === 'completed';

    if (!wasCompleted && isNowCompleted) {
      req.body.completedAt = Date.now();
    } else if (wasCompleted && !isNowCompleted) {
      req.body.completedAt = null; // if they revert it
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Log Activity if just completed
    if (!wasCompleted && isNowCompleted) {
      await Activity.create({
        user: req.user.id,
        action: 'completed',
        skillTitle: skill.task,
        category: skill.category
      });
    }

    res.status(200).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete skill task
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill task not found' });
    }

    // Make sure user owns the skill task
    if (skill.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this skill' });
    }

    await skill.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
