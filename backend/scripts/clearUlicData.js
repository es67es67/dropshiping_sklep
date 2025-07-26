const mongoose = require('mongoose');
const Ulic = require('../models/ulicModel');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portal';

async function clearUlicData() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('🧹 Czyszczenie danych ULIC...');
    
    // Sprawdź ile rekordów jest w bazie
    const countBefore = await Ulic.countDocuments();
    console.log(`📊 Znaleziono ${countBefore} rekordów ULIC w bazie`);
    
    if (countBefore === 0) {
      console.log('ℹ️  Baza danych jest już pusta');
      return;
    }
    
    // Usuń wszystkie rekordy ULIC
    const result = await Ulic.deleteMany({});
    console.log(`🗑️  Usunięto ${result.deletedCount} rekordów ULIC`);
    
    // Sprawdź czy usunięcie się powiodło
    const countAfter = await Ulic.countDocuments();
    console.log(`📊 Pozostało ${countAfter} rekordów ULIC w bazie`);
    
    if (countAfter === 0) {
      console.log('✅ Baza danych ULIC została wyczyszczona pomyślnie');
    } else {
      console.log('⚠️  Nie wszystkie rekordy zostały usunięte');
    }
    
  } catch (error) {
    console.error('❌ Błąd podczas czyszczenia danych ULIC:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

// Uruchom czyszczenie
clearUlicData(); 