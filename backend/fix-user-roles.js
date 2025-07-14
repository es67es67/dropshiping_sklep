const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

async function fixUserRoles() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Dodaj pole role do schematu User
    const users = await User.find({});
    console.log(`📊 Znaleziono ${users.length} użytkowników`);

    for (const user of users) {
      // Sprawdź czy użytkownik ma role
      if (!user.roles || user.roles.length === 0) {
        // Ustaw domyślną rolę 'user'
        user.roles = ['user'];
        
        // Jeśli to admin, dodaj rolę admin
        if (user.username === 'admin' || user.email === 'admin@test.com') {
          user.roles = ['admin'];
        }
        
        await user.save();
        console.log(`✅ Zaktualizowano użytkownika: ${user.username} - role: ${user.roles.join(', ')}`);
      } else {
        console.log(`ℹ️ Użytkownik ${user.username} już ma role: ${user.roles.join(', ')}`);
      }
    }

    console.log('✅ Wszystkie role użytkowników zostały zaktualizowane');

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

fixUserRoles().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  process.exit(1);
}); 