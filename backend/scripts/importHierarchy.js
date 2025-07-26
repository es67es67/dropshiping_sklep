const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Modele
const Wojewodztwo = require('../models/wojewodztwoModel');
const Powiat = require('../models/powiatModel');
const Gmina = require('../models/gminaModel');

// Konfiguracja
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
const TERC_FILE = path.join(__dirname, '../../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class HierarchyImporter {
  constructor() {
    this.stats = {
      wojewodztwa: 0,
      powiaty: 0,
      gminy: 0,
      errors: 0,
      skipped: 0
    };
    
    // Cache dla hierarchii
    this.wojewodztwaCache = new Map(); // code -> ObjectId
    this.powiatyCache = new Map(); // code -> ObjectId
    
    this.batchSize = 50;
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
      console.log('✅ Baza danych wyczyszczona');
    } catch (error) {
      console.error('❌ Błąd czyszczenia bazy:', error);
      throw error;
    }
  }

  // Batch processing
  async processBatch(model, documents) {
    try {
      console.log(`🗄️  Zapisuję do bazy ${documents.length} dokumentów typu ${model.modelName}`);
      if (documents.length > 0) {
        console.log(`📋 Przykładowe dokumenty:`);
        documents.slice(0, 3).forEach((doc, index) => {
          console.log(`   ${index + 1}. ${doc.name} (kod: ${doc.code})`);
        });
      }
      
      await model.insertMany(documents, { ordered: false });
      console.log(`✅ Pomyślnie zapisano ${documents.length} dokumentów typu ${model.modelName}`);
      await delay(100);
    } catch (error) {
      console.error(`❌ Błąd batch processing dla ${model.modelName}:`, error.message);
      
      // Fallback - zapisz pojedynczo
      console.log(`🔄 Próbuję zapisać pojedynczo...`);
      for (const doc of documents) {
        try {
          await new model(doc).save();
          await delay(10);
        } catch (err) {
          console.error(`❌ Błąd pojedynczego dokumentu ${doc.name} (${doc.code}):`, err.message);
          this.stats.errors++;
        }
      }
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
        
        const wojewodztwoId = this.wojewodztwaCache.get(woj);
        if (!wojewodztwoId) {
          console.log(`⚠️  Nie znaleziono województwa dla kodu ${woj}, pomijam powiat ${nazwa}`);
          this.stats.skipped++;
          return null;
        }
        
        const powiatData = {
          name: nazwa,
          code: woj + pow,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          wojewodztwo: wojewodztwoId, // REFERENCJA do województwa
          wojewodztwoCode: woj, // DODANE!
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
      const rodzGmi = row['RODZ_GMI'] || 'brak';
      const nazwa = row['NAZWA'] || 'brak';
      const nazwaDod = row['NAZWA_DOD'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // Tylko gminy
      if (woj !== 'brak' && pow !== 'brak' && gmi !== 'brak') {
        console.log(`📝 Znaleziono gminę: ${woj}${pow}${gmi} - ${nazwa}`);
        
        const wojewodztwoId = this.wojewodztwaCache.get(woj);
        const powiatId = this.powiatyCache.get(woj + pow);
        
        if (!wojewodztwoId) {
          console.log(`⚠️  Nie znaleziono województwa dla kodu ${woj}, pomijam gminę ${nazwa}`);
          this.stats.skipped++;
          return null;
        }
        
        if (!powiatId) {
          console.log(`⚠️  Nie znaleziono powiatu dla kodu ${woj}${pow}, pomijam gminę ${nazwa}`);
          this.stats.skipped++;
          return null;
        }
        
        const gminaData = {
          name: nazwa,
          code: woj + pow + gmi,
          rodzaj: rodzGmi,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          wojewodztwo: wojewodztwoId, // REFERENCJA do województwa
          powiat: powiatId, // REFERENCJA do powiatu
          wojewodztwoCode: woj, // DODANE!
          powiatCode: woj + pow, // DODANE!
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

  async loadWojewodztwaCache() {
    console.log('🔄 Ładowanie cache województw...');
    const wojewodztwa = await Wojewodztwo.find({}, '_id code');
    wojewodztwa.forEach(woj => {
      this.wojewodztwaCache.set(woj.code, woj._id);
    });
    console.log(`✅ Załadowano ${this.wojewodztwaCache.size} województw do cache`);
  }

  async loadPowiatyCache() {
    console.log('🔄 Ładowanie cache powiatów...');
    const powiaty = await Powiat.find({}, '_id code');
    powiaty.forEach(pow => {
      this.powiatyCache.set(pow.code, pow._id);
    });
    console.log(`✅ Załadowano ${this.powiatyCache.size} powiatów do cache`);
  }

  async run() {
    try {
      console.log('🚀 Rozpoczynam import hierarchii (województwa, powiaty, gminy)...');
      
      await this.connect();
      
      // Wyczyść bazę
      await this.clearDatabase();
      
      // PIERWSZE PRZEJŚCIE - województwa
      await this.importWojewodztwa();
      
      // DRUGIE PRZEJŚCIE - powiaty
      await this.importPowiaty();
      
      // TRZECIE PRZEJŚCIE - gminy
      await this.importGminy();
      
      console.log('\n📊 PODSUMOWANIE IMPORTU HIERARCHII:');
      console.log(`✅ Województwa: ${this.stats.wojewodztwa}`);
      console.log(`✅ Powiaty: ${this.stats.powiaty}`);
      console.log(`✅ Gminy: ${this.stats.gminy}`);
      console.log(`⚠️  Pominięte: ${this.stats.skipped}`);
      console.log(`❌ Błędy: ${this.stats.errors}`);
      
      console.log('\n🎉 Import hierarchii zakończony pomyślnie!');
      console.log('💡 Teraz możesz uruchomić import miejscowości z referencjami!');
      
    } catch (error) {
      console.error('❌ Błąd podczas importu hierarchii:', error);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Rozłączono z MongoDB');
    }
  }
}

// Uruchom import
const importer = new HierarchyImporter();
importer.run(); 