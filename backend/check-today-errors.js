const mongoose = require('mongoose');

async function checkTodayErrors() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const ErrorModel = require('./models/errorModel');
    const ErrorGroupModel = require('./models/errorGroupModel');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('\n=== BŁĘDY Z DZISIAJ ===');
    const errors = await ErrorModel.find({ 
      createdAt: { $gte: today } 
    }).sort({ createdAt: -1 }).limit(20);

    console.log(`Liczba błędów: ${errors.length}`);

    errors.forEach((error, index) => {
      console.log(`\n--- Błąd ${index + 1} ---`);
      console.log('ID:', error._id);
      console.log('Hash:', error.hash);
      console.log('Message:', error.message);
      console.log('Stack:', error.stack?.substring(0, 200) + '...');
      console.log('URL:', error.url);
      console.log('User Agent:', error.userAgent?.substring(0, 100) + '...');
      console.log('Data utworzenia:', error.createdAt);
    });

    console.log('\n=== GRUPY BŁĘDÓW Z DZISIAJ ===');
    const errorGroups = await ErrorGroupModel.find({ 
      createdAt: { $gte: today } 
    }).sort({ createdAt: -1 }).limit(10);

    console.log(`Liczba grup błędów: ${errorGroups.length}`);

    errorGroups.forEach((group, index) => {
      console.log(`\n--- Grupa ${index + 1} ---`);
      console.log('ID:', group._id);
      console.log('Hash:', group.hash);
      console.log('Message:', group.message);
      console.log('Count:', group.count);
      console.log('Last Occurrence:', group.lastOccurrence);
      console.log('Data utworzenia:', group.createdAt);
    });

    // Sprawdź wszystkie kolekcje błędów
    console.log('\n=== WSZYSTKIE KOLEKCJE BŁĘDÓW ===');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const errorCollections = collections.filter(col => 
      col.name.includes('error') || col.name.includes('Error')
    );
    
    console.log('Kolekcje związane z błędami:');
    errorCollections.forEach(col => {
      console.log('-', col.name);
    });

    await mongoose.connection.close();
    console.log('\nPołączenie zamknięte');

  } catch (error) {
    console.error('Błąd:', error);
    await mongoose.connection.close();
  }
}

checkTodayErrors(); 