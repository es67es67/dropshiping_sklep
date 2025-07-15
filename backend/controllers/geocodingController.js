const Location = require('../models/locationModel');
const Shop = require('../models/shopModel');
const User = require('../models/userModel');
const CompanyProfile = require('../models/companyProfileModel');

// Geocoding - konwersja adresu na współrzędne
exports.geocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Adres jest wymagany' });
    }

    console.log(`🌍 Geocoding adresu: ${address}`);
    
    // W rzeczywistości używałoby się Google Maps Geocoding API
    // Na razie symulujemy odpowiedź
    const mockGeocodedData = {
      address: address,
      coordinates: {
        lat: 52.2297 + (Math.random() - 0.5) * 0.1, // Losowe współrzędne w okolicach Warszawy
        lng: 21.0122 + (Math.random() - 0.5) * 0.1
      },
      formattedAddress: address,
      components: {
        street: 'Przykładowa',
        houseNumber: '1',
        postalCode: '00-001',
        city: 'Warszawa',
        voivodeship: 'Mazowieckie'
      }
    };
    
    res.json({
      success: true,
      data: mockGeocodedData
    });
  } catch (error) {
    console.error('❌ Błąd podczas geocoding:', error);
    res.status(500).json({ 
      error: 'Błąd podczas geocoding',
      details: error.message 
    });
  }
};

// Reverse geocoding - konwersja współrzędnych na adres
exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Szerokość i długość geograficzna są wymagane' });
    }

    console.log(`🌍 Reverse geocoding: ${lat}, ${lng}`);
    
    // W rzeczywistości używałoby się Google Maps Reverse Geocoding API
    // Na razie symulujemy odpowiedź
    const mockAddressData = {
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      address: 'ul. Przykładowa 1, 00-001 Warszawa, Mazowieckie',
      components: {
        street: 'Przykładowa',
        houseNumber: '1',
        postalCode: '00-001',
        city: 'Warszawa',
        voivodeship: 'Mazowieckie'
      }
    };
    
    res.json({
      success: true,
      data: mockAddressData
    });
  } catch (error) {
    console.error('❌ Błąd podczas reverse geocoding:', error);
    res.status(500).json({ 
      error: 'Błąd podczas reverse geocoding',
      details: error.message 
    });
  }
};

// Mapowanie współrzędnych na kody TERYT
exports.coordinatesToTeryt = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Współrzędne są wymagane' });
    }

    console.log(`🗺️ Mapowanie współrzędnych na TERYT: ${lat}, ${lng}`);
    
    // W rzeczywistości używałoby się bazy danych z kodami TERYT i współrzędnymi
    // Na razie symulujemy odpowiedź na podstawie lokalizacji w bazie
    const mockTerytData = {
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      teryt: {
        voivodeshipCode: '14',
        countyCode: '1401',
        municipalityCode: '140101',
        tercCode: '140101',
        simcCode: '0918123',
        ulicCode: '12345',
        fullCode: '140101091812312345'
      },
      location: {
        name: 'Warszawa',
        type: 'miejscowość',
        hierarchy: {
          wojewodztwo: { name: 'Mazowieckie', code: '14' },
          powiat: { name: 'Warszawa', code: '1401' },
          gmina: { name: 'Warszawa', code: '140101' }
        }
      }
    };
    
    res.json({
      success: true,
      data: mockTerytData
    });
  } catch (error) {
    console.error('❌ Błąd podczas mapowania współrzędnych na TERYT:', error);
    res.status(500).json({ 
      error: 'Błąd podczas mapowania współrzędnych na TERYT',
      details: error.message 
    });
  }
};

// Mapowanie kodów TERYT na współrzędne
exports.terytToCoordinates = async (req, res) => {
  try {
    const { 
      tercCode, 
      simcCode, 
      ulicCode, 
      fullCode 
    } = req.query;
    
    if (!tercCode && !fullCode) {
      return res.status(400).json({ error: 'Kod TERC lub pełny kod jest wymagany' });
    }

    console.log(`🗺️ Mapowanie TERYT na współrzędne: ${tercCode || fullCode}`);
    
    // W rzeczywistości używałoby się bazy danych z kodami TERYT i współrzędnymi
    // Na razie symulujemy odpowiedź
    const mockCoordinatesData = {
      teryt: {
        tercCode: tercCode || fullCode?.substring(0, 6),
        simcCode: simcCode || fullCode?.substring(6, 13),
        ulicCode: ulicCode || fullCode?.substring(13, 18),
        fullCode: fullCode || `${tercCode}${simcCode}${ulicCode}`
      },
      coordinates: {
        lat: 52.2297 + (Math.random() - 0.5) * 0.1,
        lng: 21.0122 + (Math.random() - 0.5) * 0.1
      },
      location: {
        name: 'Warszawa',
        type: 'miejscowość',
        address: 'ul. Przykładowa 1, 00-001 Warszawa'
      }
    };
    
    res.json({
      success: true,
      data: mockCoordinatesData
    });
  } catch (error) {
    console.error('❌ Błąd podczas mapowania TERYT na współrzędne:', error);
    res.status(500).json({ 
      error: 'Błąd podczas mapowania TERYT na współrzędne',
      details: error.message 
    });
  }
};

// Wyszukiwanie obiektów w promieniu (sklepy, firmy, użytkownicy)
exports.searchNearbyObjects = async (req, res) => {
  try {
    const { 
      lat, 
      lng, 
      radius = 10, // km
      types = 'all', // sklepy, firmy, użytkownicy, all
      page = 1,
      limit = 20
    } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Współrzędne są wymagane' });
    }

    console.log(`🔍 Wyszukiwanie obiektów w promieniu ${radius}km: ${lat}, ${lng}`);
    
    const skip = (page - 1) * limit;
    const results = {
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseFloat(radius),
      types: types,
      results: []
    };
    
    // W rzeczywistości używałoby się geospatial queries MongoDB
    // Na razie symulujemy wyniki
    
    if (types === 'all' || types.includes('sklepy')) {
      const shops = await Shop.find({ isActive: true })
        .populate('owner', 'username firstName lastName')
        .limit(parseInt(limit) / 3);
      
      results.results.push(...shops.map(shop => ({
        ...shop.toObject(),
        type: 'shop',
        distance: Math.random() * radius // Symulowana odległość
      })));
    }
    
    if (types === 'all' || types.includes('firmy')) {
      const companies = await CompanyProfile.find({ isActive: true })
        .populate('owner', 'username firstName lastName')
        .limit(parseInt(limit) / 3);
      
      results.results.push(...companies.map(company => ({
        ...company.toObject(),
        type: 'company',
        distance: Math.random() * radius // Symulowana odległość
      })));
    }
    
    if (types === 'all' || types.includes('użytkownicy')) {
      const users = await User.find({ isActive: true })
        .select('-password')
        .limit(parseInt(limit) / 3);
      
      results.results.push(...users.map(user => ({
        ...user.toObject(),
        type: 'user',
        distance: Math.random() * radius // Symulowana odległość
      })));
    }
    
    // Sortuj po odległości
    results.results.sort((a, b) => a.distance - b.distance);
    
    // Paginacja
    const total = results.results.length;
    results.results = results.results.slice(skip, skip + parseInt(limit));
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Błąd podczas wyszukiwania obiektów w promieniu:', error);
    res.status(500).json({ 
      error: 'Błąd podczas wyszukiwania obiektów w promieniu',
      details: error.message 
    });
  }
};

// Autouzupełnianie adresów
exports.autocompleteAddress = async (req, res) => {
  try {
    const { query, limit = 5 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Zapytanie jest wymagane' });
    }

    console.log(`🎯 Autouzupełnianie dla: ${query}`);
    
    // W rzeczywistości używałoby się Google Places Autocomplete API
    // Na razie symulujemy odpowiedź
    const mockSuggestions = [
      {
        description: `${query} 1, Warszawa, Mazowieckie`,
        placeId: 'place_1',
        types: ['street_address'],
        teryt: {
          tercCode: '140101',
          simcCode: '0918123',
          ulicCode: '12345'
        }
      },
      {
        description: `${query} 2, Warszawa, Mazowieckie`,
        placeId: 'place_2',
        types: ['street_address'],
        teryt: {
          tercCode: '140101',
          simcCode: '0918123',
          ulicCode: '12346'
        }
      },
      {
        description: `${query}, Kraków, Małopolskie`,
        placeId: 'place_3',
        types: ['street_address'],
        teryt: {
          tercCode: '126101',
          simcCode: '0950463',
          ulicCode: '54321'
        }
      }
    ].slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: mockSuggestions,
      count: mockSuggestions.length
    });
  } catch (error) {
    console.error('❌ Błąd podczas autouzupełniania:', error);
    res.status(500).json({ 
      error: 'Błąd podczas autouzupełniania',
      details: error.message 
    });
  }
};

// Obliczanie odległości między dwoma punktami
exports.calculateDistance = async (req, res) => {
  try {
    const { lat1, lng1, lat2, lng2 } = req.body;
    
    if (!lat1 || !lng1 || !lat2 || !lng2) {
      return res.status(400).json({ error: 'Wszystkie współrzędne są wymagane' });
    }

    // Funkcja do obliczania odległości (formuła Haversine)
    const calculateHaversineDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371; // Promień Ziemi w km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const distance = calculateHaversineDistance(
      parseFloat(lat1), 
      parseFloat(lng1), 
      parseFloat(lat2), 
      parseFloat(lng2)
    );
    
    res.json({
      success: true,
      data: {
        distance: Math.round(distance * 100) / 100,
        distanceText: `${Math.round(distance * 100) / 100} km`,
        coordinates: {
          from: { lat: lat1, lng: lng1 },
          to: { lat: lat2, lng: lng2 }
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