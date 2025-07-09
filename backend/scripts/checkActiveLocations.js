const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkActiveLocations() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('locations');

    // Sprawdź miejscowości z isActive: true
    const activeMiejscowosci = await collection.countDocuments({type: 'miejscowość', isActive: true});
    console.log(`🏠 Miejscowości z isActive=true: ${activeMiejscowosci}`);

    // Sprawdź wszystkie miejscowości
    const allMiejscowosci = await collection.countDocuments({type: 'miejscowość'});
    console.log(`🏠 Wszystkie miejscowości: ${allMiejscowosci}`);

    // Sprawdź miejscowości bez isActive
    const noActiveMiejscowosci = await collection.countDocuments({type: 'miejscowość', isActive: {$ne: true}});
    console.log(`🏠 Miejscowości bez isActive=true: ${noActiveMiejscowosci}`);

    // Sprawdź przykładowe dokumenty
    const sampleDocs = await collection.find({type: 'miejscowość'}).limit(5).toArray();
    console.log('\n📝 Przykładowe miejscowości:');
    sampleDocs.forEach(doc => {
      console.log(`- ${doc.name} (isActive: ${doc.isActive})`);
    });

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkActiveLocations(); 