const mongoose = require('mongoose');
require('dotenv').config();

async function checkUlicas() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const count = await mongoose.connection.db.collection('ulicas').countDocuments();
        console.log('Liczba ulic w kolekcji ulicas:', count);
        
        if (count > 0) {
            const samples = await mongoose.connection.db.collection('ulicas').find().limit(10).toArray();
            console.log('\nPierwsze 10 ulic:');
            samples.forEach((ulica, i) => {
                console.log(`${i+1}. ${ulica.name} (kod: ${ulica.code})`);
            });
        }
        
    } catch (error) {
        console.error('Błąd:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUlicas(); 