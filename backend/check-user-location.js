const mongoose = require('mongoose');
const User = require('./models/userModel');

const checkUserLocation = async () => {
  try {
    console.log('🔍 Sprawdzanie lokalizacji użytkownika aaaaaaaaaaaaa...');
    
    // Połącz z bazą danych MongoDB Atlas
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych MongoDB');

    // Znajdź użytkownika
    const user = await User.findOne({ username: 'aaaaaaaaaaaaa' });
    
    if (!user) {
      console.log('❌ Użytkownik aaaaaaaaaaaaa nie został znaleziony');
      return;
    }

    console.log('👤 Użytkownik:', user.email);
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    
    // Sprawdź dane lokalizacji
    console.log('\n📍 DANE LOKALIZACYJNE:');
    
    // 1. Referencja do Location
    if (user.location) {
      console.log('   📍 Location (referencja):', user.location);
    } else {
      console.log('   📍 Location: brak');
    }
    
    // 2. Dane adresowe
    if (user.address) {
      console.log('   🏠 Address:');
      console.log('     Street:', user.address.street || 'brak');
      console.log('     House Number:', user.address.houseNumber || 'brak');
      console.log('     Postal Code:', user.address.postalCode || 'brak');
      console.log('     City:', user.address.city || 'brak');
    } else {
      console.log('   🏠 Address: brak');
    }
    
    // 3. Dane TERYT
    if (user.teryt) {
      console.log('   🗺️ TERYT:');
      console.log('     Voivodeship Code:', user.teryt.voivodeshipCode || 'brak');
      console.log('     County Code:', user.teryt.countyCode || 'brak');
      console.log('     Municipality Code:', user.teryt.municipalityCode || 'brak');
      console.log('     TERC Code:', user.teryt.tercCode || 'brak');
      console.log('     SIMC Code:', user.teryt.simcCode || 'brak');
      console.log('     ULIC Code:', user.teryt.ulicCode || 'brak');
      console.log('     Full Code:', user.teryt.fullCode || 'brak');
    } else {
      console.log('   🗺️ TERYT: brak');
    }
    
    // 4. Współrzędne
    if (user.coordinates) {
      console.log('   📍 Coordinates:');
      console.log('     Lat:', user.coordinates.lat || 'brak');
      console.log('     Lng:', user.coordinates.lng || 'brak');
    } else {
      console.log('   📍 Coordinates: brak');
    }
    
    // 5. Podsumowanie
    console.log('\n📊 PODSUMOWANIE:');
    const hasLocation = !!(user.location || user.address?.city || user.teryt?.simcCode);
    console.log('   Czy ma jakąkolwiek lokalizację:', hasLocation ? '✅ TAK' : '❌ NIE');
    
    if (hasLocation) {
      console.log('   Źródło lokalizacji:');
      if (user.location) console.log('     - Referencja Location');
      if (user.address?.city) console.log('     - Adres (city)');
      if (user.teryt?.simcCode) console.log('     - TERYT (SIMC)');
    }

    console.log('🔌 Połączenie z bazą danych zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

checkUserLocation(); 