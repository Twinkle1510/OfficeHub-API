const Message = require('../models/Message');

// @desc    Get messages for a specific task
// @route   GET /api/messages/task/:taskId
// @access  Private
exports.getTaskMessages = async (req, res) => {
  try {
    const messages = await Message.find({ task: req.params.taskId })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 }); // Oldest to newest
      
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Send a message (task or direct)
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { task, receiver, content } = req.body;
    
    // Validate
    if (!receiver || !content) {
      return res.status(400).json({ success: false, error: 'Please provide receiver and content' });
    }

    const message = await Message.create({
      task,
      sender: req.user.id,
      receiver,
      content
    });

    const populatedMessage = await message.populate('sender', 'name role');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get direct messages between current user and another user
// @route   GET /api/messages/direct/:userId
// @access  Private
exports.getDirectMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ task: { $exists: false } }, { task: null }], // Match both omitted and null tasks
      $and: [
        {
          $or: [
            { sender: req.user.id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: req.user.id }
          ]
        }
      ]
    })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 });
      
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
