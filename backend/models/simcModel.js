const mongoose = require('mongoose');

const simcSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  code: { type: String, required: true }, // Kod SIMC - bez indeksu unique
  type: { 
    type: String, 
    enum: ['miejscowość', 'część miejscowości', 'obszar'], 
    default: 'miejscowość'
  },
  
  // Kody hierarchiczne
  wojewodztwoCode: { type: String, maxlength: 2 },
  powiatCode: { type: String, maxlength: 4 },
  gminaCode: { type: String, maxlength: 6 },
  tercCode: { type: String, maxlength: 6 }, // Pełny kod TERC gminy
  
  // Rodzaj miejscowości
  rodzaj: { type: String }, // np. 'wieś', 'miasto', 'osada'
  rodzajGminy: { type: String }, // Rodzaj gminy do której należy
  
  // Hierarchia - referencje do TERC
  wojewodztwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Terc' },
  powiat: { type: mongoose.Schema.Types.ObjectId, ref: 'Terc' },
  gmina: { type: mongoose.Schema.Types.ObjectId, ref: 'Terc' },
  
  // Lokalizacja
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Statystyki
  population: { type: Number, default: 0 },
  area: { type: Number }, // Powierzchnia w km²
  
  // Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  
  // Metadane
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indeksy dla szybkiego wyszukiwania
simcSchema.index({ code: 1 }, { unique: true });
simcSchema.index({ type: 1 });
simcSchema.index({ wojewodztwoCode: 1 });
simcSchema.index({ powiatCode: 1 });
simcSchema.index({ gminaCode: 1 });
simcSchema.index({ tercCode: 1 });
simcSchema.index({ name: 1 });
simcSchema.index({ 'name': 'text' }); // Indeks tekstowy dla wyszukiwania
simcSchema.index({ gmina: 1 }); // Indeks dla wyszukiwania po gminie

// Middleware do aktualizacji updatedAt
simcSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metody statyczne
simcSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code });
};

simcSchema.statics.findByGmina = function(gminaCode) {
  return this.find({ gminaCode: gminaCode, type: 'miejscowość' }).sort({ name: 1 });
};

simcSchema.statics.findByPowiat = function(powiatCode) {
  return this.find({ powiatCode: powiatCode, type: 'miejscowość' }).sort({ name: 1 });
};

simcSchema.statics.findByWojewodztwo = function(wojewodztwoCode) {
  return this.find({ wojewodztwoCode: wojewodztwoCode, type: 'miejscowość' }).sort({ name: 1 });
};

simcSchema.statics.searchByName = function(searchTerm, limit = 50) {
  return this.find({
    name: { $regex: searchTerm, $options: 'i' },
    type: 'miejscowość'
  })
  .limit(limit)
  .sort({ name: 1 });
};

// Metody instancji
simcSchema.methods.getFullName = function() {
  return this.name;
};

simcSchema.methods.getHierarchy = function() {
  return {
    wojewodztwo: this.wojewodztwoCode,
    powiat: this.powiatCode,
    gmina: this.gminaCode,
    terc: this.tercCode
  };
};

module.exports = mongoose.model('Simc', simcSchema); 