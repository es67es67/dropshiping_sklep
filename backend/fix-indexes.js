const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function fixIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    // Usuń stary indeks unique na code w kolekcji gminy
    console.log('\n🗑️  Usuwanie starego indeksu unique na code w kolekcji gminy...');
    try {
      await mongoose.connection.db.collection('gminy').dropIndex('code_1');
      console.log('✅ Usunięto stary indeks unique na code');
    } catch (error) {
      console.log('⚠️  Indeks już nie istnieje lub błąd:', error.message);
    }
    
    // Sprawdź indeksy po naprawie
    console.log('\n🔍 Sprawdzanie indeksów po naprawie...');
    const gminyIndexes = await mongoose.connection.db.collection('gminy').indexes();
    
    console.log('📋 Indeksy kolekcji gminy:');
    gminyIndexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${JSON.stringify(index.key)} - unique: ${index.unique || false}`);
    });
    
    console.log('\n✅ Naprawa indeksów zakończona!');
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z MongoDB');
  }
}

fixIndexes(); 