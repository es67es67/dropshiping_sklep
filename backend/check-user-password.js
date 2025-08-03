const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');

const checkUserPassword = async () => {
  try {
    console.log('🔐 Sprawdzanie hasła użytkownika aaaaaaaaaaaaa...');
    
    // Połącz z bazą danych
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('✅ Połączono z bazą danych MongoDB');

    // Znajdź użytkownika
    const user = await User.findOne({ username: 'aaaaaaaaaaaaa' });
    
    if (!user) {
      console.log('❌ Użytkownik aaaaaaaaaaaaa nie został znaleziony');
      return;
    }

    console.log('👤 Użytkownik:', user.email);
    console.log('🔑 Hash hasła:', user.password.substring(0, 20) + '...');

    // Testuj różne hasła
    const testPasswords = ['test123', 'password123', 'user123', 'demo123', 'polska123', 'test2024', 'user2024', 'admin123', '123456', 'password'];

    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`🔐 Test hasła "${password}": ${isValid ? '✅ Prawidłowe' : '❌ Nieprawidłowe'}`);
    }

    console.log('🔌 Połączenie z bazą danych zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

checkUserPassword(); 