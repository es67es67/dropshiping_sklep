const mongoose = require('mongoose');
const MarketplaceProduct = require('./models/marketplaceProductModel');

const updateProductsWithLocalImages = async () => {
  try {
    console.log('🔄 Aktualizacja produktów z lokalnymi zdjęciami...');
    
    // Połącz z bazą danych MongoDB Atlas
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z bazą danych MongoDB');

    // Lokalne ścieżki do zdjęć
    const localImages = [
      '/images/products/product_1.jpg',
      '/images/products/product_2.jpg',
      '/images/products/product_3.jpg',
      '/images/products/product_4.jpg',
      '/images/products/product_5.jpg',
      '/images/products/product_6.jpg',
      '/images/products/product_7.jpg',
      '/images/products/product_8.jpg',
      '/images/products/product_10.jpg',
      '/images/products/product_11.jpg',
      '/images/products/product_12.jpg',
      '/images/products/product_13.jpg',
      '/images/products/product_14.jpg',
      '/images/products/product_15.jpg',
      '/images/products/product_16.jpg',
      '/images/products/product_17.jpg',
      '/images/products/product_18.jpg',
      '/images/products/product_19.jpg',
      '/images/products/product_20.jpg',
      '/images/products/product_21.jpg',
      '/images/products/product_22.jpg',
      '/images/products/product_23.jpg',
      '/images/products/product_24.jpg'
    ];

    // Pobierz wszystkie produkty
    const products = await MarketplaceProduct.find({});
    console.log(`📊 Znaleziono ${products.length} produktów do aktualizacji`);

    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageIndex = i % localImages.length;
      const mainImage = localImages[imageIndex];
      
      // Wybierz 1-3 dodatkowe zdjęcia dla galerii
      const additionalImages = [];
      const numAdditional = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < numAdditional; j++) {
        const additionalIndex = (imageIndex + j + 1) % localImages.length;
        if (localImages[additionalIndex] !== mainImage) {
          additionalImages.push(localImages[additionalIndex]);
        }
      }
      
      const allImages = [mainImage, ...additionalImages];

      try {
        await MarketplaceProduct.findByIdAndUpdate(product._id, {
          mainImage: mainImage,
          images: allImages
        });
        
        console.log(`✅ Zaktualizowano produkt ${i + 1}: ${product.name}`);
        console.log(`   Główne zdjęcie: ${mainImage}`);
        console.log(`   Liczba zdjęć: ${allImages.length}`);
        
        updatedCount++;
      } catch (error) {
        console.error(`❌ Błąd aktualizacji produktu ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 PODSUMOWANIE AKTUALIZACJI:`);
    console.log(`✅ Zaktualizowano: ${updatedCount} produktów`);
    console.log(`❌ Błędy: ${errorCount} produktów`);
    console.log(`📁 Używane ścieżki lokalne: /images/products/`);

    await mongoose.disconnect();
    console.log('\n🔚 Rozłączono z bazą danych');

  } catch (error) {
    console.error('❌ Błąd:', error);
  }
};

updateProductsWithLocalImages(); 