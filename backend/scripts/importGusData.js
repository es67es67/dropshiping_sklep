const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Import nowych modeli
const Wojewodztwo = require('../models/wojewodztwoModel');
const Powiat = require('../models/powiatModel');
const Gmina = require('../models/gminaModel');
const Miejscowosc = require('../models/miejscowoscModel');
const Ulic = require('../models/ulicModel');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Ścieżki do plików CSV
const DATA_DIR = path.join(__dirname, '../../inne/dane adresowe gus');
const TERC_FILE = path.join(DATA_DIR, 'TERC_Adresowy_2025-07-07.csv');
const SIMC_FILE = path.join(DATA_DIR, 'SIMC_Adresowy_2025-07-07.csv');
const ULIC_FILE = path.join(DATA_DIR, 'ULIC_Adresowy_2025-07-07.csv');

// Funkcja do opóźnienia (przyjazna dla limitów MongoDB Atlas)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GusDataImporter {
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
    
    this.batchSize = 50; // Mniejszy batch size dla MongoDB Atlas
    
    // Ścieżki do plików CSV
    this.TERC_FILE = TERC_FILE;
    this.SIMC_FILE = SIMC_FILE;
    this.ULIC_FILE = ULIC_FILE;
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

  // Batch processing dla MongoDB Atlas
  async processBatch(model, documents) {
    try {
      console.log(`🗄️  Zapisuję do bazy ${documents.length} dokumentów typu ${model.modelName}`);
      console.log(`📋 Przykładowe dokumenty:`);
      documents.slice(0, 3).forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.name} (kod: ${doc.code})`);
      });
      
      await model.insertMany(documents, { ordered: false });
      console.log(`✅ Pomyślnie zapisano ${documents.length} dokumentów typu ${model.modelName}`);
      await delay(100); // Krótkie opóźnienie między batchami
    } catch (error) {
      console.error(`❌ Błąd batch processing dla ${model.modelName}:`, error.message);
      console.error(`📋 Dokumenty które spowodowały błąd:`);
      documents.forEach((doc, index) => {
        console.error(`   ${index + 1}. ${doc.name} (kod: ${doc.code})`);
      });
      
      // Fallback - zapisz pojedynczo
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

  async importTerc() {
    console.log('🏛️  Importowanie TERC (województwa, powiaty, gminy)...');
    
    return new Promise((resolve, reject) => {
      const wojewodztwaBatch = [];
      const powiatyBatch = [];
      const gminyBatch = [];
      let batchCount = 0;
      
      fs.createReadStream(this.TERC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', async (row) => {
          // Obsługuj puste pola - zamień puste stringi na "brak"
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
          }
          
          const result = await this.processTercRow(processedRow);
          if (result) {
            if (result.type === 'wojewodztwo') {
              wojewodztwaBatch.push(result.data);
              console.log(`📝 Dodano województwo: ${result.data.code} - ${result.data.name}`);
            } else if (result.type === 'powiat') {
              powiatyBatch.push(result.data);
              console.log(`📝 Dodano powiat: ${result.data.code} - ${result.data.name}`);
            } else if (result.type === 'gmina') {
              gminyBatch.push(result.data);
              console.log(`📝 Dodano gminę: ${result.data.code} - ${result.data.name}`);
            }
          }
          
          batchCount++;
          
          if (batchCount % this.batchSize === 0) {
            console.log(`⏳ Przetwarzanie TERC batch: ${batchCount}`);
            console.log(`   Województwa w batch: ${wojewodztwaBatch.length}`);
            console.log(`   Powiaty w batch: ${powiatyBatch.length}`);
            console.log(`   Gminy w batch: ${gminyBatch.length}`);
            await this.processTercBatches(wojewodztwaBatch, powiatyBatch, gminyBatch);
            wojewodztwaBatch.length = 0;
            powiatyBatch.length = 0;
            gminyBatch.length = 0;
          }
        })
        .on('end', async () => {
          if (wojewodztwaBatch.length > 0 || powiatyBatch.length > 0 || gminyBatch.length > 0) {
            await this.processTercBatches(wojewodztwaBatch, powiatyBatch, gminyBatch);
          }
          console.log(`✅ TERC zaimportowany: ${this.stats.wojewodztwa} województw, ${this.stats.powiaty} powiatów, ${this.stats.gminy} gmin`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Błąd podczas importowania TERC:', error);
          reject(error);
        });
    });
  }

  async processTercBatches(wojewodztwaBatch, powiatyBatch, gminyBatch) {
    try {
      // Najpierw zapisz województwa
      if (wojewodztwaBatch.length > 0) {
        await this.processBatch(Wojewodztwo, wojewodztwaBatch);
        // Zaktualizuj cache województw
        for (const woj of wojewodztwaBatch) {
          const savedWoj = await Wojewodztwo.findByCode(woj.code);
          if (savedWoj) {
            this.wojewodztwaCache.set(woj.code, savedWoj._id);
          }
        }
      }
      
      // Następnie zapisz powiaty
      if (powiatyBatch.length > 0) {
        await this.processBatch(Powiat, powiatyBatch);
        // Zaktualizuj cache powiatów
        for (const pow of powiatyBatch) {
          const savedPow = await Powiat.findByCode(pow.code);
          if (savedPow) {
            this.powiatyCache.set(pow.code, savedPow._id);
          }
        }
      }
      
      // Na końcu zapisz gminy
      if (gminyBatch.length > 0) {
        await this.processBatch(Gmina, gminyBatch);
        // Zaktualizuj cache gmin
        for (const gmi of gminyBatch) {
          const savedGmi = await Gmina.findByCode(gmi.code);
          if (savedGmi) {
            this.gminyCache.set(gmi.code, savedGmi._id);
          }
        }
      }
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania batch TERC:', error);
    }
  }

  async processTercRow(row) {
    try {
      // Popraw parsowanie - obsługuj BOM w kluczach
      const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
      const pow = row['POW'] || 'brak';
      const gmi = row['GMI'] || 'brak';
      const rodz = row['RODZ'] || 'brak';
      const nazwa = row['NAZWA'] || 'brak';
      const nazwaDod = row['NAZWA_DOD'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // DEBUG: Wyświetl surowe dane z CSV (tylko pierwsze 10 rekordów)
      if (this.stats.wojewodztwa + this.stats.powiaty + this.stats.gminy < 10) {
        console.log('🔍 DEBUG - Surowe dane TERC:', {
          WOJ: woj,
          POW: pow,
          GMI: gmi,
          RODZ: rodz,
          NAZWA: nazwa,
          NAZWA_DOD: nazwaDod,
          STAN_NA: stanNa
        });
      }
      
      // Określ typ jednostki na podstawie pustych pól
      if (woj !== 'brak' && pow === 'brak' && gmi === 'brak') {
        // Województwo
        const wojewodztwoData = {
          name: nazwa,
          code: woj,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          isActive: true,
          isVerified: true
        };
        
        this.stats.wojewodztwa++;
        return { type: 'wojewodztwo', data: wojewodztwoData };
        
      } else if (woj !== 'brak' && pow !== 'brak' && gmi === 'brak') {
        // Powiat
        const powiatCode = woj + pow;
        const powiatData = {
          name: nazwa,
          code: powiatCode,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          wojewodztwoCode: woj,
          wojewodztwo: this.wojewodztwaCache.get(woj), // Referencja do województwa
          isActive: true,
          isVerified: true
        };
        
        this.stats.powiaty++;
        return { type: 'powiat', data: powiatData };
        
      } else if (woj !== 'brak' && pow !== 'brak' && gmi !== 'brak') {
        // Gmina
        const gminaCode = woj + pow + gmi;
        const powiatCode = woj + pow;
        
        // Gminy mogą mieć ten sam kod TERC ale różne typy (miejskie, wiejske, miejsko-wiejskie)
        // MongoDB automatycznie obsłuży duplikaty przez indeks unique
        
        const gminaData = {
          name: nazwa,
          code: gminaCode,
          rodzaj: rodz,
          nazwaDodatkowa: nazwaDod,
          stanNa: stanNa,
          wojewodztwoCode: woj,
          powiatCode: powiatCode,
          wojewodztwo: this.wojewodztwaCache.get(woj), // Referencja do województwa
          powiat: this.powiatyCache.get(powiatCode), // Referencja do powiatu
          isActive: true,
          isVerified: true
        };
        
        this.stats.gminy++;
        return { type: 'gmina', data: gminaData };
      }
      
      console.log(`⚠️  Pominięto rekord TERC - nieznany typ: ${nazwa}`);
      this.stats.skipped++;
      return null;
      
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania rekordu TERC:', error);
      this.stats.errors++;
      return null;
    }
  }

  async importSimc() {
    console.log('🏘️  Importowanie SIMC (miejscowości)...');
    
    return new Promise((resolve, reject) => {
      const miejscowosciBatch = [];
      let batchCount = 0;
      
      fs.createReadStream(this.SIMC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', async (row) => {
          // Obsługuj puste pola - zamień puste stringi na "brak"
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
          }
          
          const result = await this.processSimcRow(processedRow);
          if (result && result.type === 'miejscowosc') {
            miejscowosciBatch.push(result.data);
          }
          
          batchCount++;
          
          if (batchCount % this.batchSize === 0) {
            console.log(`⏳ Przetwarzanie SIMC batch: ${batchCount}`);
            await this.processSimcBatches([], [], miejscowosciBatch);
            miejscowosciBatch.length = 0;
          }
        })
        .on('end', async () => {
          if (miejscowosciBatch.length > 0) {
            await this.processSimcBatches([], [], miejscowosciBatch);
          }
          console.log(`✅ SIMC zaimportowany: ${this.stats.miejscowosci} miejscowości`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Błąd podczas importowania SIMC:', error);
          reject(error);
        });
    });
  }

  async processSimcBatches(wojewodztwaBatch, powiatyBatch, miejscowosciBatch) {
    try {
      // Plik SIMC zawiera tylko miejscowości - przetwarzaj tylko miejscowości
      if (miejscowosciBatch.length > 0) {
        await this.processBatch(Miejscowosc, miejscowosciBatch);
        // Zaktualizuj cache miejscowości
        for (const miejsc of miejscowosciBatch) {
          const savedMiejsc = await Miejscowosc.findByCode(miejsc.code);
          if (savedMiejsc) {
            this.miejscowosciCache.set(miejsc.code, savedMiejsc._id);
          }
        }
      }
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania batch SIMC:', error);
    }
  }

  async processSimcRow(row) {
    try {
      // Popraw parsowanie - obsługuj BOM w kluczach
      const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
      const pow = row['POW'] || 'brak';
      const gmi = row['GMI'] || 'brak';
      const rodz = row['RODZ'] || 'brak';
      const sym = row['SYM'] || 'brak';
      const nazwa = row['NAZWA'] || 'brak';
      const nazwaDod = row['NAZWA_DOD'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // DEBUG: Wyświetl surowe dane z CSV (tylko pierwsze 10 rekordów)
      if (this.stats.miejscowosci < 10) {
        console.log('🔍 DEBUG - Surowe dane SIMC:', {
          WOJ: woj,
          POW: pow,
          GMI: gmi,
          RODZ: rodz,
          SYM: sym,
          NAZWA: nazwa,
          NAZWA_DOD: nazwaDod,
          STAN_NA: stanNa
        });
      }
      
      // Plik SIMC zawiera tylko miejscowości - każdy wiersz to miejscowość
      // Walidacja - sprawdź czy ma wszystkie wymagane pola
      if (woj === 'brak' || pow === 'brak' || gmi === 'brak' || sym === 'brak') {
        console.log(`⚠️  Pominięto rekord SIMC - brak wymaganych pól: ${nazwa}`);
        this.stats.skipped++;
        return null;
      }
      
      // Miejscowość
      const gminaCode = woj + pow + gmi;
      const powiatCode = woj + pow;
      
      const miejscowoscData = {
        name: nazwa,
        code: sym,
        rodzaj: rodz,
        nazwaDodatkowa: nazwaDod,
        stanNa: stanNa,
        wojewodztwoCode: woj,
        powiatCode: powiatCode,
        gminaCode: gminaCode,
        wojewodztwo: this.wojewodztwaCache.get(woj), // Referencja do województwa
        powiat: this.powiatyCache.get(powiatCode), // Referencja do powiatu
        gmina: this.gminyCache.get(gminaCode), // Referencja do gminy
        isActive: true,
        isVerified: true
      };
      
      this.stats.miejscowosci++;
      return { type: 'miejscowosc', data: miejscowoscData };
      
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania rekordu SIMC:', error);
      this.stats.errors++;
      return null;
    }
  }

  async importUlic() {
    console.log('🛣️  Importowanie ULIC (ulice)...');
    
    return new Promise((resolve, reject) => {
      const results = [];
      let batchCount = 0;
      
      fs.createReadStream(this.ULIC_FILE)
        .pipe(csv({ 
          separator: ';',
          strict: false,
          skipEmptyLines: true
        }))
        .on('data', async (row) => {
          // Obsługuj puste pola - zamień puste stringi na "brak"
          const processedRow = {};
          for (const [key, value] of Object.entries(row)) {
            processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
          }
          
          results.push(processedRow);
          batchCount++;
          
          if (batchCount % this.batchSize === 0) {
            console.log(`⏳ Przetwarzanie ULIC batch: ${batchCount}`);
            await this.processUlicBatch(results);
            results.length = 0;
          }
        })
        .on('end', async () => {
          if (results.length > 0) {
            await this.processUlicBatch(results);
          }
          console.log(`✅ ULIC zaimportowany: ${this.stats.ulice} ulic`);
          resolve();
        })
        .on('error', (error) => {
          console.error('❌ Błąd podczas importowania ULIC:', error);
          reject(error);
        });
    });
  }

  async processUlicBatch(rows) {
    try {
      for (const row of rows) {
        await this.processUlicRow(row);
      }
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania batch ULIC:', error);
      // Fallback - przetwarzaj pojedynczo
      for (const row of rows) {
        try {
          await this.processUlicRow(row);
        } catch (singleError) {
          console.error('❌ Błąd pojedynczego rekordu ULIC:', singleError);
          this.stats.errors++;
        }
      }
    }
  }

  async processUlicRow(row) {
    try {
      // Popraw parsowanie - obsługuj BOM w kluczach
      const woj = row['\uFEFFWOJ'] || row['WOJ'] || 'brak';
      const pow = row['POW'] || 'brak';
      const gmi = row['GMI'] || 'brak';
      const rodzGmi = row['RODZ_GMI'] || 'brak';
      const sym = row['SYM'] || 'brak';
      const symUlic = row['SYM_UL'] || 'brak';
      const cecha = row['CECHA'] || 'brak';
      const nazwa1 = row['NAZWA_1'] || 'brak';
      const nazwa2 = row['NAZWA_2'] || 'brak';
      const stanNa = row['STAN_NA'] || 'brak';
      
      // DEBUG: Wyświetl surowe dane z CSV (tylko pierwsze 10 rekordów)
      if (this.stats.ulice < 10) {
        console.log('🔍 DEBUG - Surowe dane ULIC:', {
          WOJ: woj,
          POW: pow,
          GMI: gmi,
          RODZ_GMI: rodzGmi,
          SYM: sym,
          SYM_UL: symUlic,
          CECHA: cecha,
          NAZWA_1: nazwa1,
          NAZWA_2: nazwa2,
          STAN_NA: stanNa
        });
      }
      
      // ULIC nie sprawdzamy duplikatów - kod ULIC może się powtarzać w różnych miejscowościach
      
      // Przygotuj pełną nazwę ulicy
      let fullName = nazwa1;
      if (nazwa2 !== 'brak' && nazwa2.trim() !== '') {
        fullName += ' ' + nazwa2;
      }
      
      // Przygotuj dane ulicy
      const gminaCode = woj + pow + gmi;
      const powiatCode = woj + pow;
      
      const ulicData = {
        name: fullName,
        code: symUlic,
        type: 'ulica',
        woj: woj,
        pow: pow,
        gmi: gmi,
        rodzGmi: rodzGmi,
        sym: sym,
        symUlic: symUlic,
        cecha: cecha,
        nazwa1: nazwa1,
        nazwa2: nazwa2,
        stanNa: stanNa,
        wojewodztwoCode: woj,
        powiatCode: powiatCode,
        gminaCode: gminaCode,
        tercCode: gminaCode,
        simcCode: sym,
        rodzaj: cecha,
        wojewodztwo: this.wojewodztwaCache.get(woj), // Referencja do województwa
        powiat: this.powiatyCache.get(powiatCode), // Referencja do powiatu
        gmina: this.gminyCache.get(gminaCode), // Referencja do gminy
        miejscowosc: this.miejscowosciCache.get(sym), // Referencja do miejscowości
        isActive: true,
        isVerified: true
      };
      
      // Zapisz ulicę
      const newUlic = new Ulic(ulicData);
      await newUlic.save();
      
      this.stats.ulice++;
      
    } catch (error) {
      console.error('❌ Błąd podczas przetwarzania rekordu ULIC:', error);
      this.stats.errors++;
    }
  }

  async run() {
    try {
      console.log('🚀 Rozpoczynam import danych GUS...');
      
      await this.connect();
      await this.clearDatabase();
      
      // Import TERC (województwa, powiaty, gminy)
      await this.importTerc();
      
      // Import SIMC (miejscowości)
      await this.importSimc();
      
      // Import ULIC (ulice)
      await this.importUlic();
      
      console.log('\n📊 PODSUMOWANIE IMPORTU:');
      console.log(`✅ Województwa: ${this.stats.wojewodztwa}`);
      console.log(`✅ Powiaty: ${this.stats.powiaty}`);
      console.log(`✅ Gminy: ${this.stats.gminy}`);
      console.log(`✅ Miejscowości: ${this.stats.miejscowosci}`);
      console.log(`✅ Ulice: ${this.stats.ulice}`);
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
const importer = new GusDataImporter();
importer.run(); 
module.exports = GusDataImporter; 