const Product = require('../models/productModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');
const Wishlist = require('../models/wishlistModel');

class RecommendationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minut
  }

  // Główna metoda rekomendacji
  async getRecommendations(userId, type = 'personalized', limit = 10) {
    try {
      const cacheKey = `${userId}_${type}_${limit}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      let recommendations = [];

      switch (type) {
        case 'personalized':
          recommendations = await this.getPersonalizedRecommendations(userId, limit);
          break;
        case 'collaborative':
          recommendations = await this.getCollaborativeRecommendations(userId, limit);
          break;
        case 'content_based':
          recommendations = await this.getContentBasedRecommendations(userId, limit);
          break;
        case 'popular':
          recommendations = await this.getPopularProducts(limit);
          break;
        case 'trending':
          recommendations = await this.getTrendingProducts(limit);
          break;
        case 'similar':
          recommendations = await this.getSimilarProducts(userId, limit);
          break;
        default:
          recommendations = await this.getHybridRecommendations(userId, limit);
      }

      this.setCache(cacheKey, recommendations);
      return recommendations;
    } catch (error) {
      console.error('Błąd systemu rekomendacji:', error);
      return await this.getFallbackRecommendations(limit);
    }
  }

  // Rekomendacje spersonalizowane na podstawie historii
  async getPersonalizedRecommendations(userId, limit) {
    const user = await User.findById(userId);
    if (!user) return await this.getPopularProducts(limit);

    // Historia zakupów
    const purchaseHistory = await Order.find({
      user: userId,
      status: { $in: ['completed', 'delivered'] }
    }).populate('items.product');

    // Historia przeglądania
    const viewHistory = await this.getUserViewHistory(userId);

    // Ulubione kategorie
    const favoriteCategories = await this.getFavoriteCategories(userId);

    // Buduj query
    let query = { isActive: true, isAvailable: true };
    
    if (favoriteCategories.length > 0) {
      query.category = { $in: favoriteCategories };
    }

    // Wyklucz już kupione produkty
    const purchasedProductIds = purchaseHistory
      .flatMap(order => order.items.map(item => item.product._id));
    
    if (purchasedProductIds.length > 0) {
      query._id = { $nin: purchasedProductIds };
    }

    const recommendations = await Product.find(query)
      .populate('shop', 'name logo rating')
      .populate('seller', 'firstName lastName')
      .sort({ 'ratings.average': -1, 'stats.views': -1 })
      .limit(limit);

    return this.addRecommendationScores(recommendations, 'personalized', userId);
  }

  // Rekomendacje collaborative filtering
  async getCollaborativeRecommendations(userId, limit) {
    // Znajdź podobnych użytkowników
    const similarUsers = await this.findSimilarUsers(userId);
    
    if (similarUsers.length === 0) {
      return await this.getPopularProducts(limit);
    }

    // Produkty kupione przez podobnych użytkowników
    const similarUserIds = similarUsers.map(u => u.userId);
    const orders = await Order.find({
      user: { $in: similarUserIds },
      status: { $in: ['completed', 'delivered'] }
    }).populate('items.product');

    // Grupuj produkty według popularności
    const productScores = new Map();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product._id.toString();
        const score = productScores.get(productId) || 0;
        productScores.set(productId, score + 1);
      });
    });

    // Sortuj produkty według popularności
    const sortedProducts = Array.from(productScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId]) => productId);

    const recommendations = await Product.find({
      _id: { $in: sortedProducts },
      isActive: true,
      isAvailable: true
    })
    .populate('shop', 'name logo rating')
    .populate('seller', 'firstName lastName');

    return this.addRecommendationScores(recommendations, 'collaborative', userId);
  }

  // Rekomendacje content-based
  async getContentBasedRecommendations(userId, limit) {
    const user = await User.findById(userId);
    if (!user) return await this.getPopularProducts(limit);

    // Analizuj preferencje użytkownika
    const preferences = await this.analyzeUserPreferences(userId);
    
    if (!preferences.categories.length && !preferences.brands.length) {
      return await this.getPopularProducts(limit);
    }

    // Buduj query na podstawie preferencji
    let query = { isActive: true, isAvailable: true };
    let orConditions = [];

    if (preferences.categories.length > 0) {
      orConditions.push({ category: { $in: preferences.categories } });
    }

    if (preferences.brands.length > 0) {
      orConditions.push({ brand: { $in: preferences.brands } });
    }

    if (preferences.priceRange) {
      query.price = {
        $gte: preferences.priceRange.min,
        $lte: preferences.priceRange.max
      };
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    const recommendations = await Product.find(query)
      .populate('shop', 'name logo rating')
      .populate('seller', 'firstName lastName')
      .sort({ 'ratings.average': -1 })
      .limit(limit);

    return this.addRecommendationScores(recommendations, 'content_based', userId);
  }

  // Popularne produkty
  async getPopularProducts(limit) {
    const recommendations = await Product.find({
      isActive: true,
      isAvailable: true
    })
    .populate('shop', 'name logo rating')
    .populate('seller', 'firstName lastName')
    .sort({ 'stats.views': -1, 'stats.sales': -1, 'ratings.average': -1 })
    .limit(limit);

    return this.addRecommendationScores(recommendations, 'popular');
  }

  // Trendujące produkty
  async getTrendingProducts(limit) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const recommendations = await Product.find({
      isActive: true,
      isAvailable: true,
      createdAt: { $gte: oneWeekAgo }
    })
    .populate('shop', 'name logo rating')
    .populate('seller', 'firstName lastName')
    .sort({ 'stats.views': -1, 'ratings.average': -1 })
    .limit(limit);

    return this.addRecommendationScores(recommendations, 'trending');
  }

  // Podobne produkty
  async getSimilarProducts(userId, limit) {
    const user = await User.findById(userId);
    if (!user) return await this.getPopularProducts(limit);

    // Ostatnio przeglądane produkty
    const recentViews = await this.getUserViewHistory(userId, 5);
    
    if (recentViews.length === 0) {
      return await this.getPopularProducts(limit);
    }

    const lastViewedProduct = recentViews[0];
    const product = await Product.findById(lastViewedProduct.productId);
    
    if (!product) return await this.getPopularProducts(limit);

    // Znajdź podobne produkty
    const similarProducts = await Product.find({
      _id: { $ne: lastViewedProduct.productId },
      category: product.category,
      isActive: true,
      isAvailable: true
    })
    .populate('shop', 'name logo rating')
    .populate('seller', 'firstName lastName')
    .sort({ 'ratings.average': -1 })
    .limit(limit);

    return this.addRecommendationScores(similarProducts, 'similar', userId);
  }

  // Hybrydowe rekomendacje
  async getHybridRecommendations(userId, limit) {
    const [personalized, collaborative, contentBased] = await Promise.all([
      this.getPersonalizedRecommendations(userId, Math.ceil(limit / 3)),
      this.getCollaborativeRecommendations(userId, Math.ceil(limit / 3)),
      this.getContentBasedRecommendations(userId, Math.ceil(limit / 3))
    ]);

    // Połącz i usuń duplikaty
    const allProducts = [...personalized, ...collaborative, ...contentBased];
    const uniqueProducts = this.removeDuplicates(allProducts);
    
    return uniqueProducts.slice(0, limit);
  }

  // Rekomendacje fallback
  async getFallbackRecommendations(limit) {
    return await this.getPopularProducts(limit);
  }

  // Pomocnicze metody
  async findSimilarUsers(userId) {
    const user = await User.findById(userId);
    if (!user) return [];

    // Znajdź użytkowników z podobnymi zakupami
    const userOrders = await Order.find({
      user: userId,
      status: { $in: ['completed', 'delivered'] }
    });

    if (userOrders.length === 0) return [];

    const userProductIds = userOrders.flatMap(order => 
      order.items.map(item => item.product.toString())
    );

    const similarUsers = await Order.aggregate([
      {
        $match: {
          user: { $ne: userId },
          'items.product': { $in: userProductIds },
          status: { $in: ['completed', 'delivered'] }
        }
      },
      {
        $group: {
          _id: '$user',
          commonProducts: { $sum: 1 }
        }
      },
      {
        $sort: { commonProducts: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return similarUsers.map(u => ({ userId: u._id, score: u.commonProducts }));
  }

  async analyzeUserPreferences(userId) {
    const orders = await Order.find({
      user: userId,
      status: { $in: ['completed', 'delivered'] }
    }).populate('items.product');

    const categories = new Map();
    const brands = new Map();
    const prices = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = item.product;
        
        // Kategorie
        if (product.category) {
          categories.set(product.category, (categories.get(product.category) || 0) + 1);
        }

        // Marki
        if (product.brand) {
          brands.set(product.brand, (brands.get(product.brand) || 0) + 1);
        }

        // Ceny
        if (product.price) {
          prices.push(product.price);
        }
      });
    });

    const topCategories = Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category]) => category);

    const topBrands = Array.from(brands.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([brand]) => brand);

    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices) * 0.8,
      max: Math.max(...prices) * 1.2
    } : null;

    return { categories: topCategories, brands: topBrands, priceRange };
  }

  async getFavoriteCategories(userId) {
    const orders = await Order.find({
      user: userId,
      status: { $in: ['completed', 'delivered'] }
    }).populate('items.product');

    const categoryCount = new Map();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category;
        if (category) {
          categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
        }
      });
    });

    return Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
  }

  async getUserViewHistory(userId, limit = 10) {
    // Symulacja historii przeglądania (w rzeczywistej implementacji byłaby tabela views)
    const recentOrders = await Order.find({
      user: userId
    })
    .populate('items.product')
    .sort({ createdAt: -1 })
    .limit(limit);

    return recentOrders.map(order => ({
      productId: order.items[0]?.product._id,
      viewedAt: order.createdAt
    }));
  }

  addRecommendationScores(products, type, userId = null) {
    return products.map(product => {
      const score = this.calculateRecommendationScore(product, type, userId);
      return {
        ...product.toObject(),
        recommendationScore: score,
        recommendationType: type
      };
    });
  }

  calculateRecommendationScore(product, type, userId = null) {
    let score = 0;

    // Podstawowy score na podstawie ocen i popularności
    score += (product.ratings?.average || 0) * 0.3;
    score += Math.min((product.stats?.views || 0) / 1000, 10) * 0.2;
    score += Math.min((product.stats?.sales || 0) / 100, 10) * 0.2;

    // Bonus za typ rekomendacji
    switch (type) {
      case 'personalized':
        score += 0.3;
        break;
      case 'collaborative':
        score += 0.25;
        break;
      case 'content_based':
        score += 0.2;
        break;
      case 'trending':
        score += 0.15;
        break;
      case 'popular':
        score += 0.1;
        break;
    }

    // Bonus za nowe produkty
    const daysSinceCreation = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation < 7) score += 0.1;
    else if (daysSinceCreation < 30) score += 0.05;

    // Bonus za promocje
    if (product.isOnSale) score += 0.1;

    return Math.min(score, 1.0);
  }

  removeDuplicates(products) {
    const seen = new Set();
    return products.filter(product => {
      const duplicate = seen.has(product._id.toString());
      seen.add(product._id.toString());
      return !duplicate;
    });
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // A/B Testing dla rekomendacji
  async getABTestRecommendations(userId, variant = 'A', limit = 10) {
    const testConfig = {
      A: { personalized: 0.4, collaborative: 0.3, content_based: 0.3 },
      B: { personalized: 0.6, collaborative: 0.2, content_based: 0.2 },
      C: { personalized: 0.2, collaborative: 0.4, content_based: 0.4 }
    };

    const config = testConfig[variant] || testConfig.A;
    const recommendations = [];

    for (const [type, weight] of Object.entries(config)) {
      const count = Math.ceil(limit * weight);
      const typeRecommendations = await this.getRecommendations(userId, type, count);
      recommendations.push(...typeRecommendations);
    }

    return this.removeDuplicates(recommendations).slice(0, limit);
  }

  // Analiza skuteczności rekomendacji
  async trackRecommendationClick(userId, productId, recommendationType) {
    // W rzeczywistej implementacji zapisywałoby to do bazy danych
    console.log(`Rekomendacja kliknięta: User ${userId}, Product ${productId}, Type ${recommendationType}`);
  }

  async trackRecommendationPurchase(userId, productId, recommendationType) {
    // W rzeczywistej implementacji zapisywałoby to do bazy danych
    console.log(`Rekomendacja zakupiona: User ${userId}, Product ${productId}, Type ${recommendationType}`);
  }
}

module.exports = new RecommendationService(); 