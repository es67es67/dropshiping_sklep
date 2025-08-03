const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Połączenie z bazą danych
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const MarketplaceProduct = require('./models/marketplaceProductModel');

async function cleanupOldUploads() {
  try {
    console.log('🧹 Czyszczenie starych plików z folderu uploads...');
    
    // Usuń wszystkie pliki z folderu uploads
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`📁 Znaleziono ${files.length} plików w folderze uploads`);
      
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️ Usunięto: ${file}`);
      }
      
      console.log('✅ Wszystkie pliki z folderu uploads zostały usunięte');
    }
    
    console.log('\n🔧 Aktualizacja bazy danych...');
    
    // Znajdź produkty z URL-ami z folderu uploads
    const productsWithUploadUrls = await MarketplaceProduct.find({
      $or: [
        { 'images': { $regex: /^\/uploads\// } },
        { 'mainImage': { $regex: /^\/uploads\// } }
      ]
    });
    
    console.log(`📦 Znaleziono ${productsWithUploadUrls.length} produktów z URL-ami z uploads`);
    
    for (const product of productsWithUploadUrls) {
      console.log(`\n🔍 Produkt: ${product.name} (ID: ${product._id})`);
      
      // Wyczyść URL-e z folderu uploads
      if (product.images && Array.isArray(product.images)) {
        const cleanImages = product.images.filter(img => !img.startsWith('/uploads/'));
        console.log(`  📷 Images: ${product.images.length} -> ${cleanImages.length}`);
        product.images = cleanImages;
      }
      
      // Wyczyść URL z mainImage
      if (product.mainImage && product.mainImage.startsWith('/uploads/')) {
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
    
    console.log('\n✅ Czyszczenie zakończone');
    
    // Sprawdź wyniki
    const remainingUploadUrls = await MarketplaceProduct.find({
      $or: [
        { 'images': { $regex: /^\/uploads\// } },
        { 'mainImage': { $regex: /^\/uploads\// } }
      ]
    });
    
    if (remainingUploadUrls.length === 0) {
      console.log('✅ Wszystkie URL-e z folderu uploads zostały usunięte');
    } else {
      console.log(`⚠️ Pozostało ${remainingUploadUrls.length} produktów z URL-ami z uploads`);
    }
    
  } catch (error) {
    console.error('❌ Błąd podczas czyszczenia:', error);
  } finally {
    mongoose.connection.close();
  }
}

cleanupOldUploads(); 