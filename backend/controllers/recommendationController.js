const recommendationService = require('../services/recommendationService');
const authMiddleware = require('../middleware/authMiddleware');

// Pobieranie rekomendacji dla użytkownika
exports.getUserRecommendations = async (req, res) => {
  try {
    const { type = 'personalized', limit = 10, variant } = req.query;
    const userId = req.userId;

    let recommendations;
    
    if (variant && ['A', 'B', 'C'].includes(variant)) {
      // A/B Testing
      recommendations = await recommendationService.getABTestRecommendations(
        userId, 
        variant, 
        parseInt(limit)
      );
    } else {
      // Standardowe rekomendacje
      recommendations = await recommendationService.getRecommendations(
        userId, 
        type, 
        parseInt(limit)
      );
    }

    res.json({
      success: true,
      recommendations,
      type,
      variant: variant || 'standard',
      count: recommendations.length
    });
  } catch (error) {
    console.error('Błąd pobierania rekomendacji:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd pobierania rekomendacji' 
    });
  }
};

// Pobieranie rekomendacji dla produktu
exports.getProductRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 8 } = req.query;
    const userId = req.userId;

    // Pobierz podobne produkty
    const recommendations = await recommendationService.getRecommendations(
      userId, 
      'similar', 
      parseInt(limit)
    );

    res.json({
      success: true,
      recommendations,
      productId,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Błąd pobierania rekomendacji produktu:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd pobierania rekomendacji produktu' 
    });
  }
};

// Pobieranie popularnych produktów
exports.getPopularProducts = async (req, res) => {
  try {
    const { limit = 12, category } = req.query;

    let recommendations = await recommendationService.getPopularProducts(parseInt(limit));

    // Filtruj według kategorii jeśli podano
    if (category) {
      recommendations = recommendations.filter(product => 
        product.category === category
      );
    }

    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Błąd pobierania popularnych produktów:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd pobierania popularnych produktów' 
    });
  }
};

// Pobieranie trendujących produktów
exports.getTrendingProducts = async (req, res) => {
  try {
    const { limit = 12 } = req.query;

    const recommendations = await recommendationService.getTrendingProducts(parseInt(limit));

    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Błąd pobierania trendujących produktów:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd pobierania trendujących produktów' 
    });
  }
};

// Śledzenie kliknięcia rekomendacji
exports.trackRecommendationClick = async (req, res) => {
  try {
    const { productId, recommendationType } = req.body;
    const userId = req.userId;

    await recommendationService.trackRecommendationClick(
      userId, 
      productId, 
      recommendationType
    );

    res.json({
      success: true,
      message: 'Kliknięcie rekomendacji zostało zarejestrowane'
    });
  } catch (error) {
    console.error('Błąd śledzenia kliknięcia:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd śledzenia kliknięcia' 
    });
  }
};

// Śledzenie zakupu z rekomendacji
exports.trackRecommendationPurchase = async (req, res) => {
  try {
    const { productId, recommendationType } = req.body;
    const userId = req.userId;

    await recommendationService.trackRecommendationPurchase(
      userId, 
      productId, 
      recommendationType
    );

    res.json({
      success: true,
      message: 'Zakup z rekomendacji został zarejestrowany'
    });
  } catch (error) {
    console.error('Błąd śledzenia zakupu:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd śledzenia zakupu' 
    });
  }
};

// Pobieranie statystyk rekomendacji (dla adminów)
exports.getRecommendationStats = async (req, res) => {
  try {
    // Sprawdź czy użytkownik jest adminem
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Brak uprawnień' 
      });
    }

    // W rzeczywistej implementacji pobierałoby statystyki z bazy danych
    const stats = {
      totalRecommendations: 0,
      totalClicks: 0,
      totalPurchases: 0,
      conversionRate: 0,
      topRecommendationTypes: [],
      recentActivity: []
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Błąd pobierania statystyk:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd pobierania statystyk' 
    });
  }
};

// Czyszczenie cache rekomendacji (dla adminów)
exports.clearRecommendationCache = async (req, res) => {
  try {
    // Sprawdź czy użytkownik jest adminem
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Brak uprawnień' 
      });
    }

    recommendationService.clearCache();

    res.json({
      success: true,
      message: 'Cache rekomendacji został wyczyszczony'
    });
  } catch (error) {
    console.error('Błąd czyszczenia cache:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Błąd czyszczenia cache' 
    });
  }
}; 