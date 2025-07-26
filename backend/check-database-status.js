const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

const Wojewodztwo = require('./models/wojewodztwoModel');
const Powiat = require('./models/powiatModel');
const Gmina = require('./models/gminaModel');
const Miejscowosc = require('./models/miejscowoscModel');

async function checkDatabaseStatus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    console.log('\n📊 STATUS BAZY DANYCH:');
    
    const wojewodztwaCount = await Wojewodztwo.countDocuments();
    console.log(`🏛️  Województwa: ${wojewodztwaCount}`);
    
    const powiatyCount = await Powiat.countDocuments();
    console.log(`🏘️  Powiaty: ${powiatyCount}`);
    
    const gminyCount = await Gmina.countDocuments();
    console.log(`🏘️  Gminy: ${gminyCount}`);
    
    const miejscowosciCount = await Miejscowosc.countDocuments();
    console.log(`🏘️  Miejscowości: ${miejscowosciCount}`);
    
    if (wojewodztwaCount === 0) {
      console.log('\n❌ BRAK WOJEWÓDZTW W BAZIE!');
      console.log('💡 Najpierw uruchom: node scripts/importGusDataSeparate.js full');
    }
    
    if (powiatyCount === 0) {
      console.log('\n❌ BRAK POWIATÓW W BAZIE!');
      console.log('💡 Najpierw uruchom: node scripts/importGusDataSeparate.js full');
    }
    
    if (gminyCount === 0) {
      console.log('\n❌ BRAK GMIN W BAZIE!');
      console.log('💡 Najpierw uruchom: node scripts/importGusDataSeparate.js full');
    }
    
    if (wojewodztwaCount > 0 && powiatyCount > 0 && gminyCount > 0) {
      console.log('\n✅ Baza gotowa do importu miejscowości!');
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

checkDatabaseStatus(); 