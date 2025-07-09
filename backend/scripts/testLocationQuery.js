const mongoose = require('mongoose');
const Location = require('../models/locationModel');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function testLocationQuery() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Test 1: Sprawdź wszystkie miejscowości
    const allMiejscowosci = await Location.find({type: 'miejscowość'}).limit(5);
    console.log(`\n📝 Wszystkie miejscowości (limit 5): ${allMiejscowosci.length}`);
    allMiejscowosci.forEach(loc => {
      console.log(`- ${loc.name} (isActive: ${loc.isActive})`);
    });

    // Test 2: Sprawdź miejscowości z isActive: true
    const activeMiejscowosci = await Location.find({type: 'miejscowość', isActive: true}).limit(5);
    console.log(`\n📝 Miejscowości z isActive=true (limit 5): ${activeMiejscowosci.length}`);
    activeMiejscowosci.forEach(loc => {
      console.log(`- ${loc.name} (isActive: ${loc.isActive})`);
    });

    // Test 3: Sprawdź miejscowości bez isActive
    const noActiveMiejscowosci = await Location.find({type: 'miejscowość', isActive: {$ne: true}}).limit(5);
    console.log(`\n📝 Miejscowości bez isActive=true (limit 5): ${noActiveMiejscowosci.length}`);
    noActiveMiejscowosci.forEach(loc => {
      console.log(`- ${loc.name} (isActive: ${loc.isActive})`);
    });

    // Test 4: Sprawdź miejscowości z isActive: false
    const falseActiveMiejscowosci = await Location.find({type: 'miejscowość', isActive: false}).limit(5);
    console.log(`\n📝 Miejscowości z isActive=false (limit 5): ${falseActiveMiejscowosci.length}`);
    falseActiveMiejscowosci.forEach(loc => {
      console.log(`- ${loc.name} (isActive: ${loc.isActive})`);
    });

    // Test 5: Sprawdź miejscowości bez pola isActive
    const noIsActiveField = await Location.find({type: 'miejscowość', isActive: {$exists: false}}).limit(5);
    console.log(`\n📝 Miejscowości bez pola isActive (limit 5): ${noIsActiveField.length}`);
    noIsActiveField.forEach(loc => {
      console.log(`- ${loc.name} (isActive: ${loc.isActive})`);
    });

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testLocationQuery(); 