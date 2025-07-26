const mongoose = require('mongoose');
const User = require('./backend/models/userModel');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function createTestUser() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ email: 'admin@test.com' });
    
    if (existingUser) {
      console.log('✅ Użytkownik testowy już istnieje');
      console.log(`📧 Email: ${existingUser.email}`);
      console.log(`👤 Nazwa: ${existingUser.firstName} ${existingUser.lastName}`);
      console.log(`🆔 ID: ${existingUser._id}`);
      return existingUser;
    }

    // Utwórz nowego użytkownika testowego
    const testUser = new User({
      firstName: 'Admin',
      lastName: 'Testowy',
      email: 'admin@test.com',
      password: 'test123',
      username: 'admin_test',
      role: 'user',
      isActive: true,
      isVerified: true,
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
      }
    });

    await testUser.save();
    console.log('✅ Utworzono użytkownika testowego');
    console.log(`📧 Email: ${testUser.email}`);
    console.log(`🔑 Hasło: test123`);
    console.log(`👤 Nazwa: ${testUser.firstName} ${testUser.lastName}`);
    console.log(`🆔 ID: ${testUser._id}`);

    return testUser;

  } catch (error) {
    console.error('❌ Błąd podczas tworzenia użytkownika testowego:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

// Utwórz dodatkowych użytkowników do testowania
async function createAdditionalTestUsers() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

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
        const newUser = new User({
          ...userData,
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
    console.log('🔌 Rozłączono z MongoDB');
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