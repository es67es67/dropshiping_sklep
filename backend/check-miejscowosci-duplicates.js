const mongoose = require('mongoose');

async function checkDuplicates() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
        console.log('🔍 SPRAWDZAM DUPLIKATY W KOLEKCJI MIEJSCOWOŚCI...');
        console.log('========================');

        const Miejscowosc = require('./models/miejscowoscModel');
        
        // Sprawdź całkowitą liczbę
        const totalCount = await Miejscowosc.countDocuments();
        console.log(`📊 Całkowita liczba miejscowości: ${totalCount.toLocaleString()}`);

        // Sprawdź unikalne kody SIMC
        const uniqueCodes = await Miejscowosc.distinct('code');
        console.log(`🔑 Unikalne kody SIMC: ${uniqueCodes.length.toLocaleString()}`);

        // Sprawdź duplikaty kodów
        const duplicates = await Miejscowosc.aggregate([
            {
                $group: {
                    _id: '$code',
                    count: { $sum: 1 }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        console.log(`⚠️  Kodów z duplikatami: ${duplicates.length}`);
        
        if (duplicates.length > 0) {
            console.log('\n📋 Przykłady duplikatów:');
            duplicates.slice(0, 10).forEach(dup => {
                console.log(`   Kod ${dup._id}: ${dup.count} wystąpień`);
            });
        }

        // Sprawdź unikalne nazwy
        const uniqueNames = await Miejscowosc.distinct('name');
        console.log(`📝 Unikalne nazwy: ${uniqueNames.length.toLocaleString()}`);

        console.log('========================');
        console.log('✅ Sprawdzanie zakończone!');

    } catch (error) {
        console.error('❌ Błąd:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

checkDuplicates(); 