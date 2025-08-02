const mongoose = require('mongoose');
require('dotenv').config();

// Połącz z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const Miejscowosc = require('./models/miejscowoscModel');

async function checkMiastaPowiat0223() {
  try {
    console.log('🔍 Sprawdzam miasta w powiecie wrocławskim (kod: 0223)...');
    
    // Znajdź wszystkie miasta w powiecie wrocławskim
    const miasta = await Miejscowosc.find({
      powiatCode: '0223',
      isActive: true
    }).select('name code powiatCode').limit(20);
    
    console.log(`📊 Znaleziono ${miasta.length} miast w powiecie wrocławskim:`);
    
    miasta.forEach(miasto => {
      console.log(`  - ${miasto.name} (kod: ${miasto.code})`);
    });
    
    if (miasta.length === 0) {
      console.log('⚠️  Nie znaleziono żadnych miast w powiecie wrocławskim!');
      
      // Sprawdz wszystkie miasta
      const wszystkieMiasta = await Miejscowosc.find({ isActive: true })
        .select('name code powiatCode')
        .limit(10);
      
      console.log('\n📋 Pierwsze 10 miast w bazie:');
      wszystkieMiasta.forEach(miasto => {
        console.log(`  - ${miasto.name} (kod: ${miasto.code}, powiat: ${miasto.powiatCode})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkMiastaPowiat0223(); 