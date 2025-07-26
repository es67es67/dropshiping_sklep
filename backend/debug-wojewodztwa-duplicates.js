const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const TERC_FILE = path.join(__dirname, '../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');

async function checkWojewodztwaDuplicates() {
  console.log('🔍 Sprawdzanie duplikatów województw w pliku TERC...');
  
  const wojewodztwa = new Map(); // Map zamiast Set, żeby przechowywać więcej informacji
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
        
        // Sprawdź tylko województwa
        if (woj !== 'brak' && pow === 'brak' && gmi === 'brak') {
          if (wojewodztwa.has(woj)) {
            const existing = wojewodztwa.get(woj);
            console.log(`❌ DUPLIKAT WOJEWÓDZTWA: kod ${woj}`);
            console.log(`   Pierwszy: ${existing.nazwa} (${existing.nazwaDod}) w wierszu ${existing.row}`);
            console.log(`   Drugi: ${nazwa} (${nazwaDod}) w wierszu ${rowCount}`);
            console.log('');
          } else {
            wojewodztwa.set(woj, {
              nazwa: nazwa,
              nazwaDod: nazwaDod,
              row: rowCount
            });
            console.log(`✅ Województwo: ${woj} - ${nazwa} (${nazwaDod})`);
          }
        }
      })
      .on('end', () => {
        console.log('\n📊 PODSUMOWANIE WOJEWÓDZTW:');
        console.log(`✅ Unikalnych województw: ${wojewodztwa.size}`);
        console.log(`📋 Wszystkich wierszy: ${rowCount}`);
        
        console.log('\n📋 Lista wszystkich województw:');
        for (const [kod, info] of wojewodztwa) {
          console.log(`   ${kod}: ${info.nazwa} (${info.nazwaDod})`);
        }
        
        resolve();
      })
      .on('error', (error) => {
        console.error('❌ Błąd:', error);
        reject(error);
      });
  });
}

checkWojewodztwaDuplicates(); 