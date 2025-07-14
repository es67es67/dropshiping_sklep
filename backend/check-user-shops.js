const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
require('dotenv').config();

console.log('🔍 Sprawdzanie sklepów użytkowników...');

async function checkUserShops() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Pobierz wszystkich użytkowników
    const users = await User.find({});
    console.log(`📊 Wszystkich użytkowników: ${users.length}`);

    // Sprawdź sklepy każdego użytkownika
    for (const user of users) {
      const userShops = await Shop.find({ owner: user._id });
      console.log(`👤 ${user.username || user.email} (${user._id}): ${userShops.length} sklepów`);
      
      if (userShops.length > 0) {
        userShops.forEach(shop => {
          console.log(`  - ${shop.name} (${shop._id}) - ${shop.isActive ? 'Aktywny' : 'Nieaktywny'}`);
        });
      }
    }

    // Sprawdź czy użytkownicy mają pole shops w modelu User
    console.log('\n🔍 Sprawdzanie pola shops w modelu User...');
    const usersWithShopsField = await User.find({ shops: { $exists: true } });
    console.log(`📊 Użytkowników z polem shops: ${usersWithShopsField.length}`);

    // Sprawdź czy sklepy mają poprawnych właścicieli
    console.log('\n🔍 Sprawdzanie właścicieli sklepów...');
    const shops = await Shop.find({});
    console.log(`📊 Wszystkich sklepów: ${shops.length}`);

    for (const shop of shops) {
      const owner = await User.findById(shop.owner);
      console.log(`🏪 ${shop.name}: właściciel ${owner ? owner.username || owner.email : 'NIEZNANY'} (${shop.owner})`);
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

checkUserShops().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  process.exit(1);
}); 