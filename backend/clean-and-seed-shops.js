const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
require('dotenv').config();

// Lista miejscowości w Polsce z koordynatami
const polishCities = [
  { name: 'Warszawa', lat: 52.2297, lng: 21.0122, voivodeship: 'Mazowieckie' },
  { name: 'Kraków', lat: 50.0647, lng: 19.9450, voivodeship: 'Małopolskie' },
  { name: 'Wrocław', lat: 51.1079, lng: 17.0385, voivodeship: 'Dolnośląskie' },
  { name: 'Poznań', lat: 52.4064, lng: 16.9252, voivodeship: 'Wielkopolskie' },
  { name: 'Gdańsk', lat: 54.3521, lng: 18.6466, voivodeship: 'Pomorskie' },
  { name: 'Szczecin', lat: 53.4285, lng: 14.5528, voivodeship: 'Zachodniopomorskie' },
  { name: 'Bydgoszcz', lat: 53.1235, lng: 18.0084, voivodeship: 'Kujawsko-Pomorskie' },
  { name: 'Lublin', lat: 51.2465, lng: 22.5684, voivodeship: 'Lubelskie' },
  { name: 'Katowice', lat: 50.2613, lng: 19.0239, voivodeship: 'Śląskie' },
  { name: 'Białystok', lat: 53.1325, lng: 23.1688, voivodeship: 'Podlaskie' },
  { name: 'Gdynia', lat: 54.5189, lng: 18.5305, voivodeship: 'Pomorskie' },
  { name: 'Częstochowa', lat: 50.8118, lng: 19.1203, voivodeship: 'Śląskie' },
  { name: 'Radom', lat: 51.4025, lng: 21.1471, voivodeship: 'Mazowieckie' },
  { name: 'Sosnowiec', lat: 50.2863, lng: 19.1040, voivodeship: 'Śląskie' },
  { name: 'Toruń', lat: 53.0138, lng: 18.5984, voivodeship: 'Kujawsko-Pomorskie' },
  { name: 'Kielce', lat: 50.8661, lng: 20.6286, voivodeship: 'Świętokrzyskie' },
  { name: 'Gliwice', lat: 50.2941, lng: 18.6714, voivodeship: 'Śląskie' },
  { name: 'Zabrze', lat: 50.3249, lng: 18.7857, voivodeship: 'Śląskie' },
  { name: 'Bytom', lat: 50.3480, lng: 18.9328, voivodeship: 'Śląskie' },
  { name: 'Bielsko-Biała', lat: 49.8224, lng: 19.0469, voivodeship: 'Śląskie' },
  { name: 'Olsztyn', lat: 53.7769, lng: 20.4867, voivodeship: 'Warmińsko-Mazurskie' },
  { name: 'Rzeszów', lat: 50.0412, lng: 21.9991, voivodeship: 'Podkarpackie' },
  { name: 'Ruda Śląska', lat: 50.2584, lng: 18.8563, voivodeship: 'Śląskie' },
  { name: 'Rybnik', lat: 50.1022, lng: 18.5464, voivodeship: 'Śląskie' },
  { name: 'Tychy', lat: 50.1233, lng: 18.9864, voivodeship: 'Śląskie' },
  { name: 'Dąbrowa Górnicza', lat: 50.3219, lng: 19.1874, voivodeship: 'Śląskie' },
  { name: 'Płock', lat: 52.5467, lng: 19.7064, voivodeship: 'Mazowieckie' },
  { name: 'Elbląg', lat: 54.1561, lng: 19.4045, voivodeship: 'Warmińsko-Mazurskie' },
  { name: 'Opole', lat: 50.6751, lng: 17.9213, voivodeship: 'Opolskie' },
  { name: 'Gorzów Wielkopolski', lat: 52.7368, lng: 15.2288, voivodeship: 'Lubuskie' },
  { name: 'Wałbrzych', lat: 50.7847, lng: 16.2844, voivodeship: 'Dolnośląskie' },
  { name: 'Włocławek', lat: 52.6482, lng: 19.0678, voivodeship: 'Kujawsko-Pomorskie' },
  { name: 'Tarnów', lat: 50.0121, lng: 20.9858, voivodeship: 'Małopolskie' },
  { name: 'Chorzów', lat: 50.3058, lng: 18.9742, voivodeship: 'Śląskie' },
  { name: 'Kalisz', lat: 51.7611, lng: 18.0910, voivodeship: 'Wielkopolskie' },
  { name: 'Koszalin', lat: 54.1943, lng: 16.1722, voivodeship: 'Zachodniopomorskie' },
  { name: 'Legnica', lat: 51.2076, lng: 16.1589, voivodeship: 'Dolnośląskie' },
  { name: 'Grudziądz', lat: 53.4831, lng: 18.7536, voivodeship: 'Kujawsko-Pomorskie' },
  { name: 'Słupsk', lat: 54.4641, lng: 17.0287, voivodeship: 'Pomorskie' },
  { name: 'Jaworzno', lat: 50.2043, lng: 19.2739, voivodeship: 'Śląskie' },
  { name: 'Jastrzębie-Zdrój', lat: 49.9496, lng: 18.5745, voivodeship: 'Śląskie' },
  { name: 'Nowy Sącz', lat: 49.6175, lng: 20.7155, voivodeship: 'Małopolskie' },
  { name: 'Jelenia Góra', lat: 50.9030, lng: 15.7344, voivodeship: 'Dolnośląskie' },
  { name: 'Siedlce', lat: 52.1677, lng: 22.2901, voivodeship: 'Mazowieckie' },
  { name: 'Mysłowice', lat: 50.2073, lng: 19.1379, voivodeship: 'Śląskie' },
  { name: 'Konin', lat: 52.2233, lng: 18.2512, voivodeship: 'Wielkopolskie' },
  { name: 'Piotrków Trybunalski', lat: 51.4054, lng: 19.7032, voivodeship: 'Łódzkie' },
  { name: 'Lubin', lat: 51.3977, lng: 16.2106, voivodeship: 'Dolnośląskie' },
  { name: 'Inowrocław', lat: 52.7879, lng: 18.2638, voivodeship: 'Kujawsko-Pomorskie' },
  { name: 'Ostrowiec Świętokrzyski', lat: 50.9294, lng: 21.3853, voivodeship: 'Świętokrzyskie' },
  { name: 'Suwałki', lat: 54.1112, lng: 22.9309, voivodeship: 'Podlaskie' },
  { name: 'Stargard', lat: 53.3367, lng: 15.0499, voivodeship: 'Zachodniopomorskie' },
  { name: 'Gniezno', lat: 52.5348, lng: 17.5826, voivodeship: 'Wielkopolskie' },
  { name: 'Słupsk', lat: 54.4641, lng: 17.0287, voivodeship: 'Pomorskie' },
  { name: 'Ostrowiec Świętokrzyski', lat: 50.9294, lng: 21.3853, voivodeship: 'Świętokrzyskie' },
  { name: 'Zamość', lat: 50.7231, lng: 23.2519, voivodeship: 'Lubelskie' },
  { name: 'Leszno', lat: 51.8416, lng: 16.5760, voivodeship: 'Wielkopolskie' },
  { name: 'Zielona Góra', lat: 51.9356, lng: 15.5064, voivodeship: 'Lubuskie' },
  { name: 'Przemyśl', lat: 49.7826, lng: 22.7673, voivodeship: 'Podkarpackie' },
  { name: 'Tarnobrzeg', lat: 50.5730, lng: 21.6794, voivodeship: 'Podkarpackie' },
  { name: 'Chełm', lat: 51.1331, lng: 23.4716, voivodeship: 'Lubelskie' },
  { name: 'Ełk', lat: 53.8276, lng: 22.3549, voivodeship: 'Warmińsko-Mazurskie' },
  { name: 'Pruszków', lat: 52.1704, lng: 20.8124, voivodeship: 'Mazowieckie' },
  { name: 'Legionowo', lat: 52.4064, lng: 20.9264, voivodeship: 'Mazowieckie' },
  { name: 'Ostrołęka', lat: 53.0721, lng: 21.5757, voivodeship: 'Mazowieckie' },
  { name: 'Starachowice', lat: 51.0534, lng: 21.0713, voivodeship: 'Świętokrzyskie' },
  { name: 'Zawiercie', lat: 50.4877, lng: 19.4167, voivodeship: 'Śląskie' },
  { name: 'Mielec', lat: 50.2871, lng: 21.4239, voivodeship: 'Podkarpackie' },
  { name: 'Krosno', lat: 49.6884, lng: 21.7645, voivodeship: 'Podkarpackie' },
  { name: 'Dębica', lat: 49.9999, lng: 21.4167, voivodeship: 'Podkarpackie' },
  { name: 'Sanok', lat: 49.5557, lng: 22.2056, voivodeship: 'Podkarpackie' },
  { name: 'Jarosław', lat: 50.0169, lng: 22.6778, voivodeship: 'Podkarpackie' },
  { name: 'Łańcut', lat: 50.0687, lng: 22.2291, voivodeship: 'Podkarpackie' },
  { name: 'Przeworsk', lat: 50.0591, lng: 22.4941, voivodeship: 'Podkarpackie' },
  { name: 'Nisko', lat: 50.5206, lng: 22.1397, voivodeship: 'Podkarpackie' },
  { name: 'Kraśnik', lat: 50.9236, lng: 22.2271, voivodeship: 'Lubelskie' },
  { name: 'Puławy', lat: 51.4164, lng: 21.9694, voivodeship: 'Lubelskie' },
  { name: 'Świdnik', lat: 51.2194, lng: 22.6962, voivodeship: 'Lubelskie' },
  { name: 'Zamość', lat: 50.7231, lng: 23.2519, voivodeship: 'Lubelskie' },
  { name: 'Biała Podlaska', lat: 52.0324, lng: 23.1165, voivodeship: 'Lubelskie' },
  { name: 'Łuków', lat: 51.9297, lng: 22.3794, voivodeship: 'Lubelskie' },
  { name: 'Radzyń Podlaski', lat: 51.7833, lng: 22.6167, voivodeship: 'Lubelskie' },
  { name: 'Międzyrzec Podlaski', lat: 51.9833, lng: 22.7833, voivodeship: 'Lubelskie' },
  { name: 'Parczew', lat: 51.6333, lng: 22.9000, voivodeship: 'Lubelskie' },
  { name: 'Włodawa', lat: 51.5500, lng: 23.5500, voivodeship: 'Lubelskie' },
  { name: 'Biłgoraj', lat: 50.5411, lng: 22.7220, voivodeship: 'Lubelskie' },
  { name: 'Tomaszów Lubelski', lat: 50.4475, lng: 23.4169, voivodeship: 'Lubelskie' },
  { name: 'Hrubieszów', lat: 50.8089, lng: 23.8925, voivodeship: 'Lubelskie' },
  { name: 'Janów Lubelski', lat: 50.7069, lng: 22.4069, voivodeship: 'Lubelskie' },
  { name: 'Krasnystaw', lat: 50.9833, lng: 23.1667, voivodeship: 'Lubelskie' },
  { name: 'Lubartów', lat: 51.4600, lng: 22.6100, voivodeship: 'Lubelskie' }
];

// Kategorie sklepów
const shopCategories = [
  'Elektronika', 'Odzież', 'Książki', 'Sport', 'Zdrowie i Uroda', 
  'Dom i Ogród', 'Motoryzacja', 'Żywność', 'Rozrywka', 'Edukacja',
  'Usługi', 'Rzemiosło', 'Sztuka', 'Muzyka', 'Fotografia'
];

// Przykładowe nazwy sklepów
const shopNames = [
  'TechStore', 'FashionHub', 'BookWorld', 'SportCenter', 'BeautyShop',
  'HomeGarden', 'AutoParts', 'FreshFood', 'Entertainment', 'EduCenter',
  'ServicePro', 'CraftWorks', 'ArtGallery', 'MusicStore', 'PhotoStudio',
  'DigitalHub', 'StyleBoutique', 'ReadMore', 'FitLife', 'GlowBeauty',
  'GreenThumb', 'CarCare', 'OrganicMarket', 'FunZone', 'LearnHub',
  'ExpertService', 'Handmade', 'CreativeSpace', 'SoundLab', 'CaptureMoments'
];

// Przykładowe opisy
const shopDescriptions = [
  'Najlepsze produkty w swojej kategorii',
  'Profesjonalna obsługa i wysokiej jakości towary',
  'Szeroki wybór produktów w atrakcyjnych cenach',
  'Sprawdzone marki i gwarancja jakości',
  'Innowacyjne rozwiązania dla wymagających klientów',
  'Tradycyjne rzemiosło w nowoczesnym wydaniu',
  'Eksperci w swojej dziedzinie',
  'Kompleksowa oferta dla każdego',
  'Najwyższa jakość w przystępnej cenie',
  'Spersonalizowane rozwiązania'
];

async function cleanAndSeedShops() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Usuń wszystkie wadliwe sklepy
    console.log('🗑️ Usuwanie wadliwych sklepów...');
    const deleteResult = await Shop.deleteMany({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' },
        { email: { $exists: false } },
        { email: null },
        { email: '' },
        { 'address.city': { $exists: false } },
        { 'address.city': null },
        { 'address.city': '' },
        { name: { $exists: false } },
        { name: null },
        { name: '' }
      ]
    });
    console.log(`✅ Usunięto ${deleteResult.deletedCount} wadliwych sklepów`);

    // Pobierz użytkowników do przypisania jako właściciele
    const users = await User.find().limit(10);
    if (users.length === 0) {
      console.log('❌ Brak użytkowników w bazie. Utworzę testowego użytkownika...');
      const testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        isActive: true
      });
      await testUser.save();
      users.push(testUser);
    }

    console.log('🌱 Tworzenie 80 przykładowych sklepów...');

    const shops = [];
    for (let i = 0; i < 80; i++) {
      const city = polishCities[i % polishCities.length];
      const category = shopCategories[i % shopCategories.length];
      const name = `${shopNames[i % shopNames.length]} ${city.name}`;
      const description = shopDescriptions[i % shopDescriptions.length];
      const owner = users[i % users.length];

      const shop = new Shop({
        name: name,
        description: `${description} w ${city.name}`,
        category: category,
        owner: owner._id,
        email: `kontakt@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.pl`,
        phone: `+48 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.pl`,
        address: {
          street: `ul. Przykładowa ${Math.floor(Math.random() * 100) + 1}`,
          houseNumber: `${Math.floor(Math.random() * 50) + 1}`,
          postalCode: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`,
          city: city.name,
          voivodeship: city.voivodeship
        },
        location: {
          type: 'Point',
          coordinates: {
            lat: city.lat + (Math.random() - 0.5) * 0.01, // Dodaj losowe przesunięcie
            lng: city.lng + (Math.random() - 0.5) * 0.01
          }
        },
        openingHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '09:00', close: '15:00', closed: false },
          sunday: { open: '', close: '', closed: true }
        },
        paymentMethods: [
          { name: 'Gotówka', description: 'Płatność gotówką', enabled: true },
          { name: 'Karta', description: 'Płatność kartą', enabled: true },
          { name: 'Przelew', description: 'Płatność przelewem', enabled: true }
        ],
        deliveryOptions: [
          { name: 'Odbiór osobisty', description: 'Bezpłatny odbiór w sklepie', cost: 0, estimatedDays: 1 },
          { name: 'Dostawa kurierem', description: 'Dostawa do domu', cost: 15.99, estimatedDays: 2 }
        ],
        isActive: true,
        isVerified: Math.random() > 0.3, // 70% sklepów zweryfikowanych
        status: 'active',
        ratings: {
          average: Math.floor(Math.random() * 50) / 10 + 3, // 3.0 - 5.0
          count: Math.floor(Math.random() * 100) + 10,
          distribution: {
            1: Math.floor(Math.random() * 5),
            2: Math.floor(Math.random() * 10),
            3: Math.floor(Math.random() * 20),
            4: Math.floor(Math.random() * 40),
            5: Math.floor(Math.random() * 50)
          }
        },
        stats: {
          totalProducts: Math.floor(Math.random() * 500) + 50,
          totalSales: Math.floor(Math.random() * 1000) + 100,
          totalRevenue: Math.floor(Math.random() * 50000) + 5000,
          totalViews: Math.floor(Math.random() * 10000) + 1000,
          totalOrders: Math.floor(Math.random() * 500) + 50,
          averageOrderValue: Math.floor(Math.random() * 200) + 50
        },
        tags: [category, city.name, city.voivodeship],
        categories: [category]
      });

      shops.push(shop);
    }

    // Zapisz wszystkie sklepy
    await Shop.insertMany(shops);
    console.log(`✅ Utworzono ${shops.length} przykładowych sklepów`);

    // Aktualizuj statystyki
    const totalShops = await Shop.countDocuments();
    const activeShops = await Shop.countDocuments({ isActive: true });
    const verifiedShops = await Shop.countDocuments({ isVerified: true });

    console.log(`📊 Podsumowanie:`);
    console.log(`   Wszystkich sklepów: ${totalShops}`);
    console.log(`   Aktywnych sklepów: ${activeShops}`);
    console.log(`   Zweryfikowanych sklepów: ${verifiedShops}`);

    // Pokaż przykłady sklepów z różnych miast
    console.log(`\n🏪 Przykłady sklepów z różnych miast:`);
    const sampleShops = await Shop.find().limit(10).select('name address.city category');
    sampleShops.forEach((shop, index) => {
      console.log(`   ${index + 1}. ${shop.name} - ${shop.address.city} (${shop.category})`);
    });

  } catch (error) {
    console.error('❌ Błąd podczas czyszczenia i tworzenia sklepów:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

cleanAndSeedShops(); 