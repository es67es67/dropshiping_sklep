const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/userModel');

async function checkAndFixAdminPassword() {
  try {
    console.log('🔗 Łączenie z bazą danych...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('✅ Połączono z bazą danych');

    // Znajdź użytkownika admin@test.com
    const adminUser = await User.findOne({ email: 'admin@test.com' });
    
    if (!adminUser) {
      console.log('❌ Użytkownik admin@test.com nie istnieje');
      return;
    }

    console.log(`✅ Znaleziono użytkownika: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Hasło zahashowane: ${adminUser.password.substring(0, 20)}...`);

    // Sprawdź czy hasło 'test123' pasuje
    const testPassword = 'test123';
    const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
    
    if (isPasswordValid) {
      console.log('✅ Hasło "test123" jest poprawne');
    } else {
      console.log('❌ Hasło "test123" nie pasuje');
      
      // Zaktualizuj hasło
      const newHashedPassword = await bcrypt.hash(testPassword, 12);
      adminUser.password = newHashedPassword;
      await adminUser.save();
      
      console.log('✅ Hasło zostało zaktualizowane na "test123"');
    }

    // Sprawdź inne użytkowniki testowe
    const testUsers = [
      'jan.kowalski@test.com',
      'anna.nowak@test.com',
      'piotr.wisniewski@test.com'
    ];

    for (const email of testUsers) {
      const user = await User.findOne({ email });
      if (user) {
        const isPasswordValid = await bcrypt.compare('test123', user.password);
        if (!isPasswordValid) {
          console.log(`🔄 Aktualizuję hasło dla ${email}...`);
          const newHashedPassword = await bcrypt.hash('test123', 12);
          user.password = newHashedPassword;
          await user.save();
          console.log(`✅ Hasło zaktualizowane dla ${email}`);
        } else {
          console.log(`✅ Hasło poprawne dla ${email}`);
        }
      } else {
        console.log(`⚠️ Użytkownik ${email} nie istnieje`);
      }
    }

    console.log('\n📋 Podsumowanie użytkowników testowych:');
    console.log('📧 admin@test.com / test123');
    console.log('📧 jan.kowalski@test.com / test123');
    console.log('📧 anna.nowak@test.com / test123');
    console.log('📧 piotr.wisniewski@test.com / test123');

  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania haseł:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z bazą danych');
  }
}

checkAndFixAdminPassword(); 