const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rejestracja użytkownika
exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Użytkownik z tym emailem lub nazwą użytkownika już istnieje' 
      });
    }

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 12);

    // Utwórz nowego użytkownika
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await user.save();

    // Generuj token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Użytkownik został utworzony pomyślnie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logowanie użytkownika
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Znajdź użytkownika
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Sprawdź hasło
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Sprawdź czy użytkownik jest aktywny
    if (!user.isActive) {
      return res.status(401).json({ error: 'Konto jest nieaktywne' });
    }

    // Generuj token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Aktualizuj ostatnie logowanie
    user.lastSeen = new Date();
    user.isOnline = true;
    await user.save();

    res.json({
      message: 'Logowanie pomyślne',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        level: user.level,
        points: user.points
      }
    });
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
    const updates = req.body;
    
    // Usuń pola, których nie można aktualizować
    delete updates.password;
    delete updates.email;
    delete updates.username;
    delete updates.role;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
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
