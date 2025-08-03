const createNamyslowViaAPI = async () => {
  try {
    console.log('🔌 Tworzenie użytkownika i produktów przez API...');
    
    // 1. Utwórz użytkownika przez API
    console.log('👤 Tworzenie użytkownika namyslow...');
    
    const userData = {
      username: 'namyslow',
      email: 'namyslow@example.com',
      password: 'namyslow123',
      firstName: 'Jan',
      lastName: 'Namysłów',
      phone: '+48 123 456 789',
      dateOfBirth: '1985-06-15',
      gender: 'male',
      locationData: {
        address: {
          street: 'ul. Rynek',
          houseNumber: '1',
          postalCode: '46-100',
          city: 'Namysłów'
        },
        teryt: {
          voivodeshipCode: '16',
          countyCode: '2401',
          municipalityCode: '240104',
          tercCode: '240104',
          simcCode: '0212506',
          ulicCode: '',
          fullCode: '162401240104'
        }
      }
    };
    
    const registerResponse = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.log('⚠️ Użytkownik może już istnieć:', errorData.error);
    } else {
      const userResult = await registerResponse.json();
      console.log('✅ Użytkownik utworzony:', userResult.user.username);
    }
    
    // 2. Zaloguj się jako użytkownik namyslow
    console.log('🔐 Logowanie użytkownika namyslow...');
    
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrUsername: 'namyslow',
        password: 'namyslow123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Błąd logowania - użytkownik może nie istnieć');
      return;
    }
    
    const loginResult = await loginResponse.json();
    const token = loginResult.token;
    console.log('✅ Zalogowano pomyślnie');
    
    // 3. Dodaj produkty przez API
    console.log('🛍️ Dodawanie produktów do Namysłowa...');
    
    const products = [
      {
        name: 'Rower górski Trek Marlin 5',
        description: 'Używany rower górski w dobrym stanie. Idealny do jazdy po okolicznych ścieżkach Namysłowa.',
        price: 800,
        originalPrice: 1200,
        category: 'Sport',
        condition: 'used',
        saleType: 'auction',
        auction: {
          startPrice: 600,
          currentPrice: 600,
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          bids: [],
          minBidIncrement: 50
        },
        images: ['https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Rower+Trek'],
        location: {
          voivodeship: 'Opolskie',
          county: 'namysłówski',
          municipality: 'Namysłów',
          city: 'Namysłów',
          terytCode: '162401240104'
        },
        tags: ['rower', 'górski', 'sport', 'namysłów'],
        isActive: true
      },
      {
        name: 'Komputer stacjonarny Dell OptiPlex',
        description: 'Komputer biurowy Dell OptiPlex 7010, Intel i5, 8GB RAM, 256GB SSD. Idealny do pracy zdalnej.',
        price: 1200,
        originalPrice: 2000,
        category: 'Elektronika',
        condition: 'used',
        saleType: 'fixed_price',
        images: ['https://via.placeholder.com/400x300/10B981/FFFFFF?text=Dell+OptiPlex'],
        location: {
          voivodeship: 'Opolskie',
          county: 'namysłówski',
          municipality: 'Namysłów',
          city: 'Namysłów',
          terytCode: '162401240104'
        },
        tags: ['komputer', 'dell', 'biurowy', 'namysłów'],
        isActive: true
      },
      {
        name: 'Książki historyczne o Namysłowie',
        description: 'Kolekcja książek o historii Namysłowa i okolic. Rzadkie wydania z lat 80-tych.',
        price: 150,
        originalPrice: 300,
        category: 'Książki',
        condition: 'used',
        saleType: 'fixed_price',
        images: ['https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Książki+Namysłów'],
        location: {
          voivodeship: 'Opolskie',
          county: 'namysłówski',
          municipality: 'Namysłów',
          city: 'Namysłów',
          terytCode: '162401240104'
        },
        tags: ['książki', 'historia', 'namysłów', 'kolekcja'],
        isActive: true
      },
      {
        name: 'Mebelki dla dzieci - komplet',
        description: 'Komplet mebli dziecięcych: łóżko, szafa, biurko. W dobrym stanie, po jednym dziecku.',
        price: 400,
        originalPrice: 800,
        category: 'Dom i Ogród',
        condition: 'used',
        saleType: 'auction',
        auction: {
          startPrice: 300,
          currentPrice: 300,
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          bids: [],
          minBidIncrement: 25
        },
        images: ['https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Mebelki+Dzieci'],
        location: {
          voivodeship: 'Opolskie',
          county: 'namysłówski',
          municipality: 'Namysłów',
          city: 'Namysłów',
          terytCode: '162401240104'
        },
        tags: ['meble', 'dzieci', 'komplet', 'namysłów'],
        isActive: true
      },
      {
        name: 'Darmowe jabłka z sadu',
        description: 'Darmowe jabłka z własnego sadu w Namysłowie. Zapraszam do samodzielnego zbioru.',
        price: 0,
        originalPrice: 0,
        category: 'Inne',
        condition: 'new',
        saleType: 'free',
        images: ['https://via.placeholder.com/400x300/16A34A/FFFFFF?text=Darmowe+Jabłka'],
        location: {
          voivodeship: 'Opolskie',
          county: 'namysłówski',
          municipality: 'Namysłów',
          city: 'Namysłów',
          terytCode: '162401240104'
        },
        tags: ['darmowe', 'jabłka', 'sad', 'namysłów'],
        isActive: true
      },
      {
        name: 'Narzędzia ogrodowe',
        description: 'Komplet narzędzi ogrodowych: łopata, grabie, sekator. Idealne do pracy w ogrodzie.',
        price: 200,
        originalPrice: 400,
        category: 'Dom i Ogród',
        condition: 'used',
        saleType: 'fixed_price',
        images: ['https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Narzędzia+Ogrodowe'],
        location: {
          voivodeship: 'Opolskie',
          county: 'namysłówski',
          municipality: 'Namysłów',
          city: 'Namysłów',
          terytCode: '162401240104'
        },
        tags: ['narzędzia', 'ogród', 'praca', 'namysłów'],
        isActive: true
      }
    ];
    
    // Dodaj produkty przez API
    for (const productData of products) {
      try {
        const productResponse = await fetch('http://localhost:5000/api/marketplace', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        });
        
        if (productResponse.ok) {
          const productResult = await productResponse.json();
          console.log(`✅ Produkt dodany: ${productData.name}`);
        } else {
          const errorData = await productResponse.json();
          console.log(`⚠️ Błąd dodawania produktu ${productData.name}:`, errorData.error);
        }
      } catch (error) {
        console.log(`❌ Błąd dodawania produktu ${productData.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Pomyślnie utworzono:');
    console.log('👤 Użytkownik: namyslow (namyslow@example.com)');
    console.log('🔑 Hasło: namyslow123');
    console.log('📍 Lokalizacja: Namysłów, Opolskie');
    console.log('🛍️ Produkty: 6 produktów (w tym 2 aukcje, 1 darmowy)');
    console.log('\n📊 Statystyki:');
    console.log('- 2 aukcje (rower, mebelki)');
    console.log('- 3 sprzedaże (komputer, książki, narzędzia)');
    console.log('- 1 darmowy produkt (jabłka)');
    console.log('\n🌐 Możesz teraz:');
    console.log('1. Zalogować się jako namyslow@example.com / namyslow123');
    console.log('2. Sprawdzić produkty na http://localhost:3000/products');
    console.log('3. Filtrować po lokalizacji "Namysłów"');
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  }
};

createNamyslowViaAPI(); 