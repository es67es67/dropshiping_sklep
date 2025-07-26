const mongoose = require('mongoose');
require('dotenv').config();

// Import modeli
const User = require('./backend/models/userModel');
const Friendship = require('./backend/models/friendshipModel');
const Notification = require('./backend/models/notificationModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function testFriendshipWithAdmin() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Znajdź admina
    console.log('\n🔍 Szukam użytkownika admin...');
    const admin = await User.findOne({ roles: 'admin' }).select('_id firstName lastName username email');
    
    if (!admin) {
      console.log('❌ Nie znaleziono użytkownika admin');
      return;
    }
    
    console.log('✅ Znaleziono admina:', {
      id: admin._id,
      name: `${admin.firstName} ${admin.lastName}`,
      username: admin.username,
      email: admin.email
    });

    // Znajdź zwykłego użytkownika (nie admina)
    console.log('\n🔍 Szukam zwykłego użytkownika...');
    const regularUser = await User.findOne({ 
      roles: { $ne: 'admin' },
      _id: { $ne: admin._id }
    }).select('_id firstName lastName username email');
    
    if (!regularUser) {
      console.log('❌ Nie znaleziono zwykłego użytkownika');
      return;
    }
    
    console.log('✅ Znaleziono użytkownika:', {
      id: regularUser._id,
      name: `${regularUser.firstName} ${regularUser.lastName}`,
      username: regularUser.username,
      email: regularUser.email
    });

    // Sprawdź czy już istnieje relacja
    console.log('\n🔍 Sprawdzam istniejące relacje...');
    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: regularUser._id, recipient: admin._id },
        { requester: admin._id, recipient: regularUser._id }
      ]
    });

    if (existingFriendship) {
      console.log('⚠️ Relacja już istnieje:', {
        status: existingFriendship.status,
        requester: existingFriendship.requester,
        recipient: existingFriendship.recipient
      });
    } else {
      console.log('✅ Brak istniejącej relacji - można wysłać zaproszenie');
    }

    // Wyślij zaproszenie od zwykłego użytkownika do admina
    console.log('\n📤 Wysyłam zaproszenie do znajomych...');
    const friendship = new Friendship({
      requester: regularUser._id,
      recipient: admin._id,
      message: 'Cześć! Chciałbym dodać Cię do znajomych.',
      metadata: {
        ip: '127.0.0.1',
        userAgent: 'Test Script',
        device: 'desktop'
      }
    });

    await friendship.save();
    console.log('✅ Zaproszenie zostało wysłane');

    // Utwórz powiadomienie dla admina
    console.log('\n🔔 Tworzę powiadomienie dla admina...');
    const notification = new Notification({
      user: admin._id,
      type: 'friend_request',
      title: 'Nowe zaproszenie do znajomych',
      message: `${regularUser.firstName} ${regularUser.lastName} wysłał(a) Ci zaproszenie do znajomych`,
      priority: 'medium',
      data: {
        friendshipId: friendship._id,
        requesterId: regularUser._id,
        url: `/users/${regularUser._id}`,
        image: regularUser.avatar
      },
      actions: [
        { label: 'Akceptuj', action: 'accept', url: `/api/friendships/accept` },
        { label: 'Odrzuć', action: 'reject', url: `/api/friendships/reject` },
        { label: 'Zobacz profil', action: 'view', url: `/users/${regularUser._id}` }
      ]
    });
    await notification.save();
    console.log('✅ Powiadomienie zostało utworzone');

    // Sprawdź powiadomienia admina
    console.log('\n📋 Sprawdzam powiadomienia admina...');
    const adminNotifications = await Notification.find({ 
      user: admin._id,
      type: 'friend_request'
    }).sort({ createdAt: -1 }).limit(5);

    console.log(`📊 Admin ma ${adminNotifications.length} powiadomień o zaproszeniach:`);
    adminNotifications.forEach((notif, index) => {
      console.log(`  ${index + 1}. ${notif.title} - ${notif.message} (${notif.status})`);
    });

    // Sprawdź wszystkie powiadomienia admina
    console.log('\n📋 Wszystkie powiadomienia admina:');
    const allNotifications = await Notification.find({ user: admin._id }).sort({ createdAt: -1 });
    console.log(`📊 Admin ma ${allNotifications.length} powiadomień:`);
    allNotifications.forEach((notif, index) => {
      console.log(`  ${index + 1}. [${notif.type}] ${notif.title} - ${notif.status}`);
    });

    console.log('\n🎉 Test zakończony pomyślnie!');
    console.log('\n📝 Podsumowanie:');
    console.log(`- Admin: ${admin.firstName} ${admin.lastName} (${admin._id})`);
    console.log(`- Użytkownik: ${regularUser.firstName} ${regularUser.lastName} (${regularUser._id})`);
    console.log(`- Zaproszenie: ${friendship._id} (status: ${friendship.status})`);
    console.log(`- Powiadomienie: ${notification._id}`);

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Rozłączono z MongoDB');
  }
}

testFriendshipWithAdmin(); 