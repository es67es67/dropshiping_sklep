const express = require('express');
const router = express.Router();
const Location = require('../../models/locationModel');
const User = require('../../models/userModel');
const Shop = require('../../models/shopModel');
const Post = require('../../models/postModel');
const Product = require('../../models/productModel');
const LocationRating = require('../../models/locationRatingModel');
const eventSystem = require('../../core/eventSystem');

class LocationModule {
  constructor() {
    this.router = router;
    this.setupRoutes();
    this.setupEvents();
  }

  setupRoutes() {
    // Pobieranie lokalizacji po typie
    router.get('/locations', async (req, res) => {
      try {
        const { type, parentId, limit = 50, page = 1, search, sort = 'name', order = 'asc' } = req.query;
        const query = {};
        
        if (type) query.type = type;
        if (parentId) query.parentLocation = parentId;
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
          ];
        }
        
        const skip = (page - 1) * limit;
        const sortOrder = order === 'desc' ? -1 : 1;
        
        const locations = await Location.find(query)
          .limit(parseInt(limit))
          .skip(skip)
          .sort({ [sort]: sortOrder });
        
        const total = await Location.countDocuments(query);
        
        res.json({
          locations,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie szczegółów lokalizacji
    router.get('/locations/:id', async (req, res) => {
      try {
        const location = await Location.findById(req.params.id)
          .populate('parentLocation')
          .populate('childLocations')
          .populate('wojewodztwo')
          .populate('powiat')
          .populate('gmina');
        
        if (!location) {
          return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
        }
        
        // Pobieranie statystyk dla lokalizacji
        const stats = await this.getLocationStats(req.params.id);
        
        // Pobieranie rekomendacji
        const recommendations = await this.getLocationRecommendations(req.params.id);
        
        res.json({ 
          ...location.toObject(), 
          stats,
          recommendations 
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Sąsiednie lokalizacje
    router.get('/locations/:id/nearby', async (req, res) => {
      try {
        const location = await Location.findById(req.params.id);
        if (!location) {
          return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
        }
        
        const nearby = await this.getNearbyLocations(location);
        res.json(nearby);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Wyszukiwanie w promieniu
    router.get('/locations/:id/radius/:km', async (req, res) => {
      try {
        const { id, km } = req.params;
        const { type } = req.query; // products, posts, shops
        
        const location = await Location.findById(id);
        if (!location) {
          return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
        }
        
        const results = await this.searchInRadius(location, parseInt(km), type);
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Zaawansowane wyszukiwanie
    router.get('/locations/search/advanced', async (req, res) => {
      try {
        const { 
          query, 
          types, 
          tags, 
          features, 
          minPopulation, 
          maxPopulation,
          hasCoordinates,
          sortBy = 'name',
          order = 'asc',
          page = 1,
          limit = 20
        } = req.query;
        
        const searchQuery = {};
        
        if (query) {
          searchQuery.$or = [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ];
        }
        
        if (types) {
          searchQuery.type = { $in: types.split(',') };
        }
        
        if (tags) {
          searchQuery.tags = { $in: tags.split(',') };
        }
        
        if (features) {
          searchQuery.features = { $in: features.split(',') };
        }
        
        if (minPopulation || maxPopulation) {
          searchQuery.population = {};
          if (minPopulation) searchQuery.population.$gte = parseInt(minPopulation);
          if (maxPopulation) searchQuery.population.$lte = parseInt(maxPopulation);
        }
        
        if (hasCoordinates === 'true') {
          searchQuery['coordinates.lat'] = { $exists: true, $ne: null };
          searchQuery['coordinates.lng'] = { $exists: true, $ne: null };
        }
        
        const skip = (page - 1) * limit;
        const sortOrder = order === 'desc' ? -1 : 1;
        
        const locations = await Location.find(searchQuery)
          .limit(parseInt(limit))
          .skip(skip)
          .sort({ [sortBy]: sortOrder });
        
        const total = await Location.countDocuments(searchQuery);
        
        res.json({
          locations,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Rekomendacje lokalizacji
    router.get('/locations/:id/recommendations', async (req, res) => {
      try {
        const location = await Location.findById(req.params.id);
        if (!location) {
          return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
        }
        
        const recommendations = await this.getLocationRecommendations(req.params.id);
        res.json(recommendations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // System ocen lokalizacji
    router.post('/locations/:id/rate', async (req, res) => {
      try {
        const { userId, rating, comment } = req.body;
        const locationId = req.params.id;
        
        const result = await this.rateLocation(locationId, userId, rating, comment);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie ocen lokalizacji
    router.get('/locations/:id/ratings', async (req, res) => {
      try {
        const { page = 1, limit = 10 } = req.query;
        const locationId = req.params.id;
        
        const ratings = await this.getLocationRatings(locationId, parseInt(page), parseInt(limit));
        res.json(ratings);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Subskrypcja powiadomień o lokalizacji
    router.post('/locations/:id/subscribe', async (req, res) => {
      try {
        const { userId } = req.body;
        const locationId = req.params.id;
        
        const result = await this.subscribeToLocation(locationId, userId);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Anulowanie subskrypcji
    router.delete('/locations/:id/subscribe', async (req, res) => {
      try {
        const { userId } = req.body;
        const locationId = req.params.id;
        
        const result = await this.unsubscribeFromLocation(locationId, userId);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Aktualizacja lokalizacji użytkownika
    router.put('/users/location', async (req, res) => {
      try {
        const { userId, locationId } = req.body;
        
        const user = await User.findByIdAndUpdate(
          userId,
          { location: locationId },
          { new: true }
        );
        
        if (!user) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        // Emit event
        eventSystem.emitLocationChanged(userId, locationId);
        
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Migracja lokalizacji z string na ObjectId
    router.post('/migrate-locations', async (req, res) => {
      try {
        const result = await this.migrateLocations();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Analityka lokalizacji
    router.get('/locations/:id/analytics', async (req, res) => {
      try {
        const locationId = req.params.id;
        const { period = '30d' } = req.query;
        
        const analytics = await this.getLocationAnalytics(locationId, period);
        res.json(analytics);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Eksport danych lokalizacji
    router.get('/locations/:id/export', async (req, res) => {
      try {
        const locationId = req.params.id;
        const { format = 'json' } = req.query;
        
        const exportData = await this.exportLocationData(locationId, format);
        res.json(exportData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupEvents() {
    // Nasłuchiwanie na zmiany lokalizacji
    eventSystem.onLocationChanged(async (data) => {
      console.log(`📍 Użytkownik ${data.userId} zmienił lokalizację na ${data.locationId}`);
      // Tutaj można dodać dodatkową logikę (np. powiadomienia, aktualizacje feedu)
    });
  }

  async getLocationStats(locationId) {
    try {
      const [usersCount, shopsCount, productsCount] = await Promise.all([
        User.countDocuments({ location: locationId }),
        Shop.countDocuments({ location: locationId }),
        // Product.countDocuments({ location: locationId }) // gdy będzie model Product
      ]);
      
      return {
        usersCount,
        shopsCount,
        productsCount: 0 // tymczasowo 0
      };
    } catch (error) {
      console.error('Błąd pobierania statystyk lokalizacji:', error);
      return { usersCount: 0, shopsCount: 0, productsCount: 0 };
    }
  }

  async getNearbyLocations(location) {
    try {
      let query = {};
      
      // Jeśli to miejscowość, pokaż sąsiednie miejscowości w tej samej gminie
      if (location.type === 'miejscowość') {
        const parentLocation = await Location.findById(location.parentLocation);
        if (parentLocation) {
          query = {
            type: 'miejscowość',
            parentLocation: location.parentLocation,
            _id: { $ne: location._id }
          };
        }
      }
      // Jeśli to gmina, pokaż sąsiednie gminy w tym samym powiecie
      else if (location.type === 'gmina') {
        const parentLocation = await Location.findById(location.parentLocation);
        if (parentLocation) {
          query = {
            type: 'gmina',
            parentLocation: location.parentLocation,
            _id: { $ne: location._id }
          };
        }
      }
      // Jeśli to powiat, pokaż sąsiednie powiaty w tym samym województwie
      else if (location.type === 'powiat') {
        const parentLocation = await Location.findById(location.parentLocation);
        if (parentLocation) {
          query = {
            type: 'powiat',
            parentLocation: location.parentLocation,
            _id: { $ne: location._id }
          };
        }
      }
      
      const nearby = await Location.find(query).limit(10);
      return nearby;
    } catch (error) {
      console.error('Błąd pobierania sąsiednich lokalizacji:', error);
      return [];
    }
  }

  async searchInRadius(location, radiusKm, type) {
    try {
      // Tymczasowo zwracamy podstawowe wyniki
      // W przyszłości będzie to integracja z geolokalizacją
      const results = {
        location: location.name,
        radius: radiusKm,
        type: type || 'all',
        results: []
      };
      
      if (type === 'products' || type === 'all') {
        const products = await Product.find({ location: location._id }).limit(20);
        results.results.push(...products);
      }
      
      if (type === 'shops' || type === 'all') {
        const shops = await Shop.find({ location: location._id }).limit(20);
        results.results.push(...shops);
      }
      
      if (type === 'posts' || type === 'all') {
        const posts = await Post.find({ location: location._id }).limit(20);
        results.results.push(...posts);
      }
      
      return results;
    } catch (error) {
      console.error('Błąd wyszukiwania w promieniu:', error);
      return { location: location.name, radius: radiusKm, results: [] };
    }
  }

  async getLocationRecommendations(locationId) {
    try {
      const location = await Location.findById(locationId);
      if (!location) return [];
      
      const recommendations = [];
      
      // Rekomendacje na podstawie podobnych tagów
      if (location.tags && location.tags.length > 0) {
        const similarByTags = await Location.find({
          _id: { $ne: locationId },
          tags: { $in: location.tags },
          isActive: true
        }).limit(5);
        recommendations.push(...similarByTags);
      }
      
      // Rekomendacje na podstawie typu
      const similarByType = await Location.find({
        _id: { $ne: locationId },
        type: location.type,
        isActive: true
      }).limit(3);
      recommendations.push(...similarByType);
      
      // Rekomendacje na podstawie sąsiedztwa
      if (location.parentLocation) {
        const nearby = await Location.find({
          _id: { $ne: locationId },
          parentLocation: location.parentLocation,
          isActive: true
        }).limit(3);
        recommendations.push(...nearby);
      }
      
      // Usuń duplikaty i zwróć unikalne rekomendacje
      const uniqueRecommendations = recommendations.filter((item, index, self) => 
        index === self.findIndex(t => t._id.toString() === item._id.toString())
      );
      
      return uniqueRecommendations.slice(0, 10);
    } catch (error) {
      console.error('Błąd pobierania rekomendacji:', error);
      return [];
    }
  }

  async rateLocation(locationId, userId, rating, comment) {
    try {
      // Sprawdź czy użytkownik już ocenił tę lokalizację
      const existingRating = await this.getUserLocationRating(locationId, userId);
      
      if (existingRating) {
        // Aktualizuj istniejącą ocenę
        existingRating.rating = rating;
        existingRating.comment = comment;
        existingRating.updatedAt = new Date();
        await existingRating.save();
      } else {
        // Utwórz nową ocenę
        const newRating = new LocationRating({
          location: locationId,
          user: userId,
          rating,
          comment
        });
        await newRating.save();
      }
      
      // Aktualizuj średnią ocenę lokalizacji
      await this.updateLocationAverageRating(locationId);
      
      return { success: true, message: 'Ocena została zapisana' };
    } catch (error) {
      console.error('Błąd oceniania lokalizacji:', error);
      throw error;
    }
  }

  async getLocationRatings(locationId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const ratings = await LocationRating.find({ location: locationId })
        .populate('user', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await LocationRating.countDocuments({ location: locationId });
      
      return {
        ratings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Błąd pobierania ocen:', error);
      return { ratings: [], pagination: { page, limit, total: 0, pages: 0 } };
    }
  }

  async subscribeToLocation(locationId, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Użytkownik nie znaleziony');
      }
      
      // Sprawdź czy już subskrybuje
      if (user.subscribedLocations && user.subscribedLocations.includes(locationId)) {
        return { success: false, message: 'Już subskrybujesz tę lokalizację' };
      }
      
      // Dodaj do subskrypcji
      if (!user.subscribedLocations) user.subscribedLocations = [];
      user.subscribedLocations.push(locationId);
      await user.save();
      
      return { success: true, message: 'Subskrypcja została dodana' };
    } catch (error) {
      console.error('Błąd subskrypcji:', error);
      throw error;
    }
  }

  async unsubscribeFromLocation(locationId, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Użytkownik nie znaleziony');
      }
      
      if (!user.subscribedLocations) {
        return { success: false, message: 'Brak subskrypcji' };
      }
      
      user.subscribedLocations = user.subscribedLocations.filter(
        id => id.toString() !== locationId
      );
      await user.save();
      
      return { success: true, message: 'Subskrypcja została usunięta' };
    } catch (error) {
      console.error('Błąd anulowania subskrypcji:', error);
      throw error;
    }
  }

  async getLocationAnalytics(locationId, period = '30d') {
    try {
      const location = await Location.findById(locationId);
      if (!location) return null;
      
      const now = new Date();
      let startDate;
      
      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      // Pobierz wszystkie podlokalizacje
      const allChildren = await location.getAllChildren();
      const allLocationIds = [locationId, ...allChildren.map(child => child._id)];
      
      const analytics = {
        location: {
          id: location._id,
          name: location.name,
          type: location.type
        },
        period,
        stats: {
          totalUsers: await User.countDocuments({ location: { $in: allLocationIds } }),
          totalShops: await Shop.countDocuments({ location: { $in: allLocationIds } }),
          totalProducts: await Product.countDocuments({ location: { $in: allLocationIds } }),
          totalPosts: await Post.countDocuments({ location: { $in: allLocationIds } }),
          newUsers: await User.countDocuments({ 
            location: { $in: allLocationIds },
            createdAt: { $gte: startDate }
          }),
          newShops: await Shop.countDocuments({ 
            location: { $in: allLocationIds },
            createdAt: { $gte: startDate }
          }),
          newProducts: await Product.countDocuments({ 
            location: { $in: allLocationIds },
            createdAt: { $gte: startDate }
          }),
          newPosts: await Post.countDocuments({ 
            location: { $in: allLocationIds },
            createdAt: { $gte: startDate }
          })
        },
        trends: {
          // Tutaj można dodać trendy w czasie
          userGrowth: 0,
          shopGrowth: 0,
          productGrowth: 0,
          postGrowth: 0
        }
      };
      
      return analytics;
    } catch (error) {
      console.error('Błąd pobierania analityki:', error);
      return null;
    }
  }

  async exportLocationData(locationId, format = 'json') {
    try {
      const location = await Location.findById(locationId)
        .populate('parentLocation')
        .populate('wojewodztwo')
        .populate('powiat')
        .populate('gmina');
      
      if (!location) {
        throw new Error('Lokalizacja nie znaleziona');
      }
      
      // Pobierz wszystkie podlokalizacje
      const allChildren = await location.getAllChildren();
      const allLocationIds = [locationId, ...allChildren.map(child => child._id)];
      
      // Pobierz powiązane dane
      const [users, shops, products, posts] = await Promise.all([
        User.find({ location: { $in: allLocationIds } }).select('-password'),
        Shop.find({ location: { $in: allLocationIds } }),
        Product.find({ location: { $in: allLocationIds } }),
        Post.find({ location: { $in: allLocationIds } })
      ]);
      
      const exportData = {
        location: location.toObject(),
        children: allChildren,
        stats: {
          totalUsers: users.length,
          totalShops: shops.length,
          totalProducts: products.length,
          totalPosts: posts.length
        },
        data: {
          users,
          shops,
          products,
          posts
        },
        exportDate: new Date(),
        format
      };
      
      return exportData;
    } catch (error) {
      console.error('Błąd eksportu danych:', error);
      throw error;
    }
  }

  async getUserLocationRating(locationId, userId) {
    try {
      return await LocationRating.findOne({ location: locationId, user: userId });
    } catch (error) {
      console.error('Błąd pobierania oceny użytkownika:', error);
      return null;
    }
  }

  async updateLocationAverageRating(locationId) {
    try {
      const ratings = await LocationRating.find({ location: locationId });
      
      if (ratings.length === 0) return;
      
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRating / ratings.length;
      
      await Location.findByIdAndUpdate(locationId, {
        'stats.averageRating': averageRating,
        'stats.totalRatings': ratings.length
      });
    } catch (error) {
      console.error('Błąd aktualizacji średniej oceny:', error);
    }
  }

  async migrateLocations() {
    try {
      console.log('🔄 Rozpoczynam migrację lokalizacji...');
      
      // Migracja użytkowników
      const users = await User.find({ location: { $type: 'string' } });
      let migratedUsers = 0;
      
      for (const user of users) {
        if (typeof user.location === 'string' && user.location) {
          // Znajdź lub utwórz lokalizację
          let location = await Location.findOne({ 
            name: user.location, 
            type: 'miejscowość' 
          });
          
          if (!location) {
            // Utwórz nową lokalizację jeśli nie istnieje
            location = new Location({
              name: user.location,
              type: 'miejscowość',
              code: `MIG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              isActive: true
            });
            await location.save();
          }
          
          user.location = location._id;
          await user.save();
          migratedUsers++;
        }
      }
      
      // Migracja sklepów
      const shops = await Shop.find({ location: { $type: 'string' } });
      let migratedShops = 0;
      
      for (const shop of shops) {
        if (typeof shop.location === 'string' && shop.location) {
          let location = await Location.findOne({ 
            name: shop.location, 
            type: 'miejscowość' 
          });
          
          if (!location) {
            location = new Location({
              name: shop.location,
              type: 'miejscowość',
              code: `MIG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              isActive: true
            });
            await location.save();
          }
          
          shop.location = location._id;
          await shop.save();
          migratedShops++;
        }
      }
      
      console.log(`✅ Migracja zakończona: ${migratedUsers} użytkowników, ${migratedShops} sklepów`);
      
      return {
        success: true,
        migratedUsers,
        migratedShops,
        message: 'Migracja lokalizacji zakończona pomyślnie'
      };
    } catch (error) {
      console.error('❌ Błąd migracji lokalizacji:', error);
      throw error;
    }
  }

  async initialize() {
    console.log('📍 Inicjalizacja modułu lokalizacji...');
    // Tutaj można dodać dodatkową logikę inicjalizacji
    return true;
  }

  getRoutes() {
    return this.router;
  }
}

module.exports = new LocationModule(); 