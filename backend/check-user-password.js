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

async function checkUserPassword() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n🔍 Sprawdzam użytkownika teste2e...');
    console.log('=====================================');

    const user = await User.findOne({ email: 'teste2e@test.com' });
    
    if (!user) {
      console.log('❌ Użytkownik nie został znaleziony');
      return;
    }

    console.log('\n📦 Szczegóły użytkownika:');
    console.log(`  ID: ${user._id}`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Aktywny: ${user.isActive}`);
    console.log(`  Hasło (hash): ${user.password ? 'Obecne' : 'Brak'}`);
    
    // Testuj różne hasła
    const testPasswords = ['test123', 'password', '123456', 'test', 'teste2e'];
    
    console.log('\n🔐 Testuję hasła:');
    for (const password of testPasswords) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`  "${password}": ${isValid ? '✅' : '❌'}`);
    }

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUserPassword(); 