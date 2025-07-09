const mongoose = require('mongoose');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkAndCleanDatabase() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('locations');

    // Sprawdź aktualne indeksy
    console.log('\n📋 Sprawdzanie indeksów...');
    const indexes = await collection.indexes();
    console.log('Aktualne indeksy:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - unique: ${index.unique || false}`);
    });

    // Sprawdź ile dokumentów jest w kolekcji
    const count = await collection.countDocuments();
    console.log(`\n📊 Liczba dokumentów w kolekcji: ${count}`);

    // Sprawdź przykładowe dokumenty
    console.log('\n🔍 Przykładowe dokumenty:');
    const sampleDocs = await collection.find({}).limit(5).toArray();
    sampleDocs.forEach((doc, i) => {
      console.log(`${i + 1}. ${doc.name} (${doc.type}) - code: ${doc.code}`);
    });

    // Usuń wszystkie indeksy oprócz _id
    console.log('\n🗑️  Usuwanie wszystkich indeksów...');
    await collection.dropIndexes();
    console.log('✅ Wszystkie indeksy usunięte');

    // Sprawdź indeksy po usunięciu
    console.log('\n📋 Sprawdzanie indeksów po usunięciu...');
    const indexesAfter = await collection.indexes();
    console.log('Indeksy po usunięciu:');
    indexesAfter.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - unique: ${index.unique || false}`);
    });

    // Wyczyść wszystkie dokumenty
    console.log('\n🗑️  Czyszczenie wszystkich dokumentów...');
    const deleteResult = await collection.deleteMany({});
    console.log(`✅ Usunięto ${deleteResult.deletedCount} dokumentów`);

    // Sprawdź liczbę dokumentów po wyczyszczeniu
    const countAfter = await collection.countDocuments();
    console.log(`📊 Liczba dokumentów po wyczyszczeniu: ${countAfter}`);

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z MongoDB');
  }
}

// Uruchomienie skryptu
checkAndCleanDatabase(); 