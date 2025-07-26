const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model produktu
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  shop: mongoose.Schema.Types.ObjectId,
  seller: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  stats: {
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 }
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  }
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

// Model użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String
});

const User = mongoose.model('User', userSchema);

async function checkSpecificProduct() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const productId = '6877fdd818c94583a52840c1';
    
    console.log(`\n🔍 Sprawdzam produkt o ID: ${productId}`);
    console.log('=====================================');

    // Sprawdź czy produkt istnieje
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log('❌ Produkt nie został znaleziony!');
      console.log('\n🔍 Sprawdzam wszystkie produkty w bazie...');
      
      const allProducts = await Product.find({}).limit(10);
      console.log('\n📦 Pierwsze 10 produktów w bazie:');
      allProducts.forEach((p, index) => {
        console.log(`${index + 1}. ID: ${p._id}`);
        console.log(`   Nazwa: ${p.name}`);
        console.log(`   Cena: ${p.price} zł`);
        console.log(`   Sklep: ${p.shop}`);
        console.log('');
      });
      
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
    console.log(`Sklep: ${product.shop}`);
    console.log(`Sprzedawca: ${product.seller}`);
    console.log(`Aktywny: ${product.isActive}`);
    console.log(`Statystyki:`, product.stats);
    console.log(`Oceny:`, product.ratings);

    // Sprawdź powiązany sklep
    if (product.shop) {
      console.log('\n🏪 Sprawdzam powiązany sklep...');
      const shop = await Shop.findById(product.shop);
      if (shop) {
        console.log(`Sklep: ${shop.name}`);
        console.log(`Miasto: ${shop.address?.city}`);
      } else {
        console.log('❌ Sklep nie został znaleziony!');
      }
    }

    // Sprawdź powiązanego sprzedawcę
    if (product.seller) {
      console.log('\n👤 Sprawdzam powiązanego sprzedawcę...');
      const seller = await User.findById(product.seller);
      if (seller) {
        console.log(`Sprzedawca: ${seller.firstName} ${seller.lastName} (${seller.username})`);
      } else {
        console.log('❌ Sprzedawca nie został znaleziony!');
      }
    }

    // Sprawdź czy produkt ma wszystkie wymagane pola
    console.log('\n🔍 Sprawdzam wymagane pola...');
    const requiredFields = ['name', 'description', 'price', 'category', 'shop', 'seller'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!product[field]) {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      console.log('❌ Brakujące wymagane pola:', missingFields);
    } else {
      console.log('✅ Wszystkie wymagane pola są obecne');
    }

    // Sprawdź czy produkt ma domyślne wartości dla opcjonalnych pól
    console.log('\n🔍 Sprawdzam domyślne wartości...');
    if (!product.stats) {
      console.log('⚠️ Brak pola stats - dodaję domyślne wartości');
      product.stats = {
        views: 0,
        sales: 0,
        revenue: 0,
        wishlistCount: 0
      };
    }
    
    if (!product.ratings) {
      console.log('⚠️ Brak pola ratings - dodaję domyślne wartości');
      product.ratings = {
        average: 0,
        count: 0,
        distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      };
    }

    // Zapisz poprawki jeśli były potrzebne
    if (missingFields.length === 0) {
      await product.save();
      console.log('✅ Produkt zaktualizowany z domyślnymi wartościami');
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkSpecificProduct(); 