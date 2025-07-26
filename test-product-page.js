const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Konfiguracja
const BASE_URL = 'http://localhost:3000';
const PRODUCT_URL = 'http://localhost:3000/product/6877fdd818c94583a52840c1';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots');

// Upewnij się, że katalog istnieje
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Funkcja do robienia screenshotów
const takeScreenshot = async (page, name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}_${timestamp}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ 
    path: filepath, 
    fullPage: true
  });
  console.log(`📸 Screenshot: ${filename}`);
  return filepath;
};

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Funkcja do czekania na element
const waitForElement = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    console.log(`❌ Element nie znaleziony: ${selector}`);
    return false;
  }
};

async function testProductPage() {
  let browser;
  
  try {
    log('🚀 Uruchamiam test strony produktu...');
    
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    // Przejdź do strony produktu
    log(`🌐 Przechodzę do: ${PRODUCT_URL}`);
    await page.goto(PRODUCT_URL, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    await takeScreenshot(page, '01_product_page_loaded');
    
    // Sprawdź czy strona się załadowała
    const currentUrl = page.url();
    log(`📍 Aktualny URL: ${currentUrl}`);
    
    // Sprawdź czy nie ma błędów 404 lub 500
    const pageTitle = await page.title();
    log(`📄 Tytuł strony: ${pageTitle}`);
    
    // Sprawdź czy produkt się załadował
    const productName = await page.$eval('h1, .product-name, .product-title', el => el.textContent).catch(() => null);
    if (productName) {
      log(`✅ Nazwa produktu: ${productName}`);
    } else {
      log(`❌ Nie znaleziono nazwy produktu`);
    }
    
    // Sprawdź czy cena jest widoczna
    const productPrice = await page.$eval('.price, .product-price, [data-testid="price"]', el => el.textContent).catch(() => null);
    if (productPrice) {
      log(`✅ Cena produktu: ${productPrice}`);
    } else {
      log(`❌ Nie znaleziono ceny produktu`);
    }
    
    // Sprawdź czy opis jest widoczny
    const productDescription = await page.$eval('.description, .product-description, [data-testid="description"]', el => el.textContent).catch(() => null);
    if (productDescription) {
      log(`✅ Opis produktu: ${productDescription.substring(0, 100)}...`);
    } else {
      log(`❌ Nie znaleziono opisu produktu`);
    }
    
    // Sprawdź czy obraz produktu jest widoczny
    const productImage = await page.$('img[src*="product"], img[alt*="product"], .product-image img').catch(() => null);
    if (productImage) {
      log(`✅ Obraz produktu jest widoczny`);
    } else {
      log(`❌ Nie znaleziono obrazu produktu`);
    }
    
    // Sprawdź czy przycisk "Dodaj do koszyka" jest widoczny
    const addToCartButton = await page.$('button[data-testid="add-to-cart"], .add-to-cart, button:contains("Dodaj do koszyka")').catch(() => null);
    if (addToCartButton) {
      log(`✅ Przycisk "Dodaj do koszyka" jest widoczny`);
    } else {
      log(`❌ Nie znaleziono przycisku "Dodaj do koszyka"`);
    }
    
    // Sprawdź czy nie ma błędów w konsoli
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Poczekaj chwilę na załadowanie wszystkich elementów
    await page.waitForTimeout(3000);
    
    if (consoleErrors.length > 0) {
      log(`⚠️ Błędy w konsoli: ${consoleErrors.length}`);
      consoleErrors.forEach((error, index) => {
        log(`   ${index + 1}. ${error}`);
      });
    } else {
      log(`✅ Brak błędów w konsoli`);
    }
    
    // Sprawdź czy nie ma błędów sieciowych
    const networkErrors = [];
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Odśwież stronę aby złapać błędy sieciowe
    await page.reload({ waitUntil: 'networkidle0' });
    await takeScreenshot(page, '02_product_page_after_reload');
    
    if (networkErrors.length > 0) {
      log(`⚠️ Błędy sieciowe: ${networkErrors.length}`);
      networkErrors.forEach((error, index) => {
        log(`   ${index + 1}. ${error.url} - ${error.status} ${error.statusText}`);
      });
    } else {
      log(`✅ Brak błędów sieciowych`);
    }
    
    // Sprawdź czy strona jest responsywna
    log(`📱 Testuję responsywność...`);
    
    // Mobile view
    await page.setViewport({ width: 375, height: 667 });
    await takeScreenshot(page, '03_product_page_mobile');
    
    // Tablet view
    await page.setViewport({ width: 768, height: 1024 });
    await takeScreenshot(page, '04_product_page_tablet');
    
    // Desktop view
    await page.setViewport({ width: 1920, height: 1080 });
    await takeScreenshot(page, '05_product_page_desktop');
    
    log(`✅ Test responsywności zakończony`);
    
    // Sprawdź czy można przejść z powrotem do sklepu
    const backButton = await page.$('a[href*="shop"], .back-button, button:contains("Wróć")').catch(() => null);
    if (backButton) {
      log(`✅ Przycisk powrotu do sklepu jest widoczny`);
      
      // Kliknij przycisk powrotu
      await backButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      await takeScreenshot(page, '06_back_to_shop');
      
      const newUrl = page.url();
      log(`📍 URL po powrocie: ${newUrl}`);
    } else {
      log(`❌ Nie znaleziono przycisku powrotu do sklepu`);
    }
    
    log(`🎉 Test strony produktu zakończony pomyślnie!`);
    
  } catch (error) {
    log(`❌ Błąd podczas testu: ${error.message}`);
    await takeScreenshot(page, 'ERROR_product_page');
  } finally {
    if (browser) {
      await browser.close();
      log(`🔌 Przeglądarka zamknięta`);
    }
  }
}

// Uruchom test
testProductPage(); 