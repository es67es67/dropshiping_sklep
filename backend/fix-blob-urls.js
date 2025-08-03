const mongoose = require('mongoose');
require('dotenv').config();

// Połączenie z bazą danych
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const MarketplaceProduct = require('./models/marketplaceProductModel');

async function fixBlobUrls() {
  try {
    console.log('🔧 Naprawianie blob URL-i w bazie danych...');
    
    // Znajdź produkty z blob URL-ami
    const productsWithBlobUrls = await MarketplaceProduct.find({
      $or: [
        { 'images': { $regex: /^blob:/ } },
        { 'mainImage': { $regex: /^blob:/ } }
      ]
    });
    
    console.log(`📦 Znaleziono ${productsWithBlobUrls.length} produktów z blob URL-ami`);
    
    for (const product of productsWithBlobUrls) {
      console.log(`\n🔍 Produkt: ${product.name} (ID: ${product._id})`);
      
      // Wyczyść blob URL-e z images
      if (product.images && Array.isArray(product.images)) {
        const cleanImages = product.images.filter(img => !img.startsWith('blob:'));
        console.log(`  📷 Images: ${product.images.length} -> ${cleanImages.length}`);
        product.images = cleanImages;
      }
      
      // Wyczyść blob URL z mainImage
      if (product.mainImage && product.mainImage.startsWith('blob:')) {
        console.log(`  🖼️ MainImage: ${product.mainImage} -> null`);
        product.mainImage = null;
      }
      
      // Jeśli nie ma mainImage ale są images, ustaw pierwszy jako mainImage
      if (!product.mainImage && product.images && product.images.length > 0) {
        product.mainImage = product.images[0];
        console.log(`  🖼️ Ustawiono mainImage: ${product.mainImage}`);
      }
      
      await product.save();
      console.log(`  ✅ Zaktualizowano produkt`);
    }
    
    console.log('\n✅ Naprawa blob URL-i zakończona');
    
    // Sprawdź wyniki
    const remainingBlobUrls = await MarketplaceProduct.find({
      $or: [
        { 'images': { $regex: /^blob:/ } },
        { 'mainImage': { $regex: /^blob:/ } }
      ]
    });
    
    if (remainingBlobUrls.length === 0) {
      console.log('✅ Wszystkie blob URL-e zostały usunięte');
    } else {
      console.log(`⚠️ Pozostało ${remainingBlobUrls.length} produktów z blob URL-ami`);
    }
    
  } catch (error) {
    console.error('❌ Błąd podczas naprawy blob URL-i:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixBlobUrls(); 