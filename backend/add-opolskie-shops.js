const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model sklepu
const shopSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  owner: mongoose.Schema.Types.ObjectId,
  email: String,
  phone: String,
  address: {
    street: String,
    houseNumber: String,
    postalCode: String,
    city: String,
    voivodeship: String,
    county: String,
    municipality: String
  },
  teryt: {
    voivodeshipCode: String,
    countyCode: String,
    municipalityCode: String,
    tercCode: String,
    simcCode: String,
    ulicCode: String,
    fullCode: String
  },
  isActive: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Shop = mongoose.model('Shop', shopSchema);

// Model użytkownika (do przypisania właściciela)
const userSchema = new mongoose.Schema({
  username: String,
  email: String
});

const User = mongoose.model('User', userSchema);

// Miasta województwa opolskiego z kodami SIMC
const opolskieCities = [
  { name: 'Opole', simcCode: '1662011', countyCode: '1661' },
  { name: 'Brzeg', simcCode: '1602011', countyCode: '1601' },
  { name: 'Głubczyce', simcCode: '1603011', countyCode: '1602' },
  { name: 'Kluczbork', simcCode: '1604011', countyCode: '1604' },
  { name: 'Krapkowice', simcCode: '1605011', countyCode: '1605' },
  { name: 'Kędzierzyn-Koźle', simcCode: '1606011', countyCode: '1603' },
  { name: 'Namysłów', simcCode: '1607011', countyCode: '1606' },
  { name: 'Nysa', simcCode: '1608011', countyCode: '1607' },
  { name: 'Olesno', simcCode: '1609011', countyCode: '1608' },
  { name: 'Prudnik', simcCode: '1610011', countyCode: '1610' },
  { name: 'Strzelce Opolskie', simcCode: '1611011', countyCode: '1611' }
];

// Kategorie sklepów
const shopCategories = [
  'Elektronika',
  'Odzież',
  'Książki',
  'Sport',
  'Dom i Ogród',
  'Motoryzacja',
  'Zdrowie i Uroda',
  'Zabawki',
  'Muzyka',
  'Komputery'
];

// Nazwy sklepów
const shopNames = [
  'TechStore',
  'FashionHouse',
  'BookWorld',
  'SportCenter',
  'HomeGarden',
  'AutoParts',
  'BeautyShop',
  'ToyLand',
  'MusicStore',
  'ComputerWorld'
];

async function addOpolskieShops() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Znajdź użytkownika do przypisania jako właściciela
    const user = await User.findOne({});
    if (!user) {
      console.log('❌ Nie znaleziono użytkownika do przypisania jako właściciela');
      return;
    }

    console.log(`👤 Używam użytkownika: ${user.username} (ID: ${user._id})`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const city of opolskieCities) {
      // Sprawdź czy sklep w tym mieście już istnieje
      const existingShop = await Shop.findOne({
        'address.city': city.name,
        'teryt.voivodeshipCode': '16'
      });

      if (existingShop) {
        console.log(`⏭️ Sklep w mieście ${city.name} już istnieje: ${existingShop.name}`);
        skippedCount++;
        continue;
      }

      // Wybierz losową kategorię i nazwę sklepu
      const category = shopCategories[Math.floor(Math.random() * shopCategories.length)];
      const shopName = shopNames[Math.floor(Math.random() * shopNames.length)];

      // Stwórz nowy sklep
      const newShop = new Shop({
        name: `${shopName} ${city.name}`,
        description: `Sklep ${category.toLowerCase()} w mieście ${city.name}. Oferujemy szeroki wybór produktów w atrakcyjnych cenach.`,
        category: category,
        owner: user._id,
        email: `kontakt@${shopName.toLowerCase()}${city.name.toLowerCase()}.pl`,
        phone: `+48 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        address: {
          street: `ul. Główna ${Math.floor(Math.random() * 100) + 1}`,
          houseNumber: `${Math.floor(Math.random() * 50) + 1}`,
          postalCode: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`,
          city: city.name,
          voivodeship: 'Opolskie',
          county: city.name,
          municipality: city.name
        },
        teryt: {
          voivodeshipCode: '16',
          countyCode: city.countyCode,
          municipalityCode: city.countyCode,
          tercCode: city.countyCode,
          simcCode: city.simcCode,
          ulicCode: `${Math.floor(Math.random() * 90000) + 10000}`,
          fullCode: `${city.countyCode}${city.simcCode}${Math.floor(Math.random() * 90000) + 10000}`
        },
        isActive: true,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await newShop.save();
      console.log(`✅ Dodano sklep: ${newShop.name} w mieście ${city.name}`);
      addedCount++;
    }

    console.log(`\n📊 Podsumowanie:`);
    console.log(`- Dodano: ${addedCount} sklepów`);
    console.log(`- Pominięto: ${skippedCount} sklepów (już istnieją)`);

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

addOpolskieShops(); 