const Product = require('../models/productModel');
const Shop = require('../models/shopModel');

// Pobieranie wszystkich produktów z filtrowaniem
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      shop,
      isOnSale,
      isFeatured
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Buduj query
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (shop) {
      query.shop = shop;
    }
    
    if (isOnSale === 'true') {
      query.isOnSale = true;
    }
    
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    
    // Sortowanie
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const products = await Product.find(query)
      .populate('shop', 'name logo')
      .populate('seller', 'username firstName lastName')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie pojedynczego produktu
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shop', 'name logo description address')
      .populate('seller', 'username firstName lastName avatar')
      .populate('relatedProducts', 'name price mainImage ratings');
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Zwiększ licznik wyświetleń
    product.stats.views += 1;
    await product.save();
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tworzenie nowego produktu
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      sku,
      stock,
      images,
      attributes,
      variants,
      tags
    } = req.body;
    
    // Sprawdź czy użytkownik ma sklep
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ error: 'Musisz mieć sklep, aby dodawać produkty' });
    }
    
    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      sku,
      stock: parseInt(stock) || 0,
      images: images || [],
      mainImage: images && images.length > 0 ? images[0] : null,
      attributes: attributes || [],
      variants: variants || [],
      tags: tags || [],
      shop: shop._id,
      seller: req.userId
    });
    
    await product.save();
    
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja produktu
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest właścicielem produktu
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do edycji tego produktu' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie produktu
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest właścicielem produktu
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do usunięcia tego produktu' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Produkt został usunięty' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie oceny do produktu
exports.addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Ocena musi być między 1 a 5' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    await product.addRating(rating);
    
    res.json({ message: 'Ocena została dodana', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wyszukiwanie produktów
exports.searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort = 'relevance' } = req.query;
    
    let query = { isActive: true };
    
    if (q) {
      query.$text = { $search: q };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    let sortOptions = {};
    
    switch (sort) {
      case 'price_asc':
        sortOptions.price = 1;
        break;
      case 'price_desc':
        sortOptions.price = -1;
        break;
      case 'rating':
        sortOptions['ratings.average'] = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'relevance':
      default:
        if (q) {
          sortOptions.score = { $meta: 'textScore' };
        } else {
          sortOptions.createdAt = -1;
        }
    }
    
    const products = await Product.find(query)
      .populate('shop', 'name logo')
      .sort(sortOptions)
      .limit(20);
    
    res.json({ products, query: q });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie produktów z kategorii
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, sort = 'createdAt' } = req.query;
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ 
      category, 
      isActive: true 
    })
      .populate('shop', 'name logo')
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments({ category, isActive: true });
    
    res.json({
      products,
      category,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie produktów ze sklepu
exports.getProductsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { page = 1, limit = 12, category } = req.query;
    
    const skip = (page - 1) * limit;
    
    let query = { shop: shopId, isActive: true };
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query)
      .populate('seller', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
