const mongoose = require('mongoose');

// Połączenie z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Model produktu marketplace
const marketplaceProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  seller: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  stock: Number,
  saleType: String,
  auction: {
    startPrice: Number,
    currentPrice: Number,
    minIncrement: Number,
    endTime: Date,
    bids: [{
      bidder: mongoose.Schema.Types.ObjectId,
      amount: Number,
      timestamp: Date
    }],
    isActive: Boolean
  }
});

const MarketplaceProduct = mongoose.model('MarketplaceProduct', marketplaceProductSchema);

async function findAuctions() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n🔍 Szukam produktów aukcyjnych...');
    console.log('=====================================');

    // Znajdź produkty z saleType = 'auction'
    const auctions = await MarketplaceProduct.find({ saleType: 'auction' });
    
    console.log(`\n📊 Znaleziono ${auctions.length} aukcji:`);
    
    if (auctions.length === 0) {
      console.log('❌ Brak aukcji w bazie danych');
      
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
      
      return;
    }

    auctions.forEach((auction, index) => {
      console.log(`\n${index + 1}. ${auction.name}`);
      console.log(`   ID: ${auction._id}`);
      console.log(`   Cena: ${auction.price} zł`);
      console.log(`   Kategoria: ${auction.category}`);
      console.log(`   Aktywny: ${auction.isActive}`);
      console.log(`   SaleType: ${auction.saleType}`);
      
      if (auction.auction) {
        console.log(`   🏷️ Aukcja:`);
        console.log(`     Start Price: ${auction.auction.startPrice}`);
        console.log(`     Current Price: ${auction.auction.currentPrice}`);
        console.log(`     Min Increment: ${auction.auction.minIncrement}`);
        console.log(`     End Time: ${auction.auction.endTime}`);
        console.log(`     Is Active: ${auction.auction.isActive}`);
        console.log(`     Bids Count: ${auction.auction.bids?.length || 0}`);
      }
    });

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

findAuctions(); 