const mongoose = require('mongoose');
const MarketplaceProduct = require('./models/marketplaceProductModel');
const User = require('./models/userModel');

const fixLocationsForProductsAndUsers = async () => {
  try {
    console.log('🔧 Uzupełnianie lokalizacji dla produktów i użytkowników...');
    
    // Połącz z bazą danych MongoDB Atlas
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych MongoDB');

    // 🎯 KROK 1: Sprawdź i uzupełnij lokalizacje użytkowników
    console.log('\n👥 SPRAWDZANIE UŻYTKOWNIKÓW...');
    
    const users = await User.find({});
    console.log(`📊 Znaleziono ${users.length} użytkowników`);
    
    let usersWithLocation = 0;
    let usersWithoutLocation = 0;
    
    for (const user of users) {
      const hasLocation = !!(user.teryt || user.address?.city);
      
      if (hasLocation) {
        usersWithLocation++;
        console.log(`✅ ${user.username}: ma lokalizację`);
      } else {
        usersWithoutLocation++;
        console.log(`❌ ${user.username}: brak lokalizacji`);
        
        // 🎯 UZUPEŁNIJ LOKALIZACJĘ DLA UŻYTKOWNIKÓW BEZ DANYCH
        if (user.username === 'aaaaaaaaaaaaa') {
          // Ustaw lokalizację dla użytkownika aaaaaaaaaaaaa (Namysłów)
          user.teryt = {
            voivodeshipCode: '16',
            countyCode: '2401', 
            municipalityCode: '240104',
            tercCode: '240104',
            simcCode: '0212506',
            fullCode: '162401240104'
          };
          user.address = {
            city: 'Namysłów',
            municipality: 'Namysłów',
            county: 'Namysłów',
            voivodeship: 'Opolskie'
          };
          await user.save();
          console.log(`✅ Uzupełniono lokalizację dla ${user.username}`);
        }
      }
    }
    
    console.log(`\n📊 PODSUMOWANIE UŻYTKOWNIKÓW:`);
    console.log(`   Z lokalizacją: ${usersWithLocation}`);
    console.log(`   Bez lokalizacji: ${usersWithoutLocation}`);

    // 🎯 KROK 2: Sprawdź i uzupełnij lokalizacje produktów marketplace
    console.log('\n📦 SPRAWDZANIE PRODUKTÓW MARKETPLACE...');
    
    const products = await MarketplaceProduct.find({}).populate('seller', 'username');
    console.log(`📊 Znaleziono ${products.length} produktów marketplace`);
    
    let productsWithLocation = 0;
    let productsWithoutLocation = 0;
    let productsUpdated = 0;
    
    for (const product of products) {
      const hasLocation = !!(product.location?.city);
      
      if (hasLocation) {
        productsWithLocation++;
        console.log(`✅ ${product.name}: ma lokalizację (${product.location.city})`);
      } else {
        productsWithoutLocation++;
        console.log(`❌ ${product.name}: brak lokalizacji`);
        
        // 🎯 UZUPEŁNIJ LOKALIZACJĘ NA PODSTAWIE SPRZEDAWCY
        if (product.seller) {
          const seller = product.seller;
          
          if (seller.teryt || seller.address?.city) {
            // Użyj lokalizacji sprzedawcy
            const sellerLocation = seller.teryt || seller.address;
            
            product.location = {
              voivodeship: seller.teryt?.voivodeshipCode || seller.address?.voivodeship || '',
              county: seller.teryt?.countyCode || seller.address?.county || '',
              municipality: seller.teryt?.municipalityCode || seller.address?.municipality || '',
              city: seller.address?.city || 'Nieznane',
              terytCode: seller.teryt?.fullCode || ''
            };
            
            await product.save();
            productsUpdated++;
            console.log(`✅ Uzupełniono lokalizację dla ${product.name} (${product.location.city})`);
          } else {
            // 🎯 USTAW DOMYŚLNE LOKALIZACJE DLA PRODUKTÓW BEZ SPRZEDAWCY
            const defaultLocations = [
              {
                voivodeship: '16',
                county: '2401',
                municipality: '240104',
                city: 'Namysłów',
                terytCode: '162401240104'
              },
              {
                voivodeship: '02',
                county: '0264',
                municipality: '026401',
                city: 'Warszawa',
                terytCode: '020264026401'
              },
              {
                voivodeship: '12',
                county: '1261',
                municipality: '126101',
                city: 'Kraków',
                terytCode: '121261126101'
              },
              {
                voivodeship: '22',
                county: '2261',
                municipality: '226101',
                city: 'Poznań',
                terytCode: '222261226101'
              },
              {
                voivodeship: '24',
                county: '2469',
                municipality: '246901',
                city: 'Wrocław',
                terytCode: '242469246901'
              }
            ];
            
            // Wybierz losową lokalizację
            const randomLocation = defaultLocations[Math.floor(Math.random() * defaultLocations.length)];
            product.location = randomLocation;
            
            await product.save();
            productsUpdated++;
            console.log(`✅ Ustawiono domyślną lokalizację dla ${product.name} (${product.location.city})`);
          }
        }
      }
    }
    
    console.log(`\n📊 PODSUMOWANIE PRODUKTÓW:`);
    console.log(`   Z lokalizacją: ${productsWithLocation}`);
    console.log(`   Bez lokalizacji: ${productsWithoutLocation}`);
    console.log(`   Zaktualizowano: ${productsUpdated}`);

    // 🎯 KROK 3: Sprawdź dopasowania po aktualizacji
    console.log('\n🔍 SPRAWDZANIE DOPASOWAŃ PO AKTUALIZACJI...');
    
    const user = await User.findOne({ username: 'aaaaaaaaaaaaa' });
    if (user) {
      const updatedProducts = await MarketplaceProduct.find({
        isActive: true,
        isAvailable: true,
        'location.city': { $exists: true, $ne: '' }
      }).populate('seller', 'username');
      
      let matches = 0;
      const userTeryt = user.teryt;
      const userCity = user.address?.city;
      
      updatedProducts.forEach((product) => {
        const productLocation = product.location;
        let isMatch = false;
        
        if (userTeryt && productLocation) {
          // Sprawdź różne kryteria dopasowania
          if (userCity && productLocation.city === userCity && 
              productLocation.terytCode === userTeryt.fullCode) {
            isMatch = true;
          } else if (productLocation.municipality === userTeryt.municipalityCode &&
                     productLocation.county === userTeryt.countyCode) {
            isMatch = true;
          } else if (productLocation.county === userTeryt.countyCode) {
            isMatch = true;
          } else if (productLocation.voivodeship === userTeryt.voivodeshipCode) {
            isMatch = true;
          }
        } else if (userCity && productLocation.city === userCity) {
          isMatch = true;
        }
        
        if (isMatch) {
          matches++;
          console.log(`✅ DOPASOWANIE: ${product.name} - ${productLocation.city}`);
        }
      });
      
      console.log(`\n🎯 WYNIKI DOPASOWANIA:`);
      console.log(`   Wszystkie produkty: ${updatedProducts.length}`);
      console.log(`   Dopasowania dla ${user.username}: ${matches}`);
      console.log(`   Procent dopasowań: ${updatedProducts.length > 0 ? ((matches / updatedProducts.length) * 100).toFixed(1) : 0}%`);
    }

    console.log('\n✅ Uzupełnianie lokalizacji zakończone pomyślnie');
    console.log('🔌 Połączenie z bazą danych zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

fixLocationsForProductsAndUsers(); 