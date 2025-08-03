const mongoose = require('mongoose');
const Miejscowosc = require('./models/miejscowoscModel');

const checkMiejscowosciData = async () => {
  try {
    console.log('🔍 Sprawdzanie danych w kolekcji miejscowości...');
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych MongoDB');
    
    // Sprawdź liczbę dokumentów
    const count = await Miejscowosc.countDocuments();
    console.log(`📊 Liczba dokumentów w kolekcji miejscowości: ${count}`);
    
    if (count === 0) {
      console.log('❌ Kolekcja miejscowości jest pusta!');
      return;
    }
    
    // Sprawdź pierwsze 3 dokumenty
    const firstDocs = await Miejscowosc.find().limit(3);
    console.log('📊 Pierwsze dokumenty:');
    firstDocs.forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc.name} (kod: ${doc.code})`);
    });
    
    // Sprawdź czy istnieje dokument z nazwą zawierającą "Warszawa"
    const warszawaResults = await Miejscowosc.find({
      name: { $regex: 'Warszawa', $options: 'i' }
    }).limit(5);
    
    console.log(`📊 Wyniki wyszukiwania "Warszawa": ${warszawaResults.length} wyników`);
    warszawaResults.forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc.name} (kod: ${doc.code})`);
    });
    
    // Sprawdź strukturę dokumentu
    if (firstDocs.length > 0) {
      console.log('📊 Struktura dokumentu:');
      console.log(JSON.stringify(firstDocs[0].toObject(), null, 2));
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

checkMiejscowosciData(); 