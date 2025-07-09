const mongoose = require('mongoose');
const Location = require('../models/locationModel');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function testApi() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Symuluj zapytanie z kontrolera
    const { type, search, limit = 50 } = { type: 'miejscowość' };
    
    let query = { isActive: true };
    if (type) query.type = type;
    if (search) {
      query.$text = { $search: search };
    }
    
    console.log('🔍 Zapytanie:', JSON.stringify(query, null, 2));
    
    const locations = await Location.find(query)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    console.log(`✅ Znaleziono ${locations.length} lokalizacji`);
    
    if (locations.length > 0) {
      console.log('📝 Pierwsze 5 lokalizacji:');
      locations.slice(0, 5).forEach(loc => {
        console.log(`- ${loc.name} (type: ${loc.type}, isActive: ${loc.isActive})`);
      });
    }

    // Sprawdź czy są jakieś miejscowości w ogóle
    const allMiejscowosci = await Location.find({type: 'miejscowość'}).limit(5);
    console.log(`\n🏠 Wszystkie miejscowości (limit 5): ${allMiejscowosci.length}`);
    allMiejscowosci.forEach(loc => {
      console.log(`- ${loc.name} (isActive: ${loc.isActive})`);
    });

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testApi(); 