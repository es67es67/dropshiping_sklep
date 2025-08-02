const mongoose = require('mongoose');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const Shop = require('./models/shopModel');
require('dotenv').config();

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const sampleAuctions = [
  {
    name: 'iPhone 14 Pro - Aukcja',
    description: 'Nowy iPhone 14 Pro w kolorze Space Black, 256GB. Idealny stan, oryginalne opakowanie.',
    price: 3500,
    saleType: 'auction',
    auction: {
      startPrice: 3500,
      currentPrice: 3500,
      minIncrement: 50,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dni
      bids: [],
      isActive: true
    },
    category: 'Elektronika',
    brand: 'Apple',
    stock: 1,
    location: {
      country: 'Polska',
      voivodeship: 'Dolnośląskie',
      county: 'Wrocławski',
      municipality: 'Czernica',
      city: 'Suchy Dwór',
      voivodeshipCode: '02',
      countyCode: '0223',
      municipalityCode: '022301',
      cityCode: '0884766'
    },
    images: ['https://via.placeholder.com/400x300?text=iPhone+14+Pro'],
    mainImage: 'https://via.placeholder.com/400x300?text=iPhone+14+Pro',
    ratings: {
      average: 4.8,
      count: 12,
      distribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 9 }
    }
  },
  {
    name: 'Rower MTB Trek - Licytacja',
    description: 'Profesjonalny rower górski Trek Marlin 7, rozmiar L. Idealny do jazdy terenowej.',
    price: 1200,
    saleType: 'auction',
    auction: {
      startPrice: 1200,
      currentPrice: 1200,
      minIncrement: 25,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dni
      bids: [],
      isActive: true
    },
    category: 'Sport',
    brand: 'Trek',
    stock: 1,
    location: {
      country: 'Polska',
      voivodeship: 'Dolnośląskie',
      county: 'Wrocławski',
      municipality: 'Długołęka',
      city: 'Kunów',
      voivodeshipCode: '02',
      countyCode: '0223',
      municipalityCode: '022302',
      cityCode: '0880082'
    },
    images: ['https://via.placeholder.com/400x300?text=Rower+MTB+Trek'],
    mainImage: 'https://via.placeholder.com/400x300?text=Rower+MTB+Trek',
    ratings: {
      average: 4.6,
      count: 8,
      distribution: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 5 }
    }
  },
  {
    name: 'Laptop Dell XPS 13 - Aukcja',
    description: 'Ultrabook Dell XPS 13, Intel i7, 16GB RAM, 512GB SSD. Doskonały stan.',
    price: 2800,
    saleType: 'auction',
    auction: {
      startPrice: 2800,
      currentPrice: 2800,
      minIncrement: 100,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dni
      bids: [],
      isActive: true
    },
    category: 'Elektronika',
    brand: 'Dell',
    stock: 1,
    location: {
      country: 'Polska',
      voivodeship: 'Dolnośląskie',
      county: 'Wrocławski',
      municipality: 'Kobierzyce',
      city: 'Budziszów',
      voivodeshipCode: '02',
      countyCode: '0223',
      municipalityCode: '022305',
      cityCode: '0875342'
    },
    images: ['https://via.placeholder.com/400x300?text=Laptop+Dell+XPS'],
    mainImage: 'https://via.placeholder.com/400x300?text=Laptop+Dell+XPS',
    ratings: {
      average: 4.9,
      count: 15,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 14 }
    }
  },
  {
    name: 'Kamera Canon EOS R6 - Licytacja',
    description: 'Profesjonalna lustrzanka bezlusterkowa Canon EOS R6 z obiektywem 24-105mm f/4L.',
    price: 4500,
    saleType: 'auction',
    auction: {
      startPrice: 4500,
      currentPrice: 4500,
      minIncrement: 200,
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 dni
      bids: [],
      isActive: true
    },
    category: 'Fotografia',
    brand: 'Canon',
    stock: 1,
    location: {
      country: 'Polska',
      voivodeship: 'Dolnośląskie',
      county: 'Wrocławski',
      municipality: 'Sobótka',
      city: 'Dobkowice',
      voivodeshipCode: '02',
      countyCode: '0223',
      municipalityCode: '022307',
      cityCode: '0875394'
    },
    images: ['https://via.placeholder.com/400x300?text=Canon+EOS+R6'],
    mainImage: 'https://via.placeholder.com/400x300?text=Canon+EOS+R6',
    ratings: {
      average: 4.7,
      count: 6,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 5 }
    }
  },
  {
    name: 'Gitarra akustyczna Yamaha - Aukcja',
    description: 'Gitarra akustyczna Yamaha FG800, natural. Doskonały dźwięk, idealny stan.',
    price: 800,
    saleType: 'auction',
    auction: {
      startPrice: 800,
      currentPrice: 800,
      minIncrement: 20,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 dni
      bids: [],
      isActive: true
    },
    category: 'Muzyka',
    brand: 'Yamaha',
    stock: 1,
    location: {
      country: 'Polska',
      voivodeship: 'Dolnośląskie',
      county: 'Wrocławski',
      municipality: 'Siechnice',
      city: 'Godzieszowa',
      voivodeshipCode: '02',
      countyCode: '0223',
      municipalityCode: '022308',
      cityCode: '0873780'
    },
    images: ['https://via.placeholder.com/400x300?text=Gitarra+Yamaha'],
    mainImage: 'https://via.placeholder.com/400x300?text=Gitarra+Yamaha',
    ratings: {
      average: 4.5,
      count: 4,
      distribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2 }
    }
  }
];

const addSampleAuctions = async () => {
  try {
    console.log('🔄 Dodawanie przykładowych aukcji...');

    // Znajdź użytkownika i sklep do przypisania
    const user = await User.findOne();
    const shop = await Shop.findOne();

    if (!user) {
      console.error('❌ Nie znaleziono użytkownika');
      return;
    }

    if (!shop) {
      console.error('❌ Nie znaleziono sklepu');
      return;
    }

    console.log(`✅ Używam użytkownika: ${user.username}`);
    console.log(`✅ Używam sklepu: ${shop.name}`);

    // Usuń istniejące aukcje (opcjonalnie)
    await Product.deleteMany({ saleType: 'auction' });
    console.log('🗑️ Usunięto istniejące aukcje');

    // Dodaj nowe aukcje
    for (const auctionData of sampleAuctions) {
      const auction = new Product({
        ...auctionData,
        seller: user._id,
        shop: shop._id,
        isActive: true,
        isAvailable: true
      });

      await auction.save();
      console.log(`✅ Dodano aukcję: ${auction.name}`);
    }

    console.log('🎉 Pomyślnie dodano wszystkie przykładowe aukcje!');
    console.log(`📊 Łącznie dodano: ${sampleAuctions.length} aukcji`);

    // Pokaż statystyki
    const totalAuctions = await Product.countDocuments({ saleType: 'auction' });
    const activeAuctions = await Product.countDocuments({ 
      saleType: 'auction', 
      'auction.isActive': true 
    });

    console.log(`📈 Statystyki aukcji:`);
    console.log(`   - Wszystkie aukcje: ${totalAuctions}`);
    console.log(`   - Aktywne aukcje: ${activeAuctions}`);

  } catch (error) {
    console.error('❌ Błąd podczas dodawania aukcji:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Połączenie z MongoDB zamknięte');
  }
};

// Uruchom skrypt
addSampleAuctions(); 