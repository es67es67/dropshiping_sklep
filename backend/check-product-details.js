const mongoose = require('mongoose');

async function checkProductDetails() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const ProductModel = require('./models/productModel');

    // Sprawdź produkty z odpowiednim stanem magazynowym
    const products = await ProductModel.find({ 
      isActive: true,
      stock: { $gt: 0 } // Produkty z dostępnym stanem magazynowym
    }).limit(5);
    
    console.log(`📦 Znaleziono ${products.length} produktów z dostępnym stanem magazynowym:`);
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Cena: ${product.price} zł`);
      console.log(`   Stan magazynowy: ${product.stock || 0}`);
      console.log(`   Kategoria: ${product.category}`);
      console.log(`   Aktywny: ${product.isActive ? 'Tak' : 'Nie'}`);
    });

    // Sprawdź wszystkie produkty i ich stan magazynowy
    const allProducts = await ProductModel.find({ isActive: true }).limit(10);
    console.log(`\n📊 Wszystkie aktywne produkty (${allProducts.length}):`);
    
    allProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - Stan: ${product.stock || 0}`);
    });

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Rozłączono z bazą danych');
  }
}

checkProductDetails(); 