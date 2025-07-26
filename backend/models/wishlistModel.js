const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  // Notatki użytkownika
  notes: {
    type: String,
    maxlength: 500
  },
  
  // Priorytet (1-5)
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  
  // Czy produkt jest dostępny
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Cena w momencie dodania
  originalPrice: {
    type: Number
  },
  
  // Aktualna cena
  currentPrice: {
    type: Number
  },
  
  // Czy cena się zmieniła
  priceChanged: {
    type: Boolean,
    default: false
  },
  
  // Data dodania
  addedAt: {
    type: Date,
    default: Date.now
  },
  
  // Data ostatniej aktualizacji
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  // Właściciel wishlisty
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Nazwa wishlisty
  name: {
    type: String,
    default: 'Moja lista życzeń'
  },
  
  // Opis
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Czy wishlista jest publiczna
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Produkty w wishliście
  items: [wishlistItemSchema],
  
  // Statystyki
  stats: {
    itemCount: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    availableItems: { type: Number, default: 0 }
  },
  
  // Ustawienia powiadomień
  notifications: {
    priceDrop: { type: Boolean, default: true },
    backInStock: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  
  // Metadane
  metadata: {
    lastUpdated: { type: Date, default: Date.now },
    shareCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Metody wishlisty
wishlistSchema.methods.addItem = function(productId, notes = '', priority = 3) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.notes = notes;
    existingItem.priority = priority;
    existingItem.updatedAt = new Date();
  } else {
    this.items.push({
      product: productId,
      notes,
      priority
    });
  }

  return this.updateStats();
};

wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.updateStats();
};

wishlistSchema.methods.updateItem = function(productId, updates) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (item) {
    Object.assign(item, updates);
    item.updatedAt = new Date();
  }
  
  return this.updateStats();
};

wishlistSchema.methods.moveItem = function(productId, newIndex) {
  const itemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );
  
  if (itemIndex !== -1) {
    const item = this.items.splice(itemIndex, 1)[0];
    this.items.splice(newIndex, 0, item);
  }
  
  return this.save();
};

wishlistSchema.methods.updateStats = async function() {
  const Product = require('./productModel');
  
  let totalValue = 0;
  let availableItems = 0;
  
  for (let item of this.items) {
    const product = await Product.findById(item.product);
    if (product) {
      item.currentPrice = product.price;
      item.isAvailable = product.isActive && product.stock > 0;
      
      if (item.originalPrice && item.originalPrice !== product.price) {
        item.priceChanged = true;
      }
      
      if (item.isAvailable) {
        totalValue += product.price;
        availableItems++;
      }
    }
  }
  
  this.stats = {
    itemCount: this.items.length,
    totalValue,
    availableItems
  };
  
  this.metadata.lastUpdated = new Date();
  
  return this.save();
};

wishlistSchema.methods.clear = function() {
  this.items = [];
  this.stats = {
    itemCount: 0,
    totalValue: 0,
    availableItems: 0
  };
  return this.save();
};

wishlistSchema.methods.getItemsWithProducts = async function() {
  const Product = require('./productModel');
  
  const itemsWithProducts = await Promise.all(
    this.items.map(async (item) => {
      const product = await Product.findById(item.product)
        .populate('shop', 'name logo');
      
      return {
        ...item.toObject(),
        product
      };
    })
  );
  
  return itemsWithProducts;
};

// Statyczne metody
wishlistSchema.statics.findOrCreate = async function(userId) {
  let wishlist = await this.findOne({ user: userId });
  
  if (!wishlist) {
    wishlist = new this({ user: userId });
    await wishlist.save();
  }
  
  return wishlist;
};

wishlistSchema.statics.getPublicWishlists = async function(limit = 10) {
  return this.find({ isPublic: true })
    .populate('user', 'firstName lastName avatar')
    .sort({ 'metadata.shareCount': -1 })
    .limit(limit);
};

wishlistSchema.statics.searchWishlists = async function(query, limit = 10) {
  return this.find({
    isPublic: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  })
    .populate('user', 'firstName lastName avatar')
    .limit(limit);
};

// Indeksy
// wishlistSchema.index({ user: 1 }); // USUNIĘTO, bo pole user ma już unique: true
wishlistSchema.index({ isPublic: 1 });
wishlistSchema.index({ 'items.product': 1 });
wishlistSchema.index({ 'metadata.lastUpdated': -1 });

module.exports = mongoose.model('Wishlist', wishlistSchema); 