const fs = require('fs');

// Lista komponentów do naprawy
const components = [
  {
    file: 'frontend/src/components/GamificationPanel.jsx',
    title: 'Gamifikacja',
    description: 'System gamifikacji'
  },
  {
    file: 'frontend/src/components/Notifications.jsx',
    title: 'Powiadomienia',
    description: 'Centrum powiadomień'
  },
  {
    file: 'frontend/src/components/ShopManagement.jsx',
    title: 'Zarządzanie sklepami',
    description: 'Zarządzaj swoimi sklepami'
  },
  {
    file: 'frontend/src/components/ProductManagement.jsx',
    title: 'Zarządzanie produktami',
    description: 'Zarządzaj swoimi produktami'
  },
  {
    file: 'frontend/src/components/ProductCreate.jsx',
    title: 'Utwórz produkt',
    description: 'Dodaj nowy produkt'
  },
  {
    file: 'frontend/src/components/ShopCreate.jsx',
    title: 'Utwórz sklep',
    description: 'Dodaj nowy sklep'
  },
  {
    file: 'frontend/src/components/Profile.jsx',
    title: 'Mój profil',
    description: 'Edytuj swój profil'
  },
  {
    file: 'frontend/src/components/Search.jsx',
    title: 'Wyszukiwanie',
    description: 'Wyszukuj w portalu'
  },
  {
    file: 'frontend/src/components/Settings.jsx',
    title: 'Ustawienia',
    description: 'Ustawienia konta'
  },
  {
    file: 'frontend/src/components/Login.jsx',
    title: 'Logowanie',
    description: 'Zaloguj się do portalu'
  },
  {
    file: 'frontend/src/components/Register.jsx',
    title: 'Rejestracja',
    description: 'Zarejestruj się w portalu'
  }
];

function fixComponent(component) {
  try {
    if (!fs.existsSync(component.file)) {
      console.log(`⚠️ Plik nie istnieje: ${component.file}`);
      return false;
    }

    let content = fs.readFileSync(component.file, 'utf8');
    
    // Sprawdź czy PageTitle już jest w głównym return
    const mainReturnMatch = content.match(/return\s*\(\s*<([^>]+)>/);
    if (mainReturnMatch) {
      const containerName = mainReturnMatch[1].split(' ')[0];
      
      // Sprawdź czy PageTitle już jest w głównym return
      const returnStart = content.indexOf('return (');
      const returnEnd = content.indexOf('</' + containerName + '>', returnStart);
      const returnContent = content.substring(returnStart, returnEnd);
      
      if (!returnContent.includes('<PageTitle')) {
        // Dodaj PageTitle do głównego return
        const containerOpen = `<${containerName}`;
        const containerOpenWithTitle = `<${containerName}>\n      <PageTitle title="${component.title}" description="${component.description}" />`;
        
        content = content.replace(containerOpen, containerOpenWithTitle);
        
        // Dodaj import jeśli nie istnieje
        if (!content.includes('import PageTitle')) {
          content = content.replace(
            /import React[^;]+;/,
            `import React from 'react';
import PageTitle from '../components/PageTitle';`
          );
        }
        
        fs.writeFileSync(component.file, content, 'utf8');
        console.log(`✅ Naprawiono: ${component.file}`);
        return true;
      } else {
        console.log(`✅ Już OK: ${component.file}`);
        return true;
      }
    }
    
    console.log(`⚠️ Nie znaleziono return w: ${component.file}`);
    return false;
  } catch (error) {
    console.error(`❌ Błąd: ${component.file}`, error.message);
    return false;
  }
}

console.log('🔧 Szybkie naprawianie tytułów...\n');

let successCount = 0;
components.forEach(component => {
  if (fixComponent(component)) {
    successCount++;
  }
});

console.log(`\n📊 Naprawiono: ${successCount}/${components.length}`); 