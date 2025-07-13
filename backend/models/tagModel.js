const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  // Nazwa tagu
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Slug
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  // Opis tagu
  description: {
    type: String,
    maxlength: 500
  },
  
  // Typ tagu
  type: {
    type: String,
    enum: ['product', 'category', 'brand', 'feature', 'trend', 'custom'],
    default: 'product'
  },
  
  // Kolor tagu
  color: {
    type: String,
    default: '#3B82F6'
  },
  
  // Ikona
  icon: {
    type: String
  },
  
  // Status tagu
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statystyki użycia
  stats: {
    usageCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 }
  },
  
  // Powiązane tagi
  relatedTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  
  // Twórca tagu
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Metody tagu
tagSchema.methods.incrementUsage = function() {
  this.stats.usageCount += 1;
  return this.save();
};

tagSchema.methods.decrementUsage = function() {
  this.stats.usageCount = Math.max(0, this.stats.usageCount - 1);
  return this.save();
};

// Statyczne metody
tagSchema.statics.findOrCreate = async function(name, type = 'product', createdBy = null) {
  let tag = await this.findOne({ name: name.toLowerCase() });
  
  if (!tag) {
    tag = new this({
      name: name.toLowerCase(),
      slug: this.generateSlug(name),
      type,
      createdBy
    });
    await tag.save();
  }
  
  return tag;
};

tagSchema.statics.generateSlug = function(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

tagSchema.statics.getPopularTags = async function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ 'stats.usageCount': -1 })
    .limit(limit);
};

tagSchema.statics.searchTags = async function(query, limit = 10) {
  return this.find({
    name: { $regex: query, $options: 'i' },
    isActive: true
  })
    .sort({ 'stats.usageCount': -1 })
    .limit(limit);
};

// Indeksy
tagSchema.index({ name: 1 });
tagSchema.index({ slug: 1 });
tagSchema.index({ type: 1 });
tagSchema.index({ 'stats.usageCount': -1 });
tagSchema.index({ isActive: 1 });

module.exports = mongoose.model('Tag', tagSchema); 