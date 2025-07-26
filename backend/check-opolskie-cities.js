const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model lokalizacji
const locationSchema = new mongoose.Schema({
  name: String,
  type: String,
  code: String,
  parentCode: String,
  isActive: Boolean
});

const Location = mongoose.model('Location', locationSchema);

async function checkOpolskieCities() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Znajdź województwo opolskie
    const voivodeship = await Location.findOne({
      type: 'województwo',
      code: '16',
      isActive: true
    });

    if (!voivodeship) {
      console.log('❌ Nie znaleziono województwa opolskiego');
      return;
    }

    console.log(`\n🏛️ Województwo: ${voivodeship.name} (kod: ${voivodeship.code})`);
    console.log('=====================================');

    // Pobierz powiaty w województwie opolskim
    const counties = await Location.find({
      type: 'powiat',
      parentCode: voivodeship.code,
      isActive: true
    }).sort('name');

    console.log('\n🏘️ Powiaty w województwie opolskim:');
    console.log('=====================================');
    counties.forEach((county, index) => {
      console.log(`${index + 1}. ${county.name} (kod: ${county.code})`);
    });

    // Pobierz miasta w województwie opolskim
    const cities = await Location.find({
      type: 'miasto',
      code: { $regex: '^16' }, // Kod zaczynający się od 16 (województwo opolskie)
      isActive: true
    }).sort('name');

    console.log('\n🏙️ Miasta w województwie opolskim:');
    console.log('=====================================');
    cities.forEach((city, index) => {
      console.log(`${index + 1}. ${city.name} (kod: ${city.code})`);
    });

    console.log(`\n📊 Podsumowanie:`);
    console.log(`- Powiaty: ${counties.length}`);
    console.log(`- Miasta: ${cities.length}`);

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkOpolskieCities(); 