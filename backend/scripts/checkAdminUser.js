const mongoose = require('mongoose');
const User = require('../models/userModel');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkAndFixAdminUser() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Sprawdź użytkownika admin@test.com
    const adminUser = await User.findOne({ email: 'admin@test.com' });
    
    if (!adminUser) {
      console.log('❌ Użytkownik admin@test.com nie istnieje w bazie');
      console.log('📝 Tworzę użytkownika admin@test.com...');
      
      const newAdminUser = new User({
        username: 'admin',
        email: 'admin@test.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqQKqK', // hasło: test123
        firstName: 'Admin',
        lastName: 'Test',
        roles: ['admin'],
        isActive: true,
        isVerified: true
      });
      
      await newAdminUser.save();
      console.log('✅ Utworzono użytkownika admin@test.com z rolą admin');
    } else {
      console.log('✅ Użytkownik admin@test.com istnieje');
      console.log('📊 Aktualne role:', adminUser.roles);
      
      // Sprawdź czy ma rolę admina
      if (!adminUser.roles || !adminUser.roles.includes('admin')) {
        console.log('⚠️ Użytkownik nie ma roli admina, dodaję...');
        
        if (!adminUser.roles) {
          adminUser.roles = ['admin'];
        } else {
          adminUser.roles.push('admin');
        }
        
        await adminUser.save();
        console.log('✅ Dodano rolę admina do użytkownika');
        console.log('📊 Nowe role:', adminUser.roles);
      } else {
        console.log('✅ Użytkownik już ma rolę admina');
      }
    }

    // Sprawdź wszystkich użytkowników z rolą admina
    const allAdmins = await User.find({ roles: { $in: ['admin'] } });
    console.log('\n👥 Wszyscy administratorzy w systemie:');
    allAdmins.forEach(admin => {
      console.log(`- ${admin.email} (${admin.username}) - role: ${admin.roles.join(', ')}`);
    });

    // Sprawdź strukturę pola roles
    const sampleUser = await User.findOne({});
    if (sampleUser) {
      console.log('\n📋 Struktura pola roles w modelu:');
      console.log('- Typ:', typeof sampleUser.roles);
      console.log('- Jest tablicą:', Array.isArray(sampleUser.roles));
      console.log('- Wartość:', sampleUser.roles);
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

// Uruchom skrypt
checkAndFixAdminUser(); 