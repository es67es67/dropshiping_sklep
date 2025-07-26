const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
const TERC_FILE = path.join(__dirname, '../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');

async function checkPowiatyErrors() {
  console.log('🔍 Sprawdzanie potencjalnych błędów przy powiatach...');
  
  const powiaty = new Map(); // Map zamiast Set, żeby przechowywać więcej informacji
  let rowCount = 0;
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(TERC_FILE)
      .pipe(csv({ 
        separator: ';',
        strict: false,
        skipEmptyLines: true
      }))
      .on('data', (row) => {
        rowCount++;
        
        // Obsługuj puste pola
        const processedRow = {};
        for (const [key, value] of Object.entries(row)) {
          processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
        }
        
        const woj = processedRow['\uFEFFWOJ'] || processedRow['WOJ'] || 'brak';
        const pow = processedRow['POW'] || 'brak';
        const gmi = processedRow['GMI'] || 'brak';
        const nazwa = processedRow['NAZWA'] || 'brak';
        const nazwaDod = processedRow['NAZWA_DOD'] || 'brak';
        
        // Sprawdź tylko powiaty
        if (woj !== 'brak' && pow !== 'brak' && gmi === 'brak') {
          const powiatCode = woj + pow;
          if (powiaty.has(powiatCode)) {
            const existing = powiaty.get(powiatCode);
            console.log(`❌ DUPLIKAT POWIATU: kod ${powiatCode}`);
            console.log(`   Pierwszy: ${existing.nazwa} (${existing.nazwaDod}) w wierszu ${existing.row}`);
            console.log(`   Drugi: ${nazwa} (${nazwaDod}) w wierszu ${rowCount}`);
            console.log('');
          } else {
            powiaty.set(powiatCode, {
              nazwa: nazwa,
              nazwaDod: nazwaDod,
              row: rowCount
            });
            console.log(`✅ Powiat: ${powiatCode} - ${nazwa} (${nazwaDod})`);
          }
        }
      })
      .on('end', () => {
        console.log('\n📊 PODSUMOWANIE POWIATÓW:');
        console.log(`✅ Unikalnych powiatów: ${powiaty.size}`);
        console.log(`📋 Wszystkich wierszy: ${rowCount}`);
        
        // Sprawdź czy są powiaty z tym samym kodem ale różnymi nazwami
        const powiatyByCode = new Map();
        for (const [kod, info] of powiaty) {
          if (powiatyByCode.has(kod)) {
            console.log(`⚠️  Powiat z tym samym kodem ale różną nazwą: ${kod}`);
            console.log(`   ${powiatyByCode.get(kod).nazwa} vs ${info.nazwa}`);
          } else {
            powiatyByCode.set(kod, info);
          }
        }
        
        resolve();
      })
      .on('error', (error) => {
        console.error('❌ Błąd:', error);
        reject(error);
      });
  });
}

checkPowiatyErrors(); 