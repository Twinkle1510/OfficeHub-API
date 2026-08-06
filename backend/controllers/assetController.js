const Asset = require('../models/Asset');

// @desc    Get all assets (Admin / HR) or assigned assets (Employee)
// @route   GET /api/assets
// @access  Private
exports.getAssets = async (req, res) => {
  try {
    let assets;
    if (['admin', 'hr', 'owner'].includes(req.user.role)) {
      assets = await Asset.find().populate('assignedUser', 'name email role').sort({ createdAt: -1 });
    } else {
      assets = await Asset.find({ assignedUser: req.user.id }).sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create asset (Admin / HR)
// @route   POST /api/assets
// @access  Private/Admin
exports.createAsset = async (req, res) => {
  try {
    const { name, category, serialNumber, assignedUser, condition } = req.body;

    const asset = await Asset.create({
      name,
      category,
      serialNumber,
      assignedUser: assignedUser || null,
      condition: condition || 'Excellent',
      status: assignedUser ? 'Assigned' : 'Available'
    });

    const populated = await Asset.findById(asset._id).populate('assignedUser', 'name email role');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Assign asset to employee (Admin / HR)
// @route   PUT /api/assets/:id/assign
// @access  Private/Admin
exports.assignAsset = async (req, res) => {
  try {
    const { assignedUser, condition, status } = req.body;
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }

    if (assignedUser !== undefined) asset.assignedUser = assignedUser || null;
    if (condition) asset.condition = condition;
    if (status) asset.status = status;
    else asset.status = asset.assignedUser ? 'Assigned' : 'Available';

    await asset.save();
    const updated = await Asset.findById(asset._id).populate('assignedUser', 'name email role');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
