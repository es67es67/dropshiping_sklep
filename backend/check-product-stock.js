const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model produktu marketplace
const marketplaceProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  seller: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  saleType: String,
  auction: {
    startPrice: Number,
    currentPrice: Number,
    minIncrement: Number,
    endTime: Date,
    bids: [{
      bidder: mongoose.Schema.Types.ObjectId,
      amount: Number,
      timestamp: Date
    }],
    isActive: Boolean
  }
});

const MarketplaceProduct = mongoose.model('MarketplaceProduct', marketplaceProductSchema);

async function checkProductStock() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const productId = process.argv[2] || '688c5b4a951d90a2cd876330';
    
    console.log(`\n🔍 Sprawdzam produkt o ID: ${productId}`);
    console.log('=====================================');

    // Sprawdź czy produkt istnieje
    const product = await MarketplaceProduct.findById(productId);
    
    if (!product) {
      console.log('❌ Produkt nie został znaleziony!');
      return;
    }

    console.log('✅ Produkt znaleziony!');
    console.log('\n📋 Szczegóły produktu:');
    console.log('=======================');
    console.log(`ID: ${product._id}`);
    console.log(`Nazwa: ${product.name}`);
    console.log(`Opis: ${product.description}`);
    console.log(`Cena: ${product.price} zł`);
    console.log(`Kategoria: ${product.category}`);
    console.log(`Sprzedawca: ${product.seller}`);
    console.log(`Aktywny: ${product.isActive}`);
    console.log(`Stock: ${product.stock}`);
    console.log(`SaleType: ${product.saleType}`);
    
    if (product.auction) {
      console.log(`\n🏷️ Aukcja:`);
      console.log(`  Start Price: ${product.auction.startPrice}`);
      console.log(`  Current Price: ${product.auction.currentPrice}`);
      console.log(`  Min Increment: ${product.auction.minIncrement}`);
      console.log(`  End Time: ${product.auction.endTime}`);
      console.log(`  Is Active: ${product.auction.isActive}`);
      console.log(`  Bids Count: ${product.auction.bids?.length || 0}`);
    }

    // Sprawdź czy stock jest ustawione
    if (product.stock === undefined || product.stock === null) {
      console.log('\n⚠️  Pole stock nie jest ustawione!');
      console.log('🔧 Ustawiam domyślną wartość stock = 1...');
      
      product.stock = 1;
      await product.save();
      console.log('✅ Stock został ustawiony na 1');
    } else {
      console.log(`\n✅ Stock jest ustawione: ${product.stock}`);
    }

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkProductStock(); 