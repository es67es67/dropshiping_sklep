const mongoose = require('mongoose');
const Shop = require('./models/shopModel');
require('dotenv').config();

async function fixShopCategories() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    // Znajdź sklepy z problemami
    const shopsWithIssues = await Shop.find({ 
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' },
        { email: { $exists: false } },
        { email: null },
        { email: '' },
        { 'address.city': { $exists: false } },
        { 'address.city': null },
        { 'address.city': '' }
      ]
    });

    console.log(`📊 Znaleziono ${shopsWithIssues.length} sklepów z problemami`);

    if (shopsWithIssues.length > 0) {
      // Napraw sklepy
      for (const shop of shopsWithIssues) {
        let updated = false;
        
        // Napraw kategorię
        if (!shop.category || shop.category === '') {
          shop.category = 'Ogólne';
          updated = true;
        }
        
        // Napraw email
        if (!shop.email || shop.email === '') {
          shop.email = `kontakt@${shop.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.pl`;
          updated = true;
        }
        
        // Napraw adres miasta
        if (!shop.address) {
          shop.address = {};
        }
        if (!shop.address.city || shop.address.city === '') {
          shop.address.city = 'Warszawa';
          updated = true;
        }
        
        if (updated) {
          await shop.save();
          console.log(`✅ Naprawiono sklep: ${shop.name} (ID: ${shop._id})`);
        }
      }
      
      console.log(`🎉 Naprawiono ${shopsWithIssues.length} sklepów`);
    } else {
      console.log('✅ Wszystkie sklepy są poprawne');
    }

    // Sprawdź czy wszystkie sklepy są teraz poprawne
    const totalShops = await Shop.countDocuments();
    const validShops = await Shop.countDocuments({ 
      category: { $exists: true, $ne: null, $ne: '' },
      email: { $exists: true, $ne: null, $ne: '' },
      'address.city': { $exists: true, $ne: null, $ne: '' }
    });

    console.log(`📊 Podsumowanie:`);
    console.log(`   Wszystkich sklepów: ${totalShops}`);
    console.log(`   Poprawnych sklepów: ${validShops}`);
    console.log(`   Sklepów z problemami: ${totalShops - validShops}`);

  } catch (error) {
    console.error('❌ Błąd podczas naprawy sklepów:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

fixShopCategories(); 