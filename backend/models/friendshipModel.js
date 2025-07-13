const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  // Użytkownik wysyłający zaproszenie
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Użytkownik otrzymujący zaproszenie
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Status relacji
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  
  // Data wysłania zaproszenia
  requestedAt: {
    type: Date,
    default: Date.now
  },
  
  // Data odpowiedzi (akceptacja/odrzucenie)
  respondedAt: {
    type: Date
  },
  
  // Wiadomość z zaproszeniem
  message: {
    type: String,
    maxlength: 500
  },
  
  // Powód odrzucenia/blokady
  reason: {
    type: String,
    maxlength: 200
  },
  
  // Czy relacja jest wzajemna
  isMutual: {
    type: Boolean,
    default: false
  },
  
  // Wspólne zainteresowania (automatycznie wykrywane)
  commonInterests: [{
    type: String
  }],
  
  // Wspólne lokalizacje
  commonLocations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  
  // Wspólne sklepy (gdzie obaj kupują)
  commonShops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  }],
  
  // Statystyki interakcji
  interactionStats: {
    messagesSent: { type: Number, default: 0 },
    messagesReceived: { type: Number, default: 0 },
    productsShared: { type: Number, default: 0 },
    reviewsLiked: { type: Number, default: 0 },
    lastInteraction: { type: Date }
  },
  
  // Ustawienia powiadomień
  notifications: {
    newProducts: { type: Boolean, default: true },
    newReviews: { type: Boolean, default: true },
    newShops: { type: Boolean, default: true },
    activity: { type: Boolean, default: true }
  },
  
  // Metadane
  metadata: {
    ip: { type: String },
    userAgent: { type: String },
    device: { type: String }
  }
}, { timestamps: true });

// Indeksy dla wydajności
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ status: 1, requestedAt: -1 });
friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });

// Metody instancji
friendshipSchema.methods.accept = function() {
  this.status = 'accepted';
  this.respondedAt = new Date();
  return this.save();
};

friendshipSchema.methods.reject = function(reason = '') {
  this.status = 'rejected';
  this.respondedAt = new Date();
  this.reason = reason;
  return this.save();
};

friendshipSchema.methods.block = function(reason = '') {
  this.status = 'blocked';
  this.respondedAt = new Date();
  this.reason = reason;
  return this.save();
};

friendshipSchema.methods.unblock = function() {
  this.status = 'pending';
  this.respondedAt = null;
  this.reason = '';
  return this.save();
};

friendshipSchema.methods.updateInteraction = function(type) {
  switch (type) {
    case 'message_sent':
      this.interactionStats.messagesSent += 1;
      break;
    case 'message_received':
      this.interactionStats.messagesReceived += 1;
      break;
    case 'product_shared':
      this.interactionStats.productsShared += 1;
      break;
    case 'review_liked':
      this.interactionStats.reviewsLiked += 1;
      break;
  }
  this.interactionStats.lastInteraction = new Date();
  return this.save();
};

// Metody statyczne
friendshipSchema.statics.getFriends = function(userId) {
  return this.find({
    $or: [
      { requester: userId, status: 'accepted' },
      { recipient: userId, status: 'accepted' }
    ]
  }).populate('requester', 'firstName lastName avatar username')
    .populate('recipient', 'firstName lastName avatar username');
};

friendshipSchema.statics.getPendingRequests = function(userId) {
  return this.find({
    recipient: userId,
    status: 'pending'
  }).populate('requester', 'firstName lastName avatar username');
};

friendshipSchema.statics.getSentRequests = function(userId) {
  return this.find({
    requester: userId,
    status: 'pending'
  }).populate('recipient', 'firstName lastName avatar username');
};

friendshipSchema.statics.getBlockedUsers = function(userId) {
  return this.find({
    $or: [
      { requester: userId, status: 'blocked' },
      { recipient: userId, status: 'blocked' }
    ]
  }).populate('requester', 'firstName lastName avatar username')
    .populate('recipient', 'firstName lastName avatar username');
};

friendshipSchema.statics.getMutualFriends = function(userId1, userId2) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { requester: userId1, status: 'accepted' },
          { recipient: userId1, status: 'accepted' }
        ]
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'requester',
        foreignField: '_id',
        as: 'requesterUser'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'recipient',
        foreignField: '_id',
        as: 'recipientUser'
      }
    },
    {
      $addFields: {
        friendId: {
          $cond: {
            if: { $eq: ['$requester', userId1] },
            then: '$recipient',
            else: '$requester'
          }
        }
      }
    },
    {
      $lookup: {
        from: 'friendships',
        let: { friendId: '$friendId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ['$requester', userId2] },
                      { $eq: ['$recipient', userId2] }
                    ]
                  },
                  {
                    $or: [
                      { $eq: ['$requester', '$$friendId'] },
                      { $eq: ['$recipient', '$$friendId'] }
                    ]
                  },
                  { $eq: ['$status', 'accepted'] }
                ]
              }
            }
          }
        ],
        as: 'mutualFriendship'
      }
    },
    {
      $match: {
        'mutualFriendship.0': { $exists: true }
      }
    }
  ]);
};

friendshipSchema.statics.getFriendSuggestions = function(userId, limit = 10) {
  return this.aggregate([
    // Znajdź znajomych użytkownika
    {
      $match: {
        $or: [
          { requester: userId, status: 'accepted' },
          { recipient: userId, status: 'accepted' }
        ]
      }
    },
    {
      $addFields: {
        friendId: {
          $cond: {
            if: { $eq: ['$requester', userId] },
            then: '$recipient',
            else: '$requester'
          }
        }
      }
    },
    // Znajdź znajomych znajomych
    {
      $lookup: {
        from: 'friendships',
        let: { friendId: '$friendId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ['$requester', '$$friendId'] },
                      { $eq: ['$recipient', '$$friendId'] }
                    ]
                  },
                  { $eq: ['$status', 'accepted'] },
                  { $ne: ['$requester', userId] },
                  { $ne: ['$recipient', userId] }
                ]
              }
            }
          }
        ],
        as: 'friendsOfFriends'
      }
    },
    {
      $unwind: '$friendsOfFriends'
    },
    {
      $addFields: {
        suggestedUserId: {
          $cond: {
            if: { $eq: ['$friendsOfFriends.requester', '$friendId'] },
            then: '$friendsOfFriends.recipient',
            else: '$friendsOfFriends.requester'
          }
        }
      }
    },
    // Grupuj i licz wystąpienia
    {
      $group: {
        _id: '$suggestedUserId',
        mutualFriends: { $addToSet: '$friendId' },
        count: { $sum: 1 }
      }
    },
    // Sprawdź czy już nie są znajomymi
    {
      $lookup: {
        from: 'friendships',
        let: { suggestedUserId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ['$requester', userId] },
                      { $eq: ['$recipient', userId] }
                    ]
                  },
                  {
                    $or: [
                      { $eq: ['$requester', '$$suggestedUserId'] },
                      { $eq: ['$recipient', '$$suggestedUserId'] }
                    ]
                  }
                ]
              }
            }
          }
        ],
        as: 'existingFriendship'
      }
    },
    {
      $match: {
        'existingFriendship.0': { $exists: false }
      }
    },
    // Pobierz dane użytkownika
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    // Sortuj według liczby wspólnych znajomych
    {
      $sort: { count: -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        _id: 0,
        user: {
          _id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          username: '$user.username',
          avatar: '$user.avatar'
        },
        mutualFriendsCount: '$count',
        mutualFriends: { $size: '$mutualFriends' }
      }
    }
  ]);
};

// Hook przed zapisem - sprawdź czy relacja nie istnieje
friendshipSchema.pre('save', function(next) {
  if (this.isNew) {
    // Sprawdź czy już istnieje relacja między tymi użytkownikami
    this.constructor.findOne({
      $or: [
        { requester: this.requester, recipient: this.recipient },
        { requester: this.recipient, recipient: this.requester }
      ]
    }).then(existing => {
      if (existing) {
        const error = new Error('Relacja między tymi użytkownikami już istnieje');
        return next(error);
      }
      next();
    }).catch(next);
  } else {
    next();
  }
});

module.exports = mongoose.model('Friendship', friendshipSchema); 