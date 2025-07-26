const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function resetAdminPassword() {
  try {
    console.log('🔗 Łączenie z MongoDB...');
    await client.connect();
    console.log('✅ Połączono z MongoDB');
    
    const db = client.db('portal');
    const usersCollection = db.collection('users');
    
    // Znajdź użytkownika admin
    const adminUser = await usersCollection.findOne({ username: 'admin' });
    
    if (!adminUser) {
      console.log('❌ Użytkownik admin nie został znaleziony');
      return;
    }
    
    console.log('👤 Znaleziono użytkownika admin:');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   isAdmin: ${adminUser.isAdmin}`);
    
    // Generuj nowe hasło
    const newPassword = 'Admin123!';
    console.log(`🔐 Generowanie nowego hasła: ${newPassword}`);
    
    const hash = await bcrypt.hash(newPassword, 10);
    
    // Aktualizuj hasło
    const result = await usersCollection.updateOne(
      { username: 'admin' },
      { 
        $set: { 
          password: hash,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Hasło zostało zaktualizowane!');
      console.log('📧 Email: ' + adminUser.email);
      console.log('👤 Username: ' + adminUser.username);
      console.log('🔑 Nowe hasło: ' + newPassword);
    } else {
      console.log('❌ Nie udało się zaktualizować hasła');
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

resetAdminPassword(); 