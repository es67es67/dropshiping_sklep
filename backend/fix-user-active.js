const mongoose = require('mongoose');
require('dotenv').config();

async function fixUserActive() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Get User model
    const User = require('./models/userModel');

    // Find user with email FF@RRF.PL
    const user = await User.findOne({ email: 'FF@RRF.PL' });
    
    if (!user) {
      console.log('❌ User FF@RRF.PL not found');
      return;
    }

    console.log('👤 Found user:', user.username);
    console.log('📧 Email:', user.email);
    console.log('🔍 Current isActive value:', user.isActive);

    // Check if isActive field exists
    if (user.isActive === undefined) {
      console.log('⚠️  isActive field does not exist, adding it...');
      
      // Add isActive field to user document
      user.isActive = true;
      await user.save();
      
      console.log('✅ Added isActive = true to user');
    } else if (user.isActive === false) {
      console.log('⚠️  User is inactive, activating...');
      
      // Activate user
      user.isActive = true;
      await user.save();
      
      console.log('✅ Activated user (isActive = true)');
    } else {
      console.log('✅ User is already active');
    }

    // Verify the change
    const updatedUser = await User.findOne({ email: 'FF@RRF.PL' });
    console.log('🔍 Updated isActive value:', updatedUser.isActive);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixUserActive(); 