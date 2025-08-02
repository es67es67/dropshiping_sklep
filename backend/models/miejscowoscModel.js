const mongoose = require('mongoose');

const miejscowoscSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  code: { type: String, required: true, maxlength: 7 }, // Kod SIMC (7 cyfr)
  rodzaj: { type: String }, // Rodzaj miejscowości
  nazwaDodatkowa: { type: String }, // np. "wieś", "miasto"
  stanNa: { type: String }, // Data stanu na
  
  // Hierarchia z referencjami
  wojewodztwoCode: { type: String, required: true, maxlength: 2 }, // Kod województwa
  powiatCode: { type: String, required: true, maxlength: 4 }, // Kod powiatu
  gminaCode: { type: String, required: true, maxlength: 6 }, // Kod gminy
  
  // Referencje do hierarchii (ObjectId)
  wojewodztwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Wojewodztwo' },
  powiat: { type: mongoose.Schema.Types.ObjectId, ref: 'Powiat' },
  gmina: { type: mongoose.Schema.Types.ObjectId, ref: 'Gmina' },
  
  // Statystyki
  stats: {
    totalUlice: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },
    totalShops: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    totalCompanies: { type: Number, default: 0 }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  
  // Metadane
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indeksy (bez unique - miejscowości mogą mieć te same kody)
miejscowoscSchema.index({ code: 1 });
miejscowoscSchema.index({ name: 1 });
miejscowoscSchema.index({ wojewodztwoCode: 1 });
miejscowoscSchema.index({ powiatCode: 1 });
miejscowoscSchema.index({ gminaCode: 1 });
miejscowoscSchema.index({ wojewodztwo: 1 });
miejscowoscSchema.index({ powiat: 1 });
miejscowoscSchema.index({ gmina: 1 });
miejscowoscSchema.index({ 'name': 'text' });

// Middleware
miejscowoscSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metody statyczne
miejscowoscSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code });
};

miejscowoscSchema.statics.findByGmina = function(gminaCode) {
  return this.find({ gminaCode: gminaCode }).sort({ name: 1 });
};

miejscowoscSchema.statics.findByPowiat = function(powiatCode) {
  return this.find({ powiatCode: powiatCode }).sort({ name: 1 });
};

miejscowoscSchema.statics.findByWojewodztwo = function(wojewodztwoCode) {
  return this.find({ wojewodztwoCode: wojewodztwoCode }).sort({ name: 1 });
};

// Metody z referencjami
miejscowoscSchema.statics.findByGminaWithRefs = function(gminaId) {
  return this.find({ gmina: gminaId })
    .populate('wojewodztwo')
    .populate('powiat')
    .populate('gmina')
    .sort({ name: 1 });
};

miejscowoscSchema.statics.findByPowiatWithRefs = function(powiatId) {
  return this.find({ powiat: powiatId })
    .populate('wojewodztwo')
    .populate('powiat')
    .populate('gmina')
    .sort({ name: 1 });
};

miejscowoscSchema.statics.findByWojewodztwoWithRefs = function(wojewodztwoId) {
  return this.find({ wojewodztwo: wojewodztwoId })
    .populate('wojewodztwo')
    .populate('powiat')
    .populate('gmina')
    .sort({ name: 1 });
};

miejscowoscSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Miejscowosc', miejscowoscSchema, 'miejscowosci'); 