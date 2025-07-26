const puppeteer = require('puppeteer');

async function testProductAPI() {
  let browser;
  
  try {
    console.log('🚀 Testuję pobieranie danych produktu z API...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    // Przejdź do strony produktu
    await page.goto('http://localhost:3000/product/6877fdd818c94583a52840c1', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Poczekaj na załadowanie
    await page.waitForTimeout(5000);
    
    // Sprawdź czy są błędy w konsoli
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Sprawdź czy są błędy sieciowe
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
    
    // Sprawdź czy produkt się załadował
    const productData = await page.evaluate(() => {
      // Sprawdź czy React component się załadował
      const productElements = document.querySelectorAll('[data-testid], .product-name, .product-price, .product-description');
      console.log('Znalezione elementy produktu:', productElements.length);
      
      // Sprawdź czy są dane w localStorage lub sessionStorage
      const localStorageData = Object.keys(localStorage);
      const sessionStorageData = Object.keys(sessionStorage);
      
      return {
        productElements: productElements.length,
        localStorage: localStorageData,
        sessionStorage: sessionStorageData,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });
    
    console.log('📊 Dane z przeglądarki:');
    console.log('Elementy produktu:', productData.productElements);
    console.log('localStorage:', productData.localStorage);
    console.log('sessionStorage:', productData.sessionStorage);
    console.log('Tekst strony:', productData.bodyText);
    
    if (consoleErrors.length > 0) {
      console.log('❌ Błędy w konsoli:', consoleErrors);
    } else {
      console.log('✅ Brak błędów w konsoli');
    }
    
    if (networkErrors.length > 0) {
      console.log('❌ Błędy sieciowe:', networkErrors);
    } else {
      console.log('✅ Brak błędów sieciowych');
    }
    
    // Sprawdź czy React DevTools pokazują dane
    const reactData = await page.evaluate(() => {
      // Sprawdź czy React DevTools są dostępne
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('React DevTools są dostępne');
        return true;
      }
      return false;
    });
    
    console.log('React DevTools dostępne:', reactData);
    
    // Sprawdź czy są jakieś elementy z danymi produktu
    const productInfo = await page.evaluate(() => {
      const elements = {
        name: document.querySelector('h1, .product-name, [data-testid="product-name"]'),
        price: document.querySelector('.price, .product-price, [data-testid="price"]'),
        description: document.querySelector('.description, .product-description, [data-testid="description"]'),
        image: document.querySelector('img[src*="product"], .product-image img'),
        addToCart: document.querySelector('button[data-testid="add-to-cart"], .add-to-cart, button')
      };
      
      return {
        name: elements.name ? elements.name.textContent : null,
        price: elements.price ? elements.price.textContent : null,
        description: elements.description ? elements.description.textContent : null,
        image: elements.image ? elements.image.src : null,
        addToCart: elements.addToCart ? elements.addToCart.textContent : null
      };
    });
    
    console.log('📋 Informacje o produkcie:');
    console.log('Nazwa:', productInfo.name);
    console.log('Cena:', productInfo.price);
    console.log('Opis:', productInfo.description);
    console.log('Obraz:', productInfo.image);
    console.log('Przycisk koszyka:', productInfo.addToCart);
    
    // Sprawdź czy strona pokazuje "Ładowanie" lub "Błąd"
    const loadingText = await page.evaluate(() => {
      const bodyText = document.body.innerText.toLowerCase();
      return {
        loading: bodyText.includes('ładowanie') || bodyText.includes('loading'),
        error: bodyText.includes('błąd') || bodyText.includes('error'),
        notFound: bodyText.includes('nie znaleziono') || bodyText.includes('not found')
      };
    });
    
    console.log('📄 Status strony:');
    console.log('Ładowanie:', loadingText.loading);
    console.log('Błąd:', loadingText.error);
    console.log('Nie znaleziono:', loadingText.notFound);
    
  } catch (error) {
    console.error('❌ Błąd podczas testu:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔌 Przeglądarka zamknięta');
    }
  }
}

testProductAPI(); 