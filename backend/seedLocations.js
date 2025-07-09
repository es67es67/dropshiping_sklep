const mongoose = require('mongoose');
const Location = require('./models/locationModel');
require('dotenv').config();

// Rejestruj modele aby uniknąć błędu MissingSchemaError
require('./models/productModel');
require('./models/shopModel');
require('./models/userModel');
require('./models/postModel');

// Rozszerzone dane lokalizacji Polski
const locationsData = [
  // WOJEWÓDZTWA (16)
  { name: 'Dolnośląskie', type: 'województwo', code: '02', population: 2900000 },
  { name: 'Kujawsko-pomorskie', type: 'województwo', code: '04', population: 2100000 },
  { name: 'Lubelskie', type: 'województwo', code: '06', population: 2100000 },
  { name: 'Lubuskie', type: 'województwo', code: '08', population: 1000000 },
  { name: 'Łódzkie', type: 'województwo', code: '10', population: 2500000 },
  { name: 'Małopolskie', type: 'województwo', code: '12', population: 3400000 },
  { name: 'Mazowieckie', type: 'województwo', code: '14', population: 5400000 },
  { name: 'Opolskie', type: 'województwo', code: '16', population: 1000000 },
  { name: 'Podkarpackie', type: 'województwo', code: '18', population: 2100000 },
  { name: 'Podlaskie', type: 'województwo', code: '20', population: 1200000 },
  { name: 'Pomorskie', type: 'województwo', code: '22', population: 2300000 },
  { name: 'Śląskie', type: 'województwo', code: '24', population: 4500000 },
  { name: 'Świętokrzyskie', type: 'województwo', code: '26', population: 1200000 },
  { name: 'Warmińsko-mazurskie', type: 'województwo', code: '28', population: 1400000 },
  { name: 'Wielkopolskie', type: 'województwo', code: '30', population: 3500000 },
  { name: 'Zachodniopomorskie', type: 'województwo', code: '32', population: 1700000 },

  // POWIATY (wybrane główne)
  { name: 'Wrocławski', type: 'powiat', code: '0216', parentLocation: 'Dolnośląskie', population: 150000 },
  { name: 'Legnicki', type: 'powiat', code: '0209', parentLocation: 'Dolnośląskie', population: 55000 },
  { name: 'Bydgoski', type: 'powiat', code: '0401', parentLocation: 'Kujawsko-pomorskie', population: 120000 },
  { name: 'Toruński', type: 'powiat', code: '0415', parentLocation: 'Kujawsko-pomorskie', population: 100000 },
  { name: 'Lubelski', type: 'powiat', code: '0609', parentLocation: 'Lubelskie', population: 160000 },
  { name: 'Zamojski', type: 'powiat', code: '0620', parentLocation: 'Lubelskie', population: 110000 },
  { name: 'Zielonogórski', type: 'powiat', code: '0808', parentLocation: 'Lubuskie', population: 75000 },
  { name: 'Gorzowski', type: 'powiat', code: '0801', parentLocation: 'Lubuskie', population: 65000 },
  { name: 'Łódzki wschodni', type: 'powiat', code: '1006', parentLocation: 'Łódzkie', population: 70000 },
  { name: 'Pabianicki', type: 'powiat', code: '1011', parentLocation: 'Łódzkie', population: 120000 },
  { name: 'Krakowski', type: 'powiat', code: '1206', parentLocation: 'Małopolskie', population: 270000 },
  { name: 'Tarnowski', type: 'powiat', code: '1216', parentLocation: 'Małopolskie', population: 200000 },
  { name: 'Warszawski zachodni', type: 'powiat', code: '1432', parentLocation: 'Mazowieckie', population: 120000 },
  { name: 'Piaseczyński', type: 'powiat', code: '1418', parentLocation: 'Mazowieckie', population: 180000 },
  { name: 'Opolski', type: 'powiat', code: '1609', parentLocation: 'Opolskie', population: 140000 },
  { name: 'Kędzierzyńsko-kozielski', type: 'powiat', code: '1603', parentLocation: 'Opolskie', population: 100000 },
  { name: 'Rzeszowski', type: 'powiat', code: '1816', parentLocation: 'Podkarpackie', population: 170000 },
  { name: 'Przemyski', type: 'powiat', code: '1813', parentLocation: 'Podkarpackie', population: 75000 },
  { name: 'Białostocki', type: 'powiat', code: '2002', parentLocation: 'Podlaskie', population: 150000 },
  { name: 'Suwalski', type: 'powiat', code: '2012', parentLocation: 'Podlaskie', population: 35000 },
  { name: 'Gdański', type: 'powiat', code: '2204', parentLocation: 'Pomorskie', population: 110000 },
  { name: 'Słupski', type: 'powiat', code: '2212', parentLocation: 'Pomorskie', population: 100000 },
  { name: 'Katowicki', type: 'powiat', code: '2412', parentLocation: 'Śląskie', population: 350000 },
  { name: 'Częstochowski', type: 'powiat', code: '2404', parentLocation: 'Śląskie', population: 180000 },
  { name: 'Kielecki', type: 'powiat', code: '2604', parentLocation: 'Świętokrzyskie', population: 210000 },
  { name: 'Ostrowiecki', type: 'powiat', code: '2607', parentLocation: 'Świętokrzyskie', population: 120000 },
  { name: 'Olsztyński', type: 'powiat', code: '2811', parentLocation: 'Warmińsko-mazurskie', population: 120000 },
  { name: 'Elbląski', type: 'powiat', code: '2804', parentLocation: 'Warmińsko-mazurskie', population: 60000 },
  { name: 'Poznański', type: 'powiat', code: '3021', parentLocation: 'Wielkopolskie', population: 350000 },
  { name: 'Kaliski', type: 'powiat', code: '3007', parentLocation: 'Wielkopolskie', population: 85000 },
  { name: 'Szczecinecki', type: 'powiat', code: '3215', parentLocation: 'Zachodniopomorskie', population: 80000 },
  { name: 'Koszaliński', type: 'powiat', code: '3209', parentLocation: 'Zachodniopomorskie', population: 65000 },

  // GMINY (wybrane główne)
  { name: 'Wrocław', type: 'gmina', code: '0264011', parentLocation: 'Wrocławski', population: 640000 },
  { name: 'Legnica', type: 'gmina', code: '0262011', parentLocation: 'Legnicki', population: 100000 },
  { name: 'Bydgoszcz', type: 'gmina', code: '0461011', parentLocation: 'Bydgoski', population: 350000 },
  { name: 'Toruń', type: 'gmina', code: '0463011', parentLocation: 'Toruński', population: 200000 },
  { name: 'Lublin', type: 'gmina', code: '0663011', parentLocation: 'Lubelski', population: 340000 },
  { name: 'Zamość', type: 'gmina', code: '0664011', parentLocation: 'Zamojski', population: 65000 },
  { name: 'Zielona Góra', type: 'gmina', code: '0862011', parentLocation: 'Zielonogórski', population: 140000 },
  { name: 'Gorzów Wielkopolski', type: 'gmina', code: '0861011', parentLocation: 'Gorzowski', population: 120000 },
  { name: 'Łódź', type: 'gmina', code: '1061011', parentLocation: 'Łódzki wschodni', population: 680000 },
  { name: 'Pabianice', type: 'gmina', code: '1062011', parentLocation: 'Pabianicki', population: 65000 },
  { name: 'Kraków', type: 'gmina', code: '1261011', parentLocation: 'Krakowski', population: 780000 },
  { name: 'Tarnów', type: 'gmina', code: '1263011', parentLocation: 'Tarnowski', population: 110000 },
  { name: 'Warszawa', type: 'gmina', code: '1465011', parentLocation: 'Warszawski zachodni', population: 1800000 },
  { name: 'Piaseczno', type: 'gmina', code: '1462011', parentLocation: 'Piaseczyński', population: 45000 },
  { name: 'Opole', type: 'gmina', code: '1661011', parentLocation: 'Opolski', population: 120000 },
  { name: 'Kędzierzyn-Koźle', type: 'gmina', code: '1605011', parentLocation: 'Kędzierzyńsko-kozielski', population: 60000 },
  { name: 'Rzeszów', type: 'gmina', code: '1863011', parentLocation: 'Rzeszowski', population: 190000 },
  { name: 'Przemyśl', type: 'gmina', code: '1862011', parentLocation: 'Przemyski', population: 60000 },
  { name: 'Białystok', type: 'gmina', code: '2061011', parentLocation: 'Białostocki', population: 300000 },
  { name: 'Suwałki', type: 'gmina', code: '2012011', parentLocation: 'Suwalski', population: 70000 },
  { name: 'Gdańsk', type: 'gmina', code: '2261011', parentLocation: 'Gdański', population: 470000 },
  { name: 'Słupsk', type: 'gmina', code: '2262011', parentLocation: 'Słupski', population: 90000 },
  { name: 'Katowice', type: 'gmina', code: '2469011', parentLocation: 'Katowicki', population: 300000 },
  { name: 'Częstochowa', type: 'gmina', code: '2464011', parentLocation: 'Częstochowski', population: 220000 },
  { name: 'Kielce', type: 'gmina', code: '2661011', parentLocation: 'Kielecki', population: 200000 },
  { name: 'Ostrowiec Świętokrzyski', type: 'gmina', code: '2607011', parentLocation: 'Ostrowiecki', population: 70000 },
  { name: 'Olsztyn', type: 'gmina', code: '2862011', parentLocation: 'Olsztyński', population: 170000 },
  { name: 'Elbląg', type: 'gmina', code: '2804011', parentLocation: 'Elbląski', population: 120000 },
  { name: 'Poznań', type: 'gmina', code: '3069011', parentLocation: 'Poznański', population: 540000 },
  { name: 'Kalisz', type: 'gmina', code: '3007011', parentLocation: 'Kaliski', population: 100000 },
  { name: 'Szczecinek', type: 'gmina', code: '3215011', parentLocation: 'Szczecinecki', population: 40000 },
  { name: 'Koszalin', type: 'gmina', code: '3269011', parentLocation: 'Koszaliński', population: 110000 },

  // MIEJSCOWOŚCI (wybrane główne miasta i wsie)
  { name: 'Wrocław-Centrum', type: 'miejscowość', code: '0264011001', parentLocation: 'Wrocław', population: 150000 },
  { name: 'Legnica-Centrum', type: 'miejscowość', code: '0262011001', parentLocation: 'Legnica', population: 25000 },
  { name: 'Bydgoszcz-Centrum', type: 'miejscowość', code: '0461011001', parentLocation: 'Bydgoszcz', population: 80000 },
  { name: 'Toruń-Stare Miasto', type: 'miejscowość', code: '0463011001', parentLocation: 'Toruń', population: 45000 },
  { name: 'Lublin-Stare Miasto', type: 'miejscowość', code: '0663011001', parentLocation: 'Lublin', population: 85000 },
  { name: 'Zamość-Stare Miasto', type: 'miejscowość', code: '0664011001', parentLocation: 'Zamość', population: 15000 },
  { name: 'Zielona Góra-Centrum', type: 'miejscowość', code: '0862011001', parentLocation: 'Zielona Góra', population: 35000 },
  { name: 'Gorzów Wielkopolski-Centrum', type: 'miejscowość', code: '0861011001', parentLocation: 'Gorzów Wielkopolski', population: 30000 },
  { name: 'Łódź-Centrum', type: 'miejscowość', code: '1061011001', parentLocation: 'Łódź', population: 170000 },
  { name: 'Pabianice-Centrum', type: 'miejscowość', code: '1062011001', parentLocation: 'Pabianice', population: 15000 },
  { name: 'Kraków-Stare Miasto', type: 'miejscowość', code: '1261011001', parentLocation: 'Kraków', population: 200000 },
  { name: 'Tarnów-Centrum', type: 'miejscowość', code: '1263011001', parentLocation: 'Tarnów', population: 25000 },
  { name: 'Warszawa-Śródmieście', type: 'miejscowość', code: '1465011001', parentLocation: 'Warszawa', population: 450000 },
  { name: 'Piaseczno-Centrum', type: 'miejscowość', code: '1462011001', parentLocation: 'Piaseczno', population: 12000 },
  { name: 'Opole-Centrum', type: 'miejscowość', code: '1661011001', parentLocation: 'Opole', population: 30000 },
  { name: 'Kędzierzyn-Koźle-Centrum', type: 'miejscowość', code: '1605011001', parentLocation: 'Kędzierzyn-Koźle', population: 15000 },
  { name: 'Rzeszów-Centrum', type: 'miejscowość', code: '1863011001', parentLocation: 'Rzeszów', population: 45000 },
  { name: 'Przemyśl-Stare Miasto', type: 'miejscowość', code: '1862011001', parentLocation: 'Przemyśl', population: 15000 },
  { name: 'Białystok-Centrum', type: 'miejscowość', code: '2061011001', parentLocation: 'Białystok', population: 75000 },
  { name: 'Suwałki-Centrum', type: 'miejscowość', code: '2012011001', parentLocation: 'Suwałki', population: 17500 },
  { name: 'Gdańsk-Główne Miasto', type: 'miejscowość', code: '2261011001', parentLocation: 'Gdańsk', population: 120000 },
  { name: 'Słupsk-Centrum', type: 'miejscowość', code: '2262011001', parentLocation: 'Słupsk', population: 22500 },
  { name: 'Katowice-Centrum', type: 'miejscowość', code: '2469011001', parentLocation: 'Katowice', population: 75000 },
  { name: 'Częstochowa-Centrum', type: 'miejscowość', code: '2464011001', parentLocation: 'Częstochowa', population: 55000 },
  { name: 'Kielce-Centrum', type: 'miejscowość', code: '2661011001', parentLocation: 'Kielce', population: 50000 },
  { name: 'Ostrowiec Świętokrzyski-Centrum', type: 'miejscowość', code: '2607011001', parentLocation: 'Ostrowiec Świętokrzyski', population: 17500 },
  { name: 'Olsztyn-Centrum', type: 'miejscowość', code: '2862011001', parentLocation: 'Olsztyn', population: 42500 },
  { name: 'Elbląg-Stare Miasto', type: 'miejscowość', code: '2804011001', parentLocation: 'Elbląg', population: 30000 },
  { name: 'Poznań-Stare Miasto', type: 'miejscowość', code: '3069011001', parentLocation: 'Poznań', population: 135000 },
  { name: 'Kalisz-Centrum', type: 'miejscowość', code: '3007011001', parentLocation: 'Kalisz', population: 25000 },
  { name: 'Szczecinek-Centrum', type: 'miejscowość', code: '3215011001', parentLocation: 'Szczecinek', population: 10000 },
  { name: 'Koszalin-Centrum', type: 'miejscowość', code: '3269011001', parentLocation: 'Koszalin', population: 27500 }
];

async function seedLocations() {
  try {
    console.log('🔄 Łączenie z bazą danych...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych');

    // Sprawdź ile lokalizacji już mamy
    const existingCount = await Location.countDocuments();
    console.log(`📊 Istniejące lokalizacje: ${existingCount}`);

    if (existingCount > 0) {
      console.log('⚠️ Baza danych nie jest pusta. Czy chcesz kontynuować? (y/n)');
      // W trybie automatycznym kontynuujemy
    }

    // Dodaj nowe lokalizacje
    const locations = [];
    
    for (const locationData of locationsData) {
      // Znajdź parent location jeśli jest określony
      let parentLocationId = null;
      if (locationData.parentLocation) {
        const parent = locations.find(loc => loc.name === locationData.parentLocation);
        if (parent) {
          parentLocationId = parent._id;
        }
      }

      const location = new Location({
        name: locationData.name,
        type: locationData.type,
        code: locationData.code,
        parentLocation: parentLocationId,
        population: locationData.population,
        coordinates: {
          latitude: 0, // Będzie uzupełnione później
          longitude: 0
        },
        isActive: true
      });

      const savedLocation = await location.save();
      locations.push(savedLocation);
      console.log(`✅ Dodano: ${locationData.name} (${locationData.type})`);
    }

    const finalCount = await Location.countDocuments();
    console.log(`🎉 Zakończono! Łączna liczba lokalizacji: ${finalCount}`);

  } catch (error) {
    console.error('❌ Błąd podczas dodawania lokalizacji:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
}

seedLocations(); 