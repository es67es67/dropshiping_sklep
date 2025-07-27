
        const mongoose = require('mongoose');
        const User = require('./models/userModel');
        require('dotenv').config();
        
        // Konfiguracja połączenia z MongoDB
        const connectDB = async () => {
          try {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal', {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              serverSelectionTimeoutMS: 5000, // 5 sekund timeout
              socketTimeoutMS: 45000, // 45 sekund timeout
            });
            console.log('✅ Połączono z MongoDB');
          } catch (error) {
            console.error('❌ Błąd połączenia z MongoDB:', error.message);
            process.exit(1);
          }
        };
        
        // Funkcja aktywacji użytkowników
        const activateUsers = async () => {
          try {
            await connectDB();
            
            // Znajdź wszystkich użytkowników bez pola isActive
            const usersToActivate = await User.find({ isActive: { $exists: false } });
            console.log(`🔍 Znaleziono ${usersToActivate.length} użytkowników do aktywacji`);
            
            if (usersToActivate.length === 0) {
              console.log('✅ Wszyscy użytkownicy są już aktywni');
              process.exit(0);
            }
            
            // Aktywuj użytkowników
            const result = await User.updateMany(
              { isActive: { $exists: false } },
              { $set: { isActive: true } }
            );
            
            console.log(`✅ Aktywowano ${result.modifiedCount} użytkowników`);
            
            // Sprawdź czy wszystkie konta są aktywne
            const totalUsers = await User.countDocuments();
            const activeUsers = await User.countDocuments({ isActive: true });
            
            console.log(`📊 Statystyki użytkowników:`);
            console.log(`   - Wszystkich użytkowników: ${totalUsers}`);
            console.log(`   - Aktywnych użytkowników: ${activeUsers}`);
            
          } catch (error) {
            console.error('❌ Błąd podczas aktywacji użytkowników:', error.message);
          } finally {
            await mongoose.disconnect();
            console.log('🔌 Rozłączono z MongoDB');
          }
        };
        
        // Uruchom skrypt
        activateUsers();
      