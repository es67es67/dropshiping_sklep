const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');

async function checkShopExists() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    const shopId = '6875d1867f40145e58a47086';
    console.log(`🔍 Sprawdzanie sklepu o ID: ${shopId}`);

    // Sprawdź czy sklep istnieje
    const shop = await Shop.findById(shopId)
      .populate('owner', 'username firstName lastName email')
      .populate('location', 'name type')
      .populate('followers', 'username firstName lastName')
      .populate('reviews.user', 'username firstName lastName');

    if (!shop) {
      console.log('❌ Sklep nie został znaleziony w bazie danych');
      
      // Sprawdź ile sklepów jest w bazie
      const totalShops = await Shop.countDocuments();
      console.log(`📊 Wszystkich sklepów w bazie: ${totalShops}`);
      
      if (totalShops > 0) {
        console.log('📋 Przykładowe sklepy w bazie:');
        const sampleShops = await Shop.find().limit(5).select('_id name owner createdAt');
        sampleShops.forEach((s, index) => {
          console.log(`  ${index + 1}. ID: ${s._id}, Nazwa: ${s.name || 'Brak nazwy'}, Właściciel: ${s.owner || 'Brak właściciela'}`);
        });
      }
      
      return;
    }

    console.log('✅ Sklep został znaleziony!');
    console.log('\n📋 Szczegóły sklepu:');
    console.log(`  ID: ${shop._id}`);
    console.log(`  Nazwa: ${shop.name || 'Brak nazwy'}`);
    console.log(`  Opis: ${shop.description || 'Brak opisu'}`);
    console.log(`  Aktywny: ${shop.isActive ? 'Tak' : 'Nie'}`);
    console.log(`  Zweryfikowany: ${shop.isVerified ? 'Tak' : 'Nie'}`);
    console.log(`  Data utworzenia: ${shop.createdAt}`);
    console.log(`  Data aktualizacji: ${shop.updatedAt}`);

    if (shop.owner) {
      console.log(`\n👤 Właściciel:`);
      console.log(`  ID: ${shop.owner._id}`);
      console.log(`  Username: ${shop.owner.username || 'Brak'}`);
      console.log(`  Imię: ${shop.owner.firstName || 'Brak'}`);
      console.log(`  Nazwisko: ${shop.owner.lastName || 'Brak'}`);
      console.log(`  Email: ${shop.owner.email || 'Brak'}`);
    } else {
      console.log('\n❌ Brak właściciela sklepu');
    }

    if (shop.location) {
      console.log(`\n📍 Lokalizacja:`);
      console.log(`  ID: ${shop.location._id}`);
      console.log(`  Nazwa: ${shop.location.name || 'Brak nazwy'}`);
      console.log(`  Typ: ${shop.location.type || 'Brak typu'}`);
    } else {
      console.log('\n❌ Brak lokalizacji sklepu');
    }

    console.log(`\n📊 Statystyki:`);
    console.log(`  Liczba obserwujących: ${shop.followers?.length || 0}`);
    console.log(`  Liczba recenzji: ${shop.reviews?.length || 0}`);
    console.log(`  Liczba wyświetleń: ${shop.stats?.totalViews || 0}`);
    console.log(`  Liczba produktów: ${shop.stats?.totalProducts || 0}`);

    if (shop.address) {
      console.log(`\n🏠 Adres:`);
      console.log(`  Ulica: ${shop.address.street || 'Brak'}`);
      console.log(`  Miasto: ${shop.address.city || 'Brak'}`);
      console.log(`  Kod pocztowy: ${shop.address.postalCode || 'Brak'}`);
      console.log(`  Województwo: ${shop.address.voivodeship || 'Brak'}`);
    }

    if (shop.categories && shop.categories.length > 0) {
      console.log(`\n🏷️ Kategorie: ${shop.categories.join(', ')}`);
    }

    if (shop.tags && shop.tags.length > 0) {
      console.log(`\n🏷️ Tagi: ${shop.tags.join(', ')}`);
    }

    // Sprawdź produkty sklepu
    const Product = require('./models/productModel');
    const products = await Product.find({ shop: shop._id }).select('_id name price isActive');
    console.log(`\n📦 Produkty sklepu (${products.length}):`);
    if (products.length > 0) {
      products.forEach((product, index) => {
        console.log(`  ${index + 1}. ID: ${product._id}, Nazwa: ${product.name}, Cena: ${product.price} zł, Aktywny: ${product.isActive ? 'Tak' : 'Nie'}`);
      });
    } else {
      console.log('  Brak produktów w sklepie');
    }

  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania sklepu:', error);
  } finally {
    console.log('\n🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

checkShopExists(); 