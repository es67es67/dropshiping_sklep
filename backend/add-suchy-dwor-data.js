const mongoose = require('mongoose');
require('dotenv').config();

// Połącz z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const Miejscowosc = require('./models/miejscowoscModel');
const User = require('./models/userModel');
const Shop = require('./models/shopModel');
const Product = require('./models/productModel');
const Post = require('./models/postModel');
const CompanyProfile = require('./models/companyProfileModel');

async function addSuchyDworData() {
  try {
    console.log('🔍 Znajduję miasto Suchy Dwór...');
    
    // Znajdź miasto Suchy Dwór
    const suchyDwor = await Miejscowosc.findOne({ code: '0884766' });
    
    if (!suchyDwor) {
      console.log('❌ Nie znaleziono miasta Suchy Dwór!');
      return;
    }
    
    console.log(`✅ Znaleziono miasto: ${suchyDwor.name} (kod: ${suchyDwor.code})`);
    
    // Dodaj przykładowe dane
    console.log('📊 Dodaję przykładowe dane dla miasta Suchy Dwór...');
    
    // 1. Dodaj użytkowników
    const users = [
      {
        username: 'jan_kowalski_suchy_dwor',
        email: 'jan.kowalski.suchy.dwor@example.com',
        password: '$2b$10$example_hash',
        firstName: 'Jan',
        lastName: 'Kowalski',
        location: suchyDwor._id,
        address: {
          street: 'Główna',
          houseNumber: '15',
          postalCode: '55-080',
          city: 'Suchy Dwór'
        },
        teryt: {
          simcCode: '0884766',
          tercCode: '022301'
        },
        isActive: true
      },
      {
        username: 'anna_nowak_suchy_dwor',
        email: 'anna.nowak.suchy.dwor@example.com',
        password: '$2b$10$example_hash',
        firstName: 'Anna',
        lastName: 'Nowak',
        location: suchyDwor._id,
        address: {
          street: 'Długa',
          houseNumber: '8',
          postalCode: '55-080',
          city: 'Suchy Dwór'
        },
        teryt: {
          simcCode: '0884766',
          tercCode: '022301'
        },
        isActive: true
      }
    ];
    
    // 2. Dodaj sklepy
    const shops = [
      {
        name: 'Sklep Spożywczy Suchy Dwór',
        description: 'Sklep spożywczy z lokalnymi produktami',
        owner: null, // Będzie ustawione po dodaniu użytkowników
        email: 'sklep.suchy.dwor@example.com',
        phone: '+48 123 456 789',
        address: {
          street: 'Główna',
          houseNumber: '25',
          postalCode: '55-080',
          city: 'Suchy Dwór'
        },
        category: 'spożywczy',
        isActive: true
      },
      {
        name: 'Piekarnia Suchy Dwór',
        description: 'Świeże pieczywo i ciasta',
        owner: null,
        email: 'piekarnia.suchy.dwor@example.com',
        phone: '+48 987 654 321',
        address: {
          street: 'Długa',
          houseNumber: '12',
          postalCode: '55-080',
          city: 'Suchy Dwór'
        },
        category: 'piekarnia',
        isActive: true
      }
    ];
    
    // 3. Dodaj firmy
    const companies = [
      {
        name: 'Firma Budowlana Suchy Dwór',
        description: 'Usługi budowlane i remontowe',
        owner: null,
        location: suchyDwor._id,
        address: {
          street: 'Przemysłowa',
          houseNumber: '5',
          postalCode: '55-080',
          city: 'Suchy Dwór'
        },
        category: 'budowlana',
        isActive: true
      }
    ];
    
    // 4. Dodaj produkty
    const products = [
      {
        name: 'Chleb wiejski',
        description: 'Świeży chleb wiejski z lokalnej piekarni',
        price: 4.50,
        shop: null, // Będzie ustawione po dodaniu sklepów
        location: suchyDwor._id,
        category: 'pieczywo',
        isActive: true
      },
      {
        name: 'Mleko lokalne',
        description: 'Świeże mleko od lokalnego rolnika',
        price: 3.20,
        shop: null,
        location: suchyDwor._id,
        category: 'nabiał',
        isActive: true
      }
    ];
    
    // 5. Dodaj posty
    const posts = [
      {
        title: 'Witamy w Suchym Dworze!',
        content: 'Miło powitać wszystkich mieszkańców naszej pięknej miejscowości.',
        author: null, // Będzie ustawione po dodaniu użytkowników
        location: suchyDwor._id,
        isActive: true
      },
      {
        title: 'Nowy sklep w Suchym Dworze',
        content: 'W naszej miejscowości otworzył się nowy sklep spożywczy.',
        author: null,
        location: suchyDwor._id,
        isActive: true
      }
    ];
    
    // Dodaj użytkowników
    console.log('👥 Dodaję użytkowników...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Dodano ${createdUsers.length} użytkowników`);
    
    // Dodaj sklepy
    console.log('🏪 Dodaję sklepy...');
    shops[0].owner = createdUsers[0]._id;
    shops[1].owner = createdUsers[1]._id;
    const createdShops = await Shop.insertMany(shops);
    console.log(`✅ Dodano ${createdShops.length} sklepów`);
    
    // Dodaj firmy
    console.log('🏢 Dodaję firmy...');
    companies[0].owner = createdUsers[0]._id;
    const createdCompanies = await CompanyProfile.insertMany(companies);
    console.log(`✅ Dodano ${createdCompanies.length} firm`);
    
    // Dodaj produkty
    console.log('📦 Dodaję produkty...');
    products[0].shop = createdShops[0]._id;
    products[1].shop = createdShops[0]._id;
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Dodano ${createdProducts.length} produktów`);
    
    // Dodaj posty
    console.log('📝 Dodaję posty...');
    posts[0].author = createdUsers[0]._id;
    posts[1].author = createdUsers[1]._id;
    const createdPosts = await Post.insertMany(posts);
    console.log(`✅ Dodano ${createdPosts.length} postów`);
    
    // Aktualizuj statystyki miasta
    console.log('📊 Aktualizuję statystyki miasta...');
    suchyDwor.stats = {
      totalUlice: 0,
      totalUsers: createdUsers.length,
      totalShops: createdShops.length,
      totalProducts: createdProducts.length,
      totalPosts: createdPosts.length,
      totalCompanies: createdCompanies.length
    };
    
    await suchyDwor.save();
    console.log('✅ Zaktualizowano statystyki miasta');
    
    console.log('\n🎉 Pomyślnie dodano dane dla miasta Suchy Dwór!');
    console.log(`📊 Statystyki:
  - Użytkownicy: ${createdUsers.length}
  - Sklepy: ${createdShops.length}
  - Firmy: ${createdCompanies.length}
  - Produkty: ${createdProducts.length}
  - Posty: ${createdPosts.length}`);
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    mongoose.connection.close();
  }
}

addSuchyDworData(); 