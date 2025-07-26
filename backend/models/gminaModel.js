const mongoose = require('mongoose');

const gminaSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  code: { type: String, required: true, maxlength: 6 }, // Kod gminy (6 cyfr: WOJ+POW+GMI)
  rodzaj: { type: String }, // Rodzaj gminy (1, 2, 3, 4, 5, 8, 9)
  nazwaDodatkowa: { type: String }, // np. "gmina miejska", "gmina wiejska"
  stanNa: { type: String }, // Data stanu na
  
  // Hierarchia
  wojewodztwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Wojewodztwo', required: true },
  powiat: { type: mongoose.Schema.Types.ObjectId, ref: 'Powiat', required: true },
  wojewodztwoCode: { type: String, required: true, maxlength: 2 }, // Kod województwa
  powiatCode: { type: String, required: true, maxlength: 4 }, // Kod powiatu
  
  // Statystyki
  stats: {
    totalMiejscowosci: { type: Number, default: 0 },
    totalUlice: { type: Number, default: 0 }
  },
  
  // Referencje do podlokalizacji (opcjonalne, dla łatwiejszego nawigowania)
  miejscowosci: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Miejscowosc' }],
  
  // Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  
  // Metadane
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indeksy
gminaSchema.index({ code: 1, rodzaj: 1 }, { unique: true }); // Unikalna kombinacja kodu i typu gminy
gminaSchema.index({ name: 1 });
gminaSchema.index({ wojewodztwo: 1 });
gminaSchema.index({ powiat: 1 });
gminaSchema.index({ wojewodztwoCode: 1 });
gminaSchema.index({ powiatCode: 1 });
gminaSchema.index({ 'name': 'text' });

// Middleware
gminaSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metody statyczne
gminaSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code });
};

gminaSchema.statics.findByPowiat = function(powiatCode) {
  return this.find({ powiatCode: powiatCode }).sort({ name: 1 });
};

gminaSchema.statics.findByWojewodztwo = function(wojewodztwoCode) {
  return this.find({ wojewodztwoCode: wojewodztwoCode }).sort({ name: 1 });
};

gminaSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Gmina', gminaSchema, 'gminy'); 