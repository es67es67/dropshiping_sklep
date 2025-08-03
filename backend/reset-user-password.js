const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');

const resetUserPassword = async () => {
  try {
    console.log('🔐 Resetowanie hasła użytkownika aaaaaaaaaaaaa...');
    
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
    console.log('🔑 Stary hash hasła:', user.password.substring(0, 20) + '...');

    // Ustaw nowe hasło
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Zaktualizuj hasło
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Hasło zostało zresetowane');
    console.log('🔑 Nowe hasło:', newPassword);
    console.log('🔑 Nowy hash hasła:', user.password.substring(0, 20) + '...');

    // Sprawdź czy hasło działa
    const isValid = await bcrypt.compare(newPassword, user.password);
    console.log('🔐 Test nowego hasła:', isValid ? '✅ Prawidłowe' : '❌ Nieprawidłowe');

    console.log('🔌 Połączenie z bazą danych zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

resetUserPassword(); 