const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  requiredPoints: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    enum: ['activity', 'achievement', 'social', 'business', 'special'],
    default: 'activity'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  awardedCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indeksy
badgeSchema.index({ requiredPoints: 1 });
badgeSchema.index({ category: 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ isActive: 1 });

// Metody statyczne
badgeSchema.statics.getAvailableBadges = function(points) {
  return this.find({
    requiredPoints: { $lte: points },
    isActive: true
  }).sort({ requiredPoints: 1 });
};

badgeSchema.statics.getByCategory = function(category) {
  return this.find({
    category,
    isActive: true
  }).sort({ requiredPoints: 1 });
};

badgeSchema.statics.getRareBadges = function() {
  return this.find({
    rarity: { $in: ['rare', 'epic', 'legendary'] },
    isActive: true
  }).sort({ rarity: 1, requiredPoints: 1 });
};

// Metody instancji
badgeSchema.methods.incrementAwardedCount = function() {
  this.awardedCount += 1;
  return this.save();
};

// Wirtualne pola
badgeSchema.virtual('rarityColor').get(function() {
  const colors = {
    common: '#6c757d',
    rare: '#007bff',
    epic: '#6f42c1',
    legendary: '#fd7e14'
  };
  return colors[this.rarity] || colors.common;
});

badgeSchema.virtual('rarityText').get(function() {
  const texts = {
    common: 'Powszechna',
    rare: 'Rzadka',
    epic: 'Epicka',
    legendary: 'Legendarna'
  };
  return texts[this.rarity] || texts.common;
});

// Konfiguracja toJSON
badgeSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Badge', badgeSchema); 