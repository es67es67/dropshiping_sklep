const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'audio', 'video', 'location'],
    default: 'text'
  },
  attachments: [attachmentSchema],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indeksy dla szybkiego wyszukiwania
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ receiver: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, createdAt: -1 });

// Middleware pre-save
messageSchema.pre('save', function(next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  
  if (this.isModified('content') && this.editHistory && this.editHistory.length > 0) {
    this.edited = true;
    this.editedAt = new Date();
  }
  
  next();
});

// Metody statyczne
messageSchema.statics.getConversation = function(userId1, userId2, options = {}) {
  const { page = 1, limit = 50 } = options;
  const skip = (page - 1) * limit;
  
  return this.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 }
    ],
    isDeleted: false
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('sender', 'username firstName lastName avatar')
  .populate('receiver', 'username firstName lastName avatar')
  .populate('replyTo', 'content sender');
};

messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    receiver: userId,
    isRead: false,
    isDeleted: false
  });
};

messageSchema.statics.markAsRead = function(messageIds, userId) {
  return this.updateMany(
    {
      _id: { $in: messageIds },
      receiver: userId,
      isRead: false
    },
    {
      isRead: true,
      readAt: new Date()
    }
  );
};

// Metody instancji
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

messageSchema.methods.softDelete = function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

messageSchema.methods.edit = function(newContent) {
  // Zapisz historię edycji
  if (!this.editHistory) {
    this.editHistory = [];
  }
  
  this.editHistory.push({
    content: this.content,
    editedAt: new Date()
  });
  
  this.content = newContent;
  this.edited = true;
  this.editedAt = new Date();
  
  return this.save();
};

// Wirtualne pola
messageSchema.virtual('isFileMessage').get(function() {
  return this.messageType === 'file' && this.attachments && this.attachments.length > 0;
});

messageSchema.virtual('isImageMessage').get(function() {
  return this.messageType === 'image' || 
         (this.attachments && this.attachments.some(att => att.mimetype.startsWith('image/')));
});

messageSchema.virtual('isAudioMessage').get(function() {
  return this.messageType === 'audio' || 
         (this.attachments && this.attachments.some(att => att.mimetype.startsWith('audio/')));
});

messageSchema.virtual('isVideoMessage').get(function() {
  return this.messageType === 'video' || 
         (this.attachments && this.attachments.some(att => att.mimetype.startsWith('video/')));
});

// Konfiguracja toJSON
messageSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Message', messageSchema);
