const mongoose = require('mongoose');
require('dotenv').config();

async function clearMiejscowosciOnly() {
    try {
        console.log('🗑️  CZYSZCZENIE TYLKO KOLEKCJI MIEJSCOWOŚCI...');
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        const db = mongoose.connection.db;
        
        // Sprawdź liczbę dokumentów przed usunięciem
        const przedCount = await db.collection('miejscowosci').countDocuments();
        console.log(`📊 Miejscowości przed usunięciem: ${przedCount}`);
        
        // Wyczyść tylko miejscowości
        const result = await db.collection('miejscowosci').deleteMany({});
        console.log(`🗑️  Usunięto ${result.deletedCount} miejscowości`);
        
        // Sprawdź liczbę dokumentów po usunięciu
        const poCount = await db.collection('miejscowosci').countDocuments();
        console.log(`📊 Miejscowości po usunięciu: ${poCount}`);
        
        // Sprawdź inne kolekcje
        const wojewodztwaCount = await db.collection('wojewodztwa').countDocuments();
        const powiatyCount = await db.collection('powiaty').countDocuments();
        const gminyCount = await db.collection('gminy').countDocuments();
        
        console.log('\n📊 STAN POZOSTAŁYCH KOLEKCJI:');
        console.log(`🏛️  Województwa: ${wojewodztwaCount}`);
        console.log(`🏛️  Powiaty: ${powiatyCount}`);
        console.log(`🏛️  Gminy: ${gminyCount}`);
        
        console.log('\n✅ Kolekcja miejscowości wyczyszczona!');
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

clearMiejscowosciOnly(); 