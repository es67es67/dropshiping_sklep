const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  // Unikalne ID dla każdego wpisu - może być kod TERYT lub wygenerowane ID
  uniqueId: { type: String, required: true },
  
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['województwo', 'powiat', 'gmina', 'miejscowość', 'ulica'], 
    required: true 
  },
  code: { type: String }, // Kod TERYT (może się duplikować w różnych jednostkach)
  parentLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }], // Podlokalizacje
  
  // Hierarchia dla łatwego nawigowania
  wojewodztwo: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  powiat: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  gmina: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  population: { type: Number },
  area: { type: Number }, // Powierzchnia w km²
  description: { type: String },
  images: [{ type: String }], // Zdjęcia miejscowości
  coverImage: { type: String }, // Główne zdjęcie
  
  // Statystyki
  stats: {
    totalUsers: { type: Number, default: 0 },
    totalShops: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 }
  },
  
  // Dodatkowe informacje
  tags: [{ type: String }], // np. ['turystyka', 'handel', 'kultura', 'przemysł']
  features: [{ type: String }], // np. ['lotnisko', 'port', 'centrum handlowe', 'muzeum']
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Aktualizuj updatedAt przy każdej zmianie
locationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indeksy dla szybkiego wyszukiwania
locationSchema.index({ name: 'text' });
locationSchema.index({ type: 1, isActive: 1 });
locationSchema.index({ code: 1 });
locationSchema.index({ parentLocation: 1 });
locationSchema.index({ wojewodztwo: 1, powiat: 1, gmina: 1 });
// Indeks na uniqueId dla unikalności
locationSchema.index({ uniqueId: 1 }, { unique: true });

// Metoda do pobierania pełnej hierarchii
locationSchema.methods.getFullHierarchy = function() {
  return this.model('Location').find({
    $or: [
      { _id: this.wojewodztwo },
      { _id: this.powiat },
      { _id: this.gmina },
      { _id: this._id }
    ]
  }).sort({ type: 1 });
};

// Metoda do pobierania wszystkich podlokalizacji
locationSchema.methods.getAllChildren = function() {
  return this.model('Location').find({
    $or: [
      { wojewodztwo: this._id },
      { powiat: this._id },
      { gmina: this._id },
      { parentLocation: this._id }
    ]
  });
};

// Metoda do aktualizacji statystyk
locationSchema.methods.updateStats = async function() {
  const Product = mongoose.model('Product');
  const Shop = mongoose.model('Shop');
  const User = mongoose.model('User');
  const Post = mongoose.model('Post');
  
  // Pobierz wszystkie podlokalizacje
  const allChildren = await this.getAllChildren();
  const allLocationIds = [this._id, ...allChildren.map(child => child._id)];
  
  // Policz statystyki
  const [products, shops, users, posts] = await Promise.all([
    Product.countDocuments({ location: { $in: allLocationIds } }),
    Shop.countDocuments({ location: { $in: allLocationIds } }),
    User.countDocuments({ location: { $in: allLocationIds } }),
    Post.countDocuments({ location: { $in: allLocationIds } })
  ]);
  
  this.stats = {
    totalProducts: products,
    totalShops: shops,
    totalUsers: users,
    totalPosts: posts,
    totalEvents: 0 // TODO: dodać liczenie wydarzeń
  };
  
  return this.save();
};

module.exports = mongoose.model('Location', locationSchema); 