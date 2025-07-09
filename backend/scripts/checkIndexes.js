const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('locations');

    const indexes = await collection.indexes();
    console.log('\n📋 Aktualne indeksy:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - unique: ${index.unique || false}`);
    });

    const count = await collection.countDocuments();
    console.log(`\n📊 Liczba dokumentów: ${count}`);

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkIndexes(); 