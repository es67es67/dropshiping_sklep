
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String }, // cache nazwy użytkownika
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  verified: { type: Boolean, default: false }, // czy użytkownik kupił produkt
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // jeden user, jedna recenzja na produkt

module.exports = mongoose.model('Review', reviewSchema);
