const mongoose = require('mongoose');
require('dotenv').config();

async function monitorImport() {
    try {
        console.log('🔍 MONITORUJĘ POSTĘP IMPORTU...');
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        const db = mongoose.connection.db;
        
        // Sprawdź liczbę dokumentów
        const miejscowosciCount = await db.collection('miejscowosci').countDocuments();
        
        console.log(`\n📊 MIEJSCOWOŚCI: ${miejscowosciCount.toLocaleString()}`);
        
        // Sprawdź rozkład rodzajów miejscowości
        console.log('\n📊 ROZKŁAD RODZAJÓW MIEJSCOWOŚCI:');
        const rodzaje = await db.collection('miejscowosci').aggregate([
            { $group: { _id: "$rodzaj", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();
        
        rodzaje.forEach(rodzaj => {
            let description = '';
            switch(rodzaj._id) {
                case '01': description = ' (wieś)'; break;
                case '96': description = ' (miasto)'; break;
                case '00': description = ' (część miejscowości)'; break;
                case '02': description = ' (kolonia)'; break;
                case '03': description = ' (przysiółek)'; break;
                case '04': description = ' (osada)'; break;
                case '05': description = ' (osada leśna)'; break;
                case '06': description = ' (osiedle)'; break;
                case '07': description = ' (schronisko turystyczne)'; break;
                case '95': description = ' (dzielnica)'; break;
                case '98': description = ' (delegatura)'; break;
                case '99': description = ' (część miasta)'; break;
            }
            console.log(`RM ${rodzaj._id}${description}: ${rodzaj.count.toLocaleString()}`);
        });
        
        // Sprawdź duplikaty kodów
        console.log('\n🔍 SPRAWDZAM DUPLIKATY KODÓW...');
        const duplicates = await db.collection('miejscowosci').aggregate([
            { $group: { _id: "$code", count: { $sum: 1 }, names: { $push: "$name" }, rodzaje: { $push: "$rodzaj" } } },
            { $match: { count: { $gt: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).toArray();
        
        if (duplicates.length > 0) {
            console.log('⚠️  ZNALEZIONE DUPLIKATY KODÓW:');
            duplicates.forEach(dup => {
                console.log(`Kod ${dup._id}: ${dup.count} razy - ${dup.names.join(', ')} (${dup.rodzaje.join(', ')})`);
            });
        } else {
            console.log('✅ Brak duplikatów kodów!');
        }
        
        // Sprawdź czy import się zakończył
        const expectedTotal = 95262; // Wszystkie wpisy z CSV
        const mainPlaces = rodzaje.find(r => r._id === '01')?.count || 0;
        const cities = rodzaje.find(r => r._id === '96')?.count || 0;
        const totalMain = mainPlaces + cities;
        
        console.log(`\n📈 POSTĘP:`);
        console.log(`📋 Wszystkie wpisy: ${miejscowosciCount.toLocaleString()} / ${expectedTotal.toLocaleString()}`);
        console.log(`📋 Główne miejscowości (RM 01+96): ${totalMain.toLocaleString()}`);
        console.log(`📋 Procent ukończenia: ${((miejscowosciCount / expectedTotal) * 100).toFixed(1)}%`);
        
        if (miejscowosciCount >= expectedTotal) {
            console.log('\n🎉 IMPORT ZAKOŃCZONY!');
        } else {
            console.log('\n⏳ IMPORT TRWA...');
        }
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

monitorImport(); 