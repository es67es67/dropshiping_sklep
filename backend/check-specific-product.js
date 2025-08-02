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
  stock: Number,
  saleType: String,
  negotiation: {
    offers: [{
      buyer: mongoose.Schema.Types.ObjectId,
      amount: Number,
      message: String,
      status: String,
      timestamp: Date
    }]
  }
});

const MarketplaceProduct = mongoose.model('MarketplaceProduct', marketplaceProductSchema);

async function checkProduct() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const productId = '688c5b49951d90a2cd87631c';
    console.log(`\n🔍 Sprawdzam produkt: ${productId}`);
    console.log('=====================================');

    const product = await MarketplaceProduct.findById(productId);
    
    if (!product) {
      console.log('❌ Produkt nie został znaleziony');
      return;
    }

    console.log('\n📦 Szczegóły produktu:');
    console.log(`  Nazwa: ${product.name}`);
    console.log(`  Cena: ${product.price} zł`);
    console.log(`  Kategoria: ${product.category}`);
    console.log(`  Typ sprzedaży: ${product.saleType}`);
    console.log(`  Aktywny: ${product.isActive}`);
    console.log(`  Stan: ${product.stock}`);
    console.log(`  Sprzedawca: ${product.seller}`);
    
    if (product.negotiation && product.negotiation.offers) {
      console.log(`\n💼 Oferty negocjacyjne: ${product.negotiation.offers.length}`);
      product.negotiation.offers.forEach((offer, index) => {
        console.log(`  Oferta ${index + 1}:`);
        console.log(`    Kupujący: ${offer.buyer}`);
        console.log(`    Kwota: ${offer.amount} zł`);
        console.log(`    Status: ${offer.status}`);
        console.log(`    Wiadomość: ${offer.message || 'Brak'}`);
        console.log(`    Data: ${offer.timestamp}`);
      });
    } else {
      console.log('\n💼 Brak ofert negocjacyjnych');
    }

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkProduct(); 