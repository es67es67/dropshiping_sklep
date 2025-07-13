const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  // Uczestnicy konwersacji
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'shop_owner', 'support', 'admin'], default: 'user' },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    isActive: { type: Boolean, default: true }
  }],
  
  // Typ konwersacji
  type: {
    type: String,
    enum: ['direct', 'group', 'support', 'shop_support'],
    default: 'direct'
  },
  
  // Nazwa konwersacji (dla grup)
  name: {
    type: String,
    maxlength: 100
  },
  
  // Opis konwersacji
  description: {
    type: String,
    maxlength: 500
  },
  
  // Ostatnia wiadomość
  lastMessage: {
    content: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date },
    messageType: { type: String, enum: ['text', 'image', 'file', 'system'] }
  },
  
  // Statystyki
  stats: {
    messageCount: { type: Number, default: 0 },
    unreadCount: { type: Number, default: 0 },
    participantCount: { type: Number, default: 0 }
  },
  
  // Ustawienia konwersacji
  settings: {
    isArchived: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    allowReactions: { type: Boolean, default: true },
    allowEditing: { type: Boolean, default: true },
    allowDeletion: { type: Boolean, default: true },
    maxParticipants: { type: Number, default: 10 }
  },
  
  // Powiązane dane
  relatedData: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    supportTicketId: { type: String }
  },
  
  // Status konwersacji
  status: {
    type: String,
    enum: ['active', 'archived', 'closed', 'blocked'],
    default: 'active'
  },
  
  // Tagi
  tags: [{ type: String }],
  
  // Ostatnia aktywność
  lastActivity: {
    type: Date,
    default: Date.now
  },
  
  // Avatar konwersacji
  avatar: {
    type: String
  },
  
  // Ustawienia powiadomień
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sound: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Metody konwersacji
conversationSchema.methods.addParticipant = function(userId, role = 'user') {
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  
  if (!existingParticipant) {
    this.participants.push({
      user: userId,
      role,
      joinedAt: new Date(),
      isActive: true
    });
    this.stats.participantCount = this.participants.filter(p => p.isActive).length;
  } else if (!existingParticipant.isActive) {
    existingParticipant.isActive = true;
    existingParticipant.leftAt = null;
    this.stats.participantCount = this.participants.filter(p => p.isActive).length;
  }
  
  return this.save();
};

conversationSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
    this.stats.participantCount = this.participants.filter(p => p.isActive).length;
  }
  return this.save();
};

conversationSchema.methods.updateLastMessage = function(message) {
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    timestamp: message.createdAt,
    messageType: message.messageType
  };
  this.lastActivity = new Date();
  this.stats.messageCount += 1;
  return this.save();
};

conversationSchema.methods.incrementUnreadCount = function() {
  this.stats.unreadCount += 1;
  return this.save();
};

conversationSchema.methods.resetUnreadCount = function() {
  this.stats.unreadCount = 0;
  return this.save();
};

conversationSchema.methods.archive = function() {
  this.status = 'archived';
  this.settings.isArchived = true;
  return this.save();
};

conversationSchema.methods.unarchive = function() {
  this.status = 'active';
  this.settings.isArchived = false;
  return this.save();
};

conversationSchema.methods.mute = function() {
  this.settings.isMuted = true;
  return this.save();
};

conversationSchema.methods.unmute = function() {
  this.settings.isMuted = false;
  return this.save();
};

// Statyczne metody
conversationSchema.statics.findOrCreateDirect = async function(user1Id, user2Id) {
  // Sprawdź czy istnieje już konwersacja między tymi użytkownikami
  let conversation = await this.findOne({
    type: 'direct',
    'participants.user': { $all: [user1Id, user2Id] },
    'participants.1': { $exists: false } // Tylko 2 uczestników
  });

  if (!conversation) {
    // Utwórz nową konwersację
    conversation = new this({
      type: 'direct',
      participants: [
        { user: user1Id, role: 'user' },
        { user: user2Id, role: 'user' }
      ],
      stats: { participantCount: 2 }
    });
    await conversation.save();
  }

  return conversation;
};

conversationSchema.statics.findOrCreateShopSupport = async function(userId, shopId) {
  let conversation = await this.findOne({
    type: 'shop_support',
    'relatedData.shopId': shopId,
    'participants.user': userId,
    status: 'active'
  });

  if (!conversation) {
    // Pobierz właściciela sklepu
    const Shop = require('./shopModel');
    const shop = await Shop.findById(shopId);
    
    if (!shop) {
      throw new Error('Sklep nie został znaleziony');
    }

    conversation = new this({
      type: 'shop_support',
      name: `Wsparcie - ${shop.name}`,
      participants: [
        { user: userId, role: 'user' },
        { user: shop.owner, role: 'shop_owner' }
      ],
      relatedData: { shopId },
      stats: { participantCount: 2 }
    });
    await conversation.save();
  }

  return conversation;
};

// Indeksy
conversationSchema.index({ 'participants.user': 1, status: 1 });
conversationSchema.index({ type: 1, status: 1 });
conversationSchema.index({ 'relatedData.shopId': 1 });
conversationSchema.index({ 'relatedData.orderId': 1 });
conversationSchema.index({ lastActivity: -1 });
conversationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema); 