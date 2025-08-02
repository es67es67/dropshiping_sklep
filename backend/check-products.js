const mongoose = require('mongoose');

async function checkProducts() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const ProductModel = require('./models/productModel');
    const ShopModel = require('./models/shopModel'); // Dodaję model Shop

    // Sprawdź wszystkie produkty
    const products = await ProductModel.find({}).limit(10).populate('shop', 'name');
    
    console.log(`📦 Znaleziono ${products.length} produktów:`);
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Cena: ${product.price} zł`);
      console.log(`   Kategoria: ${product.category}`);
      console.log(`   Sklep: ${product.shop?.name || 'Nieznany'}`);
      console.log(`   Aktywny: ${product.isActive ? 'Tak' : 'Nie'}`);
    });

    // Sprawdź produkty aktywne
    const activeProducts = await ProductModel.find({ isActive: true }).limit(5);
    console.log(`\n✅ Aktywnych produktów: ${activeProducts.length}`);

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Rozłączono z bazą danych');
  }
}

checkProducts(); 