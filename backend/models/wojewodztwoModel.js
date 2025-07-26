const mongoose = require('mongoose');

const wojewodztwoSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  code: { type: String, required: true, maxlength: 2 }, // Kod województwa (2 cyfry)
  nazwaDodatkowa: { type: String }, // np. "województwo"
  stanNa: { type: String }, // Data stanu na
  
  // Statystyki
  stats: {
    totalPowiaty: { type: Number, default: 0 },
    totalGminy: { type: Number, default: 0 },
    totalMiejscowosci: { type: Number, default: 0 },
    totalUlice: { type: Number, default: 0 }
  },
  
  // Referencje do podlokalizacji (opcjonalne, dla łatwiejszego nawigowania)
  powiaty: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Powiat' }],
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
wojewodztwoSchema.index({ code: 1 }, { unique: true }); // Kod województwa unikalny
wojewodztwoSchema.index({ name: 1 }, { unique: true }); // Nazwa województwa unikalna
wojewodztwoSchema.index({ 'name': 'text' });

// Middleware
wojewodztwoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metody statyczne
wojewodztwoSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code });
};

wojewodztwoSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Wojewodztwo', wojewodztwoSchema, 'wojewodztwa'); 