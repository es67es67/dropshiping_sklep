const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  avatar: { type: String }, // URL do zdjęcia profilowego
  coverPhoto: { type: String }, // Zdjęcie okładki profilu
  bio: { type: String, maxlength: 500 },
  
  // Lokalizacja (ObjectId referencja do Location)
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  address: {
    street: { type: String },
    houseNumber: { type: String },
    postalCode: { type: String },
    city: { type: String }
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  
  // Kontakt
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  
  // Społeczność
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscribedLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
  
  // Gamifikacja
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
  roles: [{ type: String, enum: ['user', 'moderator', 'admin', 'redaktor', 'ekspert', 'ambasador'] }],
  
  // Preferencje i zainteresowania
  interests: [{ type: String }],
  favoriteCategories: [{ type: String }],
  languages: [{ type: String }],
  
  // Status i aktywność
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  joinDate: { type: Date, default: Date.now },
  
  // Ustawienia powiadomień
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      messages: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      newFollowers: { type: Boolean, default: true },
      localEvents: { type: Boolean, default: true },
      nearbyProducts: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
      showOnlineStatus: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
      allowFriendRequests: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    },
    content: {
      autoPlayVideos: { type: Boolean, default: true },
      showSensitiveContent: { type: Boolean, default: false },
      language: { type: String, default: 'pl' },
      timezone: { type: String, default: 'Europe/Warsaw' }
    }
  },
  
  // Statystyki
  stats: {
    postsCount: { type: Number, default: 0 },
    productsCount: { type: Number, default: 0 },
    shopsCount: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 }
  },
  
  // Ustawienia layoutu i motywów
  settings: {
    layouts: {
      portal: {
        layout: { type: String, default: 'modern' },
        theme: { type: String, default: 'default' },
        colors: {
          primary: { type: String, default: '#00D4AA' },
          secondary: { type: String, default: '#8B5CF6' },
          accent: { type: String, default: '#F59E0B' }
        },
        updatedAt: { type: Date, default: Date.now }
      },
      shop: {
        layout: { type: String, default: 'modern' },
        theme: { type: String, default: 'default' },
        colors: {
          primary: { type: String, default: '#00D4AA' },
          secondary: { type: String, default: '#8B5CF6' },
          accent: { type: String, default: '#F59E0B' }
        },
        updatedAt: { type: Date, default: Date.now }
      }
    }
  }
}, { timestamps: true });

// Metoda do pobierania pełnej nazwy
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.username;
});

// Metoda do sprawdzania czy użytkownik jest znajomym
userSchema.methods.isFriend = function(userId) {
  return this.friends.includes(userId);
};

// Metoda do sprawdzania czy użytkownik jest obserwowany
userSchema.methods.isFollowing = function(userId) {
  return this.following.includes(userId);
};

// Metoda do sprawdzania czy użytkownik jest zablokowany
userSchema.methods.isBlocked = function(userId) {
  return this.blockedUsers.includes(userId);
};

// Metoda do dodawania punktów
userSchema.methods.addPoints = function(points) {
  this.points += points;
  // Sprawdź czy użytkownik awansował
  const newLevel = Math.floor(this.points / 100) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  return this.save();
};

// Metoda do dodawania odznaki
userSchema.methods.addBadge = function(badge) {
  const hasBadge = this.badges.some(b => b.name === badge.name);
  if (!hasBadge) {
    this.badges.push(badge);
  }
  return this.save();
};

// Aktualizuj statystyki przy każdej zmianie
userSchema.pre('save', function(next) {
  if (this.isModified('lastSeen')) {
    this.isOnline = Date.now() - this.lastSeen.getTime() < 5 * 60 * 1000; // 5 minut
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
