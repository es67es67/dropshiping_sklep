const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model sklepu
const shopSchema = new mongoose.Schema({
  name: String,
  category: String,
  address: {
    city: String
  },
  teryt: {
    voivodeshipCode: String
  }
});

const Shop = mongoose.model('Shop', shopSchema);

// Model produktu
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  shop: mongoose.Schema.Types.ObjectId
});

const Product = mongoose.model('Product', productSchema);

async function summaryOpolskie() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Pobierz wszystkie sklepy z województwa opolskiego
    const shops = await Shop.find({
      'teryt.voivodeshipCode': '16'
    }).select('name category address.city');

    console.log('\n🏪 SKLEPY W WOJEWÓDZTWIE OPOLSKIM');
    console.log('=====================================');
    
    let totalProducts = 0;
    const cityStats = {};

    for (const shop of shops) {
      // Pobierz produkty tego sklepu
      const products = await Product.find({ shop: shop._id });
      const productCount = products.length;
      totalProducts += productCount;

      // Statystyki per miasto
      if (!cityStats[shop.address.city]) {
        cityStats[shop.address.city] = { shops: 0, products: 0 };
      }
      cityStats[shop.address.city].shops++;
      cityStats[shop.address.city].products += productCount;

      console.log(`\n🏪 ${shop.name}`);
      console.log(`   📍 Miasto: ${shop.address.city}`);
      console.log(`   🏷️ Kategoria: ${shop.category}`);
      console.log(`   📦 Produkty: ${productCount}`);
      
      if (productCount > 0) {
        const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / productCount;
        console.log(`   💰 Średnia cena: ${avgPrice.toFixed(2)} zł`);
      }
    }

    console.log('\n📊 PODSUMOWANIE OGÓLNE');
    console.log('========================');
    console.log(`🏪 Łącznie sklepów: ${shops.length}`);
    console.log(`📦 Łącznie produktów: ${totalProducts}`);
    console.log(`💰 Średnia produktów na sklep: ${(totalProducts / shops.length).toFixed(1)}`);

    console.log('\n🏙️ STATYSTYKI PER MIASTO');
    console.log('==========================');
    Object.entries(cityStats)
      .sort(([,a], [,b]) => b.products - a.products)
      .forEach(([city, stats]) => {
        console.log(`${city}: ${stats.shops} sklepów, ${stats.products} produktów`);
      });

    // Statystyki kategorii
    const categoryStats = {};
    shops.forEach(shop => {
      if (!categoryStats[shop.category]) {
        categoryStats[shop.category] = 0;
      }
      categoryStats[shop.category]++;
    });

    console.log('\n🏷️ STATYSTYKI KATEGORII');
    console.log('==========================');
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} sklepów`);
      });

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

summaryOpolskie(); 