const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, location } = req.body;
    
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 
          'Użytkownik o podanym adresie e-mail już istnieje' : 
          'Nazwa użytkownika jest już zajęta' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      // location: location || '', // Usuwamy to, bo location to ObjectId
      level: 1,
      points: 0,
      isOnline: true,
      lastSeen: Date.now()
    });
    
    await user.save();
    
    // Nie zwracaj hasła w odpowiedzi
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ 
      user: userResponse, 
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'TAJNY_KLUCZ', { expiresIn: '7d' }) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Wystąpił błąd podczas rejestracji' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Sprawdź czy podano email lub username
    if (!email && !username) {
      return res.status(400).json({ error: 'Podaj email lub nazwę użytkownika' });
    }
    
    // Znajdź użytkownika po email lub username
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ username });
    }
    
    if (!user) {
      return res.status(400).json({ error: 'Nieprawidłowy email/nazwa użytkownika lub hasło' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Nieprawidłowy email/nazwa użytkownika lub hasło' });
    }
    
    // Aktualizuj status online
    user.isOnline = true;
    user.lastSeen = Date.now();
    await user.save();
    
    // Nie zwracaj hasła w odpowiedzi
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ 
      user: userResponse, 
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'TAJNY_KLUCZ', { expiresIn: '7d' }) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Wystąpił błąd podczas logowania' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    console.log('getProfile: req.userId =', req.userId, 'req.params.id =', req.params.id);
    const user = await User.findById(req.params.id || req.userId)
      .select('-password')
      .populate('friends', 'username firstName lastName avatar isOnline')
      .populate('followers', 'username firstName lastName avatar')
      .populate('following', 'username firstName lastName avatar');
    console.log('getProfile: user =', user);
    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie profilu zalogowanego użytkownika
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('friends', 'username firstName lastName avatar isOnline')
      .populate('followers', 'username firstName lastName avatar')
      .populate('following', 'username firstName lastName avatar');
    
    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      bio, 
      location, 
      phone, 
      avatar, 
      interests,
      email,
      notifications,
      privacy
    } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }
    // Zabezpieczenie na brakujące preferences
    if (!user.preferences) user.preferences = {};
    if (!user.preferences.notifications) user.preferences.notifications = {};
    if (!user.preferences.privacy) user.preferences.privacy = {};
    
    // Aktualizuj podstawowe pola
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (interests !== undefined) user.interests = interests;
    if (email !== undefined) user.email = email;
    
    // Aktualizuj ustawienia powiadomień
    if (notifications) {
      if (notifications.email !== undefined) user.preferences.notifications.email = notifications.email;
      if (notifications.push !== undefined) user.preferences.notifications.push = notifications.push;
      if (notifications.marketing !== undefined) user.preferences.notifications.sms = notifications.marketing;
    }
    
    // Aktualizuj ustawienia prywatności
    if (privacy) {
      if (privacy.profilePublic !== undefined) {
        user.preferences.privacy.profileVisibility = privacy.profilePublic ? 'public' : 'private';
      }
      if (privacy.showLocation !== undefined) user.preferences.privacy.showLocation = privacy.showLocation;
      if (privacy.allowMessages !== undefined) user.preferences.privacy.allowMessages = privacy.allowMessages;
    }
    
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    console.error('Błąd aktualizacji profilu:', err);
    res.status(500).json({ error: err.message || 'Wystąpił błąd podczas aktualizacji profilu' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (q) {
      query = {
        $or: [
          { username: { $regex: q, $options: 'i' } },
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } }
        ]
      };
    }
    
    const users = await User.find(query)
      .select('username firstName lastName avatar bio isOnline lastSeen')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ isOnline: -1, lastSeen: -1 });
    
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

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;
    
    if (userId === currentUserId) {
      return res.status(400).json({ error: 'Nie możesz obserwować samego siebie' });
    }
    
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);
    
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }
    
    const isFollowing = currentUser.following.includes(userId);
    
    if (isFollowing) {
      // Przestań obserwować
      currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUserId);
    } else {
      // Zacznij obserwować
      currentUser.following.push(userId);
      userToFollow.followers.push(currentUserId);
    }
    
    await currentUser.save();
    await userToFollow.save();
    
    res.json({ 
      isFollowing: !isFollowing,
      message: !isFollowing ? 'Zacząłeś obserwować użytkownika' : 'Przestałeś obserwować użytkownika'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Wystąpił błąd podczas pobierania użytkowników' });
  }
};

// Zapisywanie ustawień layoutu
exports.saveLayoutSettings = async (req, res) => {
  try {
    console.log('saveLayoutSettings called');
    console.log('Request body:', req.body);
    console.log('User ID:', req.userId);
    
    const { layout, theme, colors, type } = req.body;
    
    if (!layout || !theme || !colors || !type) {
      console.log('Missing required fields:', { layout, theme, colors, type });
      return res.status(400).json({ error: 'Brakuje wymaganych pól' });
    }
    
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found for ID:', req.userId);
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }
    
    console.log('User found:', user.username);
    
    // Inicjalizuj ustawienia jeśli nie istnieją
    if (!user.settings) {
      user.settings = {};
    }
    
    if (!user.settings.layouts) {
      user.settings.layouts = {};
    }
    
    // Zapisz ustawienia dla określonego typu (portal/shop)
    user.settings.layouts[type] = {
      layout,
      theme,
      colors,
      updatedAt: new Date()
    };
    
    console.log('Settings to save:', user.settings.layouts[type]);
    
    await user.save();
    
    console.log('Settings saved successfully');
    
    res.json({ 
      success: true, 
      message: 'Ustawienia zostały zapisane',
      settings: user.settings.layouts[type]
    });
  } catch (err) {
    console.error('Error in saveLayoutSettings:', err);
    res.status(500).json({ error: err.message });
  }
};

// Pobieranie ustawień layoutu
exports.getLayoutSettings = async (req, res) => {
  try {
    const { type } = req.params;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Użytkownik nie został znaleziony' });
    }
    
    const settings = user.settings?.layouts?.[type] || {
      layout: 'modern',
      theme: 'default',
      colors: {
        primary: '#00D4AA',
        secondary: '#8B5CF6',
        accent: '#F59E0B'
      }
    };
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
