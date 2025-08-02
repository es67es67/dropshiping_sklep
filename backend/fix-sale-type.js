const mongoose = require('mongoose');
require('dotenv').config();

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const MarketplaceProduct = require('./models/marketplaceProductModel');

async function fixSaleType() {
  try {
    console.log('🔧 Naprawianie saleType dla produktów...');
    
    // Znajdź produkty z niepoprawnym saleType
    const productsWithWrongSaleType = await MarketplaceProduct.find({
      $or: [
        { saleType: { $exists: false } },
        { saleType: null },
        { saleType: 'fixed' }  // Niepoprawna wartość
      ]
    });
    
    console.log(`📦 Znaleziono ${productsWithWrongSaleType.length} produktów do naprawy`);
    
    if (productsWithWrongSaleType.length > 0) {
      // Zaktualizuj wszystkie produkty z niepoprawnym saleType
      const result = await MarketplaceProduct.updateMany(
        {
          $or: [
            { saleType: { $exists: false } },
            { saleType: null },
            { saleType: 'fixed' }
          ]
        },
        {
          $set: { saleType: 'fixed_price' }
        }
      );
      
      console.log(`✅ Zaktualizowano ${result.modifiedCount} produktów`);
    }
    
    // Sprawdź wszystkie typy sprzedaży
    const saleTypes = await MarketplaceProduct.aggregate([
      {
        $group: {
          _id: '$saleType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Statystyki typów sprzedaży:');
    saleTypes.forEach(type => {
      console.log(`  ${type._id || 'brak'}: ${type.count} produktów`);
    });
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z bazą danych');
  }
}

fixSaleType(); 