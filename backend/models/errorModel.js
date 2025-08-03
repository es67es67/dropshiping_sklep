const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  // Podstawowe informacje o błędzie
  id: {
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
  componentStack: {
    type: String,
    maxlength: 5000
  },
  
  // Typ i ważność błędu
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
  
  // Kontekst błędu
  url: {
    type: String,
    required: true,
    maxlength: 500
  },
  userAgent: {
    type: String,
    maxlength: 1000
  },
  route: {
    type: String,
    maxlength: 200
  },
  
  // Informacje o użytkowniku
  userId: {
    type: String,
    default: 'anonymous'
  },
  sessionId: {
    type: String
  },
  
  // Kontekst dodatkowy
  context: {
    componentName: String,
    filename: String,
    lineno: Number,
    colno: Number,
    additionalData: mongoose.Schema.Types.Mixed
  },
  
  // Metryki wydajności
  performance: {
    loadTime: Number,
    memoryUsage: Number,
    cpuUsage: Number
  },
  
  // Status błędu
  status: {
    type: String,
    enum: ['new', 'investigating', 'resolved', 'ignored', 'duplicate'],
    default: 'new'
  },
  
  // Grupowanie błędów
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ErrorGroup'
  },
  hash: {
    type: String,
    index: true
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  lastOccurrence: {
    type: Date,
    default: Date.now
  },
  
  // Licznik wystąpień
  occurrenceCount: {
    type: Number,
    default: 1
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
  }]
}, {
  timestamps: true,
  collection: 'errors'
});

// Indeksy dla wydajności
errorSchema.index({ timestamp: -1 });
errorSchema.index({ type: 1, timestamp: -1 });
errorSchema.index({ severity: 1, timestamp: -1 });
errorSchema.index({ status: 1, timestamp: -1 });
errorSchema.index({ userId: 1, timestamp: -1 });
errorSchema.index({ url: 1, timestamp: -1 });

// Metody instancji
errorSchema.methods.updateOccurrence = function() {
  this.occurrenceCount += 1;
  this.lastOccurrence = new Date();
  return this.save();
};

errorSchema.methods.markAsResolved = function() {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  return this.save();
};

errorSchema.methods.addNote = function(content, author) {
  this.notes.push({
    content,
    author: author || 'system',
    timestamp: new Date()
  });
  return this.save();
};

errorSchema.methods.markAlertSent = function(channel) {
  this.alertsSent = true;
  if (channel && !this.alertChannels.includes(channel)) {
    this.alertChannels.push(channel);
  }
  return this.save();
};

// Metody statyczne
errorSchema.statics.findByHash = function(hash) {
  return this.findOne({ hash });
};

errorSchema.statics.findRecentErrors = function(hours = 24) {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    timestamp: { $gte: cutoff }
  }).sort({ timestamp: -1 });
};

errorSchema.statics.findBySeverity = function(severity) {
  return this.find({ severity }).sort({ timestamp: -1 });
};

errorSchema.statics.findByType = function(type) {
  return this.find({ type }).sort({ timestamp: -1 });
};

errorSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ timestamp: -1 });
};

errorSchema.statics.getErrorStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalErrors: { $sum: 1 },
        criticalErrors: {
          $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
        },
        highErrors: {
          $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
        },
        mediumErrors: {
          $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] }
        },
        lowErrors: {
          $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] }
        },
        resolvedErrors: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        newErrors: {
          $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
        }
      }
    }
  ]);
};

errorSchema.statics.getErrorsByType = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
        medium: { $sum: { $cond: [{ $eq: ['$severity', 'medium'] }, 1, 0] } },
        low: { $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] } }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

errorSchema.statics.getErrorsByUrl = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$url',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        url: '$_id',
        count: 1,
        uniqueUserCount: { $size: '$uniqueUsers' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Pre-save middleware
errorSchema.pre('save', function(next) {
  // Generuj hash na podstawie stack trace i message
  if (!this.hash) {
    const crypto = require('crypto');
    const hashInput = `${this.message}${this.stack || ''}${this.componentStack || ''}`;
    this.hash = crypto.createHash('md5').update(hashInput).digest('hex');
  }
  
  // Ustaw tagi na podstawie typu i ważności
  if (!this.tags || this.tags.length === 0) {
    this.tags = [this.type, this.severity];
  }
  
  next();
});

module.exports = mongoose.model('Error', errorSchema); 