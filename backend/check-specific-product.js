const mongoose = require('mongoose');
require('dotenv').config();

// Połączenie z bazą danych
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const MarketplaceProduct = require('./models/marketplaceProductModel');
const User = require('./models/userModel');

async function checkProduct(productId) {
  try {
    console.log('🔍 Sprawdzanie produktu:', productId);
    
    // Sprawdź czy ID jest poprawnym ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log('❌ Nieprawidłowy format ID produktu');
      return;
    }
    
    // Znajdź produkt
    const product = await MarketplaceProduct.findById(productId)
      .populate('seller', 'username firstName lastName _id');
    
    if (!product) {
      console.log('❌ Produkt nie został znaleziony');
      return;
    }
    
    console.log('✅ Produkt znaleziony:');
    console.log('- ID:', product._id);
    console.log('- Nazwa:', product.name);
    console.log('- Cena:', product.price);
    console.log('- Sprzedawca:', product.seller?.username || 'Brak');
    console.log('- ID sprzedawcy:', product.seller?._id);
    console.log('- Aktywny:', product.isActive);
    console.log('- Dostępny:', product.isAvailable);
    console.log('- Stan magazynowy:', product.stock);
    
    // Sprawdź czy produkt ma sprzedawcę
    if (!product.seller) {
      console.log('⚠️ Produkt nie ma przypisanego sprzedawcy!');
    }
    
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania produktu:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Sprawdź produkt z argumentu wiersza poleceń
const productId = process.argv[2];
if (!productId) {
  console.log('❌ Podaj ID produktu jako argument');
  console.log('Przykład: node check-specific-product.js 688fc725bf18c64303fcdde2');
  process.exit(1);
}

checkProduct(productId); 