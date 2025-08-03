const mongoose = require('mongoose');

const errorGroupSchema = new mongoose.Schema({
  // Podstawowe informacje o grupie
  hash: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  stack: {
    type: String,
    maxlength: 10000
  },
  
  // Typ i ważność
  type: {
    type: String,
    required: true,
    enum: ['javascript_error', 'react_error', 'promise_rejection', 'api_error', 'network_error', 'validation_error', 'authentication_error', 'database_error', 'unknown'],
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
    default: 1
  },
  uniqueUsers: {
    type: Number,
    default: 1
  },
  affectedUrls: [{
    type: String,
    maxlength: 500
  }],
  
  // Timestamps
  firstSeen: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Status grupy
  status: {
    type: String,
    enum: ['active', 'investigating', 'resolved', 'ignored'],
    default: 'active'
  },
  resolvedAt: {
    type: Date
  },
  
  // Tagi i kategorie
  tags: [{
    type: String,
    maxlength: 50
  }],
  
  // Komentarze i notatki
  notes: [{
    content: String,
    author: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Alerty
  alertsSent: {
    type: Boolean,
    default: false
  },
  alertChannels: [{
    type: String,
    enum: ['email', 'slack', 'discord']
  }],
  
  // Metryki trendów
  trend: {
    type: String,
    enum: ['increasing', 'stable', 'decreasing'],
    default: 'stable'
  },
  
  // Priorytet
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Przypisany developer
  assignedTo: {
    type: String
  },
  
  // Linki do issue tracker
  issueLinks: [{
    platform: String, // 'github', 'jira', 'linear', etc.
    url: String,
    title: String
  }]
}, {
  timestamps: true,
  collection: 'error_groups'
});

// Indeksy dla wydajności
errorGroupSchema.index({ status: 1, lastSeen: -1 });
errorGroupSchema.index({ severity: 1, lastSeen: -1 });
errorGroupSchema.index({ type: 1, lastSeen: -1 });
errorGroupSchema.index({ priority: 1, lastSeen: -1 });

// Metody instancji
errorGroupSchema.methods.updateStats = function(errorData) {
  this.totalOccurrences += 1;
  this.lastSeen = new Date();
  
  // Dodaj URL jeśli nie istnieje
  if (errorData.url && !this.affectedUrls.includes(errorData.url)) {
    this.affectedUrls.push(errorData.url);
  }
  
  // Aktualizuj trend
  this.updateTrend();
  
  return this.save();
};

errorGroupSchema.methods.updateTrend = function() {
  // Prosta logika trendu - można rozszerzyć o bardziej zaawansowaną analizę
  const hoursSinceFirstSeen = (Date.now() - this.firstSeen.getTime()) / (1000 * 60 * 60);
  const occurrencesPerHour = this.totalOccurrences / hoursSinceFirstSeen;
  
  if (occurrencesPerHour > 2) {
    this.trend = 'increasing';
  } else if (occurrencesPerHour < 0.1) {
    this.trend = 'decreasing';
  } else {
    this.trend = 'stable';
  }
};

errorGroupSchema.methods.markAsResolved = function() {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  return this.save();
};

errorGroupSchema.methods.addNote = function(content, author) {
  this.notes.push({
    content,
    author: author || 'system',
    timestamp: new Date()
  });
  return this.save();
};

errorGroupSchema.methods.markAlertSent = function(channel) {
  this.alertsSent = true;
  if (channel && !this.alertChannels.includes(channel)) {
    this.alertChannels.push(channel);
  }
  return this.save();
};

errorGroupSchema.methods.assignTo = function(developer) {
  this.assignedTo = developer;
  return this.save();
};

errorGroupSchema.methods.addIssueLink = function(platform, url, title) {
  this.issueLinks.push({
    platform,
    url,
    title: title || `Issue for ${this.message}`
  });
  return this.save();
};

// Metody statyczne
errorGroupSchema.statics.findByHash = function(hash) {
  return this.findOne({ hash });
};

errorGroupSchema.statics.findActiveGroups = function() {
  return this.find({ status: 'active' }).sort({ lastSeen: -1 });
};

errorGroupSchema.statics.findBySeverity = function(severity) {
  return this.find({ severity }).sort({ lastSeen: -1 });
};

errorGroupSchema.statics.findByType = function(type) {
  return this.find({ type }).sort({ lastSeen: -1 });
};

errorGroupSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ lastSeen: -1 });
};

errorGroupSchema.statics.getGroupStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalGroups: { $sum: 1 },
        activeGroups: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        resolvedGroups: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        criticalGroups: {
          $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
        },
        highGroups: {
          $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
        },
        mediumGroups: {
          $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] }
        },
        lowGroups: {
          $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] }
        },
        totalOccurrences: { $sum: '$totalOccurrences' },
        totalUniqueUsers: { $sum: '$uniqueUsers' }
      }
    }
  ]);
};

errorGroupSchema.statics.getGroupsByType = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalOccurrences: { $sum: '$totalOccurrences' },
        critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
        medium: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
        low: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

errorGroupSchema.statics.getTrendingGroups = function(hours = 24) {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    lastSeen: { $gte: cutoff },
    status: 'active'
  }).sort({ totalOccurrences: -1 }).limit(10);
};

// Pre-save middleware
errorGroupSchema.pre('save', function(next) {
  // Ustaw tagi na podstawie typu i ważności
  if (!this.tags || this.tags.length === 0) {
    this.tags = [this.type, this.severity];
  }
  
  // Ustaw priorytet na podstawie ważności
  if (!this.priority) {
    switch (this.severity) {
      case 'critical':
        this.priority = 'urgent';
        break;
      case 'high':
        this.priority = 'high';
        break;
      case 'medium':
        this.priority = 'medium';
        break;
      case 'low':
        this.priority = 'low';
        break;
      default:
        this.priority = 'medium';
    }
  }
  
  next();
});

module.exports = mongoose.model('ErrorGroup', errorGroupSchema); 