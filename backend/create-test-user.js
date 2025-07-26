const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import modeli
const User = require('./models/userModel');

async function createTestUser() {
  try {
    console.log('🔗 Łączenie z bazą danych...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('✅ Połączono z bazą danych');

    // Sprawdź czy użytkownik testowy już istnieje
    const existingUser = await User.findOne({ email: 'admin@test.com' });
    
    if (existingUser) {
      console.log('✅ Użytkownik testowy już istnieje');
      console.log(`- Email: ${existingUser.email}`);
      console.log(`- Username: ${existingUser.username}`);
      console.log(`- ID: ${existingUser._id}`);
      return existingUser;
    }

    // Utwórz nowego użytkownika testowego
    const hashedPassword = await bcrypt.hash('test123', 12);
    
    const testUser = new User({
      username: 'admin_test',
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Testowy',
      isActive: true,
      isVerified: true,
      role: 'user',
      points: 150,
      level: 2,
      avatar: 'https://via.placeholder.com/150/007bff/ffffff?text=AT',
      profile: {
        bio: 'Użytkownik testowy do wiadomości i znajomych',
        avatar: 'https://via.placeholder.com/150/007bff/ffffff?text=AT',
        location: {
          city: 'Opole',
          voivodeship: 'opolskie',
          county: 'Opole',
          municipality: 'Opole'
        }
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false
        }
      },
      address: {
        street: 'Testowa 123',
        city: 'Opole',
        postalCode: '45-001'
      },
      teryt: {
        voivodeshipCode: '16',
        countyCode: '1661',
        municipalityCode: '166101',
        tercCode: '166101',
        simcCode: '0965190'
      }
    });

    await testUser.save();
    console.log('✅ Utworzono użytkownika testowego');
    console.log(`- Email: ${testUser.email}`);
    console.log(`- Username: ${testUser.username}`);
    console.log(`- Hasło: test123`);
    console.log(`- ID: ${testUser._id}`);

    return testUser;

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia użytkownika:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z bazą danych');
  }
}

// Utwórz dodatkowych użytkowników do testowania
async function createAdditionalTestUsers() {
  try {
    console.log('🔗 Łączenie z bazą danych...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal');
    console.log('✅ Połączono z bazą danych');

    const testUsers = [
      {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@test.com',
        password: 'test123',
        username: 'jan_kowalski',
        profile: {
          bio: 'Testowy użytkownik Jan',
          avatar: 'https://via.placeholder.com/150/28a745/ffffff?text=JK'
        }
      },
      {
        firstName: 'Anna',
        lastName: 'Nowak',
        email: 'anna.nowak@test.com',
        password: 'test123',
        username: 'anna_nowak',
        profile: {
          bio: 'Testowa użytkowniczka Anna',
          avatar: 'https://via.placeholder.com/150/dc3545/ffffff?text=AN'
        }
      },
      {
        firstName: 'Piotr',
        lastName: 'Wiśniewski',
        email: 'piotr.wisniewski@test.com',
        password: 'test123',
        username: 'piotr_wisniewski',
        profile: {
          bio: 'Testowy użytkownik Piotr',
          avatar: 'https://via.placeholder.com/150/ffc107/ffffff?text=PW'
        }
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        const newUser = new User({
          ...userData,
          password: hashedPassword,
          role: 'user',
          isActive: true,
          isVerified: true,
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            privacy: {
              profileVisibility: 'public',
              showEmail: false,
              showPhone: false
            }
          }
        });

        await newUser.save();
        console.log(`✅ Utworzono użytkownika: ${newUser.firstName} ${newUser.lastName} (${newUser.email})`);
      } else {
        console.log(`⚠️ Użytkownik już istnieje: ${existingUser.firstName} ${existingUser.lastName} (${existingUser.email})`);
      }
    }

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia dodatkowych użytkowników:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
}

// Główna funkcja
async function main() {
  try {
    console.log('🚀 Rozpoczynam tworzenie użytkowników testowych...');
    
    // Utwórz głównego użytkownika testowego
    await createTestUser();
    
    // Utwórz dodatkowych użytkowników
    await createAdditionalTestUsers();
    
    console.log('✅ Wszyscy użytkownicy testowi zostali utworzeni!');
    console.log('\n📋 Dane logowania:');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Hasło: test123');
    console.log('\n📧 Dodatkowe konta:');
    console.log('📧 jan.kowalski@test.com / test123');
    console.log('📧 anna.nowak@test.com / test123');
    console.log('📧 piotr.wisniewski@test.com / test123');
    
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia użytkowników:', error);
  }
}

// Uruchom skrypt
if (require.main === module) {
  main();
}

module.exports = { createTestUser, createAdditionalTestUsers }; 