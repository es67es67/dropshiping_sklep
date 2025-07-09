const mongoose = require('mongoose');
const Location = require('./models/locationModel');

mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('✅ Połączono z MongoDB');
    
    const count = await Location.countDocuments();
    console.log(`📊 Liczba lokalizacji w bazie: ${count}`);
    
    const types = await Location.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    console.log('\n📋 Lokalizacje według typu:');
    types.forEach(t => console.log(`  ${t._id}: ${t.count}`));
    
    // Pokaż kilka przykładowych lokalizacji
    const samples = await Location.find().limit(5);
    console.log('\n🔍 Przykładowe lokalizacje:');
    samples.forEach(loc => console.log(`  - ${loc.name} (${loc.type})`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Błąd:', err);
    process.exit(1);
  }); 