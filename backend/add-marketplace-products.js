const mongoose = require('mongoose');
require('dotenv').config();

// Model użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String
});
const User = mongoose.model('User', userSchema);

// Model produktu giełdy
const marketplaceProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  condition: String,
  saleType: String,
  location: Object,
  images: [String],
  mainImage: String,
  tags: [String],
  seller: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  isAvailable: Boolean,
  isSold: Boolean,
  ratings: Object,
  stats: Object,
  auction: Object,
  negotiation: Object,
  createdAt: Date,
  updatedAt: Date
});
const MarketplaceProduct = mongoose.model('MarketplaceProduct', marketplaceProductSchema);

// Kategorie produktów
const categories = [
  'Motoryzacja',
  'Elektronika',
  'Moda',
  'Dom i Ogród',
  'Sport',
  'Książki',
  'Muzyka',
  'Zabawki',
  'Zdrowie',
  'Kolekcje'
];

// Marki produktów
const brands = [
  'Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'Philips', 'Bosch',
  'Toyota', 'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Ford', 'Opel',
  'Canon', 'Nikon', 'GoPro', 'DJI', 'Microsoft', 'Dell', 'HP', 'Lenovo'
];

// Typy sprzedaży
const saleTypes = [
  'fixed',      // Cena stała
  'auction',    // Licytacja
  'negotiation', // Negocjacja
  'free'        // Za darmo
];

// Stany produktów
const conditions = [
  'new',         // Nowy
  'like_new',    // Jak nowy
  'good',        // Dobry
  'acceptable',  // Akceptowalny
  'used'         // Używany
];

// Generowanie losowej ceny
function getRandomPrice(saleType) {
  switch (saleType) {
    case 'free':
      return 0;
    case 'fixed':
      return Math.floor(Math.random() * 5000) + 10; // 10-5000 zł
    case 'auction':
      return Math.floor(Math.random() * 2000) + 50; // 50-2000 zł
    case 'negotiation':
      return Math.floor(Math.random() * 3000) + 20; // 20-3000 zł
    default:
      return Math.floor(Math.random() * 1000) + 10;
  }
}

// Generowanie losowej lokalizacji
function getRandomLocation() {
  const cities = [
    'Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Łódź', 'Szczecin',
    'Bydgoszcz', 'Lublin', 'Katowice', 'Białystok', 'Gdynia', 'Częstochowa',
    'Radom', 'Sosnowiec', 'Toruń', 'Kielce', 'Gliwice', 'Zabrze', 'Bytom'
  ];
  
  return {
    voivodeship: '',
    county: '',
    municipality: '',
    city: cities[Math.floor(Math.random() * cities.length)],
    terytCode: ''
  };
}

// Generowanie nazwy produktu
function generateProductName(category, brand) {
  const categoryItems = {
    'Motoryzacja': ['Samochód', 'Motocykl', 'Części', 'Akcesoria', 'Opony', 'Olej'],
    'Elektronika': ['Smartfon', 'Laptop', 'Tablet', 'Słuchawki', 'Kamera', 'Konsola'],
    'Moda': ['Koszulka', 'Spodnie', 'Buty', 'Torebka', 'Płaszcz', 'Sukienka'],
    'Dom i Ogród': ['Mebel', 'Lampa', 'Roślina', 'Narzędzie', 'Dekoracja', 'Grill'],
    'Sport': ['Piłka', 'Rower', 'Hulajnoga', 'Sprzęt', 'Odzież', 'Buty'],
    'Książki': ['Książka', 'Podręcznik', 'Komiks', 'Album', 'Słownik', 'Encyklopedia'],
    'Muzyka': ['Płyta', 'Instrument', 'Słuchawki', 'Głośnik', 'Mikrofon', 'Kabel'],
    'Zabawki': ['Lalka', 'Samochodzik', 'Puzzle', 'Gra', 'Klocki', 'Miś'],
    'Zdrowie': ['Suplement', 'Kosmetyk', 'Sprzęt', 'Lek', 'Witamina', 'Olejek'],
    'Kolekcje': ['Moneta', 'Znaczek', 'Figurka', 'Karta', 'Model', 'Pamiątka']
  };
  
  const items = categoryItems[category] || ['Produkt'];
  const item = items[Math.floor(Math.random() * items.length)];
  return `${item} ${brand}`;
}

// Generowanie opisu produktu
function generateDescription(name, category, condition) {
  const descriptions = {
    'new': `Nowy produkt ${name} w kategorii ${category}. Idealny stan, oryginalne opakowanie.`,
    'like_new': `Produkt ${name} w stanie jak nowy. Minimalne ślady użytkowania, pełna funkcjonalność.`,
    'good': `Dobry produkt ${name} w kategorii ${category}. Sprawdzony, działa poprawnie.`,
    'acceptable': `Produkt ${name} w stanie akceptowalnym. Działa, ale ma ślady użytkowania.`,
    'used': `Używany produkt ${name} w kategorii ${category}. Sprawdzony, gotowy do użycia.`
  };
  
  return descriptions[condition] || `Produkt ${name} w kategorii ${category}.`;
}

// Tworzenie produktu giełdowego
function createMarketplaceProduct(user, saleType) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const name = generateProductName(category, brand);
  const price = getRandomPrice(saleType);
  
  const product = {
    name: name,
    description: generateDescription(name, category, condition),
    price: price,
    category: category,
    brand: brand,
    condition: condition,
    saleType: saleType,
    location: getRandomLocation(),
    images: [],
    mainImage: null,
    tags: [category.toLowerCase(), brand.toLowerCase(), condition],
    seller: user._id,
    isActive: true,
    isAvailable: true,
    isSold: false,
    ratings: {
      distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
      average: 0,
      count: 0
    },
    stats: {
      views: 0,
      favorites: 0,
      shares: 0
    },
    auction: {
      minIncrement: 1,
      isActive: saleType === 'auction',
      bids: []
    },
    negotiation: {
      offers: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return product;
}

async function addMarketplaceProducts() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');
    
    // Pobierz wszystkich użytkowników
    const users = await User.find({});
    console.log(`👥 Znaleziono ${users.length} użytkowników`);
    
    if (users.length === 0) {
      console.log('❌ Brak użytkowników w bazie. Najpierw dodaj użytkowników.');
      return;
    }
    
    let totalProducts = 0;
    
    // Dla każdego użytkownika dodaj produkty z każdym typem sprzedaży
    for (const user of users) {
      console.log(`\n📦 Dodawanie produktów dla użytkownika: ${user.username || user.email}`);
      
      for (const saleType of saleTypes) {
        const productData = createMarketplaceProduct(user, saleType);
        
        try {
          const product = new MarketplaceProduct(productData);
          await product.save();
          
          console.log(`  ✅ Dodano: ${productData.name} (${saleType}) - ${productData.price} zł`);
          totalProducts++;
        } catch (error) {
          console.error(`  ❌ Błąd podczas dodawania produktu: ${error.message}`);
        }
      }
    }
    
    console.log(`\n🎉 Pomyślnie dodano ${totalProducts} produktów giełdowych!`);
    console.log(`📊 Podsumowanie:`);
    console.log(`  - Użytkownicy: ${users.length}`);
    console.log(`  - Produkty na użytkownika: ${saleTypes.length}`);
    console.log(`  - Typy sprzedaży: ${saleTypes.join(', ')}`);
    
    // Sprawdź ile produktów jest teraz w bazie
    const totalInDb = await MarketplaceProduct.countDocuments();
    console.log(`  - Łącznie produktów w giełdzie: ${totalInDb}`);
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Połączenie z MongoDB zamknięte');
  }
}

// Uruchom skrypt
addMarketplaceProducts(); 