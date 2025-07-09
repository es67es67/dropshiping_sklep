const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function checkAdminUsers() {
  try {
    console.log('🔗 Łączenie z MongoDB...');
    await client.connect();
    console.log('✅ Połączono z MongoDB');
    
    const db = client.db('portal');
    const usersCollection = db.collection('users');
    
    // Pobierz wszystkich użytkowników
    console.log('\n📋 Wszyscy użytkownicy w bazie:');
    const allUsers = await usersCollection.find({}).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   isAdmin: ${user.isAdmin || false}`);
      console.log(`   Roles: ${user.roles ? user.roles.join(', ') : 'brak'}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });
    
    // Sprawdź adminów
    console.log('👑 Użytkownicy z uprawnieniami admina:');
    const adminUsers = await usersCollection.find({ isAdmin: true }).toArray();
    if (adminUsers.length > 0) {
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.username} (${admin.email})`);
      });
    } else {
      console.log('   Brak użytkowników z uprawnieniami admina');
    }
    
    // Sprawdź użytkowników z rolą admin
    console.log('\n🔐 Użytkownicy z rolą "admin":');
    const roleAdminUsers = await usersCollection.find({ roles: 'admin' }).toArray();
    if (roleAdminUsers.length > 0) {
      roleAdminUsers.forEach(admin => {
        console.log(`   - ${admin.username} (${admin.email})`);
      });
    } else {
      console.log('   Brak użytkowników z rolą admin');
    }
    
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Rozłączono z MongoDB');
  }
}

checkAdminUsers(); 