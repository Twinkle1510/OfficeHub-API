const Policy = require('../models/Policy');

exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addPolicy = async (req, res) => {
  try {
    const { title, category, link } = req.body;
    if (!title || !category || !link) {
      return res.status(400).json({ success: false, error: 'Please provide title, category and link' });
    }
    const policy = await Policy.create({ title, category, link });
    res.status(201).json({ success: true, data: policy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
