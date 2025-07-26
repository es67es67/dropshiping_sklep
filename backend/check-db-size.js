const mongoose = require('mongoose');
require('dotenv').config();

// Importuj wszystkie modele
const WojewodztwoModel = require('./models/wojewodztwoModel');
const PowiatModel = require('./models/powiatModel');
const GminaModel = require('./models/gminaModel');
const MiejscowoscModel = require('./models/miejscowoscModel');
// const UlicaModel = require('./models/ulicaModel'); // Model nie istnieje

async function checkDatabaseSize() {
    try {
        console.log('🔍 SPRAWDZAM ROZMIAR BAZY DANYCH...');
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        const db = mongoose.connection.db;
        
        // Pobierz statystyki wszystkich kolekcji
        const collections = await db.listCollections().toArray();
        
        console.log('\n📊 ROZMIAR KOLEKCJI:');
        console.log('========================');
        
        let totalSize = 0;
        let totalCount = 0;
        
        for (const collection of collections) {
            try {
                const stats = await db.collection(collection.name).stats();
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
                const storageSizeMB = (stats.storageSize / 1024 / 1024).toFixed(2);
                const indexSizeMB = (stats.totalIndexSize / 1024 / 1024).toFixed(2);
                
                console.log(`📁 ${collection.name}:`);
                console.log(`   📝 Liczba dokumentów: ${stats.count.toLocaleString()}`);
                console.log(`   💾 Rozmiar danych: ${sizeMB} MB`);
                console.log(`   🗄️  Rozmiar przechowywania: ${storageSizeMB} MB`);
                console.log(`   🔍 Rozmiar indeksów: ${indexSizeMB} MB`);
                console.log(`   📊 Łączny rozmiar: ${(parseFloat(storageSizeMB) + parseFloat(indexSizeMB)).toFixed(2)} MB`);
                console.log('');
                
                totalSize += parseFloat(storageSizeMB) + parseFloat(indexSizeMB);
                totalCount += stats.count;
            } catch (error) {
                console.log(`📁 ${collection.name}: ❌ Błąd - ${error.message}`);
            }
        }
        
        console.log('========================');
        console.log(`📊 ŁĄCZNY ROZMIAR BAZY: ${totalSize.toFixed(2)} MB`);
        console.log(`📊 ŁĄCZNA LICZBA DOKUMENTÓW: ${totalCount.toLocaleString()}`);
        console.log(`📊 LIMIT RENDER: 512 MB`);
        console.log(`📊 WOLNE MIEJSCE: ${(512 - totalSize).toFixed(2)} MB`);
        
        if (totalSize > 512) {
            console.log('❌ PRZEKROCZONO LIMIT MIEJSCA!');
        } else {
            console.log('✅ Miejsce w bazie jest wystarczające');
        }
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

checkDatabaseSize(); 