const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  location: { type: String, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  stock: { type: Number, default: 0 }, // Dodane pole stock
  brand: { type: String, default: '' }, // Dodane pole brand
  sku: { type: String, default: '' }, // Dodane pole sku
  weight: { type: Number, default: 0 }, // Dodane pole weight
  dimensions: { type: String, default: '' }, // Dodane pole dimensions
  tags: [{ type: String }], // Dodane pole tags
  images: [{ type: String }], // URL do zdjęć
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
