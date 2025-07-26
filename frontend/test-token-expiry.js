const puppeteer = require('puppeteer');
const path = require('path');

async function testTokenExpiry() {
  console.log('🔐 Testowanie obsługi wygasłego tokenu...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let page;
  
  try {
    page = await browser.newPage();
    
    // 1. Przejdź do strony głównej
    console.log('📄 Krok 1: Przejście do strony głównej...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // 2. Przejdź do strony sklepów bez logowania
    console.log('🏪 Krok 2: Przejście do strony sklepów bez logowania...');
    await page.goto('http://localhost:3000/shops', { waitUntil: 'networkidle2' });
    
    // Sprawdź czy jest przekierowanie do logowania
    const currentUrl = page.url();
    console.log(`📍 Aktualny URL: ${currentUrl}`);
    
    if (currentUrl.includes('/login')) {
      console.log('✅ Przekierowanie do logowania działa!');
    } else {
      console.log('⚠️ Brak przekierowania do logowania');
    }
    
    // Zrób screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../test-screenshots/test_token_expiry_01_no_auth.png'),
      fullPage: true 
    });
    
    // 3. Zaloguj się
    console.log('🔐 Krok 3: Logowanie...');
    await page.type('input[name="email"], input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]', 'admin@test.com');
    await page.type('input[name="password"], input[type="password"], input[placeholder*="hasło"], input[placeholder*="Password"]', 'admin123');
    
    const submitButton = await page.$('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      await submitButton.click();
      await page.waitForTimeout(3000);
    }
    
    // 4. Przejdź do strony sklepów po zalogowaniu
    console.log('🏪 Krok 4: Przejście do strony sklepów po zalogowaniu...');
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
    
    // Zrób screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../test-screenshots/test_token_expiry_02_after_login.png'),
      fullPage: true 
    });
    
    // 5. Symuluj wygasły token - usuń token z localStorage
    console.log('⏰ Krok 5: Symulacja wygasłego tokenu...');
    await page.evaluate(() => {
      localStorage.removeItem('token');
      console.log('Token usunięty z localStorage');
    });
    
    // 6. Odśwież stronę
    console.log('🔄 Krok 6: Odświeżenie strony...');
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Sprawdź czy nastąpiło przekierowanie do logowania
    const finalUrl = page.url();
    console.log(`📍 Końcowy URL: ${finalUrl}`);
    
    if (finalUrl.includes('/login')) {
      console.log('✅ Obsługa wygasłego tokenu działa! Użytkownik został przekierowany do logowania.');
    } else {
      console.log('❌ Obsługa wygasłego tokenu nie działa. Użytkownik nie został przekierowany.');
    }
    
    // Zrób screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../test-screenshots/test_token_expiry_03_after_token_removal.png'),
      fullPage: true 
    });
    
    console.log('🎉 Test zakończony!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testowania:', error);
    
    if (page) {
      try {
        await page.screenshot({ 
          path: path.join(__dirname, '../test-screenshots/ERROR_token_expiry_test.png'),
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
testTokenExpiry().catch(console.error); 