const Message = require('../models/messageModel');

exports.sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;
    const message = new Message({ sender: req.userId, recipient, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ $or: [{ sender: req.userId }, { recipient: req.userId }] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
