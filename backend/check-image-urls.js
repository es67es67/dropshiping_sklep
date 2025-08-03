const axios = require('axios');

const checkImageUrls = async () => {
  try {
    console.log('🔍 Sprawdzanie dostępności linków do zdjęć...');
    
    const testUrls = [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    ];
    
    for (const url of testUrls) {
      try {
        console.log(`\\n📡 Sprawdzanie: ${url}`);
        const response = await axios.head(url);
        console.log(`✅ Status: ${response.status} - ${response.statusText}`);
        console.log(`📏 Content-Type: ${response.headers['content-type']}`);
        console.log(`📏 Content-Length: ${response.headers['content-length']}`);
      } catch (error) {
        console.error(`❌ Błąd: ${error.message}`);
        if (error.response) {
          console.error(`   Status: ${error.response.status}`);
          console.error(`   Headers:`, error.response.headers);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania URL-i:', error.message);
  }
};

checkImageUrls(); 