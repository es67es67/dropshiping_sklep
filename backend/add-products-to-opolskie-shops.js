const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model produktu
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  shop: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
});

const Product = mongoose.model('Product', productSchema);

// Model sklepu
const shopSchema = new mongoose.Schema({
  name: String,
  category: String,
  address: {
    city: String
  },
  teryt: {
    voivodeshipCode: String
  }
});

const Shop = mongoose.model('Shop', shopSchema);

// Produkty dla różnych kategorii sklepów
const productsByCategory = {
  'Elektronika': [
    { name: 'Smartfon Samsung Galaxy', description: 'Nowoczesny smartfon z doskonałym aparatem', price: 1299.99 },
    { name: 'Laptop Dell Inspiron', description: 'Wydajny laptop do pracy i rozrywki', price: 2499.99 },
    { name: 'Słuchawki Sony WH-1000XM4', description: 'Bezprzewodowe słuchawki z redukcją szumów', price: 899.99 },
    { name: 'Smartwatch Apple Watch', description: 'Inteligentny zegarek z wieloma funkcjami', price: 1599.99 },
    { name: 'Tablet iPad Air', description: 'Lekki i szybki tablet do pracy', price: 1899.99 }
  ],
  'Odzież': [
    { name: 'Kurtka zimowa Columbia', description: 'Ciepła kurtka na zimę', price: 599.99 },
    { name: 'Buty sportowe Nike Air Max', description: 'Wygodne buty do biegania', price: 449.99 },
    { name: 'Dżinsy Levi\'s 501', description: 'Klasyczne dżinsy w niebieskim kolorze', price: 299.99 },
    { name: 'Koszulka bawełniana', description: 'Miękka koszulka z naturalnej bawełny', price: 89.99 },
    { name: 'Sukienka wieczorowa', description: 'Elegancka sukienka na specjalne okazje', price: 399.99 }
  ],
  'Książki': [
    { name: 'Harry Potter i Kamień Filozoficzny', description: 'Pierwsza część serii o młodym czarodzieju', price: 39.99 },
    { name: 'Władca Pierścieni - Drużyna Pierścienia', description: 'Epicka powieść fantasy', price: 49.99 },
    { name: '1984 - George Orwell', description: 'Klasyczna powieść dystopijna', price: 29.99 },
    { name: 'Mały Książę', description: 'Piękna opowieść filozoficzna', price: 24.99 },
    { name: 'Atlas świata', description: 'Kompletny atlas z mapami wszystkich kontynentów', price: 89.99 }
  ],
  'Sport': [
    { name: 'Piłka nożna Adidas', description: 'Profesjonalna piłka do gry w piłkę nożną', price: 199.99 },
    { name: 'Rower górski Trek', description: 'Wydajny rower do jazdy terenowej', price: 2499.99 },
    { name: 'Hantle 10kg para', description: 'Hantle do treningu siłowego', price: 149.99 },
    { name: 'Mata do jogi', description: 'Antypoślizgowa mata do ćwiczeń', price: 79.99 },
    { name: 'Kijki do nordic walking', description: 'Lekkie kijki do marszu nordyckiego', price: 129.99 }
  ],
  'Dom i Ogród': [
    { name: 'Wiertarka Bosch', description: 'Profesjonalna wiertarka udarowa', price: 399.99 },
    { name: 'Kosiarka spalinowa Honda', description: 'Wydajna kosiarka do trawy', price: 899.99 },
    { name: 'Lampka nocna LED', description: 'Nowoczesna lampka z regulowanym światłem', price: 89.99 },
    { name: 'Zestaw doniczek ceramicznych', description: 'Eleganckie doniczki do roślin', price: 159.99 },
    { name: 'Grill ogrodowy Weber', description: 'Solidny grill do ogrodu', price: 699.99 }
  ],
  'Motoryzacja': [
    { name: 'Olej silnikowy Mobil 1', description: 'Syntetyczny olej silnikowy 5W-30', price: 89.99 },
    { name: 'Filtr powietrza Mann', description: 'Wysokiej jakości filtr powietrza', price: 49.99 },
    { name: 'Klocki hamulcowe Brembo', description: 'Profesjonalne klocki hamulcowe', price: 199.99 },
    { name: 'Akumulator samochodowy', description: 'Akumulator 60Ah do samochodu', price: 299.99 },
    { name: 'Zestaw narzędzi samochodowych', description: 'Komplet narzędzi do napraw', price: 399.99 }
  ],
  'Zdrowie i Uroda': [
    { name: 'Krem nawilżający CeraVe', description: 'Intensywnie nawilżający krem do twarzy', price: 79.99 },
    { name: 'Szampon przeciwłupieżowy Head&Shoulders', description: 'Skuteczny szampon przeciwłupieżowy', price: 34.99 },
    { name: 'Pasta do zębów Colgate', description: 'Pasta do zębów z fluorem', price: 19.99 },
    { name: 'Dezodorant Rexona', description: 'Długotrwała ochrona przed potem', price: 24.99 },
    { name: 'Suplement witaminowy', description: 'Kompleks witamin i minerałów', price: 59.99 }
  ],
  'Zabawki': [
    { name: 'Lego Star Wars', description: 'Zestaw klocków Lego z motywem Star Wars', price: 299.99 },
    { name: 'Lalka Barbie', description: 'Klasyczna lalka Barbie z akcesoriami', price: 89.99 },
    { name: 'Samochód zdalnie sterowany', description: 'Szybki samochód RC z pilotem', price: 199.99 },
    { name: 'Gra planszowa Monopoly', description: 'Klasyczna gra planszowa', price: 79.99 },
    { name: 'Puzzle 1000 elementów', description: 'Puzzle z pięknym krajobrazem', price: 49.99 }
  ],
  'Muzyka': [
    { name: 'Gitara akustyczna Yamaha', description: 'Profesjonalna gitara akustyczna', price: 899.99 },
    { name: 'Keyboard Casio', description: 'Elektroniczne pianino z 61 klawiszami', price: 599.99 },
    { name: 'Mikrofon Shure SM58', description: 'Profesjonalny mikrofon dynamiczny', price: 399.99 },
    { name: 'Głośnik Bluetooth JBL', description: 'Przenośny głośnik z doskonałym dźwiękiem', price: 299.99 },
    { name: 'Płyta CD - ulubiony artysta', description: 'Najnowszy album popularnego artysty', price: 39.99 }
  ],
  'Komputery': [
    { name: 'Klawiatura mechaniczna Logitech', description: 'Klawiatura z przełącznikami Cherry MX', price: 449.99 },
    { name: 'Myszka gamingowa Razer', description: 'Precyzyjna myszka do gier', price: 299.99 },
    { name: 'Monitor LG 27"', description: 'Monitor Full HD z doskonałym obrazem', price: 799.99 },
    { name: 'Dysk SSD Samsung 1TB', description: 'Szybki dysk SSD do komputera', price: 399.99 },
    { name: 'Karta graficzna NVIDIA RTX', description: 'Wydajna karta graficzna do gier', price: 2499.99 }
  ]
};

async function addProductsToOpolskieShops() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Pobierz wszystkie sklepy z województwa opolskiego
    const shops = await Shop.find({
      'teryt.voivodeshipCode': '16'
    }).select('name category address.city');

    console.log(`\n🏪 Znaleziono ${shops.length} sklepów w województwie opolskim`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const shop of shops) {
      // Sprawdź czy sklep ma już produkty
      const existingProducts = await Product.find({ shop: shop._id });
      
      if (existingProducts.length > 0) {
        console.log(`⏭️ Sklep ${shop.name} już ma ${existingProducts.length} produktów`);
        skippedCount++;
        continue;
      }

      // Wybierz produkt odpowiedni dla kategorii sklepu
      const categoryProducts = productsByCategory[shop.category] || productsByCategory['Elektronika'];
      const product = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];

      // Stwórz nowy produkt
      const newProduct = new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        category: shop.category,
        shop: shop._id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await newProduct.save();
      console.log(`✅ Dodano produkt: ${newProduct.name} (${newProduct.price} zł) do sklepu ${shop.name} w ${shop.address.city}`);
      addedCount++;
    }

    console.log(`\n📊 Podsumowanie:`);
    console.log(`- Dodano: ${addedCount} produktów`);
    console.log(`- Pominięto: ${skippedCount} sklepów (już mają produkty)`);

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

addProductsToOpolskieShops(); 