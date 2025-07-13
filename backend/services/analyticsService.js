const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Review = require('../models/reviewModel');
const Coupon = require('../models/couponModel');

class AnalyticsService {
  // Główne statystyki
  static async getMainStats(period = 'month') {
    const startDate = this.getStartDate(period);
    
    const [
      userStats,
      orderStats,
      revenueStats,
      productStats
    ] = await Promise.all([
      this.getUserStats(startDate),
      this.getOrderStats(startDate),
      this.getRevenueStats(startDate),
      this.getProductStats(startDate)
    ]);
    
    return {
      users: userStats,
      orders: orderStats,
      revenue: revenueStats,
      products: productStats,
      period
    };
  }
  
  // Statystyki użytkowników
  static async getUserStats(startDate) {
    const stats = await User.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          newUsers: [
            { $match: { createdAt: { $gte: startDate } } },
            { $count: 'count' }
          ],
          activeUsers: [
            { $match: { isActive: true } },
            { $count: 'count' }
          ],
          userGrowth: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);
    
    return {
      total: stats[0].total[0]?.count || 0,
      newUsers: stats[0].newUsers[0]?.count || 0,
      activeUsers: stats[0].activeUsers[0]?.count || 0,
      growth: stats[0].userGrowth
    };
  }
  
  // Statystyki zamówień
  static async getOrderStats(startDate) {
    const stats = await Order.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          recent: [
            { $match: { createdAt: { $gte: startDate } } },
            { $count: 'count' }
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                revenue: { $sum: '$payment.amount' }
              }
            }
          ],
          orderGrowth: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                count: { $sum: 1 },
                revenue: { $sum: '$payment.amount' }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);
    
    return {
      total: stats[0].total[0]?.count || 0,
      recent: stats[0].recent[0]?.count || 0,
      byStatus: stats[0].byStatus,
      growth: stats[0].orderGrowth
    };
  }
  
  // Statystyki przychodów
  static async getRevenueStats(startDate) {
    const stats = await Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      {
        $facet: {
          total: [
            { $group: { _id: null, total: { $sum: '$payment.amount' } } }
          ],
          recent: [
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: null, total: { $sum: '$payment.amount' } } }
          ],
          average: [
            { $group: { _id: null, average: { $avg: '$payment.amount' } } }
          ],
          byPaymentMethod: [
            {
              $group: {
                _id: '$payment.method',
                total: { $sum: '$payment.amount' },
                count: { $sum: 1 }
              }
            }
          ],
          dailyRevenue: [
            {
              $group: {
                _id: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                },
                revenue: { $sum: '$payment.amount' },
                orders: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);
    
    return {
      total: stats[0].total[0]?.total || 0,
      recent: stats[0].recent[0]?.total || 0,
      average: stats[0].average[0]?.average || 0,
      byPaymentMethod: stats[0].byPaymentMethod,
      daily: stats[0].dailyRevenue
    };
  }
  
  // Statystyki produktów
  static async getProductStats(startDate) {
    const stats = await Product.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [
            { $match: { isActive: true } },
            { $count: 'count' }
          ],
          lowStock: [
            { $match: { stock: { $lt: 10 } } },
            { $count: 'count' }
          ],
          outOfStock: [
            { $match: { stock: 0 } },
            { $count: 'count' }
          ],
          topRated: [
            { $match: { 'rating.average': { $gte: 4 } } },
            { $sort: { 'rating.average': -1 } },
            { $limit: 10 },
            {
              $project: {
                name: 1,
                rating: 1,
                price: 1,
                mainImage: 1
              }
            }
          ]
        }
      }
    ]);
    
    return {
      total: stats[0].total[0]?.count || 0,
      active: stats[0].active[0]?.count || 0,
      lowStock: stats[0].lowStock[0]?.count || 0,
      outOfStock: stats[0].outOfStock[0]?.count || 0,
      topRated: stats[0].topRated
    };
  }
  
  // Najlepiej sprzedające się produkty
  static async getTopSellingProducts(limit = 10, period = 'month') {
    const startDate = this.getStartDate(period);
    
    const stats = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          product: {
            _id: 1,
            name: 1,
            mainImage: 1,
            price: 1,
            stock: 1
          },
          totalSold: 1,
          totalRevenue: 1,
          orderCount: 1
        }
      }
    ]);
    
    return stats;
  }
  
  // Statystyki kuponów
  static async getCouponStats(period = 'month') {
    const startDate = this.getStartDate(period);
    
    const stats = await Coupon.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [
            { $match: { isActive: true } },
            { $count: 'count' }
          ],
          usage: [
            {
              $match: {
                'usageHistory.usedAt': { $gte: startDate }
              }
            },
            {
              $group: {
                _id: null,
                totalUses: { $sum: '$usage.totalUses' },
                totalDiscount: { $sum: '$usage.totalDiscount' }
              }
            }
          ],
          topCoupons: [
            { $sort: { 'usage.totalUses': -1 } },
            { $limit: 10 },
            {
              $project: {
                code: 1,
                type: 1,
                value: 1,
                usage: 1
              }
            }
          ]
        }
      }
    ]);
    
    return {
      total: stats[0].total[0]?.count || 0,
      active: stats[0].active[0]?.count || 0,
      usage: stats[0].usage[0] || { totalUses: 0, totalDiscount: 0 },
      topCoupons: stats[0].topCoupons
    };
  }
  
  // Statystyki recenzji
  static async getReviewStats(period = 'month') {
    const startDate = this.getStartDate(period);
    
    const stats = await Review.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          recent: [
            { $match: { createdAt: { $gte: startDate } } },
            { $count: 'count' }
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          averageRating: [
            { $match: { status: 'approved' } },
            {
              $group: {
                _id: null,
                average: { $avg: '$rating' },
                total: { $sum: 1 }
              }
            }
          ],
          ratingDistribution: [
            { $match: { status: 'approved' } },
            {
              $group: {
                _id: '$rating',
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: -1 } }
          ]
        }
      }
    ]);
    
    return {
      total: stats[0].total[0]?.count || 0,
      recent: stats[0].recent[0]?.count || 0,
      byStatus: stats[0].byStatus,
      averageRating: stats[0].averageRating[0] || { average: 0, total: 0 },
      ratingDistribution: stats[0].ratingDistribution
    };
  }
  
  // Raport sprzedaży
  static async getSalesReport(startDate, endDate) {
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$payment.amount' },
          orders: { $sum: 1 },
          averageOrder: { $avg: '$payment.amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    return stats;
  }
  
  // Raport użytkowników
  static async getUserReport(startDate, endDate) {
    const stats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    return stats;
  }
  
  // Eksport danych
  static async exportData(type, startDate, endDate) {
    switch (type) {
      case 'orders':
        return await Order.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).populate('user', 'firstName lastName email');
        
      case 'users':
        return await User.find({
          createdAt: { $gte: startDate, $lte: endDate }
        });
        
      case 'products':
        return await Product.find().populate('shop', 'name');
        
      case 'reviews':
        return await Review.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).populate('user', 'firstName lastName').populate('product', 'name');
        
      default:
        throw new Error('Nieobsługiwany typ eksportu');
    }
  }
  
  // Funkcja pomocnicza do obliczania daty początkowej
  static getStartDate(period) {
    const now = new Date();
    
    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'quarter':
        return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }
  
  // Alerty systemowe
  static async getSystemAlerts() {
    const alerts = [];
    
    // Produkty z niskim stanem magazynowym
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);
    if (lowStockProducts.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Niski stan magazynowy',
        message: `${lowStockProducts.length} produktów ma niski stan magazynowy`,
        data: lowStockProducts
      });
    }
    
    // Produkty wyprzedane
    const outOfStockProducts = await Product.find({ stock: 0 }).limit(5);
    if (outOfStockProducts.length > 0) {
      alerts.push({
        type: 'error',
        title: 'Produkty wyprzedane',
        message: `${outOfStockProducts.length} produktów jest wyprzedanych`,
        data: outOfStockProducts
      });
    }
    
    // Recenzje oczekujące na moderację
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    if (pendingReviews > 0) {
      alerts.push({
        type: 'info',
        title: 'Recenzje do moderacji',
        message: `${pendingReviews} recenzji oczekuje na moderację`
      });
    }
    
    // Kupony wygasające
    const expiringCoupons = await Coupon.find({
      validUntil: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      isActive: true
    }).limit(5);
    
    if (expiringCoupons.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Kupony wygasające',
        message: `${expiringCoupons.length} kuponów wygasa w ciągu tygodnia`,
        data: expiringCoupons
      });
    }
    
    return alerts;
  }
}

module.exports = AnalyticsService; 