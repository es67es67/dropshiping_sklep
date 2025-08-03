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
      'post_comment',      // Komentarz do posta
      'auction_bid',       // Nowa oferta w aukcji
      'auction_outbid',    // Prześcignięcie w aukcji
      'auction_ending',    // Kończenie aukcji
      'auction_won',       // Wygrana aukcja
      'auction_lost',      // Przegrana aukcja
      'negotiation_offer', // Nowa propozycja cenowa
      'negotiation_accepted', // Akceptacja propozycji
      'negotiation_rejected', // Odrzucenie propozycji
      'price_drop',        // Spadek ceny produktu
      'back_in_stock',     // Produkt ponownie dostępny
      'cart_reminder',     // Przypomnienie o koszyku
      'wishlist_drop',     // Spadek ceny produktu z listy życzeń
      'similar_product',   // Podobny produkt
      'seller_message',    // Wiadomość od sprzedawcy
      'buyer_message'      // Wiadomość od kupującego
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
    marketplaceProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'MarketplaceProduct' },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
    negotiationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Negotiation' },
    bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    url: { type: String }, // Link do powiązanej strony
    image: { type: String }, // Obraz powiadomienia
    price: { type: Number }, // Cena w powiadomieniu
    oldPrice: { type: Number }, // Stara cena
    newPrice: { type: Number }, // Nowa cena
    bidAmount: { type: Number }, // Kwota oferty
    timeLeft: { type: String }, // Pozostały czas (dla aukcji)
    productName: { type: String }, // Nazwa produktu
    sellerName: { type: String }, // Nazwa sprzedawcy
    buyerName: { type: String } // Nazwa kupującego
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
