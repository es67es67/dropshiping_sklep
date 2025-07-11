const Product = require('../models/productModel');
const Shop = require('../models/shopModel'); // Dodane import dla Shop

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, location, shop } = req.body;
    // W praktyce: images to URL po uploadzie zdjęć na serwer
    const images = req.files?.map(file => file.path) || [];
    const product = new Product({ 
      name, 
      price, 
      description, 
      category, 
      location, 
      shop: shop || req.userId, 
      images 
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProducts = async (req, res) => {
  try {
    const products = await Product.find({ shop: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShopProducts = async (req, res) => {
  try {
    const { shopId } = req.params;
    const products = await Product.find({ shop: shopId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie produktów lokalnych
exports.getLocalProducts = async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Lokalizacja jest wymagana' });
    }

    // Znajdź sklepy w danej lokalizacji
    const shops = await Shop.find({
      'location.name': { $regex: location, $options: 'i' }
    }).select('_id');

    const shopIds = shops.map(shop => shop._id);

    // Pobierz produkty z tych sklepów
    const products = await Product.find({
      shop: { $in: shopIds }
    })
    .populate('shop', 'name location address')
    .populate('shop.location', 'name')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json(products);
  } catch (err) {
    console.error('Błąd podczas pobierania produktów lokalnych:', err);
    res.status(500).json({ error: err.message });
  }
};
