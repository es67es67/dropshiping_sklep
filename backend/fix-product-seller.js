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
  owner: mongoose.Schema.Types.ObjectId,
  address: {
    city: String
  }
});

const Shop = mongoose.model('Shop', shopSchema);

async function fixProductSeller() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const productId = '6877fdd818c94583a52840c1';
    
    console.log(`\n🔧 Naprawiam produkt o ID: ${productId}`);
    console.log('=====================================');

    // Znajdź produkt
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log('❌ Produkt nie został znaleziony!');
      return;
    }

    console.log('✅ Produkt znaleziony!');
    console.log(`Nazwa: ${product.name}`);
    console.log(`Sklep: ${product.shop}`);
    console.log(`Sprzedawca: ${product.seller || 'BRAK'}`);

    // Jeśli produkt nie ma sprzedawcy, znajdź właściciela sklepu
    if (!product.seller) {
      console.log('\n🔍 Szukam właściciela sklepu...');
      
      const shop = await Shop.findById(product.shop);
      if (shop && shop.owner) {
        console.log(`✅ Znaleziono właściciela sklepu: ${shop.owner}`);
        
        // Zaktualizuj produkt z właścicielem sklepu jako sprzedawcą
        product.seller = shop.owner;
        await product.save();
        
        console.log('✅ Produkt zaktualizowany - dodano sprzedawcę');
        console.log(`Nowy sprzedawca: ${product.seller}`);
      } else {
        console.log('❌ Nie można znaleźć właściciela sklepu!');
        
        // Sprawdź wszystkie sklepy
        const allShops = await Shop.find({}).limit(5);
        console.log('\n📋 Dostępne sklepy:');
        allShops.forEach((s, index) => {
          console.log(`${index + 1}. ID: ${s._id}`);
          console.log(`   Nazwa: ${s.name}`);
          console.log(`   Właściciel: ${s.owner || 'BRAK'}`);
          console.log('');
        });
      }
    } else {
      console.log('✅ Produkt już ma sprzedawcę');
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
    let needsUpdate = false;
    
    if (!product.stats) {
      console.log('⚠️ Brak pola stats - dodaję domyślne wartości');
      product.stats = {
        views: 0,
        sales: 0,
        revenue: 0,
        wishlistCount: 0
      };
      needsUpdate = true;
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
      needsUpdate = true;
    }

    // Zapisz poprawki jeśli były potrzebne
    if (needsUpdate) {
      await product.save();
      console.log('✅ Produkt zaktualizowany z domyślnymi wartościami');
    }

    console.log('\n🎉 Naprawa zakończona!');

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

fixProductSeller(); 