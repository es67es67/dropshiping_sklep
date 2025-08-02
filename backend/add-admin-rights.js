const mongoose = require('mongoose');
require('dotenv').config();

// Połącz z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const User = require('./models/userModel');

async function addAdminRights() {
  try {
    console.log('🔍 Szukam użytkownika "aaaaaaaaaaaaa"...');
    
    // Znajdź użytkownika
    const user = await User.findOne({ username: 'aaaaaaaaaaaaa' });
    
    if (!user) {
      console.log('❌ Użytkownik "aaaaaaaaaaaaa" nie został znaleziony!');
      
      // Pokaż wszystkich użytkowników
      const allUsers = await User.find({}).select('username email roles');
      console.log('\n📋 Wszyscy użytkownicy w bazie:');
      allUsers.forEach(u => {
        console.log(`  - ${u.username} (${u.email}) - role: ${u.roles?.join(', ') || 'brak'}`);
      });
      return;
    }
    
    console.log(`✅ Znaleziono użytkownika: ${user.username} (${user.email})`);
    console.log(`📋 Obecne role: ${user.roles?.join(', ') || 'brak'}`);
    
    // Dodaj rolę admin jeśli nie ma
    if (!user.roles) {
      user.roles = [];
    }
    
    if (!user.roles.includes('admin')) {
      user.roles.push('admin');
      await user.save();
      console.log('✅ Dodano rolę admin użytkownikowi "aaaaaaaaaaaaa"');
    } else {
      console.log('ℹ️  Użytkownik już ma rolę admin');
    }
    
    console.log(`📋 Nowe role: ${user.roles.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    mongoose.connection.close();
  }
}

addAdminRights(); 