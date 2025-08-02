const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function checkUsersWithPasswords() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n👥 Sprawdzam użytkowników z hasłami...');
    console.log('=====================================');

    // Sprawdź użytkowników z hasłami
    const users = await User.find({ password: { $exists: true, $ne: null } }).limit(10);
    
    console.log('\n📊 Użytkownicy z hasłami:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Aktywny: ${user.isActive}`);
      console.log(`   Hasło (hash): ${user.password ? 'Obecne' : 'Brak'}`);
      console.log('');
    });

    // Testuj hasło dla pierwszego użytkownika
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n🔐 Testuję hasła dla użytkownika: ${testUser.username}`);
      
      const testPasswords = ['test123', 'password', '123456', 'test', 'admin', 'user'];
      
      for (const password of testPasswords) {
        const isValid = await bcrypt.compare(password, testUser.password);
        console.log(`  "${password}": ${isValid ? '✅' : '❌'}`);
        if (isValid) {
          console.log(`  ✅ Znaleziono poprawne hasło: "${password}"`);
          console.log(`  📧 Email: ${testUser.email}`);
          console.log(`  👤 Username: ${testUser.username}`);
          break;
        }
      }
    }

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsersWithPasswords(); 