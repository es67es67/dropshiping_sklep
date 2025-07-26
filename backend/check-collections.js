const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('\n📋 Kolekcje w bazie danych:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Sprawdź liczbę dokumentów w każdej kolekcji
    console.log('\n📊 Liczba dokumentów w kolekcjach:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} dokumentów`);
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z MongoDB');
  }
}

checkCollections(); 