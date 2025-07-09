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

async function createAdminNative() {
  try {
    console.log('🔗 Łączenie z MongoDB...');
    await client.connect();
    console.log('✅ Połączono z MongoDB');
    
    const db = client.db('portal');
    const usersCollection = db.collection('users');
    
    // Sprawdź czy admin już istnieje
    console.log('🔍 Sprawdzanie istniejących adminów...');
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@portal.local' },
        { isAdmin: true }
      ]
    });
    
    if (existingAdmin) {
      console.log('ℹ️ Użytkownik admin już istnieje:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   isAdmin: ${existingAdmin.isAdmin}`);
      
      // Pokaż wszystkich adminów
      const allAdmins = await usersCollection.find({ isAdmin: true }).toArray();
      console.log('\n📋 Wszyscy administratorzy:');
      allAdmins.forEach(admin => {
        console.log(`   - ${admin.username} (${admin.email}) - isAdmin: ${admin.isAdmin}`);
      });
      return;
    }
    
    console.log('🔐 Tworzenie hasha hasła...');
    const hash = await bcrypt.hash('Admin123!', 10);
    
    console.log('👤 Tworzenie użytkownika admina...');
    
    const adminUser = {
      username: 'admin',
      email: 'admin@portal.local',
      password: hash,
      isAdmin: true,
      firstName: 'Administrator',
      lastName: 'Portalu',
      roles: ['admin'],
      isVerified: true,
      points: 0,
      level: 1,
      isOnline: false,
      lastSeen: new Date(),
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
          messages: true,
          likes: true,
          comments: true,
          newFollowers: true,
          localEvents: true,
          nearbyProducts: true
        },
        privacy: {
          profileVisibility: 'public',
          showOnlineStatus: true,
          showLocation: true,
          allowMessages: true,
          allowFriendRequests: true,
          showEmail: false,
          showPhone: false
        },
        content: {
          autoPlayVideos: true,
          showSensitiveContent: false,
          language: 'pl',
          timezone: 'Europe/Warsaw'
        }
      },
      stats: {
        postsCount: 0,
        productsCount: 0,
        shopsCount: 0,
        totalLikes: 0,
        totalViews: 0
      }
    };
    
    const result = await usersCollection.insertOne(adminUser);
    console.log('✅ Utworzono użytkownika admina!');
    console.log('📧 Email: admin@portal.local');
    console.log('🔑 Hasło: Admin123!');
    console.log('👤 Username: admin');
    console.log('🆔 ID: ' + result.insertedId);
    
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia admina:', error.message);
    if (error.code === 11000) {
      console.log('ℹ️ Użytkownik admin już istnieje w bazie danych (duplikat)');
    }
  } finally {
    await client.close();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

createAdminNative(); 