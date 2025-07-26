const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    // Sprawdź indeksy kolekcji gminy
    console.log('\n🔍 Sprawdzanie indeksów kolekcji gminy...');
    const gminyIndexes = await mongoose.connection.db.collection('gminy').indexes();
    
    console.log('📋 Indeksy kolekcji gminy:');
    gminyIndexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${JSON.stringify(index.key)} - unique: ${index.unique || false}`);
    });
    
    // Sprawdź indeksy kolekcji wojewodztwa
    console.log('\n🔍 Sprawdzanie indeksów kolekcji wojewodztwa...');
    const wojewodztwaIndexes = await mongoose.connection.db.collection('wojewodztwa').indexes();
    
    console.log('📋 Indeksy kolekcji wojewodztwa:');
    wojewodztwaIndexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${JSON.stringify(index.key)} - unique: ${index.unique || false}`);
    });
    
    // Sprawdź indeksy kolekcji powiaty
    console.log('\n🔍 Sprawdzanie indeksów kolekcji powiaty...');
    const powiatyIndexes = await mongoose.connection.db.collection('powiaty').indexes();
    
    console.log('📋 Indeksy kolekcji powiaty:');
    powiatyIndexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${JSON.stringify(index.key)} - unique: ${index.unique || false}`);
    });
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z MongoDB');
  }
}

checkIndexes(); 