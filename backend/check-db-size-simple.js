const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabaseSizeSimple() {
    try {
        console.log('🔍 SPRAWDZAM LICZBĘ DOKUMENTÓW W KOLEKCJACH...');
        
        // Połącz z MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        const db = mongoose.connection.db;
        
        // Lista kolekcji do sprawdzenia
        const collectionsToCheck = [
            'wojewodztwa', 'powiaty', 'gminy', 'miejscowosci', 'ulice',
            'carts', 'reviews', 'wishlists', 'payments', 'achievements',
            'locationratings', 'shops', 'locations', 'companyprofiles',
            'simcs', 'ulics', 'test_write', 'badges', 'groups', 'products',
            'tercs', 'posts'
        ];
        
        console.log('\n📊 LICZBA DOKUMENTÓW W KOLEKCJACH:');
        console.log('========================');
        
        let totalCount = 0;
        
        for (const collectionName of collectionsToCheck) {
            try {
                const count = await db.collection(collectionName).countDocuments();
                console.log(`📁 ${collectionName}: ${count.toLocaleString()} dokumentów`);
                totalCount += count;
            } catch (error) {
                // Kolekcja nie istnieje
                console.log(`📁 ${collectionName}: 0 dokumentów (nie istnieje)`);
            }
        }
        
        console.log('========================');
        console.log(`📊 ŁĄCZNA LICZBA DOKUMENTÓW: ${totalCount.toLocaleString()}`);
        
        // Szacunkowy rozmiar (przybliżenie)
        const estimatedSizeMB = (totalCount * 0.001); // ~1KB na dokument
        console.log(`📊 SZACUNKOWY ROZMIAR: ~${estimatedSizeMB.toFixed(2)} MB`);
        console.log(`📊 LIMIT RENDER: 512 MB`);
        
        if (estimatedSizeMB > 400) {
            console.log('⚠️  UWAGA: Możliwe przekroczenie limitu miejsca!');
        } else {
            console.log('✅ Szacunkowo miejsce w bazie jest wystarczające');
        }
        
    } catch (error) {
        console.error('❌ Błąd:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

checkDatabaseSizeSimple(); 