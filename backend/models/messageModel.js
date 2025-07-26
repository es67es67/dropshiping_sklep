const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Nadawca i odbiorca
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // ID konwersacji
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  
  // Typ konwersacji
  conversationType: {
    type: String,
    enum: ['user_to_user', 'user_to_shop', 'user_to_support'],
    default: 'user_to_user'
  },
  
  // Powiązane dane
  relatedData: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }
  },
  
  // Treść wiadomości
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Typ wiadomości
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'order', 'product', 'system'],
    default: 'text'
  },
  
  // Załączniki
  attachments: [{
    type: { type: String, enum: ['image', 'file', 'document'] },
    url: { type: String, required: true },
    filename: { type: String },
    size: { type: Number }, // w bajtach
    mimeType: { type: String }
  }],
  
  // Status wiadomości
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Czas dostarczenia i przeczytania
  deliveredAt: { type: Date },
  readAt: { type: Date },
  
  // Edycja wiadomości
  edited: {
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    originalContent: { type: String }
  },
  
  // Usunięcie wiadomości
  deleted: {
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Reakcje
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Odpowiedź na wiadomość
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Forwardowane wiadomości
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Metadane
  metadata: {
    ip: { type: String },
    userAgent: { type: String },
    device: { type: String }
  }
}, { timestamps: true });

// Metody wiadomości
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

messageSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

messageSchema.methods.edit = function(newContent) {
  if (!this.edited.isEdited) {
    this.edited.originalContent = this.content;
  }
  this.content = newContent;
  this.edited.isEdited = true;
  this.edited.editedAt = new Date();
  return this.save();
};

messageSchema.methods.delete = function(deletedBy) {
  this.deleted.isDeleted = true;
  this.deleted.deletedAt = new Date();
  this.deleted.deletedBy = deletedBy;
  return this.save();
};

messageSchema.methods.addReaction = function(userId, emoji) {
  const existingReaction = this.reactions.find(r => r.user.toString() === userId.toString());
  if (existingReaction) {
    existingReaction.emoji = emoji;
    existingReaction.createdAt = new Date();
  } else {
    this.reactions.push({ user: userId, emoji });
  }
  return this.save();
};

messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  return this.save();
};

// Indeksy
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, status: 1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ 'relatedData.orderId': 1 });
messageSchema.index({ 'relatedData.shopId': 1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
