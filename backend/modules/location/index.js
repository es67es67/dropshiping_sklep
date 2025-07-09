const express = require('express');
const router = express.Router();
const Location = require('../../models/locationModel');
const User = require('../../models/userModel');
const Shop = require('../../models/shopModel');
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
        const { type, parentId, limit = 50, page = 1 } = req.query;
        const query = {};
        
        if (type) query.type = type;
        if (parentId) query.parentLocation = parentId;
        
        const skip = (page - 1) * limit;
        const locations = await Location.find(query)
          .limit(parseInt(limit))
          .skip(skip)
          .sort({ name: 1 });
        
        res.json(locations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie szczegółów lokalizacji
    router.get('/locations/:id', async (req, res) => {
      try {
        const location = await Location.findById(req.params.id)
          .populate('parentLocation')
          .populate('childLocations');
        
        if (!location) {
          return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
        }
        
        // Pobieranie statystyk dla lokalizacji
        const stats = await this.getLocationStats(req.params.id);
        
        res.json({ ...location.toObject(), stats });
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
        // results.results.push(...await Product.find({ location: location._id }).limit(20));
      }
      
      if (type === 'shops' || type === 'all') {
        const shops = await Shop.find({ location: location._id }).limit(20);
        results.results.push(...shops);
      }
      
      return results;
    } catch (error) {
      console.error('Błąd wyszukiwania w promieniu:', error);
      return { location: location.name, radius: radiusKm, results: [] };
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