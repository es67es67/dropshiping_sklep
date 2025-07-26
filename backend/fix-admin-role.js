const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  roles: [String],
  isActive: Boolean,
  createdAt: Date
});

const User = mongoose.model('User', userSchema);

async function fixAdminRole() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Znajdź użytkownika admin
    const adminUser = await User.findOne({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@test.com' }
      ]
    });

    if (adminUser) {
      console.log(`\n🔧 Znaleziono użytkownika admin: ${adminUser.username || adminUser.email}`);
      console.log(`   Obecne role: ${adminUser.roles ? adminUser.roles.join(', ') : 'brak ról'}`);
      
      // Dodaj rolę admin jeśli jej nie ma
      if (!adminUser.roles || !adminUser.roles.includes('admin')) {
        if (!adminUser.roles) {
          adminUser.roles = ['admin'];
        } else {
          adminUser.roles.push('admin');
        }
        
        await adminUser.save();
        console.log('✅ Dodano rolę admin do użytkownika admin');
        console.log(`   Nowe role: ${adminUser.roles.join(', ')}`);
      } else {
        console.log('ℹ️ Użytkownik admin już ma rolę admin');
      }
    } else {
      console.log('❌ Nie znaleziono użytkownika admin');
      
      // Sprawdź wszystkich użytkowników
      const allUsers = await User.find({}).select('username email roles');
      console.log('\n📋 Dostępni użytkownicy:');
      allUsers.forEach(user => {
        console.log(`- ${user.username || user.email} (role: ${user.roles ? user.roles.join(', ') : 'brak'})`);
      });
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

fixAdminRole(); 