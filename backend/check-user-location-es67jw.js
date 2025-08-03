const mongoose = require('mongoose');
const User = require('./models/userModel');

const MONGODB_URI = 'mongodb+srv://portal:portal123@cluster0.mongodb.net/portal?retryWrites=true&w=majority';

const checkUserLocation = async () => {
  try {
    console.log('🔌 Łączenie z MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z bazą danych');

    const user = await User.findOne({ email: 'es67jwklkk@gmail.com' });
    
    if (!user) {
      console.log('❌ Użytkownik nie znaleziony');
      return;
    }

    console.log('👤 Użytkownik znaleziony:', user.username);
    console.log('📧 Email:', user.email);
    console.log('📅 Utworzony:', user.createdAt);
    console.log('🔄 Ostatnia aktualizacja:', user.updatedAt);
    
    console.log('\n📍 DANE LOKALIZACJI:');
    console.log('location (ObjectId):', user.location);
    console.log('teryt:', user.teryt);
    console.log('address:', user.address);
    console.log('coordinates:', user.coordinates);
    
    if (user.teryt) {
      console.log('\n🗺️ SZCZEGÓŁY TERYT:');
      console.log('Kod:', user.teryt.code);
      console.log('Typ:', user.teryt.type);
      if (user.teryt.gmina) {
        console.log('Gmina kod:', user.teryt.gmina.code);
        console.log('Gmina nazwa:', user.teryt.gmina.name);
      }
      if (user.teryt.powiat) {
        console.log('Powiat kod:', user.teryt.powiat.code);
        console.log('Powiat nazwa:', user.teryt.powiat.name);
      }
      if (user.teryt.wojewodztwo) {
        console.log('Województwo kod:', user.teryt.wojewodztwo.code);
        console.log('Województwo nazwa:', user.teryt.wojewodztwo.name);
      }
    }

    console.log('\n📊 WSZYSTKIE POLA UŻYTKOWNIKA:');
    console.log(JSON.stringify(user.toObject(), null, 2));

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
};

checkUserLocation(); 