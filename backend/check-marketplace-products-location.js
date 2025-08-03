const mongoose = require('mongoose');
const MarketplaceProduct = require('./models/marketplaceProductModel');
const User = require('./models/userModel');

const checkMarketplaceProductsLocation = async () => {
  try {
    console.log('🔍 Sprawdzanie produktów marketplace z lokalizacją...');
    
    // Połącz z bazą danych MongoDB Atlas
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych MongoDB');

    // Pobierz użytkownika aaaaaaaaaaaaa
    const user = await User.findOne({ username: 'aaaaaaaaaaaaa' });
    if (!user) {
      console.log('❌ Użytkownik aaaaaaaaaaaaa nie został znaleziony');
      return;
    }

    console.log('👤 Użytkownik:', user.username);
    console.log('📍 TERYT użytkownika:', user.teryt);

    // Pobierz wszystkie produkty marketplace z lokalizacją
    const products = await MarketplaceProduct.find({
      isActive: true,
      isAvailable: true,
      'location.city': { $exists: true, $ne: '' }
    }).populate('seller', 'username');

    console.log(`📦 Znaleziono ${products.length} produktów marketplace z lokalizacją`);

    // Sprawdź dopasowania lokalizacji
    let matches = 0;
    const userTeryt = user.teryt;
    const userCity = user.address?.city;

    products.forEach((product, index) => {
      const productLocation = product.location;
      let isMatch = false;
      let matchReason = '';

      // Sprawdź różne kryteria dopasowania
      if (userTeryt && productLocation) {
        // 1. Dokładne dopasowanie miasta + kod TERYT
        if (userCity && productLocation.city === userCity && 
            productLocation.terytCode === userTeryt.fullCode) {
          isMatch = true;
          matchReason = 'Dokładne dopasowanie miasta + TERYT';
        }
        // 2. Ta sama gmina
        else if (productLocation.municipality === userTeryt.municipalityCode &&
                 productLocation.county === userTeryt.countyCode) {
          isMatch = true;
          matchReason = 'Ta sama gmina';
        }
        // 3. Ten sam powiat
        else if (productLocation.county === userTeryt.countyCode) {
          isMatch = true;
          matchReason = 'Ten sam powiat';
        }
        // 4. To samo województwo
        else if (productLocation.voivodeship === userTeryt.voivodeshipCode) {
          isMatch = true;
          matchReason = 'To samo województwo';
        }
      } else if (userCity && productLocation.city === userCity) {
        // Dopasowanie tylko po mieście
        isMatch = true;
        matchReason = 'To samo miasto';
      }

      if (isMatch) {
        matches++;
        console.log(`\n✅ DOPASOWANIE ${matches}:`);
        console.log(`   Produkt: ${product.name}`);
        console.log(`   Sprzedawca: ${product.seller?.username || 'Nieznany'}`);
        console.log(`   Lokalizacja produktu: ${productLocation.city}, ${productLocation.municipality}, ${productLocation.county}, ${productLocation.voivodeship}`);
        console.log(`   Powód dopasowania: ${matchReason}`);
      }
    });

    console.log(`\n📊 PODSUMOWANIE:`);
    console.log(`   Wszystkie produkty z lokalizacją: ${products.length}`);
    console.log(`   Dopasowania dla użytkownika: ${matches}`);
    console.log(`   Procent dopasowań: ${products.length > 0 ? ((matches / products.length) * 100).toFixed(1) : 0}%`);

    // Pokaż przykłady produktów bez dopasowania
    const nonMatches = products.filter(product => {
      const productLocation = product.location;
      if (userTeryt && productLocation) {
        return !(userCity && productLocation.city === userCity && 
                productLocation.terytCode === userTeryt.fullCode) &&
               !(productLocation.municipality === userTeryt.municipalityCode &&
                 productLocation.county === userTeryt.countyCode) &&
               !(productLocation.county === userTeryt.countyCode) &&
               !(productLocation.voivodeship === userTeryt.voivodeshipCode);
      } else if (userCity) {
        return productLocation.city !== userCity;
      }
      return true;
    });

    if (nonMatches.length > 0) {
      console.log(`\n❌ Przykłady produktów BEZ dopasowania (${nonMatches.length}):`);
      nonMatches.slice(0, 5).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - ${product.location.city}, ${product.location.voivodeship}`);
      });
    }

    console.log('🔌 Połączenie z bazą danych zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

checkMarketplaceProductsLocation(); 