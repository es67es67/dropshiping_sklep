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
  saleType: String
});

const MarketplaceProduct = mongoose.model('MarketplaceProduct', marketplaceProductSchema);

async function checkSaleTypes() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n📊 Sprawdzam typy sprzedaży...');
    console.log('=====================================');

    // Sprawdź wszystkie typy sprzedaży
    const saleTypes = await MarketplaceProduct.aggregate([
      {
        $group: {
          _id: '$saleType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log('\n📊 Statystyki typów sprzedaży:');
    saleTypes.forEach(type => {
      console.log(`  ${type._id || 'brak'}: ${type.count} produktów`);
    });

    // Sprawdź przykładowe produkty dla każdego typu
    for (const type of saleTypes) {
      const sampleProducts = await MarketplaceProduct.find({ 
        saleType: type._id 
      }).limit(3);
      
      console.log(`\n📋 Przykładowe produkty typu "${type._id}":`);
      sampleProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} (ID: ${product._id})`);
      });
    }

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkSaleTypes(); 