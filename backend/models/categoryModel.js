const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // Nazwa kategorii
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Slug (URL-friendly)
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Opis kategorii
  description: {
    type: String,
    maxlength: 1000
  },
  
  // Kategoria nadrzędna
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  
  // Hierarchia (ścieżka)
  path: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Poziom w hierarchii
  level: {
    type: Number,
    default: 0
  },
  
  // Kolejność sortowania
  order: {
    type: Number,
    default: 0
  },
  
  // Obraz kategorii
  image: {
    url: { type: String },
    alt: { type: String }
  },
  
  // Ikona
  icon: {
    type: String
  },
  
  // Meta tagi SEO
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }]
  },
  
  // Status kategorii
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Czy wyświetlać w menu
  showInMenu: {
    type: Boolean,
    default: true
  },
  
  // Czy wyświetlać na stronie głównej
  showOnHomepage: {
    type: Boolean,
    default: false
  },
  
  // Statystyki
  stats: {
    productCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 }
  },
  
  // Atrybuty filtrowania
  attributes: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['text', 'number', 'boolean', 'select'], required: true },
    values: [{ type: String }], // dla typu 'select'
    required: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    filterable: { type: Boolean, default: true }
  }],
  
  // Twórca kategorii
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Metody kategorii
categorySchema.methods.getFullPath = function() {
  return this.path.map(id => id.toString());
};

categorySchema.methods.getChildren = function() {
  return this.model('Category').find({ parent: this._id, isActive: true }).sort('order');
};

categorySchema.methods.getSiblings = function() {
  return this.model('Category').find({ 
    parent: this.parent, 
    _id: { $ne: this._id },
    isActive: true 
  }).sort('order');
};

categorySchema.methods.updateProductCount = async function() {
  const Product = require('./productModel');
  const count = await Product.countDocuments({ 
    category: this._id, 
    isActive: true 
  });
  
  this.stats.productCount = count;
  return this.save();
};

// Statyczne metody
categorySchema.statics.getTree = async function() {
  const categories = await this.find({ isActive: true }).sort('order');
  return this.buildTree(categories);
};

categorySchema.statics.buildTree = function(categories, parentId = null) {
  const tree = [];
  
  for (const category of categories) {
    if (category.parent?.toString() === parentId?.toString()) {
      const children = this.buildTree(categories, category._id);
      if (children.length > 0) {
        category.children = children;
      }
      tree.push(category);
    }
  }
  
  return tree;
};

categorySchema.statics.getBreadcrumbs = async function(categoryId) {
  const category = await this.findById(categoryId).populate('path');
  if (!category) return [];
  
  return category.path.concat(category);
};

// Indeksy
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1, showInMenu: 1 });
categorySchema.index({ order: 1 });

module.exports = mongoose.model('Category', categorySchema); 