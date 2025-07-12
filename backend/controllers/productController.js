const Product = require('../models/productModel');
const Shop = require('../models/shopModel'); // Dodane import dla Shop
const Location = require('../models/locationModel'); // Dodane import dla Location

exports.createProduct = async (req, res) => {
  try {
    const { 
      name, 
      price, 
      description, 
      category, 
      location, 
      shopId,
      stock,
      brand,
      sku,
      weight,
      dimensions,
      tags
    } = req.body;
    
    // Sprawdź czy użytkownik podał shopId
    if (!shopId) {
      return res.status(400).json({ error: 'ID sklepu jest wymagane' });
    }
    
    // Sprawdź czy sklep istnieje i czy użytkownik jest jego właścicielem
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do dodawania produktów do tego sklepu' });
    }
    
    // W praktyce: images to URL po uploadzie zdjęć na serwer
    const images = req.files?.map(file => file.path) || [];
    
    // Użyj lokalizacji sklepu jeśli nie podano lokalizacji produktu
    let productLocation = location;
    if (!productLocation) {
      if (shop.location) {
        // Jeśli sklep ma przypisaną lokalizację, użyj jej nazwy
        const locationDoc = await Location.findById(shop.location);
        productLocation = locationDoc ? locationDoc.name : 'Nie określono';
      } else {
        productLocation = 'Nie określono';
      }
    }
    
    const product = new Product({ 
      name, 
      price, 
      description, 
      category, 
      location: productLocation,
      shop: shopId,
      stock: stock || 0,
      brand: brand || '',
      sku: sku || '',
      weight: weight || 0,
      dimensions: dimensions || '',
      tags: tags || [],
      images 
    });
    await product.save();
    
    // Aktualizuj statystyki sklepu
    shop.stats.totalProducts++;
    await shop.save();
    
    res.status(201).json(product);
  } catch (err) {
    console.error('Błąd podczas tworzenia produktu:', err);
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
    // Pobierz sklepy użytkownika
    const userShops = await Shop.find({ owner: req.userId }).select('_id');
    const shopIds = userShops.map(shop => shop._id);
    
    // Pobierz produkty z tych sklepów
    const products = await Product.find({ shop: { $in: shopIds } })
      .populate('shop', 'name location')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Błąd podczas pobierania produktów użytkownika:', err);
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

// Aktualizacja produktu (tylko właściciel sklepu)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await Product.findById(id).populate('shop');
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest właścicielem sklepu
    if (product.shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do edycji tego produktu' });
    }
    
    // Aktualizuj produkt
    Object.keys(updateData).forEach(key => {
      if (key !== 'shop' && key !== '_id') {
        product[key] = updateData[key];
      }
    });
    
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Błąd podczas aktualizacji produktu:', err);
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie produktu (tylko właściciel sklepu)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id).populate('shop');
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest właścicielem sklepu
    if (product.shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do usunięcia tego produktu' });
    }
    
    // Aktualizuj statystyki sklepu
    const shop = await Shop.findById(product.shop._id);
    if (shop) {
      shop.stats.totalProducts = Math.max(0, shop.stats.totalProducts - 1);
      await shop.save();
    }
    
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Produkt został usunięty' });
  } catch (err) {
    console.error('Błąd podczas usuwania produktu:', err);
    res.status(500).json({ error: err.message });
  }
};
