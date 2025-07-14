const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
require('dotenv').config();

console.log('🔧 Naprawianie pola shops użytkowników...');

async function fixUserShops() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Pobierz wszystkich użytkowników
    const users = await User.find({});
    console.log(`📊 Wszystkich użytkowników: ${users.length}`);

    let updatedCount = 0;

    // Dla każdego użytkownika znajdź jego sklepy i zaktualizuj pole shops
    for (const user of users) {
      const userShops = await Shop.find({ owner: user._id });
      
      if (userShops.length > 0) {
        const shopIds = userShops.map(shop => shop._id);
        
        // Sprawdź czy użytkownik już ma pole shops
        if (!user.shops || user.shops.length === 0) {
          // Zaktualizuj użytkownika
          await User.findByIdAndUpdate(user._id, {
            $set: { shops: shopIds }
          });
          
          console.log(`✅ Zaktualizowano ${user.username || user.email}: ${userShops.length} sklepów`);
          updatedCount++;
        } else {
          console.log(`ℹ️  ${user.username || user.email}: już ma pole shops (${user.shops.length} sklepów)`);
        }
      } else {
        // Użytkownik nie ma sklepów - ustaw puste pole shops
        if (!user.shops) {
          await User.findByIdAndUpdate(user._id, {
            $set: { shops: [] }
          });
          
          console.log(`✅ Zaktualizowano ${user.username || user.email}: brak sklepów`);
          updatedCount++;
        }
      }
    }

    console.log(`\n📊 Podsumowanie:`);
    console.log(`✅ Zaktualizowano ${updatedCount} użytkowników`);

    // Sprawdź ponownie
    console.log('\n🔍 Sprawdzanie po aktualizacji...');
    const usersWithShops = await User.find({ shops: { $exists: true } });
    console.log(`📊 Użytkowników z polem shops: ${usersWithShops.length}`);

    for (const user of usersWithShops) {
      const userShops = await Shop.find({ owner: user._id });
      console.log(`👤 ${user.username || user.email}: ${user.shops.length} w polu shops, ${userShops.length} rzeczywistych sklepów`);
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

fixUserShops().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  process.exit(1);
}); 