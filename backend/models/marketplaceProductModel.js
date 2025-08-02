const mongoose = require('mongoose');

const marketplaceProductSchema = new mongoose.Schema({
  // Podstawowe informacje
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    trim: true,
    maxlength: 2000
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Elektronika',
      'Moda',
      'Dom i Ogród',
      'Sport',
      'Książki',
      'Motoryzacja',
      'Zdrowie',
      'Muzyka',
      'Zabawki',
      'Kolekcje',
      'Dzieci',
      'Hobby',
      'Inne'
    ]
  },
  brand: { 
    type: String, 
    trim: true 
  },
  
  // Stan i typ sprzedaży
  condition: { 
    type: String, 
    enum: ['new', 'like_new', 'good', 'acceptable', 'used'],
    default: 'new'
  },
  saleType: { 
    type: String, 
    enum: ['fixed_price', 'auction', 'negotiation', 'free'],
    default: 'fixed_price'
  },
  
  // Lokalizacja produktu
  location: {
    voivodeship: { type: String, trim: true },
    county: { type: String, trim: true },
    municipality: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    terytCode: { type: String, trim: true }
  },
  
  // Zdjęcia
  images: [{ type: String }],
  mainImage: { type: String },
  
  // Tagi
  tags: [{ type: String, trim: true }],
  
  // Sprzedawca (użytkownik)
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Status produktu
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  isSold: { 
    type: Boolean, 
    default: false 
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  
  // Oceny i recenzje
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    distribution: {
      '1': { type: Number, default: 0 },
      '2': { type: Number, default: 0 },
      '3': { type: Number, default: 0 },
      '4': { type: Number, default: 0 },
      '5': { type: Number, default: 0 }
    }
  },
  
  // Statystyki
  stats: {
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  
  // Aukcja (jeśli applicable)
  auction: {
    startPrice: { type: Number },
    currentPrice: { type: Number },
    minIncrement: { type: Number, default: 1 },
    endTime: { type: Date },
    bids: [{
      bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number },
      timestamp: { type: Date, default: Date.now }
    }],
    isActive: { type: Boolean, default: false }
  },
  
  // Negocjacje
  negotiation: {
    offers: [{
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number },
      message: { type: String },
      status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      timestamp: { type: Date, default: Date.now }
    }]
  },
  
  // Metadane
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  soldAt: { type: Date },
  expiresAt: { type: Date }
}, {
  timestamps: true
});

// Indeksy dla wydajności
marketplaceProductSchema.index({ seller: 1 });
marketplaceProductSchema.index({ category: 1 });
marketplaceProductSchema.index({ price: 1 });
marketplaceProductSchema.index({ isActive: 1, isAvailable: 1 });
marketplaceProductSchema.index({ 'location.city': 1 });
marketplaceProductSchema.index({ createdAt: -1 });
marketplaceProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
});

// Aktualizuj updatedAt przy każdej zmianie
marketplaceProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Metoda do dodawania oceny
marketplaceProductSchema.methods.addRating = function(rating) {
  if (rating < 1 || rating > 5) {
    throw new Error('Ocena musi być między 1 a 5');
  }
  
  const currentTotal = this.ratings.average * this.ratings.count;
  this.ratings.count += 1;
  this.ratings.average = (currentTotal + rating) / this.ratings.count;
  this.ratings.distribution[rating] += 1;
  
  return this.save();
};

// Metoda do dodawania wyświetlenia
marketplaceProductSchema.methods.addView = function() {
  this.stats.views += 1;
  return this.save();
};

// Metoda do dodawania do ulubionych
marketplaceProductSchema.methods.addToFavorites = function() {
  this.stats.favorites += 1;
  return this.save();
};

// Metoda do usuwania z ulubionych
marketplaceProductSchema.methods.removeFromFavorites = function() {
  if (this.stats.favorites > 0) {
    this.stats.favorites -= 1;
  }
  return this.save();
};

// Metoda do dodawania oferty aukcyjnej
marketplaceProductSchema.methods.addBid = function(bidderId, amount) {
  if (this.saleType !== 'auction') {
    throw new Error('Produkt nie jest wystawiony na aukcję');
  }
  
  if (!this.auction.isActive) {
    throw new Error('Aukcja nie jest aktywna');
  }
  
  if (amount <= this.auction.currentPrice) {
    throw new Error('Oferta musi być wyższa niż aktualna cena');
  }
  
  this.auction.bids.push({
    bidder: bidderId,
    amount: amount,
    timestamp: Date.now()
  });
  
  this.auction.currentPrice = amount;
  
  return this.save();
};

// Metoda do dodawania oferty negocjacyjnej
marketplaceProductSchema.methods.addOffer = function(buyerId, amount, message = '') {
  if (this.saleType !== 'negotiation') {
    throw new Error('Produkt nie jest wystawiony na negocjacje');
  }
  
  this.negotiation.offers.push({
    buyer: buyerId,
    amount: amount,
    message: message,
    status: 'pending',
    timestamp: Date.now()
  });
  
  return this.save();
};

// Metoda do akceptacji oferty
marketplaceProductSchema.methods.acceptOffer = function(offerId) {
  const offer = this.negotiation.offers.id(offerId);
  if (!offer) {
    throw new Error('Oferta nie została znaleziona');
  }
  
  offer.status = 'accepted';
  this.isSold = true;
  this.soldAt = Date.now();
  
  return this.save();
};

// Metoda do odrzucenia oferty
marketplaceProductSchema.methods.rejectOffer = function(offerId) {
  const offer = this.negotiation.offers.id(offerId);
  if (!offer) {
    throw new Error('Oferta nie została znaleziona');
  }
  
  offer.status = 'rejected';
  return this.save();
};

// Statyczne metody
marketplaceProductSchema.statics.findByCategory = function(category, limit = 20) {
  return this.find({ 
    category, 
    isActive: true, 
    isAvailable: true 
  })
  .populate('seller', 'username firstName lastName avatar')
  .sort({ createdAt: -1 })
  .limit(limit);
};

marketplaceProductSchema.statics.findByLocation = function(city, limit = 20) {
  return this.find({ 
    'location.city': new RegExp(city, 'i'),
    isActive: true, 
    isAvailable: true 
  })
  .populate('seller', 'username firstName lastName avatar')
  .sort({ createdAt: -1 })
  .limit(limit);
};

marketplaceProductSchema.statics.findBySeller = function(sellerId, limit = 20) {
  return this.find({ 
    seller: sellerId,
    isActive: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

module.exports = mongoose.model('MarketplaceProduct', marketplaceProductSchema); 