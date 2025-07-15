const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAdminPassword() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    const User = require('./models/userModel');
    
    // Znajdź użytkownika admin
    const admin = await User.findOne({ email: 'admin@test.com' });
    
    if (!admin) {
      console.log('❌ Użytkownik admin@test.com nie istnieje');
      return;
    }
    
    console.log('👤 Znaleziono użytkownika admin:');
    console.log('  ID:', admin._id);
    console.log('  Email:', admin.email);
    console.log('  Username:', admin.username);
    console.log('  Hasło (hash):', admin.password);
    
    // Sprawdź czy hasło 'admin123' pasuje
    const isMatch = await bcrypt.compare('admin123', admin.password);
    console.log('  Czy hasło "admin123" pasuje:', isMatch);
    
    // Sprawdź inne popularne hasła
    const testPasswords = ['admin', 'password', '123456', 'admin123', 'test123'];
    
    for (const password of testPasswords) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) {
        console.log(`  ✅ Hasło "${password}" pasuje!`);
      }
    }
    
    // Jeśli żadne nie pasuje, zresetuj hasło
    if (!isMatch) {
      console.log('🔄 Resetowanie hasła na "admin123"...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      admin.password = hashedPassword;
      await admin.save();
      console.log('✅ Hasło zresetowane na "admin123"');
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

checkAdminPassword(); 