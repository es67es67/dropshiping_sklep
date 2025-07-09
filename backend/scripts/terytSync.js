const mongoose = require('mongoose');
const axios = require('axios');
const Location = require('../models/locationModel');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// API TERYT - oficjalne źródło danych
const TERYT_API_BASE = 'https://api.stat.gov.pl/ws/rest/teryt/';

class TerytSync {
  constructor() {
    this.stats = {
      wojewodztwa: 0,
      powiaty: 0,
      gminy: 0,
      miejscowosci: 0,
      ulice: 0
    };
  }

  async connect() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Połączono z MongoDB');
    } catch (error) {
      console.error('❌ Błąd połączenia z MongoDB:', error);
      throw error;
    }
  }

  async clearDatabase() {
    try {
      await Location.deleteMany({});
      console.log('🗑️ Wyczyszczono bazę danych');
    } catch (error) {
      console.error('❌ Błąd czyszczenia bazy:', error);
    }
  }

  async fetchFromTeryt(endpoint) {
    try {
      const response = await axios.get(`${TERYT_API_BASE}${endpoint}`, {
        headers: {
          'Accept': 'application/json'
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Błąd pobierania z ${endpoint}:`, error.message);
      return null;
    }
  }

  async syncWojewodztwa() {
    console.log('🔄 Pobieranie województw...');
    
    // Pobieramy z API TERYT
    const data = await this.fetchFromTeryt('terc/wojewodztwa');
    
    if (!data) {
      // Fallback - ręczne dane województw
      const wojewodztwa = [
        { name: 'Dolnośląskie', code: '02', population: 2900000 },
        { name: 'Kujawsko-pomorskie', code: '04', population: 2100000 },
        { name: 'Lubelskie', code: '06', population: 2100000 },
        { name: 'Lubuskie', code: '08', population: 1000000 },
        { name: 'Łódzkie', code: '10', population: 2500000 },
        { name: 'Małopolskie', code: '12', population: 3400000 },
        { name: 'Mazowieckie', code: '14', population: 5400000 },
        { name: 'Opolskie', code: '16', population: 1000000 },
        { name: 'Podkarpackie', code: '18', population: 2100000 },
        { name: 'Podlaskie', code: '20', population: 1200000 },
        { name: 'Pomorskie', code: '22', population: 2300000 },
        { name: 'Śląskie', code: '24', population: 4500000 },
        { name: 'Świętokrzyskie', code: '26', population: 1200000 },
        { name: 'Warmińsko-mazurskie', code: '28', population: 1400000 },
        { name: 'Wielkopolskie', code: '30', population: 3500000 },
        { name: 'Zachodniopomorskie', code: '32', population: 1700000 }
      ];

      for (const woj of wojewodztwa) {
        await Location.create({
          name: woj.name,
          type: 'województwo',
          code: woj.code,
          population: woj.population
        });
      }
      
      this.stats.wojewodztwa = wojewodztwa.length;
      console.log(`✅ Dodano ${wojewodztwa.length} województw`);
    }
  }

  async syncPowiaty() {
    console.log('🔄 Pobieranie powiatów...');
    
    // Pobieramy powiaty dla każdego województwa
    const wojewodztwa = await Location.find({ type: 'województwo' });
    
    for (const woj of wojewodztwa) {
      const data = await this.fetchFromTeryt(`terc/powiaty/${woj.code}`);
      
      if (data && data.results) {
        for (const powiat of data.results) {
          await Location.create({
            name: powiat.nazwa,
            type: 'powiat',
            code: powiat.pow,
            parentCode: woj.code,
            population: powiat.ludnosc || 0
          });
          this.stats.powiaty++;
        }
      }
    }
    
    console.log(`✅ Dodano ${this.stats.powiaty} powiatów`);
  }

  async syncGminy() {
    console.log('🔄 Pobieranie gmin...');
    
    const powiaty = await Location.find({ type: 'powiat' });
    
    for (const powiat of powiaty) {
      const data = await this.fetchFromTeryt(`terc/gminy/${powiat.code}`);
      
      if (data && data.results) {
        for (const gmina of data.results) {
          await Location.create({
            name: gmina.nazwa,
            type: 'gmina',
            code: gmina.gmi,
            parentCode: powiat.code,
            population: gmina.ludnosc || 0
          });
          this.stats.gminy++;
        }
      }
    }
    
    console.log(`✅ Dodano ${this.stats.gminy} gmin`);
  }

  async syncMiejscowosci() {
    console.log('🔄 Pobieranie miejscowości...');
    
    const gminy = await Location.find({ type: 'gmina' });
    
    for (const gmina of gminy) {
      const data = await this.fetchFromTeryt(`simc/miejscowosci/${gmina.code}`);
      
      if (data && data.results) {
        for (const miejscowosc of data.results) {
          await Location.create({
            name: miejscowosc.nazwa,
            type: 'miejscowość',
            code: miejscowosc.sym,
            parentCode: gmina.code,
            population: miejscowosc.ludnosc || 0
          });
          this.stats.miejscowosci++;
        }
      }
      
      // Dodajemy małe opóźnienie aby nie przeciążyć API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Dodano ${this.stats.miejscowosci} miejscowości`);
  }

  async syncUlice() {
    console.log('🔄 Pobieranie ulic...');
    
    const miejscowosci = await Location.find({ type: 'miejscowość' });
    
    for (const miejscowosc of miejscowosci) {
      const data = await this.fetchFromTeryt(`ulic/${miejscowosc.code}`);
      
      if (data && data.results) {
        for (const ulica of data.results) {
          await Location.create({
            name: ulica.nazwa,
            type: 'ulica',
            code: ulica.sym,
            parentCode: miejscowosc.code
          });
          this.stats.ulice++;
        }
      }
      
      // Dodajemy opóźnienie
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`✅ Dodano ${this.stats.ulice} ulic`);
  }

  async run() {
    try {
      console.log('🚀 Rozpoczynam synchronizację z TERYT...');
      
      await this.connect();
      await this.clearDatabase();
      
      await this.syncWojewodztwa();
      await this.syncPowiaty();
      await this.syncGminy();
      await this.syncMiejscowosci();
      await this.syncUlice();
      
      console.log('\n📊 PODSUMOWANIE:');
      console.log(`  Województwa: ${this.stats.wojewodztwa}`);
      console.log(`  Powiaty: ${this.stats.powiaty}`);
      console.log(`  Gminy: ${this.stats.gminy}`);
      console.log(`  Miejscowości: ${this.stats.miejscowosci}`);
      console.log(`  Ulice: ${this.stats.ulice}`);
      console.log(`  RAZEM: ${this.stats.wojewodztwa + this.stats.powiaty + this.stats.gminy + this.stats.miejscowosci + this.stats.ulice}`);
      
      console.log('\n✅ Synchronizacja zakończona pomyślnie!');
      
    } catch (error) {
      console.error('❌ Błąd podczas synchronizacji:', error);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Rozłączono z MongoDB');
    }
  }
}

// Uruchomienie skryptu
if (require.main === module) {
  const sync = new TerytSync();
  sync.run();
}

module.exports = TerytSync; 