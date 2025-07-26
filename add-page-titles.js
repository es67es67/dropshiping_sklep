const fs = require('fs');
const path = require('path');

// Lista stron z ich tytułami i opisami
const pages = [
  { file: 'frontend/src/pages/AdminPanel.jsx', title: 'Panel Admina', description: 'Zarządzanie systemem i danymi' },
  { file: 'frontend/src/pages/Cities.jsx', title: 'Miasta', description: 'Przeglądaj miasta i ich dane' },
  { file: 'frontend/src/pages/Counties.jsx', title: 'Powiaty', description: 'Przeglądaj powiaty i ich dane' },
  { file: 'frontend/src/pages/Country.jsx', title: 'Kraj', description: 'Dane na poziomie kraju' },
  { file: 'frontend/src/pages/LocalProducts.jsx', title: 'Produkty lokalne', description: 'Produkty z Twojej okolicy' },
  { file: 'frontend/src/pages/LocationAnalytics.jsx', title: 'Analizy lokalizacji', description: 'Analizy i statystyki lokalizacji' },
  { file: 'frontend/src/pages/LocationExport.jsx', title: 'Eksport lokalizacji', description: 'Eksportuj dane lokalizacji' },
  { file: 'frontend/src/pages/LocationImport.jsx', title: 'Import lokalizacji', description: 'Importuj dane lokalizacji' },
  { file: 'frontend/src/pages/LocationMap.jsx', title: 'Mapa lokalizacji', description: 'Interaktywna mapa lokalizacji' },
  { file: 'frontend/src/pages/Municipalities.jsx', title: 'Gminy', description: 'Przeglądaj gminy i ich dane' },
  { file: 'frontend/src/pages/Voivodeships.jsx', title: 'Województwa', description: 'Przeglądaj województwa i ich dane' },
  { file: 'frontend/src/pages/AdvancedFeatures.jsx', title: 'Zaawansowane funkcje', description: 'Zaawansowane funkcje portalu' },
  { file: 'frontend/src/pages/TerytFeatures.jsx', title: 'Funkcje TERYT', description: 'Funkcje związane z TERYT' },
  { file: 'frontend/src/pages/MyProducts.jsx', title: 'Moje produkty', description: 'Zarządzaj swoimi produktami' },
  { file: 'frontend/src/pages/MyShops.jsx', title: 'Moje sklepy', description: 'Zarządzaj swoimi sklepami' },
  { file: 'frontend/src/pages/Friends.jsx', title: 'Znajomi', description: 'Zarządzaj znajomymi' },
  { file: 'frontend/src/pages/Profile.jsx', title: 'Mój profil', description: 'Edytuj swój profil' },
  { file: 'frontend/src/pages/Settings.jsx', title: 'Ustawienia', description: 'Ustawienia konta' },
  { file: 'frontend/src/pages/LayoutCustomization.jsx', title: 'Dostosuj wygląd', description: 'Dostosuj wygląd portalu' }
];

// Komponenty, które też potrzebują tytułów
const components = [
  { file: 'frontend/src/components/Cart.jsx', title: 'Koszyk', description: 'Twój koszyk zakupów' },
  { file: 'frontend/src/components/MessagingSystem.jsx', title: 'Wiadomości', description: 'System wiadomości' },
  { file: 'frontend/src/components/GamificationPanel.jsx', title: 'Gamifikacja', description: 'System gamifikacji' },
  { file: 'frontend/src/components/Notifications.jsx', title: 'Powiadomienia', description: 'Centrum powiadomień' },
  { file: 'frontend/src/components/ShopList.jsx', title: 'Sklepy', description: 'Przeglądaj sklepy' },
  { file: 'frontend/src/components/ShopManagement.jsx', title: 'Zarządzanie sklepami', description: 'Zarządzaj swoimi sklepami' },
  { file: 'frontend/src/components/ProductManagement.jsx', title: 'Zarządzanie produktami', description: 'Zarządzaj swoimi produktami' },
  { file: 'frontend/src/components/ProductCreate.jsx', title: 'Utwórz produkt', description: 'Dodaj nowy produkt' },
  { file: 'frontend/src/components/ShopCreate.jsx', title: 'Utwórz sklep', description: 'Dodaj nowy sklep' },
  { file: 'frontend/src/components/Profile.jsx', title: 'Mój profil', description: 'Edytuj swój profil' },
  { file: 'frontend/src/components/Search.jsx', title: 'Wyszukiwanie', description: 'Wyszukuj w portalu' },
  { file: 'frontend/src/components/Settings.jsx', title: 'Ustawienia', description: 'Ustawienia konta' },
  { file: 'frontend/src/components/Login.jsx', title: 'Logowanie', description: 'Zaloguj się do portalu' },
  { file: 'frontend/src/components/Register.jsx', title: 'Rejestracja', description: 'Zarejestruj się w portalu' }
];

function addPageTitle(filePath, title, description) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Plik nie istnieje: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Sprawdź czy PageTitle już jest dodany
    if (content.includes('PageTitle')) {
      console.log(`✅ PageTitle już istnieje w: ${filePath}`);
      return true;
    }

    // Dodaj import PageTitle
    if (content.includes('import React')) {
      content = content.replace(
        /import React[^;]+;/,
        `import React from 'react';
import PageTitle from '../components/PageTitle';`
      );
    }

    // Znajdź return statement i dodaj PageTitle
    const returnMatch = content.match(/return\s*\(\s*<([^>]+)>/);
    if (returnMatch) {
      const containerName = returnMatch[1].split(' ')[0];
      const pageTitleLine = `      <PageTitle title="${title}" description="${description}" />`;
      
      // Dodaj PageTitle po otwarciu głównego kontenera
      const containerOpen = `<${containerName}`;
      const containerOpenWithTitle = `<${containerName}>\n      <PageTitle title="${title}" description="${description}" />`;
      
      content = content.replace(containerOpen, containerOpenWithTitle);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Dodano PageTitle do: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Błąd podczas dodawania PageTitle do ${filePath}:`, error.message);
    return false;
  }
}

// Uruchom skrypt
console.log('🚀 Dodawanie PageTitle do wszystkich stron...\n');

let successCount = 0;
let totalCount = 0;

// Dodaj do stron
pages.forEach(page => {
  totalCount++;
  if (addPageTitle(page.file, page.title, page.description)) {
    successCount++;
  }
});

// Dodaj do komponentów
components.forEach(component => {
  totalCount++;
  if (addPageTitle(component.file, component.title, component.description)) {
    successCount++;
  }
});

console.log(`\n📊 PODSUMOWANIE:`);
console.log(`✅ Pomyślnie dodano: ${successCount}/${totalCount}`);
console.log(`❌ Błędy: ${totalCount - successCount}`);

if (successCount === totalCount) {
  console.log('🎉 Wszystkie tytuły zostały dodane pomyślnie!');
} else {
  console.log('⚠️ Niektóre pliki nie zostały zaktualizowane.');
} 