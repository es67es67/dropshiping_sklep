const mongoose = require('mongoose');
const Product = require('./models/productModel');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
require('dotenv').config();

// Przykładowe dane do losowania
const productNames = [
  'Smartfon', 'Laptop', 'Słuchawki', 'Kamera', 'Tablet', 'Koszulka', 'Buty', 'Książka', 'Zegarek', 'Plecak',
  'Myszka', 'Klawiatura', 'Monitor', 'Powerbank', 'Głośnik', 'Torba', 'Bluza', 'Spodnie', 'Czapka', 'Piłka'
];
const brands = ['Samsung', 'Apple', 'Sony', 'Dell', 'GoPro', 'Nike', 'Adidas', 'Toshiba', 'JBL', 'Puma'];
const categories = ['Elektronika', 'Odzież', 'Książki', 'Sport', 'Akcesoria'];
const descriptions = [
  'Świetny produkt w super cenie!',
  'Nowość w naszej ofercie!',
  'Bestseller w swojej kategorii.',
  'Idealny na prezent.',
  'Wysoka jakość wykonania.'
];

// Przykładowe długie opisy
const longDescriptions = [
  'Ten produkt to prawdziwy hit w swojej kategorii. Oferuje najwyższą jakość wykonania i innowacyjne rozwiązania techniczne. Idealny dla wymagających użytkowników, którzy cenią sobie niezawodność i funkcjonalność. Produkt został przetestowany w różnych warunkach i sprawdził się w każdym z nich.',
  'Nasz flagowy produkt to wynik wieloletnich badań i rozwoju. Wykorzystuje najnowsze technologie i materiały premium, zapewniając użytkownikom niezapomniane doświadczenia. Każdy element został starannie przemyślany i dopracowany do perfekcji.',
  'Innowacyjny design połączony z najwyższą jakością wykonania. Ten produkt wyróżnia się na tle konkurencji swoją funkcjonalnością i estetyką. Idealny dla osób, które cenią sobie zarówno praktyczność, jak i elegancję.',
  'Produkt stworzony z myślą o komforcie i wygodzie użytkownika. Wykorzystuje ergonomiczne rozwiązania i najnowsze technologie, zapewniając maksymalną satysfakcję z użytkowania. Gwarantujemy długą żywotność i niezawodność.',
  'Unikalny produkt, który łączy w sobie tradycję z nowoczesnością. Każdy egzemplarz jest ręcznie sprawdzany przed wysyłką, co gwarantuje najwyższą jakość. Idealny dla koneserów i miłośników rzemiosła.'
];

// Przykładowe specyfikacje dla różnych kategorii
const specifications = {
  'Elektronika': {
    'Procesor': 'Intel Core i7-10700K',
    'Pamięć RAM': '16 GB DDR4',
    'Dysk twardy': '512 GB SSD',
    'Ekran': '15.6" Full HD',
    'System operacyjny': 'Windows 11',
    'Gwarancja': '24 miesiące',
    'Waga': '2.1 kg',
    'Wymiary': '360 x 240 x 20 mm'
  },
  'Odzież': {
    'Materiał': '100% bawełna',
    'Rozmiar': 'M (170-180 cm)',
    'Kolor': 'Granatowy',
    'Pielęgnacja': 'Pranie w 30°C',
    'Kraj produkcji': 'Polska',
    'Certyfikat': 'OEKO-TEX Standard 100',
    'Waga': '250 g',
    'Rodzaj': 'Casual'
  },
  'Książki': {
    'Autor': 'Jan Kowalski',
    'Wydawnictwo': 'Wydawnictwo ABC',
    'Rok wydania': '2023',
    'Liczba stron': '320',
    'Oprawa': 'Miękka',
    'Format': 'A5',
    'ISBN': '978-83-123456-7-8',
    'Język': 'Polski'
  },
  'Sport': {
    'Materiał': 'Guma + tkanina',
    'Rozmiar': '42 EU',
    'Typ': 'Tenisówki',
    'Podeszwa': 'Gumowa',
    'Wentylacja': 'Tak',
    'Waga': '280 g',
    'Przeznaczenie': 'Bieganie',
    'Kolor': 'Biały/Czarny'
  },
  'Akcesoria': {
    'Materiał': 'Skóra naturalna',
    'Pojemność': '25 L',
    'Wymiary': '45 x 30 x 15 cm',
    'Waga': '0.8 kg',
    'Kolor': 'Brązowy',
    'Rodzaj': 'Plecak',
    'Wodoodporność': 'Tak',
    'Gwarancja': '12 miesięcy'
  }
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice() {
  return (Math.random() * 1000 + 50).toFixed(2);
}

function getRandomStock() {
  return Math.floor(Math.random() * 50) + 1;
}

function getRandomImage(name) {
  return `https://via.placeholder.com/400x300/2196F3/FFFFFF?text=${encodeURIComponent(name)}`;
}

function getRandomSpecifications(category) {
  const specs = specifications[category] || specifications['Akcesoria'];
  const result = {};
  const keys = Object.keys(specs);
  const numSpecs = Math.floor(Math.random() * 4) + 4; // 4-7 specyfikacji
  
  for (let i = 0; i < numSpecs; i++) {
    const key = keys[i % keys.length];
    result[key] = specs[key];
  }
  
  return result;
}

async function seedProducts() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    const shops = await Shop.find({}).populate('owner');
    if (shops.length === 0) {
      console.log('❌ Brak sklepów w bazie. Najpierw uruchom seed-shops.js');
      return;
    }

    let totalProducts = 0;
    for (const shop of shops) {
      if (!shop.owner) {
        console.log(`⚠️  Sklep ${shop.name} nie ma właściciela, pomijam.`);
        continue;
      }
      console.log(`🏪 Dodaję produkty do sklepu: ${shop.name} (ID: ${shop._id})`);
      const products = [];
      for (let i = 0; i < 10; i++) {
        const name = `${getRandom(productNames)} ${brands[i % brands.length]} #${i+1}`;
        const category = getRandom(categories);
        const price = getRandomPrice();
        const stock = getRandomStock();
        const brand = getRandom(brands);
        const description = getRandom(descriptions);
        const longDescription = getRandom(longDescriptions);
        const specs = getRandomSpecifications(category);
        
        products.push({
          name,
          description,
          longDescription,
          price: parseFloat(price),
          originalPrice: parseFloat(price) + Math.floor(Math.random() * 200),
          category,
          brand,
          stock,
          specifications: specs,
          images: [getRandomImage(name)],
          mainImage: getRandomImage(name),
          shop: shop._id,
          seller: shop.owner._id,
          isActive: true,
          tags: [category, brand],
          ratings: {
            average: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
            count: Math.floor(Math.random() * 50) + 5,
            distribution: {
              1: Math.floor(Math.random() * 3),
              2: Math.floor(Math.random() * 5),
              3: Math.floor(Math.random() * 10),
              4: Math.floor(Math.random() * 20),
              5: Math.floor(Math.random() * 25)
            }
          }
        });
      }
      const created = await Product.insertMany(products);
      totalProducts += created.length;
      // Aktualizuj statystyki sklepu
      shop.stats.totalProducts = await Product.countDocuments({ shop: shop._id });
      await shop.save();
      console.log(`✅ Dodano ${created.length} produktów do sklepu ${shop.name}`);
    }
    console.log(`🎉 Seedowanie zakończone! Dodano łącznie ${totalProducts} produktów do wszystkich sklepów.`);
  } catch (error) {
    console.error('❌ Błąd podczas seedowania produktów:', error);
    console.error('Szczegóły błędu:', error.message);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

seedProducts(); 