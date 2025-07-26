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

async function checkLocationData() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Sprawdź wszystkie typy lokalizacji
    const types = await Location.distinct('type');
    console.log('\n📋 Dostępne typy lokalizacji:');
    console.log('==============================');
    types.forEach(type => console.log(`- ${type}`));

    // Sprawdź województwa
    const voivodeships = await Location.find({
      type: 'województwo',
      isActive: true
    }).sort('name');

    console.log('\n🏛️ Województwa w bazie:');
    console.log('========================');
    voivodeships.forEach(voivodeship => {
      console.log(`- ${voivodeship.name} (kod: ${voivodeship.code})`);
    });

    // Sprawdź powiaty
    const counties = await Location.find({
      type: 'powiat',
      isActive: true
    }).sort('name').limit(10);

    console.log('\n🏘️ Pierwsze 10 powiatów w bazie:');
    console.log('==================================');
    counties.forEach(county => {
      console.log(`- ${county.name} (kod: ${county.code}, województwo: ${county.parentCode})`);
    });

    // Sprawdź miasta
    const cities = await Location.find({
      type: 'miasto',
      isActive: true
    }).sort('name').limit(10);

    console.log('\n🏙️ Pierwsze 10 miast w bazie:');
    console.log('==============================');
    cities.forEach(city => {
      console.log(`- ${city.name} (kod: ${city.code})`);
    });

    console.log(`\n📊 Podsumowanie:`);
    console.log(`- Typy lokalizacji: ${types.length}`);
    console.log(`- Województwa: ${voivodeships.length}`);
    
    const totalCounties = await Location.countDocuments({ type: 'powiat', isActive: true });
    const totalCities = await Location.countDocuments({ type: 'miasto', isActive: true });
    
    console.log(`- Powiaty: ${totalCounties}`);
    console.log(`- Miasta: ${totalCities}`);

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkLocationData(); 