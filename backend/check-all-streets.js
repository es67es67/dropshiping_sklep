const mongoose = require('mongoose');
require('dotenv').config();

async function checkAllStreets() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('=== SPRAWDZENIE WSZYSTKICH KOLEKCJI Z ULICAMI ===');
        
        const collections = ['ulicas', 'ulice', 'ulics'];
        
        for (const col of collections) {
            try {
                const count = await mongoose.connection.db.collection(col).countDocuments();
                console.log(`${col}: ${count} rekordów`);
                
                if (count > 0 && count < 100) {
                    const samples = await mongoose.connection.db.collection(col).find().limit(5).toArray();
                    console.log(`  Przykłady:`);
                    samples.forEach((item, i) => {
                        const name = item.name || item.nazwa1 || 'brak nazwy';
                        const code = item.code || item.symUl || 'brak kodu';
                        console.log(`    ${i+1}. ${name} (${code})`);
                    });
                }
            } catch (err) {
                console.log(`${col}: błąd - ${err.message}`);
            }
        }
        
        console.log('\n=== SZCZEGÓŁY KOLEKCJI ULICAS ===');
        const ulicasCount = await mongoose.connection.db.collection('ulicas').countDocuments();
        console.log(`ulicas: ${ulicasCount} rekordów`);
        
        // Sprawdź czy są duplikaty kodów
        const duplicates = await mongoose.connection.db.collection('ulicas').aggregate([
            { $group: { _id: "$code", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).toArray();
        
        if (duplicates.length > 0) {
            console.log('\nDuplikaty kodów (top 5):');
            duplicates.forEach(dup => {
                console.log(`  Kod ${dup._id}: ${dup.count} wystąpień`);
            });
        }
        
    } catch (error) {
        console.error('Błąd:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkAllStreets(); 