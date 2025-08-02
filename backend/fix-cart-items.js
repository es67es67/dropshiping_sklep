const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model koszyka
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
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
  }],
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted'],
    default: 'active'
  }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

async function fixCartItems() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n🔧 Naprawiam elementy koszyka...');
    console.log('=====================================');

    // Znajdź wszystkie koszyki z elementami bez productType
    const carts = await Cart.find({
      'items.productType': { $exists: false }
    });

    console.log(`📊 Znaleziono ${carts.length} koszyków do naprawy`);

    for (const cart of carts) {
      console.log(`\n🔧 Naprawiam koszyk: ${cart._id}`);
      
      let updated = false;
      
      for (const item of cart.items) {
        if (!item.productType) {
          console.log(`  - Dodaję productType dla produktu: ${item.product}`);
          item.productType = 'Product'; // Domyślnie Product, bo to starsze elementy
          updated = true;
        }
      }
      
      if (updated) {
        await cart.save();
        console.log(`  ✅ Koszyk naprawiony`);
      }
    }

    console.log('\n✅ Naprawa zakończona!');
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixCartItems(); 