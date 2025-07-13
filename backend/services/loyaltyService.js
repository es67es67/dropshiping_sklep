const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Coupon = require('../models/couponModel');

class LoyaltyService {
  constructor() {
    this.pointsPerPLN = 1; // 1 punkt za 1 PLN
    this.levels = {
      bronze: { name: 'Brązowy', minPoints: 0, discount: 0.02, benefits: ['Darmowa dostawa od 100 PLN'] },
      silver: { name: 'Srebrny', minPoints: 1000, discount: 0.05, benefits: ['Darmowa dostawa od 50 PLN', 'Priorytetowe wsparcie'] },
      gold: { name: 'Złoty', minPoints: 5000, discount: 0.08, benefits: ['Darmowa dostawa', 'Priorytetowe wsparcie', 'Ekskluzywne oferty'] },
      platinum: { name: 'Platyna', minPoints: 15000, discount: 0.12, benefits: ['Darmowa dostawa', 'Priorytetowe wsparcie', 'Ekskluzywne oferty', 'Osobisty asystent'] },
      diamond: { name: 'Diament', minPoints: 50000, discount: 0.15, benefits: ['Wszystkie korzyści', 'VIP events', 'Dedykowany opiekun'] }
    };
    
    this.badges = {
      first_purchase: { name: 'Pierwszy Zakup', description: 'Wykonałeś pierwszy zakup', icon: '🎉' },
      loyal_customer: { name: 'Lojalny Klient', description: '5 zakupów w ciągu 30 dni', icon: '👑' },
      big_spender: { name: 'Duży Wydatek', description: 'Zakup powyżej 500 PLN', icon: '💰' },
      early_bird: { name: 'Ranny Ptaszek', description: 'Zakup przed 9:00', icon: '🌅' },
      weekend_shopper: { name: 'Weekendowy Zakup', description: 'Zakup w weekend', icon: '📅' },
      review_writer: { name: 'Recenzent', description: 'Napisałeś 10 recenzji', icon: '✍️' },
      social_butterfly: { name: 'Motylek Społeczny', description: 'Udostępniłeś 5 produktów', icon: '🦋' },
      bargain_hunter: { name: 'Łowca Okazji', description: 'Kupiłeś 10 produktów w promocji', icon: '🎯' }
    };
  }

  // Obliczanie punktów za zakup
  async calculatePurchasePoints(orderId) {
    try {
      const order = await Order.findById(orderId).populate('items.product');
      if (!order) return 0;

      let totalPoints = 0;
      const baseAmount = order.totalAmount;

      // Podstawowe punkty (1 punkt za 1 PLN)
      totalPoints += Math.floor(baseAmount * this.pointsPerPLN);

      // Bonusy za różne okazje
      const bonuses = await this.calculateBonuses(order);
      totalPoints += bonuses;

      return totalPoints;
    } catch (error) {
      console.error('Błąd obliczania punktów:', error);
      return 0;
    }
  }

  // Obliczanie bonusów
  async calculateBonuses(order) {
    let bonuses = 0;
    const now = new Date();

    // Bonus za pierwszy zakup
    const userOrders = await Order.find({ user: order.user });
    if (userOrders.length === 1) {
      bonuses += 100; // 100 punktów bonus za pierwszy zakup
    }

    // Bonus za duży zakup
    if (order.totalAmount >= 500) {
      bonuses += 50; // 50 punktów bonus za zakup powyżej 500 PLN
    }

    // Bonus za zakup w weekend
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      bonuses += 25; // 25 punktów bonus za zakup w weekend
    }

    // Bonus za zakup rano (przed 9:00)
    const hour = now.getHours();
    if (hour < 9) {
      bonuses += 30; // 30 punktów bonus za zakup przed 9:00
    }

    // Bonus za produkty w promocji
    const discountedItems = order.items.filter(item => 
      item.product.isOnSale
    );
    if (discountedItems.length > 0) {
      bonuses += discountedItems.length * 10; // 10 punktów za każdy produkt w promocji
    }

    return bonuses;
  }

  // Dodawanie punktów użytkownikowi
  async addPoints(userId, points, reason = 'Zakup') {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('Użytkownik nie znaleziony');

      // Inicjalizuj system lojalnościowy jeśli nie istnieje
      if (!user.loyalty) {
        user.loyalty = {
          points: 0,
          totalPointsEarned: 0,
          totalPointsSpent: 0,
          level: 'bronze',
          badges: [],
          history: []
        };
      }

      // Dodaj punkty
      user.loyalty.points += points;
      user.loyalty.totalPointsEarned += points;

      // Dodaj do historii
      user.loyalty.history.push({
        type: 'earned',
        points,
        reason,
        date: new Date()
      });

      // Sprawdź czy użytkownik awansował
      const newLevel = this.calculateLevel(user.loyalty.points);
      if (newLevel !== user.loyalty.level) {
        user.loyalty.level = newLevel;
        user.loyalty.history.push({
          type: 'level_up',
          points: 0,
          reason: `Awans do poziomu ${this.levels[newLevel].name}`,
          date: new Date()
        });
      }

      await user.save();
      return user.loyalty;
    } catch (error) {
      console.error('Błąd dodawania punktów:', error);
      throw error;
    }
  }

  // Odejmowanie punktów (za nagrody)
  async spendPoints(userId, points, reason = 'Nagroda') {
    try {
      const user = await User.findById(userId);
      if (!user || !user.loyalty) {
        throw new Error('Użytkownik nie ma systemu lojalnościowego');
      }

      if (user.loyalty.points < points) {
        throw new Error('Niewystarczająca liczba punktów');
      }

      user.loyalty.points -= points;
      user.loyalty.totalPointsSpent += points;

      user.loyalty.history.push({
        type: 'spent',
        points: -points,
        reason,
        date: new Date()
      });

      await user.save();
      return user.loyalty;
    } catch (error) {
      console.error('Błąd odejmowania punktów:', error);
      throw error;
    }
  }

  // Obliczanie poziomu użytkownika
  calculateLevel(points) {
    if (points >= 50000) return 'diamond';
    if (points >= 15000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 1000) return 'silver';
    return 'bronze';
  }

  // Pobieranie informacji o lojalności użytkownika
  async getUserLoyalty(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.loyalty) {
        return {
          points: 0,
          level: 'bronze',
          levelInfo: this.levels.bronze,
          nextLevel: this.getNextLevelInfo(0),
          badges: [],
          history: []
        };
      }

      const currentLevel = user.loyalty.level;
      const nextLevel = this.getNextLevelInfo(user.loyalty.points);

      return {
        ...user.loyalty.toObject(),
        levelInfo: this.levels[currentLevel],
        nextLevel,
        badges: await this.getUserBadges(userId)
      };
    } catch (error) {
      console.error('Błąd pobierania lojalności:', error);
      throw error;
    }
  }

  // Informacje o następnym poziomie
  getNextLevelInfo(currentPoints) {
    const levels = Object.entries(this.levels);
    for (const [level, info] of levels) {
      if (info.minPoints > currentPoints) {
        const pointsNeeded = info.minPoints - currentPoints;
        return {
          level,
          name: info.name,
          pointsNeeded,
          benefits: info.benefits
        };
      }
    }
    return null; // Użytkownik ma najwyższy poziom
  }

  // Sprawdzanie i przyznawanie odznak
  async checkAndAwardBadges(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return [];

      const newBadges = [];
      const currentBadges = user.loyalty?.badges || [];

      // Sprawdź każdą odznakę
      for (const [badgeId, badgeInfo] of Object.entries(this.badges)) {
        if (currentBadges.includes(badgeId)) continue; // Już przyznana

        const shouldAward = await this.checkBadgeCriteria(userId, badgeId);
        if (shouldAward) {
          newBadges.push(badgeId);
          currentBadges.push(badgeId);

          // Dodaj do historii
          if (user.loyalty) {
            user.loyalty.history.push({
              type: 'badge_earned',
              points: 0,
              reason: `Otrzymano odznakę: ${badgeInfo.name}`,
              date: new Date()
            });
          }
        }
      }

      if (newBadges.length > 0) {
        user.loyalty.badges = currentBadges;
        await user.save();
      }

      return newBadges.map(badgeId => ({
        id: badgeId,
        ...this.badges[badgeId]
      }));
    } catch (error) {
      console.error('Błąd sprawdzania odznak:', error);
      return [];
    }
  }

  // Sprawdzanie kryteriów odznaki
  async checkBadgeCriteria(userId, badgeId) {
    try {
      switch (badgeId) {
        case 'first_purchase':
          const orders = await Order.find({ user: userId });
          return orders.length >= 1;

        case 'loyal_customer':
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          const recentOrders = await Order.find({
            user: userId,
            createdAt: { $gte: thirtyDaysAgo }
          });
          return recentOrders.length >= 5;

        case 'big_spender':
          const bigOrder = await Order.findOne({
            user: userId,
            totalAmount: { $gte: 500 }
          });
          return !!bigOrder;

        case 'early_bird':
          const earlyOrder = await Order.findOne({
            user: userId,
            createdAt: {
              $gte: new Date().setHours(0, 0, 0, 0),
              $lt: new Date().setHours(9, 0, 0, 0)
            }
          });
          return !!earlyOrder;

        case 'weekend_shopper':
          const weekendOrder = await Order.findOne({
            user: userId,
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          });
          if (weekendOrder) {
            const dayOfWeek = weekendOrder.createdAt.getDay();
            return dayOfWeek === 0 || dayOfWeek === 6;
          }
          return false;

        case 'review_writer':
          // Zakładając, że mamy model Review
          const reviews = await Review.find({ user: userId });
          return reviews.length >= 10;

        case 'bargain_hunter':
          const discountedOrders = await Order.find({
            user: userId,
            'items.product.isOnSale': true
          });
          return discountedOrders.length >= 10;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Błąd sprawdzania odznaki ${badgeId}:`, error);
      return false;
    }
  }

  // Pobieranie odznak użytkownika
  async getUserBadges(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.loyalty) return [];

      return user.loyalty.badges.map(badgeId => ({
        id: badgeId,
        ...this.badges[badgeId]
      }));
    } catch (error) {
      console.error('Błąd pobierania odznak:', error);
      return [];
    }
  }

  // Generowanie kuponu zniżkowego
  async generateDiscountCoupon(userId, discountType = 'percentage') {
    try {
      const user = await User.findById(userId);
      if (!user || !user.loyalty) {
        throw new Error('Użytkownik nie ma systemu lojalnościowego');
      }

      const level = user.loyalty.level;
      const levelInfo = this.levels[level];

      let discountValue;
      let couponCode;

      switch (discountType) {
        case 'percentage':
          discountValue = levelInfo.discount * 100; // Konwertuj na procenty
          couponCode = `LOYALTY_${level.toUpperCase()}_${Date.now()}`;
          break;
        case 'fixed':
          discountValue = Math.floor(levelInfo.discount * 100); // Zniżka w PLN
          couponCode = `LOYALTY_FIXED_${Date.now()}`;
          break;
        default:
          throw new Error('Nieprawidłowy typ zniżki');
      }

      const coupon = new Coupon({
        code: couponCode,
        type: discountType,
        value: discountValue,
        minOrderValue: discountType === 'percentage' ? 50 : 100,
        maxUses: 1,
        usedBy: [userId],
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dni
        description: `Kupon lojalnościowy - ${levelInfo.name}`,
        isActive: true
      });

      await coupon.save();
      return coupon;
    } catch (error) {
      console.error('Błąd generowania kuponu:', error);
      throw error;
    }
  }

  // Pobieranie historii lojalności
  async getLoyaltyHistory(userId, limit = 20) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.loyalty) return [];

      return user.loyalty.history
        .sort((a, b) => b.date - a.date)
        .slice(0, limit);
    } catch (error) {
      console.error('Błąd pobierania historii:', error);
      return [];
    }
  }

  // Statystyki lojalności (dla adminów)
  async getLoyaltyStats() {
    try {
      const stats = {
        totalUsers: 0,
        activeUsers: 0,
        levelDistribution: {},
        totalPointsEarned: 0,
        totalPointsSpent: 0,
        averagePointsPerUser: 0
      };

      const users = await User.find({ 'loyalty.points': { $exists: true } });
      
      stats.totalUsers = users.length;
      stats.activeUsers = users.filter(u => u.loyalty.points > 0).length;

      // Rozkład poziomów
      for (const user of users) {
        const level = user.loyalty.level;
        stats.levelDistribution[level] = (stats.levelDistribution[level] || 0) + 1;
        stats.totalPointsEarned += user.loyalty.totalPointsEarned || 0;
        stats.totalPointsSpent += user.loyalty.totalPointsSpent || 0;
      }

      stats.averagePointsPerUser = stats.totalUsers > 0 ? 
        Math.round(stats.totalPointsEarned / stats.totalUsers) : 0;

      return stats;
    } catch (error) {
      console.error('Błąd pobierania statystyk:', error);
      throw error;
    }
  }

  // Resetowanie punktów (dla adminów)
  async resetUserPoints(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.loyalty) {
        throw new Error('Użytkownik nie ma systemu lojalnościowego');
      }

      user.loyalty.points = 0;
      user.loyalty.level = 'bronze';
      user.loyalty.history.push({
        type: 'reset',
        points: 0,
        reason: 'Reset punktów przez administratora',
        date: new Date()
      });

      await user.save();
      return user.loyalty;
    } catch (error) {
      console.error('Błąd resetowania punktów:', error);
      throw error;
    }
  }
}

module.exports = new LoyaltyService(); 