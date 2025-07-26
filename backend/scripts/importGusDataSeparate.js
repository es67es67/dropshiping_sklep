const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Modele
const Wojewodztwo = require('../models/wojewodztwoModel');
const Powiat = require('../models/powiatModel');
const Gmina = require('../models/gminaModel');
const Miejscowosc = require('../models/miejscowoscModel');
const Ulic = require('../models/ulicModel');

// Konfiguracja
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
const TERC_FILE = path.join(__dirname, '../../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');
const SIMC_FILE = path.join(__dirname, '../../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');
const ULIC_FILE = path.join(__dirname, '../../inne/dane adresowe gus/ULIC_Adresowy_2025-07-07.csv');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GusDataImporterSeparate {
  constructor() {
    this.stats = {
      wojewodztwa: 0,
      powiaty: 0,
      gminy: 0,
      miejscowosci: 0,
      ulice: 0,
      errors: 0,
      skipped: 0
    };
    
    // Cache dla hierarchii
    this.wojewodztwaCache = new Map(); // code -> ObjectId
    this.powiatyCache = new Map(); // code -> ObjectId
    this.gminyCache = new Map(); // code -> ObjectId
    this.miejscowosciCache = new Map(); // code -> ObjectId
    
    this.batchSize = 50; // Mniejszy batch size dla miejscowości
  }

  async connect() {
    try {
      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ Połączono z MongoDB');
    } catch (error) {
      console.error('❌ Błąd połączenia z MongoDB:', error);
      throw error;
    }
  }

  async clearDatabase() {
    try {
      console.log('🗑️  Czyszczenie bazy danych...');
      await Wojewodztwo.deleteMany({});
      await Powiat.deleteMany({});
      await Gmina.deleteMany({});
      await Miejscowosc.deleteMany({});
      await Ulic.deleteMany({});
      console.log('✅ Baza danych wyczyszczona');
    } catch (error) {
      console.error('❌ Błąd czyszczenia bazy:', error);
      throw error;
    }
  }

  // Batch processing
  async processBatch(model, documents) {
    try {
      console.log(`🗄️  Zapisuję ${documents.length} dokumentów typu ${model.modelName}`);
      
      let savedCount = 0;
      
      for (const doc of documents) {
        try {
          // Zapisuj WSZYSTKIE dokumenty bez sprawdzania duplikatów
          await new model(doc).save();
          savedCount++;
          await delay(10);
        } catch (err) {
          console.error(`❌ Błąd pojedynczego dokumentu ${doc.name} (${doc.code}):`, err.message);
          this.stats.errors++;
        }
      }
      
      console.log(`✅ Zapisano ${savedCount} dokumentów typu ${model.modelName}`);
      await delay(100);
    } catch (error) {
      console.error(`❌ Błąd batch processing dla ${model.modelName}:`, error.message);
      this.stats.errors++;
    }
  }

  // PIERWSZE PRZEJŚCIE - tylko województwa
  async importWojewodztwa() {
    console.log('🏛️  PIERWSZE PRZEJŚCIE - Importowanie tylko województw...');
    
    return new Promise((resolve, reject) => {
      const wojewodztwaBatch = [];
      let batchCount = 0;
      
      fs.createReadStream(TERC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', async (row) => {
          // Obsługuj puste pola
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
          }
          
          const result = await this.processWojewodztwoRow(processedRow);
          if (result) {
            wojewodztwaBatch.push(result);
          }
          
          batchCount++;
          
          if (batchCount % this.batchSize === 0) {
            console.log(`⏳ Przetwarzanie województw batch: ${batchCount}`);
            await this.processBatch(Wojewodztwo, wojewodztwaBatch);
            wojewodztwaBatch.length = 0;
          }
        })
        .on('end', async () => {
          if (wojewodztwaBatch.length > 0) {
            await this.processBatch(Wojewodztwo, wojewodztwaBatch);
          }
          console.log(`✅ Województwa zaimportowane: ${this.stats.wojewodztwa} województw`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Błąd podczas importowania województw:', error);
          reject(error);
        });
    });
  }

  async processWojewodztwoRow(row) {
    try {
      const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
      const pow = row['POW'] || 'brak';
      const gmi = row['GMI'] || 'brak';
      const nazwa = row['NAZWA'] || 'brak';
      const nazwaDod = row['NAZWA_DOD'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // Tylko województwa
      if (woj !== 'brak' && pow === 'brak' && gmi === 'brak') {
        console.log(`📝 Znaleziono województwo: ${woj} - ${nazwa}`);
        
        const wojewodztwoData = {
          name: nazwa,
          code: woj,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          isActive: true,
          isVerified: true
        };
        
        this.stats.wojewodztwa++;
        return wojewodztwoData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania rekordu województwa:', error);
      this.stats.errors++;
      return null;
    }
  }

  // DRUGIE PRZEJŚCIE - tylko powiaty
  async importPowiaty() {
    console.log('🏛️  DRUGIE PRZEJŚCIE - Importowanie tylko powiatów...');
    
    // Najpierw załaduj cache województw
    await this.loadWojewodztwaCache();
    
    return new Promise((resolve, reject) => {
      const powiatyBatch = [];
      let batchCount = 0;
      
      fs.createReadStream(TERC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', async (row) => {
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
          }
          
          const result = await this.processPowiatRow(processedRow);
          if (result) {
            powiatyBatch.push(result);
          }
          
          batchCount++;
          
          if (batchCount % this.batchSize === 0) {
            console.log(`⏳ Przetwarzanie powiatów batch: ${batchCount}`);
            await this.processBatch(Powiat, powiatyBatch);
            powiatyBatch.length = 0;
          }
        })
        .on('end', async () => {
          if (powiatyBatch.length > 0) {
            await this.processBatch(Powiat, powiatyBatch);
          }
          console.log(`✅ Powiaty zaimportowane: ${this.stats.powiaty} powiatów`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Błąd podczas importowania powiatów:', error);
          reject(error);
        });
    });
  }

  async processPowiatRow(row) {
    try {
      const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
      const pow = row['POW'] || 'brak';
      const gmi = row['GMI'] || 'brak';
      const nazwa = row['NAZWA'] || 'brak';
      const nazwaDod = row['NAZWA_DOD'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // Tylko powiaty
      if (woj !== 'brak' && pow !== 'brak' && gmi === 'brak') {
        console.log(`📝 Znaleziono powiat: ${woj}${pow} - ${nazwa}`);
        
        const powiatCode = woj + pow;
        const powiatData = {
          name: nazwa,
          code: powiatCode,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          wojewodztwoCode: woj,
          wojewodztwo: this.wojewodztwaCache.get(woj),
          isActive: true,
          isVerified: true
        };
        
        this.stats.powiaty++;
        return powiatData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania rekordu powiatu:', error);
      this.stats.errors++;
      return null;
    }
  }

  // TRZECIE PRZEJŚCIE - tylko gminy
  async importGminy() {
    console.log('🏛️  TRZECIE PRZEJŚCIE - Importowanie tylko gmin...');
    
    // Załaduj cache województw i powiatów
    await this.loadWojewodztwaCache();
    await this.loadPowiatyCache();
    
    return new Promise((resolve, reject) => {
      const gminyBatch = [];
      let batchCount = 0;
      
      fs.createReadStream(TERC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', async (row) => {
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
          }
          
          const result = await this.processGminaRow(processedRow);
          if (result) {
            gminyBatch.push(result);
          }
          
          batchCount++;
          
          if (batchCount % this.batchSize === 0) {
            console.log(`⏳ Przetwarzanie gmin batch: ${batchCount}`);
            await this.processBatch(Gmina, gminyBatch);
            gminyBatch.length = 0;
          }
        })
        .on('end', async () => {
          if (gminyBatch.length > 0) {
            await this.processBatch(Gmina, gminyBatch);
          }
          console.log(`✅ Gminy zaimportowane: ${this.stats.gminy} gmin`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Błąd podczas importowania gmin:', error);
          reject(error);
        });
    });
  }

  async processGminaRow(row) {
    try {
      const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
      const pow = row['POW'] || 'brak';
      const gmi = row['GMI'] || 'brak';
      const rodz = row['RODZ'] || 'brak';
      const nazwa = row['NAZWA'] || 'brak';
      const nazwaDod = row['NAZWA_DOD'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // Tylko gminy
      if (woj !== 'brak' && pow !== 'brak' && gmi !== 'brak') {
        console.log(`📝 Znaleziono gminę: ${woj}${pow}${gmi} - ${nazwa} (typ: ${rodz})`);
        
        const gminaCode = woj + pow + gmi;
        const powiatCode = woj + pow;
        
        const gminaData = {
          name: nazwa,
          code: gminaCode,
          rodzaj: rodz,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          wojewodztwoCode: woj,
          powiatCode: powiatCode,
          wojewodztwo: this.wojewodztwaCache.get(woj),
          powiat: this.powiatyCache.get(powiatCode),
          isActive: true,
          isVerified: true
        };
        
        this.stats.gminy++;
        return gminaData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania rekordu gminy:', error);
      this.stats.errors++;
      return null;
    }
  }

  // Cache loading
  async loadWojewodztwaCache() {
    console.log('🔄 Ładowanie cache województw...');
    const wojewodztwa = await Wojewodztwo.find({});
    for (const woj of wojewodztwa) {
      this.wojewodztwaCache.set(woj.code, woj._id);
    }
    console.log(`✅ Załadowano ${this.wojewodztwaCache.size} województw do cache`);
  }

  async loadPowiatyCache() {
    console.log('🔄 Ładowanie cache powiatów...');
    const powiaty = await Powiat.find({});
    for (const pow of powiaty) {
      this.powiatyCache.set(pow.code, pow._id);
    }
    console.log(`✅ Załadowano ${this.powiatyCache.size} powiatów do cache`);
  }

  async loadGminyCache() {
    console.log('🔄 Ładowanie cache gmin...');
    const gminy = await Gmina.find({});
    for (const gmina of gminy) {
      this.gminyCache.set(gmina.code, gmina._id);
    }
    console.log(`✅ Załadowano ${this.gminyCache.size} gmin do cache`);
  }

  // CZWARTE PRZEJŚCIE - miejscowości (SIMC)
  async importMiejscowosci() {
    console.log('🏘️  CZWARTE PRZEJŚCIE - Importowanie miejscowości (SIMC)...');
    
    // ŁADUJEMY cache hierarchii - miejscowości potrzebują referencji!
    await this.loadWojewodztwaCache();
    await this.loadPowiatyCache();
    await this.loadGminyCache();
    
    return new Promise((resolve, reject) => {
      const miejscowosciBatch = [];
      let batchCount = 0;
      
      fs.createReadStream(SIMC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', async (row) => {
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
          }
          
          const result = await this.processMiejscowoscRow(processedRow);
          if (result) {
            miejscowosciBatch.push(result);
          }
          
          batchCount++;
          
          if (batchCount % this.batchSize === 0) {
            console.log(`⏳ Przetwarzanie miejscowości batch: ${batchCount}`);
            await this.processBatch(Miejscowosc, miejscowosciBatch);
            miejscowosciBatch.length = 0;
          }
        })
        .on('end', async () => {
          if (miejscowosciBatch.length > 0) {
            await this.processBatch(Miejscowosc, miejscowosciBatch);
          }
          console.log(`✅ Miejscowości zaimportowane: ${this.stats.miejscowosci} miejscowości`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Błąd podczas importowania miejscowości:', error);
          reject(error);
        });
    });
  }

  async processMiejscowoscRow(row) {
    try {
      const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
      const pow = row['POW'] || 'brak';
      const gmi = row['GMI'] || 'brak';
      const rodzGmi = row['RODZ_GMI'] || 'brak';
      const rm = row['RM'] || 'brak';
      const mz = row['MZ'] || 'brak';
      const nazwa = row['NAZWA'] || 'brak';
      const sym = row['SYM'] || 'brak';
      const symPod = row['SYMPOD'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // Sprawdź czy to miejscowość (nie puste pola)
      if (woj !== 'brak' && pow !== 'brak' && gmi !== 'brak' && sym !== 'brak') {
        console.log(`📝 Znaleziono miejscowość: ${sym} - ${nazwa}`);
        
        const gminaCode = woj + pow + gmi;
        const powiatCode = woj + pow;
        
        const miejscowoscData = {
          name: nazwa,
          code: sym,
          rodzaj: rm, // Rodzaj miejscowości
          nazwaDodatkowa: mz, // Miejscowość zależna
          stanNa: stanNa,
          wojewodztwoCode: woj,
          powiatCode: powiatCode,
          gminaCode: gminaCode,
          // DODAJEMY referencje do hierarchii!
          wojewodztwo: this.wojewodztwaCache.get(woj),
          powiat: this.powiatyCache.get(powiatCode),
          gmina: this.gminyCache.get(gminaCode),
          isActive: true,
          isVerified: true
        };
        
        this.stats.miejscowosci++;
        return miejscowoscData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania rekordu miejscowości:', error);
      this.stats.errors++;
      return null;
    }
  }

  async run(options = {}) {
    try {
      const { 
        clearDb = false, 
        importWojewodztwa = false, 
        importPowiaty = false, 
        importGminy = false,
        importMiejscowosci = true
      } = options;
      
      console.log('🚀 Rozpoczynam import danych GUS (osobne przejścia)...');
      console.log(`📋 Opcje: clearDb=${clearDb}, wojewodztwa=${importWojewodztwa}, powiaty=${importPowiaty}, gminy=${importGminy}, miejscowosci=${importMiejscowosci}`);
      
      await this.connect();
      
      if (clearDb) {
        await this.clearDatabase();
      }
      
      if (importWojewodztwa) {
        // PIERWSZE PRZEJŚCIE - województwa
        await this.importWojewodztwa();
      }
      
      if (importPowiaty) {
        // DRUGIE PRZEJŚCIE - powiaty
        await this.importPowiaty();
      }
      
      if (importGminy) {
        // TRZECIE PRZEJŚCIE - gminy
        await this.importGminy();
      }
      
      if (importMiejscowosci) {
        // CZWARTE PRZEJŚCIE - miejscowości
        await this.importMiejscowosci();
      }
      
      console.log('\n📊 PODSUMOWANIE IMPORTU:');
      console.log(`✅ Województwa: ${this.stats.wojewodztwa}`);
      console.log(`✅ Powiaty: ${this.stats.powiaty}`);
      console.log(`✅ Gminy: ${this.stats.gminy}`);
      console.log(`✅ Miejscowości: ${this.stats.miejscowosci}`);
      console.log(`⚠️  Pominięte: ${this.stats.skipped}`);
      console.log(`❌ Błędy: ${this.stats.errors}`);
      
      console.log('\n🎉 Import zakończony pomyślnie!');
      
    } catch (error) {
      console.error('❌ Błąd podczas importu:', error);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Rozłączono z MongoDB');
    }
  }
}

// Uruchom import
const importer = new GusDataImporterSeparate();

// Sprawdź argumenty linii komend
const args = process.argv.slice(2);
const command = args[0];

if (command === 'full') {
  // Pełny import (dla serwera)
  console.log('🔄 Pełny import wszystkich danych...');
  importer.run({ 
    clearDb: true, 
    importWojewodztwa: true, 
    importPowiaty: true, 
    importGminy: true,
    importMiejscowosci: true
  });
} else if (command === 'gminy') {
  // Tylko gminy
  console.log('🔄 Import tylko gmin...');
  importer.run({ 
    clearDb: false, 
    importWojewodztwa: false, 
    importPowiaty: false, 
    importGminy: true,
    importMiejscowosci: false
  });
} else if (command === 'miejscowosci') {
  // Tylko miejscowości
  console.log('🔄 Import tylko miejscowości...');
  importer.run({ 
    clearDb: false, 
    importWojewodztwa: false, 
    importPowiaty: false, 
    importGminy: false,
    importMiejscowosci: true
  });
} else {
  // Domyślnie tylko miejscowości
  console.log('🔄 Import tylko miejscowości (domyślnie)...');
  console.log('💡 Użyj: node importGusDataSeparate.js full - dla pełnego importu');
  console.log('💡 Użyj: node importGusDataSeparate.js gminy - dla importu tylko gmin');
  console.log('💡 Użyj: node importGusDataSeparate.js miejscowosci - dla importu tylko miejscowości');
  importer.run({ 
    clearDb: false, 
    importWojewodztwa: false, 
    importPowiaty: false, 
    importGminy: false,
    importMiejscowosci: true
  });
} 