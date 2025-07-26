const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function clearGusCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    // Lista kolekcji GUS do wyczyszczenia (nowe nazwy)
    const gusCollections = [
      'wojewodztwa',
      'powiaty', 
      'gminy',
      'miejscowosci',
      'ulice'
    ];
    
    console.log('🗑️  Czyszczenie kolekcji GUS...');
    
    for (const collectionName of gusCollections) {
      try {
        const count = await mongoose.connection.db.collection(collectionName).countDocuments();
        await mongoose.connection.db.collection(collectionName).deleteMany({});
        console.log(`✅ Wyczyszczono kolekcję ${collectionName} (${count} dokumentów)`);
      } catch (error) {
        console.log(`⚠️  Kolekcja ${collectionName} nie istnieje lub błąd: ${error.message}`);
      }
    }
    
    console.log('✅ Wszystkie kolekcje GUS wyczyszczone!');
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

clearGusCollections(); 