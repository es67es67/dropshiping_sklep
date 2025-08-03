const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

const checkUserPassword = async () => {
  try {
    console.log('🔍 Sprawdzanie hasła użytkownika es67jwklkk@gmail.com...');
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych MongoDB');
    
    const user = await User.findOne({ email: 'es67jwklkk@gmail.com' });
    
    if (!user) {
      console.log('❌ Użytkownik nie znaleziony');
      return;
    }
    
    console.log('✅ Użytkownik znaleziony:');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Username: ${user.username}`);
    console.log(`🔐 Hasło: ${user.password ? 'Ustawione' : 'Nie ustawione'}`);
    console.log(`🔐 Długość hasła: ${user.password ? user.password.length : 0}`);
    
    // Testuj różne hasła
    const testPasswords = ['tajne123', 'password', '123456', 'admin', 'test'];
    
    for (const testPassword of testPasswords) {
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log(`🔍 Test hasła "${testPassword}": ${isMatch ? '✅ ZGODNE' : '❌ Niezgodne'}`);
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
};

checkUserPassword(); 