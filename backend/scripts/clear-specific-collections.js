const mongoose = require('mongoose');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Lista kolekcji do usunięcia
const COLLECTIONS_TO_DELETE = [
  'simcs',
  'ulics', 
  'locationratings',
  'ulice',
  'locations',
  'gminas'
];

class CollectionCleaner {
  constructor() {
    this.stats = {
      deleted: 0,
      errors: 0,
      skipped: 0
    };
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

  async getDatabase() {
    return mongoose.connection.db;
  }

  async listAllCollections() {
    try {
      const db = await this.getDatabase();
      const collections = await db.listCollections().toArray();
      console.log('\n📋 Wszystkie kolekcje w bazie danych:');
      collections.forEach((collection, index) => {
        console.log(`   ${index + 1}. ${collection.name}`);
      });
      return collections;
    } catch (error) {
      console.error('❌ Błąd podczas listowania kolekcji:', error);
      throw error;
    }
  }

  async checkCollectionExists(collectionName) {
    try {
      const db = await this.getDatabase();
      const collections = await db.listCollections({ name: collectionName }).toArray();
      return collections.length > 0;
    } catch (error) {
      console.error(`❌ Błąd sprawdzania kolekcji ${collectionName}:`, error);
      return false;
    }
  }

  async getCollectionStats(collectionName) {
    try {
      const db = await this.getDatabase();
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      return count;
    } catch (error) {
      console.error(`❌ Błąd pobierania statystyk kolekcji ${collectionName}:`, error);
      return 0;
    }
  }

  async deleteCollection(collectionName) {
    try {
      console.log(`🗑️  Usuwanie kolekcji: ${collectionName}`);
      
      // Sprawdź czy kolekcja istnieje
      const exists = await this.checkCollectionExists(collectionName);
      if (!exists) {
        console.log(`⚠️  Kolekcja ${collectionName} nie istnieje - pomijam`);
        this.stats.skipped++;
        return;
      }

      // Pobierz statystyki przed usunięciem
      const documentCount = await this.getCollectionStats(collectionName);
      console.log(`   📊 Dokumenty w kolekcji: ${documentCount}`);

      // Potwierdzenie usunięcia
      console.log(`   ⚠️  UWAGA: Usuwam kolekcję ${collectionName} z ${documentCount} dokumentami!`);
      
      // Usuń kolekcję
      const db = await this.getDatabase();
      await db.dropCollection(collectionName);
      
      console.log(`✅ Pomyślnie usunięto kolekcję: ${collectionName}`);
      this.stats.deleted++;
      
    } catch (error) {
      console.error(`❌ Błąd podczas usuwania kolekcji ${collectionName}:`, error);
      this.stats.errors++;
    }
  }

  async deleteAllTargetCollections() {
    console.log('🚀 Rozpoczynam usuwanie określonych kolekcji...');
    console.log(`📋 Kolekcje do usunięcia: ${COLLECTIONS_TO_DELETE.join(', ')}`);
    
    // Pokaż wszystkie kolekcje przed usunięciem
    await this.listAllCollections();
    
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  UWAGA: Operacja nieodwracalna!');
    console.log('='.repeat(60));
    
    // Usuń każdą kolekcję
    for (const collectionName of COLLECTIONS_TO_DELETE) {
      await this.deleteCollection(collectionName);
      console.log(''); // Pusta linia dla czytelności
    }
  }

  async run() {
    try {
      console.log('🧹 Skrypt czyszczenia określonych kolekcji');
      console.log('='.repeat(50));
      
      await this.connect();
      
      // Usuń kolekcje
      await this.deleteAllTargetCollections();
      
      // Pokaż kolekcje po usunięciu
      console.log('\n📋 Kolekcje po usunięciu:');
      await this.listAllCollections();
      
      // Podsumowanie
      console.log('\n📊 PODSUMOWANIE OPERACJI:');
      console.log(`✅ Usunięto: ${this.stats.deleted} kolekcji`);
      console.log(`⚠️  Pominięto: ${this.stats.skipped} kolekcji (nie istniały)`);
      console.log(`❌ Błędy: ${this.stats.errors} kolekcji`);
      
      console.log('\n🎉 Operacja zakończona!');
      
    } catch (error) {
      console.error('❌ Błąd podczas wykonywania skryptu:', error);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Rozłączono z MongoDB');
    }
  }
}

// Uruchom skrypt
const cleaner = new CollectionCleaner();
cleaner.run();

module.exports = CollectionCleaner; 