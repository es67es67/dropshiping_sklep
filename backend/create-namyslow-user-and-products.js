const mongoose = require('mongoose');
const User = require('./models/userModel');
const MarketplaceProduct = require('./models/marketplaceProductModel');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://portal:portal123@cluster0.mongodb.net/portal?retryWrites=true&w=majority';

const createNamyslowUserAndProducts = async () => {
  try {
    console.log('🔌 Łączenie z MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z bazą danych');

    // 1. Utwórz użytkownika z lokalizacją Namysłów
    console.log('👤 Tworzenie użytkownika namyslow...');
    
    const hashedPassword = await bcrypt.hash('namyslow123', 12);
    
    const namyslowUser = new User({
      username: 'namyslow',
      email: 'namyslow@example.com',
      password: hashedPassword,
      firstName: 'Jan',
      lastName: 'Namysłów',
      phone: '+48 123 456 789',
      bio: 'Mieszkaniec Namysłowa, pasjonat lokalnego handlu',
      teryt: {
        voivodeshipCode: '16',
        countyCode: '2401',
        municipalityCode: '240104',
        tercCode: '240104',
        simcCode: '0212506',
        ulicCode: '',
        fullCode: '162401240104'
      },
      address: {
        street: 'ul. Rynek',
        houseNumber: '1',
        postalCode: '46-100',
        city: 'Namysłów'
      },
      roles: ['user'],
      isActive: true,
      isVerified: true,
      level: 5,
      points: 150
    });

    await namyslowUser.save();
    console.log('✅ Użytkownik namyslow utworzony:', namyslowUser._id);

    // 2. Dodaj produkty/aukcje do Namysłowa
    console.log('🛍️ Dodawanie produktów do Namysłowa...');

    const products = [
      {
        title: 'Rower górski Trek Marlin 5',
        description: 'Używany rower górski w dobrym stanie. Idealny do jazdy po okolicznych ścieżkach Namysłowa.',
        price: 800,
        originalPrice: 1200,
        category: 'Sport i rekreacja',
        condition: 'używany',
        saleType: 'auction',
        auction: {
          startPrice: 600,
          currentPrice: 600,
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dni
          bids: [],
          minBidIncrement: 50
        },
        images: ['https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Rower+Trek'],
        location: 'Namysłów, Opolskie',
        teryt: {
          voivodeshipCode: '16',
          countyCode: '2401',
          municipalityCode: '240104',
          tercCode: '240104',
          simcCode: '0212506'
        },
        seller: namyslowUser._id,
        tags: ['rower', 'górski', 'sport', 'namysłów'],
        isActive: true,
        views: 45,
        likes: 12
      },
      {
        title: 'Komputer stacjonarny Dell OptiPlex',
        description: 'Komputer biurowy Dell OptiPlex 7010, Intel i5, 8GB RAM, 256GB SSD. Idealny do pracy zdalnej.',
        price: 1200,
        originalPrice: 2000,
        category: 'Elektronika',
        condition: 'używany',
        saleType: 'sale',
        images: ['https://via.placeholder.com/400x300/10B981/FFFFFF?text=Dell+OptiPlex'],
        location: 'Namysłów, Opolskie',
        teryt: {
          voivodeshipCode: '16',
          countyCode: '2401',
          municipalityCode: '240104',
          tercCode: '240104',
          simcCode: '0212506'
        },
        seller: namyslowUser._id,
        tags: ['komputer', 'dell', 'biurowy', 'namysłów'],
        isActive: true,
        views: 78,
        likes: 23
      },
      {
        title: 'Książki historyczne o Namysłowie',
        description: 'Kolekcja książek o historii Namysłowa i okolic. Rzadkie wydania z lat 80-tych.',
        price: 150,
        originalPrice: 300,
        category: 'Książki i media',
        condition: 'używany',
        saleType: 'sale',
        images: ['https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Książki+Namysłów'],
        location: 'Namysłów, Opolskie',
        teryt: {
          voivodeshipCode: '16',
          countyCode: '2401',
          municipalityCode: '240104',
          tercCode: '240104',
          simcCode: '0212506'
        },
        seller: namyslowUser._id,
        tags: ['książki', 'historia', 'namysłów', 'kolekcja'],
        isActive: true,
        views: 34,
        likes: 8
      },
      {
        title: 'Mebelki dla dzieci - komplet',
        description: 'Komplet mebli dziecięcych: łóżko, szafa, biurko. W dobrym stanie, po jednym dziecku.',
        price: 400,
        originalPrice: 800,
        category: 'Dom i ogród',
        condition: 'używany',
        saleType: 'auction',
        auction: {
          startPrice: 300,
          currentPrice: 300,
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dni
          bids: [],
          minBidIncrement: 25
        },
        images: ['https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Mebelki+Dzieci'],
        location: 'Namysłów, Opolskie',
        teryt: {
          voivodeshipCode: '16',
          countyCode: '2401',
          municipalityCode: '240104',
          tercCode: '240104',
          simcCode: '0212506'
        },
        seller: namyslowUser._id,
        tags: ['meble', 'dzieci', 'komplet', 'namysłów'],
        isActive: true,
        views: 67,
        likes: 15
      },
      {
        title: 'Darmowe jabłka z sadu',
        description: 'Darmowe jabłka z własnego sadu w Namysłowie. Zapraszam do samodzielnego zbioru.',
        price: 0,
        originalPrice: 0,
        category: 'Jedzenie i napoje',
        condition: 'nowy',
        saleType: 'free',
        images: ['https://via.placeholder.com/400x300/16A34A/FFFFFF?text=Darmowe+Jabłka'],
        location: 'Namysłów, Opolskie',
        teryt: {
          voivodeshipCode: '16',
          countyCode: '2401',
          municipalityCode: '240104',
          tercCode: '240104',
          simcCode: '0212506'
        },
        seller: namyslowUser._id,
        tags: ['darmowe', 'jabłka', 'sad', 'namysłów'],
        isActive: true,
        views: 156,
        likes: 89
      },
      {
        title: 'Narzędzia ogrodowe',
        description: 'Komplet narzędzi ogrodowych: łopata, grabie, sekator. Idealne do pracy w ogrodzie.',
        price: 200,
        originalPrice: 400,
        category: 'Dom i ogród',
        condition: 'używany',
        saleType: 'sale',
        images: ['https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Narzędzia+Ogrodowe'],
        location: 'Namysłów, Opolskie',
        teryt: {
          voivodeshipCode: '16',
          countyCode: '2401',
          municipalityCode: '240104',
          tercCode: '240104',
          simcCode: '0212506'
        },
        seller: namyslowUser._id,
        tags: ['narzędzia', 'ogród', 'praca', 'namysłów'],
        isActive: true,
        views: 89,
        likes: 27
      }
    ];

    // Dodaj produkty do bazy danych
    for (const productData of products) {
      const product = new MarketplaceProduct(productData);
      await product.save();
      console.log(`✅ Produkt dodany: ${product.title}`);
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

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
};

createNamyslowUserAndProducts(); 