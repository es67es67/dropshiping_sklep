const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function checkDatabaseStructure() {
  try {
    console.log('🔗 Łączenie z MongoDB...');
    await client.connect();
    console.log('✅ Połączono z MongoDB');
    
    const db = client.db('portal');
    
    // Sprawdź listę kolekcji
    console.log('\n📋 Lista kolekcji w bazie "portal":');
    const collections = await db.listCollections().toArray();
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Sprawdź czy kolekcja users istnieje
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    console.log(`\n👥 Kolekcja "users": ${usersCount} dokumentów`);
    
    // Sprawdź indeksy na kolekcji users
    console.log('\n🔍 Indeksy na kolekcji "users":');
    const indexes = await usersCollection.indexes();
    indexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
      if (index.unique) console.log(`     Unique: ${index.unique}`);
      if (index.sparse) console.log(`     Sparse: ${index.sparse}`);
    });
    
    // Sprawdź przykładowy dokument (jeśli istnieje)
    if (usersCount > 0) {
      console.log('\n📄 Przykładowy dokument z kolekcji "users":');
      const sampleUser = await usersCollection.findOne();
      console.log(JSON.stringify(sampleUser, null, 2));
    }
    
    // Sprawdź uprawnienia użytkownika
    console.log('\n🔐 Sprawdzanie uprawnień...');
    try {
      const adminDb = client.db('admin');
      const userInfo = await adminDb.command({ usersInfo: "es67jw" });
      console.log('✅ Użytkownik es67jw istnieje');
      console.log('📋 Role:', userInfo.users[0].roles.map(r => r.role));
    } catch (error) {
      console.log('❌ Nie można sprawdzić uprawnień:', error.message);
    }
    
    // Test zapisu prostego dokumentu
    console.log('\n🧪 Test zapisu prostego dokumentu...');
    try {
      const testCollection = db.collection('test_write');
      const result = await testCollection.insertOne({ 
        test: true, 
        timestamp: new Date(),
        message: 'Test zapisu'
      });
      console.log('✅ Zapis testowy udany:', result.insertedId);
      
      // Usuń testowy dokument
      await testCollection.deleteOne({ _id: result.insertedId });
      console.log('✅ Testowy dokument usunięty');
    } catch (error) {
      console.log('❌ Błąd zapisu testowego:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Rozłączono z MongoDB');
  }
}

checkDatabaseStructure(); 