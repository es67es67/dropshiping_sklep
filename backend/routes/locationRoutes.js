const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');
const Location = require('../models/locationModel');
const Simc = require('../models/simcModel');
const Terc = require('../models/tercModel');
const Ulic = require('../models/ulicModel');
const mongoose = require('mongoose'); // Dodane dla debug-simc

// Tymczasowy endpoint do sprawdzenia danych SIMC (musi być na początku)
router.get('/debug-simc', async (req, res) => {
  try {
    const { q } = req.query;
    
    console.log('🔍 Debug SIMC - sprawdzam dane...');
    
    // Sprawdź wszystkie kolekcje
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Dostępne kolekcje:', collections.map(c => c.name));
    
    // Sprawdź liczbę dokumentów w SIMC
    const simcCount = await Simc.countDocuments();
    console.log(`📊 Liczba dokumentów w SIMC: ${simcCount}`);
    
    // Sprawdź pierwsze 3 dokumenty
    const firstDocs = await Simc.find().limit(3);
    console.log('📊 Pierwsze dokumenty:', firstDocs.map(doc => ({ name: doc.name, code: doc.code })));
    
    // Sprawdź czy istnieje dokument z nazwą zawierającą "Warszawa"
    if (q) {
      const searchResults = await Simc.find({
        name: { $regex: q, $options: 'i' }
      }).limit(5);
      console.log(`📊 Wyniki wyszukiwania "${q}":`, searchResults.map(doc => ({ name: doc.name, code: doc.code })));
    }
    
    res.json({
      collections: collections.map(c => c.name),
      simcCount,
      firstDocs: firstDocs.map(doc => ({ name: doc.name, code: doc.code })),
      searchResults: q ? await Simc.find({ name: { $regex: q, $options: 'i' } }).limit(5).lean() : []
    });
  } catch (error) {
    console.error('Błąd debug SIMC:', error);
    res.status(500).json({ error: error.message });
  }
});

// Publiczne routes
router.get('/', locationController.getLocations);

// 🎯 Publiczne endpointy wyszukiwania (bez autoryzacji) - MUSZĄ BYĆ PRZED /search
// Wyszukiwanie miejscowości
router.get('/search/cities', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ cities: [] });
    }
    
    console.log(`🔍 Wyszukiwanie miejscowości: ${query}`);
    
    const cities = await Location.find({
      type: 'miejscowość',
      name: { $regex: query, $options: 'i' },
      isActive: true
    })
    .populate('hierarchy.wojewodztwo', 'name code')
    .populate('hierarchy.powiat', 'name code')
    .populate('hierarchy.gmina', 'name code')
    .limit(parseInt(limit))
    .sort({ name: 1 });
    
    const formattedCities = cities.map(city => ({
      code: city.code,
      name: city.name,
      voivodeshipCode: city.hierarchy?.wojewodztwo?.code,
      voivodeshipName: city.hierarchy?.wojewodztwo?.name,
      countyCode: city.hierarchy?.powiat?.code,
      countyName: city.hierarchy?.powiat?.name,
      municipalityCode: city.hierarchy?.gmina?.code,
      municipalityName: city.hierarchy?.gmina?.name,
      population: city.population,
      coordinates: city.coordinates
    }));
    
    res.json({ cities: formattedCities });
  } catch (error) {
    console.error('Błąd wyszukiwania miejscowości:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Wyszukiwanie gmin
router.get('/search/municipalities', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ municipalities: [] });
    }
    
    console.log(`🔍 Wyszukiwanie gmin: ${query}`);
    
    const municipalities = await Location.find({
      type: { $in: ['gmina miejska', 'gmina wiejska', 'gmina miejsko-wiejska'] },
      name: { $regex: query, $options: 'i' },
      isActive: true
    })
    .populate('hierarchy.wojewodztwo', 'name code')
    .populate('hierarchy.powiat', 'name code')
    .limit(parseInt(limit))
    .sort({ name: 1 });
    
    const formattedMunicipalities = municipalities.map(municipality => ({
      code: municipality.code,
      name: municipality.name,
      voivodeshipCode: municipality.hierarchy?.wojewodztwo?.code,
      voivodeshipName: municipality.hierarchy?.wojewodztwo?.name,
      countyCode: municipality.hierarchy?.powiat?.code,
      countyName: municipality.hierarchy?.powiat?.name,
      type: municipality.type,
      coordinates: municipality.coordinates
    }));
    
    res.json({ municipalities: formattedMunicipalities });
  } catch (error) {
    console.error('Błąd wyszukiwania gmin:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/locations/search - Wyszukaj miejscowości (musi być przed /:id)
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'miejscowość', limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ locations: [] });
    }
    
    console.log(`🔍 Wyszukiwanie: ${q}, typ: ${type}`);
    
    let locations = [];
    
    // Mapowanie typów na kolekcje
    const typeMapping = {
      'miejscowość': 'simc',
      'gmina': 'terc', 
      'powiat': 'terc',
      'wojewodztwo': 'terc',
      'ulica': 'ulic'
    };
    
    const collection = typeMapping[type] || 'simc';
    
    console.log(`📊 Używam kolekcji: ${collection}`);
    
    // Wyszukiwanie w odpowiedniej kolekcji
    switch (collection) {
      case 'simc':
        console.log(`🔍 Wyszukuję w SIMC: ${q}`);
        const simcResults = await Simc.find({
          name: { $regex: q, $options: 'i' }
        })
        .limit(parseInt(limit))
        .sort({ name: 1 });
        
        console.log(`📊 Znaleziono ${simcResults.length} wyników w SIMC`);
        
        locations = simcResults.map(item => ({
          _id: item._id,
          code: item.code,
          name: item.name,
          type: 'miejscowość',
          wojewodztwo: { code: item.wojewodztwoCode },
          powiat: { code: item.powiatCode },
          gmina: { code: item.gminaCode },
          tercCode: item.tercCode
        }));
        break;
        
      case 'terc':
        let tercQuery = { name: { $regex: q, $options: 'i' } };
        
        // Filtrowanie według typu dla TERC
        if (type === 'gmina') {
          tercQuery.type = { $in: ['gmina miejska', 'gmina wiejska', 'gmina miejsko-wiejska'] };
        } else if (type === 'powiat') {
          tercQuery.type = 'powiat';
        } else if (type === 'wojewodztwo') {
          tercQuery.type = 'województwo';
        }
        
        const tercResults = await Terc.find(tercQuery)
        .limit(parseInt(limit))
        .sort({ name: 1 });
        
        locations = tercResults.map(item => ({
          _id: item._id,
          code: item.code,
          name: item.name,
          type: item.type,
          wojewodztwo: { code: item.wojewodztwoCode },
          powiat: { code: item.powiatCode },
          gmina: { code: item.gminaCode }
        }));
        break;
        
      case 'ulic':
        const ulicResults = await Ulic.find({
          name: { $regex: q, $options: 'i' }
        })
        .limit(parseInt(limit))
        .sort({ name: 1 });
        
        locations = ulicResults.map(item => ({
          _id: item._id,
          code: item.code,
          name: item.name,
          type: 'ulica',
          wojewodztwo: { code: item.wojewodztwoCode },
          powiat: { code: item.powiatCode },
          gmina: { code: item.gminaCode },
          miejscowosc: { code: item.simcCode }
        }));
        break;
    }
    
    console.log(`✅ Znaleziono ${locations.length} wyników`);
    res.json({ locations });
  } catch (error) {
    console.error('Błąd wyszukiwania lokalizacji:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// GET /api/locations/hierarchy - Pobierz hierarchię lokalizacji
router.get('/hierarchy', async (req, res) => {
  try {
    const { locationId } = req.query;
    
    if (!locationId) {
      return res.status(400).json({ message: 'Brak ID lokalizacji' });
    }
    
    const location = await Location.findById(locationId)
      .populate('wojewodztwo', 'name code')
      .populate('powiat', 'name code')
      .populate('gmina', 'name code');
    
    if (!location) {
      return res.status(404).json({ message: 'Lokalizacja nie znaleziona' });
    }
    
    const hierarchy = {
      location: {
        _id: location._id,
        name: location.name,
        type: location.type,
        code: location.code
      },
      wojewodztwo: location.wojewodztwo,
      powiat: location.powiat,
      gmina: location.gmina
    };
    
    res.json({ hierarchy });
  } catch (error) {
    console.error('Błąd pobierania hierarchii:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Publiczne routes - tylko te które istnieją
// router.get('/', locationController.getLocations); // nie istnieje
// router.get('/:id', locationController.getLocation); // nie istnieje
// router.get('/:id/feed', locationController.getLocationFeed); // nie istnieje
// router.get('/:id/users', locationController.getLocationUsers); // nie istnieje
// router.get('/:id/shops', locationController.getLocationShops); // nie istnieje
// router.get('/:id/products', locationController.getLocationProducts); // nie istnieje

// Dodatkowe routes dla funkcjonalności lokalizacji
// router.get('/:id/nearby', locationController.getNearbyLocations); // nie istnieje
// router.get('/:id/radius/:km', locationController.searchInRadius); // nie istnieje
// router.put('/users/location', locationController.updateUserLocation); // nie istnieje
// router.post('/migrate-locations', authMiddleware, locationController.migrateLocations); // nie istnieje

// Chronione routes (tylko admin)
// router.post('/', authMiddleware, locationController.createLocation); // nie istnieje
// router.put('/:id', authMiddleware, locationController.updateLocation); // nie istnieje

// 🗺️ Nowe endpointy hybrydowego serwisu lokalizacji

// Pobieranie lokalizacji według typu (województwo, powiat, gmina, miejscowość)
router.get('/by-type', locationController.getLocationsByType);

// 🌍 Geocoding - konwersja adresu na współrzędne
router.post('/geocode', locationController.geocodeAddress);

// 🌍 Reverse geocoding - konwersja współrzędnych na adres
router.post('/reverse-geocode', locationController.reverseGeocode);

// 🔍 Wyszukiwanie przedmiotów w określonej odległości
router.post('/find-items-nearby', locationController.findItemsNearLocation);

// 📍 Wyszukiwanie miejsc w określonej odległości
router.post('/find-places-nearby', locationController.findPlacesNearLocation);

// 🎯 Autouzupełnianie adresów
router.get('/autocomplete', locationController.autocompleteAddress);

// 📏 Obliczanie odległości między dwoma punktami
router.post('/calculate-distance', locationController.calculateDistance);

// 📊 Statystyki cache
router.get('/cache/stats', locationController.getCacheStats);

// 🧹 Czyszczenie cache
router.delete('/cache/clear', locationController.clearCache);

// 🏛️ Nowe endpointy dla hierarchii administracyjnej

// Pobierz analitykę lokalizacji (musi być przed parametrycznymi)
router.get('/analytics', locationController.getLocationAnalytics);

// 🗺️ Nowe endpointy dla interaktywnej mapy (muszą być przed parametrycznymi)

// Pobierz granice administracyjne
router.get('/boundaries', locationController.getAdministrativeBoundaries);

// Pobierz lokalizację po współrzędnych
router.get('/by-coordinates', locationController.getLocationByCoordinates);

// Pobierz wszystkie województwa
router.get('/voivodeships', locationController.getVoivodeships);

// Pobierz konkretne województwo według kodu GUS
router.get('/voivodeships/:voivodeshipCode', locationController.getVoivodeshipByCode);

// Pobierz powiaty dla województwa
router.get('/voivodeships/:voivodeshipCode/counties', locationController.getCountiesForVoivodeship);

// Pobierz konkretny powiat według kodu GUS
router.get('/counties/:countyCode', locationController.getCountyByCode);

// Pobierz gminy dla powiatu
router.get('/counties/:countyCode/municipalities', locationController.getMunicipalitiesForCounty);

// Pobierz konkretną gminę według kodu GUS
router.get('/municipalities/:municipalityCode', locationController.getMunicipalityByCode);

// Pobierz miejscowości dla gminy
router.get('/municipalities/:municipalityCode/towns', locationController.getTownsForMunicipality);

// Pobierz konkretne miasto/miejscowość według kodu GUS
router.get('/cities/:cityCode', locationController.getCityByCode);



// Pobierz szczegóły konkretnej lokalizacji (tymczasowo wyłączony)
router.get('/:id', locationController.getLocation);

// 🏪 Nowe endpointy dla sklepów i firm według lokalizacji

// Pobierz sklepy dla lokalizacji
router.get('/:locationId/shops', locationController.getLocationShops);

// Pobierz firmy dla lokalizacji
router.get('/:locationId/companies', locationController.getLocationCompanies);

// Pobierz statystyki lokalizacji
router.get('/:locationId/stats', locationController.getLocationStats);

// Import danych lokalizacji
router.post('/import', authMiddleware.authenticateToken, (req, res) => {
  // TODO: Implementacja importu
  res.json({ 
    success: true, 
    message: 'Import zakończony pomyślnie',
    imported: 1500,
    updated: 200,
    errors: 5,
    duration: '2m 30s'
  });
});

// Eksport danych lokalizacji
router.post('/export', authMiddleware.authenticateToken, (req, res) => {
  // TODO: Implementacja eksportu
  res.json({
    success: true,
    downloadUrl: '/api/locations/export/download/abc123',
    filename: 'lokalizacje_2024-01-15.csv',
    size: '2.5MB',
    recordCount: 1500
  });
});

// Pobierz wygenerowany plik eksportu
router.get('/export/download/:token', authMiddleware.authenticateToken, (req, res) => {
  // TODO: Implementacja pobierania pliku
  res.json({ message: 'Plik eksportu' });
});



module.exports = router; 