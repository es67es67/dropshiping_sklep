const fs = require('fs');
const path = require('path');

// Lista komponentów do sprawdzenia
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
    title: 'Profil',
    description: 'Twój profil użytkownika'
  },
  {
    file: 'frontend/src/components/Search.jsx',
    title: 'Wyszukiwanie',
    description: 'Wyszukaj produkty i sklepy'
  },
  {
    file: 'frontend/src/components/Settings.jsx',
    title: 'Ustawienia',
    description: 'Ustawienia konta'
  },
  {
    file: 'frontend/src/components/Login.jsx',
    title: 'Logowanie',
    description: 'Zaloguj się do systemu'
  },
  {
    file: 'frontend/src/components/Register.jsx',
    title: 'Rejestracja',
    description: 'Zarejestruj nowe konto'
  }
];

function fixComponentPageTitle(filePath, title, description) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Plik nie istnieje: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Sprawdź czy import PageTitle już istnieje
    if (!content.includes("import PageTitle from '../components/PageTitle'")) {
      // Dodaj import PageTitle
      const importMatch = content.match(/import React[^;]+;/);
      if (importMatch) {
        const importIndex = content.indexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, importIndex) + "\nimport PageTitle from '../components/PageTitle';" + content.slice(importIndex);
      }
    }

    // Sprawdź czy PageTitle jest już w głównym return
    const mainReturnMatch = content.match(/return\s*\(\s*<[^>]+Container[^>]*>/);
    if (mainReturnMatch) {
      const returnIndex = content.indexOf(mainReturnMatch[0]);
      const containerStart = content.indexOf('<', returnIndex);
      const containerEnd = content.indexOf('>', containerStart);
      
      // Sprawdź czy PageTitle już istnieje w tym return
      const returnContent = content.slice(returnIndex, returnIndex + 200);
      if (!returnContent.includes('<PageTitle')) {
        // Dodaj PageTitle po otwarciu kontenera
        const insertIndex = containerEnd + 1;
        const pageTitleComponent = `\n      <PageTitle title="${title}" description="${description}" />`;
        content = content.slice(0, insertIndex) + pageTitleComponent + content.slice(insertIndex);
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Naprawiono: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Błąd podczas naprawy ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Naprawianie tytułów stron w komponentach...\n');

let fixedCount = 0;
let totalCount = components.length;

components.forEach(component => {
  if (fixComponentPageTitle(component.file, component.title, component.description)) {
    fixedCount++;
  }
});

console.log(`\n📊 Podsumowanie:`);
console.log(`✅ Naprawiono: ${fixedCount}/${totalCount} komponentów`);
console.log(`❌ Błędy: ${totalCount - fixedCount} komponentów`); 