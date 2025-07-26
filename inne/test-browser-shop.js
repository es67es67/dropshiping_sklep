const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testShopInBrowser() {
  console.log('🌐 Uruchamiam test przeglądarkowy...');
  
  const browser = await puppeteer.launch({
    headless: false, // Widoczna przeglądarka
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Zbierz wszystkie żądania sieciowe
  const networkRequests = [];
  const consoleLogs = [];
  const errors = [];
  
  // Nasłuchuj żądań sieciowych
  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      timestamp: new Date().toISOString()
    });
  });
  
  // Nasłuchuj odpowiedzi
  page.on('response', response => {
    const request = networkRequests.find(req => req.url === response.url());
    if (request) {
      request.status = response.status();
      request.statusText = response.statusText();
    }
  });
  
  // Nasłuchuj błędów sieciowych
  page.on('error', error => {
    errors.push({
      type: 'page_error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  });
  
  // Nasłuchuj błędów żądań
  page.on('requestfailed', request => {
    errors.push({
      type: 'request_failed',
      url: request.url(),
      errorText: request.failure() ? request.failure().errorText : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  });
  
  // Nasłuchuj logów konsoli
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    });
  });

  try {
    console.log('📱 Przechodzę na stronę sklepu...');
    await page.goto('http://localhost:3000/shop/6875d1867f40145e58a47086', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('⏳ Czekam 5 sekund na załadowanie...');
    await page.waitForTimeout(5000);
    
    // Sprawdź czy strona się załadowała
    const pageTitle = await page.title();
    console.log(`📄 Tytuł strony: ${pageTitle}`);
    
    // Sprawdź czy są błędy w konsoli
    const consoleErrors = consoleLogs.filter(log => log.type === 'error');
    console.log(`❌ Błędy w konsoli: ${consoleErrors.length}`);
    
    // Sprawdź błędy sieciowe
    const failedRequests = networkRequests.filter(req => req.status >= 400);
    console.log(`🌐 Błędy sieciowe: ${failedRequests.length}`);
    
    // Zrób screenshot
    const screenshotPath = path.join(__dirname, 'browser-test-shop.png');
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    console.log(`📸 Screenshot zapisany: ${screenshotPath}`);
    
    // Sprawdź czy sklep się wyświetlił
    const shopName = await page.evaluate(() => {
      const nameElement = document.querySelector('h1, .shop-name, [data-testid="shop-name"]');
      return nameElement ? nameElement.textContent : 'Nie znaleziono nazwy sklepu';
    });
    console.log(`🏪 Nazwa sklepu: ${shopName}`);
    
    // Sprawdź czy produkty się wyświetliły
    const productsCount = await page.evaluate(() => {
      const products = document.querySelectorAll('.product, [data-testid="product"], .product-card');
      return products.length;
    });
    console.log(`📦 Liczba produktów: ${productsCount}`);
    
    // Zapisz szczegółowe logi
    const testResults = {
      timestamp: new Date().toISOString(),
      pageTitle,
      shopName,
      productsCount,
      consoleErrors: consoleErrors.length,
      networkErrors: failedRequests.length,
      networkRequests,
      consoleLogs,
      errors
    };
    
    const logPath = path.join(__dirname, 'browser-test-results.json');
    fs.writeFileSync(logPath, JSON.stringify(testResults, null, 2));
    console.log(`📋 Szczegółowe logi zapisane: ${logPath}`);
    
    // Wyświetl najważniejsze błędy
    if (consoleErrors.length > 0) {
      console.log('\n🚨 BŁĘDY W KONSOLI:');
      consoleErrors.slice(0, 5).forEach(error => {
        console.log(`  - ${error.text}`);
      });
    }
    
    if (failedRequests.length > 0) {
      console.log('\n🌐 BŁĘDY SIECIOWE:');
      failedRequests.slice(0, 5).forEach(req => {
        console.log(`  - ${req.method} ${req.url} (${req.status})`);
      });
    }
    
    console.log('\n✅ Test przeglądarkowy zakończony!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testu:', error.message);
    const errorScreenshot = path.join(__dirname, 'browser-test-error.png');
    await page.screenshot({ path: errorScreenshot });
    console.log(`📸 Screenshot błędu zapisany: ${errorScreenshot}`);
  } finally {
    await browser.close();
  }
}

testShopInBrowser().catch(console.error); 