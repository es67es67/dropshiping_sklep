// Skrypt sprawdzenia użytkownika testowego
const mongoose = require('mongoose');

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
        const testUser = await User.findOne({
            $or: [
                { email: 'test@example.com' },
                { username: 'testuser' },
                { email: 'test@portal.com' }
            ]
        });
        
        if (testUser) {
            console.log('✅ Znaleziono użytkownika testowego:');
            console.log('ID:', testUser._id);
            console.log('Email:', testUser.email);
            console.log('Username:', testUser.username);
            console.log('FirstName:', testUser.firstName);
            console.log('LastName:', testUser.lastName);
            console.log('Active:', testUser.isActive);
            console.log('Roles:', testUser.roles);
            console.log('Level:', testUser.level);
            console.log('Experience:', testUser.experience);
            console.log('Created:', testUser.createdAt);
        } else {
            console.log('❌ Nie znaleziono użytkownika testowego');
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