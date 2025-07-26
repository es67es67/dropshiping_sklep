const puppeteer = require('puppeteer');

async function testPortal() {
  console.log('🧪 Rozpoczynam zaawansowany test portalu...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  // Nasłuchuj błędów konsoli
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  // Nasłuchuj błędów sieciowych
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      console.log(`❌ Network Error: ${response.status()} - ${response.url()}`);
    }
  });
  
  try {
    // Test 1: Strona główna
    console.log('📄 Test 1: Strona główna');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: '01_main_page.png' });
    console.log('✅ Strona główna załadowana');
    
    // Test 2: Logowanie
    console.log('🔐 Test 2: Logowanie');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: '02_login_form.png' });
    
    // Wypełnij formularz logowania
    await page.type('input[name="emailOrUsername"]', 'test2@example.com');
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Czekaj na przekierowanie
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: '03_after_login.png' });
    console.log('✅ Logowanie zakończone');
    
    // Test 3: Strona sklepów po zalogowaniu
    console.log('🏪 Test 3: Strona sklepów (zalogowany)');
    await page.goto('http://localhost:3000/shops', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000); // Czekaj na załadowanie danych
    await page.screenshot({ path: '04_shops_logged_in.png' });
    console.log('✅ Strona sklepów załadowana');
    
    // Test 4: Strona produktów po zalogowaniu
    console.log('📦 Test 4: Strona produktów (zalogowany)');
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '05_products_logged_in.png' });
    console.log('✅ Strona produktów załadowana');
    
    // Test 5: Koszyk po zalogowaniu
    console.log('🛒 Test 5: Koszyk (zalogowany)');
    await page.goto('http://localhost:3000/cart', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '06_cart_logged_in.png' });
    console.log('✅ Strona koszyka załadowana');
    
    // Test 6: Dodanie produktu do koszyka
    console.log('➕ Test 6: Dodanie produktu do koszyka');
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Znajdź przycisk "Dodaj do koszyka" i kliknij
    const addToCartButton = await page.$('button[data-testid="add-to-cart"], button:has-text("Dodaj do koszyka")');
    if (addToCartButton) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: '07_added_to_cart.png' });
      console.log('✅ Produkt dodany do koszyka');
    } else {
      console.log('⚠️ Nie znaleziono przycisku "Dodaj do koszyka"');
    }
    
    // Test 7: Szczegóły sklepu
    console.log('🏪 Test 7: Szczegóły sklepu');
    await page.goto('http://localhost:3000/shops', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Znajdź link do pierwszego sklepu
    const shopLink = await page.$('a[href*="/shop/"], .shop-link');
    if (shopLink) {
      await shopLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      await page.screenshot({ path: '08_shop_details.png' });
      console.log('✅ Szczegóły sklepu załadowane');
    } else {
      console.log('⚠️ Nie znaleziono linku do sklepu');
    }
    
    // Test 8: Nawigacja
    console.log('🧭 Test 8: Nawigacja');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Testuj nawigację przez menu
    const navLinks = await page.$$('nav a, .navbar a');
    for (let i = 0; i < Math.min(navLinks.length, 3); i++) {
      try {
        const link = navLinks[i];
        const href = await link.evaluate(el => el.href);
        if (href && !href.includes('#')) {
          console.log(`🔗 Testowanie linku: ${href}`);
          await link.click();
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
          await page.screenshot({ path: `09_nav_${i}.png` });
        }
      } catch (navError) {
        console.log(`⚠️ Błąd nawigacji: ${navError.message}`);
      }
    }
    
    console.log('🎉 Wszystkie testy zakończone pomyślnie!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testowania:', error);
    await page.screenshot({ path: 'ERROR.png' });
  } finally {
    await browser.close();
  }
}

testPortal(); 