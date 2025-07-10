const mongoose = require('mongoose');

const locationRatingSchema = new mongoose.Schema({
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Aktualizuj updatedAt przy każdej zmianie
locationRatingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indeksy
locationRatingSchema.index({ location: 1, user: 1 }, { unique: true });
locationRatingSchema.index({ location: 1, createdAt: -1 });
locationRatingSchema.index({ user: 1, createdAt: -1 });

// Metoda do pobierania średniej oceny lokalizacji
locationRatingSchema.statics.getAverageRating = async function(locationId) {
  const result = await this.aggregate([
    { $match: { location: mongoose.Types.ObjectId(locationId) } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalRatings: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? result[0] : { averageRating: 0, totalRatings: 0 };
};

module.exports = mongoose.model('LocationRating', locationRatingSchema); 