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

async function checkCategories() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n📊 Sprawdzam kategorie w bazie danych...');
    console.log('=====================================');

    // Sprawdź wszystkie kategorie
    const categories = await MarketplaceProduct.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log('\n📊 Kategorie w bazie danych:');
    categories.forEach(cat => {
      console.log(`  "${cat._id}": ${cat.count} produktów`);
    });

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkCategories(); 