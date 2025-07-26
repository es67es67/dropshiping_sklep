const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Ścieżka do pliku CSV
const TERC_FILE = path.join(__dirname, '../../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');

console.log('🔍 DEBUG: Sprawdzanie parsowania CSV TERC...');
console.log(`📁 Plik: ${TERC_FILE}`);

let rowCount = 0;
const maxRows = 50;

fs.createReadStream(TERC_FILE)
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    rowCount++;
    
    if (rowCount <= maxRows) {
      console.log(`\n📋 Wiersz ${rowCount}:`);
      console.log('  Surowe dane:', row);
      console.log('  Klucze:', Object.keys(row));
      console.log('  Klucz WOJ dokładnie:', JSON.stringify(Object.keys(row).find(k => k.includes('WOJ'))));
      console.log('  Wszystkie klucze z WOJ:', Object.keys(row).filter(k => k.includes('WOJ')));
      console.log('  WOJ:', `"${row['WOJ']}"`, `(typ: ${typeof row['WOJ']})`);
      console.log('  WOJ z cudzysłowami:', `"${row["'WOJ'"]}"`, `(typ: ${typeof row["'WOJ'"]})`);
      console.log('  WOJ bez cudzysłowów:', `"${row.WOJ}"`, `(typ: ${typeof row.WOJ})`);
      console.log('  Wszystkie właściwości obiektu:', Object.getOwnPropertyNames(row));
      console.log('  Wartość WOJ bezpośrednio:', row.WOJ);
      console.log('  Wartość WOJ w nawiasach:', row['WOJ']);
      console.log('  Wartość WOJ z cudzysłowami:', row["'WOJ'"]);
      console.log('  Wszystkie wartości obiektu:', Object.values(row));
      console.log('  Wszystkie pary klucz-wartość:', Object.entries(row));
      console.log('  Pierwszy klucz dokładnie:', JSON.stringify(Object.keys(row)[0]));
      console.log('  Pierwsza wartość dokładnie:', JSON.stringify(Object.values(row)[0]));
      console.log('  Czy WOJ istnieje jako klucz:', 'WOJ' in row);
      console.log('  Czy WOJ istnieje jako właściwość:', row.hasOwnProperty('WOJ'));
      console.log('  Wszystkie klucze jako stringi:', Object.keys(row).map(k => `"${k}"`));
      console.log('  Wszystkie klucze jako JSON:', Object.keys(row).map(k => JSON.stringify(k)));
      console.log('  Pierwszy klucz jako string:', `"${Object.keys(row)[0]}"`);
      console.log('  Pierwszy klucz jako JSON:', JSON.stringify(Object.keys(row)[0]));
      console.log('  Pierwszy klucz jako charCode:', Object.keys(row)[0].split('').map(c => c.charCodeAt(0)));
      console.log('  Wszystkie klucze jako charCode:');
      Object.keys(row).forEach((key, index) => {
        console.log(`    ${index}: "${key}" -> [${key.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
      });
      console.log('  POW:', `"${row['POW']}"`, `(typ: ${typeof row['POW']})`);
      console.log('  GMI:', `"${row['GMI']}"`, `(typ: ${typeof row['GMI']})`);
      console.log('  NAZWA:', `"${row['NAZWA']}"`, `(typ: ${typeof row['NAZWA']})`);
      console.log('  NAZWA_DOD:', `"${row['NAZWA_DOD']}"`, `(typ: ${typeof row['NAZWA_DOD']})`);
      console.log('  RODZ:', `"${row['RODZ']}"`, `(typ: ${typeof row['RODZ']})`);
      console.log('  STAN_NA:', `"${row['STAN_NA']}"`, `(typ: ${typeof row['STAN_NA']})`);
      
      // Sprawdź czy WOJ jest undefined
      if (row['WOJ'] === undefined) {
        console.log('  ❌ PROBLEM: WOJ jest undefined!');
      } else if (row['WOJ'] === '') {
        console.log('  ⚠️  UWAGA: WOJ jest pusty string');
      } else {
        console.log('  ✅ WOJ jest OK');
      }
    }
  })
  .on('end', () => {
    console.log(`\n📊 Przeanalizowano ${rowCount} wierszy`);
    console.log('🔍 Debugowanie zakończone');
  })
  .on('error', (error) => {
    console.error('❌ Błąd podczas parsowania CSV:', error);
  }); 