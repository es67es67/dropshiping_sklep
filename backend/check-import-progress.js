const mongoose = require('mongoose');
require('dotenv').config();

async function checkImportProgress() {
    try {
        console.log('🔍 SPRAWDZAM POSTĘP IMPORTU...');
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        const db = mongoose.connection.db;
        
        // Sprawdź liczbę dokumentów w każdej kolekcji
        const wojewodztwaCount = await db.collection('wojewodztwa').countDocuments();
        const powiatyCount = await db.collection('powiaty').countDocuments();
        const gminyCount = await db.collection('gminy').countDocuments();
        const miejscowosciCount = await db.collection('miejscowosci').countDocuments();
        const uliceCount = await db.collection('ulice').countDocuments();
        
        console.log('\n📊 STAN IMPORTU:');
        console.log(`🏛️  Województwa: ${wojewodztwaCount}`);
        console.log(`🏛️  Powiaty: ${powiatyCount}`);
        console.log(`🏛️  Gminy: ${gminyCount}`);
        console.log(`🏛️  Miejscowości: ${miejscowosciCount}`);
        console.log(`🏛️  Ulice: ${uliceCount}`);
        
        // Sprawdź czy liczby są rozsądne
        console.log('\n⚠️  SPRAWDZENIE POPRAWNOŚCI:');
        
        if (wojewodztwaCount !== 16) {
            console.log(`❌ BŁĄD: Województw powinno być 16, jest ${wojewodztwaCount}`);
        } else {
            console.log('✅ Województwa: OK (16)');
        }
        
        if (powiatyCount < 300 || powiatyCount > 400) {
            console.log(`❌ BŁĄD: Powiatów powinno być ~380, jest ${powiatyCount}`);
        } else {
            console.log(`✅ Powiaty: OK (${powiatyCount})`);
        }
        
        if (gminyCount < 2000 || gminyCount > 3000) {
            console.log(`❌ BŁĄD: Gmin powinno być ~2500, jest ${gminyCount}`);
        } else {
            console.log(`✅ Gminy: OK (${gminyCount})`);
        }
        
        if (miejscowosciCount < 40000 || miejscowosciCount > 60000) {
            console.log(`❌ BŁĄD: Miejscowości powinno być ~50000, jest ${miejscowosciCount}`);
        } else {
            console.log(`✅ Miejscowości: OK (${miejscowosciCount})`);
        }
        
        // Sprawdź czy są duplikaty nazw
        console.log('\n🔍 SPRAWDZENIE DUPLIKATÓW:');
        
        const wojewodztwaDuplicates = await db.collection('wojewodztwa').aggregate([
            { $group: { _id: "$name", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]).toArray();
        
        if (wojewodztwaDuplicates.length > 0) {
            console.log(`❌ BŁĄD: Znaleziono duplikaty nazw województw: ${wojewodztwaDuplicates.length}`);
            wojewodztwaDuplicates.forEach(dup => {
                console.log(`   - "${dup._id}": ${dup.count} razy`);
            });
        } else {
            console.log('✅ Województwa: brak duplikatów nazw');
        }
        
        // Sprawdź czy są dokumenty bez referencji
        console.log('\n🔍 SPRAWDZENIE REFERENCJI:');
        
        const miejscowosciBezReferencji = await db.collection('miejscowosci').countDocuments({
            $or: [
                { wojewodztwo: { $exists: false } },
                { powiat: { $exists: false } },
                { gmina: { $exists: false } }
            ]
        });
        
        if (miejscowosciBezReferencji > 0) {
            console.log(`❌ BŁĄD: ${miejscowosciBezReferencji} miejscowości bez referencji`);
        } else {
            console.log('✅ Miejscowości: wszystkie mają referencje');
        }
        
        console.log('\n========================');
        console.log('✅ Sprawdzanie zakończone');
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

checkImportProgress(); 