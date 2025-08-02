const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n👥 Sprawdzam użytkowników w bazie danych...');
    console.log('=====================================');

    // Sprawdź wszystkich użytkowników
    const users = await User.find({ isActive: true }).limit(10);
    
    console.log('\n📊 Aktywni użytkownicy:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Imię: ${user.firstName}`);
      console.log(`   Nazwisko: ${user.lastName}`);
      console.log('');
    });

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers(); 