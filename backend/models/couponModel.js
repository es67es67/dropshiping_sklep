const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  // Kod kuponu
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Typ kuponu
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping', 'buy_one_get_one'],
    required: true
  },
  
  // Wartość zniżki
  value: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Waluta (dla zniżek stałych)
  currency: {
    type: String,
    default: 'PLN'
  },
  
  // Minimalna wartość zamówienia
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  
  // Maksymalna wartość zniżki
  maximumDiscount: {
    type: Number
  },
  
  // Kategorie produktów (puste = wszystkie)
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Produkty (puste = wszystkie)
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Sklepy (puste = wszystkie)
  shops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  }],
  
  // Użytkownicy (puste = wszyscy)
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Grupy użytkowników
  userGroups: [{
    type: String,
    enum: ['new_users', 'vip', 'loyal_customers', 'wholesale']
  }],
  
  // Data ważności
  validFrom: {
    type: Date,
    default: Date.now
  },
  
  validUntil: {
    type: Date,
    required: true
  },
  
  // Limit użyć
  usageLimit: {
    type: Number,
    default: null // null = bez limitu
  },
  
  // Liczba użyć na użytkownika
  usageLimitPerUser: {
    type: Number,
    default: 1
  },
  
  // Liczba użyć na zamówienie
  usageLimitPerOrder: {
    type: Number,
    default: 1
  },
  
  // Czy można łączyć z innymi kuponami
  combinable: {
    type: Boolean,
    default: false
  },
  
  // Czy kupon jest aktywny
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Priorytet (wyższy = pierwszy)
  priority: {
    type: Number,
    default: 0
  },
  
  // Opis kuponu
  description: {
    type: String,
    maxlength: 500
  },
  
  // Warunki specjalne
  conditions: {
    firstTimePurchase: { type: Boolean, default: false },
    minimumItems: { type: Number, default: 0 },
    specificDays: [{ type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }],
    specificHours: {
      from: { type: String }, // format: "HH:MM"
      to: { type: String }
    }
  },
  
  // Statystyki użycia
  usage: {
    totalUses: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    lastUsed: { type: Date }
  },
  
  // Historia użyć
  usageHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    discount: { type: Number },
    usedAt: { type: Date, default: Date.now }
  }],
  
  // Twórca kuponu
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Metadane
  metadata: {
    campaign: { type: String },
    source: { type: String },
    tags: [{ type: String }]
  }
}, { timestamps: true });

// Metody kuponu
couponSchema.methods.isValid = function(userId = null, orderValue = 0, items = []) {
  const now = new Date();
  
  // Sprawdź datę ważności
  if (now < this.validFrom || now > this.validUntil) {
    return { valid: false, reason: 'Kupon wygasł lub nie jest jeszcze aktywny' };
  }
  
  // Sprawdź czy jest aktywny
  if (!this.isActive) {
    return { valid: false, reason: 'Kupon jest nieaktywny' };
  }
  
  // Sprawdź limit użyć
  if (this.usageLimit && this.usage.totalUses >= this.usageLimit) {
    return { valid: false, reason: 'Limit użyć kuponu został wyczerpany' };
  }
  
  // Sprawdź minimalną wartość zamówienia
  if (orderValue < this.minimumOrderValue) {
    return { valid: false, reason: `Minimalna wartość zamówienia: ${this.minimumOrderValue} zł` };
  }
  
  // Sprawdź użytkownika
  if (userId) {
    if (this.users.length > 0 && !this.users.includes(userId)) {
      return { valid: false, reason: 'Kupon nie jest dostępny dla tego użytkownika' };
    }
    
    // Sprawdź limit użyć na użytkownika
    const userUses = this.usageHistory.filter(h => h.user.toString() === userId.toString()).length;
    if (userUses >= this.usageLimitPerUser) {
      return { valid: false, reason: 'Osiągnięto limit użyć kuponu' };
    }
  }
  
  // Sprawdź produkty
  if (this.products.length > 0) {
    const orderProductIds = items.map(item => item.product.toString());
    const hasValidProduct = this.products.some(productId => 
      orderProductIds.includes(productId.toString())
    );
    if (!hasValidProduct) {
      return { valid: false, reason: 'Kupon nie dotyczy produktów w koszyku' };
    }
  }
  
  // Sprawdź warunki specjalne
  if (this.conditions.minimumItems > 0) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems < this.conditions.minimumItems) {
      return { valid: false, reason: `Minimalna liczba produktów: ${this.conditions.minimumItems}` };
    }
  }
  
  if (this.conditions.specificDays.length > 0) {
    const today = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    if (!this.conditions.specificDays.includes(today)) {
      return { valid: false, reason: 'Kupon dostępny tylko w określone dni' };
    }
  }
  
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function(orderValue, items = []) {
  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (orderValue * this.value) / 100;
      break;
    case 'fixed':
      discount = this.value;
      break;
    case 'free_shipping':
      discount = 15.99; // Standardowa dostawa
      break;
    case 'buy_one_get_one':
      // Logika BOGO
      discount = this.calculateBOGODiscount(items);
      break;
  }
  
  // Zastosuj maksymalną zniżkę
  if (this.maximumDiscount && discount > this.maximumDiscount) {
    discount = this.maximumDiscount;
  }
  
  // Nie może być większa niż wartość zamówienia
  if (discount > orderValue) {
    discount = orderValue;
  }
  
  return Math.round(discount * 100) / 100;
};

couponSchema.methods.calculateBOGODiscount = function(items) {
  // Implementacja BOGO - najtańszy produkt gratis
  if (items.length < 2) return 0;
  
  const sortedItems = items.sort((a, b) => a.price - b.price);
  return sortedItems[0].price;
};

couponSchema.methods.use = function(userId, orderId, discount) {
  this.usage.totalUses += 1;
  this.usage.totalDiscount += discount;
  this.usage.lastUsed = new Date();
  
  this.usageHistory.push({
    user: userId,
    order: orderId,
    discount,
    usedAt: new Date()
  });
  
  return this.save();
};

// Statyczne metody
couponSchema.statics.findValidCoupon = async function(code, userId, orderValue, items) {
  const coupon = await this.findOne({ code: code.toUpperCase() });
  
  if (!coupon) {
    return { valid: false, reason: 'Nieprawidłowy kod kuponu' };
  }
  
  const validation = coupon.isValid(userId, orderValue, items);
  if (!validation.valid) {
    return validation;
  }
  
  return { valid: true, coupon };
};

// Indeksy
// couponSchema.index({ code: 1 }); // USUNIĘTO, bo pole code ma już unique: true
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ users: 1 });
couponSchema.index({ products: 1 });
couponSchema.index({ shops: 1 });
couponSchema.index({ priority: -1 });

module.exports = mongoose.model('Coupon', couponSchema); 