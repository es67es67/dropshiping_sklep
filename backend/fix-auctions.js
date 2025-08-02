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

async function fixAuctions() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    console.log('\n🔧 Naprawiam dane aukcji...');
    console.log('=====================================');

    // Znajdź wszystkie aukcje
    const auctions = await MarketplaceProduct.find({ saleType: 'auction' });
    
    console.log(`\n📊 Znaleziono ${auctions.length} aukcji do naprawy`);
    
    let fixedCount = 0;
    
    for (const auction of auctions) {
      let needsUpdate = false;
      
      // Sprawdź czy aukcja ma ustawione dane
      if (!auction.auction.startPrice) {
        auction.auction.startPrice = auction.price;
        needsUpdate = true;
      }
      
      if (!auction.auction.currentPrice) {
        auction.auction.currentPrice = auction.price;
        needsUpdate = true;
      }
      
      if (!auction.auction.endTime) {
        // Ustaw czas końca aukcji na 7 dni od teraz
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 7);
        auction.auction.endTime = endTime;
        needsUpdate = true;
      }
      
      if (!auction.auction.isActive) {
        auction.auction.isActive = true;
        needsUpdate = true;
      }
      
      if (!auction.auction.minIncrement) {
        auction.auction.minIncrement = 1;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await auction.save();
        fixedCount++;
        console.log(`✅ Naprawiono aukcję: ${auction.name}`);
      }
    }
    
    console.log(`\n🎉 Naprawiono ${fixedCount} aukcji`);
    
    // Sprawdź przykładową aukcję
    const sampleAuction = await MarketplaceProduct.findOne({ saleType: 'auction' });
    if (sampleAuction) {
      console.log('\n📋 Przykładowa naprawiona aukcja:');
      console.log(`Nazwa: ${sampleAuction.name}`);
      console.log(`Start Price: ${sampleAuction.auction.startPrice}`);
      console.log(`Current Price: ${sampleAuction.auction.currentPrice}`);
      console.log(`End Time: ${sampleAuction.auction.endTime}`);
      console.log(`Is Active: ${sampleAuction.auction.isActive}`);
    }

    console.log('\n🔌 Połączenie z MongoDB zamknięte');
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

fixAuctions(); 