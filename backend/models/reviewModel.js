
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Autor recenzji
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Produkt oceniany
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  // Sklep (opcjonalnie)
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  
  // Zamówienie (opcjonalnie)
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Ocena (1-5 gwiazdek)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Tytuł recenzji
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  
  // Treść recenzji
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Status recenzji
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  
  // Zdjęcia
  images: [{
    url: { type: String, required: true },
    caption: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Wideo (opcjonalnie)
  video: {
    url: { type: String },
    thumbnail: { type: String },
    duration: { type: Number } // w sekundach
  },
  
  // Oceny szczegółowe
  detailedRatings: {
    quality: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
    customerService: { type: Number, min: 1, max: 5 }
  },
  
  // Tagi
  tags: [{
    type: String,
    enum: ['positive', 'negative', 'verified_purchase', 'helpful', 'spam']
  }],
  
  // Czy to zweryfikowana recenzja
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  
  // Czy użytkownik otrzymał produkt za darmo
  freeProduct: {
    type: Boolean,
    default: false
  },
  
  // Reakcje na recenzję
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['helpful', 'not_helpful', 'funny', 'love'] },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Odpowiedź sklepu
  shopResponse: {
    content: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Moderacja
  moderation: {
    flagged: { type: Boolean, default: false },
    flaggedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    flaggedReason: { type: String },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: { type: Date },
    moderationNote: { type: String }
  },
  
  // Metadane
  metadata: {
    ip: { type: String },
    userAgent: { type: String },
    device: { type: String }
  }
}, { timestamps: true });

// Metody recenzji
reviewSchema.methods.addReaction = function(userId, type) {
  const existingReaction = this.reactions.find(r => r.user.toString() === userId.toString());
  
  if (existingReaction) {
    existingReaction.type = type;
    existingReaction.createdAt = new Date();
  } else {
    this.reactions.push({ user: userId, type });
  }
  
  return this.save();
};

reviewSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(r => r.user.toString() !== userId.toString());
  return this.save();
};

reviewSchema.methods.flag = function(userId, reason) {
  if (!this.moderation.flaggedBy.includes(userId)) {
    this.moderation.flaggedBy.push(userId);
  }
  this.moderation.flagged = true;
  this.moderation.flaggedReason = reason;
  return this.save();
};

reviewSchema.methods.moderate = function(moderatorId, status, note) {
  this.status = status;
  this.moderation.moderatedBy = moderatorId;
  this.moderation.moderatedAt = new Date();
  this.moderation.moderationNote = note;
  return this.save();
};

reviewSchema.methods.addShopResponse = function(content, respondedBy) {
  this.shopResponse = {
    content,
    respondedAt: new Date(),
    respondedBy
  };
  return this.save();
};

// Statyczne metody
reviewSchema.statics.getAverageRating = function(productId) {
  return this.aggregate([
    { $match: { product: productId, status: 'approved' } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
};

reviewSchema.statics.getRatingDistribution = function(productId) {
  return this.aggregate([
    { $match: { product: productId, status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
};

// Indeksy
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ shop: 1, status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ 'moderation.flagged': 1 });
reviewSchema.index({ verifiedPurchase: 1 });

// Walidacja - jeden użytkownik może ocenić jeden produkt tylko raz
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
