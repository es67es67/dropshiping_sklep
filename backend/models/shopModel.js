const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Ogólne' }, // Zmienione z required na opcjonalne z domyślną wartością
  subcategory: { type: String },
  
  // Właściciel
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Kontakt
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  
  // Adres
  address: {
    street: { type: String },
    houseNumber: { type: String },
    postalCode: { type: String },
    city: { type: String, required: true },
    voivodeship: { type: String },
    county: { type: String },
    municipality: { type: String }
  },
  
  // Kody TERYT (TERC, SIMC, ULIC) - nowe pola
  teryt: {
    // TERC - kod województwa (2 cyfry)
    voivodeshipCode: { type: String, maxlength: 2 },
    // TERC - kod powiatu (2 cyfry) 
    countyCode: { type: String, maxlength: 4 },
    // TERC - kod gminy (2 cyfry)
    municipalityCode: { type: String, maxlength: 6 },
    // Pełny kod TERC (województwo + powiat + gmina = 6 cyfr)
    tercCode: { type: String, maxlength: 6 },
    // SIMC - kod miejscowości (7 cyfr)
    simcCode: { type: String, maxlength: 7 },
    // ULIC - kod ulicy (5 cyfr)
    ulicCode: { type: String, maxlength: 5 },
    // Pełny kod adresu (TERC + SIMC + ULIC)
    fullCode: { type: String, maxlength: 18 }
  },
  
  // Lokalizacja (koordynaty)
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  // Godziny otwarcia
  openingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  
  // Media
  logo: { type: String },
  coverImage: { type: String },
  images: [{ type: String }],
  
  // Status i weryfikacja
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'suspended', 'pending'], default: 'pending' },
  
  // Oceny i recenzje
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  
  // Statystyki
  stats: {
    totalProducts: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 }
  },
  
  // Opcje dostawy
  deliveryOptions: [{
    name: { type: String },
    description: { type: String },
    cost: { type: Number, default: 0 },
    freeFrom: { type: Number },
    estimatedDays: { type: Number }
  }],
  
  // Metody płatności
  paymentMethods: [{
    name: { type: String },
    description: { type: String },
    enabled: { type: Boolean, default: true }
  }],
  
  // Polityka zwrotów
  returnPolicy: {
    period: { type: Number, default: 14 }, // dni
    description: { type: String },
    conditions: [{ type: String }]
  },
  
  // SEO
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    slug: { type: String, unique: true }
  },
  
  // Ustawienia
  settings: {
    autoAcceptOrders: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: true },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  
  // Tagi i kategorie
  tags: [{ type: String }],
  categories: [{ type: String }],
  
  // Powiązania
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

// Indeksy
shopSchema.index({ name: 'text', description: 'text', tags: 'text' });
shopSchema.index({ 'location.coordinates': '2dsphere' });
shopSchema.index({ category: 1, isActive: 1 });
shopSchema.index({ owner: 1 });
shopSchema.index({ 'address.city': 1 });

// Dodaj indeksy dla kodów TERYT
shopSchema.index({ 'teryt.tercCode': 1 });
shopSchema.index({ 'teryt.simcCode': 1 });
shopSchema.index({ 'teryt.ulicCode': 1 });
shopSchema.index({ 'teryt.fullCode': 1 });
shopSchema.index({ 'teryt.voivodeshipCode': 1 });
shopSchema.index({ 'teryt.countyCode': 1 });
shopSchema.index({ 'teryt.municipalityCode': 1 });

// Indeks tekstowy dla wyszukiwania
shopSchema.index({ name: 'text', description: 'text', 'address.city': 'text' });

// Metoda do obliczania średniej oceny
shopSchema.methods.updateAverageRating = function() {
  let total = 0;
  let count = 0;
  for (let i = 1; i <= 5; i++) {
    total += i * this.ratings.distribution[i];
    count += this.ratings.distribution[i];
  }
  this.ratings.average = count > 0 ? total / count : 0;
  this.ratings.count = count;
  return this.save();
};

// Metoda do dodawania oceny
shopSchema.methods.addRating = function(rating) {
  this.ratings.distribution[rating] += 1;
  return this.updateAverageRating();
};

// Metoda do generowania pełnego kodu TERYT
shopSchema.methods.generateFullTerytCode = function() {
  if (this.teryt.tercCode && this.teryt.simcCode && this.teryt.ulicCode) {
    this.teryt.fullCode = `${this.teryt.tercCode}${this.teryt.simcCode}${this.teryt.ulicCode}`;
  } else if (this.teryt.tercCode && this.teryt.simcCode) {
    this.teryt.fullCode = `${this.teryt.tercCode}${this.teryt.simcCode}`;
  } else if (this.teryt.tercCode) {
    this.teryt.fullCode = this.teryt.tercCode;
  }
  // Nie wywołujemy save() tutaj, tylko zwracamy this
  return this;
};

// Hook przed zapisem - generuj slug i pełny kod TERYT
shopSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Generuj pełny kod TERYT jeśli są dostępne częściowe kody
  if (this.isModified('teryt.tercCode') || this.isModified('teryt.simcCode') || this.isModified('teryt.ulicCode')) {
    this.generateFullTerytCode();
  }
  
  next();
});

module.exports = mongoose.model('Shop', shopSchema);
