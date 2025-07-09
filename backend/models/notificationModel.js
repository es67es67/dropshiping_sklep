const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  message: { type: String },
  read: { type: Boolean, default: false },
  type: { 
    type: String, 
    enum: ['message', 'order', 'promotion', 'group', 'like', 'comment', 'follow', 'unfollow', 'review', 'live', 'story'], 
    required: true 
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
