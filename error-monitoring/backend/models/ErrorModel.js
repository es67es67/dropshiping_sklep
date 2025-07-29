const mongoose = require('mongoose');

const ErrorSchema = new mongoose.Schema({
  // Podstawowe informacje o błędzie
  message: {
    type: String,
    required: true,
    index: true
  },
  stack: {
    type: String,
    required: true
  },
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
  
  // Context informacje
  url: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: false
  },
  browser: {
    type: String,
    required: false
  },
  os: {
    type: String,
    required: false
  },
  device: {
    type: String,
    required: false
  },
  
  // Użytkownik i sesja
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  sessionId: {
    type: String,
    required: false,
    index: true
  },
  userEmail: {
    type: String,
    required: false
  },
  
  // Performance i metryki
  performance: {
    loadTime: Number,
    memoryUsage: Number,
    cpuUsage: Number
  },
  
  // Grupowanie błędów
  errorHash: {
    type: String,
    required: true,
    index: true
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ErrorGroup',
    required: false,
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
  
  // Dodatkowe metadane
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  },
  
  // Timestamps
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
  occurrenceCount: {
    type: Number,
    required: true,
    default: 1
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indeksy dla szybkich zapytań
ErrorSchema.index({ createdAt: -1 });
ErrorSchema.index({ status: 1, severity: 1 });
ErrorSchema.index({ errorHash: 1, lastSeen: -1 });
ErrorSchema.index({ userId: 1, createdAt: -1 });
ErrorSchema.index({ groupId: 1, lastSeen: -1 });

// Virtual fields
ErrorSchema.virtual('age').get(function() {
  return Date.now() - this.firstSeen.getTime();
});

ErrorSchema.virtual('isRecent').get(function() {
  const oneHour = 60 * 60 * 1000;
  return Date.now() - this.lastSeen.getTime() < oneHour;
});

ErrorSchema.virtual('isFrequent').get(function() {
  const oneDay = 24 * 60 * 60 * 1000;
  const daysSinceFirst = (Date.now() - this.firstSeen.getTime()) / oneDay;
  return this.occurrenceCount / daysSinceFirst > 10; // więcej niż 10 błędów dziennie
});

// Metody instancji
ErrorSchema.methods.updateOccurrence = function() {
  this.occurrenceCount += 1;
  this.lastSeen = new Date();
  return this.save();
};

ErrorSchema.methods.resolve = function(resolvedBy) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolvedBy = resolvedBy;
  return this.save();
};

ErrorSchema.methods.ignore = function() {
  this.status = 'ignored';
  return this.save();
};

ErrorSchema.methods.assign = function(userId) {
  this.assignedTo = userId;
  this.status = 'investigating';
  return this.save();
};

// Metody statyczne
ErrorSchema.statics.findByHash = function(errorHash) {
  return this.findOne({ errorHash });
};

ErrorSchema.statics.findRecent = function(hours = 24) {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({ lastSeen: { $gte: cutoff } });
};

ErrorSchema.statics.findCritical = function() {
  return this.find({ 
    severity: 'critical',
    status: { $ne: 'resolved' }
  });
};

ErrorSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalErrors: { $sum: 1 },
        newErrors: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        resolvedErrors: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        criticalErrors: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        avgOccurrences: { $avg: '$occurrenceCount' }
      }
    }
  ]);
  
  return stats[0] || {
    totalErrors: 0,
    newErrors: 0,
    resolvedErrors: 0,
    criticalErrors: 0,
    avgOccurrences: 0
  };
};

module.exports = mongoose.model('Error', ErrorSchema); 