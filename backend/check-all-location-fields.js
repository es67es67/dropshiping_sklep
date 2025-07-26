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

async function checkAllLocationFields() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Sprawdź wszystkie dokumenty
    const allLocations = await Location.find({}).limit(10);
    
    console.log('\n📋 Wszystkie dokumenty w kolekcji locations:');
    console.log('=============================================');
    console.log(`Znaleziono ${allLocations.length} dokumentów`);
    
    if (allLocations.length > 0) {
      console.log('\n🔍 Pierwszy dokument (wszystkie pola):');
      console.log('=====================================');
      console.log(JSON.stringify(allLocations[0], null, 2));
      
      console.log('\n📊 Wszystkie typy lokalizacji:');
      console.log('==============================');
      const types = await Location.distinct('type');
      types.forEach(type => {
        const count = allLocations.filter(loc => loc.type === type).length;
        console.log(`- ${type}: ${count} dokumentów`);
      });
      
      console.log('\n🏛️ Przykładowe województwa:');
      console.log('==========================');
      const voivodeships = await Location.find({ type: 'województwo' }).limit(5);
      voivodeships.forEach(v => {
        console.log(`- ${v.name} (kod: ${v.code})`);
      });
      
      console.log('\n🏘️ Przykładowe powiaty:');
      console.log('=======================');
      const counties = await Location.find({ type: 'powiat' }).limit(5);
      counties.forEach(c => {
        console.log(`- ${c.name} (kod: ${c.code})`);
      });
      
      console.log('\n🏙️ Przykładowe miejscowości:');
      console.log('============================');
      const cities = await Location.find({ type: 'miejscowość' }).limit(10);
      cities.forEach(city => {
        console.log(`- ${city.name} (kod: ${city.code})`);
      });
      
      console.log('\n🏢 Przykładowe gminy:');
      console.log('=====================');
      const municipalities = await Location.find({ type: 'gmina' }).limit(5);
      municipalities.forEach(m => {
        console.log(`- ${m.name} (kod: ${m.code})`);
      });
    } else {
      console.log('❌ Brak dokumentów w kolekcji locations');
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkAllLocationFields(); 