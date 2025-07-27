const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔴 SHARED API ROUTES: /api/users
// Zależności: MongoDB users collection, JWT tokens, bcrypt
// Wpływ: WSZYSTKIE komponenty wymagające autoryzacji (45+ komponentów)
// Jeśli się zepsuje: cała autoryzacja nie działa
// Używane w: AuthContext, Login, Register, Profile, Settings, Navbar, etc.

// Publiczne trasy (bez autoryzacji)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Publiczne endpointy (bez autoryzacji)
router.get('/search', userController.searchUsers);
router.get('/public/:id', userController.getUserById);

// Trasy wymagające autoryzacji - używamy middleware tylko dla konkretnych tras
router.get('/profile', authMiddleware.authenticateToken, userController.getProfile);
router.put('/profile', authMiddleware.authenticateToken, userController.updateProfile);

// Endpoint do aktualizacji lokalizacji użytkownika
router.put('/location', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { location, teryt, address } = req.body;
    const userId = req.user.id;

    const result = await userController.updateUserLocation(userId, { location, teryt, address });
    res.json(result);
  } catch (error) {
    console.error('Błąd aktualizacji lokalizacji:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do pobierania powiatów dla województwa
router.get('/locations/counties', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { voivodeship } = req.query;
    
    if (!voivodeship) {
      return res.status(400).json({ error: 'Kod województwa jest wymagany' });
    }

    const counties = await userController.getCountiesByVoivodeship(voivodeship);
    res.json({ counties });
  } catch (error) {
    console.error('Błąd pobierania powiatów:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do pobierania gmin dla powiatu
router.get('/locations/municipalities', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { county } = req.query;
    
    if (!county) {
      return res.status(400).json({ error: 'Kod powiatu jest wymagany' });
    }

    const municipalities = await userController.getMunicipalitiesByCounty(county);
    res.json({ municipalities });
  } catch (error) {
    console.error('Błąd pobierania gmin:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do pobierania miejscowości dla gminy
router.get('/locations/cities', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { municipality } = req.query;
    
    if (!municipality) {
      return res.status(400).json({ error: 'Kod gminy jest wymagany' });
    }

    const cities = await userController.getCitiesByMunicipality(municipality);
    res.json({ cities });
  } catch (error) {
    console.error('Błąd pobierania miejscowości:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do wyszukiwania miejscowości
router.get('/locations/search/cities', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Zapytanie musi mieć co najmniej 2 znaki' });
    }

    const cities = await userController.searchCities(query, parseInt(limit));
    res.json({ cities });
  } catch (error) {
    console.error('Błąd wyszukiwania miejscowości:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do wyszukiwania gmin
router.get('/locations/search/municipalities', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Zapytanie musi mieć co najmniej 2 znaki' });
    }

    const municipalities = await userController.searchMunicipalities(query, parseInt(limit));
    res.json({ municipalities });
  } catch (error) {
    console.error('Błąd wyszukiwania gmin:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do wyszukiwania powiatów
router.get('/locations/search/counties', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Zapytanie musi mieć co najmniej 2 znaki' });
    }

    const counties = await userController.searchCounties(query, parseInt(limit));
    res.json({ counties });
  } catch (error) {
    console.error('Błąd wyszukiwania powiatów:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do wyszukiwania województw
router.get('/locations/search/voivodeships', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Zapytanie musi mieć co najmniej 2 znaki' });
    }

    const voivodeships = await userController.searchVoivodeships(query, parseInt(limit));
    res.json({ voivodeships });
  } catch (error) {
    console.error('Błąd wyszukiwania województw:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint do pobierania pełnych danych lokalizacyjnych dla miejscowości
router.get('/locations/city/:cityCode', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const { cityCode } = req.params;
    
    if (!cityCode) {
      return res.status(400).json({ error: 'Kod miejscowości jest wymagany' });
    }

    const locationData = await userController.getLocationDataByCity(cityCode);
    res.json({ locationData });
  } catch (error) {
    console.error('Błąd pobierania danych lokalizacyjnych:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', userController.getUsers);
router.get('/search/teryt', userController.searchUsersByTeryt);
router.get('/radius', userController.getUsersInRadius);

module.exports = router;
