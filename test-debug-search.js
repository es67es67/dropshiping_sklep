const puppeteer = require('puppeteer');

const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

const testDebugSearch = async () => {
  let browser;
  
  try {
    log('🚀 Rozpoczynam debugowanie wyszukiwania...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Włącz logi konsoli
    page.on('console', msg => {
      log(`📱 Console: ${msg.text()}`);
    });
    
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Sprawdź czy komponent IntegratedSearch jest załadowany
    const searchComponent = await page.evaluate(() => {
      // Sprawdź czy komponent jest w DOM
      const searchInput = document.querySelector('input[placeholder*="Szukaj"]');
      if (searchInput) {
        console.log('✅ Pole wyszukiwania znalezione');
        return true;
      } else {
        console.log('❌ Pole wyszukiwania nie znalezione');
        return false;
      }
    });
    
    if (!searchComponent) {
      log('❌ Komponent wyszukiwania nie został załadowany');
      return;
    }
    
    // Wpisz tekst w wyszukiwanie
    await page.type('input[placeholder*="Szukaj"]', 'Jan');
    await page.waitForTimeout(1000);
    
    // Sprawdź czy wyniki się pojawiły
    const resultsVisible = await page.evaluate(() => {
      // Sprawdź wszystkie divy z żółtym tłem (debug)
      const debugDivs = document.querySelectorAll('div[style*="background: yellow"]');
      console.log('🔍 Znaleziono debug divów:', debugDivs.length);
      
      if (debugDivs.length > 0) {
        console.log('✅ Debug div znaleziony');
        debugDivs.forEach((div, index) => {
          console.log(`📊 Debug div ${index}:`, div.textContent);
        });
        return true;
      }
      
      // Sprawdź wszystkie divy z białym tłem i borderem
      const whiteDivs = document.querySelectorAll('div[style*="background: white"]');
      console.log('🔍 Znaleziono białych divów:', whiteDivs.length);
      
      const resultsContainer = document.querySelector('[class*="SearchResults"]');
      if (resultsContainer) {
        console.log('✅ Kontener wyników znaleziony');
        console.log('📊 Zawartość:', resultsContainer.innerHTML);
        return true;
      } else {
        console.log('❌ Kontener wyników nie znaleziony');
        return false;
      }
    });
    
    if (resultsVisible) {
      log('✅ Wyniki wyszukiwania są widoczne');
    } else {
      log('❌ Wyniki wyszukiwania nie są widoczne');
    }
    
    // Sprawdź stan React
    const reactState = await page.evaluate(() => {
      // Sprawdź czy React DevTools są dostępne
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('✅ React DevTools dostępne');
        return true;
      } else {
        console.log('❌ React DevTools niedostępne');
        return false;
      }
    });
    
    log('✅ Debugowanie zakończone');
    
  } catch (error) {
    log(`❌ Błąd podczas debugowania: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      log('🔌 Przeglądarka zamknięta');
    }
  }
};

testDebugSearch(); 