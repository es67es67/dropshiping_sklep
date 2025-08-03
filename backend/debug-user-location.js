const mongoose = require('mongoose');
const User = require('./models/userModel');
const MarketplaceProduct = require('./models/marketplaceProductModel');

// Połącz z MongoDB
mongoose.connect('mongodb://localhost:27017/portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function debugUserLocation() {
  try {
    console.log('🔍 Debugowanie lokalizacji użytkownika...');
    
    // Sprawdź użytkownika
    const userId = '6889a3f6e1ac1a771c78b9a7';
    const user = await User.findById(userId);
    
    console.log('\n👤 DANE UŻYTKOWNIKA:');
    console.log('ID:', user._id);
    console.log('Email:', user.email);
    console.log('Address:', user.address);
    console.log('TERYT:', user.teryt);
    
    // Sprawdź produkty
    console.log('\n📦 PRODUKTY W BAZIE:');
    const products = await MarketplaceProduct.find({}, {title: 1, 'location.city': 1, 'location.terytCode': 1});
    
    console.log('Liczba produktów:', products.length);
    
    // Produkty z lokalizacją
    const productsWithLocation = products.filter(p => p.location?.city);
    console.log('Produkty z lokalizacją:', productsWithLocation.length);
    
    // Produkty bez lokalizacji
    const productsWithoutLocation = products.filter(p => !p.location?.city);
    console.log('Produkty bez lokalizacji:', productsWithoutLocation.length);
    
    // Sprawdź miasta
    const cities = [...new Set(productsWithLocation.map(p => p.location.city))];
    console.log('Miasta w produktach:', cities);
    
    // Sprawdź produkty z Namysłowa
    const namyslowProducts = products.filter(p => p.location?.city === 'Namysłów');
    console.log('Produkty z Namysłowa:', namyslowProducts.length);
    
    // Sprawdź produkty z innych miast
    const otherCitiesProducts = products.filter(p => p.location?.city && p.location.city !== 'Namysłów');
    console.log('Produkty z innych miast:', otherCitiesProducts.length);
    
    console.log('\n🎯 DIAGNOZA:');
    if (!user.address?.city && !user.teryt?.city) {
      console.log('❌ Użytkownik nie ma ustawionej lokalizacji');
    } else {
      console.log('✅ Użytkownik ma lokalizację:', user.address?.city || user.teryt?.city);
    }
    
    if (productsWithoutLocation.length > 0) {
      console.log('❌ Niektóre produkty nie mają lokalizacji');
    } else {
      console.log('✅ Wszystkie produkty mają lokalizację');
    }
    
    if (namyslowProducts.length === 0) {
      console.log('❌ Brak produktów z Namysłowa');
    } else {
      console.log('✅ Znaleziono produkty z Namysłowa');
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugUserLocation(); 