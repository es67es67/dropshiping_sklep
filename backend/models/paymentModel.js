const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Informacje o płatności
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'PLN'
  },
  method: {
    type: String,
    enum: ['card', 'transfer', 'paypal', 'blik', 'cash_on_delivery'],
    required: true
  },
  
  // Status płatności
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // Dane karty (zaszyfrowane)
  cardDetails: {
    last4: { type: String },
    brand: { type: String },
    expiryMonth: { type: String },
    expiryYear: { type: String }
  },
  
  // Transakcja
  transaction: {
    id: { type: String },
    gateway: { type: String }, // 'stripe', 'payu', 'paypal'
    gatewayTransactionId: { type: String },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed }
  },
  
  // Historia statusów
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    gatewayResponse: { type: mongoose.Schema.Types.Mixed }
  }],
  
  // Zwroty
  refunds: [{
    amount: { type: Number, required: true },
    reason: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'] },
    gatewayRefundId: { type: String },
    createdAt: { type: Date, default: Date.now },
    processedAt: { type: Date }
  }],
  
  // Metadane
  metadata: {
    ip: { type: String },
    userAgent: { type: String },
    device: { type: String }
  },
  
  // Faktura
  invoice: {
    number: { type: String },
    issuedAt: { type: Date },
    dueDate: { type: Date }
  }
}, { timestamps: true });

// Metody płatności
paymentSchema.methods.updateStatus = function(newStatus, note = '', gatewayResponse = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    gatewayResponse
  });
  
  // Automatyczne ustawienie daty ukończenia
  if (newStatus === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  return this.save();
};

paymentSchema.methods.addRefund = function(amount, reason) {
  this.refunds.push({
    amount,
    reason,
    status: 'pending'
  });
  
  if (this.status === 'completed') {
    this.status = 'refunded';
  }
  
  return this.save();
};

paymentSchema.methods.getTotalRefunded = function() {
  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
};

paymentSchema.methods.getRemainingAmount = function() {
  return this.amount - this.getTotalRefunded();
};

// Indeksy
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'transaction.gatewayTransactionId': 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema); 