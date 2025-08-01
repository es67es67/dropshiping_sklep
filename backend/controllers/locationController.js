const Location = require('../models/locationModel');
const User = require('../models/userModel');
const Shop = require('../models/shopModel');
const Product = require('../models/productModel');
const Post = require('../models/postModel');
const Powiat = require('../models/powiatModel');
const Gmina = require('../models/gminaModel');
const Miejscowosc = require('../models/miejscowoscModel');
const HybridLocationService = require('../services/hybridLocationService');
const mongoose = require('mongoose'); // Dodane import dla mongoose

const hybridService = new HybridLocationService();

// Pobierz szczegóły konkretnej lokalizacji
const getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await Location.findById(id)
      .populate('hierarchy.wojewodztwo', 'name code')
      .populate('hierarchy.powiat', 'name code')
      .populate('hierarchy.gmina', 'name code');
    
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie została znaleziona' });
    }
    
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz wszystkie lokalizacje
const getLocations = async (req, res) => {
  try {
    const { type, search, limit = 50 } = req.query;
    
    let query = { isActive: true };
    if (type) query.type = type;
    if (search) {
      query.$text = { $search: search };
    }
    
    const locations = await Location.find(query)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz konkretną lokalizację z pełnymi danymi
exports.getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie została znaleziona' });
    }
    
    // Pobierz statystyki
    const userCount = await User.countDocuments({ location: location._id });
    const shopCount = await Shop.countDocuments({ location: location._id });
    const productCount = await Product.countDocuments({ 
      shop: { $in: await Shop.find({ location: location._id }).select('_id') }
    });
    const postCount = await Post.countDocuments({ 
      author: { $in: await User.find({ location: location._id }).select('_id') }
    });
    
    // Aktualizuj statystyki
    location.stats = {
      totalUsers: userCount,
      totalShops: shopCount,
      totalProducts: productCount,
      totalPosts: postCount
    };
    await location.save();
    
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz feed lokalizacji (posty, produkty, sklepy)
exports.getLocationFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const skip = (page - 1) * limit;
    
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie została znaleziona' });
    }
    
    let feed = [];
    
    if (type === 'all' || type === 'posts') {
      const users = await User.find({ location: location._id }).select('_id');
      const posts = await Post.find({ 
        author: { $in: users.map(u => u._id) },
        isPublic: true 
      })
      .populate('author', 'username firstName lastName avatar')
      .populate('likes', 'username firstName lastName avatar')
      .populate('comments.author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) / 2);
      
      feed.push(...posts.map(post => ({ ...post.toObject(), type: 'post' })));
    }
    
    if (type === 'all' || type === 'products') {
      const shops = await Shop.find({ location: location._id }).select('_id');
      const products = await Product.find({ shop: { $in: shops } })
        .populate('shop', 'name logo')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) / 2);
      
      feed.push(...products.map(product => ({ ...product.toObject(), type: 'product' })));
    }
    
    if (type === 'all' || type === 'shops') {
      const shops = await Shop.find({ location: location._id, isActive: true })
        .populate('owner', 'username firstName lastName avatar')
        .sort({ rating: -1, totalReviews: -1 })
        .limit(parseInt(limit) / 2);
      
      feed.push(...shops.map(shop => ({ ...shop.toObject(), type: 'shop' })));
    }
    
    // Sortuj feed po dacie
    feed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Paginacja
    const total = feed.length;
    feed = feed.slice(skip, skip + parseInt(limit));
    
    res.json({
      feed,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      location: {
        _id: location._id,
        name: location.name,
        type: location.type,
        stats: location.stats
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz użytkowników z lokalizacji
exports.getLocationUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, online = false } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { location: id };
    if (online === 'true') {
      query.isOnline = true;
    }
    
    const users = await User.find(query)
      .select('username firstName lastName avatar bio isOnline lastSeen stats')
      .sort({ isOnline: -1, lastSeen: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz sklepy z lokalizacji
exports.getLocationShops = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { location: id, isActive: true };
    if (category) {
      query.categories = category;
    }
    
    const shops = await Shop.find(query)
      .populate('owner', 'username firstName lastName avatar')
      .sort({ rating: -1, totalReviews: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Shop.countDocuments(query);
    
    res.json({
      shops,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalShops: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz produkty z lokalizacji
exports.getLocationProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, category, minPrice, maxPrice } = req.query;
    const skip = (page - 1) * limit;
    
    const shops = await Shop.find({ location: id }).select('_id');
    let query = { shop: { $in: shops.map(s => s._id) } };
    
    if (category) query.category = category;
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }
    
    const products = await Product.find(query)
      .populate('shop', 'name logo rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Utwórz nową lokalizację (tylko admin)
exports.createLocation = async (req, res) => {
  try {
    const { name, type, parentLocation, coordinates, population, description } = req.body;
    
    const location = new Location({
      name,
      type,
      parentLocation,
      coordinates,
      population,
      description
    });
    
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizuj lokalizację
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie została znaleziona' });
    }
    
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobierz sąsiednie lokalizacje
exports.getNearbyLocations = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie została znaleziona' });
    }
    
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
    res.json(nearby);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wyszukiwanie w promieniu
exports.searchInRadius = async (req, res) => {
  try {
    const { id, km } = req.params;
    const { type } = req.query; // products, posts, shops
    
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie została znaleziona' });
    }
    
    // Tymczasowo zwracamy podstawowe wyniki
    const results = {
      location: {
        id: location._id,
        name: location.name,
        type: location.type
      },
      radius: parseInt(km),
      results: []
    };
    
    if (type === 'products' || type === 'all') {
      const shops = await Shop.find({ location: location._id }).select('_id');
      const products = await Product.find({ shop: { $in: shops } })
        .populate('shop', 'name logo')
        .limit(20);
      results.results.push(...products.map(p => ({ ...p.toObject(), resultType: 'product' })));
    }
    
    if (type === 'shops' || type === 'all') {
      const shops = await Shop.find({ location: location._id, isActive: true })
        .populate('owner', 'username firstName lastName avatar')
        .limit(20);
      results.results.push(...shops.map(s => ({ ...s.toObject(), resultType: 'shop' })));
    }
    
    if (type === 'posts' || type === 'all') {
      const users = await User.find({ location: location._id }).select('_id');
      const posts = await Post.find({ 
        author: { $in: users.map(u => u._id) },
        isPublic: true 
      })
      .populate('author', 'username firstName lastName avatar')
      .limit(20);
      results.results.push(...posts.map(p => ({ ...p.toObject(), resultType: 'post' })));
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja lokalizacji użytkownika
exports.updateUserLocation = async (req, res) => {
  try {
    const { userId, locationId } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { location: locationId },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Migracja lokalizacji
exports.migrateLocations = async (req, res) => {
  try {
    // Tymczasowo zwracamy sukces
    res.json({ 
      message: 'Migracja lokalizacji zakończona pomyślnie',
      migrated: 0 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie wszystkich lokalizacji według typu
const getLocationsByType = async (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.status(400).json({ error: 'Typ lokalizacji jest wymagany' });
    }

    console.log(`🔍 Pobieranie lokalizacji typu: ${type}`);

    // Sprawdź czy dane są w bazie
    let locations = await Location.find({ type: type }).limit(100);
    
    // Jeśli w bazie jest mało danych, pobierz z hybrydowego serwisu
    if (locations.length < 10) {
      console.log(`⚠️ Mało danych w bazie (${locations.length}), pobieram z hybrydowego źródła...`);
      
      try {
        let hybridData = [];
        
        switch (type) {
          case 'województwo':
            hybridData = await hybridService.getAllVoivodeships();
            break;
          case 'powiat':
            // Pobierz wszystkie powiaty dla wszystkich województw
            const voivodeships = await hybridService.getAllVoivodeships();
            for (const voivodeship of voivodeships.slice(0, 3)) { // Ogranicz do 3 województw dla testu
              const counties = await hybridService.getCountiesForVoivodeship(voivodeship.code);
              hybridData.push(...counties);
            }
            break;
          case 'gmina':
            // Pobierz gminy dla kilku powiatów
            const counties = await hybridService.getCountiesForVoivodeship('02'); // Mazowieckie
            for (const county of counties.slice(0, 2)) {
              const municipalities = await hybridService.getMunicipalitiesForCounty(county.code);
              hybridData.push(...municipalities);
            }
            break;
          case 'miejscowość':
            // Pobierz miejscowości dla kilku gmin
            const municipalities = await hybridService.getMunicipalitiesForCounty('0201'); // Warszawa
            for (const municipality of municipalities.slice(0, 2)) {
              const towns = await hybridService.getTownsForMunicipality(municipality.code);
              hybridData.push(...towns);
            }
            break;
        }
        
        // Zapisz nowe dane do bazy
        if (hybridData.length > 0) {
          for (const location of hybridData) {
            await Location.findOneAndUpdate(
              { code: location.code },
              location,
              { upsert: true, new: true }
            );
          }
          
          // Pobierz zaktualizowane dane z bazy
          locations = await Location.find({ type: type }).limit(100);
        }
      } catch (error) {
        console.error('❌ Błąd podczas pobierania z hybrydowego źródła:', error);
      }
    }

    console.log(`✅ Zwracam ${locations.length} lokalizacji typu ${type}`);
    res.json({ locations });
  } catch (error) {
    console.error('❌ Błąd podczas pobierania lokalizacji:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// 🌍 Geocoding - konwersja adresu na współrzędne
const geocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Adres jest wymagany' });
    }

    console.log(`🌍 Geocoding adresu: ${address}`);
    
    const geocodedData = await hybridService.geocodeAddress(address);
    
    res.json({
      success: true,
      data: geocodedData
    });
  } catch (error) {
    console.error('❌ Błąd podczas geocoding:', error);
    res.status(500).json({ 
      error: 'Błąd podczas geocoding',
      details: error.message 
    });
  }
};

// 🌍 Reverse geocoding - konwersja współrzędnych na adres
const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Szerokość i długość geograficzna są wymagane' });
    }

    console.log(`🌍 Reverse geocoding: ${lat}, ${lon}`);
    
    const addressData = await hybridService.reverseGeocode(lat, lon);
    
    res.json({
      success: true,
      data: addressData
    });
  } catch (error) {
    console.error('❌ Błąd podczas reverse geocoding:', error);
    res.status(500).json({ 
      error: 'Błąd podczas reverse geocoding',
      details: error.message 
    });
  }
};

// 🔍 Wyszukiwanie przedmiotów w określonej odległości
const findItemsNearLocation = async (req, res) => {
  try {
    const { userLocation, items, maxDistance = 50 } = req.body;
    
    if (!userLocation || !items) {
      return res.status(400).json({ error: 'Lokalizacja użytkownika i lista przedmiotów są wymagane' });
    }

    console.log(`🔍 Wyszukiwanie przedmiotów w promieniu ${maxDistance}km`);
    
    const nearbyItems = await hybridService.findItemsNearLocation(userLocation, items, maxDistance);
    
    res.json({
      success: true,
      data: nearbyItems,
      count: nearbyItems.length,
      maxDistance: maxDistance
    });
  } catch (error) {
    console.error('❌ Błąd podczas wyszukiwania przedmiotów:', error);
    res.status(500).json({ 
      error: 'Błąd podczas wyszukiwania przedmiotów',
      details: error.message 
    });
  }
};

// 📍 Wyszukiwanie miejsc w określonej odległości
const findPlacesNearLocation = async (req, res) => {
  try {
    const { userLocation, places, maxDistance = 10 } = req.body;
    
    if (!userLocation || !places) {
      return res.status(400).json({ error: 'Lokalizacja użytkownika i lista miejsc są wymagane' });
    }

    console.log(`📍 Wyszukiwanie miejsc w promieniu ${maxDistance}km`);
    
    const nearbyPlaces = await hybridService.findPlacesNearLocation(userLocation, places, maxDistance);
    
    res.json({
      success: true,
      data: nearbyPlaces,
      count: nearbyPlaces.length,
      maxDistance: maxDistance
    });
  } catch (error) {
    console.error('❌ Błąd podczas wyszukiwania miejsc:', error);
    res.status(500).json({ 
      error: 'Błąd podczas wyszukiwania miejsc',
      details: error.message 
    });
  }
};

// 🎯 Autouzupełnianie adresów
const autocompleteAddress = async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Zapytanie jest wymagane' });
    }

    console.log(`🎯 Autouzupełnianie dla: ${query}`);
    
    const suggestions = await hybridService.autocompleteAddress(query, limit);
    
    res.json({
      success: true,
      data: suggestions,
      count: suggestions.length
    });
  } catch (error) {
    console.error('❌ Błąd podczas autouzupełniania:', error);
    res.status(500).json({ 
      error: 'Błąd podczas autouzupełniania',
      details: error.message 
    });
  }
};

// 📏 Obliczanie odległości między dwoma punktami
const calculateDistance = async (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.body;
    
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return res.status(400).json({ error: 'Wszystkie współrzędne są wymagane' });
    }

    const distance = hybridService.calculateDistance(lat1, lon1, lat2, lon2);
    const distanceText = hybridService.formatDistance(distance);
    
    res.json({
      success: true,
      data: {
        distance: Math.round(distance * 100) / 100,
        distanceText: distanceText,
        coordinates: {
          from: { lat: lat1, lon: lon1 },
          to: { lat: lat2, lon: lon2 }
        }
      }
    });
  } catch (error) {
    console.error('❌ Błąd podczas obliczania odległości:', error);
    res.status(500).json({ 
      error: 'Błąd podczas obliczania odległości',
      details: error.message 
    });
  }
};

// 📊 Statystyki cache
const getCacheStats = async (req, res) => {
  try {
    const stats = hybridService.getCacheStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Błąd podczas pobierania statystyk cache:', error);
    res.status(500).json({ 
      error: 'Błąd podczas pobierania statystyk cache',
      details: error.message 
    });
  }
};

// 🧹 Czyszczenie cache
const clearCache = async (req, res) => {
  try {
    hybridService.clearCache();
    
    res.json({
      success: true,
      message: 'Cache został wyczyszczony'
    });
  } catch (error) {
    console.error('❌ Błąd podczas czyszczenia cache:', error);
    res.status(500).json({ 
      error: 'Błąd podczas czyszczenia cache',
      details: error.message 
    });
  }
};

// 🏛️ Nowe endpointy dla hierarchii administracyjnej

// Pobierz wszystkie województwa
const getVoivodeships = async (req, res) => {
  try {
    const { search, active } = req.query;
    
    // Użyj kolekcji wojewodztwa zamiast locations
    const db = mongoose.connection.db;
    const wojewodztwaCollection = db.collection('wojewodztwa');
    
    let query = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const voivodeships = await wojewodztwaCollection.find(query)
      .project({ name: 1, code: 1, isActive: 1 })
      .sort({ name: 1 })
      .toArray();
    
    // Dodaj liczbę powiatów dla każdego województwa
    const powiatyCollection = db.collection('powiaty');
    const voivodeshipsWithCounts = await Promise.all(
      voivodeships.map(async (voivodeship) => {
        const countiesCount = await powiatyCollection.countDocuments({
          wojewodztwo: voivodeship._id,
          isActive: true
        });
        
        return {
          id: voivodeship._id,
          name: voivodeship.name,
          code: voivodeship.code,
          active: voivodeship.isActive,
          countiesCount
        };
      })
    );
    
    res.json(voivodeshipsWithCounts);
  } catch (error) {
    console.error('Błąd pobierania województw:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz powiaty dla województwa
const getCountiesForVoivodeship = async (req, res) => {
  try {
    const { voivodeshipCode } = req.params;
    const { type, search, active } = req.query;
    
    console.log(`🔍 Pobieranie powiatów dla województwa: ${voivodeshipCode}`);
    
    // Użyj kolekcji powiaty zamiast locations
    const db = mongoose.connection.db;
    const powiatyCollection = db.collection('powiaty');
    
    let query = {
      wojewodztwoCode: voivodeshipCode,
      isActive: true
    };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const counties = await powiatyCollection.find(query)
      .project({ name: 1, code: 1, type: 1, isActive: 1, coordinates: 1 })
      .sort({ name: 1 })
      .toArray();
    
    console.log(`📊 Znaleziono ${counties.length} powiatów`);
    
    // Dodaj liczbę gmin dla każdego powiatu
    const gminyCollection = db.collection('gminy');
    const countiesWithCounts = await Promise.all(
      counties.map(async (county) => {
        const municipalitiesCount = await gminyCollection.countDocuments({
          powiatCode: county.code,
          isActive: true
        });
        
        return {
          id: county._id,
          name: county.name,
          code: county.code,
          type: county.type,
          active: county.isActive,
          municipalitiesCount,
          coordinates: county.coordinates
        };
      })
    );
    
    // Znajdź województwo
    const wojewodztwaCollection = db.collection('wojewodztwa');
    const voivodeship = await wojewodztwaCollection.findOne({
      code: voivodeshipCode,
      isActive: true
    });
    
    res.json({
      voivodeship: voivodeship ? {
        id: voivodeship._id,
        name: voivodeship.name,
        code: voivodeship.code
      } : { code: voivodeshipCode },
      counties: countiesWithCounts
    });
  } catch (error) {
    console.error('Błąd pobierania powiatów:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz miejscowości dla gminy
const getTownsForMunicipality = async (req, res) => {
  try {
    const { municipalityCode } = req.params;
    const { search, active } = req.query;
    
    console.log(`🔍 Pobieranie miejscowości dla gminy: ${municipalityCode}`);
    
    // Użyj kolekcji miejscowosci zamiast locations
    const db = mongoose.connection.db;
    const miejscowosciCollection = db.collection('miejscowosci');
    
    let query = {
      gminaCode: municipalityCode,
      isActive: true
    };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const towns = await miejscowosciCollection.find(query)
      .project({ name: 1, code: 1, type: 1, isActive: 1, population: 1, coordinates: 1 })
      .sort({ name: 1 })
      .toArray();
    
    console.log(`📊 Znaleziono ${towns.length} miejscowości`);
    
    // Znajdź gminę
    const gminyCollection = db.collection('gminy');
    const municipality = await gminyCollection.findOne({
      code: municipalityCode,
      isActive: true
    });
    
    res.json({
      municipality: municipality ? {
        id: municipality._id,
        name: municipality.name,
        code: municipality.code,
        type: municipality.type
      } : { code: municipalityCode },
      towns: towns.map(t => ({
        id: t._id,
        name: t.name,
        code: t.code,
        type: t.type,
        active: t.isActive,
        population: t.population,
        coordinates: t.coordinates
      }))
    });
  } catch (error) {
    console.error('Błąd pobierania miejscowości:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz gminy dla powiatu
const getMunicipalitiesForCounty = async (req, res) => {
  try {
    const { countyCode } = req.params;
    const { type, search, active } = req.query;
    
    console.log(`🔍 Pobieranie gmin dla powiatu: ${countyCode}`);
    
    // Użyj kolekcji gminy zamiast locations
    const db = mongoose.connection.db;
    const gminyCollection = db.collection('gminy');
    
    let query = {
      powiatCode: countyCode,
      isActive: true
    };
    
    if (type && type !== 'all') {
      query.type = type;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const municipalities = await gminyCollection.find(query)
      .project({ name: 1, code: 1, type: 1, isActive: 1, population: 1, area: 1, coordinates: 1 })
      .sort({ name: 1 })
      .toArray();
    
    console.log(`📊 Znaleziono ${municipalities.length} gmin`);
    
    // Znajdź powiat
    const powiatyCollection = db.collection('powiaty');
    const county = await powiatyCollection.findOne({
      code: countyCode,
      isActive: true
    });
    
    res.json({
      county: county ? {
        id: county._id,
        name: county.name,
        code: county.code,
        type: county.type
      } : { code: countyCode },
      municipalities: municipalities.map(m => ({
        id: m._id,
        name: m.name,
        code: m.code,
        type: m.type,
        active: m.isActive,
        population: m.population,
        area: m.area,
        coordinates: m.coordinates
      }))
    });
  } catch (error) {
    console.error('Błąd pobierania gmin:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz analitykę lokalizacji
const getLocationAnalytics = async (req, res) => {
  try {
    // Statystyki ogólne
    const totalLocations = await Location.countDocuments({ isActive: true });
    const activeLocations = await Location.countDocuments({ isActive: true });
    
    // Top 5 największych miast
    const topLocations = await Location.find({
      type: 'miasto',
      population: { $exists: true, $gt: 0 }
    })
    .select('name population type')
    .sort({ population: -1 })
    .limit(5)
    .populate('hierarchy.wojewodztwo', 'name');
    
    // Największe województwo
    const voivodeshipStats = await Location.aggregate([
      { $match: { type: 'województwo', isActive: true } },
      {
        $lookup: {
          from: 'locations',
          localField: '_id',
          foreignField: 'hierarchy.wojewodztwo',
          as: 'counties'
        }
      },
      {
        $project: {
          name: 1,
          countiesCount: { $size: '$counties' }
        }
      },
      { $sort: { countiesCount: -1 } },
      { $limit: 1 }
    ]);
    
    const topVoivodeship = voivodeshipStats[0]?.name || 'Mazowieckie';
    
    // Symulacja danych aktywności
    const activityData = [
      { date: '2024-01-15', count: 12, type: 'Dodano' },
      { date: '2024-01-14', count: 8, type: 'Zaktualizowano' },
      { date: '2024-01-13', count: 15, type: 'Dodano' },
      { date: '2024-01-12', count: 6, type: 'Zaktualizowano' },
      { date: '2024-01-11', count: 10, type: 'Dodano' }
    ];
    
    res.json({
      stats: {
        totalLocations,
        activeLocations,
        totalPopulation: 38168000, // Symulacja
        averagePopulation: 15400, // Symulacja
        topVoivodeship,
        recentActivity: 156 // Symulacja
      },
      topLocations: topLocations.map(location => ({
        name: location.name,
        population: location.population,
        type: location.type,
        voivodeship: location.hierarchy?.wojewodztwo?.name || 'Nieznane'
      })),
      activityData
    });
  } catch (error) {
    console.error('Błąd pobierania analityki:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz lokalizacje wg typu (duplikat - usunięty)

// 🗺️ Pobierz granice administracyjne dla mapy
const getAdministrativeBoundaries = async (req, res) => {
  try {
    const { type, parentCode } = req.query;
    
    let query = { isActive: true };
    
    if (type) {
      query.type = type;
    }
    
    if (parentCode) {
      // Dla powiatów w województwie
      if (type === 'powiat' || type === 'miasto na prawach powiatu') {
        query.code = { $regex: `^${parentCode}` };
      }
      // Dla gmin w powiecie
      else if (type === 'gmina') {
        query.code = { $regex: `^${parentCode}` };
      }
      // Dla miejscowości w gminie
      else if (type === 'miejscowość') {
        query.code = { $regex: `^${parentCode}` };
      }
    }
    
    const locations = await Location.find(query)
      .select('name code type coordinates population')
      .sort({ name: 1 });
    
    // Przygotuj dane dla mapy
    const boundaries = locations.map(location => ({
      id: location._id,
      name: location.name,
      code: location.code,
      type: location.type,
      coordinates: location.coordinates || { lat: 52.2297, lng: 21.0122 }, // Domyślne dla Warszawy
      population: location.population || 0,
      // Symulowane granice (w rzeczywistości pobierałoby się z GeoJSON)
      bounds: {
        north: (location.coordinates?.lat || 52.2297) + 0.1,
        south: (location.coordinates?.lat || 52.2297) - 0.1,
        east: (location.coordinates?.lng || 21.0122) + 0.1,
        west: (location.coordinates?.lng || 21.0122) - 0.1
      }
    }));
    
    res.json({
      success: true,
      boundaries,
      count: boundaries.length
    });
  } catch (error) {
    console.error('Błąd pobierania granic administracyjnych:', error);
    res.status(500).json({ 
      error: 'Błąd pobierania granic administracyjnych',
      details: error.message 
    });
  }
};

// 🗺️ Pobierz szczegóły lokalizacji po współrzędnych
const getLocationByCoordinates = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Współrzędne są wymagane' });
    }
    
    // W rzeczywistości używałoby się geospatial queries
    // Na razie symulujemy znalezienie lokalizacji
    const mockLocation = {
      id: 'mock_location',
      name: 'Warszawa',
      type: 'miejscowość',
      code: '146501',
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      hierarchy: {
        wojewodztwo: { name: 'Mazowieckie', code: '14' },
        powiat: { name: 'Warszawa', code: '1465' },
        gmina: { name: 'Warszawa', code: '146501' }
      }
    };
    
    res.json({
      success: true,
      location: mockLocation
    });
  } catch (error) {
    console.error('Błąd pobierania lokalizacji po współrzędnych:', error);
    res.status(500).json({ 
      error: 'Błąd pobierania lokalizacji',
      details: error.message 
    });
  }
};

// Pobierz sklepy dla lokalizacji
const getLocationShops = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { page = 1, limit = 20, search, category, sort = 'name' } = req.query;
    
    // Znajdź lokalizację - obsługuj zarówno ObjectId jak i kod TERYT
    let location;
    if (locationId.match(/^[0-9a-fA-F]{24}$/)) {
      // To jest ObjectId
      location = await Location.findById(locationId);
    } else {
      // To jest kod TERYT
      location = await Location.findOne({ code: locationId });
    }
    
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
    }
    
    const Shop = require('../models/shopModel');
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { isActive: true };
    
    // Filtruj według lokalizacji
    if (location.type === 'województwo') {
      query['address.voivodeship'] = location.name;
    } else if (location.type === 'powiat') {
      query['address.county'] = location.name;
    } else if (location.type === 'gmina') {
      query['address.municipality'] = location.name;
    } else if (location.type === 'miejscowość' || location.type === 'miasto') {
      query['address.city'] = location.name;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    let sortQuery = {};
    switch (sort) {
      case 'name':
        sortQuery.name = 1;
        break;
      case 'rating':
        sortQuery['ratings.average'] = -1;
        break;
      case 'newest':
        sortQuery.createdAt = -1;
        break;
      case 'oldest':
        sortQuery.createdAt = 1;
        break;
      default:
        sortQuery.name = 1;
    }
    
    const shops = await Shop.find(query)
      .populate('owner', 'username email')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Shop.countDocuments(query);
    
    res.json({
      location: {
        id: location._id,
        name: location.name,
        type: location.type,
        code: location.code
      },
      shops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Błąd pobierania sklepów dla lokalizacji:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz firmy dla lokalizacji
const getLocationCompanies = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { page = 1, limit = 20, search, industry, sort = 'name' } = req.query;
    
    // Znajdź lokalizację - obsługuj zarówno ObjectId jak i kod TERYT
    let location;
    if (locationId.match(/^[0-9a-fA-F]{24}$/)) {
      // To jest ObjectId
      location = await Location.findById(locationId);
    } else {
      // To jest kod TERYT
      location = await Location.findOne({ code: locationId });
    }
    
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
    }
    
    const CompanyProfile = require('../models/companyProfileModel');
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { isActive: true };
    
    // Filtruj według lokalizacji
    if (location.type === 'województwo') {
      query['address.voivodeship'] = location.name;
    } else if (location.type === 'powiat') {
      query['address.county'] = location.name;
    } else if (location.type === 'gmina') {
      query['address.municipality'] = location.name;
    } else if (location.type === 'miejscowość' || location.type === 'miasto') {
      query['address.city'] = location.name;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (industry) {
      query.industry = industry;
    }
    
    let sortQuery = {};
    switch (sort) {
      case 'name':
        sortQuery.name = 1;
        break;
      case 'rating':
        sortQuery['stats.averageRating'] = -1;
        break;
      case 'newest':
        sortQuery.createdAt = -1;
        break;
      case 'oldest':
        sortQuery.createdAt = 1;
        break;
      default:
        sortQuery.name = 1;
    }
    
    const companies = await CompanyProfile.find(query)
      .populate('owner', 'username email')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await CompanyProfile.countDocuments(query);
    
    res.json({
      location: {
        id: location._id,
        name: location.name,
        type: location.type,
        code: location.code
      },
      companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Błąd pobierania firm dla lokalizacji:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz statystyki lokalizacji (sklepy, firmy, produkty)
const getLocationStats = async (req, res) => {
  try {
    const { locationId } = req.params;
    
    // Znajdź lokalizację - obsługuj zarówno ObjectId jak i kod TERYT
    let location;
    if (locationId.match(/^[0-9a-fA-F]{24}$/)) {
      // To jest ObjectId
      location = await Location.findById(locationId);
    } else {
      // To jest kod TERYT
      location = await Location.findOne({ code: locationId });
    }
    
    if (!location) {
      return res.status(404).json({ error: 'Lokalizacja nie znaleziona' });
    }
    
    const Shop = require('../models/shopModel');
    const CompanyProfile = require('../models/companyProfileModel');
    const Product = require('../models/productModel');
    
    let locationQuery = {};
    
    // Filtruj według lokalizacji
    if (location.type === 'województwo') {
      locationQuery['address.voivodeship'] = location.name;
    } else if (location.type === 'powiat') {
      locationQuery['address.county'] = location.name;
    } else if (location.type === 'gmina') {
      locationQuery['address.municipality'] = location.name;
    } else if (location.type === 'miejscowość' || location.type === 'miasto') {
      locationQuery['address.city'] = location.name;
    }
    
    // Pobierz statystyki sklepów
    const shopsStats = await Shop.aggregate([
      { $match: { ...locationQuery, isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          avgRating: { $avg: '$ratings.average' },
          totalProducts: { $sum: '$stats.totalProducts' },
          totalSales: { $sum: '$stats.totalSales' }
        }
      }
    ]);
    
    // Pobierz statystyki firm
    const companiesStats = await CompanyProfile.aggregate([
      { $match: { ...locationQuery, isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgRating: { $avg: '$stats.averageRating' },
          totalViews: { $sum: '$stats.profileViews' },
          totalFollowers: { $sum: '$stats.followers' }
        }
      }
    ]);
    
    // Pobierz statystyki produktów
    const productsStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'shops',
          localField: 'shop',
          foreignField: '_id',
          as: 'shopInfo'
        }
      },
      { $unwind: '$shopInfo' },
      { $match: { 'shopInfo.isActive': true, ...locationQuery } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
          categories: { $addToSet: '$category' }
        }
      }
    ]);
    
    // Pobierz top kategorie
    const topCategories = await Shop.aggregate([
      { $match: { ...locationQuery, isActive: true } },
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      location: {
        id: location._id,
        name: location.name,
        type: location.type,
        code: location.code
      },
      stats: {
        shops: shopsStats[0] || { total: 0, verified: 0, avgRating: 0, totalProducts: 0, totalSales: 0 },
        companies: companiesStats[0] || { total: 0, avgRating: 0, totalViews: 0, totalFollowers: 0 },
        products: productsStats[0] || { total: 0, avgPrice: 0, totalStock: 0, categories: [] },
        topCategories
      }
    });
  } catch (error) {
    console.error('Błąd pobierania statystyk lokalizacji:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz konkretne województwo według kodu GUS
const getVoivodeshipByCode = async (req, res) => {
  try {
    const { voivodeshipCode } = req.params;
    
    // Znajdź województwo według kodu GUS
    const voivodeship = await Location.findOne({
      type: 'województwo',
      code: voivodeshipCode,
      isActive: true
    });
    
    if (!voivodeship) {
      return res.status(404).json({ 
        error: 'Województwo nie zostało znalezione',
        code: voivodeshipCode 
      });
    }
    
    // Pobierz statystyki dla województwa
    const stats = await getLocationStatsHelper(voivodeship._id);
    
    res.json({
      voivodeship: {
        id: voivodeship._id,
        name: voivodeship.name,
        code: voivodeship.code,
        type: voivodeship.type,
        stats: stats
      }
    });
  } catch (err) {
    console.error('Błąd pobierania województwa:', err);
    res.status(500).json({ error: err.message });
  }
};

// Pobierz konkretny powiat według kodu GUS
const getCountyByCode = async (req, res) => {
  try {
    const { countyCode } = req.params;
    
    console.log('🔍 Szukam powiatu z kodem:', countyCode);
    console.log('🔍 Model Powiat:', Powiat);
    
    // Sprawdź wszystkie powiaty z kodem zaczynającym się na 02
    const allCounties = await Powiat.find({ code: { $regex: '^02' } });
    console.log('🔍 Wszystkie powiaty z kodem 02:', allCounties.map(c => ({ name: c.name, code: c.code })));
    
    // Znajdź powiat według kodu GUS w kolekcji powiaty
    const county = await Powiat.findOne({
      code: countyCode
    });
    
    console.log('🔍 Znaleziony powiat:', county);
    
    if (!county) {
      return res.status(404).json({ 
        error: 'Powiat nie został znaleziony',
        code: countyCode 
      });
    }
    
    // Pobierz statystyki dla powiatu (tymczasowo puste)
    const stats = {
      totalUsers: 0,
      totalShops: 0,
      totalProducts: 0,
      totalPosts: 0
    };
    
    res.json({
      county: {
        id: county._id,
        name: county.name,
        code: county.code,
        type: county.type,
        stats: stats
      }
    });
  } catch (err) {
    console.error('Błąd pobierania powiatu:', err);
    res.status(500).json({ error: err.message });
  }
};

// Pobierz konkretną gminę według kodu GUS
const getMunicipalityByCode = async (req, res) => {
  try {
    const { municipalityCode } = req.params;
    
    console.log('🔍 Szukam gminy z kodem:', municipalityCode);
    
    // Znajdź gminę według kodu GUS w kolekcji gminy
    const municipality = await Gmina.findOne({
      code: municipalityCode,
      isActive: true
    });
    
    console.log('🔍 Znaleziona gmina:', municipality);
    
    if (!municipality) {
      return res.status(404).json({ 
        error: 'Gmina nie została znaleziona',
        code: municipalityCode 
      });
    }
    
    // Pobierz statystyki dla gminy (tymczasowo puste)
    const stats = {
      totalUsers: 0,
      totalShops: 0,
      totalProducts: 0,
      totalPosts: 0
    };
    
    res.json({
      municipality: {
        id: municipality._id,
        name: municipality.name,
        code: municipality.code,
        type: municipality.type,
        stats: stats
      }
    });
  } catch (err) {
    console.error('Błąd pobierania gminy:', err);
    res.status(500).json({ error: err.message });
  }
};

// Pobierz konkretne miasto/miejscowość według kodu GUS
const getCityByCode = async (req, res) => {
  try {
    const { cityCode } = req.params;
    
    console.log('🔍 Szukam miasta z kodem:', cityCode);
    
    // Znajdź miasto/miejscowość według kodu GUS w kolekcji miejscowosci
    const city = await Miejscowosc.findOne({
      code: cityCode,
      isActive: true
    });
    
    console.log('🔍 Znalezione miasto:', city);
    
    if (!city) {
      return res.status(404).json({ 
        error: 'Miasto/miejscowość nie zostało znalezione',
        code: cityCode 
      });
    }
    
    // Pobierz statystyki dla miasta (tymczasowo puste)
    const stats = {
      totalUsers: 0,
      totalShops: 0,
      totalProducts: 0,
      totalPosts: 0
    };
    
    res.json({
      city: {
        id: city._id,
        name: city.name,
        code: city.code,
        type: city.type,
        stats: stats
      }
    });
  } catch (err) {
    console.error('Błąd pobierania miasta:', err);
    res.status(500).json({ error: err.message });
  }
};

// Funkcja pomocnicza do pobierania statystyk lokalizacji
const getLocationStatsHelper = async (locationId) => {
  try {
    const userCount = await User.countDocuments({ location: locationId });
    const shopCount = await Shop.countDocuments({ location: locationId });
    const productCount = await Product.countDocuments({ 
      shop: { $in: await Shop.find({ location: locationId }).select('_id') }
    });
    const postCount = await Post.countDocuments({ 
      author: { $in: await User.find({ location: locationId }).select('_id') }
    });
    
    return {
      totalUsers: userCount,
      totalShops: shopCount,
      totalProducts: productCount,
      totalPosts: postCount
    };
  } catch (error) {
    console.error('Błąd pobierania statystyk:', error);
    return {
      totalUsers: 0,
      totalShops: 0,
      totalProducts: 0,
      totalPosts: 0
    };
  }
};

module.exports = {
  getLocation,
  getLocations,
  getLocationsByType,
  geocodeAddress,
  reverseGeocode,
  findItemsNearLocation,
  findPlacesNearLocation,
  autocompleteAddress,
  calculateDistance,
  getCacheStats,
  clearCache,
  getVoivodeships,
  getCountiesForVoivodeship,
  getMunicipalitiesForCounty,
  getTownsForMunicipality,
  getLocationAnalytics,
  getAdministrativeBoundaries,
  getLocationByCoordinates,
  getLocationShops,
  getLocationCompanies,
  getLocationStats,
  getVoivodeshipByCode,
  getCountyByCode,
  getMunicipalityByCode,
  getCityByCode
}; 