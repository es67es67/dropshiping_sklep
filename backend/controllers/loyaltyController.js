const loyaltyService = require('../services/loyaltyService');
const authMiddleware = require('../middleware/authMiddleware');

// Pobieranie informacji o lojalności użytkownika
exports.getUserLoyalty = async (req, res) => {
  try {
    const userId = req.userId;
    const loyalty = await loyaltyService.getUserLoyalty(userId);

    res.json({
      success: true,
      loyalty
    });
  } catch (error) {
    console.error('Błąd pobierania lojalności:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania informacji o lojalności'
    });
  }
};

// Pobieranie historii lojalności
exports.getLoyaltyHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20 } = req.query;
    
    const history = await loyaltyService.getLoyaltyHistory(userId, parseInt(limit));

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Błąd pobierania historii:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania historii lojalności'
    });
  }
};

// Pobieranie odznak użytkownika
exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.userId;
    const badges = await loyaltyService.getUserBadges(userId);

    res.json({
      success: true,
      badges
    });
  } catch (error) {
    console.error('Błąd pobierania odznak:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania odznak'
    });
  }
};

// Sprawdzanie i przyznawanie odznak
exports.checkBadges = async (req, res) => {
  try {
    const userId = req.userId;
    const newBadges = await loyaltyService.checkAndAwardBadges(userId);

    res.json({
      success: true,
      newBadges,
      message: newBadges.length > 0 ? 
        `Otrzymano ${newBadges.length} nową odznakę!` : 
        'Brak nowych odznak'
    });
  } catch (error) {
    console.error('Błąd sprawdzania odznak:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd sprawdzania odznak'
    });
  }
};

// Generowanie kuponu zniżkowego
exports.generateDiscountCoupon = async (req, res) => {
  try {
    const userId = req.userId;
    const { discountType = 'percentage' } = req.body;

    const coupon = await loyaltyService.generateDiscountCoupon(userId, discountType);

    res.json({
      success: true,
      coupon,
      message: 'Kupon zniżkowy został wygenerowany'
    });
  } catch (error) {
    console.error('Błąd generowania kuponu:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd generowania kuponu zniżkowego'
    });
  }
};

// Pobieranie dostępnych nagród
exports.getAvailableRewards = async (req, res) => {
  try {
    const userId = req.userId;
    const loyalty = await loyaltyService.getUserLoyalty(userId);

    const rewards = [
      {
        id: 'discount_coupon',
        name: 'Kupon Zniżkowy',
        description: 'Otrzymaj kupon zniżkowy na podstawie swojego poziomu',
        pointsCost: 0,
        type: 'coupon',
        available: true
      },
      {
        id: 'free_shipping',
        name: 'Darmowa Dostawa',
        description: 'Darmowa dostawa na następny zakup',
        pointsCost: 500,
        type: 'shipping',
        available: loyalty.points >= 500
      },
      {
        id: 'priority_support',
        name: 'Priorytetowe Wsparcie',
        description: 'Priorytetowe wsparcie przez 30 dni',
        pointsCost: 1000,
        type: 'support',
        available: loyalty.points >= 1000
      },
      {
        id: 'exclusive_offers',
        name: 'Ekskluzywne Oferty',
        description: 'Dostęp do ekskluzywnych ofert przez 7 dni',
        pointsCost: 2000,
        type: 'offers',
        available: loyalty.points >= 2000
      }
    ];

    res.json({
      success: true,
      rewards,
      userPoints: loyalty.points
    });
  } catch (error) {
    console.error('Błąd pobierania nagród:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania dostępnych nagród'
    });
  }
};

// Wykupienie nagrody
exports.redeemReward = async (req, res) => {
  try {
    const userId = req.userId;
    const { rewardId } = req.body;

    let result;

    switch (rewardId) {
      case 'discount_coupon':
        const coupon = await loyaltyService.generateDiscountCoupon(userId);
        result = { type: 'coupon', data: coupon };
        break;

      case 'free_shipping':
        await loyaltyService.spendPoints(userId, 500, 'Darmowa dostawa');
        result = { type: 'shipping', data: { validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } };
        break;

      case 'priority_support':
        await loyaltyService.spendPoints(userId, 1000, 'Priorytetowe wsparcie');
        result = { type: 'support', data: { validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } };
        break;

      case 'exclusive_offers':
        await loyaltyService.spendPoints(userId, 2000, 'Ekskluzywne oferty');
        result = { type: 'offers', data: { validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } };
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Nieprawidłowa nagroda'
        });
    }

    res.json({
      success: true,
      reward: result,
      message: 'Nagroda została wykupiona pomyślnie'
    });
  } catch (error) {
    console.error('Błąd wykupywania nagrody:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd wykupywania nagrody'
    });
  }
};

// Pobieranie statystyk lojalności (dla adminów)
exports.getLoyaltyStats = async (req, res) => {
  try {
    // Sprawdź czy użytkownik jest adminem
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Brak uprawnień'
      });
    }

    const stats = await loyaltyService.getLoyaltyStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Błąd pobierania statystyk:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania statystyk lojalności'
    });
  }
};

// Resetowanie punktów użytkownika (dla adminów)
exports.resetUserPoints = async (req, res) => {
  try {
    // Sprawdź czy użytkownik jest adminem
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Brak uprawnień'
      });
    }

    const { userId } = req.params;
    const loyalty = await loyaltyService.resetUserPoints(userId);

    res.json({
      success: true,
      loyalty,
      message: 'Punkty użytkownika zostały zresetowane'
    });
  } catch (error) {
    console.error('Błąd resetowania punktów:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd resetowania punktów'
    });
  }
};

// Dodawanie punktów użytkownikowi (dla adminów)
exports.addUserPoints = async (req, res) => {
  try {
    // Sprawdź czy użytkownik jest adminem
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Brak uprawnień'
      });
    }

    const { userId } = req.params;
    const { points, reason } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Nieprawidłowa liczba punktów'
      });
    }

    const loyalty = await loyaltyService.addPoints(userId, points, reason || 'Dodane przez administratora');

    res.json({
      success: true,
      loyalty,
      message: `Dodano ${points} punktów użytkownikowi`
    });
  } catch (error) {
    console.error('Błąd dodawania punktów:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd dodawania punktów'
    });
  }
};

// Pobieranie informacji o poziomach
exports.getLevelsInfo = async (req, res) => {
  try {
    const levels = loyaltyService.levels;
    const badges = loyaltyService.badges;

    res.json({
      success: true,
      levels,
      badges
    });
  } catch (error) {
    console.error('Błąd pobierania informacji o poziomach:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania informacji o poziomach'
    });
  }
};

// Pobieranie rankingu użytkowników
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, type = 'points' } = req.query;

    let sortField;
    switch (type) {
      case 'points':
        sortField = 'loyalty.points';
        break;
      case 'level':
        sortField = 'loyalty.level';
        break;
      case 'badges':
        sortField = 'loyalty.badges';
        break;
      default:
        sortField = 'loyalty.points';
    }

    const users = await User.find({ 'loyalty.points': { $exists: true } })
      .select('firstName lastName loyalty.points loyalty.level loyalty.badges')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      name: `${user.firstName} ${user.lastName}`,
      points: user.loyalty.points,
      level: user.loyalty.level,
      badgesCount: user.loyalty.badges.length
    }));

    res.json({
      success: true,
      leaderboard,
      type
    });
  } catch (error) {
    console.error('Błąd pobierania rankingu:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania rankingu'
    });
  }
}; 