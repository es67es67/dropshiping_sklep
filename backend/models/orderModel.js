const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  selectedOptions: [{
    name: { type: String },
    value: { type: String },
    price: { type: Number, default: 0 }
  }],
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Status zamówienia
  status: {
    type: String,
    enum: [
      'pending',      // Oczekujące na płatność
      'paid',         // Opłacone
      'processing',   // W przygotowaniu
      'shipped',      // Wysłane
      'delivered',    // Dostarczone
      'cancelled',    // Anulowane
      'refunded'      // Zwrócone
    ],
    default: 'pending'
  },
  
  // Płatność
  payment: {
    method: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'PLN' },
    paidAt: { type: Date }
  },
  
  // Dostawa
  shipping: {
    method: { type: String, required: true },
    cost: { type: Number, default: 0 },
    trackingNumber: { type: String },
    carrier: { type: String },
    estimatedDelivery: { type: Date },
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      apartment: { type: String },
      postalCode: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, default: 'Polska' }
    }
  },
  
  // Rachunek
  billing: {
    address: {
      firstName: { type: String },
      lastName: { type: String },
      company: { type: String },
      nip: { type: String },
      street: { type: String },
      houseNumber: { type: String },
      postalCode: { type: String },
      city: { type: String },
      country: { type: String, default: 'Polska' }
    },
    sameAsShipping: { type: Boolean, default: true }
  },
  
  // Ceny
  pricing: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  
  // Kupon
  coupon: {
    code: { type: String },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'] }
  },
  
  // Historia statusów
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Notatki
  notes: {
    customer: { type: String },
    internal: { type: String }
  },
  
  // Faktura
  invoice: {
    number: { type: String },
    issuedAt: { type: Date },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'issued', 'paid'], default: 'pending' }
  },
  
  // Zwroty
  returns: [{
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number },
      reason: { type: String },
      status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'] }
    }],
    reason: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'] },
    createdAt: { type: Date, default: Date.now },
    processedAt: { type: Date }
  }],
  
  // Powiadomienia
  notifications: [{
    type: { type: String, enum: ['email', 'sms', 'push'] },
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
    content: { type: String }
  }]
}, { timestamps: true });

// Generowanie numeru zamówienia
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
  }
  next();
});

// Metody zamówienia
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy
  });
  
  // Automatyczne ustawienie daty płatności
  if (newStatus === 'paid' && !this.payment.paidAt) {
    this.payment.paidAt = new Date();
  }
  
  return this.save();
};

orderSchema.methods.calculateTotals = function() {
  const subtotal = this.items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const optionsTotal = item.selectedOptions.reduce((sum, option) => sum + (option.price || 0), 0) * item.quantity;
    return total + itemTotal + optionsTotal;
  }, 0);
  
  const discount = this.coupon ? 
    (this.coupon.discountType === 'percentage' ? 
      (subtotal * this.coupon.discount) / 100 : 
      this.coupon.discount) : 0;
  
  const tax = (subtotal - discount) * 0.23; // 23% VAT
  
  this.pricing = {
    subtotal,
    discount,
    shippingCost: this.shipping.cost,
    tax,
    total: subtotal - discount + this.shipping.cost + tax
  };
  
  this.payment.amount = this.pricing.total;
  
  return this.save();
};

orderSchema.methods.addReturn = function(items, reason) {
  this.returns.push({
    items,
    reason,
    status: 'pending'
  });
  return this.save();
};

orderSchema.methods.generateInvoice = function() {
  if (!this.invoice.number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoice.number = `FV-${year}${month}-${random}`;
    this.invoice.issuedAt = new Date();
    this.invoice.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 dni
    this.invoice.status = 'issued';
  }
  return this.save();
};

// Indeksy
// orderSchema.index({ orderNumber: 1 }); // USUNIĘTO, bo pole orderNumber ma już unique: true
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema); 