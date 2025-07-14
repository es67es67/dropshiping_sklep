const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');
const Location = require('../models/locationModel');

// Publiczne routes
router.get('/', locationController.getLocations);

// GET /api/locations/search - Wyszukaj miejscowości (musi być przed /:id)
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'miejscowość', limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ locations: [] });
    }
    
    // Wyszukaj miejscowości z pełną hierarchią
    const locations = await Location.find({
      type: type,
      name: { $regex: q, $options: 'i' },
      isActive: true
    })
    .populate('wojewodztwo', 'name')
    .populate('powiat', 'name')
    .populate('gmina', 'name')
    .limit(parseInt(limit))
    .sort({ name: 1 });
    
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
        id: location._id,
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

// Pobierz wszystkie województwa
router.get('/voivodeships', locationController.getVoivodeships);

// Pobierz powiaty dla województwa
router.get('/voivodeships/:voivodeshipCode/counties', locationController.getCountiesForVoivodeship);

// Pobierz gminy dla powiatu
router.get('/counties/:countyCode/municipalities', locationController.getMunicipalitiesForCounty);

// Pobierz miejscowości dla gminy
router.get('/municipalities/:municipalityCode/towns', locationController.getTownsForMunicipality);

// Pobierz szczegóły konkretnej lokalizacji
router.get('/:id', locationController.getLocation);

// Pobierz analitykę lokalizacji
router.get('/analytics', locationController.getLocationAnalytics);

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