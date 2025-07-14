const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

async function checkUsers() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    const count = await User.countDocuments();
    console.log(`📊 Liczba użytkowników w bazie: ${count}`);

    if (count === 0) {
      console.log('⚠️ Baza jest pusta, dodaję testowego użytkownika...');
      
      const testUser = new User({
        username: 'admin',
        email: 'admin@test.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'Test',
        role: 'admin',
        isActive: true
      });
      
      await testUser.save();
      console.log('✅ Dodano testowego użytkownika admin');
    } else {
      console.log('📋 Lista użytkowników:');
      const users = await User.find().select('username email firstName lastName role isActive');
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username} (${user.email}) - ${user.role} - ${user.isActive ? 'Aktywny' : 'Nieaktywny'}`);
      });
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

checkUsers().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  process.exit(1);
}); 