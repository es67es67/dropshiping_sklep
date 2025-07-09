const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Lokalizacja
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  address: {
    street: { type: String },
    houseNumber: { type: String },
    postalCode: { type: String },
    city: { type: String }
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Kontakt
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  
  // Media
  logo: { type: String }, // URL do logo sklepu
  coverImage: { type: String }, // Zdjęcie okładki sklepu
  images: [{ type: String }], // Galeria zdjęć sklepu
  
  // Kategorie i tagi
  categories: [{ type: String }], // np. ['elektronika', 'moda', 'dom']
  tags: [{ type: String }], // np. ['nowe', 'promocje', 'lokalne']
  
  // Godziny otwarcia
  openingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: true } }
  },
  
  // Status i weryfikacja
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: false }, // Czy sklep prowadzi sprzedaż online
  
  // Oceny i recenzje
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Statystyki
  stats: {
    totalProducts: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalFollowers: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 }
  },
  
  // Followersi i obserwujący
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Sklepy które obserwuje
  
  // Live Shopping
  liveStreams: [{
    title: { type: String },
    description: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    isActive: { type: Boolean, default: false },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  }],
  
  // Stories
  stories: [{
    content: { type: String },
    media: { type: String }, // URL do zdjęcia/wideo
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    duration: { type: Number, default: 24 }, // Godziny wyświetlania
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Wydarzenia i promocje
  events: [{
    title: { type: String },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    type: { type: String, enum: ['sale', 'event', 'promotion'], default: 'event' },
    isActive: { type: Boolean, default: true }
  }],
  
  // Ustawienia
  settings: {
    allowReviews: { type: Boolean, default: true },
    allowMessages: { type: Boolean, default: true },
    autoAcceptOrders: { type: Boolean, default: false },
    showInventory: { type: Boolean, default: true }
  },
  
  // Płatności i dostawa
  paymentMethods: [{ type: String }], // ['cash', 'card', 'transfer', 'paypal']
  deliveryOptions: [{
    type: { type: String }, // 'pickup', 'delivery', 'shipping'
    cost: { type: Number },
    description: { type: String }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Aktualizuj updatedAt przy każdej zmianie
shopSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Metoda do obliczania średniej oceny
shopSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  return this.save();
};

// Metoda do dodawania recenzji
shopSchema.methods.addReview = function(userId, rating, comment) {
  // Sprawdź czy użytkownik już ocenił ten sklep
  const existingReview = this.reviews.find(review => review.user.toString() === userId);
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.createdAt = Date.now();
  } else {
    this.reviews.push({ user: userId, rating, comment });
  }
  
  return this.updateRating();
};

// Metoda do obserwowania sklepu
shopSchema.methods.toggleFollow = function(userId) {
  const followerIndex = this.followers.indexOf(userId);
  if (followerIndex > -1) {
    this.followers.splice(followerIndex, 1);
    this.stats.totalFollowers--;
  } else {
    this.followers.push(userId);
    this.stats.totalFollowers++;
  }
  return this.save();
};

// Metoda do dodawania story
shopSchema.methods.addStory = function(content, media, type = 'image') {
  this.stories.push({ content, media, type });
  return this.save();
};

// Metoda do usuwania starych stories (starszych niż 24h)
shopSchema.methods.cleanOldStories = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  this.stories = this.stories.filter(story => story.createdAt > twentyFourHoursAgo);
  return this.save();
};

// Metoda do rozpoczynania live stream
shopSchema.methods.startLiveStream = function(title, description, products = []) {
  this.liveStreams.push({
    title,
    description,
    startTime: new Date(),
    isActive: true,
    products
  });
  return this.save();
};

// Metoda do kończenia live stream
shopSchema.methods.endLiveStream = function(streamId) {
  const stream = this.liveStreams.id(streamId);
  if (stream) {
    stream.isActive = false;
    stream.endTime = new Date();
  }
  return this.save();
};

// Metoda do dodawania wydarzenia
shopSchema.methods.addEvent = function(title, description, startDate, endDate, type = 'event') {
  this.events.push({ title, description, startDate, endDate, type });
  return this.save();
};

// Metoda do aktualizacji statystyk
shopSchema.methods.updateStats = function() {
  this.stats.totalProducts = 0; // Będzie aktualizowane przez Product model
  this.stats.totalFollowers = this.followers.length;
  return this.save();
};

module.exports = mongoose.model('Shop', shopSchema);
