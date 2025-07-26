const mongoose = require('mongoose');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model użytkownika
const User = require('./models/userModel');

async function checkUserDetails() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const userId = '6881e7aaca3621fc31f3d0b0';
    console.log(`🔍 Sprawdzam szczegóły użytkownika o ID: ${userId}`);

    // Sprawdź użytkownika bez wykluczania pól
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('❌ Użytkownik nie został znaleziony');
    } else {
      console.log('✅ Użytkownik znaleziony:');
      console.log(`   ID: ${user._id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   firstName: ${user.firstName || 'BRAK'}`);
      console.log(`   lastName: ${user.lastName || 'BRAK'}`);
      console.log(`   isActive: ${user.isActive}`);
      console.log(`   roles: ${JSON.stringify(user.roles) || 'brak'}`);
      console.log(`   location: ${user.location || 'brak'}`);
      console.log(`   shops: ${user.shops || 'brak'}`);
      console.log(`   posts: ${user.posts || 'brak'}`);
      console.log(`   bio: ${user.bio || 'brak'}`);
      console.log(`   avatar: ${user.avatar || 'brak'}`);
      
      // Sprawdź czy użytkownik ma wymagane pola
      console.log('\n🔍 Sprawdzenie wymaganych pól:');
      console.log(`   firstName istnieje: ${user.hasOwnProperty('firstName')}`);
      console.log(`   lastName istnieje: ${user.hasOwnProperty('lastName')}`);
      console.log(`   username istnieje: ${user.hasOwnProperty('username')}`);
      console.log(`   email istnieje: ${user.hasOwnProperty('email')}`);
    }

    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');

  } catch (error) {
    console.error('❌ Błąd:', error);
    await mongoose.disconnect();
  }
}

checkUserDetails(); 