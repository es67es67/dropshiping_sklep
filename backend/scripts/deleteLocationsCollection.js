const mongoose = require('mongoose');
require('dotenv').config();

async function deleteLocationsCollection() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    
    // Połącz z MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    
    console.log('✅ Połączono z MongoDB');
    
    // Sprawdź czy kolekcja locations istnieje
    const collections = await mongoose.connection.db.listCollections().toArray();
    const locationsCollection = collections.find(col => col.name === 'locations');
    
    if (!locationsCollection) {
      console.log('ℹ️ Kolekcja "locations" nie istnieje w bazie danych');
      return;
    }
    
    // Sprawdź ile dokumentów jest w kolekcji
    const count = await mongoose.connection.db.collection('locations').countDocuments();
    console.log(`📊 Znaleziono ${count} dokumentów w kolekcji "locations"`);
    
    if (count > 0) {
      console.log('⚠️ UWAGA: Kolekcja zawiera dane!');
      console.log('Czy na pewno chcesz usunąć wszystkie dane lokalizacji?');
      console.log('Naciśnij Ctrl+C aby anulować lub Enter aby kontynuować...');
      
      // Czekaj na potwierdzenie (w trybie interaktywnym)
      process.stdin.once('data', async () => {
        await performDeletion();
      });
    } else {
      await performDeletion();
    }
    
  } catch (error) {
    console.error('❌ Błąd podczas usuwania kolekcji:', error);
  }
}

async function performDeletion() {
  try {
    console.log('🗑️ Usuwanie kolekcji "locations"...');
    
    // Usuń kolekcję locations
    await mongoose.connection.db.dropCollection('locations');
    
    console.log('✅ Kolekcja "locations" została pomyślnie usunięta!');
    
    // Sprawdź czy kolekcja została usunięta
    const collections = await mongoose.connection.db.listCollections().toArray();
    const locationsCollection = collections.find(col => col.name === 'locations');
    
    if (!locationsCollection) {
      console.log('✅ Potwierdzenie: Kolekcja "locations" nie istnieje w bazie danych');
    } else {
      console.log('❌ Błąd: Kolekcja nadal istnieje');
    }
    
  } catch (error) {
    console.error('❌ Błąd podczas usuwania kolekcji:', error);
  } finally {
    // Zamknij połączenie
    await mongoose.connection.close();
    console.log('🔌 Połączenie z MongoDB zamknięte');
    process.exit(0);
  }
}

// Uruchom skrypt
deleteLocationsCollection(); 