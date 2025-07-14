const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
require('dotenv').config();

console.log('🔧 Skrypt naprawy sklepów bez pola isActive rozpoczęty');

async function fixShopActive() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Znajdź sklepy bez pola isActive
    console.log('🔍 Wyszukiwanie sklepów bez pola isActive...');
    const shopsWithoutActive = await Shop.find({ isActive: { $exists: false } });
    console.log(`📊 Znaleziono ${shopsWithoutActive.length} sklepów bez pola isActive`);

    if (shopsWithoutActive.length > 0) {
      console.log('\n📋 Lista sklepów do naprawy:');
      shopsWithoutActive.forEach((shop, index) => {
        console.log(`${index + 1}. ${shop.name} (ID: ${shop._id})`);
      });

      // Napraw sklepy - dodaj isActive: true
      console.log('\n🔧 Naprawianie sklepów...');
      const result = await Shop.updateMany(
        { isActive: { $exists: false } },
        { $set: { isActive: true } }
      );
      
      console.log(`✅ Naprawiono ${result.modifiedCount} sklepów`);
      
      // Sprawdź ponownie
      const remainingShops = await Shop.find({ isActive: { $exists: false } });
      console.log(`📊 Pozostało sklepów bez pola isActive: ${remainingShops.length}`);
    } else {
      console.log('✅ Wszystkie sklepy mają pole isActive');
    }

    // Pokaż podsumowanie
    console.log('\n📊 Podsumowanie:');
    const totalShops = await Shop.countDocuments({});
    const activeShops = await Shop.countDocuments({ isActive: true });
    const inactiveShops = await Shop.countDocuments({ isActive: false });
    
    console.log(`📈 Wszystkich sklepów: ${totalShops}`);
    console.log(`✅ Aktywnych sklepów: ${activeShops}`);
    console.log(`❌ Nieaktywnych sklepów: ${inactiveShops}`);

  } catch (error) {
    console.error('❌ Błąd:', error);
    console.error('❌ Stack trace:', error.stack);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

fixShopActive().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  process.exit(1);
}); 