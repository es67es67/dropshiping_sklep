const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'paypal', 'cash_on_delivery'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    trackingNumber: String,
    shippedAt: Date,
    deliveredAt: Date
  },
  notes: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  }
}, {
  timestamps: true
});

// Indeksy
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });
orderSchema.index({ createdAt: -1 });

// Middleware pre-save
orderSchema.pre('save', function(next) {
  // Oblicz całkowitą kwotę jeśli nie jest ustawiona
  if (!this.totalAmount && this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
  }
  
  // Dodaj koszt wysyłki do całkowitej kwoty
  if (this.shipping && this.shipping.cost) {
    this.totalAmount += this.shipping.cost;
  }
  
  next();
});

// Metody statyczne
orderSchema.statics.getUserOrders = function(userId, options = {}) {
  const { status, page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;
  
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'username firstName lastName email')
    .populate('payment', 'status amount method');
};

orderSchema.statics.getOrdersByStatus = function(status) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .populate('user', 'username firstName lastName email');
};

orderSchema.statics.getPendingOrders = function() {
  return this.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .populate('user', 'username firstName lastName email');
};

// Metody instancji
orderSchema.methods.confirm = function() {
  this.status = 'confirmed';
  return this.save();
};

orderSchema.methods.markAsPaid = function(paymentId) {
  this.status = 'paid';
  this.payment = paymentId;
  return this.save();
};

orderSchema.methods.ship = function(trackingNumber, method = 'standard') {
  this.status = 'shipped';
  this.shipping.method = method;
  this.shipping.trackingNumber = trackingNumber;
  this.shipping.shippedAt = new Date();
  return this.save();
};

orderSchema.methods.deliver = function() {
  this.status = 'delivered';
  this.shipping.deliveredAt = new Date();
  return this.save();
};

orderSchema.methods.cancel = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  this.cancelledBy = cancelledBy;
  return this.save();
};

orderSchema.methods.refund = function(amount, reason) {
  this.status = 'refunded';
  this.refundAmount = amount;
  this.refundedAt = new Date();
  this.refundReason = reason;
  return this.save();
};

// Wirtualne pola
orderSchema.virtual('isCancellable').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

orderSchema.virtual('isRefundable').get(function() {
  return ['paid', 'shipped', 'delivered'].includes(this.status);
});

orderSchema.virtual('totalWithShipping').get(function() {
  return this.totalAmount + (this.shipping?.cost || 0);
});

orderSchema.virtual('statusText').get(function() {
  const statusTexts = {
    pending: 'Oczekujące',
    confirmed: 'Potwierdzone',
    paid: 'Opłacone',
    shipped: 'Wysłane',
    delivered: 'Dostarczone',
    cancelled: 'Anulowane',
    refunded: 'Zwrócone'
  };
  return statusTexts[this.status] || this.status;
});

orderSchema.virtual('statusColor').get(function() {
  const statusColors = {
    pending: '#ffc107',
    confirmed: '#17a2b8',
    paid: '#28a745',
    shipped: '#007bff',
    delivered: '#6f42c1',
    cancelled: '#dc3545',
    refunded: '#6c757d'
  };
  return statusColors[this.status] || '#6c757d';
});

// Konfiguracja toJSON
orderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema); 