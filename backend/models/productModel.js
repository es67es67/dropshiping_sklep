const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  currency: { type: String, default: 'PLN' },
  category: { type: String, required: true },
  subcategory: { type: String },
  brand: { type: String },
  sku: { type: String, unique: true },
  barcode: { type: String },
  
  // Obrazy i multimedia
  images: [{ type: String }],
  mainImage: { type: String },
  videos: [{ type: String }],
  
  // Stan magazynowy
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 0 },
  maxStock: { type: Number },
  reservedStock: { type: Number, default: 0 },
  
  // Dostępność
  isAvailable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  
  // Wymiary i waga
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    weight: { type: Number }
  },
  
  // Atrybuty produktu
  attributes: [{
    name: { type: String },
    value: { type: String },
    unit: { type: String }
  }],
  
  // Warianty (np. rozmiary, kolory)
  variants: [{
    name: { type: String },
    value: { type: String },
    price: { type: Number },
    stock: { type: Number, default: 0 },
    sku: { type: String }
  }],
  
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
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 }
  },
  
  // SEO
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    slug: { type: String, unique: true }
  },
  
  // Powiązania
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  
  // Tagi i kategorie
  tags: [{ type: String }],
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  // Dostawa
  shipping: {
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    freeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },
    estimatedDelivery: { type: Number, default: 3 } // dni
  },
  
  // Gwarancja i zwroty
  warranty: {
    period: { type: Number }, // miesiące
    description: { type: String }
  },
  
  returnPolicy: {
    period: { type: Number, default: 14 }, // dni
    description: { type: String }
  }
}, { timestamps: true });

// Indeksy dla wyszukiwania
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ shop: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });

// Metoda do obliczania dostępnego stocku
productSchema.methods.getAvailableStock = function() {
  return Math.max(0, this.stock - this.reservedStock);
};

// Metoda do sprawdzania czy produkt jest dostępny
productSchema.methods.isInStock = function() {
  return this.isAvailable && this.isActive && this.getAvailableStock() > 0;
};

// Metoda do dodawania oceny
productSchema.methods.addRating = function(rating) {
  this.ratings.count += 1;
  this.ratings.distribution[rating] += 1;
  
  // Oblicz średnią
  let total = 0;
  let count = 0;
  for (let i = 1; i <= 5; i++) {
    total += i * this.ratings.distribution[i];
    count += this.ratings.distribution[i];
  }
  this.ratings.average = count > 0 ? total / count : 0;
  
  return this.save();
};

// Hook przed zapisem - generuj slug
productSchema.pre('save', function(next) {
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

module.exports = mongoose.model('Product', productSchema);
