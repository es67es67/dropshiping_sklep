const mongoose = require('mongoose');

const ulicSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { type: String, required: true },
  code: { type: String, required: true }, // Kod ULIC (SYM_UL) - bez indeksu unique
  type: { 
    type: String, 
    enum: ['ulica', 'plac', 'aleja', 'bulwar', 'rondo', 'skwer', 'park'], 
    default: 'ulica'
  },
  
  // Pola z pliku CSV GUS
  woj: { type: String, maxlength: 2 }, // Kod województwa
  pow: { type: String, maxlength: 4 }, // Kod powiatu
  gmi: { type: String, maxlength: 6 }, // Kod gminy
  rodzGmi: { type: String }, // Rodzaj gminy
  sym: { type: String, maxlength: 7 }, // Kod SIMC miejscowości
  symUlic: { type: String, maxlength: 7 }, // Kod ULIC (SYM_UL)
  cecha: { type: String }, // Cecha (ul., pl., al., itp.)
  nazwa1: { type: String }, // Pierwsza część nazwy
  nazwa2: { type: String }, // Druga część nazwy
  stanNa: { type: String }, // Data stanu na
  
  // Kody hierarchiczne (obliczane)
  wojewodztwoCode: { type: String, maxlength: 2 },
  powiatCode: { type: String, maxlength: 4 },
  gminaCode: { type: String, maxlength: 6 },
  tercCode: { type: String, maxlength: 6 }, // Pełny kod TERC gminy
  simcCode: { type: String, maxlength: 7 }, // Kod SIMC miejscowości
  
  // Rodzaj ulicy
  rodzaj: { type: String }, // np. 'ulica', 'plac', 'aleja'
  
  // Hierarchia - referencje do nowych modeli
  wojewodztwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Wojewodztwo' },
  powiat: { type: mongoose.Schema.Types.ObjectId, ref: 'Powiat' },
  gmina: { type: mongoose.Schema.Types.ObjectId, ref: 'Gmina' },
  miejscowosc: { type: mongoose.Schema.Types.ObjectId, ref: 'Miejscowosc' },
  
  // Lokalizacja
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Dodatkowe informacje
  postalCode: { type: String }, // Kod pocztowy
  description: { type: String }, // Opis ulicy
  
  // Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  
  // Metadane
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indeksy dla szybkiego wyszukiwania (BEZ unique - kod ULIC może się powtarzać)
ulicSchema.index({ symUlic: 1 }); // Kod ULIC (nie unique - może się powtarzać w różnych miejscowościach)
ulicSchema.index({ type: 1 });
ulicSchema.index({ woj: 1 });
ulicSchema.index({ pow: 1 });
ulicSchema.index({ gmi: 1 });
ulicSchema.index({ sym: 1 });
ulicSchema.index({ wojewodztwoCode: 1 });
ulicSchema.index({ powiatCode: 1 });
ulicSchema.index({ gminaCode: 1 });
ulicSchema.index({ tercCode: 1 });
ulicSchema.index({ simcCode: 1 });
ulicSchema.index({ name: 1 });
ulicSchema.index({ 'name': 'text' }); // Indeks tekstowy dla wyszukiwania
ulicSchema.index({ miejscowosc: 1 }); // Indeks dla wyszukiwania po miejscowości
ulicSchema.index({ postalCode: 1 }); // Indeks dla wyszukiwania po kodzie pocztowym

// Złożone indeksy (BEZ unique - ulice mogą się powtarzać)
ulicSchema.index({ name: 1, simcCode: 1 }); // Kombinacja nazwy i miejscowości
ulicSchema.index({ symUlic: 1, simcCode: 1 }); // Kombinacja kodu ULIC i miejscowości

// Middleware do aktualizacji updatedAt
ulicSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metody statyczne
ulicSchema.statics.findByCode = function(code) {
  return this.findOne({ symUlic: code });
};

ulicSchema.statics.findByMiejscowosc = function(simcCode) {
  return this.find({ simcCode: simcCode }).sort({ name: 1 });
};

ulicSchema.statics.findByGmina = function(gminaCode) {
  return this.find({ gminaCode: gminaCode }).sort({ name: 1 });
};

ulicSchema.statics.findByPowiat = function(powiatCode) {
  return this.find({ powiatCode: powiatCode }).sort({ name: 1 });
};

ulicSchema.statics.findByWojewodztwo = function(wojewodztwoCode) {
  return this.find({ wojewodztwoCode: wojewodztwoCode }).sort({ name: 1 });
};

ulicSchema.statics.searchByName = function(searchTerm, limit = 50) {
  return this.find({
    name: { $regex: searchTerm, $options: 'i' }
  })
  .limit(limit)
  .sort({ name: 1 });
};

ulicSchema.statics.findByPostalCode = function(postalCode) {
  return this.find({ postalCode: postalCode }).sort({ name: 1 });
};

// Metoda do sprawdzania duplikatów - sprawdza nazwę i miejscowość
ulicSchema.statics.findDuplicate = function(name, simcCode) {
  return this.findOne({ name: name, simcCode: simcCode });
};

// Metoda do sprawdzania duplikatów na podstawie wszystkich pól nazwy
ulicSchema.statics.findDuplicateByNameFields = function(nazwa1, nazwa2, cecha, symUlic) {
  return this.findOne({ 
    nazwa1: nazwa1, 
    nazwa2: nazwa2, 
    cecha: cecha, 
    symUlic: symUlic 
  });
};

// Metoda do sprawdzania duplikatów na podstawie kodu ULIC
ulicSchema.statics.findDuplicateByCode = function(symUlic) {
  return this.findOne({ symUlic: symUlic });
};

// Metody instancji
ulicSchema.methods.getFullName = function() {
  return this.name;
};

ulicSchema.methods.getHierarchy = function() {
  return {
    wojewodztwo: this.wojewodztwoCode,
    powiat: this.powiatCode,
    gmina: this.gminaCode,
    terc: this.tercCode,
    simc: this.simcCode
  };
};

module.exports = mongoose.model('Ulic', ulicSchema, 'ulice'); 