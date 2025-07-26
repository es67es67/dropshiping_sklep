const mongoose = require('mongoose');
require('dotenv').config();

async function checkDuplicates() {
    try {
        console.log('🔍 SPRAWDZAM DUPLIKATY W MIEJSCOWOŚCIACH...');
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        const db = mongoose.connection.db;
        
        // Sprawdź duplikaty kodów miejscowości
        console.log('\n🔍 DUPLIKATY KODÓW MIEJSCOWOŚCI:');
        const codeDuplicates = await db.collection('miejscowosci').aggregate([
            { $group: { _id: "$code", count: { $sum: 1 }, names: { $push: "$name" } } },
            { $match: { count: { $gt: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();
        
        if (codeDuplicates.length > 0) {
            console.log(`❌ Znaleziono ${codeDuplicates.length} kodów z duplikatami:`);
            codeDuplicates.forEach(dup => {
                console.log(`   Kod ${dup._id}: ${dup.count} razy - ${dup.names.join(', ')}`);
            });
        } else {
            console.log('✅ Brak duplikatów kodów');
        }
        
        // Sprawdź duplikaty nazw miejscowości
        console.log('\n🔍 DUPLIKATY NAZW MIEJSCOWOŚCI:');
        const nameDuplicates = await db.collection('miejscowosci').aggregate([
            { $group: { _id: "$name", count: { $sum: 1 }, codes: { $push: "$code" } } },
            { $match: { count: { $gt: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();
        
        if (nameDuplicates.length > 0) {
            console.log(`⚠️  Znaleziono ${nameDuplicates.length} nazw z duplikatami:`);
            nameDuplicates.slice(0, 5).forEach(dup => {
                console.log(`   "${dup._id}": ${dup.count} razy - kody: ${dup.codes.join(', ')}`);
            });
        } else {
            console.log('✅ Brak duplikatów nazw');
        }
        
        // Sprawdź przykładowe miejscowości
        console.log('\n📝 PRZYKŁADOWE MIEJSCOWOŚCI:');
        const sampleMiejscowosci = await db.collection('miejscowosci').find({}).limit(5).toArray();
        sampleMiejscowosci.forEach((miej, i) => {
            console.log(`   ${i+1}. ${miej.name} (${miej.code}) - woj: ${miej.wojewodztwoCode}, pow: ${miej.powiatCode}, gmina: ${miej.gminaCode}`);
        });
        
        // Sprawdź czy są miejscowości bez kodu
        console.log('\n🔍 MIEJSCOWOŚCI BEZ KODU:');
        const bezKodu = await db.collection('miejscowosci').countDocuments({
            $or: [
                { code: { $exists: false } },
                { code: null },
                { code: '' }
            ]
        });
        console.log(`   Miejscowości bez kodu: ${bezKodu}`);
        
        // Sprawdź czy są miejscowości z pustymi nazwami
        console.log('\n🔍 MIEJSCOWOŚCI Z PUSTYMI NAZWAMI:');
        const pusteNazwy = await db.collection('miejscowosci').countDocuments({
            $or: [
                { name: { $exists: false } },
                { name: null },
                { name: '' },
                { name: 'brak' }
            ]
        });
        console.log(`   Miejscowości z pustymi nazwami: ${pusteNazwy}`);
        
        console.log('\n========================');
        console.log('✅ Sprawdzanie duplikatów zakończone');
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

checkDuplicates(); 