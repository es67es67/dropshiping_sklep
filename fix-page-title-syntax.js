const fs = require('fs');
const path = require('path');

// Lista plików do sprawdzenia
const files = [
  'frontend/src/components/Cart.jsx',
  'frontend/src/components/MessagingSystem.jsx',
  'frontend/src/components/GamificationPanel.jsx',
  'frontend/src/components/Notifications.jsx',
  'frontend/src/components/ShopList.jsx',
  'frontend/src/components/ShopManagement.jsx',
  'frontend/src/components/ProductManagement.jsx',
  'frontend/src/components/ProductCreate.jsx',
  'frontend/src/components/ShopCreate.jsx',
  'frontend/src/components/Profile.jsx',
  'frontend/src/components/Search.jsx',
  'frontend/src/components/Settings.jsx',
  'frontend/src/components/Login.jsx',
  'frontend/src/components/Register.jsx'
];

function fixPageTitleSyntax(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Plik nie istnieje: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let fixed = false;
    
    // Napraw podwójne > w PageTitle
    if (content.includes('<PageTitle') && content.includes('/>>')) {
      content = content.replace(/<PageTitle[^>]*\/>>/g, (match) => {
        return match.replace('/>>', '/>');
      });
      fixed = true;
    }
    
    // Napraw niepoprawne wcięcia
    if (content.includes('<PageTitle') && !content.includes('        <PageTitle')) {
      content = content.replace(/(\s*)<PageTitle/g, '        <PageTitle');
      fixed = true;
    }
    
    // Napraw brakujące importy
    if (content.includes('PageTitle') && !content.includes("import PageTitle")) {
      const importMatch = content.match(/import React[^;]+;/);
      if (importMatch) {
        content = content.replace(
          importMatch[0],
          `${importMatch[0]}
import PageTitle from '../components/PageTitle';`
        );
        fixed = true;
      }
    }

    if (fixed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Naprawiono składnię w: ${filePath}`);
      return true;
    } else {
      console.log(`✅ Brak błędów w: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Błąd podczas naprawy ${filePath}:`, error.message);
    return false;
  }
}

// Uruchom naprawy
console.log('🔧 Naprawianie błędów składni PageTitle...\n');

let successCount = 0;
let totalCount = 0;

files.forEach(file => {
  totalCount++;
  if (fixPageTitleSyntax(file)) {
    successCount++;
  }
});

console.log(`\n📊 PODSUMOWANIE NAPRAW:`);
console.log(`✅ Pomyślnie naprawiono: ${successCount}/${totalCount}`);
console.log(`❌ Błędy: ${totalCount - successCount}`);

if (successCount === totalCount) {
  console.log('🎉 Wszystkie błędy składni zostały naprawione!');
} else {
  console.log('⚠️ Niektóre pliki nie zostały naprawione.');
} 