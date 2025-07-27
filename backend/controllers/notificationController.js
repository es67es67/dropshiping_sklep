const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId });
    res.json({ notifications: notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.userId, read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
