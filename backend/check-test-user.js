const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkTestUser() {
    console.log('🔍 Sprawdzanie użytkownika testowego...');
    
    try {
        // Połącz z bazą danych
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Połączono z bazą danych MongoDB');
        
        // Importuj model User
        const User = require('./models/userModel');
        
        // Znajdź użytkownika testowego
        const testUser = await User.findOne({ email: 'test2@example.com' });
        
        if (!testUser) {
            console.log('❌ Nie znaleziono użytkownika test2@example.com');
            return;
        }
        
        console.log('👤 Dane użytkownika:');
        console.log(`  Email: ${testUser.email}`);
        console.log(`  Username: ${testUser.username}`);
        console.log(`  IsActive: ${testUser.isActive}`);
        console.log(`  Hasło (hash): ${testUser.password}`);
        console.log(`  Role: ${testUser.roles}`);
        
        // Sprawdź czy hasło "password123" pasuje
        const testPassword = 'password123';
        const isPasswordValid = await bcrypt.compare(testPassword, testUser.password);
        
        console.log(`\n🔐 Test hasła "password123": ${isPasswordValid ? '✅ Prawidłowe' : '❌ Nieprawidłowe'}`);
        
        if (!isPasswordValid) {
            console.log('💡 Spróbujmy ustawić nowe hasło...');
            
            // Hashuj nowe hasło
            const saltRounds = 10;
            const newPasswordHash = await bcrypt.hash(testPassword, saltRounds);
            
            // Zaktualizuj hasło użytkownika
            testUser.password = newPasswordHash;
            await testUser.save();
            
            console.log('✅ Hasło zostało zaktualizowane na "password123"');
            
            // Sprawdź ponownie
            const isNewPasswordValid = await bcrypt.compare(testPassword, testUser.password);
            console.log(`🔐 Test nowego hasła: ${isNewPasswordValid ? '✅ Prawidłowe' : '❌ Nieprawidłowe'}`);
        }
        
    } catch (error) {
        console.error('❌ Błąd podczas sprawdzania użytkownika:', error);
    } finally {
        // Zamknij połączenie z bazą danych
        await mongoose.disconnect();
        console.log('🔌 Połączenie z bazą danych zamknięte');
    }
}

// Uruchom sprawdzenie
checkTestUser(); 