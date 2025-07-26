const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model sklepu
const shopSchema = new mongoose.Schema({
  name: String,
  address: {
    city: String,
    voivodeship: String
  },
  teryt: {
    voivodeshipCode: String
  }
});

const Shop = mongoose.model('Shop', shopSchema);

async function checkOpolskieShops() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Pobierz sklepy z województwa opolskiego (kod '16')
    const shops = await Shop.find({
      'teryt.voivodeshipCode': '16'
    }).select('name address.city teryt.voivodeshipCode');

    console.log('\n🏪 Sklepy w województwie opolskim:');
    console.log('=====================================');
    
    if (shops.length === 0) {
      console.log('❌ Brak sklepów w województwie opolskim');
    } else {
      shops.forEach((shop, index) => {
        console.log(`${index + 1}. ${shop.name} (miasto: ${shop.address.city}, kod: ${shop.teryt.voivodeshipCode})`);
      });
      console.log(`\n📊 Łącznie: ${shops.length} sklepów`);
    }

    // Sprawdź też sklepy bez kodów TERYT w województwie opolskim
    const shopsWithoutTeryt = await Shop.find({
      'address.voivodeship': 'Opolskie',
      $or: [
        { 'teryt.voivodeshipCode': { $exists: false } },
        { 'teryt.voivodeshipCode': null }
      ]
    }).select('name address.city address.voivodeship');

    if (shopsWithoutTeryt.length > 0) {
      console.log('\n⚠️ Sklepy w województwie opolskim bez kodów TERYT:');
      console.log('==================================================');
      shopsWithoutTeryt.forEach((shop, index) => {
        console.log(`${index + 1}. ${shop.name} (miasto: ${shop.address.city})`);
      });
      console.log(`\n📊 Łącznie: ${shopsWithoutTeryt.length} sklepów bez kodów TERYT`);
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  }
}

checkOpolskieShops(); 