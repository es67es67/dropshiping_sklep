const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model użytkownika
const User = require('./models/userModel');

async function checkTestUserPassword() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Znajdź użytkownika testuser1752400289579
    const user = await User.findOne({ 
      $or: [
        { email: 'testuser1752400289579@example.com' },
        { username: 'testuser1752400289579' }
      ]
    });

    if (!user) {
      console.log('❌ Użytkownik testuser1752400289579 nie został znaleziony');
      return;
    }

    console.log('👤 Znaleziono użytkownika testuser1752400289579:');
    console.log(`  Email: ${user.email}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Hasło (hash): ${user.password}`);
    
    // Sprawdź różne hasła
    const testPasswords = ['test123', 'password', '123456', 'test', 'admin123'];
    
    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`  Czy hasło "${password}" pasuje: ${isValid}`);
      if (isValid) {
        console.log(`  ✅ Hasło "${password}" pasuje!`);
      }
    }

    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');

  } catch (error) {
    console.error('❌ Błąd:', error);
    await mongoose.disconnect();
  }
}

checkTestUserPassword(); 