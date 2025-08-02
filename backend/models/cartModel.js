const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'productType',
    required: true
  },
  productType: {
    type: String,
    enum: ['Product', 'MarketplaceProduct'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
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
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  coupon: {
    code: { type: String },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' }
  },
  shipping: {
    method: { type: String },
    cost: { type: Number, default: 0 },
    address: {
      street: { type: String },
      houseNumber: { type: String },
      postalCode: { type: String },
      city: { type: String },
      country: { type: String, default: 'Polska' }
    }
  },
  payment: {
    method: { type: String },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: { type: String }
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dni
    }
  }
}, { timestamps: true });

// Metody koszyka
cartSchema.methods.addItem = async function(productId, quantity = 1, options = [], productType = 'Product') {
  console.log('🛒 Dodawanie produktu do koszyka:', { productId, quantity, options, productType });
  
  // Pobierz produkt, aby uzyskać cenę
  const ProductModel = mongoose.model(productType);
  const product = await ProductModel.findById(productId);
  
  if (!product) {
    console.log('❌ Produkt nie został znaleziony:', productId);
    throw new Error('Produkt nie został znaleziony');
  }

  console.log('✅ Znaleziono produkt:', { name: product.name, price: product.price });

  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString() &&
    item.productType === productType &&
    JSON.stringify(item.selectedOptions) === JSON.stringify(options)
  );

  if (existingItem) {
    console.log('🔄 Aktualizuję istniejący element koszyka');
    existingItem.quantity += quantity;
    // Aktualizuj cenę na wypadek zmiany
    existingItem.price = product.price;
    existingItem.originalPrice = product.originalPrice;
  } else {
    console.log('➕ Dodaję nowy element do koszyka z ceną:', product.price);
    this.items.push({
      product: productId,
      productType: productType,
      quantity,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      selectedOptions: options
    });
  }

  console.log('💾 Zapisuję koszyk...');
  return this.save();
};

cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
  return this.save();
};

cartSchema.methods.updateQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  return this.save();
};

cartSchema.methods.clear = function() {
  this.items = [];
  this.coupon = null;
  return this.save();
};

cartSchema.methods.getSubtotal = function() {
  return this.items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const optionsTotal = item.selectedOptions.reduce((sum, option) => sum + (option.price || 0), 0) * item.quantity;
    return total + itemTotal + optionsTotal;
  }, 0);
};

cartSchema.methods.getDiscount = function() {
  if (!this.coupon) return 0;
  
  const subtotal = this.getSubtotal();
  if (this.coupon.discountType === 'percentage') {
    return (subtotal * this.coupon.discount) / 100;
  }
  return this.coupon.discount;
};

cartSchema.methods.getShippingCost = function() {
  return this.shipping.cost || 0;
};

cartSchema.methods.getTotal = function() {
  const subtotal = this.getSubtotal();
  const discount = this.getDiscount();
  const shipping = this.getShippingCost();
  return Math.max(0, subtotal - discount + shipping);
};

cartSchema.methods.getItemCount = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

cartSchema.methods.applyCoupon = function(couponCode) {
  // TODO: Sprawdź kupon w bazie danych
  this.coupon = {
    code: couponCode,
    discount: 10, // 10% zniżki
    discountType: 'percentage'
  };
  return this.save();
};

cartSchema.methods.removeCoupon = function() {
  this.coupon = null;
  return this.save();
};

// Indeksy
cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Cart', cartSchema); 