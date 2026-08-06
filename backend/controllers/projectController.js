const Project = require('../models/Project');

// @desc    Get all project cards for Kanban board
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('assignedTo', 'name role').sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create project card
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, assignedTo, priority, stage, dueDate } = req.body;
    const project = await Project.create({
      title,
      description,
      category,
      assignedTo: assignedTo || req.user.id,
      priority,
      stage: stage || 'backlog',
      dueDate
    });

    const populated = await Project.findById(project._id).populate('assignedTo', 'name role');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update project stage (Move Kanban column)
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project card not found' });
    }

    if (req.body.stage) project.stage = req.body.stage;
    if (req.body.priority) project.priority = req.body.priority;
    if (req.body.assignedTo) project.assignedTo = req.body.assignedTo;

    await project.save();
    const updated = await Project.findById(project._id).populate('assignedTo', 'name role');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete project card
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project card not found' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
