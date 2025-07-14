const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
const Location = require('./models/locationModel');
require('dotenv').config();

console.log('🚀 Skrypt check-inactive-shops.js rozpoczęty');
console.log('📦 Załadowane modele:', { Shop: !!Shop, User: !!User, Location: !!Location });

async function checkInactiveShops() {
  try {
    console.log('🔌 Próba połączenia z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Sprawdź wszystkie sklepy
    console.log('🔍 Pobieranie wszystkich sklepów...');
    const allShops = await Shop.find({});
    console.log(`📊 Total shops: ${allShops.length}`);

    // Sprawdź aktywne sklepy
    console.log('🔍 Pobieranie aktywnych sklepów...');
    const activeShops = await Shop.find({ isActive: true });
    console.log(`✅ Active shops: ${activeShops.length}`);

    // Sprawdź nieaktywne sklepy
    console.log('🔍 Pobieranie nieaktywnych sklepów...');
    const inactiveShops = await Shop.find({ isActive: false });
    console.log(`❌ Inactive shops: ${inactiveShops.length}`);

    if (inactiveShops.length > 0) {
      console.log('\n📋 Inactive shops:');
      inactiveShops.forEach((shop, index) => {
        console.log(`${index + 1}. ${shop.name} (ID: ${shop._id})`);
        console.log(`   Description: ${shop.description}`);
        console.log(`   Owner: ${shop.owner}`);
        console.log(`   Created: ${shop.createdAt}`);
        console.log('');
      });
    }

    // Sprawdź sklepy bez pola isActive
    console.log('🔍 Sprawdzanie sklepów bez pola isActive...');
    const shopsWithoutActiveField = await Shop.find({ isActive: { $exists: false } });
    console.log(`⚠️  Shops without isActive field: ${shopsWithoutActiveField.length}`);

    console.log('✅ Skrypt zakończony pomyślnie');

  } catch (error) {
    console.error('❌ Błąd w funkcji checkInactiveShops:', error);
    console.error('❌ Stack trace:', error.stack);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

console.log('🎯 Wywołanie funkcji checkInactiveShops...');
checkInactiveShops().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  console.error('❌ Stack trace:', error.stack);
  process.exit(1);
}); 