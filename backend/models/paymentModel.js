const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  method: {
    type: String,
    enum: ['card', 'bank_transfer', 'paypal', 'cash_on_delivery', 'stripe', 'blik'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  currency: {
    type: String,
    default: 'PLN'
  },
  paymentData: {
    // Dane specyficzne dla metody płatności
    transactionId: String,
    cardLast4: String,
    cardBrand: String,
    bankName: String,
    accountNumber: String,
    paypalEmail: String,
    stripePaymentIntentId: String,
    blikCode: String
  },
  processedAt: {
    type: Date
  },
  failedAt: {
    type: Date
  },
  failureReason: {
    type: String,
    trim: true
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  refundedAt: {
    type: Date
  },
  refundReason: {
    type: String,
    trim: true
  },
  gatewayResponse: {
    // Odpowiedź z bramki płatności
    success: Boolean,
    message: String,
    code: String,
    rawResponse: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indeksy
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1 });
paymentSchema.index({ 'paymentData.transactionId': 1 });
paymentSchema.index({ createdAt: -1 });

// Middleware pre-save
paymentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.processedAt) {
      this.processedAt = new Date();
    }
    if (this.status === 'failed' && !this.failedAt) {
      this.failedAt = new Date();
    }
    if (this.status === 'refunded' && !this.refundedAt) {
      this.refundedAt = new Date();
    }
  }
  next();
});

// Metody statyczne
paymentSchema.statics.getByOrder = function(orderId) {
  return this.findOne({ order: orderId })
    .populate('order', 'totalAmount status');
};

paymentSchema.statics.getByStatus = function(status) {
  return this.find({ status })
    .populate('order', 'user totalAmount status')
    .sort({ createdAt: -1 });
};

paymentSchema.statics.getByMethod = function(method) {
  return this.find({ method })
    .populate('order', 'user totalAmount status')
    .sort({ createdAt: -1 });
};

paymentSchema.statics.getFailedPayments = function() {
  return this.find({ status: 'failed' })
    .populate('order', 'user totalAmount status')
    .sort({ failedAt: -1 });
};

// Metody instancji
paymentSchema.methods.process = function() {
  this.status = 'processing';
  return this.save();
};

paymentSchema.methods.complete = function(gatewayResponse = {}) {
  this.status = 'completed';
  this.processedAt = new Date();
  this.gatewayResponse = {
    success: true,
    ...gatewayResponse
  };
  return this.save();
};

paymentSchema.methods.fail = function(reason, gatewayResponse = {}) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.failureReason = reason;
  this.gatewayResponse = {
    success: false,
    message: reason,
    ...gatewayResponse
  };
  return this.save();
};

paymentSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

paymentSchema.methods.refund = function(amount, reason) {
  this.status = 'refunded';
  this.refundAmount = amount;
  this.refundedAt = new Date();
  this.refundReason = reason;
  return this.save();
};

// Wirtualne pola
paymentSchema.virtual('isSuccessful').get(function() {
  return this.status === 'completed';
});

paymentSchema.virtual('isFailed').get(function() {
  return this.status === 'failed';
});

paymentSchema.virtual('isRefunded').get(function() {
  return this.status === 'refunded';
});

paymentSchema.virtual('methodText').get(function() {
  const methodTexts = {
    card: 'Karta kredytowa',
    bank_transfer: 'Przelew bankowy',
    paypal: 'PayPal',
    cash_on_delivery: 'Płatność przy odbiorze',
    stripe: 'Stripe',
    blik: 'BLIK'
  };
  return methodTexts[this.method] || this.method;
});

paymentSchema.virtual('statusText').get(function() {
  const statusTexts = {
    pending: 'Oczekująca',
    processing: 'Przetwarzana',
    completed: 'Zakończona',
    failed: 'Nieudana',
    cancelled: 'Anulowana',
    refunded: 'Zwrócona'
  };
  return statusTexts[this.status] || this.status;
});

paymentSchema.virtual('statusColor').get(function() {
  const statusColors = {
    pending: '#ffc107',
    processing: '#17a2b8',
    completed: '#28a745',
    failed: '#dc3545',
    cancelled: '#6c757d',
    refunded: '#fd7e14'
  };
  return statusColors[this.status] || '#6c757d';
});

paymentSchema.virtual('maskedCardNumber').get(function() {
  if (this.paymentData && this.paymentData.cardLast4) {
    return `**** **** **** ${this.paymentData.cardLast4}`;
  }
  return null;
});

// Konfiguracja toJSON
paymentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    // Ukryj wrażliwe dane
    if (ret.paymentData) {
      delete ret.paymentData.cardLast4;
      delete ret.paymentData.accountNumber;
      delete ret.paymentData.blikCode;
    }
    return ret;
  }
});

module.exports = mongoose.model('Payment', paymentSchema); 