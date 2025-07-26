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

async function checkOpolskieCounties() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Pobierz powiaty w województwie opolskim (kod zaczynający się od 16)
    const counties = await Location.find({
      type: 'powiat',
      code: { $regex: '^16' },
      isActive: true
    }).sort('name');

    console.log('\n🏘️ Powiaty w województwie opolskim:');
    console.log('=====================================');
    
    if (counties.length === 0) {
      console.log('❌ Brak powiatów w województwie opolskim');
    } else {
      counties.forEach((county, index) => {
        console.log(`${index + 1}. ${county.name} (kod: ${county.code})`);
      });
      console.log(`\n📊 Łącznie: ${counties.length} powiatów`);
    }

    // Sprawdź też powiaty bez parentCode
    const countiesWithoutParent = await Location.find({
      type: 'powiat',
      code: { $regex: '^16' },
      $or: [
        { parentCode: { $exists: false } },
        { parentCode: null }
      ],
      isActive: true
    }).sort('name');

    if (countiesWithoutParent.length > 0) {
      console.log('\n⚠️ Powiaty bez parentCode:');
      console.log('==========================');
      countiesWithoutParent.forEach((county, index) => {
        console.log(`${index + 1}. ${county.name} (kod: ${county.code})`);
      });
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkOpolskieCounties(); 