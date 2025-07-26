const puppeteer = require('puppeteer');

const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

const takeScreenshot = async (page, filename) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filepath = `test-screenshots/${filename}_${timestamp}.png`;
  
  try {
    await page.screenshot({
      path: filepath,
      fullPage: true
    });
    log(`📸 Screenshot zapisany: ${filepath}`);
  } catch (error) {
    log(`❌ Błąd screenshot: ${error.message}`);
  }
};

const testIntegratedSearch = async () => {
  let browser;
  
  try {
    log('🚀 Rozpoczynam test zintegrowanego wyszukiwania...');
    
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 1. Przejdź do strony głównej
    log('🏠 Przechodzę do strony głównej...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '01_home_page');
    
    // 2. Sprawdź czy wyszukiwanie jest widoczne w navbar
    log('🔍 Sprawdzam czy wyszukiwanie jest widoczne...');
    const searchInput = await page.$('input[placeholder*="Szukaj"]');
    if (searchInput) {
      log('✅ Pole wyszukiwania znalezione w navbar');
    } else {
      log('❌ Pole wyszukiwania nie znalezione w navbar');
      return;
    }
    
    // 3. Test wyszukiwania użytkowników
    log('👥 Testuję wyszukiwanie użytkowników...');
    await searchInput.type('Jan');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '02_search_users');
    
    // Sprawdź czy wyniki się pojawiły
    const searchResults = await page.$$('.SearchResultItem, [data-testid="search-result"]');
    log(`🔍 Znaleziono ${searchResults.length} wyników wyszukiwania`);
    
    // 4. Test filtrowania
    log('🔧 Testuję filtrowanie...');
    const filterButton = await page.$('button[class*="FilterButton"]');
    if (filterButton) {
      await filterButton.click();
      await page.waitForTimeout(500);
      await takeScreenshot(page, '03_filter_options');
      
      // Kliknij filtr użytkowników
      const userFilter = await page.$('button:has-text("Użytkownicy")');
      if (userFilter) {
        await userFilter.click();
        await page.waitForTimeout(1000);
        await takeScreenshot(page, '04_user_filter');
      }
    }
    
    // 5. Test wyszukiwania sklepów
    log('🏪 Testuję wyszukiwanie sklepów...');
    await searchInput.click();
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await searchInput.type('sklep');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '05_search_shops');
    
    // 6. Test wyszukiwania firm
    log('🏢 Testuję wyszukiwanie firm...');
    await searchInput.click();
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await searchInput.type('firma');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, '06_search_companies');
    
    // 7. Test responsywności wyszukiwania
    log('📱 Testuję responsywność wyszukiwania...');
    
    // Mobile
    await page.setViewport({ width: 375, height: 667 });
    await takeScreenshot(page, '07_search_mobile');
    
    // Tablet
    await page.setViewport({ width: 768, height: 1024 });
    await takeScreenshot(page, '08_search_tablet');
    
    // Desktop
    await page.setViewport({ width: 1280, height: 720 });
    
    // 8. Test kliknięcia w wynik
    log('🖱️ Testuję kliknięcie w wynik...');
    const firstResult = await page.$('.SearchResultItem, [data-testid="search-result"]');
    if (firstResult) {
      await firstResult.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '09_clicked_result');
    }
    
    log('✅ Test zintegrowanego wyszukiwania zakończony pomyślnie!');
    
  } catch (error) {
    log(`❌ Błąd podczas testowania: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
      log('🔌 Przeglądarka zamknięta');
    }
  }
};

// Uruchom test
testIntegratedSearch(); 