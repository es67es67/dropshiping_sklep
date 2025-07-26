const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const TERC_FILE = path.join(__dirname, '../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');

async function checkTercDuplicates() {
  console.log('🔍 Sprawdzanie duplikatów w pliku TERC...');
  
  const wojewodztwa = new Set();
  const powiaty = new Set();
  const gminy = new Set();
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
        
        // Sprawdź typ jednostki
        if (woj !== 'brak' && pow === 'brak' && gmi === 'brak') {
          // Województwo
          if (wojewodztwa.has(woj)) {
            console.log(`❌ DUPLIKAT WOJEWÓDZTWA: kod ${woj} (${nazwa}) w wierszu ${rowCount}`);
          } else {
            wojewodztwa.add(woj);
            console.log(`✅ Województwo: ${woj} - ${nazwa}`);
          }
        } else if (woj !== 'brak' && pow !== 'brak' && gmi === 'brak') {
          // Powiat
          const powiatCode = woj + pow;
          if (powiaty.has(powiatCode)) {
            console.log(`❌ DUPLIKAT POWIATU: kod ${powiatCode} (${nazwa}) w wierszu ${rowCount}`);
          } else {
            powiaty.add(powiatCode);
            console.log(`✅ Powiat: ${powiatCode} - ${nazwa}`);
          }
        } else if (woj !== 'brak' && pow !== 'brak' && gmi !== 'brak') {
          // Gmina
          const gminaCode = woj + pow + gmi;
          if (gminy.has(gminaCode)) {
            console.log(`❌ DUPLIKAT GMINY: kod ${gminaCode} (${nazwa}) w wierszu ${rowCount}`);
          } else {
            gminy.add(gminaCode);
            console.log(`✅ Gmina: ${gminaCode} - ${nazwa}`);
          }
        }
      })
      .on('end', () => {
        console.log('\n📊 PODSUMOWANIE:');
        console.log(`✅ Województwa: ${wojewodztwa.size}`);
        console.log(`✅ Powiaty: ${powiaty.size}`);
        console.log(`✅ Gminy: ${gminy.size}`);
        console.log(`📋 Wszystkich wierszy: ${rowCount}`);
        resolve();
      })
      .on('error', (error) => {
        console.error('❌ Błąd:', error);
        reject(error);
      });
  });
}

checkTercDuplicates(); 