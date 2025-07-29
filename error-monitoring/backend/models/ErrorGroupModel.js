const mongoose = require('mongoose');

const ErrorGroupSchema = new mongoose.Schema({
  // Podstawowe informacje o grupie
  name: {
    type: String,
    required: true,
    index: true
  },
  errorHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  stack: {
    type: String,
    required: true
  },
  
  // Kategoryzacja
  errorType: {
    type: String,
    required: true,
    enum: ['javascript', 'react', 'network', 'api', 'system', 'unknown'],
    default: 'unknown'
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Statystyki grupy
  totalOccurrences: {
    type: Number,
    required: true,
    default: 0
  },
  uniqueUsers: {
    type: Number,
    required: true,
    default: 0
  },
  affectedUrls: {
    type: [String],
    default: []
  },
  
  // Timeline
  firstSeen: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  lastSeen: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  
  // Status i workflow
  status: {
    type: String,
    required: true,
    enum: ['new', 'investigating', 'resolved', 'ignored'],
    default: 'new',
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  resolvedAt: {
    type: Date,
    required: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  
  // Priorytet i tagi
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: {
    type: [String],
    default: []
  },
  
  // Alerting
  alerted: {
    type: Boolean,
    default: false
  },
  alertLevel: {
    type: String,
    enum: ['none', 'email', 'slack', 'critical'],
    default: 'none'
  },
  
  // Metadane
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  },
  
  // Trendy
  trend: {
    type: String,
    enum: ['increasing', 'decreasing', 'stable'],
    default: 'stable'
  },
  
  // Automatyczne rozwiązywanie
  autoResolve: {
    type: Boolean,
    default: false
  },
  autoResolveThreshold: {
    type: Number,
    default: 0 // 0 = wyłączone
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indeksy
ErrorGroupSchema.index({ createdAt: -1 });
ErrorGroupSchema.index({ status: 1, severity: 1 });
ErrorGroupSchema.index({ lastSeen: -1 });
ErrorGroupSchema.index({ priority: 1, status: 1 });

// Virtual fields
ErrorGroupSchema.virtual('age').get(function() {
  return Date.now() - this.firstSeen.getTime();
});

ErrorGroupSchema.virtual('isRecent').get(function() {
  const oneHour = 60 * 60 * 1000;
  return Date.now() - this.lastSeen.getTime() < oneHour;
});

ErrorGroupSchema.virtual('isFrequent').get(function() {
  const oneDay = 24 * 60 * 60 * 1000;
  const daysSinceFirst = (Date.now() - this.firstSeen.getTime()) / oneDay;
  return this.totalOccurrences / daysSinceFirst > 50; // więcej niż 50 błędów dziennie
});

ErrorGroupSchema.virtual('avgOccurrencesPerDay').get(function() {
  const oneDay = 24 * 60 * 60 * 1000;
  const daysSinceFirst = Math.max(1, (Date.now() - this.firstSeen.getTime()) / oneDay);
  return Math.round(this.totalOccurrences / daysSinceFirst);
});

// Metody instancji
ErrorGroupSchema.methods.updateStats = function(occurrenceCount, uniqueUsers, urls) {
  this.totalOccurrences += occurrenceCount;
  this.uniqueUsers = Math.max(this.uniqueUsers, uniqueUsers);
  
  if (urls && urls.length > 0) {
    urls.forEach(url => {
      if (!this.affectedUrls.includes(url)) {
        this.affectedUrls.push(url);
      }
    });
  }
  
  this.lastSeen = new Date();
  return this.save();
};

ErrorGroupSchema.methods.resolve = function(resolvedBy) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
  return this.save();
};

ErrorGroupSchema.methods.ignore = function() {
  this.status = 'ignored';
  return this.save();
};

ErrorGroupSchema.methods.assign = function(userId) {
  this.assignedTo = userId;
  this.status = 'investigating';
  return this.save();
};

ErrorGroupSchema.methods.updateTrend = function() {
  const Error = require('./ErrorModel');
  const oneDay = 24 * 60 * 60 * 1000;
  const yesterday = new Date(Date.now() - oneDay);
  const twoDaysAgo = new Date(Date.now() - 2 * oneDay);
  
  return Error.aggregate([
    { $match: { groupId: this._id } },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt"
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 3 }
  ]).then(results => {
    if (results.length >= 2) {
      const recent = results[0].count;
      const previous = results[1].count;
      
      if (recent > previous * 1.5) {
        this.trend = 'increasing';
      } else if (recent < previous * 0.7) {
        this.trend = 'decreasing';
      } else {
        this.trend = 'stable';
      }
    }
    return this.save();
  });
};

// Metody statyczne
ErrorGroupSchema.statics.findByHash = function(errorHash) {
  return this.findOne({ errorHash });
};

ErrorGroupSchema.statics.findActive = function() {
  return this.find({ 
    status: { $in: ['new', 'investigating'] }
  }).sort({ lastSeen: -1 });
};

ErrorGroupSchema.statics.findCritical = function() {
  return this.find({ 
    severity: 'critical',
    status: { $ne: 'resolved' }
  }).sort({ lastSeen: -1 });
};

ErrorGroupSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalGroups: { $sum: 1 },
        activeGroups: { $sum: { $cond: [{ $in: ['$status', ['new', 'investigating']] }, 1, 0] } },
        resolvedGroups: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        criticalGroups: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        totalOccurrences: { $sum: '$totalOccurrences' },
        avgOccurrencesPerGroup: { $avg: '$totalOccurrences' }
      }
    }
  ]);
  
  return stats[0] || {
    totalGroups: 0,
    activeGroups: 0,
    resolvedGroups: 0,
    criticalGroups: 0,
    totalOccurrences: 0,
    avgOccurrencesPerGroup: 0
  };
};

module.exports = mongoose.model('ErrorGroup', ErrorGroupSchema); 