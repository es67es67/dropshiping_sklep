const MarketplaceProduct = require('../models/marketplaceProductModel');
const User = require('../models/userModel');
const Offer = require('../models/offerModel');

// Pobieranie wszystkich produktów giełdy z filtrowaniem
exports.getMarketplaceProducts = async (req, res) => {
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
      location,
      condition,
      saleType
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Buduj query
    let query = { isActive: true, isAvailable: true };
    
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
    
    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }
    
    if (condition) {
      query.condition = condition;
    }
    
    if (saleType) {
      query.saleType = saleType;
    }
    
    // Sortowanie
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const products = await MarketplaceProduct.find(query)
      .populate('seller', 'username firstName lastName avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await MarketplaceProduct.countDocuments(query);
    
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
    console.error('❌ Błąd podczas pobierania produktów giełdy:', err);
    res.status(500).json({ error: err.message });
  }
};

// UWAGA: Ten endpoint obsługuje TYLKO produkty giełdowe (kolekcja 'marketplaceproducts').
// Nie obsługuje produktów sklepów!
exports.getMarketplaceProduct = async (req, res) => {
  try {
    console.log('🔍 Pobieranie produktu giełdy o ID:', req.params.id);
    
    const product = await MarketplaceProduct.findById(req.params.id)
      .populate('seller', 'username firstName lastName avatar');
    
    console.log('📦 Produkt giełdy znaleziony:', !!product);
    
    if (!product) {
      console.log('❌ Produkt giełdy nie został znaleziony');
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Zwiększ licznik wyświetleń
    await product.addView();
    
    console.log('✅ Produkt giełdy zwrócony pomyślnie');
    res.json(product);
  } catch (err) {
    console.error('❌ Błąd w getMarketplaceProduct:', err);
    res.status(500).json({ error: err.message });
  }
};

// Tworzenie nowego produktu giełdy
exports.createMarketplaceProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      condition,
      saleType,
      location,
      tags,
      images
    } = req.body;
    
    // Walidacja wymaganych pól
    if (!name || !price || !category) {
      return res.status(400).json({ 
        error: 'Nazwa, cena i kategoria są wymagane' 
      });
    }
    
    if (parseFloat(price) <= 0) {
      return res.status(400).json({ 
        error: 'Cena musi być większa od 0' 
      });
    }
    
    // Sprawdź czy użytkownik ma ustawioną lokalizację
    if (!location || !location.city) {
      return res.status(400).json({ 
        error: 'Lokalizacja produktu jest wymagana' 
      });
    }
    
    const product = new MarketplaceProduct({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      condition: condition || 'new',
      saleType: saleType || 'fixed_price',
      location: {
        voivodeship: location.voivodeship || '',
        county: location.county || '',
        municipality: location.municipality || '',
        city: location.city,
        terytCode: location.terytCode || ''
      },
      tags: tags || [],
      images: images || [],
      mainImage: images && images.length > 0 ? images[0] : null,
      seller: req.userId
    });
    
    await product.save();
    
    console.log('✅ Produkt giełdy został utworzony:', product._id);
    
    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Błąd podczas tworzenia produktu giełdy:', err);
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja produktu giełdy
exports.updateMarketplaceProduct = async (req, res) => {
  try {
    const product = await MarketplaceProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest właścicielem produktu
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do edycji tego produktu' });
    }
    
    const updatedProduct = await MarketplaceProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie produktu giełdy
exports.deleteMarketplaceProduct = async (req, res) => {
  try {
    const product = await MarketplaceProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    // Sprawdź czy użytkownik jest właścicielem produktu
    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do usunięcia tego produktu' });
    }
    
    await MarketplaceProduct.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Produkt został usunięty' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wyszukiwanie produktów giełdy
exports.searchMarketplaceProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort = 'relevance' } = req.query;
    
    let query = { isActive: true, isAvailable: true };
    
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
    
    const products = await MarketplaceProduct.find(query)
      .populate('seller', 'username firstName lastName avatar')
      .sort(sortOptions)
      .limit(20);
    
    res.json({ products, query: q });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie produktów giełdy z kategorii
exports.getMarketplaceProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, sort = 'createdAt' } = req.query;
    
    const skip = (page - 1) * limit;
    
    const products = await MarketplaceProduct.find({ 
      category, 
      isActive: true,
      isAvailable: true
    })
      .populate('seller', 'username firstName lastName avatar')
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await MarketplaceProduct.countDocuments({ 
      category, 
      isActive: true,
      isAvailable: true
    });
    
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

// Pobieranie produktów giełdy sprzedawcy
exports.getMarketplaceProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const skip = (page - 1) * limit;
    
    const products = await MarketplaceProduct.find({ 
      seller: sellerId,
      isActive: true 
    })
      .populate('seller', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await MarketplaceProduct.countDocuments({ 
      seller: sellerId,
      isActive: true 
    });
    
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

// Dodawanie oceny do produktu giełdy
exports.addMarketplaceProductRating = async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Ocena musi być między 1 a 5' });
    }
    
    const product = await MarketplaceProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    await product.addRating(rating);
    
    res.json({ message: 'Ocena została dodana', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie produktu do ulubionych
exports.addToFavorites = async (req, res) => {
  try {
    const product = await MarketplaceProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    await product.addToFavorites();
    
    res.json({ message: 'Produkt dodany do ulubionych' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie produktu z ulubionych
exports.removeFromFavorites = async (req, res) => {
  try {
    const product = await MarketplaceProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    await product.removeFromFavorites();
    
    res.json({ message: 'Produkt usunięty z ulubionych' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

// Pobieranie ulubionych produktów użytkownika
exports.getUserFavorites = async (req, res) => {
  try {
    const Wishlist = require('../models/wishlistModel');
    
    const wishlistItems = await Wishlist.find({ 
      user: req.user.id,
      productType: 'marketplace',
      isActive: true
    })
    .populate({
      path: 'productId',
      select: 'name price mainImage images category brand isActive stock',
      match: { isActive: true }
    })
    .sort({ addedAt: -1 });
    
    // Filtruj tylko produkty, które istnieją
    const validItems = wishlistItems.filter(item => item.productId);
    
    res.json({ 
      favorites: validItems,
      count: validItems.length
    });
  } catch (error) {
    console.error('❌ Błąd podczas pobierania ulubionych produktów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania ulubionych produktów' });
  }
}; 

// ===== FUNKCJE DLA OFERT (PROPOZYCJI) =====

// Pobieranie ofert dla produktu
exports.getProductOffers = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await MarketplaceProduct.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    const offers = await Offer.getProductOffers(id);
    
    res.json(offers);
  } catch (error) {
    console.error('❌ Błąd podczas pobierania ofert:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania ofert' });
  }
};

// Składanie oferty
exports.submitOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, message } = req.body;
    const buyerId = req.user.id;
    
    // Sprawdź czy produkt istnieje i jest typu negotiation
    const product = await MarketplaceProduct.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    if (product.saleType !== 'negotiation') {
      return res.status(400).json({ error: 'Ten produkt nie akceptuje ofert' });
    }
    
    if (!product.isActive) {
      return res.status(400).json({ error: 'Produkt nie jest aktywny' });
    }
    
    // Sprawdź czy użytkownik nie jest sprzedawcą
    if (product.seller.toString() === buyerId) {
      return res.status(400).json({ error: 'Nie możesz składać ofert na własny produkt' });
    }
    
    // Sprawdź czy użytkownik już złożył ofertę
    const existingOffer = await Offer.findOne({
      productId: id,
      buyerId: buyerId,
      status: 'pending'
    });
    
    if (existingOffer) {
      return res.status(400).json({ error: 'Masz już aktywną ofertę dla tego produktu' });
    }
    
    // Sprawdź czy kwota jest rozsądna
    if (amount <= 0) {
      return res.status(400).json({ error: 'Kwota musi być większa od 0' });
    }
    
    // Utwórz nową ofertę
    const offer = new Offer({
      productId: id,
      buyerId: buyerId,
      amount: amount,
      message: message || ''
    });
    
    await offer.save();
    
    res.status(201).json({
      message: 'Oferta została złożona',
      offer: {
        _id: offer._id,
        amount: offer.amount,
        status: offer.status,
        timestamp: offer.timestamp
      }
    });
  } catch (error) {
    console.error('❌ Błąd podczas składania oferty:', error);
    res.status(500).json({ error: 'Błąd podczas składania oferty' });
  }
};

// Akceptowanie oferty (tylko sprzedawca)
exports.acceptOffer = async (req, res) => {
  try {
    const { id, offerId } = req.params;
    const sellerId = req.user.id;
    
    // Sprawdź czy produkt istnieje i należy do sprzedawcy
    const product = await MarketplaceProduct.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do akceptowania ofert' });
    }
    
    // Znajdź ofertę
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ error: 'Oferta nie została znaleziona' });
    }
    
    if (offer.productId.toString() !== id) {
      return res.status(400).json({ error: 'Oferta nie należy do tego produktu' });
    }
    
    if (offer.status !== 'pending') {
      return res.status(400).json({ error: 'Oferta nie może być już zmieniona' });
    }
    
    // Akceptuj ofertę
    offer.status = 'accepted';
    await offer.save();
    
    // Odrzuć wszystkie inne oferty dla tego produktu
    await Offer.updateMany(
      { 
        productId: id, 
        status: 'pending',
        _id: { $ne: offerId }
      },
      { status: 'rejected' }
    );
    
    // Oznacz produkt jako sprzedany
    product.isActive = false;
    product.soldTo = offer.buyerId;
    product.soldAt = new Date();
    product.soldPrice = offer.amount;
    await product.save();
    
    res.json({
      message: 'Oferta została zaakceptowana',
      offer: {
        _id: offer._id,
        amount: offer.amount,
        status: offer.status
      }
    });
  } catch (error) {
    console.error('❌ Błąd podczas akceptowania oferty:', error);
    res.status(500).json({ error: 'Błąd podczas akceptowania oferty' });
  }
};

// Odrzucanie oferty (tylko sprzedawca)
exports.rejectOffer = async (req, res) => {
  try {
    const { id, offerId } = req.params;
    const sellerId = req.user.id;
    
    // Sprawdź czy produkt istnieje i należy do sprzedawcy
    const product = await MarketplaceProduct.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }
    
    if (product.seller.toString() !== sellerId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do odrzucania ofert' });
    }
    
    // Znajdź ofertę
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ error: 'Oferta nie została znaleziona' });
    }
    
    if (offer.productId.toString() !== id) {
      return res.status(400).json({ error: 'Oferta nie należy do tego produktu' });
    }
    
    if (offer.status !== 'pending') {
      return res.status(400).json({ error: 'Oferta nie może być już zmieniona' });
    }
    
    // Odrzuć ofertę
    offer.status = 'rejected';
    await offer.save();
    
    res.json({
      message: 'Oferta została odrzucona',
      offer: {
        _id: offer._id,
        status: offer.status
      }
    });
  } catch (error) {
    console.error('❌ Błąd podczas odrzucania oferty:', error);
    res.status(500).json({ error: 'Błąd podczas odrzucania oferty' });
  }
}; 