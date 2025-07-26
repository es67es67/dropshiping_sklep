const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model produktu
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  shop: mongoose.Schema.Types.ObjectId
});

const Product = mongoose.model('Product', productSchema);

// Model sklepu
const shopSchema = new mongoose.Schema({
  name: String,
  address: {
    city: String
  }
});

const Shop = mongoose.model('Shop', shopSchema);

async function checkShopProducts() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Znajdź sklep SoundLab Opole
    const shop = await Shop.findOne({
      name: 'SoundLab Opole',
      'address.city': 'Opole'
    });

    if (!shop) {
      console.log('❌ Nie znaleziono sklepu SoundLab Opole');
      return;
    }

    console.log(`\n🏪 Sklep: ${shop.name} (ID: ${shop._id})`);
    console.log('=====================================');

    // Pobierz produkty tego sklepu
    const products = await Product.find({ shop: shop._id });

    console.log('\n📦 Produkty w sklepie:');
    console.log('=======================');
    
    if (products.length === 0) {
      console.log('❌ Brak produktów w sklepie');
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ${product.price} zł`);
        console.log(`   Opis: ${product.description}`);
        console.log('');
      });
      console.log(`📊 Łącznie: ${products.length} produktów`);
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkShopProducts(); 