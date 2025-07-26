// Skrypt aktywacji użytkownika testowego
const mongoose = require('mongoose');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function activateTestUser() {
    console.log('🔧 Aktywacja użytkownika testowego...');
    
    try {
        // Połącz z bazą danych
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Połączono z bazą danych MongoDB');
        
        // Importuj model User
        const User = require('./models/userModel');
        
        // Znajdź użytkownika testowego (może być kilka)
        const testUsers = await User.find({
            $or: [
                { email: /test.*@example\.com/ },
                { username: /testuser/i },
                { firstName: /TestUser/i }
            ]
        });
        
        console.log(`📋 Znaleziono ${testUsers.length} użytkowników testowych`);
        
        if (testUsers.length === 0) {
            console.log('❌ Nie znaleziono użytkowników testowych');
            return;
        }
        
        // Aktywuj wszystkich użytkowników testowych
        for (const user of testUsers) {
            console.log(`👤 Aktywuję użytkownika: ${user.email || user.username} (ID: ${user._id})`);
            
            // Dodaj pole isActive jeśli nie istnieje
            if (user.isActive === undefined) {
                user.isActive = true;
                console.log('  ➕ Dodano pole isActive = true');
            } else {
                user.isActive = true;
                console.log('  ✅ Ustawiono isActive = true');
            }
            
            // Upewnij się, że użytkownik ma wszystkie wymagane pola
            if (!user.roles) {
                user.roles = ['user'];
                console.log('  ➕ Dodano role: user');
            }
            
            if (!user.level) {
                user.level = 1;
                console.log('  ➕ Dodano level: 1');
            }
            
            if (!user.experience) {
                user.experience = 0;
                console.log('  ➕ Dodano experience: 0');
            }
            
            // Zapisz zmiany
            await user.save();
            console.log(`  ✅ Użytkownik ${user.email || user.username} został aktywowany`);
        }
        
        console.log('\n🎉 Wszyscy użytkownicy testowi zostali aktywowani!');
        
    } catch (error) {
        console.error('❌ Błąd podczas aktywacji użytkownika:', error);
    } finally {
        // Zamknij połączenie z bazą danych
        await mongoose.disconnect();
        console.log('🔌 Połączenie z bazą danych zamknięte');
    }
}

// Uruchom aktywację
activateTestUser(); 