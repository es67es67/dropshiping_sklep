const Product = require('../models/productModel');
const User = require('../models/userModel');
const UniversalErrorService = require('../services/universalErrorService');

// Złóż ofertę w aukcji
exports.placeBid = async (req, res) => {
  try {
    const { productId } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    // Sprawdź czy produkt istnieje i jest aukcją
    const product = await Product.findById(productId).populate('seller', 'username');
    
    if (!product) {
      await UniversalErrorService.logError(new Error('Produkt nie został znaleziony'), {
        componentName: 'auctionController',
        filename: 'auctionController.js',
        type: 'not_found',
        additionalData: { productId, action: 'placeBid' }
      });
      
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }

    if (product.saleType !== 'auction') {
      await UniversalErrorService.logError(new Error('Produkt nie jest aukcją'), {
        componentName: 'auctionController',
        filename: 'auctionController.js',
        type: 'validation_error',
        additionalData: { productId, saleType: product.saleType, action: 'placeBid' }
      });
      
      return res.status(400).json({ error: 'Ten produkt nie jest aukcją' });
    }

    // Sprawdź czy aukcja jest aktywna
    if (!product.auction.isActive) {
      return res.status(400).json({ error: 'Aukcja nie jest aktywna' });
    }

    // Sprawdź czy aukcja się nie skończyła
    const now = new Date();
    if (product.auction.endTime && now > product.auction.endTime) {
      return res.status(400).json({ error: 'Aukcja już się zakończyła' });
    }

    // Sprawdź czy użytkownik nie licytuje własnego produktu
    if (product.seller._id.toString() === userId) {
      return res.status(400).json({ error: 'Nie możesz licytować własnego produktu' });
    }

    // Sprawdź minimalną ofertę (dla ofert za darmo nie ma ograniczeń)
    if (amount > 0) {
      const currentPrice = product.auction.currentPrice || product.auction.startPrice;
      const minBid = currentPrice + (product.auction.minIncrement || 1);

      if (amount < minBid) {
        return res.status(400).json({ 
          error: `Minimalna oferta to ${minBid.toFixed(2)} zł`,
          minBid: minBid
        });
      }
    }

    // Dodaj ofertę
    const newBid = {
      bidder: userId,
      amount: amount,
      timestamp: new Date()
    };

    product.auction.bids.push(newBid);
    product.auction.currentPrice = amount;

    await product.save();

    // Pobierz zaktualizowany produkt z ofertami
    const updatedProduct = await Product.findById(productId)
      .populate('seller', 'username')
      .populate('auction.bids.bidder', 'username');

    await UniversalErrorService.logError(new Error('Oferta została złożona pomyślnie'), {
      componentName: 'auctionController',
      filename: 'auctionController.js',
      type: 'success',
      additionalData: { 
        productId, 
        amount, 
        userId, 
        action: 'placeBid',
        newCurrentPrice: amount
      }
    });

    res.json({
      message: 'Oferta została złożona pomyślnie',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Błąd podczas składania oferty:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'auctionController',
      filename: 'auctionController.js',
      type: 'api_error',
      additionalData: {
        action: 'placeBid',
        productId: req.params.productId,
        amount: req.body.amount
      }
    });

    res.status(500).json({ 
      error: 'Wystąpił błąd podczas składania oferty',
      details: error.message 
    });
  }
};

// Pobierz historię ofert dla produktu
exports.getBidHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('auction.bids.bidder', 'username')
      .select('auction.bids');

    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }

    if (product.saleType !== 'auction') {
      return res.status(400).json({ error: 'Ten produkt nie jest aukcją' });
    }

    res.json({
      bids: product.auction.bids || []
    });

  } catch (error) {
    console.error('Błąd podczas pobierania historii ofert:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'auctionController',
      filename: 'auctionController.js',
      type: 'api_error',
      additionalData: {
        action: 'getBidHistory',
        productId: req.params.productId
      }
    });

    res.status(500).json({ 
      error: 'Wystąpił błąd podczas pobierania historii ofert',
      details: error.message 
    });
  }
};

// Pobierz aktywne aukcje
exports.getActiveAuctions = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, location } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      saleType: 'auction',
      'auction.isActive': true,
      isActive: true
    };

    // Filtry
    if (category) {
      query.category = category;
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    // Filtr dla aukcji z ofertami za darmo
    if (req.query.hasFreeBids === 'true') {
      query['auction.bids'] = { 
        $elemMatch: { amount: 0 } 
      };
    }

    // Sprawdź czy aukcje się nie skończyły
    const now = new Date();
    query['auction.endTime'] = { $gt: now };

    const auctions = await Product.find(query)
      .populate('seller', 'username')
      .populate('shop', 'name')
      .sort({ 'auction.endTime': 1 }) // Sortuj po czasie końca (najpierw te, które się kończą)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      auctions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Błąd podczas pobierania aktywnych aukcji:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'auctionController',
      filename: 'auctionController.js',
      type: 'api_error',
      additionalData: {
        action: 'getActiveAuctions',
        query: req.query
      }
    });

    res.status(500).json({ 
      error: 'Wystąpił błąd podczas pobierania aukcji',
      details: error.message 
    });
  }
};

// Zakończ aukcję (tylko dla sprzedawcy)
exports.endAuction = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }

    if (product.saleType !== 'auction') {
      return res.status(400).json({ error: 'Ten produkt nie jest aukcją' });
    }

    // Sprawdź czy użytkownik jest sprzedawcą
    if (product.seller.toString() !== userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do zakończenia tej aukcji' });
    }

    // Zakończ aukcję
    product.auction.isActive = false;
    product.auction.endTime = new Date();

    await product.save();

    res.json({
      message: 'Aukcja została zakończona',
      product
    });

  } catch (error) {
    console.error('Błąd podczas kończenia aukcji:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'auctionController',
      filename: 'auctionController.js',
      type: 'api_error',
      additionalData: {
        action: 'endAuction',
        productId: req.params.productId,
        userId: req.user.id
      }
    });

    res.status(500).json({ 
      error: 'Wystąpił błąd podczas kończenia aukcji',
      details: error.message 
    });
  }
};

// Pobierz zwycięzców aukcji (dla sprzedawcy)
exports.getAuctionWinners = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const product = await Product.findById(productId)
      .populate('auction.bids.bidder', 'username email')
      .populate('seller', 'username');

    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }

    if (product.saleType !== 'auction') {
      return res.status(400).json({ error: 'Ten produkt nie jest aukcją' });
    }

    // Sprawdź czy użytkownik jest sprzedawcą
    if (product.seller._id.toString() !== userId) {
      return res.status(403).json({ error: 'Nie masz uprawnień do przeglądania wyników tej aukcji' });
    }

    // Znajdź zwycięzców (top 3 oferty)
    const sortedBids = product.auction.bids
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    res.json({
      product: {
        name: product.name,
        currentPrice: product.auction.currentPrice,
        endTime: product.auction.endTime,
        isActive: product.auction.isActive
      },
      winners: sortedBids
    });

  } catch (error) {
    console.error('Błąd podczas pobierania zwycięzców aukcji:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'auctionController',
      filename: 'auctionController.js',
      type: 'api_error',
      additionalData: {
        action: 'getAuctionWinners',
        productId: req.params.productId,
        userId: req.user.id
      }
    });

    res.status(500).json({ 
      error: 'Wystąpił błąd podczas pobierania zwycięzców aukcji',
      details: error.message 
    });
  }
}; 