const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
const SIMC_FILE = path.join(__dirname, '../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');

const Miejscowosc = require('./models/miejscowoscModel');

async function debugMiejscowosciImport() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');
    
    console.log('🔍 Sprawdzam pierwsze 10 wierszy pliku SIMC...');
    
    let rowCount = 0;
    const testRows = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(SIMC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', (row) => {
          rowCount++;
          
          if (rowCount <= 10) {
            const processedRow = {};
            for (const [key, value] of Object.entries(row)) {
              processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
            }
            
            console.log(`\n📋 WIERSZ ${rowCount}:`);
            console.log('Klucze:', Object.keys(processedRow));
            console.log('Dane:', processedRow);
            
            // Sprawdź czy to miejscowość
            const woj = processedRow['\uFEFFWOJ'] || processedRow['WOJ'] || 'brak';
            const pow = processedRow['POW'] || 'brak';
            const gmi = processedRow['GMI'] || 'brak';
            const sym = processedRow['SYM'] || 'brak';
            const nazwa = processedRow['NAZWA'] || 'brak';
            
            console.log(`WOJ: "${woj}", POW: "${pow}", GMI: "${gmi}", SYM: "${sym}", NAZWA: "${nazwa}"`);
            
            if (woj !== 'brak' && pow !== 'brak' && gmi !== 'brak' && sym !== 'brak') {
              console.log('✅ TO JEST MIEJSCOWOŚĆ!');
              
              const gminaCode = woj + pow + gmi;
              const powiatCode = woj + pow;
              
              const miejscowoscData = {
                name: nazwa,
                code: sym,
                rodzaj: processedRow['RM'] || 'brak',
                nazwaDodatkowa: processedRow['MZ'] || 'brak',
                stanNa: processedRow['STAN_NA'] || 'brak',
                wojewodztwoCode: woj,
                powiatCode: powiatCode,
                gminaCode: gminaCode,
                isActive: true,
                isVerified: true
              };
              
              console.log('📝 DANE DO ZAPISU:', miejscowoscData);
              
              // Spróbuj zapisać
              const miejscowosc = new Miejscowosc(miejscowoscData);
              miejscowosc.save()
                .then(() => {
                  console.log('✅ MIEJSCOWOŚĆ ZAPISANA!');
                })
                .catch((error) => {
                  console.error('❌ BŁĄD ZAPISU:', error.message);
                });
            } else {
              console.log('❌ TO NIE JEST MIEJSCOWOŚĆ');
            }
          }
          
          if (rowCount >= 10) {
            console.log('\n🔍 Sprawdzam ile miejscowości jest w bazie...');
            Miejscowosc.countDocuments()
              .then((count) => {
                console.log(`📊 Miejscowości w bazie: ${count}`);
                resolve();
              })
              .catch((error) => {
                console.error('❌ Błąd sprawdzania:', error);
                resolve();
              });
          }
        })
        .on('error', (error) => {
          console.error('❌ Błąd czytania pliku:', error);
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

debugMiejscowosciImport(); 