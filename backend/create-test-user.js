// Skrypt utworzenia użytkownika testowego
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Konfiguracja połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

async function createTestUser() {
    console.log('🔧 Tworzenie użytkownika testowego...');
    
    try {
        // Połącz z bazą danych
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Połączono z bazą danych MongoDB');
        
        // Importuj model User
        const User = require('./models/userModel');
        
        // Sprawdź czy użytkownik już istnieje
        const existingUser = await User.findOne({
            $or: [
                { email: 'test@example.com' },
                { username: 'testuser' }
            ]
        });
        
        if (existingUser) {
            console.log('⚠️ Użytkownik testowy już istnieje:', existingUser.email);
            console.log('ID:', existingUser._id);
            console.log('Username:', existingUser.username);
            console.log('Active:', existingUser.isActive);
            
            // Aktywuj użytkownika jeśli nie jest aktywny
            if (!existingUser.isActive) {
                existingUser.isActive = true;
                await existingUser.save();
                console.log('✅ Użytkownik został aktywowany');
            }
            
            return;
        }
        
        // Hashuj hasło
        const hashedPassword = await bcrypt.hash('password123', 12);
        
        // Utwórz nowego użytkownika testowego
        const testUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: hashedPassword,
            firstName: 'Test',
            lastName: 'User',
            isActive: true,
            roles: ['user'],
            level: 1,
            experience: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // Zapisz użytkownika
        await testUser.save();
        
        console.log('✅ Użytkownik testowy został utworzony!');
        console.log('Email: test@example.com');
        console.log('Username: testuser');
        console.log('Password: password123');
        console.log('ID:', testUser._id);
        console.log('Active:', testUser.isActive);
        
    } catch (error) {
        console.error('❌ Błąd podczas tworzenia użytkownika:', error);
    } finally {
        // Zamknij połączenie z bazą danych
        await mongoose.disconnect();
        console.log('🔌 Połączenie z bazą danych zamknięte');
    }
}

// Uruchom tworzenie użytkownika
createTestUser(); 