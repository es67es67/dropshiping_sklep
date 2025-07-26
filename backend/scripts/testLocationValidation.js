const mongoose = require('mongoose');
const Terc = require('../models/tercModel');
const Simc = require('../models/simcModel');
const Ulic = require('../models/ulicModel');

// Przykładowe dane testowe
const testData = {
  terc: [
    {
      WOJ: '02',
      POW: '',
      GMI: '',
      NAZWA: 'Dolnośląskie',
      RODZ: 'województwo'
    },
    {
      WOJ: '02',
      POW: '01',
      GMI: '',
      NAZWA: 'bolesławiecki',
      RODZ: 'powiat ziemski'
    },
    {
      WOJ: '02',
      POW: '01',
      GMI: '01',
      NAZWA: 'Bolesławiec',
      RODZ: 'gmina miejska'
    }
  ],
  simc: [
    {
      WOJ: '02',
      POW: '01',
      GMI: '01',
      RM: '01',
      NAZWA: 'Bolesławiec',
      SYM: '0934084',
      RODZ_GMI: 'gmina miejska'
    }
  ],
  ulic: [
    {
      WOJ: '02',
      POW: '01',
      GMI: '01',
      SYM: '0934084',
      SYM_UL: '0934084',
      CECHA: 'ul.',
      NAZWA_1: 'Mickiewicza',
      NAZWA_2: '',
      RODZ_GMI: 'gmina miejska',
      STAN_NA: '2023-01-01'
    },
    {
      WOJ: '02',
      POW: '01',
      GMI: '01',
      SYM: '0934084',
      SYM_UL: '0934085',
      CECHA: 'pl.',
      NAZWA_1: 'Rynek',
      NAZWA_2: 'Główny',
      RODZ_GMI: 'gmina miejska',
      STAN_NA: '2023-01-01'
    }
  ]
};

async function testValidation() {
  try {
    console.log('🧪 Rozpoczynam testy walidacji lokalizacji...');
    
    // Test TERC
    console.log('\n📋 Test TERC:');
    for (const record of testData.terc) {
      console.log(`  - ${record.NAZWA} (${record.WOJ}${record.POW}${record.GMI})`);
      
      // Sprawdź czy wszystkie pola są obecne
      const requiredFields = ['WOJ', 'NAZWA'];
      const missingFields = requiredFields.filter(field => !record[field]);
      
      if (missingFields.length > 0) {
        console.log(`    ❌ Brakujące pola: ${missingFields.join(', ')}`);
      } else {
        console.log(`    ✅ Wszystkie wymagane pola obecne`);
      }
      
      // Sprawdź format kodów
      if (!/^\d{2}$/.test(record.WOJ)) {
        console.log(`    ❌ Nieprawidłowy kod województwa: ${record.WOJ}`);
      }
      if (record.POW && !/^\d{2}$/.test(record.POW)) {
        console.log(`    ❌ Nieprawidłowy kod powiatu: ${record.POW}`);
      }
      if (record.GMI && !/^\d{2}$/.test(record.GMI)) {
        console.log(`    ❌ Nieprawidłowy kod gminy: ${record.GMI}`);
      }
    }
    
    // Test SIMC
    console.log('\n🏘️  Test SIMC:');
    for (const record of testData.simc) {
      console.log(`  - ${record.NAZWA} (${record.SYM})`);
      
      const requiredFields = ['WOJ', 'POW', 'GMI', 'RM', 'NAZWA', 'SYM'];
      const missingFields = requiredFields.filter(field => !record[field]);
      
      if (missingFields.length > 0) {
        console.log(`    ❌ Brakujące pola: ${missingFields.join(', ')}`);
      } else {
        console.log(`    ✅ Wszystkie wymagane pola obecne`);
      }
      
      // Sprawdź format kodów
      if (!/^\d{2}$/.test(record.WOJ)) {
        console.log(`    ❌ Nieprawidłowy kod województwa: ${record.WOJ}`);
      }
      if (!/^\d{2}$/.test(record.POW)) {
        console.log(`    ❌ Nieprawidłowy kod powiatu: ${record.POW}`);
      }
      if (!/^\d{2}$/.test(record.GMI)) {
        console.log(`    ❌ Nieprawidłowy kod gminy: ${record.GMI}`);
      }
      if (!/^\d{2}$/.test(record.RM)) {
        console.log(`    ❌ Nieprawidłowy kod miejscowości: ${record.RM}`);
      }
      if (!/^\d{7}$/.test(record.SYM)) {
        console.log(`    ❌ Nieprawidłowy kod SIMC: ${record.SYM}`);
      }
    }
    
    // Test ULIC
    console.log('\n🛣️  Test ULIC:');
    for (const record of testData.ulic) {
      console.log(`  - ${record.CECHA} ${record.NAZWA_1} ${record.NAZWA_2} (${record.SYM_UL})`);
      
      const requiredFields = ['WOJ', 'POW', 'GMI', 'SYM', 'SYM_UL', 'NAZWA_1'];
      const missingFields = requiredFields.filter(field => !record[field]);
      
      if (missingFields.length > 0) {
        console.log(`    ❌ Brakujące pola: ${missingFields.join(', ')}`);
      } else {
        console.log(`    ✅ Wszystkie wymagane pola obecne`);
      }
      
      // Sprawdź format kodów
      if (!/^\d{2}$/.test(record.WOJ)) {
        console.log(`    ❌ Nieprawidłowy kod województwa: ${record.WOJ}`);
      }
      if (!/^\d{2}$/.test(record.POW)) {
        console.log(`    ❌ Nieprawidłowy kod powiatu: ${record.POW}`);
      }
      if (!/^\d{2}$/.test(record.GMI)) {
        console.log(`    ❌ Nieprawidłowy kod gminy: ${record.GMI}`);
      }
      if (!/^\d{7}$/.test(record.SYM)) {
        console.log(`    ❌ Nieprawidłowy kod SIMC: ${record.SYM}`);
      }
      if (!/^\d{7}$/.test(record.SYM_UL)) {
        console.log(`    ❌ Nieprawidłowy kod ULIC: ${record.SYM_UL}`);
      }
      
      // Sprawdź czy puste pola są obsługiwane
      if (record.NAZWA_2 === '') {
        console.log(`    ✅ Puste pole NAZWA_2 obsługiwane`);
      }
      if (record.CECHA && record.CECHA.trim()) {
        console.log(`    ✅ Cecha: ${record.CECHA}`);
      }
    }
    
    console.log('\n✅ Testy walidacji zakończone pomyślnie!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testów:', error);
  }
}

// Uruchom testy
testValidation(); 