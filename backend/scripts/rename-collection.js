const mongoose = require('mongoose');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Konfiguracja przemianowania
const RENAME_CONFIG = {
  from: 'ulicas',
  to: 'ulice'
};

class CollectionRenamer {
  constructor() {
    this.stats = {
      documentsCounted: 0,
      documentsRenamed: 0,
      errors: 0
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

  async renameCollection() {
    try {
      console.log('🔄 Rozpoczynam przemianowanie kolekcji...');
      console.log(`📋 Przemianowanie: ${RENAME_CONFIG.from} → ${RENAME_CONFIG.to}`);
      
      const db = await this.getDatabase();
      
      // Sprawdź czy kolekcja źródłowa istnieje
      const sourceExists = await this.checkCollectionExists(RENAME_CONFIG.from);
      if (!sourceExists) {
        console.log(`❌ Kolekcja źródłowa '${RENAME_CONFIG.from}' nie istnieje!`);
        this.stats.errors++;
        return false;
      }
      
      // Sprawdź czy kolekcja docelowa już istnieje
      const targetExists = await this.checkCollectionExists(RENAME_CONFIG.to);
      if (targetExists) {
        console.log(`❌ Kolekcja docelowa '${RENAME_CONFIG.to}' już istnieje!`);
        console.log('⚠️  Nie można przemianować - kolekcja docelowa już istnieje');
        this.stats.errors++;
        return false;
      }
      
      // Pobierz statystyki kolekcji źródłowej
      const documentCount = await this.getCollectionStats(RENAME_CONFIG.from);
      console.log(`📊 Dokumenty w kolekcji ${RENAME_CONFIG.from}: ${documentCount}`);
      this.stats.documentsCounted = documentCount;
      
      if (documentCount === 0) {
        console.log('⚠️  Kolekcja jest pusta - przemianowanie pustej kolekcji');
      }
      
      // Potwierdzenie operacji
      console.log(`\n⚠️  UWAGA: Przemianowuję kolekcję ${RENAME_CONFIG.from} na ${RENAME_CONFIG.to}`);
      console.log(`   Dokumenty: ${documentCount}`);
      console.log('   Operacja jest bezpieczna - dane zostaną zachowane');
      
      // Przemianuj kolekcję
      console.log('\n🔄 Przemianowywanie w toku...');
      await db.renameCollection(RENAME_CONFIG.from, RENAME_CONFIG.to);
      
      console.log(`✅ Pomyślnie przemianowano kolekcję: ${RENAME_CONFIG.from} → ${RENAME_CONFIG.to}`);
      this.stats.documentsRenamed = documentCount;
      
      return true;
      
    } catch (error) {
      console.error('❌ Błąd podczas przemianowania kolekcji:', error);
      this.stats.errors++;
      return false;
    }
  }

  async verifyRename() {
    try {
      console.log('\n🔍 Weryfikacja przemianowania...');
      
      // Sprawdź czy kolekcja źródłowa nie istnieje
      const sourceExists = await this.checkCollectionExists(RENAME_CONFIG.from);
      if (sourceExists) {
        console.log(`❌ BŁĄD: Kolekcja źródłowa '${RENAME_CONFIG.from}' nadal istnieje!`);
        return false;
      } else {
        console.log(`✅ Kolekcja źródłowa '${RENAME_CONFIG.from}' została usunięta`);
      }
      
      // Sprawdź czy kolekcja docelowa istnieje
      const targetExists = await this.checkCollectionExists(RENAME_CONFIG.to);
      if (!targetExists) {
        console.log(`❌ BŁĄD: Kolekcja docelowa '${RENAME_CONFIG.to}' nie istnieje!`);
        return false;
      } else {
        console.log(`✅ Kolekcja docelowa '${RENAME_CONFIG.to}' została utworzona`);
      }
      
      // Sprawdź liczbę dokumentów w nowej kolekcji
      const newDocumentCount = await this.getCollectionStats(RENAME_CONFIG.to);
      console.log(`📊 Dokumenty w nowej kolekcji ${RENAME_CONFIG.to}: ${newDocumentCount}`);
      
      if (newDocumentCount === this.stats.documentsCounted) {
        console.log('✅ Liczba dokumentów się zgadza - wszystkie dane zostały zachowane');
        return true;
      } else {
        console.log(`❌ BŁĄD: Liczba dokumentów się nie zgadza!`);
        console.log(`   Oczekiwano: ${this.stats.documentsCounted}, Znaleziono: ${newDocumentCount}`);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas weryfikacji:', error);
      return false;
    }
  }

  async run() {
    try {
      console.log('🔄 Skrypt przemianowania kolekcji');
      console.log('='.repeat(50));
      
      await this.connect();
      
      // Pokaż kolekcje przed przemianowaniem
      console.log('\n📋 Kolekcje przed przemianowaniem:');
      await this.listAllCollections();
      
      // Przemianuj kolekcję
      const success = await this.renameCollection();
      
      if (success) {
        // Weryfikuj przemianowanie
        const verified = await this.verifyRename();
        
        if (verified) {
          // Pokaż kolekcje po przemianowaniu
          console.log('\n📋 Kolekcje po przemianowaniu:');
          await this.listAllCollections();
          
          // Podsumowanie
          console.log('\n📊 PODSUMOWANIE OPERACJI:');
          console.log(`✅ Przemianowano: ${RENAME_CONFIG.from} → ${RENAME_CONFIG.to}`);
          console.log(`📊 Dokumenty: ${this.stats.documentsRenamed}`);
          console.log(`❌ Błędy: ${this.stats.errors}`);
          
          console.log('\n🎉 Operacja zakończona pomyślnie!');
        } else {
          console.log('\n❌ Weryfikacja nie powiodła się!');
        }
      } else {
        console.log('\n❌ Przemianowanie nie powiodło się!');
      }
      
    } catch (error) {
      console.error('❌ Błąd podczas wykonywania skryptu:', error);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Rozłączono z MongoDB');
    }
  }
}

// Uruchom skrypt
const renamer = new CollectionRenamer();
renamer.run();

module.exports = CollectionRenamer; 