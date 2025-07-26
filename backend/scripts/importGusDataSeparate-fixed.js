const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importuj modele
const Wojewodztwo = require('../models/wojewodztwoModel');
const Powiat = require('../models/powiatModel');
const Gmina = require('../models/gminaModel');
const Miejscowosc = require('../models/miejscowoscModel');

// Ścieżki do plików
const TERC_FILE = path.join(__dirname, '../../inne/dane adresowe gus/TERC_Adresowy_2025-07-07.csv');
const SIMC_FILE = path.join(__dirname, '../../inne/dane adresowe gus/SIMC_Adresowy_2025-07-07.csv');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GusDataImporterSeparateFixed {
  constructor() {
    this.batchSize = 1000;
    this.stats = {
      wojewodztwa: 0,
      powiaty: 0,
      gminy: 0,
      miejscowosci: 0,
      skipped: 0,
      errors: 0,
      duplicates: 0
    };
    
    // Cache dla referencji
    this.wojewodztwaCache = new Map();
    this.powiatyCache = new Map();
    this.gminyCache = new Map();
    
    // Set do śledzenia przetworzonych kodów
    this.processedCodes = new Set();
  }

  async connect() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
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
      console.log('✅ Baza danych wyczyszczona');
    } catch (error) {
      console.error('❌ Błąd podczas czyszczenia:', error);
      throw error;
    }
  }

  async processBatch(model, documents) {
    if (documents.length === 0) return;
    
    try {
      await model.insertMany(documents, { ordered: false });
      await delay(100); // Krótka przerwa między batchami
    } catch (error) {
      console.error('❌ Błąd podczas zapisywania batch:', error.message);
      this.stats.errors++;
    }
  }

  async importMiejscowosci() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('🏛️  Import miejscowości...');
        
        // Załaduj cache
        await this.loadWojewodztwaCache();
        await this.loadPowiatyCache();
        await this.loadGminyCache();
        
        let miejscowosciBatch = [];
        let rowCount = 0;
        let processedCount = 0;
        
        fs.createReadStream(SIMC_FILE)
          .pipe(csv({ 
            separator: ';',
            strict: false,
            skipEmptyLines: true
          }))
          .on('data', async (row) => {
            rowCount++;
            
            // Pomiń nagłówek
            if (rowCount === 1) return;
            
            const processedRow = {};
            for (const [key, value] of Object.entries(row)) {
              processedRow[key] = (value === undefined || value === null || value.trim() === '') ? 'brak' : value.trim();
            }
            
            const result = await this.processMiejscowoscRow(processedRow);
            if (result) {
              miejscowosciBatch.push(result);
              processedCount++;
            }
            
            if (miejscowosciBatch.length >= this.batchSize) {
              console.log(`⏳ Przetwarzanie miejscowości batch: ${processedCount} / ${rowCount-1}`);
              await this.processBatch(Miejscowosc, miejscowosciBatch);
              miejscowosciBatch.length = 0;
            }
          })
          .on('end', async () => {
            if (miejscowosciBatch.length > 0) {
              await this.processBatch(Miejscowosc, miejscowosciBatch);
            }
            console.log(`✅ Miejscowości zaimportowane: ${this.stats.miejscowosci} miejscowości`);
            console.log(`📊 Pominięte duplikaty: ${this.stats.duplicates}`);
            console.log(`📊 Przetworzone wiersze: ${processedCount} / ${rowCount-1}`);
            resolve();
          })
          .on('error', (error) => {
            console.error('❌ Błąd podczas importowania miejscowości:', error);
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
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
        
        // Sprawdź czy kod już został przetworzony
        const uniqueKey = `${sym}-${rm}`; // Kod + rodzaj
        if (this.processedCodes.has(uniqueKey)) {
          this.stats.duplicates++;
          return null; // Pomiń duplikat
        }
        
        this.processedCodes.add(uniqueKey);
        
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
          // Referencje do hierarchii
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

  async loadWojewodztwaCache() {
    console.log('📋 Ładowanie cache województw...');
    const wojewodztwa = await Wojewodztwo.find({});
    wojewodztwa.forEach(woj => {
      this.wojewodztwaCache.set(woj.code, woj._id);
    });
    console.log(`✅ Załadowano ${wojewodztwa.length} województw do cache`);
  }

  async loadPowiatyCache() {
    console.log('📋 Ładowanie cache powiatów...');
    const powiaty = await Powiat.find({});
    powiaty.forEach(pow => {
      this.powiatyCache.set(pow.code, pow._id);
    });
    console.log(`✅ Załadowano ${powiaty.length} powiatów do cache`);
  }

  async loadGminyCache() {
    console.log('📋 Ładowanie cache gmin...');
    const gminy = await Gmina.find({});
    gminy.forEach(gmi => {
      this.gminyCache.set(gmi.code, gmi._id);
    });
    console.log(`✅ Załadowano ${gminy.length} gmin do cache`);
  }

  async run() {
    try {
      console.log('🚀 Rozpoczynam import miejscowości (naprawiona wersja)...');
      
      await this.connect();
      
      // Importuj tylko miejscowości (województwa, powiaty, gminy już są)
      await this.importMiejscowosci();
      
      console.log('\n📊 PODSUMOWANIE IMPORTU:');
      console.log(`✅ Miejscowości: ${this.stats.miejscowosci}`);
      console.log(`⚠️  Pominięte duplikaty: ${this.stats.duplicates}`);
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
const importer = new GusDataImporterSeparateFixed();
importer.run(); 