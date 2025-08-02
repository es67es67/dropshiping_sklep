const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetUserPassword() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const UserModel = require('./models/userModel');

    // Znajdź użytkownika testuser
    const user = await UserModel.findOne({ username: 'testuser' });
    
    if (!user) {
      console.log('❌ Użytkownik testuser nie istnieje');
      return;
    }

    console.log('✅ Znaleziono użytkownika:', user.username);
    console.log('   Email:', user.email);
    console.log('   Aktualne hasło zahashowane:', user.password ? 'Tak' : 'Nie');

    // Nowe hasło
    const newPassword = 'test123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Zaktualizuj hasło
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Hasło zostało zresetowane na:', newPassword);
    console.log('   Nowe hasło zahashowane:', user.password ? 'Tak' : 'Nie');

    // Sprawdź czy hasło działa
    const isValid = await bcrypt.compare(newPassword, user.password);
    console.log('🧪 Test nowego hasła:', isValid ? '✅' : '❌');

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Rozłączono z bazą danych');
  }
}

resetUserPassword(); 