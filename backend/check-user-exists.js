const mongoose = require('mongoose');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model użytkownika
const User = require('./models/userModel');

async function checkUserExists() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const userId = '6881e7aaca3621fc31f3d0b0';
    console.log(`🔍 Sprawdzam użytkownika o ID: ${userId}`);

    // Sprawdź czy użytkownik istnieje
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ Użytkownik nie został znaleziony');
      
      // Sprawdź wszystkich użytkowników
      console.log('\n📋 Lista wszystkich użytkowników:');
      const allUsers = await User.find({}).select('_id username email firstName lastName isActive');
      
      if (allUsers.length === 0) {
        console.log('❌ Brak użytkowników w bazie danych');
      } else {
        allUsers.forEach((u, index) => {
          console.log(`${index + 1}. ID: ${u._id}`);
          console.log(`   Username: ${u.username}`);
          console.log(`   Email: ${u.email}`);
          console.log(`   Imię: ${u.firstName} ${u.lastName}`);
          console.log(`   Aktywny: ${u.isActive}`);
          console.log('');
        });
      }
    } else {
      console.log('✅ Użytkownik znaleziony:');
      console.log(`   ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Imię: ${user.firstName} ${user.lastName}`);
      console.log(`   Aktywny: ${user.isActive}`);
      console.log(`   Role: ${user.roles || 'brak'}`);
    }

    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');

  } catch (error) {
    console.error('❌ Błąd:', error);
    await mongoose.disconnect();
  }
}

checkUserExists(); 