const express = require('express');
const router = express.Router();
const marketplaceProductController = require('../controllers/marketplaceProductController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 🟡 MARKETPLACE API ROUTES: /api/marketplace
// Zależności: MongoDB marketplaceproducts collection, auth middleware
// Wpływ: Giełda produktów użytkowników (bez sklepów)
// Używane w: AddProduct, MarketplaceProducts, UserProducts, etc.

// Publiczne trasy (bez parametrów)
router.get('/', marketplaceProductController.getMarketplaceProducts);
router.get('/search', marketplaceProductController.searchMarketplaceProducts);

// Endpoint do naprawy saleType
router.post('/fix-sale-type', async (req, res) => {
  try {
    const MarketplaceProduct = require('../models/marketplaceProductModel');
    
    console.log('🔧 Naprawianie saleType dla produktów...');
    
    // Znajdź produkty z niepoprawnym saleType
    const productsWithWrongSaleType = await MarketplaceProduct.find({
      $or: [
        { saleType: { $exists: false } },
        { saleType: null },
        { saleType: 'fixed' }  // Niepoprawna wartość
      ]
    });
    
    console.log(`📦 Znaleziono ${productsWithWrongSaleType.length} produktów do naprawy`);
    
    if (productsWithWrongSaleType.length > 0) {
      // Zaktualizuj wszystkie produkty z niepoprawnym saleType
      const result = await MarketplaceProduct.updateMany(
        {
          $or: [
            { saleType: { $exists: false } },
            { saleType: null },
            { saleType: 'fixed' }
          ]
        },
        {
          $set: { saleType: 'fixed_price' }
        }
      );
      
      console.log(`✅ Zaktualizowano ${result.modifiedCount} produktów`);
    }
    
    // Sprawdź wszystkie typy sprzedaży
    const saleTypes = await MarketplaceProduct.aggregate([
      {
        $group: {
          _id: '$saleType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Statystyki typów sprzedaży:');
    saleTypes.forEach(type => {
      console.log(`  ${type._id || 'brak'}: ${type.count} produktów`);
    });
    
    res.json({ 
      success: true, 
      updated: result?.modifiedCount || 0,
      saleTypes 
    });
    
  } catch (error) {
    console.error('❌ Błąd:', error);
    res.status(500).json({ error: 'Błąd podczas naprawy saleType' });
  }
});

// Publiczne trasy (z parametrami)
router.get('/:id', marketplaceProductController.getMarketplaceProduct);

// Powiązane produkty
router.get('/:id/related', async (req, res) => {
  try {
    const MarketplaceProduct = require('../models/marketplaceProductModel');
    const product = await MarketplaceProduct.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie znaleziony' });
    }
    
    // Znajdź podobne produkty (ta sama kategoria, ale nie ten sam produkt)
    const relatedProducts = await MarketplaceProduct.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
    .limit(4)
    .select('name price mainImage images');
    
    res.json({ products: relatedProducts });
  } catch (error) {
    console.error('Błąd podczas pobierania powiązanych produktów:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania powiązanych produktów' });
  }
});

// Recenzje produktu
router.get('/:id/reviews', async (req, res) => {
  try {
    const Review = require('../models/reviewModel');
    const reviews = await Review.find({ 
      productId: req.params.id,
      productType: 'marketplace'
    })
    .populate('user', 'username')
    .sort({ createdAt: -1 });
    
    res.json({ reviews });
  } catch (error) {
    console.error('Błąd podczas pobierania recenzji:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania recenzji' });
  }
});

// Dodaj recenzję
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const Review = require('../models/reviewModel');
    const { rating, comment } = req.body;
    
    // Sprawdź czy użytkownik już dodał recenzję
    const existingReview = await Review.findOne({
      productId: req.params.id,
      user: req.user.id,
      productType: 'marketplace'
    });
    
    if (existingReview) {
      return res.status(400).json({ error: 'Już dodałeś recenzję dla tego produktu' });
    }
    
    const review = new Review({
      productId: req.params.id,
      user: req.user.id,
      productType: 'marketplace',
      rating,
      comment
    });
    
    await review.save();
    
    res.json({ success: true, review });
  } catch (error) {
    console.error('Błąd podczas dodawania recenzji:', error);
    res.status(500).json({ error: 'Błąd podczas dodawania recenzji' });
  }
});

// Wishlist - sprawdź status
router.get('/:id/wishlist', authenticateToken, async (req, res) => {
  try {
    const Wishlist = require('../models/wishlistModel');
    const wishlistItem = await Wishlist.findOne({
      productId: req.params.id,
      user: req.user.id,
      productType: 'marketplace'
    });
    
    res.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error('Błąd podczas sprawdzania wishlist:', error);
    res.status(500).json({ error: 'Błąd podczas sprawdzania wishlist' });
  }
});

// Wishlist - dodaj
router.post('/:id/wishlist', authenticateToken, async (req, res) => {
  try {
    const Wishlist = require('../models/wishlistModel');
    
    // Sprawdź czy już jest w wishlist
    const existingItem = await Wishlist.findOne({
      productId: req.params.id,
      user: req.user.id,
      productType: 'marketplace'
    });
    
    if (existingItem) {
      return res.status(400).json({ error: 'Produkt już jest w ulubionych' });
    }
    
    const wishlistItem = new Wishlist({
      productId: req.params.id,
      user: req.user.id,
      productType: 'marketplace'
    });
    
    await wishlistItem.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas dodawania do wishlist:', error);
    res.status(500).json({ error: 'Błąd podczas dodawania do wishlist' });
  }
});

// Wishlist - usuń
router.delete('/:id/wishlist', authenticateToken, async (req, res) => {
  try {
    const Wishlist = require('../models/wishlistModel');
    
    const result = await Wishlist.deleteOne({
      productId: req.params.id,
      user: req.user.id,
      productType: 'marketplace'
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Produkt nie był w ulubionych' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas usuwania z wishlist:', error);
    res.status(500).json({ error: 'Błąd podczas usuwania z wishlist' });
  }
});

// Prywatne trasy (wymagają autoryzacji)
router.post('/', authenticateToken, marketplaceProductController.createMarketplaceProduct);
router.put('/:id', authenticateToken, marketplaceProductController.updateMarketplaceProduct);
router.delete('/:id', authenticateToken, marketplaceProductController.deleteMarketplaceProduct);

// Ulubione produkty
router.get('/user/favorites', authenticateToken, marketplaceProductController.getUserFavorites);

// ===== TRASY DLA OFERT (PROPOZYCJI) =====
router.get('/:id/offers', marketplaceProductController.getProductOffers);
router.post('/:id/offer', authenticateToken, marketplaceProductController.submitOffer);
router.post('/:id/offer/:offerId/accept', authenticateToken, marketplaceProductController.acceptOffer);
router.post('/:id/offer/:offerId/reject', authenticateToken, marketplaceProductController.rejectOffer);
router.post('/:id/favorites', authenticateToken, marketplaceProductController.addToFavorites);
router.delete('/:id/favorites', authenticateToken, marketplaceProductController.removeFromFavorites);

// Złóż ofertę na aukcję
router.post('/:id/bid', authenticateToken, async (req, res) => {
  try {
    const MarketplaceProduct = require('../models/marketplaceProductModel');
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;
    
    const product = await MarketplaceProduct.findById(id).populate('seller', 'username');
    if (!product) {
      return res.status(404).json({ message: 'Produkt nie został znaleziony' });
    }
    
    if (product.saleType !== 'auction') {
      return res.status(400).json({ message: 'Produkt nie jest wystawiony na aukcję' });
    }
    
    if (!product.auction.isActive) {
      return res.status(400).json({ message: 'Aukcja nie jest aktywna' });
    }
    
    if (new Date() > new Date(product.auction.endTime)) {
      return res.status(400).json({ message: 'Aukcja już się zakończyła' });
    }
    
    if (amount <= product.auction.currentPrice) {
      return res.status(400).json({ message: 'Oferta musi być wyższa niż aktualna cena' });
    }
    
    // Dodaj ofertę
    await product.addBid(userId, amount);
    
    res.json({ 
      message: 'Oferta została złożona',
      newPrice: amount,
      bidCount: product.auction.bids.length
    });
  } catch (error) {
    console.error('Błąd podczas składania oferty:', error);
    res.status(500).json({ message: error.message || 'Błąd serwera' });
  }
});

module.exports = router; 