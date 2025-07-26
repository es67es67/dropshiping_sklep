const mongoose = require('mongoose');

const powiatSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  code: { type: String, required: true, maxlength: 4 }, // Kod powiatu (4 cyfry: WOJ+POW)
  nazwaDodatkowa: { type: String }, // np. "powiat"
  stanNa: { type: String }, // Data stanu na
  
  // Hierarchia
  wojewodztwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Wojewodztwo', required: true },
  wojewodztwoCode: { type: String, required: true, maxlength: 2 }, // Kod województwa
  
  // Statystyki
  stats: {
    totalGminy: { type: Number, default: 0 },
    totalMiejscowosci: { type: Number, default: 0 },
    totalUlice: { type: Number, default: 0 }
  },
  
  // Referencje do podlokalizacji (opcjonalne, dla łatwiejszego nawigowania)
  gminy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gmina' }],
  miejscowosci: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Miejscowosc' }],
  
  // Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  
  // Metadane
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indeksy
powiatSchema.index({ code: 1 }, { unique: true });
powiatSchema.index({ name: 1 });
powiatSchema.index({ wojewodztwo: 1 });
powiatSchema.index({ wojewodztwoCode: 1 });
powiatSchema.index({ 'name': 'text' });

// Middleware
powiatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metody statyczne
powiatSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code });
};

powiatSchema.statics.findByWojewodztwo = function(wojewodztwoCode) {
  return this.find({ wojewodztwoCode: wojewodztwoCode }).sort({ name: 1 });
};

powiatSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Powiat', powiatSchema, 'powiaty'); 