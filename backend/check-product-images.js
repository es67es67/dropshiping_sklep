const mongoose = require('mongoose');
const MarketplaceProduct = require('./models/marketplaceProductModel');

const checkProductImages = async () => {
  try {
    console.log('🖼️ Sprawdzanie zdjęć produktów...');
    
    // Połącz z bazą danych MongoDB Atlas
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych MongoDB');

    // Pobierz kilka produktów z ich zdjęciami
    const products = await MarketplaceProduct.find({}).limit(5);
    
    console.log(`📊 Znaleziono ${products.length} produktów do sprawdzenia`);
    
    products.forEach((product, index) => {
      console.log(`\n📦 Produkt ${index + 1}: ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Główne zdjęcie: ${product.mainImage || 'BRAK'}`);
      console.log(`   Liczba zdjęć: ${product.images ? product.images.length : 0}`);
      
      if (product.images && product.images.length > 0) {
        console.log(`   Zdjęcia:`);
        product.images.forEach((image, imgIndex) => {
          console.log(`     ${imgIndex + 1}. ${image}`);
        });
      }
      
      console.log(`   Kategoria: ${product.category}`);
      console.log(`   Lokalizacja: ${product.location?.city || 'BRAK'}`);
    });

    // Sprawdź czy są jakieś produkty bez zdjęć
    const productsWithoutImages = await MarketplaceProduct.find({
      $or: [
        { mainImage: { $exists: false } },
        { mainImage: null },
        { mainImage: '' },
        { images: { $exists: false } },
        { images: { $size: 0 } }
      ]
    });

    console.log(`\n❌ Produkty bez zdjęć: ${productsWithoutImages.length}`);
    
    if (productsWithoutImages.length > 0) {
      console.log('Lista produktów bez zdjęć:');
      productsWithoutImages.slice(0, 5).forEach(product => {
        console.log(`   - ${product.name} (ID: ${product._id})`);
      });
    }

    // Sprawdź czy są produkty ze zdjęciami
    const productsWithImages = await MarketplaceProduct.find({
      $and: [
        { mainImage: { $exists: true } },
        { mainImage: { $ne: null } },
        { mainImage: { $ne: '' } }
      ]
    });

    console.log(`\n✅ Produkty ze zdjęciami: ${productsWithImages.length}`);

    await mongoose.disconnect();
    console.log('\n🔚 Rozłączono z bazą danych');

  } catch (error) {
    console.error('❌ Błąd:', error);
  }
};

checkProductImages(); 