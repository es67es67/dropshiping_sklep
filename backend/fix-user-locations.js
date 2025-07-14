const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

async function fixUserLocations() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Napraw użytkowników z nieprawidłowym polem location
    const result1 = await User.updateMany(
      { location: { $type: "string" } },
      { $unset: { location: "" } }
    );
    console.log(`✅ Usunięto nieprawidłowe location z ${result1.modifiedCount} użytkowników`);

    // Dodaj role do użytkowników bez ról
    const result2 = await User.updateMany(
      { $or: [{ roles: { $exists: false } }, { roles: { $size: 0 } }] },
      { $set: { roles: ['user'] } }
    );
    console.log(`✅ Dodano role do ${result2.modifiedCount} użytkowników`);

    // Sprawdź wyniki
    const users = await User.find().select('username email roles location').lean();
    console.log('📋 Lista użytkowników po naprawie:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - role: ${user.roles?.join(', ') || 'brak'} - location: ${user.location || 'brak'}`);
    });

    console.log('✅ Wszystkie użytkownicy zostały zaktualizowani');

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

fixUserLocations().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  process.exit(1);
}); 