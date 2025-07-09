const Group = require('../models/groupModel');

exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = new Group({ name, description, createdBy: req.userId, members: [req.userId] });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addEvent = async (req, res) => {
  try {
    const { groupId, title, description, date, location } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Grupa nie istnieje' });
    group.events.push({ title, description, date, location });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
