
        const mongoose = require('mongoose');
        const User = require('./models/userModel');
        require('dotenv').config();
        
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        
        async function activateUsers() {
          try {
            const result = await User.updateMany(
              { isActive: { $exists: false } },
              { $set: { isActive: true } }
            );
            console.log('✅ Aktywowano użytkowników:', result.modifiedCount);
            process.exit(0);
          } catch (error) {
            console.error('❌ Błąd aktywacji:', error);
            process.exit(1);
          }
        }
        
        activateUsers();
      