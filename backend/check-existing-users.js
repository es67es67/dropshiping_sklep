const mongoose = require('mongoose');
require('dotenv').config();

// Import modeli
const User = require('./models/userModel');

async function checkUsers() {
  try {
    console.log('🔗 Łączenie z bazą danych...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('✅ Połączono z bazą danych');

    // Pobierz wszystkich użytkowników
    const users = await User.find({}).select('username email firstName lastName isActive roles').limit(10);
    
    console.log(`\n📊 Znaleziono ${users.length} użytkowników:`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Użytkownik:`);
      console.log(`   - Username: ${user.username}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Imię: ${user.firstName || 'brak'}`);
      console.log(`   - Nazwisko: ${user.lastName || 'brak'}`);
      console.log(`   - Aktywny: ${user.isActive}`);
      console.log(`   - Role: ${JSON.stringify(user.roles)}`);
    });

    // Znajdź użytkownika z hasłem (do testowania logowania)
    const userWithPassword = await User.findOne({}).select('+password');
    if (userWithPassword) {
      console.log(`\n🔐 Użytkownik do testowania logowania:`);
      console.log(`   - Email: ${userWithPassword.email}`);
      console.log(`   - Username: ${userWithPassword.username}`);
      console.log(`   - Hasło zahashowane: ${userWithPassword.password ? 'TAK' : 'NIE'}`);
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z bazą danych');
  }
}

checkUsers(); 