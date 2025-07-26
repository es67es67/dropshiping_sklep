const puppeteer = require('puppeteer');
const path = require('path');

async function testPortal() {
  console.log('🚀 Rozpoczynam testowanie portalu z Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: false, // Pokaż przeglądarkę
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let page;
  
  try {
    page = await browser.newPage();
    
    // 1. Test strony głównej
    console.log('📄 Test 1: Ładowanie strony głównej...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Sprawdź czy strona się załadowała
    const title = await page.title();
    console.log(`✅ Strona główna załadowana. Tytuł: ${title}`);
    
    // Zrób screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../test-screenshots/01_home_page.png'),
      fullPage: true 
    });
    console.log('📸 Screenshot strony głównej zapisany');
    
    // 2. Test logowania
    console.log('🔐 Test 2: Logowanie użytkownika...');
    
    // Przejdź bezpośrednio do strony logowania
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    // Zrób screenshot strony logowania
    await page.screenshot({ 
      path: path.join(__dirname, '../test-screenshots/02_login_page.png'),
      fullPage: true 
    });
    console.log('📸 Screenshot strony logowania zapisany');
    
    // Wypełnij formularz logowania - użyj różnych selektorów
    const emailInput = await page.$('input[name="email"], input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]');
    const passwordInput = await page.$('input[name="password"], input[type="password"], input[placeholder*="hasło"], input[placeholder*="Password"]');
    
    if (emailInput && passwordInput) {
      await emailInput.type('admin@test.com');
      await passwordInput.type('admin123');
      
      // Kliknij przycisk logowania
      const submitButton = await page.$('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(3000);
      }
      
      // Sprawdź czy logowanie się udało
      const isLoggedIn = await page.evaluate(() => {
        return localStorage.getItem('token') !== null;
      });
      
      if (isLoggedIn) {
        console.log('✅ Logowanie udane!');
        
        // Zrób screenshot po zalogowaniu
        await page.screenshot({ 
          path: path.join(__dirname, '../test-screenshots/03_after_login.png'),
          fullPage: true 
        });
        console.log('📸 Screenshot po zalogowaniu zapisany');
        
        // 3. Test strony sklepów
        console.log('🏪 Test 3: Przejście do strony sklepów...');
        await page.goto('http://localhost:3000/shops', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        // Sprawdź czy sklepy się ładują
        const shopsCount = await page.evaluate(() => {
          const testElement = document.querySelector('[style*="background: yellow"]');
          if (testElement) {
            const text = testElement.textContent;
            const match = text.match(/Liczba sklepów: (\d+)/);
            return match ? parseInt(match[1]) : 0;
          }
          return 0;
        });
        
        console.log(`📊 Liczba sklepów: ${shopsCount}`);
        
        // Zrób screenshot strony sklepów
        await page.screenshot({ 
          path: path.join(__dirname, '../test-screenshots/04_shops_page.png'),
          fullPage: true 
        });
        console.log('📸 Screenshot strony sklepów zapisany');
        
        // 4. Test przełączania między "Moje sklepy" a "Wszystkie sklepy"
        console.log('🔄 Test 4: Przełączanie widoku sklepów...');
        
        // Znajdź przycisk "Wszystkie sklepy" używając XPath
        const allShopsButton = await page.$x("//button[contains(text(), 'Wszystkie sklepy') or contains(text(), '🔓 Wszystkie sklepy')]");
        if (allShopsButton.length > 0) {
          await allShopsButton[0].click();
          await page.waitForTimeout(2000);
          
          // Sprawdź liczbę sklepów po przełączeniu
          const allShopsCount = await page.evaluate(() => {
            const testElement = document.querySelector('[style*="background: yellow"]');
            if (testElement) {
              const text = testElement.textContent;
              const match = text.match(/Liczba sklepów: (\d+)/);
              return match ? parseInt(match[1]) : 0;
            }
            return 0;
          });
          
          console.log(`📊 Liczba wszystkich sklepów: ${allShopsCount}`);
          
          // Zrób screenshot wszystkich sklepów
          await page.screenshot({ 
            path: path.join(__dirname, '../test-screenshots/05_all_shops.png'),
            fullPage: true 
          });
          console.log('📸 Screenshot wszystkich sklepów zapisany');
        }
        
        // 5. Test wyszukiwania sklepów
        console.log('🔍 Test 5: Wyszukiwanie sklepów...');
        
        const searchInput = await page.$('input[placeholder*="Szukaj"], input[type="text"]');
        if (searchInput) {
          await searchInput.type('TechStore');
          await page.waitForTimeout(1000);
          
          // Zrób screenshot wyników wyszukiwania
          await page.screenshot({ 
            path: path.join(__dirname, '../test-screenshots/06_search_results.png'),
            fullPage: true 
          });
          console.log('📸 Screenshot wyników wyszukiwania zapisany');
        }
        
        // 6. Test przejścia do szczegółów sklepu
        console.log('🏪 Test 6: Przejście do szczegółów sklepu...');
        
        const firstShopLink = await page.$('a[href*="/shop/"]');
        if (firstShopLink) {
          await firstShopLink.click();
          await page.waitForTimeout(3000);
          
          // Zrób screenshot szczegółów sklepu
          await page.screenshot({ 
            path: path.join(__dirname, '../test-screenshots/07_shop_details.png'),
            fullPage: true 
          });
          console.log('📸 Screenshot szczegółów sklepu zapisany');
        }
        
      } else {
        console.log('❌ Logowanie nie powiodło się');
        
        // Zrób screenshot błędu logowania
        await page.screenshot({ 
          path: path.join(__dirname, '../test-screenshots/ERROR_login_failed.png'),
          fullPage: true 
        });
        console.log('📸 Screenshot błędu logowania zapisany');
      }
    } else {
      console.log('❌ Nie znaleziono pól formularza logowania');
      await page.screenshot({ 
        path: path.join(__dirname, '../test-screenshots/ERROR_login_form_not_found.png'),
        fullPage: true 
      });
    }
    
    // 7. Test wylogowania
    console.log('🚪 Test 7: Wylogowanie...');
    
    const logoutButton = await page.$x("//button[contains(text(), 'Wyloguj')] | //a[contains(text(), 'Wyloguj')]");
    if (logoutButton.length > 0) {
      await logoutButton[0].click();
      await page.waitForTimeout(2000);
      
      // Sprawdź czy wylogowanie się udało
      const isLoggedOut = await page.evaluate(() => {
        return localStorage.getItem('token') === null;
      });
      
      if (isLoggedOut) {
        console.log('✅ Wylogowanie udane!');
      } else {
        console.log('❌ Wylogowanie nie powiodło się');
      }
    }
    
    console.log('🎉 Testowanie zakończone!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testowania:', error);
    
    // Zrób screenshot błędu
    if (page) {
      try {
        await page.screenshot({ 
          path: path.join(__dirname, '../test-screenshots/ERROR_test_failed.png'),
          fullPage: true 
        });
        console.log('📸 Screenshot błędu zapisany');
      } catch (screenshotError) {
        console.error('❌ Nie udało się zapisać screenshot błędu:', screenshotError);
      }
    }
  } finally {
    await browser.close();
    console.log('🔌 Przeglądarka zamknięta');
  }
}

// Uruchom test
testPortal().catch(console.error); 