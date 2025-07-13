const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
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

// Hook przed zapisem - generuj slug
shopSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

module.exports = mongoose.model('Shop', shopSchema);
