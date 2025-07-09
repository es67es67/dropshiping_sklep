const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  location: { type: String, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  images: [{ type: String }], // URL do zdjęć
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
