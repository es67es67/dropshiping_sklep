const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Location = require('../models/locationModel');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Ścieżki do plików CSV
const DATA_DIR = path.join(__dirname, '../../dane adresowe gus');
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
    this.locationCache = new Map(); // Cache dla szybkiego wyszukiwania
    this.hierarchyCache = new Map(); // Cache dla hierarchii
    this.batchSize = 50; // Mniejszy batch size dla MongoDB Atlas
  }

  // Generuje unikalne ID dla każdego wpisu
  generateUniqueId(type, code, name) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${type}_${code}_${timestamp}_${random}`;
  }

  async connect() {
    try {
      await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10, // Ogranicz liczbę połączeń
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
      await Location.deleteMany({});
      console.log('✅ Baza danych wyczyszczona');
    } catch (error) {
      console.error('❌ Błąd czyszczenia bazy:', error);
      throw error;
    }
  }

  // Batch processing dla MongoDB Atlas
  async processBatch(locations) {
    try {
      await Location.insertMany(locations, { ordered: false });
      await delay(100); // Krótkie opóźnienie między batchami
    } catch (error) {
      console.error('❌ Błąd batch processing:', error.message);
      // Fallback - zapisz pojedynczo
      for (const location of locations) {
        try {
          await new Location(location).save();
          await delay(10);
        } catch (err) {
          this.stats.errors++;
        }
      }
    }
  }

  async importTerc() {
    console.log('📋 Importowanie TERC (województwa, powiaty, gminy)...');
    
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(TERC_FILE)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            console.log(`📊 Znaleziono ${results.length} rekordów TERC`);
            
            // Przetwarzaj w batchach
            const batches = [];
            for (let i = 0; i < results.length; i += this.batchSize) {
              batches.push(results.slice(i, i + this.batchSize));
            }
            
            for (let i = 0; i < batches.length; i++) {
              console.log(`⏳ Przetwarzanie TERC batch: ${i + 1}/${batches.length}`);
              const batch = batches[i];
              
              for (const row of batch) {
                await this.processTercRow(row);
              }
              
              // Opóźnienie między batchami
              if (i < batches.length - 1) {
                await delay(200);
              }
            }
            
            console.log(`✅ TERC zaimportowany: ${this.stats.wojewodztwa} województw, ${this.stats.powiaty} powiatów, ${this.stats.gminy} gmin`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  async processTercRow(row) {
    try {
      const wojewodztwo = row['WOJ'];
      const powiat = row['POW'];
      const gmina = row['GMI'];
      const nazwa = row['NAZWA'];
      const nazwaDodatkowa = row['NAZWA_DOD'];
      const rodzaj = row['RODZ'];
      
      // Sprawdź czy nazwa nie jest pusta
      if (!nazwa || nazwa.trim() === '') {
        this.stats.skipped++;
        return;
      }
      
      const cleanName = nazwa.trim();
      
      // Województwo
      if (powiat === '' && gmina === '') {
        const uniqueId = this.generateUniqueId('woj', wojewodztwo, cleanName);
        const location = new Location({
          uniqueId: uniqueId,
          name: cleanName,
          type: 'województwo',
          code: wojewodztwo,
          parentLocation: null,
          wojewodztwo: null,
          powiat: null,
          gmina: null,
          population: 0,
          coordinates: null,
          isActive: true,
          isVerified: true
        });
        const savedLocation = await location.save();
        this.locationCache.set(`woj_${wojewodztwo}`, savedLocation._id);
        this.hierarchyCache.set(`woj_${wojewodztwo}`, savedLocation._id);
        this.stats.wojewodztwa++;
        await delay(10); // Krótkie opóźnienie
      }
      // Powiat
      else if (gmina === '' && powiat !== '') {
        const uniqueId = this.generateUniqueId('pow', `${wojewodztwo}${powiat}`, cleanName);
        const wojewodztwoId = this.locationCache.get(`woj_${wojewodztwo}`);
        const location = new Location({
          uniqueId: uniqueId,
          name: cleanName,
          type: 'powiat',
          code: `${wojewodztwo}${powiat}`,
          parentLocation: wojewodztwoId,
          wojewodztwo: wojewodztwoId,
          powiat: null,
          gmina: null,
          population: 0,
          coordinates: null,
          isActive: true,
          isVerified: true
        });
        const savedLocation = await location.save();
        this.locationCache.set(`pow_${wojewodztwo}${powiat}`, savedLocation._id);
        this.hierarchyCache.set(`pow_${wojewodztwo}${powiat}`, savedLocation._id);
        this.stats.powiaty++;
        await delay(10);
      }
      // Gmina
      else if (gmina !== '') {
        const uniqueId = this.generateUniqueId('gmi', `${wojewodztwo}${powiat}${gmina}`, cleanName);
        const wojewodztwoId = this.locationCache.get(`woj_${wojewodztwo}`);
        const powiatId = this.locationCache.get(`pow_${wojewodztwo}${powiat}`);
        const location = new Location({
          uniqueId: uniqueId,
          name: cleanName,
          type: 'gmina',
          code: `${wojewodztwo}${powiat}${gmina}`,
          parentLocation: powiatId,
          wojewodztwo: wojewodztwoId,
          powiat: powiatId,
          gmina: null,
          population: 0,
          coordinates: null,
          isActive: true,
          isVerified: true
        });
        const savedLocation = await location.save();
        this.locationCache.set(`gmi_${wojewodztwo}${powiat}${gmina}`, savedLocation._id);
        this.hierarchyCache.set(`gmi_${wojewodztwo}${powiat}${gmina}`, savedLocation._id);
        this.stats.gminy++;
        await delay(10);
      }
    } catch (error) {
      this.stats.errors++;
      console.error('❌ Błąd przetwarzania TERC:', error.message);
    }
  }

  async importSimc() {
    console.log('🏘️  Importowanie SIMC (miejscowości)...');
    
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(SIMC_FILE)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            console.log(`📊 Znaleziono ${results.length} rekordów SIMC`);
            
            // Przetwarzaj w batchach
            const batches = [];
            for (let i = 0; i < results.length; i += this.batchSize) {
              batches.push(results.slice(i, i + this.batchSize));
            }
            
            for (let i = 0; i < batches.length; i++) {
              console.log(`⏳ Przetwarzanie SIMC batch: ${i + 1}/${batches.length}`);
              const batch = batches[i];
              
              for (const row of batch) {
                await this.processSimcRow(row);
              }
              
              // Opóźnienie między batchami
              if (i < batches.length - 1) {
                await delay(200);
              }
            }
            
            console.log(`✅ SIMC zaimportowany: ${this.stats.miejscowosci} miejscowości`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  async processSimcRow(row) {
    try {
      const wojewodztwo = row['WOJ'];
      const powiat = row['POW'];
      const gmina = row['GMI'];
      const miejscowosc = row['RM'];
      const nazwa = row['NAZWA'];
      const symNumer = row['SYM'];
      const symPod = row['SYMPOD'];
      const rodzaj = row['RODZ_GMI'];
      
      // Sprawdź czy nazwa nie jest pusta
      if (!nazwa || nazwa.trim() === '') {
        this.stats.skipped++;
        return;
      }
      
      // Tylko główne miejscowości (bez części)
      if (miejscowosc === '01') {
        const cleanName = nazwa.trim();
        const uniqueId = this.generateUniqueId('miej', symNumer, cleanName);
        const wojewodztwoId = this.locationCache.get(`woj_${wojewodztwo}`);
        const powiatId = this.locationCache.get(`pow_${wojewodztwo}${powiat}`);
        const gminaId = this.locationCache.get(`gmi_${wojewodztwo}${powiat}${gmina}`);
        
        const location = new Location({
          uniqueId: uniqueId,
          name: cleanName,
          type: 'miejscowość',
          code: symNumer,
          parentLocation: gminaId,
          wojewodztwo: wojewodztwoId,
          powiat: powiatId,
          gmina: gminaId,
          population: 0,
          coordinates: null,
          isActive: true,
          isVerified: true
        });
        await location.save();
        this.stats.miejscowosci++;
        await delay(10);
      }
    } catch (error) {
      this.stats.errors++;
      console.error('❌ Błąd przetwarzania SIMC:', error.message);
    }
  }

  async importUlic() {
    console.log('🛣️  Importowanie ULIC (ulice)...');
    
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(ULIC_FILE)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          try {
            console.log(`📊 Znaleziono ${results.length} rekordów ULIC`);
            for (let i = 0; i < results.length; i++) {
              if (i % 1000 === 0) {
                console.log(`⏳ Przetwarzanie ULIC: ${i}/${results.length}`);
              }
              await this.processUlicRow(results[i]);
            }
            console.log(`✅ ULIC zaimportowany: ${this.stats.ulice} ulic`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  async processUlicRow(row) {
    try {
      const wojewodztwo = row['WOJ'];
      const powiat = row['POW'];
      const gmina = row['GMI'];
      const symNumer = row['SYM'];
      const nazwa = row['NAZWA_1'];
      const nazwa2 = row['NAZWA_2'];
      const cecha = row['CECHA'];
      const symUlic = row['SYM_UL'];
      
      // Sprawdź czy nazwa nie jest pusta
      if (!nazwa || nazwa.trim() === '') {
        this.stats.skipped++;
        return;
      }
      
      // Pełna nazwa ulicy
      let fullName = nazwa.trim();
      if (cecha && cecha.trim()) {
        fullName = `${cecha.trim()} ${fullName}`;
      }
      if (nazwa2 && nazwa2.trim()) {
        fullName += ` ${nazwa2.trim()}`;
      }
      
      const uniqueId = this.generateUniqueId('ul', symUlic, fullName);
      const wojewodztwoId = this.locationCache.get(`woj_${wojewodztwo}`);
      const powiatId = this.locationCache.get(`pow_${wojewodztwo}${powiat}`);
      const gminaId = this.locationCache.get(`gmi_${wojewodztwo}${powiat}${gmina}`);
      
      const location = new Location({
        uniqueId: uniqueId,
        name: fullName,
        type: 'ulica',
        code: symUlic,
        parentLocation: gminaId, // Ulica należy do gminy
        wojewodztwo: wojewodztwoId,
        powiat: powiatId,
        gmina: gminaId,
        population: 0,
        coordinates: null,
        isActive: true,
        isVerified: true
      });
      await location.save();
      this.stats.ulice++;
    } catch (error) {
      this.stats.errors++;
      console.error('❌ Błąd przetwarzania ULIC:', error.message);
    }
  }

  async run() {
    console.log('🚀 Rozpoczynam import danych GUS (przyjazny dla MongoDB Atlas)...');
    
    try {
      await this.connect();
      await this.clearDatabase();
      
      // Importuj tylko TERC na początek (województwa, powiaty, gminy)
      await this.importTerc();
      
      console.log('\n📊 PODSUMOWANIE IMPORTU (częściowy):');
      console.log(`✅ Województwa: ${this.stats.wojewodztwa}`);
      console.log(`✅ Powiaty: ${this.stats.powiaty}`);
      console.log(`✅ Gminy: ${this.stats.gminy}`);
      console.log(`⚠️  Pominięte: ${this.stats.skipped}`);
      console.log(`❌ Błędy: ${this.stats.errors}`);
      
      const total = this.stats.wojewodztwa + this.stats.powiaty + this.stats.gminy;
      console.log(`\n🎉 Zaimportowano podstawową strukturę: ${total} lokalizacji`);
      console.log('💡 Miejscowości i ulice można dodać później, gdy będzie lokalna baza danych');
      
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