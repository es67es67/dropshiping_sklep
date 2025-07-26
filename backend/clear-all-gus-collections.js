const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function clearAllGusCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    console.log('🗑️  Usuwam wszystkie kolekcje GUS...');
    
    // Lista wszystkich kolekcji GUS do usunięcia
    const collectionsToDelete = [
      'wojewodztwa',
      'powiaty', 
      'gminy',
      'miejscowosci',
      'ulice',
      'terc'
    ];
    
    for (const collectionName of collectionsToDelete) {
      try {
        const result = await mongoose.connection.db.collection(collectionName).drop();
        console.log(`✅ Usunięto kolekcję: ${collectionName}`);
      } catch (error) {
        if (error.code === 26) {
          console.log(`ℹ️  Kolekcja ${collectionName} nie istniała`);
        } else {
          console.log(`❌ Błąd usuwania ${collectionName}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Wszystkie kolekcje GUS zostały usunięte!');
    console.log('💡 Baza danych jest teraz czysta i gotowa do pracy.');
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

clearAllGusCollections(); 