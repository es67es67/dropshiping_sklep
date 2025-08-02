const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const ErrorModel = require('./models/errorModel');
const User = require('./models/userModel');

async function checkRegistrationErrors() {
  try {
    console.log('🔍 Sprawdzam błędy rejestracji w bazie danych...\n');

    // Sprawdź wszystkie błędy związane z rejestracją
    const registrationErrors = await ErrorModel.find({
      $or: [
        { 'context.additionalData.action': 'register' },
        { route: /register/ },
        { url: /register/ },
        { message: /rejestracja|register|walidacji/ }
      ]
    }).sort({ timestamp: -1 }).limit(20);

    console.log(`📊 Znaleziono ${registrationErrors.length} błędów rejestracji:`);
    
    if (registrationErrors.length === 0) {
      console.log('✅ Brak błędów rejestracji w bazie danych');
    } else {
      registrationErrors.forEach((error, index) => {
        console.log(`\n${index + 1}. Błąd rejestracji:`);
        console.log(`   📅 Data: ${error.timestamp.toLocaleString('pl-PL')}`);
        console.log(`   📝 Wiadomość: ${error.message}`);
        console.log(`   🏷️  Typ: ${error.type}`);
        console.log(`   ⚠️  Ważność: ${error.severity}`);
        console.log(`   🔗 URL: ${error.url}`);
        
        if (error.context && error.context.additionalData) {
          const data = error.context.additionalData;
          console.log(`   📋 Akcja: ${data.action || 'brak'}`);
          if (data.requestData) {
            console.log(`   👤 Dane: ${JSON.stringify(data.requestData)}`);
          }
          if (data.validationErrors && data.validationErrors.length > 0) {
            console.log(`   ❌ Błędy walidacji: ${data.validationErrors.join(', ')}`);
          }
        }
      });
    }

    // Sprawdź statystyki błędów
    console.log('\n📈 Statystyki błędów:');
    const stats = await ErrorModel.getErrorStats();
    if (stats.length > 0) {
      const stat = stats[0];
      console.log(`   📊 Wszystkie błędy: ${stat.totalErrors}`);
      console.log(`   🔴 Krytyczne: ${stat.criticalErrors}`);
      console.log(`   🟠 Wysokie: ${stat.highErrors}`);
      console.log(`   🟡 Średnie: ${stat.mediumErrors}`);
      console.log(`   🟢 Niskie: ${stat.lowErrors}`);
      console.log(`   ✅ Rozwiązane: ${stat.resolvedErrors}`);
      console.log(`   🆕 Nowe: ${stat.newErrors}`);
    }

    // Sprawdź błędy według typu
    console.log('\n📋 Błędy według typu:');
    const errorsByType = await ErrorModel.getErrorsByType();
    errorsByType.forEach(type => {
      console.log(`   ${type._id}: ${type.count} (krytyczne: ${type.critical}, wysokie: ${type.high})`);
    });

    // Sprawdź ostatnie użytkowników
    console.log('\n👥 Ostatni zarejestrowani użytkownicy:');
    const recentUsers = await User.find({})
      .select('username email firstName lastName createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`   Znaleziono ${recentUsers.length} użytkowników:`);
    recentUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.firstName} ${user.lastName} - ${user.createdAt.toLocaleString('pl-PL')}`);
    });

    // Sprawdź błędy walidacji
    console.log('\n🔍 Szczegółowe błędy walidacji:');
    const validationErrors = await ErrorModel.find({
      message: /walidacji|validation/
    }).sort({ timestamp: -1 }).limit(10);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.message} - ${error.timestamp.toLocaleString('pl-PL')}`);
        if (error.context && error.context.additionalData && error.context.additionalData.validationErrors) {
          console.log(`      Błędy: ${error.context.additionalData.validationErrors.join(', ')}`);
        }
      });
    } else {
      console.log('   ✅ Brak błędów walidacji');
    }

  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania błędów:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Uruchom sprawdzanie
checkRegistrationErrors(); 