const express = require('express');
const router = express.Router();
const User = require('../../models/userModel');
const Badge = require('../../models/badgeModel');
const Achievement = require('../../models/achievementModel');
const eventSystem = require('../../core/eventSystem');

class GamificationModule {
  constructor() {
    this.router = router;
    this.setupRoutes();
    this.setupEvents();
    this.badges = this.initializeBadges();
    this.achievements = this.initializeAchievements();
  }

  setupRoutes() {
    // Pobieranie profilu użytkownika z statusami
    this.router.get('/profile/:userId', async (req, res) => {
      try {
        const { userId } = req.params;
        
        const user = await User.findById(userId)
          .populate('badges')
          .populate('achievements')
          .populate('location', 'name type');
        
        if (!user) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        // Oblicz statystyki
        const stats = await this.calculateUserStats(userId);
        
        // Sprawdź czy użytkownik awansował
        const levelUp = await this.checkLevelUp(user);
        
        res.json({
          user,
          stats,
          levelUp
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie wszystkich odznak
    this.router.get('/badges', async (req, res) => {
      try {
        const badges = await Badge.find().sort({ requiredPoints: 1 });
        res.json(badges);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie wszystkich osiągnięć
    this.router.get('/achievements', async (req, res) => {
      try {
        const achievements = await Achievement.find().sort({ requiredPoints: 1 });
        res.json(achievements);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Pobieranie statystyk użytkownika
    this.router.get('/stats', async (req, res) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }

        const stats = await this.calculateUserStats(userId);
        const nextLevelExp = this.calculateLevel(user.points + 1) > user.level ? 
          this.calculateLevel(user.points + 1) : user.level + 1;

        res.json({
          level: user.level,
          experience: user.points,
          nextLevelExp: nextLevelExp * 100, // Przykładowe obliczenie
          achievements: user.achievements?.length || 0,
          totalAchievements: 20,
          badges: user.badges?.length || 0,
          totalBadges: 25,
          orders: stats.orders || 0,
          reviews: stats.reviews || 0,
          daysActive: stats.daysActive || 0,
          shops: stats.shops || 0,
          products: stats.products || 0
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Ranking użytkowników
    this.router.get('/leaderboard', async (req, res) => {
      try {
        const { type = 'points', limit = 50 } = req.query;
        
        let sortField = 'points';
        if (type === 'level') sortField = 'level';
        if (type === 'posts') sortField = 'stats.postsCount';
        if (type === 'shops') sortField = 'stats.shopsCount';
        
        const users = await User.find()
          .sort({ [sortField]: -1 })
          .limit(parseInt(limit))
          .select('username firstName lastName level points stats badges')
          .populate('badges', 'name icon');
        
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Dodawanie punktów użytkownikowi
    this.router.post('/points/add', async (req, res) => {
      try {
        const { userId, points, reason } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        const oldLevel = user.level;
        user.points += points;
        
        // Sprawdź czy użytkownik awansował
        const newLevel = this.calculateLevel(user.points);
        if (newLevel > oldLevel) {
          user.level = newLevel;
          eventSystem.emitUserLevelUp(userId, newLevel);
        }
        
        await user.save();
        
        // Sprawdź odznaki i osiągnięcia
        await this.checkBadgesAndAchievements(user);
        
        res.json({
          user: {
            _id: user._id,
            username: user.username,
            points: user.points,
            level: user.level
          },
          pointsAdded: points,
          reason,
          levelUp: newLevel > oldLevel ? { from: oldLevel, to: newLevel } : null
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Nadawanie roli użytkownikowi (admin)
    this.router.post('/roles/assign', async (req, res) => {
      try {
        const { userId, role, assignedBy } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'Użytkownik nie znaleziony' });
        }
        
        // Sprawdź czy użytkownik ma uprawnienia do nadawania ról
        const adminUser = await User.findById(assignedBy);
        if (!adminUser || !adminUser.roles.includes('admin')) {
          return res.status(403).json({ error: 'Brak uprawnień do nadawania ról' });
        }
        
        if (!user.roles.includes(role)) {
          user.roles.push(role);
          await user.save();
        }
        
        res.json({
          user: {
            _id: user._id,
            username: user.username,
            roles: user.roles
          },
          role,
          assignedBy
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Inicjalizacja systemu gamification
    this.router.post('/initialize', async (req, res) => {
      try {
        await this.initializeSystem();
        res.json({ message: 'System gamification zainicjalizowany pomyślnie' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupEvents() {
    // Nasłuchiwanie na eventy systemowe
    eventSystem.onUserLevelUp(async (data) => {
      console.log(`🎉 Użytkownik ${data.userId} awansował na poziom ${data.newLevel}!`);
      // Tutaj można dodać powiadomienia, email, itp.
    });

    eventSystem.onBadgeEarned(async (data) => {
      console.log(`🏆 Użytkownik ${data.userId} otrzymał odznakę ${data.badgeId}!`);
    });

    // Nasłuchiwanie na aktywności użytkowników
    eventSystem.on('product:created', async (data) => {
      await this.addPointsForActivity(data.userId, 10, 'Dodanie produktu');
    });

    eventSystem.on('shop:created', async (data) => {
      await this.addPointsForActivity(data.userId, 25, 'Utworzenie sklepu');
    });

    eventSystem.on('message:sent', async (data) => {
      await this.addPointsForActivity(data.senderId, 1, 'Wysłanie wiadomości');
    });
  }

  async addPointsForActivity(userId, points, reason) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const oldLevel = user.level;
      user.points += points;
      
      const newLevel = this.calculateLevel(user.points);
      if (newLevel > oldLevel) {
        user.level = newLevel;
        eventSystem.emitUserLevelUp(userId, newLevel);
      }
      
      await user.save();
      await this.checkBadgesAndAchievements(user);
      
      console.log(`➕ ${points} punktów dla ${user.username} za: ${reason}`);
    } catch (error) {
      console.error('Błąd dodawania punktów:', error);
    }
  }

  calculateLevel(points) {
    // Progresywny system poziomów
    if (points < 100) return 1;
    if (points < 300) return 2;
    if (points < 600) return 3;
    if (points < 1000) return 4;
    if (points < 1500) return 5;
    if (points < 2100) return 6;
    if (points < 2800) return 7;
    if (points < 3600) return 8;
    if (points < 4500) return 9;
    if (points < 5500) return 10;
    return Math.floor((points - 5500) / 1000) + 10;
  }

  async calculateUserStats(userId) {
    try {
      // Tutaj można dodać więcej statystyk
      const user = await User.findById(userId);
      return {
        totalPoints: user.points,
        level: user.level,
        badgesCount: user.badges.length,
        achievementsCount: user.achievements.length,
        rank: await this.getUserRank(userId)
      };
    } catch (error) {
      console.error('Błąd obliczania statystyk:', error);
      return {};
    }
  }

  async getUserRank(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return null;
      
      const rank = await User.countDocuments({ points: { $gt: user.points } });
      return rank + 1;
    } catch (error) {
      console.error('Błąd obliczania rankingu:', error);
      return null;
    }
  }

  async checkLevelUp(user) {
    const newLevel = this.calculateLevel(user.points);
    if (newLevel > user.level) {
      user.level = newLevel;
      await user.save();
      eventSystem.emitUserLevelUp(user._id, newLevel);
      return { from: user.level, to: newLevel };
    }
    return null;
  }

  async checkBadgesAndAchievements(user) {
    try {
      // Sprawdź odznaki
      const availableBadges = await Badge.find({
        _id: { $nin: user.badges },
        requiredPoints: { $lte: user.points }
      });
      
      for (const badge of availableBadges) {
        user.badges.push(badge._id);
        eventSystem.emitBadgeEarned(user._id, badge._id);
      }
      
      // Sprawdź osiągnięcia
      const availableAchievements = await Achievement.find({
        _id: { $nin: user.achievements },
        requiredPoints: { $lte: user.points }
      });
      
      for (const achievement of availableAchievements) {
        user.achievements.push(achievement._id);
      }
      
      if (availableBadges.length > 0 || availableAchievements.length > 0) {
        await user.save();
      }
    } catch (error) {
      console.error('Błąd sprawdzania odznak i osiągnięć:', error);
    }
  }

  initializeBadges() {
    return [
      { name: 'Nowicjusz', description: 'Pierwsze kroki w portalu', requiredPoints: 0, icon: '🌱' },
      { name: 'Aktywny Użytkownik', description: 'Regularna aktywność', requiredPoints: 100, icon: '⭐' },
      { name: 'Twórca Treści', description: 'Dodawanie produktów i postów', requiredPoints: 300, icon: '✍️' },
      { name: 'Przedsiębiorca', description: 'Utworzenie sklepu', requiredPoints: 500, icon: '🏪' },
      { name: 'Ekspert Lokalny', description: 'Wysoka aktywność w lokalnej społeczności', requiredPoints: 1000, icon: '🏆' },
      { name: 'Mistrz Portalu', description: 'Osiągnięcie najwyższego poziomu', requiredPoints: 5000, icon: '👑' }
    ];
  }

  initializeAchievements() {
    return [
      { name: 'Pierwszy Post', description: 'Opublikuj pierwszy post', requiredPoints: 50, icon: '📝' },
      { name: 'Pierwszy Produkt', description: 'Dodaj pierwszy produkt', requiredPoints: 100, icon: '📦' },
      { name: 'Pierwszy Sklep', description: 'Utwórz pierwszy sklep', requiredPoints: 250, icon: '🏪' },
      { name: 'Społecznik', description: 'Wyślij 100 wiadomości', requiredPoints: 200, icon: '💬' },
      { name: 'Kolekcjoner', description: 'Zdobądź 5 odznak', requiredPoints: 400, icon: '🎖️' }
    ];
  }

  async initializeSystem() {
    try {
      console.log('🎮 Inicjalizacja systemu gamification...');
      
      // Utwórz odznaki
      for (const badgeData of this.badges) {
        const existingBadge = await Badge.findOne({ name: badgeData.name });
        if (!existingBadge) {
          await Badge.create(badgeData);
        }
      }
      
      // Utwórz osiągnięcia
      for (const achievementData of this.achievements) {
        const existingAchievement = await Achievement.findOne({ name: achievementData.name });
        if (!existingAchievement) {
          await Achievement.create(achievementData);
        }
      }
      
      console.log('✅ System gamification zainicjalizowany');
    } catch (error) {
      console.error('❌ Błąd inicjalizacji systemu gamification:', error);
      throw error;
    }
  }

  async initialize() {
    console.log('🎮 Inicjalizacja modułu gamification...');
    await this.initializeSystem();
    return true;
  }

  getRoutes() {
    return this.router;
  }
}

module.exports = new GamificationModule(); 