const User = require('../models/userModel');
const Shop = require('../models/shopModel');
const Post = require('../models/postModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const locationService = require('../services/locationService');
const UniversalErrorService = require('../services/universalErrorService');

// Rejestracja użytkownika
exports.register = async (req, res) => {
  try {
    console.log('📝 Rozpoczynam rejestrację użytkownika:', {
      username: req.body.username,
      email: req.body.email,
      hasLocationData: !!req.body.locationData
    });

    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName,
      phone,
      dateOfBirth,
      gender,
      locationData // Nowe pole z danymi lokalizacji
    } = req.body;

    // Walidacja wymaganych pól
    const validationErrors = [];
    if (!username) validationErrors.push('Nazwa użytkownika jest wymagana');
    if (!email) validationErrors.push('Email jest wymagany');
    if (!password) validationErrors.push('Hasło jest wymagane');
    if (!firstName) validationErrors.push('Imię jest wymagane');
    if (!lastName) validationErrors.push('Nazwisko jest wymagane');
    if (!phone) validationErrors.push('Telefon jest wymagany');
    if (!dateOfBirth) validationErrors.push('Data urodzenia jest wymagana');
    if (!gender) validationErrors.push('Płeć jest wymagana');

    // Sprawdź dane lokalizacji
    if (!locationData || !locationData.address || !locationData.address.city) {
      validationErrors.push('Miasto jest wymagane');
    }

              if (validationErrors.length > 0) {
            console.log('❌ Błędy walidacji:', validationErrors);
            
            // Zapisz błąd walidacji
            await UniversalErrorService.logValidationError(validationErrors, {
              componentName: 'userController',
              filename: 'userController.js',
              additionalData: {
                action: 'register',
                requestData: { username, email, hasLocationData: !!locationData }
              }
            });

      return res.status(400).json({ 
        error: 'Błędy walidacji',
        details: validationErrors
      });
    }

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

              if (existingUser) {
            const error = new Error(`Użytkownik z tym emailem (${email}) lub nazwą użytkownika (${username}) już istnieje`);
            await UniversalErrorService.logError(error, {
              componentName: 'userController',
              filename: 'userController.js',
              type: 'validation_error',
              additionalData: {
                action: 'register',
                requestData: { username, email }
              }
            });

      return res.status(400).json({ 
        error: 'Użytkownik z tym emailem lub nazwą użytkownika już istnieje' 
      });
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 12);

    // Przygotuj dane użytkownika
    const userData = {
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender
    };

    // Dodaj dane lokalizacji jeśli są dostępne
    if (locationData) {
      if (locationData.address) {
        userData.address = locationData.address;
      }
      if (locationData.teryt) {
        userData.teryt = locationData.teryt;
      }
      if (locationData.simcCode) {
        userData.teryt = {
          ...userData.teryt,
          simcCode: locationData.simcCode
        };
      }
      if (locationData.voivodeshipCode) {
        userData.teryt = {
          ...userData.teryt,
          voivodeshipCode: locationData.voivodeshipCode
        };
      }
      if (locationData.countyCode) {
        userData.teryt = {
          ...userData.teryt,
          countyCode: locationData.countyCode
        };
      }
      if (locationData.municipalityCode) {
        userData.teryt = {
          ...userData.teryt,
          municipalityCode: locationData.municipalityCode
        };
      }
    }

    // Utwórz nowego użytkownika
    const user = new User(userData);

    await user.save();

    // Generuj token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Użytkownik został pomyślnie utworzony:', user.username);
    
    res.status(201).json({
      message: 'Użytkownik został utworzony pomyślnie',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
          } catch (err) {
          console.error('❌ Błąd podczas rejestracji:', err);
          
          // Zapisz błąd w bazie danych
          await UniversalErrorService.logError(err, {
            componentName: 'userController',
            filename: 'userController.js',
            type: 'api_error',
            additionalData: {
              action: 'register',
              requestData: { 
                username: req.body.username, 
                email: req.body.email,
                hasLocationData: !!req.body.locationData
              }
            }
          });

    res.status(500).json({ 
      error: 'Błąd podczas rejestracji użytkownika',
      details: err.message 
    });
  }
};

// Logowanie użytkownika
exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body; // ✅ POPRAWIONE - obsługa email lub username

    if (!emailOrUsername || !password) {
      return res.status(400).json({ 
        error: 'Email/nazwa użytkownika i hasło są wymagane' 
      });
    }

    // Sprawdź czy to email czy username
    const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername);
    
    // Znajdź użytkownika z populowaną lokalizacją
    let user;
    if (isEmail) {
      user = await User.findOne({ email: emailOrUsername }).populate('location', 'name type code');
    } else {
      user = await User.findOne({ username: emailOrUsername }).populate('location', 'name type code');
    }
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Nieprawidłowy email/nazwa użytkownika lub hasło' 
      });
    }

    // Sprawdź hasło
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Nieprawidłowy email/nazwa użytkownika lub hasło' 
      });
    }

    // Sprawdź czy użytkownik jest aktywny
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Konto jest nieaktywne. Skontaktuj się z administratorem.' 
      });
    }

    // Generuj token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'portal-super-secret-jwt-key-2024-change-this-in-production',
      { expiresIn: '24h' }
    );

    // Aktualizuj ostatnie logowanie
    user.lastSeen = new Date();
    user.isOnline = true;
    await user.save();

    // Przygotuj podstawowe dane lokalizacyjne do przechowywania w localStorage
    const locationData = user.location ? {
      id: user.location._id,
      name: user.location.name,
      type: user.location.type,
      code: user.location.code
    } : null;

    const terytData = user.teryt ? {
      voivodeshipCode: user.teryt.voivodeshipCode,
      countyCode: user.teryt.countyCode,
      municipalityCode: user.teryt.municipalityCode,
      tercCode: user.teryt.tercCode,
      simcCode: user.teryt.simcCode
      // Celowo pomijamy ulicCode - rzadko używane
    } : null;

    const addressData = user.address ? {
      city: user.address.city,
      postalCode: user.address.postalCode
    } : null;

    const responseData = {
      message: 'Logowanie pomyślne',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        level: user.level,
        points: user.points,
        roles: user.roles || ['user'], // Dodajemy role
        // Dodajemy podstawowe dane lokalizacyjne
        location: locationData,
        teryt: terytData,
        address: addressData
      }
    };
    
    console.log('Backend login response:', JSON.stringify(responseData, null, 2));
    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie profilu użytkownika
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('location', 'name type');

    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja profilu użytkownika
exports.updateProfile = async (req, res) => {
  try {
    console.log('🔄 Aktualizacja profilu użytkownika:', req.userId);
    console.log('📊 Dane do aktualizacji:', req.body);
    
    const updates = req.body;
    
    // Usuń pola, których nie można aktualizować
    delete updates.password;
    delete updates.email;
    delete updates.username;
    delete updates.role;

    // Usuń pole location jeśli to string (nie ObjectId)
    if (updates.location && typeof updates.location === 'string') {
      console.log('⚠️ Usuwam pole location (string) - używaj terytData');
      delete updates.location;
    }

    // Obsługa terytData - zapisz jako teryt
    if (updates.terytData) {
      // Mapuj dane z frontend na strukturę modelu
      updates.teryt = {
        voivodeshipCode: updates.terytData.wojewodztwo?.code || '',
        countyCode: updates.terytData.powiat?.code || '',
        municipalityCode: updates.terytData.gmina?.code || '',
        tercCode: updates.terytData.gmina?.code || '', // Kod gminy jako TERC
        simcCode: updates.terytData.code || '', // Kod miejscowości jako SIMC
        ulicCode: '', // Puste na razie
        fullCode: `${updates.terytData.wojewodztwo?.code || ''}${updates.terytData.powiat?.code || ''}${updates.terytData.gmina?.code || ''}`
      };
      delete updates.terytData;
      console.log('🗺️ Zapisywanie danych TERYT:', updates.teryt);
    }

    console.log('✅ Finalne dane do aktualizacji:', updates);

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    console.log('✅ Profil zaktualizowany pomyślnie');
    res.json(user);
  } catch (err) {
    console.error('❌ Błąd aktualizacji profilu:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Aktualizacja lokalizacji użytkownika
exports.updateLocation = async (req, res) => {
  try {
    const { location, teryt, address } = req.body;
    
    const updates = {};
    
    // Aktualizuj dane lokalizacyjne
    if (location) {
      updates.location = location.id;
    }
    
    if (teryt) {
      updates.teryt = teryt;
    }
    
    if (address) {
      updates.address = address;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password').populate('location', 'name type code');

    // Przygotuj dane do zwrotu (podobnie jak w login)
    const locationData = user.location ? {
      id: user.location._id,
      name: user.location.name,
      type: user.location.type,
      code: user.location.code
    } : null;

    const terytData = user.teryt ? {
      voivodeshipCode: user.teryt.voivodeshipCode,
      countyCode: user.teryt.countyCode,
      municipalityCode: user.teryt.municipalityCode,
      tercCode: user.teryt.tercCode,
      simcCode: user.teryt.simcCode
    } : null;

    const addressData = user.address ? {
      city: user.address.city,
      postalCode: user.address.postalCode
    } : null;

    res.json({
      message: 'Lokalizacja została zaktualizowana',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        level: user.level,
        points: user.points,
        location: locationData,
        teryt: terytData,
        address: addressData
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie wszystkich użytkowników z filtrowaniem
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      city,
      // Nowe parametry dla kodów TERYT
      tercCode,
      simcCode,
      ulicCode,
      fullCode,
      voivodeshipCode,
      countyCode,
      municipalityCode
    } = req.query;

    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (role) {
      query.roles = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    // Nowe filtry dla kodów TERYT
    if (tercCode) {
      query['teryt.tercCode'] = tercCode;
    }
    
    if (simcCode) {
      query['teryt.simcCode'] = simcCode;
    }
    
    if (ulicCode) {
      query['teryt.ulicCode'] = ulicCode;
    }
    
    if (fullCode) {
      query['teryt.fullCode'] = fullCode;
    }
    
    if (voivodeshipCode) {
      query['teryt.voivodeshipCode'] = voivodeshipCode;
    }
    
    if (countyCode) {
      query['teryt.countyCode'] = countyCode;
    }
    
    if (municipalityCode) {
      query['teryt.municipalityCode'] = municipalityCode;
    }
    
    const users = await User.find(query)
      .select('-password')
      .populate('location', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wyszukiwanie użytkowników po kodach TERYT
exports.searchUsersByTeryt = async (req, res) => {
  try {
    const {
      tercCode,
      simcCode,
      ulicCode,
      fullCode,
      voivodeshipCode,
      countyCode,
      municipalityCode,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Buduj query na podstawie dostępnych kodów
    if (fullCode) {
      query['teryt.fullCode'] = fullCode;
    } else {
      if (tercCode) query['teryt.tercCode'] = tercCode;
      if (simcCode) query['teryt.simcCode'] = simcCode;
      if (ulicCode) query['teryt.ulicCode'] = ulicCode;
      if (voivodeshipCode) query['teryt.voivodeshipCode'] = voivodeshipCode;
      if (countyCode) query['teryt.countyCode'] = countyCode;
      if (municipalityCode) query['teryt.municipalityCode'] = municipalityCode;
    }
    
    // Sprawdź czy są jakieś filtry TERYT
    if (Object.keys(query).length === 0) {
      return res.status(400).json({ 
        error: 'Musisz podać przynajmniej jeden kod TERYT do wyszukiwania' 
      });
    }
    
    const users = await User.find(query)
      .select('-password')
      .populate('location', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      searchCriteria: {
        tercCode,
        simcCode,
        ulicCode,
        fullCode,
        voivodeshipCode,
        countyCode,
        municipalityCode
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Wyszukiwanie użytkowników
exports.searchUsers = async (req, res) => {
  try {
    const { q: query, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Zapytanie musi mieć co najmniej 2 znaki'
      });
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    
    const users = await User.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ],
      isActive: true
    })
    .select('_id firstName lastName username avatar email')
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ firstName: 1, lastName: 1 });

    const total = await User.countDocuments({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ],
      isActive: true
    });

    res.json({
      success: true,
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Błąd wyszukiwania użytkowników:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd wyszukiwania użytkowników'
    });
  }
};

// Pobieranie użytkowników w promieniu (na podstawie kodów TERYT)
exports.getUsersInRadius = async (req, res) => {
  try {
    const {
      tercCode,
      radius = 10, // km
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;
    
    if (!tercCode) {
      return res.status(400).json({ 
        error: 'Kod TERC jest wymagany do wyszukiwania w promieniu' 
      });
    }
    
    // Znajdź użytkowników z podobnym kodem TERC (w tym samym województwie/powiecie)
    const tercPrefix = tercCode.substring(0, 4); // Pierwsze 4 cyfry (województwo + powiat)
    
    let query = {
      'teryt.tercCode': { $regex: `^${tercPrefix}` }
    };
    
    const users = await User.find(query)
      .select('-password')
      .populate('location', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      searchCriteria: {
        tercCode,
        radius: parseInt(radius),
        tercPrefix
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Pobiera powiaty dla danego województwa
 */
const getCountiesByVoivodeship = async (voivodeshipCode) => {
  try {
    const counties = await locationService.getCountiesByVoivodeship(voivodeshipCode);
    return counties;
  } catch (error) {
    console.error('Błąd pobierania powiatów:', error);
    throw error;
  }
};

/**
 * Pobiera gminy dla danego powiatu
 */
const getMunicipalitiesByCounty = async (countyCode) => {
  try {
    const municipalities = await locationService.getMunicipalitiesByCounty(countyCode);
    return municipalities;
  } catch (error) {
    console.error('Błąd pobierania gmin:', error);
    throw error;
  }
};

/**
 * Pobiera miejscowości dla danej gminy
 */
const getCitiesByMunicipality = async (municipalityCode) => {
  try {
    const cities = await locationService.getCitiesByMunicipality(municipalityCode);
    return cities;
  } catch (error) {
    console.error('Błąd pobierania miejscowości:', error);
    throw error;
  }
};

/**
 * Wyszukuje miejscowości na podstawie części nazwy
 */
const searchCities = async (query, limit = 10) => {
  try {
    const cities = await locationService.searchCities(query, limit);
    return cities;
  } catch (error) {
    console.error('Błąd wyszukiwania miejscowości:', error);
    throw error;
  }
};

/**
 * Wyszukuje gminy na podstawie części nazwy
 */
const searchMunicipalities = async (query, limit = 10) => {
  try {
    const municipalities = await locationService.searchMunicipalities(query, limit);
    return municipalities;
  } catch (error) {
    console.error('Błąd wyszukiwania gmin:', error);
    throw error;
  }
};

/**
 * Wyszukuje powiaty na podstawie części nazwy
 */
const searchCounties = async (query, limit = 10) => {
  try {
    const counties = await locationService.searchCounties(query, limit);
    return counties;
  } catch (error) {
    console.error('Błąd wyszukiwania powiatów:', error);
    throw error;
  }
};

/**
 * Wyszukuje województwa na podstawie części nazwy
 */
const searchVoivodeships = async (query, limit = 10) => {
  try {
    const voivodeships = await locationService.searchVoivodeships(query, limit);
    return voivodeships;
  } catch (error) {
    console.error('Błąd wyszukiwania województw:', error);
    throw error;
  }
};

/**
 * Pobiera pełne dane lokalizacyjne dla miejscowości
 */
const getLocationDataByCity = async (cityCode) => {
  try {
    const locationData = await locationService.getLocationDataByCity(cityCode);
    return locationData;
  } catch (error) {
    console.error('Błąd pobierania danych lokalizacyjnych:', error);
    throw error;
  }
};

/**
 * Pobiera użytkownika po ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'ID użytkownika jest wymagane' });
    }

    // Pobierz użytkownika bez populowania referencji
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    }

    // Sprawdź czy użytkownik jest aktywny (opcjonalnie)
    if (!user.isActive) {
      return res.status(404).json({ error: 'Użytkownik jest nieaktywny' });
    }

    // Przygotuj dane użytkownika z obsługą brakujących pól
    const userData = {
      _id: user._id,
      username: user.username || 'Brak nazwy użytkownika',
      email: user.email || 'Brak emaila',
      firstName: user.firstName || 'Brak',
      lastName: user.lastName || 'Brak',
      bio: user.bio || 'Brak opisu',
      avatar: user.avatar || null,
      isActive: user.isActive,
      roles: user.roles || [],
      location: user.location,
      shops: user.shops || [], // ID sklepów bez populowania
      posts: user.posts || [], // ID postów bez populowania
      level: user.level || 1,
      points: user.points || 0,
      joinDate: user.joinDate,
      lastSeen: user.lastSeen
    };

    res.json(userData);
  } catch (error) {
    console.error('Błąd pobierania użytkownika:', error);
    res.status(500).json({ error: 'Błąd serwera podczas pobierania użytkownika' });
  }
};

module.exports = {
  register: exports.register,
  login: exports.login,
  getProfile: exports.getProfile,
  updateProfile: exports.updateProfile,
  updateLocation: exports.updateLocation,
  getUsers: exports.getUsers,
  searchUsersByTeryt: exports.searchUsersByTeryt,
  searchUsers: exports.searchUsers,
  getUserById: exports.getUserById,
  getUsersInRadius: exports.getUsersInRadius,
  // Nowe metody lokalizacyjne
  getCountiesByVoivodeship,
  getMunicipalitiesByCounty,
  getCitiesByMunicipality,
  searchCities,
  searchMunicipalities,
  searchCounties,
  searchVoivodeships,
  getLocationDataByCity
};
