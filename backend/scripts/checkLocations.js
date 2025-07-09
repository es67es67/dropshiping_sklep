const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkLocations() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('locations');

    // Sprawdź wszystkie typy
    const types = await collection.distinct('type');
    console.log('\n📋 Dostępne typy w bazie:', types);

    // Sprawdź liczbę dla każdego typu
    for (const type of types) {
      const count = await collection.countDocuments({ type: type });
      console.log(`- ${type}: ${count} dokumentów`);
    }

    // Sprawdź miejscowości dokładnie
    const miejscowosciCount = await collection.countDocuments({ type: 'miejscowość' });
    console.log(`\n🏠 Miejscowości (type: 'miejscowość'): ${miejscowosciCount}`);

    // Sprawdź czy są miejscowości z innym typem
    const allLocations = await collection.find({}).limit(10).toArray();
    console.log('\n📝 Przykładowe dokumenty:');
    allLocations.forEach(doc => {
      console.log(`- ${doc.name} (type: "${doc.type}")`);
    });

    // Sprawdź czy są miejscowości w nazwie ale innym typie
    const miejscowosciInName = await collection.find({ 
      name: { $regex: /miejscowość|miasto|wieś|village|town/i } 
    }).limit(5).toArray();
    
    if (miejscowosciInName.length > 0) {
      console.log('\n🔍 Lokalizacje z "miejscowość" w nazwie:');
      miejscowosciInName.forEach(doc => {
        console.log(`- ${doc.name} (type: "${doc.type}")`);
      });
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkLocations(); 