const checkUserLocation = async () => {
  try {
    console.log('🔍 Sprawdzanie lokalizacji użytkownika aaaaaaaaaaaaa...');
    
    // 1. Zaloguj się jako użytkownik aaaaaaaaaaaaa
    console.log('🔐 Logowanie użytkownika aaaaaaaaaaaaa...');
    
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrUsername: 'aaaaaaaaaaaaa',
        password: 'tajne123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Błąd logowania użytkownika aaaaaaaaaaaaa');
      return;
    }
    
    const loginResult = await loginResponse.json();
    const token = loginResult.token;
    console.log('✅ Zalogowano pomyślnie');
    
    // 2. Pobierz profil użytkownika
    console.log('📊 Pobieranie profilu użytkownika...');
    
    const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!profileResponse.ok) {
      console.log('❌ Błąd pobierania profilu');
      return;
    }
    
    const profileData = await profileResponse.json();
    console.log('✅ Profil pobrany pomyślnie');
    
    // 3. Wyświetl dane lokalizacji
    console.log('\n📍 DANE LOKALIZACJI UŻYTKOWNIKA aaaaaaaaaaaaa:');
    console.log('=====================================');
    
    if (profileData.teryt) {
      console.log('🗺️ Dane TERYT:');
      console.log('- Województwo (kod):', profileData.teryt.voivodeshipCode);
      console.log('- Powiat (kod):', profileData.teryt.countyCode);
      console.log('- Gmina (kod):', profileData.teryt.municipalityCode);
      console.log('- TERC (kod):', profileData.teryt.tercCode);
      console.log('- SIMC (kod):', profileData.teryt.simcCode);
      console.log('- ULIC (kod):', profileData.teryt.ulicCode);
      console.log('- Pełny kod:', profileData.teryt.fullCode);
    } else {
      console.log('⚠️ Brak danych TERYT');
    }
    
    if (profileData.address) {
      console.log('\n🏠 Dane adresowe:');
      console.log('- Ulica:', profileData.address.street);
      console.log('- Numer domu:', profileData.address.houseNumber);
      console.log('- Kod pocztowy:', profileData.address.postalCode);
      console.log('- Miasto:', profileData.address.city);
    } else {
      console.log('⚠️ Brak danych adresowych');
    }
    
    if (profileData.location) {
      console.log('\n📍 Pole location:', profileData.location);
    } else {
      console.log('⚠️ Brak pola location');
    }
    
    // 4. Sprawdź produkty użytkownika
    console.log('\n🛍️ PRODUKTY UŻYTKOWNIKA:');
    console.log('=====================================');
    
    const productsResponse = await fetch('http://localhost:5000/api/marketplace?seller=aaaaaaaaaaaaa', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log(`📦 Znaleziono ${productsData.products ? productsData.products.length : 0} produktów użytkownika`);
      
      const products = productsData.products || productsData || [];
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   Cena: ${product.price} zł`);
        console.log(`   Kategoria: ${product.category}`);
        console.log(`   Typ sprzedaży: ${product.saleType}`);
        
        if (product.location) {
          console.log(`   📍 Lokalizacja produktu:`);
          console.log(`      - Województwo: ${product.location.voivodeship}`);
          console.log(`      - Powiat: ${product.location.county}`);
          console.log(`      - Gmina: ${product.location.municipality}`);
          console.log(`      - Miasto: ${product.location.city}`);
          console.log(`      - Kod TERYT: ${product.location.terytCode}`);
        } else {
          console.log(`   ⚠️ Brak danych lokalizacji produktu`);
        }
      });
    } else {
      console.log('❌ Błąd pobierania produktów użytkownika');
    }
    
    // 5. Sprawdź jak lokalizacja jest przekazywana do Giełdy
    console.log('\n🌐 JAK LOKALIZACJA JEST PRZEKAZYWANA DO GIEŁDY:');
    console.log('=====================================');
    
    // Sprawdź endpoint Giełdy
    const marketplaceResponse = await fetch('http://localhost:5000/api/marketplace', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (marketplaceResponse.ok) {
      const marketplaceData = await marketplaceResponse.json();
      const products = marketplaceData.products || marketplaceData || [];
      console.log(`📊 Giełda zawiera ${products.length} produktów`);
      
      // Sprawdź pierwsze 3 produkty z lokalizacją
      const productsWithLocation = products.filter(p => p.location).slice(0, 3);
      
      console.log('\n📍 Przykłady lokalizacji produktów na Giełdzie:');
      productsWithLocation.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   Lokalizacja: ${JSON.stringify(product.location, null, 2)}`);
      });
      
      // Sprawdź czy są produkty z Namysłowa
      const namyslowProducts = products.filter(p => 
        p.location && p.location.city === 'Namysłów'
      );
      
      console.log(`\n🏘️ Produkty z Namysłowa: ${namyslowProducts.length}`);
      namyslowProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - ${product.price} zł`);
      });
      
    } else {
      console.log('❌ Błąd pobierania danych Giełdy');
    }
    
    console.log('\n✅ Sprawdzanie zakończone');
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  }
};

checkUserLocation(); 