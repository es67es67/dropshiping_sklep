const mongoose = require('mongoose');
require('dotenv').config();

// Połącz z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const Gmina = require('./models/gminaModel');

async function checkGminyPowiat0223() {
  try {
    console.log('🔍 Sprawdzam gminy w powiecie wrocławskim (kod: 0223)...');
    
    // Znajdź wszystkie gminy w powiecie wrocławskim
    const gminy = await Gmina.find({
      powiatCode: '0223',
      isActive: true
    }).select('name code powiatCode');
    
    console.log(`📊 Znaleziono ${gminy.length} gmin w powiecie wrocławskim:`);
    
    gminy.forEach(gmina => {
      console.log(`  - ${gmina.name} (kod: ${gmina.code})`);
    });
    
    if (gminy.length === 0) {
      console.log('⚠️  Nie znaleziono żadnych gmin w powiecie wrocławskim!');
      
      // Sprawdz wszystkie gminy
      const wszystkieGminy = await Gmina.find({ isActive: true })
        .select('name code powiatCode')
        .limit(10);
      
      console.log('\n📋 Pierwsze 10 gmin w bazie:');
      wszystkieGminy.forEach(gmina => {
        console.log(`  - ${gmina.name} (kod: ${gmina.code}, powiat: ${gmina.powiatCode})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkGminyPowiat0223(); 