const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
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
    enum: ['social', 'business', 'content', 'exploration', 'special'],
    default: 'social'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'extreme'],
    default: 'easy'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  completedCount: {
    type: Number,
    default: 0
  },
  rewardPoints: {
    type: Number,
    default: 0
  },
  rewardBadge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  },
  requirements: {
    postsCount: { type: Number, default: 0 },
    productsCount: { type: Number, default: 0 },
    shopsCount: { type: Number, default: 0 },
    messagesCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    daysActive: { type: Number, default: 0 },
    locationsVisited: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indeksy
achievementSchema.index({ requiredPoints: 1 });
achievementSchema.index({ category: 1 });
achievementSchema.index({ difficulty: 1 });
achievementSchema.index({ isActive: 1 });

// Metody statyczne
achievementSchema.statics.getAvailableAchievements = function(userStats) {
  return this.find({
    isActive: true,
    $or: [
      { requiredPoints: { $lte: userStats.points || 0 } },
      {
        'requirements.postsCount': { $lte: userStats.postsCount || 0 },
        'requirements.productsCount': { $lte: userStats.productsCount || 0 },
        'requirements.shopsCount': { $lte: userStats.shopsCount || 0 },
        'requirements.messagesCount': { $lte: userStats.messagesCount || 0 },
        'requirements.followersCount': { $lte: userStats.followersCount || 0 }
      }
    ]
  }).sort({ requiredPoints: 1 });
};

achievementSchema.statics.getByCategory = function(category) {
  return this.find({
    category,
    isActive: true
  }).sort({ difficulty: 1, requiredPoints: 1 });
};

achievementSchema.statics.getByDifficulty = function(difficulty) {
  return this.find({
    difficulty,
    isActive: true
  }).sort({ requiredPoints: 1 });
};

// Metody instancji
achievementSchema.methods.incrementCompletedCount = function() {
  this.completedCount += 1;
  return this.save();
};

achievementSchema.methods.checkRequirements = function(userStats) {
  const reqs = this.requirements;
  
  return (
    (userStats.points || 0) >= this.requiredPoints &&
    (userStats.postsCount || 0) >= reqs.postsCount &&
    (userStats.productsCount || 0) >= reqs.productsCount &&
    (userStats.shopsCount || 0) >= reqs.shopsCount &&
    (userStats.messagesCount || 0) >= reqs.messagesCount &&
    (userStats.followersCount || 0) >= reqs.followersCount
  );
};

// Wirtualne pola
achievementSchema.virtual('difficultyColor').get(function() {
  const colors = {
    easy: '#28a745',
    medium: '#ffc107',
    hard: '#fd7e14',
    extreme: '#dc3545'
  };
  return colors[this.difficulty] || colors.easy;
});

achievementSchema.virtual('difficultyText').get(function() {
  const texts = {
    easy: 'Łatwe',
    medium: 'Średnie',
    hard: 'Trudne',
    extreme: 'Ekstremalne'
  };
  return texts[this.difficulty] || texts.easy;
});

achievementSchema.virtual('completionRate').get(function() {
  // Tymczasowo zwracamy 0, w przyszłości będzie to obliczane na podstawie liczby użytkowników
  return 0;
});

// Konfiguracja toJSON
achievementSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Achievement', achievementSchema); 