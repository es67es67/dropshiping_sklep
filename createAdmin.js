const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/userModel');

async function createAdmin() {
  try {
    console.log('🔗 Łączenie z MongoDB...');
    
    // Opcje połączenia z dłuższym timeoutem
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 sekund
      socketTimeoutMS: 45000, // 45 sekund
      connectTimeoutMS: 30000, // 30 sekund
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };
    
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0', options);
    
    console.log('✅ Połączono z MongoDB');
    
    // Sprawdź czy admin już istnieje
    const existingAdmin = await User.findOne({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@portal.local' },
        { isAdmin: true }
      ]
    });
    
    if (existingAdmin) {
      console.log('ℹ️ Użytkownik admin już istnieje:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   isAdmin: ${existingAdmin.isAdmin}`);
      return;
    }
    
    console.log('🔐 Tworzenie hasha hasła...');
    
    const hash = await bcrypt.hash('Admin123!', 10);
    
    console.log('👤 Tworzenie użytkownika admina...');
    
    const user = new User({
      username: 'admin',
      email: 'admin@portal.local',
      password: hash,
      isAdmin: true,
      firstName: 'Administrator',
      lastName: 'Portalu',
      roles: ['admin'],
      isVerified: true
    });
    
    await user.save();
    console.log('✅ Utworzono użytkownika admina!');
    console.log('📧 Email: admin@portal.local');
    console.log('🔑 Hasło: Admin123!');
    console.log('👤 Username: admin');
    
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia admina:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️ Użytkownik admin już istnieje w bazie danych');
      console.log('🔍 Sprawdzanie istniejących adminów...');
      try {
        const admins = await User.find({ isAdmin: true });
        admins.forEach(admin => {
          console.log(`   - ${admin.username} (${admin.email})`);
        });
      } catch (err) {
        console.log('❌ Nie można sprawdzić istniejących adminów:', err.message);
      }
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

createAdmin(); 