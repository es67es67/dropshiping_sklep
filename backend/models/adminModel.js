const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  // Użytkownik admina
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Role administracyjne
  roles: [{
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'support', 'analyst'],
    default: ['admin']
  }],
  
  // Uprawnienia
  permissions: {
    users: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: false },
      ban: { type: Boolean, default: true }
    },
    products: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: true },
      approve: { type: Boolean, default: true }
    },
    orders: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      cancel: { type: Boolean, default: true },
      refund: { type: Boolean, default: true }
    },
    reviews: {
      view: { type: Boolean, default: true },
      moderate: { type: Boolean, default: true },
      delete: { type: Boolean, default: true }
    },
    coupons: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: true }
    },
    analytics: {
      view: { type: Boolean, default: true },
      export: { type: Boolean, default: true }
    },
    settings: {
      view: { type: Boolean, default: false },
      edit: { type: Boolean, default: false }
    }
  },
  
  // Ustawienia dashboardu
  dashboard: {
    widgets: [{
      type: { type: String, enum: ['sales', 'users', 'orders', 'reviews', 'revenue'] },
      position: { x: Number, y: Number, w: Number, h: Number },
      enabled: { type: Boolean, default: true }
    }],
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'pl' }
  },
  
  // Aktywność
  activity: {
    lastLogin: { type: Date },
    loginCount: { type: Number, default: 0 },
    lastAction: { type: String },
    lastActionAt: { type: Date }
  },
  
  // Powiadomienia
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    types: {
      newOrders: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      userReports: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true }
    }
  },
  
  // Sesja
  session: {
    token: { type: String },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

// Metody admina
adminSchema.methods.hasPermission = function(resource, action) {
  if (this.roles.includes('super_admin')) {
    return true;
  }
  
  return this.permissions[resource]?.[action] || false;
};

adminSchema.methods.updateActivity = function(action) {
  this.activity.lastAction = action;
  this.activity.lastActionAt = new Date();
  return this.save();
};

adminSchema.methods.login = function() {
  this.activity.lastLogin = new Date();
  this.activity.loginCount += 1;
  return this.save();
};

// Statyczne metody
adminSchema.statics.getDashboardStats = async function() {
  const User = require('./userModel');
  const Order = require('./orderModel');
  const Product = require('./productModel');
  const Review = require('./reviewModel');
  
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Statystyki użytkowników
  const userStats = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        newThisMonth: {
          $sum: {
            $cond: [
              { $gte: ['$createdAt', lastMonth] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
  
  // Statystyki zamówień
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$payment.amount' }
      }
    }
  ]);
  
  // Statystyki sprzedaży
  const salesStats = await Order.aggregate([
    { $match: { 'payment.status': 'paid' } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        revenue: { $sum: '$payment.amount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);
  
  // Statystyki produktów
  const productStats = await Product.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        lowStock: { $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] } }
      }
    }
  ]);
  
  // Statystyki recenzji
  const reviewStats = await Review.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    users: userStats[0] || { total: 0, active: 0, newThisMonth: 0 },
    orders: orderStats,
    sales: salesStats,
    products: productStats[0] || { total: 0, active: 0, lowStock: 0 },
    reviews: reviewStats
  };
};

adminSchema.statics.getRevenueStats = async function(period = 'month') {
  const Order = require('./orderModel');
  
  let startDate;
  const now = new Date();
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  const stats = await Order.aggregate([
    {
      $match: {
        'payment.status': 'paid',
        createdAt: { $gte: startDate }
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
};

adminSchema.statics.getTopProducts = async function(limit = 10) {
  const Order = require('./orderModel');
  
  const stats = await Order.aggregate([
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
          price: 1
        },
        totalSold: 1,
        totalRevenue: 1,
        orderCount: 1
      }
    }
  ]);
  
  return stats;
};

// Indeksy
adminSchema.index({ user: 1 });
adminSchema.index({ roles: 1 });
adminSchema.index({ 'activity.lastLogin': -1 });

module.exports = mongoose.model('Admin', adminSchema); 