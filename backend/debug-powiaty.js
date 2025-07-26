const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Modele
const Wojewodztwo = require('./models/wojewodztwoModel');
const Powiat = require('./models/powiatModel');

// Konfiguracja
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
const TERC_FILE = path.join(__dirname, '../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');

async function debugPowiaty() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Połączono z MongoDB');
        
        // Sprawdź województwa
        const wojewodztwa = await Wojewodztwo.find({}, '_id code name');
        console.log(`🏛️  Województwa w bazie: ${wojewodztwa.length}`);
        
        // Sprawdź powiaty
        const powiaty = await Powiat.find({});
        console.log(`🏘️  Powiaty w bazie: ${powiaty.length}`);
        
        // Sprawdź pierwsze 10 rekordów z CSV
        console.log('\n🔍 SPRAWDZAM PIERWSZE 10 REKORDÓW Z CSV:');
        let count = 0;
        
        return new Promise((resolve, reject) => {
            fs.createReadStream(TERC_FILE)
                .pipe(csv({ 
                    separator: ';',
                    strict: false,
                    skipEmptyLines: true
                }))
                .on('data', (row) => {
                    if (count < 10) {
                        const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
                        const pow = row['POW'] || 'brak';
                        const gmi = row['GMI'] || 'brak';
                        const nazwa = row['NAZWA'] || 'brak';
                        
                        console.log(`   ${count + 1}. WOJ: ${woj}, POW: ${pow}, GMI: ${gmi}, NAZWA: ${nazwa}`);
                        
                        // Sprawdź czy to powiat
                        if (woj !== 'brak' && pow !== 'brak' && gmi === 'brak') {
                            console.log(`      ✅ TO POWIAT: ${woj}${pow} - ${nazwa}`);
                            
                            // Sprawdź czy województwo istnieje
                            const wojewodztwo = wojewodztwa.find(w => w.code === woj);
                            if (wojewodztwo) {
                                console.log(`      ✅ Województwo znalezione: ${wojewodztwo.name}`);
                            } else {
                                console.log(`      ❌ Województwo NIE znalezione dla kodu: ${woj}`);
                            }
                        }
                    }
                    count++;
                })
                .on('end', () => {
                    console.log('\n✅ Sprawdzanie zakończone');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('❌ Błąd:', error);
                    reject(error);
                });
        });
        
    } catch (error) {
        console.error('❌ Błąd:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Rozłączono z MongoDB');
    }
}

debugPowiaty(); 