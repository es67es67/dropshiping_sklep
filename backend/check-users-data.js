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

async function checkUsersData() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Sprawdź wszystkich użytkowników
    const allUsers = await User.find({}).select('-password');
    
    console.log('\n👥 Wszyscy użytkownicy w bazie:');
    console.log('================================');
    console.log(`Znaleziono ${allUsers.length} użytkowników`);
    
    if (allUsers.length > 0) {
      console.log('\n📋 Lista użytkowników:');
      console.log('======================');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username || user.email}`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Role: ${user.roles ? user.roles.join(', ') : 'brak ról'}`);
        console.log(`   - Aktywny: ${user.isActive ? 'Tak' : 'Nie'}`);
        console.log(`   - Data utworzenia: ${user.createdAt ? user.createdAt.toLocaleDateString('pl-PL') : 'brak'}`);
        console.log('');
      });
      
      // Sprawdź adminów
      const admins = allUsers.filter(user => user.roles && user.roles.includes('admin'));
      console.log('\n🔧 Administratorzy:');
      console.log('==================');
      if (admins.length > 0) {
        admins.forEach(admin => {
          console.log(`- ${admin.username || admin.email} (${admin.email})`);
        });
      } else {
        console.log('❌ Brak administratorów w bazie');
      }
      
      // Sprawdź aktywnych użytkowników
      const activeUsers = allUsers.filter(user => user.isActive);
      console.log('\n✅ Aktywni użytkownicy:');
      console.log('======================');
      console.log(`${activeUsers.length} z ${allUsers.length} użytkowników`);
      
      // Sprawdź role
      const allRoles = new Set();
      allUsers.forEach(user => {
        if (user.roles) {
          user.roles.forEach(role => allRoles.add(role));
        }
      });
      
      console.log('\n🎭 Wszystkie role w systemie:');
      console.log('============================');
      if (allRoles.size > 0) {
        Array.from(allRoles).forEach(role => {
          const count = allUsers.filter(user => user.roles && user.roles.includes(role)).length;
          console.log(`- ${role}: ${count} użytkowników`);
        });
      } else {
        console.log('❌ Brak przypisanych ról');
      }
      
    } else {
      console.log('❌ Brak użytkowników w bazie');
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkUsersData(); 