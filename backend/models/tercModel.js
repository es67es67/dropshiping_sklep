const mongoose = require('mongoose');

const tercSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  code: { type: String, required: true }, // Kod TERC - bez indeksu unique
  type: { 
    type: String, 
    enum: ['województwo', 'powiat', 'gmina'], 
    required: true 
  },
  
  // Kody hierarchiczne
  wojewodztwoCode: { type: String, maxlength: 2 }, // Kod województwa
  powiatCode: { type: String, maxlength: 4 }, // Kod powiatu (województwo + powiat)
  gminaCode: { type: String, maxlength: 6 }, // Kod gminy (województwo + powiat + gmina)
  
  // Rodzaj jednostki
  rodzaj: { type: String }, // np. 'województwo', 'powiat ziemski', 'gmina miejska'
  
  // Hierarchia - referencje do innych dokumentów TERC
  parentTerc: { type: mongoose.Schema.Types.ObjectId, ref: 'Terc' },
  wojewodztwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Terc' },
  powiat: { type: mongoose.Schema.Types.ObjectId, ref: 'Terc' },
  
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
tercSchema.index({ code: 1 }, { unique: true });
tercSchema.index({ type: 1 });
tercSchema.index({ wojewodztwoCode: 1 });
tercSchema.index({ powiatCode: 1 });
tercSchema.index({ gminaCode: 1 });
tercSchema.index({ name: 1 });
tercSchema.index({ 'name': 'text' }); // Indeks tekstowy dla wyszukiwania

// Middleware do aktualizacji updatedAt
tercSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metody statyczne
tercSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code });
};

tercSchema.statics.findByType = function(type) {
  return this.find({ type: type }).sort({ name: 1 });
};

tercSchema.statics.findWojewodztwa = function() {
  return this.find({ type: 'województwo' }).sort({ name: 1 });
};

tercSchema.statics.findPowiaty = function(wojewodztwoCode) {
  const query = { type: 'powiat' };
  if (wojewodztwoCode) {
    query.wojewodztwoCode = wojewodztwoCode;
  }
  return this.find(query).sort({ name: 1 });
};

tercSchema.statics.findGminy = function(powiatCode) {
  const query = { type: 'gmina' };
  if (powiatCode) {
    query.powiatCode = powiatCode;
  }
  return this.find(query).sort({ name: 1 });
};

// Metody instancji
tercSchema.methods.getFullName = function() {
  return this.name;
};

tercSchema.methods.getHierarchy = function() {
  return {
    wojewodztwo: this.wojewodztwoCode,
    powiat: this.powiatCode,
    gmina: this.gminaCode
  };
};

module.exports = mongoose.model('Terc', tercSchema); 