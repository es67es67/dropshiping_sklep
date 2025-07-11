const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
const Location = require('./models/locationModel');
require('dotenv').config();

async function testShops() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Check if there are any shops in the database
    const totalShops = await Shop.countDocuments();
    console.log(`📊 Total shops in database: ${totalShops}`);

    // Get all active shops
    const activeShops = await Shop.find({ isActive: true });
    console.log(`🏪 Active shops: ${activeShops.length}`);

    if (activeShops.length > 0) {
      console.log('📋 Sample shop data:');
      console.log(JSON.stringify(activeShops[0], null, 2));
    } else {
      console.log('❌ No active shops found in database');
    }

    // Test the getAllShops query (same as in controller)
    const testQuery = await Shop.find({ isActive: true })
      .populate('owner', 'username firstName lastName avatar')
      .populate('location', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    
    console.log(`🔍 Test query result: ${testQuery.length} shops`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testShops(); 