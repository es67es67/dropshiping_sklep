const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceProduct',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indeksy dla lepszej wydajności
offerSchema.index({ productId: 1, status: 1 });
offerSchema.index({ buyerId: 1 });
offerSchema.index({ timestamp: -1 });

// Metody statyczne
offerSchema.statics.getProductOffers = function(productId) {
  return this.find({ productId })
    .populate('buyerId', 'username email')
    .sort({ timestamp: -1 });
};

offerSchema.statics.getUserOffers = function(userId) {
  return this.find({ buyerId: userId })
    .populate('productId', 'name price category')
    .sort({ timestamp: -1 });
};

offerSchema.statics.getPendingOffers = function(productId) {
  return this.find({ productId, status: 'pending' })
    .populate('buyerId', 'username email')
    .sort({ timestamp: -1 });
};

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer; 