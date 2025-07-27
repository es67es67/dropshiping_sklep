// Skrypt sprawdzenia ról użytkownika testowego
const mongoose = require('mongoose');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserRoles() {
    console.log('🔍 Sprawdzanie ról użytkownika testowego...');
    
    try {
        // Połącz z bazą danych
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Połączono z bazą danych MongoDB');
        
        // Importuj model User
        const User = require('./models/userModel');
        
        // Znajdź użytkownika testowego
        const testUser = await User.findOne({ username: 'testuser' });
        
        if (testUser) {
            console.log('✅ Znaleziono użytkownika testowego:');
            console.log('ID:', testUser._id);
            console.log('Email:', testUser.email);
            console.log('Username:', testUser.username);
            console.log('Roles:', testUser.roles);
            console.log('IsActive:', testUser.isActive);
            console.log('Level:', testUser.level);
            console.log('Experience:', testUser.experience);
            
            // Sprawdź czy użytkownik ma rolę admin
            if (testUser.roles && testUser.roles.includes('admin')) {
                console.log('✅ Użytkownik ma rolę administratora');
            } else {
                console.log('❌ Użytkownik NIE ma roli administratora');
                console.log('💡 Dodaję rolę administratora...');
                
                // Dodaj rolę administratora
                if (!testUser.roles) {
                    testUser.roles = ['admin'];
                } else {
                    testUser.roles.push('admin');
                }
                
                await testUser.save();
                console.log('✅ Rola administratora została dodana');
                console.log('Nowe role:', testUser.roles);
            }
        } else {
            console.log('❌ Nie znaleziono użytkownika testuser');
        }
        
    } catch (error) {
        console.error('❌ Błąd podczas sprawdzania ról:', error);
    } finally {
        // Zamknij połączenie z bazą danych
        await mongoose.disconnect();
        console.log('🔌 Połączenie z bazą danych zamknięte');
    }
}

// Uruchom sprawdzenie
checkUserRoles(); 