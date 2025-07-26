const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model użytkownika
const User = require('./models/userModel');

async function checkEs67jwPassword() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Znajdź użytkownika es67jw@gmail.com
    const user = await User.findOne({ email: 'es67jw@gmail.com' });

    if (!user) {
      console.log('❌ Użytkownik es67jw@gmail.com nie został znaleziony');
      return;
    }

    console.log('👤 Znaleziono użytkownika es67jw@gmail.com:');
    console.log(`  Email: ${user.email}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Hasło (hash): ${user.password}`);
    
    // Sprawdź różne hasła
    const testPasswords = ['test123', 'password', '123456', 'test', 'admin123', 'es67jw', 'portal'];
    
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

checkEs67jwPassword(); 