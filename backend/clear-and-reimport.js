const mongoose = require('mongoose');
require('dotenv').config();

// Importuj skrypt importu
const GusDataImporterSeparate = require('./scripts/importGusDataSeparate');

async function clearAndReimport() {
    try {
        console.log('🗑️  WYCZYSZCZENIE I PONOWNY IMPORT...');
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        const db = mongoose.connection.db;
        
        // Wyczyść wszystkie kolekcje
        console.log('🗑️  Czyszczenie kolekcji...');
        await db.collection('wojewodztwa').deleteMany({});
        await db.collection('powiaty').deleteMany({});
        await db.collection('gminy').deleteMany({});
        await db.collection('miejscowosci').deleteMany({});
        await db.collection('ulice').deleteMany({});
        console.log('✅ Kolekcje wyczyszczone');
        
        // Usuń wszystkie indeksy (oprócz _id)
        console.log('🗑️  Usuwanie starych indeksów...');
        const collections = ['wojewodztwa', 'powiaty', 'gminy', 'miejscowosci', 'ulice'];
        
        for (const collectionName of collections) {
            try {
                const collection = db.collection(collectionName);
                const indexes = await collection.indexes();
                
                for (const index of indexes) {
                    if (index.name !== '_id_') {
                        console.log(`🗑️  Usuwam indeks: ${index.name} z ${collectionName}`);
                        await collection.dropIndex(index.name);
                    }
                }
            } catch (error) {
                console.log(`⚠️  Błąd przy usuwaniu indeksów ${collectionName}: ${error.message}`);
            }
        }
        
        console.log('✅ Stare indeksy usunięte');
        
        // Rozłącz i uruchom import
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
        
        // Uruchom import z nowymi indeksami
        console.log('🚀 Uruchamiam import z nowymi indeksami...');
        const importer = new GusDataImporterSeparate();
        
        await importer.run({
            clearDb: false, // Już wyczyściliśmy
            importWojewodztwa: true,
            importPowiaty: true,
            importGminy: true,
            importMiejscowosci: true
        });
        
        console.log('🎉 Import zakończony!');
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    }
}

clearAndReimport(); 