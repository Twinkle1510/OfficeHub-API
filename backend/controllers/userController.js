const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get community leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'skills',
          localField: '_id',
          foreignField: 'user',
          as: 'skills'
        }
      },
      {
        $project: {
          name: 1,
          totalCount: { $size: "$skills" },
          completedCount: {
            $size: {
              $filter: {
                input: "$skills",
                as: "skill",
                cond: { $eq: ["$$skill.status", "completed"] }
              }
            }
          }
        }
      },
      {
        $sort: { completedCount: -1 }
      }
    ]);

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user stats for profile
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id });
    
    const stats = {
      total: skills.length,
      completed: skills.filter(s => s.status === 'completed').length,
      inProgress: skills.filter(s => s.status === 'in-progress').length,
      pending: skills.filter(s => s.status === 'pending').length,
      categoryData: []
    };

    // Calculate category distribution for charts
    const categories = {};
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = { total: 0, completed: 0 };
      }
      categories[skill.category].total += 1;
      if (skill.status === 'completed') {
        categories[skill.category].completed += 1;
      }
    });

    for (const [key, value] of Object.entries(categories)) {
      stats.categoryData.push({
        name: key,
        total: value.total,
        completed: value.completed
      });
    }

    // Dynamic Badge Calculation
    const badges = [];
    if (stats.completed >= 1) {
      badges.push({ id: 'first_task', title: 'First Win', icon: '🏆', description: 'Completed your first task' });
    }
    if (stats.completed >= 5) {
      badges.push({ id: 'five_tasks', title: 'On a Roll', icon: '🔥', description: 'Completed 5 tasks' });
    }
    if (stats.total >= 10) {
      badges.push({ id: 'ten_tracked', title: 'Ambitious', icon: '🎯', description: 'Tracked 10 tasks' });
    }
    
    const reactCat = stats.categoryData.find(c => c.name.toLowerCase().includes('react'));
    if (reactCat && reactCat.completed >= 2) {
      badges.push({ id: 'react_novice', title: 'React Novice', icon: '⚛️', description: 'Completed 2 React tasks' });
    }
    
    stats.badges = badges;

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update user profile (Settings)
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        // Mongoose pre-save hook will hash it
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email
        }
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // We can also delete all their skills and activities here if we want to be thorough
    const Skill = require('../models/Skill');
    const Activity = require('../models/Activity');
    
    await Skill.deleteMany({ user: user._id });
    await Activity.deleteMany({ user: user._id });
    await user.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get skills for a specific user (Admin only)
// @route   GET /api/users/:id/skills
// @access  Private/Admin
exports.getUserSkills = async (req, res) => {
  try {
    const Skill = require('../models/Skill');
    const skills = await Skill.find({ user: req.params.id }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Assign a skill/task to a specific user (Admin only)
// @route   POST /api/users/:id/skills
// @access  Private/Admin
exports.assignUserSkill = async (req, res) => {
  try {
    const { category, task, subTasks, status } = req.body;
    const Skill = require('../models/Skill');
    
    const skill = await Skill.create({
      user: req.params.id,
      category,
      task,
      subTasks,
      status: status || 'pending'
    });

    // Log assignment activity
    try {
      const Activity = require('../models/Activity');
      await Activity.create({
        user: req.params.id,
        action: 'started',
        skillTitle: task,
        category: category || 'Assigned'
      });
    } catch (e) {
      console.error('Failed to create assignment activity log:', e);
    }

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update user role (Admin/HR only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['employee', 'developer', 'tester', 'designer', 'hr', 'admin', 'owner'];
    
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role specified' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ 
      success: true, 
      data: { _id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a specific skill from a user (Admin only)
// @route   DELETE /api/users/:id/skills/:skillId
// @access  Private/Admin
exports.deleteUserSkill = async (req, res) => {
  try {
    const Skill = require('../models/Skill');
    const skill = await Skill.findOne({ _id: req.params.skillId, user: req.params.id });
    
    if (!skill) {
      return res.status(404).json({ success: false, error: 'Task not found for this user' });
    }

    await skill.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

