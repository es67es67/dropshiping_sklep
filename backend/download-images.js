const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadImages = async () => {
  try {
    console.log('📥 Pobieranie zdjęć z Unsplash...');
    
    // Utwórz folder na zdjęcia jeśli nie istnieje
    const imagesDir = path.join(__dirname, 'public', 'images', 'products');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log('✅ Utworzono folder:', imagesDir);
    }
    
    // Lista zdjęć do pobrania (różne kategorie)
    const imageUrls = [
      // Motoryzacja
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
      
      // Elektronika
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      
      // Zabawki
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1596461404969-9b9a0a07d804?w=400&h=300&fit=crop',
      
      // Sport
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      
      // Książki
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      
      // Ubrania
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      
      // Dom i ogród
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      
      // Zdrowie i uroda
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    ];
    
    console.log(`📊 Pobieranie ${imageUrls.length} zdjęć...`);
    
    let downloadedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const fileName = `product_${i + 1}.jpg`;
      const filePath = path.join(imagesDir, fileName);
      
      try {
        console.log(`📥 Pobieranie ${i + 1}/${imageUrls.length}: ${fileName}`);
        
        const response = await axios({
          method: 'GET',
          url: imageUrl,
          responseType: 'stream',
          timeout: 10000
        });
        
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', () => {
            console.log(`✅ Pobrano: ${fileName}`);
            downloadedCount++;
            resolve();
          });
          writer.on('error', reject);
        });
        
      } catch (error) {
        console.error(`❌ Błąd pobierania ${fileName}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 PODSUMOWANIE:`);
    console.log(`✅ Pobrano: ${downloadedCount} zdjęć`);
    console.log(`❌ Błędy: ${errorCount} zdjęć`);
    console.log(`📁 Lokalizacja: ${imagesDir}`);
    
    // Wygeneruj listę lokalnych ścieżek
    const localPaths = [];
    for (let i = 0; i < imageUrls.length; i++) {
      const fileName = `product_${i + 1}.jpg`;
      const filePath = path.join(imagesDir, fileName);
      if (fs.existsSync(filePath)) {
        localPaths.push(`/images/products/${fileName}`);
      }
    }
    
    console.log(`\n📋 Lista lokalnych ścieżek:`);
    localPaths.forEach((path, index) => {
      console.log(`${index + 1}. ${path}`);
    });
    
  } catch (error) {
    console.error('❌ Błąd podczas pobierania zdjęć:', error.message);
  }
};

downloadImages(); 