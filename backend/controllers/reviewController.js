const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// Tworzenie recenzji
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, content, detailedRatings, images } = req.body;

    // Sprawdź czy produkt istnieje
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nie został znaleziony' });
    }

    // Sprawdź czy użytkownik już ocenił ten produkt
    const existingReview = await Review.findOne({ user: req.userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ error: 'Już oceniłeś ten produkt' });
    }

    // Sprawdź czy użytkownik kupił ten produkt (dla weryfikacji)
    const hasPurchased = await Order.findOne({
      user: req.userId,
      'items.product': productId,
      status: { $in: ['delivered', 'completed'] }
    });

    // Utwórz recenzję
    const review = new Review({
      user: req.userId,
      product: productId,
      shop: product.shop,
      rating,
      title,
      content,
      detailedRatings,
      images: images || [],
      verifiedPurchase: !!hasPurchased,
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
      }
    });

    await review.save();

    // Aktualizuj średnią ocenę produktu
    await updateProductRating(productId);

    // Pobierz pełną recenzję z danymi użytkownika
    const fullReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName avatar')
      .populate('shop', 'name logo');

    res.status(201).json({
      message: 'Recenzja została dodana',
      review: fullReview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie recenzji produktu
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest', filter } = req.query;
    const skip = (page - 1) * limit;

    let query = { product: productId, status: 'approved' };
    
    // Filtry
    if (filter === 'verified') {
      query.verifiedPurchase = true;
    } else if (filter === 'with_images') {
      query.images = { $exists: true, $ne: [] };
    } else if (filter && filter.match(/^\d+$/)) {
      query.rating = parseInt(filter);
    }

    // Sortowanie
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1 };
        break;
      case 'most_helpful':
        sortOption = { 'reactions.type': 'helpful' };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName avatar')
      .populate('shop', 'name logo')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    // Statystyki ocen
    const ratingStats = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const averageRating = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          total: { $sum: 1 }
        }
      }
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        ratingDistribution: ratingStats,
        averageRating: averageRating[0]?.average || 0,
        totalReviews: averageRating[0]?.total || 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja recenzji
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, content, detailedRatings, images } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Recenzja nie została znaleziona' });
    }

    // Sprawdź czy użytkownik jest właścicielem recenzji
    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do edycji tej recenzji' });
    }

    // Aktualizuj recenzję
    review.rating = rating;
    review.title = title;
    review.content = content;
    review.detailedRatings = detailedRatings;
    review.images = images || review.images;
    review.status = 'pending'; // Prześlij do ponownej moderacji

    await review.save();

    // Aktualizuj średnią ocenę produktu
    await updateProductRating(review.product);

    res.json({
      message: 'Recenzja została zaktualizowana',
      review
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie recenzji
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Recenzja nie została znaleziona' });
    }

    // Sprawdź uprawnienia
    if (review.user.toString() !== req.userId && !req.userRole?.includes('admin')) {
      return res.status(403).json({ error: 'Brak uprawnień do usunięcia tej recenzji' });
    }

    const productId = review.product;
    await review.remove();

    // Aktualizuj średnią ocenę produktu
    await updateProductRating(productId);

    res.json({ message: 'Recenzja została usunięta' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dodawanie reakcji do recenzji
exports.addReaction = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { type } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Recenzja nie została znaleziona' });
    }

    await review.addReaction(req.userId, type);

    res.json({
      message: 'Reakcja została dodana',
      reactions: review.reactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Usuwanie reakcji
exports.removeReaction = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Recenzja nie została znaleziona' });
    }

    await review.removeReaction(req.userId);

    res.json({
      message: 'Reakcja została usunięta',
      reactions: review.reactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Zgłaszanie recenzji
exports.flagReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Recenzja nie została znaleziona' });
    }

    await review.flag(req.userId, reason);

    res.json({ message: 'Recenzja została zgłoszona' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Odpowiedź sklepu na recenzję
exports.addShopResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Recenzja nie została znaleziona' });
    }

    // Sprawdź czy użytkownik jest właścicielem sklepu
    if (review.shop.toString() !== req.userId && !req.userRole?.includes('admin')) {
      return res.status(403).json({ error: 'Brak uprawnień do odpowiedzi na tę recenzję' });
    }

    await review.addShopResponse(content, req.userId);

    res.json({
      message: 'Odpowiedź została dodana',
      shopResponse: review.shopResponse
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Moderacja recenzji (admin)
exports.moderateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, note } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Recenzja nie została znaleziona' });
    }

    await review.moderate(req.userId, status, note);

    // Jeśli recenzja została zatwierdzona, aktualizuj ocenę produktu
    if (status === 'approved') {
      await updateProductRating(review.product);
    }

    res.json({
      message: 'Recenzja została zmodyerowana',
      review
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie recenzji użytkownika
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: req.userId })
      .populate('product', 'name mainImage price')
      .populate('shop', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: req.userId });

    res.json({
      reviews,
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

// Funkcja pomocnicza do aktualizacji oceny produktu
async function updateProductRating(productId) {
  try {
    const stats = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    if (stats.length > 0) {
      const stat = stats[0];
      const distribution = stat.ratingDistribution.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      await Product.findByIdAndUpdate(productId, {
        rating: {
          average: Math.round(stat.averageRating * 10) / 10,
          total: stat.totalReviews,
          distribution
        }
      });
    }
  } catch (error) {
    console.error('Błąd aktualizacji oceny produktu:', error);
  }
}

module.exports = { updateProductRating };
