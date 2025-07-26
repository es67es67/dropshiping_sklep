const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Typ powiadomienia
  type: {
    type: String,
    enum: [
      'order_status',      // Zmiana statusu zamówienia
      'payment',           // Płatność
      'delivery',          // Dostawa
      'promotion',         // Promocja
      'security',          // Bezpieczeństwo
      'system',            // Systemowe
      'chat',              // Wiadomość czatu
      'review',            // Prośba o recenzję
      'stock',             // Stan magazynowy
      'return',            // Zwrot
      'friend_request',    // Zaproszenie do znajomych
      'friend_accepted',   // Akceptacja zaproszenia
      'post_like',         // Polubienie posta
      'post_comment'       // Komentarz do posta
    ],
    required: true
  },
  
  // Tytuł i treść
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
  // Status powiadomienia
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  
  // Priorytet
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Powiązane dane
  data: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    url: { type: String }, // Link do powiązanej strony
    image: { type: String } // Obraz powiadomienia
  },
  
  // Kanały dostarczania
  channels: {
    email: { sent: { type: Boolean, default: false }, sentAt: { type: Date } },
    push: { sent: { type: Boolean, default: false }, sentAt: { type: Date } },
    sms: { sent: { type: Boolean, default: false }, sentAt: { type: Date } },
    inApp: { sent: { type: Boolean, default: true }, sentAt: { type: Date, default: Date.now } }
  },
  
  // Czas wygaśnięcia
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dni
    }
  },
  
  // Akcje
  actions: [{
    label: { type: String },
    url: { type: String },
    action: { type: String } // 'view', 'dismiss', 'custom'
  }]
}, { timestamps: true });

// Metody powiadomienia
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

notificationSchema.methods.markAsArchived = function() {
  this.status = 'archived';
  return this.save();
};

notificationSchema.methods.markChannelAsSent = function(channel) {
  if (this.channels[channel]) {
    this.channels[channel].sent = true;
    this.channels[channel].sentAt = new Date();
  }
  return this.save();
};

// Indeksy
notificationSchema.index({ user: 1, status: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
