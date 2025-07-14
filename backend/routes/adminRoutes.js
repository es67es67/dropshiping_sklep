const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Location = require('../models/locationModel');
const User = require('../models/userModel');
const Shop = require('../models/shopModel');
const Product = require('../models/productModel');
const Post = require('../models/postModel');
const Message = require('../models/messageModel');
const Group = require('../models/groupModel');
const Review = require('../models/reviewModel');
const Notification = require('../models/notificationModel');
const Achievement = require('../models/achievementModel');
const Badge = require('../models/badgeModel');
const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');

// Middleware do sprawdzania uprawnień admina
const requireAdmin = async (req, res, next) => {
  try {
    // W produkcji sprawdź token JWT
    // Na razie pomijamy sprawdzanie dla rozwoju
    next();
  } catch (error) {
    res.status(401).json({ error: 'Brak uprawnień administratora' });
  }
};

// Dashboard administracyjny
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalShops: await Shop.countDocuments({ isActive: true }),
      totalProducts: await Product.countDocuments({ isActive: true }),
      totalOrders: await Order.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      revenue: await Order.aggregate([
        { $match: { status: { $in: ['paid', 'delivered', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]).then(result => result[0]?.total || 0)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania statystyk dashboardu' });
  }
});

// Statystyki systemu
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      locations: await Location.countDocuments(),
      shops: await Shop.countDocuments(),
      products: await Product.countDocuments(),
      posts: await Post.countDocuments(),
      messages: await Message.countDocuments(),
      groups: await Group.countDocuments(),
      reviews: await Review.countDocuments(),
      notifications: await Notification.countDocuments(),
      achievements: await Achievement.countDocuments(),
      badges: await Badge.countDocuments(),
      payments: await Payment.countDocuments(),
      orders: await Order.countDocuments()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania statystyk' });
  }
});

// Pobierz użytkowników (specjalny endpoint dla admin panel)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('username email firstName lastName roles createdAt lastSeen isActive')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania użytkowników' });
  }
});

// Pobierz ustawienia systemu
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    // Na razie zwracamy domyślne ustawienia
    const settings = {
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
      autoBackup: true
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania ustawień' });
  }
});

// Aktualizuj ustawienia systemu
router.put('/settings', requireAdmin, async (req, res) => {
  try {
    const updateData = req.body;
    // Na razie zwracamy sukces bez zapisywania
    res.json({ success: true, message: 'Ustawienia zostały zaktualizowane' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas aktualizacji ustawień' });
  }
});

// Pobierz dane z kolekcji
router.get('/:collection', requireAdmin, async (req, res) => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 50, search } = req.query;
    
    let Model;
    switch (collection) {
      case 'users': Model = User; break;
      case 'locations': Model = Location; break;
      case 'shops': Model = Shop; break;
      case 'products': Model = Product; break;
      case 'posts': Model = Post; break;
      case 'messages': Model = Message; break;
      case 'groups': Model = Group; break;
      case 'reviews': Model = Review; break;
      case 'notifications': Model = Notification; break;
      case 'achievements': Model = Achievement; break;
      case 'badges': Model = Badge; break;
      case 'payments': Model = Payment; break;
      case 'orders': Model = Order; break;
      default:
        return res.status(400).json({ error: 'Nieznana kolekcja' });
    }

    const skip = (page - 1) * limit;
    let query = {};
    
    if (search) {
      // Wyszukiwanie w polach tekstowych
      const searchRegex = new RegExp(search, 'i');
      const searchableFields = Object.keys(Model.schema.paths).filter(path => 
        Model.schema.paths[path].instance === 'String'
      );
      
      if (searchableFields.length > 0) {
        query.$or = searchableFields.map(field => ({ [field]: searchRegex }));
      }
    }

    const data = await Model.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Model.countDocuments(query);

    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania danych' });
  }
});

// Aktualizuj element w kolekcji
router.put('/:collection/:id', requireAdmin, async (req, res) => {
  try {
    const { collection, id } = req.params;
    const updateData = req.body;
    
    let Model;
    switch (collection) {
      case 'users': Model = User; break;
      case 'locations': Model = Location; break;
      case 'shops': Model = Shop; break;
      case 'products': Model = Product; break;
      case 'posts': Model = Post; break;
      case 'messages': Model = Message; break;
      case 'groups': Model = Group; break;
      case 'reviews': Model = Review; break;
      case 'notifications': Model = Notification; break;
      case 'achievements': Model = Achievement; break;
      case 'badges': Model = Badge; break;
      case 'payments': Model = Payment; break;
      case 'orders': Model = Order; break;
      default:
        return res.status(400).json({ error: 'Nieznana kolekcja' });
    }

    const result = await Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Element nie został znaleziony' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas aktualizacji' });
  }
});

// Usuń element z kolekcji
router.delete('/:collection/:id', requireAdmin, async (req, res) => {
  try {
    const { collection, id } = req.params;
    
    let Model;
    switch (collection) {
      case 'users': Model = User; break;
      case 'locations': Model = Location; break;
      case 'shops': Model = Shop; break;
      case 'products': Model = Product; break;
      case 'posts': Model = Post; break;
      case 'messages': Model = Message; break;
      case 'groups': Model = Group; break;
      case 'reviews': Model = Review; break;
      case 'notifications': Model = Notification; break;
      case 'achievements': Model = Achievement; break;
      case 'badges': Model = Badge; break;
      case 'payments': Model = Payment; break;
      case 'orders': Model = Order; break;
      default:
        return res.status(400).json({ error: 'Nieznana kolekcja' });
    }

    const result = await Model.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Element nie został znaleziony' });
    }

    res.json({ success: true, message: 'Element został usunięty' });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas usuwania' });
  }
});

// Dodaj nowy element do kolekcji
router.post('/:collection', requireAdmin, async (req, res) => {
  try {
    const { collection } = req.params;
    const newData = req.body;
    
    let Model;
    switch (collection) {
      case 'users': Model = User; break;
      case 'locations': Model = Location; break;
      case 'shops': Model = Shop; break;
      case 'products': Model = Product; break;
      case 'posts': Model = Post; break;
      case 'messages': Model = Message; break;
      case 'groups': Model = Group; break;
      case 'reviews': Model = Review; break;
      case 'notifications': Model = Notification; break;
      case 'achievements': Model = Achievement; break;
      case 'badges': Model = Badge; break;
      case 'payments': Model = Payment; break;
      case 'orders': Model = Order; break;
      default:
        return res.status(400).json({ error: 'Nieznana kolekcja' });
    }

    const newItem = new Model(newData);
    const savedItem = await newItem.save();

    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas dodawania' });
  }
});

// Eksport danych
router.post('/export', requireAdmin, async (req, res) => {
  try {
    const { collections, format, includeMetadata, dateRange, filters } = req.body;
    
    if (!collections || collections.length === 0) {
      return res.status(400).json({ error: 'Wybierz przynajmniej jedną kolekcję' });
    }

    const exportData = {};
    let totalRecords = 0;

    for (const collectionName of collections) {
      let Model;
      switch (collectionName) {
        case 'users': Model = User; break;
        case 'locations': Model = Location; break;
        case 'shops': Model = Shop; break;
        case 'products': Model = Product; break;
        case 'posts': Model = Post; break;
        case 'messages': Model = Message; break;
        case 'groups': Model = Group; break;
        case 'reviews': Model = Review; break;
        case 'notifications': Model = Notification; break;
        case 'achievements': Model = Achievement; break;
        case 'badges': Model = Badge; break;
        case 'payments': Model = Payment; break;
        case 'orders': Model = Order; break;
        default:
          continue;
      }

      let query = {};
      
      // Filtry dat
      if (dateRange && dateRange.start && dateRange.end) {
        query.createdAt = {
          $gte: new Date(dateRange.start),
          $lte: new Date(dateRange.end)
        };
      }

      // Dodatkowe filtry
      if (filters && filters[collectionName]) {
        Object.assign(query, filters[collectionName]);
      }

      const data = await Model.find(query).lean();
      exportData[collectionName] = data;
      totalRecords += data.length;
    }

    // Dodaj metadane
    if (includeMetadata) {
      exportData._metadata = {
        exportDate: new Date().toISOString(),
        collections: collections,
        totalRecords: totalRecords,
        format: format,
        version: '1.0'
      };
    }

    // Na razie zwracamy JSON, w przyszłości można dodać obsługę innych formatów
    res.json({
      success: true,
      data: exportData,
      totalRecords,
      collections: collections.length,
      format: format || 'json'
    });

  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas eksportu' });
  }
});

// Sprawdź duplikaty lokalizacji
router.post('/check-duplicates', requireAdmin, async (req, res) => {
  try {
    const duplicates = await Location.aggregate([
      {
        $group: {
          _id: {
            name: "$name",
            type: "$type",
            code: "$code",
            parentLocation: "$parentLocation"
          },
          ids: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ], { allowDiskUse: true });
    res.json({ count: duplicates.length, duplicates });
  } catch (err) {
    res.status(500).json({ message: 'Błąd sprawdzania duplikatów: ' + err.message });
  }
});

// Usuń duplikaty lokalizacji
router.post('/remove-duplicates', requireAdmin, async (req, res) => {
  try {
    const duplicates = await Location.aggregate([
      {
        $group: {
          _id: {
            name: "$name",
            type: "$type",
            code: "$code",
            parentLocation: "$parentLocation"
          },
          ids: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ], { allowDiskUse: true });

    let removed = 0;
    for (const dup of duplicates) {
      // zostaw jeden, resztę usuń
      dup.ids.shift();
      const resDel = await Location.deleteMany({ _id: { $in: dup.ids } });
      removed += resDel.deletedCount;
    }
    res.json({ message: `Usunięto ${removed} duplikatów.` });
  } catch (err) {
    res.status(500).json({ message: 'Błąd usuwania duplikatów: ' + err.message });
  }
});

module.exports = router; 