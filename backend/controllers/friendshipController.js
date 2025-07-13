const Friendship = require('../models/friendshipModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Review = require('../models/reviewModel');

// Wysyłanie zaproszenia do znajomych
exports.sendFriendRequest = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const requesterId = req.userId;

    // Sprawdź czy nie próbuje dodać samego siebie
    if (requesterId === recipientId) {
      return res.status(400).json({
        success: false,
        error: 'Nie możesz dodać samego siebie do znajomych'
      });
    }

    // Sprawdź czy użytkownik istnieje
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: 'Użytkownik nie został znaleziony'
      });
    }

    // Sprawdź czy już istnieje relacja
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingFriendship) {
      return res.status(400).json({
        success: false,
        error: 'Relacja między tymi użytkownikami już istnieje'
      });
    }

    // Utwórz nowe zaproszenie
    const friendship = new Friendship({
      requester: requesterId,
      recipient: recipientId,
      message: message || '',
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        device: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
      }
    });

    await friendship.save();

    // Pobierz pełne dane
    const fullFriendship = await Friendship.findById(friendship._id)
      .populate('requester', 'firstName lastName username avatar')
      .populate('recipient', 'firstName lastName username avatar');

    res.status(201).json({
      success: true,
      message: 'Zaproszenie zostało wysłane',
      friendship: fullFriendship
    });
  } catch (error) {
    console.error('Błąd wysyłania zaproszenia:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd wysyłania zaproszenia'
    });
  }
};

// Akceptowanie zaproszenia
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.userId;

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({
        success: false,
        error: 'Zaproszenie nie zostało znalezione'
      });
    }

    if (friendship.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do akceptowania tego zaproszenia'
      });
    }

    if (friendship.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Zaproszenie nie jest oczekujące'
      });
    }

    await friendship.accept();

    // Pobierz pełne dane
    const fullFriendship = await Friendship.findById(friendshipId)
      .populate('requester', 'firstName lastName username avatar')
      .populate('recipient', 'firstName lastName username avatar');

    res.json({
      success: true,
      message: 'Zaproszenie zostało zaakceptowane',
      friendship: fullFriendship
    });
  } catch (error) {
    console.error('Błąd akceptowania zaproszenia:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd akceptowania zaproszenia'
    });
  }
};

// Odrzucanie zaproszenia
exports.rejectFriendRequest = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const { reason } = req.body;
    const userId = req.userId;

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({
        success: false,
        error: 'Zaproszenie nie zostało znalezione'
      });
    }

    if (friendship.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do odrzucania tego zaproszenia'
      });
    }

    await friendship.reject(reason);

    res.json({
      success: true,
      message: 'Zaproszenie zostało odrzucone'
    });
  } catch (error) {
    console.error('Błąd odrzucania zaproszenia:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd odrzucania zaproszenia'
    });
  }
};

// Blokowanie użytkownika
exports.blockUser = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'Nie możesz zablokować samego siebie'
      });
    }

    // Znajdź istniejącą relację lub utwórz nową
    let friendship = await Friendship.findOne({
      $or: [
        { requester: currentUserId, recipient: targetUserId },
        { requester: targetUserId, recipient: currentUserId }
      ]
    });

    if (!friendship) {
      friendship = new Friendship({
        requester: currentUserId,
        recipient: targetUserId,
        status: 'blocked'
      });
    } else {
      await friendship.block();
    }

    await friendship.save();

    res.json({
      success: true,
      message: 'Użytkownik został zablokowany'
    });
  } catch (error) {
    console.error('Błąd blokowania użytkownika:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd blokowania użytkownika'
    });
  }
};

// Odblokowanie użytkownika
exports.unblockUser = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.userId;

    const friendship = await Friendship.findOne({
      $or: [
        { requester: currentUserId, recipient: targetUserId },
        { requester: targetUserId, recipient: currentUserId }
      ],
      status: 'blocked'
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        error: 'Użytkownik nie jest zablokowany'
      });
    }

    await friendship.unblock();

    res.json({
      success: true,
      message: 'Użytkownik został odblokowany'
    });
  } catch (error) {
    console.error('Błąd odblokowania użytkownika:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd odblokowania użytkownika'
    });
  }
};

// Usuwanie znajomego
exports.removeFriend = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.userId;

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({
        success: false,
        error: 'Relacja nie została znaleziona'
      });
    }

    if (friendship.requester.toString() !== userId && friendship.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do usunięcia tej relacji'
      });
    }

    await friendship.remove();

    res.json({
      success: true,
      message: 'Znajomy został usunięty'
    });
  } catch (error) {
    console.error('Błąd usuwania znajomego:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd usuwania znajomego'
    });
  }
};

// Pobieranie listy znajomych
exports.getFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    };

    const friendships = await Friendship.find(query)
      .populate('requester', 'firstName lastName username avatar')
      .populate('recipient', 'firstName lastName username avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Przekształć dane do łatwiejszego formatu
    const friends = friendships.map(friendship => {
      const friend = friendship.requester._id.toString() === userId 
        ? friendship.recipient 
        : friendship.requester;
      
      return {
        _id: friend._id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username,
        avatar: friend.avatar,
        friendshipId: friendship._id,
        friendsSince: friendship.respondedAt,
        interactionStats: friendship.interactionStats
      };
    });

    // Filtruj według wyszukiwania
    if (search) {
      const searchLower = search.toLowerCase();
      const filteredFriends = friends.filter(friend => 
        friend.firstName.toLowerCase().includes(searchLower) ||
        friend.lastName.toLowerCase().includes(searchLower) ||
        friend.username.toLowerCase().includes(searchLower)
      );
      
      return res.json({
        success: true,
        friends: filteredFriends,
        total: filteredFriends.length,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    const total = await Friendship.countDocuments(query);

    res.json({
      success: true,
      friends,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Błąd pobierania znajomych:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania znajomych'
    });
  }
};

// Pobieranie oczekujących zaproszeń
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const friendships = await Friendship.find({
      recipient: userId,
      status: 'pending'
    })
    .populate('requester', 'firstName lastName username avatar')
    .sort({ requestedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Friendship.countDocuments({
      recipient: userId,
      status: 'pending'
    });

    res.json({
      success: true,
      requests: friendships,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Błąd pobierania zaproszeń:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania zaproszeń'
    });
  }
};

// Pobieranie wysłanych zaproszeń
exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const friendships = await Friendship.find({
      requester: userId,
      status: 'pending'
    })
    .populate('recipient', 'firstName lastName username avatar')
    .sort({ requestedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Friendship.countDocuments({
      requester: userId,
      status: 'pending'
    });

    res.json({
      success: true,
      requests: friendships,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Błąd pobierania wysłanych zaproszeń:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania wysłanych zaproszeń'
    });
  }
};

// Pobieranie zablokowanych użytkowników
exports.getBlockedUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const friendships = await Friendship.find({
      $or: [
        { requester: userId, status: 'blocked' },
        { recipient: userId, status: 'blocked' }
      ]
    })
    .populate('requester', 'firstName lastName username avatar')
    .populate('recipient', 'firstName lastName username avatar')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const blockedUsers = friendships.map(friendship => {
      const blockedUser = friendship.requester._id.toString() === userId 
        ? friendship.recipient 
        : friendship.requester;
      
      return {
        _id: blockedUser._id,
        firstName: blockedUser.firstName,
        lastName: blockedUser.lastName,
        username: blockedUser.username,
        avatar: blockedUser.avatar,
        blockedAt: friendship.respondedAt,
        reason: friendship.reason
      };
    });

    const total = await Friendship.countDocuments({
      $or: [
        { requester: userId, status: 'blocked' },
        { recipient: userId, status: 'blocked' }
      ]
    });

    res.json({
      success: true,
      blockedUsers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Błąd pobierania zablokowanych użytkowników:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania zablokowanych użytkowników'
    });
  }
};

// Pobieranie wspólnych znajomych
exports.getMutualFriends = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.userId;

    const mutualFriends = await Friendship.getMutualFriends(currentUserId, targetUserId);

    res.json({
      success: true,
      mutualFriends: mutualFriends.length,
      friends: mutualFriends
    });
  } catch (error) {
    console.error('Błąd pobierania wspólnych znajomych:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania wspólnych znajomych'
    });
  }
};

// Pobieranie sugestii znajomych
exports.getFriendSuggestions = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10 } = req.query;

    const suggestions = await Friendship.getFriendSuggestions(userId, parseInt(limit));

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Błąd pobierania sugestii znajomych:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania sugestii znajomych'
    });
  }
};

// Aktualizacja ustawień powiadomień
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const { notifications } = req.body;
    const userId = req.userId;

    const friendship = await Friendship.findById(friendshipId);

    if (!friendship) {
      return res.status(404).json({
        success: false,
        error: 'Relacja nie została znaleziona'
      });
    }

    if (friendship.requester.toString() !== userId && friendship.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Nie masz uprawnień do aktualizacji tej relacji'
      });
    }

    friendship.notifications = { ...friendship.notifications, ...notifications };
    await friendship.save();

    res.json({
      success: true,
      message: 'Ustawienia powiadomień zostały zaktualizowane',
      notifications: friendship.notifications
    });
  } catch (error) {
    console.error('Błąd aktualizacji ustawień powiadomień:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd aktualizacji ustawień powiadomień'
    });
  }
};

// Statystyki znajomych
exports.getFriendsStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [totalFriends, pendingRequests, sentRequests, blockedUsers] = await Promise.all([
      Friendship.countDocuments({
        $or: [
          { requester: userId, status: 'accepted' },
          { recipient: userId, status: 'accepted' }
        ]
      }),
      Friendship.countDocuments({
        recipient: userId,
        status: 'pending'
      }),
      Friendship.countDocuments({
        requester: userId,
        status: 'pending'
      }),
      Friendship.countDocuments({
        $or: [
          { requester: userId, status: 'blocked' },
          { recipient: userId, status: 'blocked' }
        ]
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalFriends,
        pendingRequests,
        sentRequests,
        blockedUsers
      }
    });
  } catch (error) {
    console.error('Błąd pobierania statystyk znajomych:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania statystyk znajomych'
    });
  }
}; 