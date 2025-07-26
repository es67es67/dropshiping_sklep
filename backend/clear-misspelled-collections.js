const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function clearMisspelledCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    console.log('🗑️  Usuwam kolekcje z literówkami...');
    
    // Lista kolekcji z literówkami do usunięcia
    const misspelledCollections = [
      'wojewodztwos',
      'miejscowoscs', 
      'powiats',
      'tercs',
      'simcs'
    ];
    
    for (const collectionName of misspelledCollections) {
      try {
        const result = await mongoose.connection.db.collection(collectionName).drop();
        console.log(`✅ Usunięto kolekcję z literówką: ${collectionName}`);
      } catch (error) {
        if (error.code === 26) {
          console.log(`ℹ️  Kolekcja ${collectionName} nie istniała`);
        } else {
          console.log(`❌ Błąd usuwania ${collectionName}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Wszystkie kolekcje z literówkami zostały usunięte!');
    console.log('💡 Baza danych jest teraz czysta od błędnych kolekcji GUS.');
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

clearMisspelledCollections(); 