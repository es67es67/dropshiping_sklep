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

async function updateExistingAdmin() {
  try {
    console.log('🔗 Łączenie z MongoDB...');
    await client.connect();
    console.log('✅ Połączono z MongoDB');
    
    const db = client.db('portal');
    const usersCollection = db.collection('users');
    
    // Znajdź użytkownika admin
    console.log('🔍 Wyszukiwanie użytkownika admin...');
    const adminUser = await usersCollection.findOne({ username: 'admin' });
    
    if (!adminUser) {
      console.log('❌ Użytkownik admin nie został znaleziony');
      return;
    }
    
    console.log('📋 Aktualne dane użytkownika admin:');
    console.log(JSON.stringify(adminUser, null, 2));
    
    // Sprawdź czy ma uprawnienia admina
    if (adminUser.isAdmin) {
      console.log('✅ Użytkownik już ma uprawnienia admina');
      console.log('📧 Email: ' + adminUser.email);
      console.log('👤 Username: ' + adminUser.username);
      console.log('🔑 Aby się zalogować, użyj istniejącego hasła');
    } else {
      console.log('🔄 Aktualizowanie uprawnień admina...');
      
      // Aktualizuj uprawnienia
      const result = await usersCollection.updateOne(
        { username: 'admin' },
        { 
          $set: { 
            isAdmin: true,
            roles: ['admin'],
            isVerified: true,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log('✅ Uprawnienia admina zostały przyznane!');
        console.log('📧 Email: ' + adminUser.email);
        console.log('👤 Username: ' + adminUser.username);
      } else {
        console.log('❌ Nie udało się zaktualizować uprawnień');
      }
    }
    
    // Pokaż wszystkich adminów
    console.log('\n📋 Wszyscy administratorzy w systemie:');
    const allAdmins = await usersCollection.find({ isAdmin: true }).toArray();
    allAdmins.forEach(admin => {
      console.log(`   - ${admin.username} (${admin.email}) - isAdmin: ${admin.isAdmin}`);
    });
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

updateExistingAdmin(); 