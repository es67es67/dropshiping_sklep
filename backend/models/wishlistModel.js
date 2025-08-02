const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'productType'
  },
  productType: {
    type: String,
    required: true,
    enum: ['marketplace', 'shop']
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indeksy dla wydajności
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ productId: 1, productType: 1 });
wishlistSchema.index({ user: 1, productId: 1, productType: 1 }, { unique: true });

// Metoda do pobierania wishlist użytkownika z danymi produktów
wishlistSchema.statics.getUserWishlist = async function(userId) {
  return await this.find({ user: userId, isActive: true })
    .populate({
      path: 'productId',
      select: 'name price mainImage images category brand isActive stock',
      match: { isActive: true }
    })
    .sort({ addedAt: -1 });
};

// Metoda do sprawdzania czy produkt jest w wishlist
wishlistSchema.statics.isInWishlist = async function(userId, productId, productType) {
  const item = await this.findOne({
    user: userId,
    productId: productId,
    productType: productType,
    isActive: true
  });
  
  return !!item;
};

module.exports = mongoose.model('Wishlist', wishlistSchema); 