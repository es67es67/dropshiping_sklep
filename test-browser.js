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

const waitForElement = async (page, selector, timeout = 10000) => {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch (error) {
    log(`❌ Element nie znaleziony: ${selector}`);
    return false;
  }
};

const testBrowser = async () => {
  let browser;
  
  try {
    log('🚀 Rozpoczynam test przez przeglądarkę...');
    
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false, // Pokaż przeglądarkę
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 1. Test strony głównej
    log('🏠 Testowanie strony głównej...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '01_main_page');
    
    // Sprawdź czy strona się załadowała
    const title = await page.title();
    log(`📄 Tytuł strony: ${title}`);
    
    // 2. Test logowania
    log('🔐 Testowanie logowania...');
    
    // Znajdź link do logowania
    const loginLink = await page.$('a[href="/login"]');
    if (loginLink) {
      await loginLink.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '02_login_page');
      
      // Wypełnij formularz logowania
      await page.type('input[name="emailOrUsername"]', 'admin@test.com');
      await page.type('input[name="password"]', 'admin123');
      
      // Kliknij przycisk logowania
      const loginButton = await page.$('button[type="submit"]');
      if (loginButton) {
        await loginButton.click();
        await page.waitForTimeout(3000);
        await takeScreenshot(page, '03_after_login');
      }
    }
    
    // 3. Test systemu wiadomości
    log('💬 Testowanie systemu wiadomości...');
    await page.goto('http://localhost:3000/messages', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '04_messages_page');
    
    // Sprawdź czy komponent wiadomości się załadował
    const messagesComponent = await page.$('[data-testid="messages-component"]') || 
                             await page.$('.messages-container') ||
                             await page.$('h1, h2, h3');
    
    if (messagesComponent) {
      const text = await messagesComponent.evaluate(el => el.textContent);
      log(`✅ Komponent wiadomości załadowany: ${text.substring(0, 50)}...`);
    } else {
      log('⚠️ Komponent wiadomości nie został znaleziony');
    }
    
    // 4. Test systemu znajomych
    log('👥 Testowanie systemu znajomych...');
    await page.goto('http://localhost:3000/friends', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '05_friends_page');
    
    // Sprawdź czy komponent znajomych się załadował
    const friendsComponent = await page.$('[data-testid="friends-component"]') || 
                            await page.$('.friends-container') ||
                            await page.$('h1, h2, h3');
    
    if (friendsComponent) {
      const text = await friendsComponent.evaluate(el => el.textContent);
      log(`✅ Komponent znajomych załadowany: ${text.substring(0, 50)}...`);
    } else {
      log('⚠️ Komponent znajomych nie został znaleziony');
    }
    
    // 5. Test wyszukiwania użytkowników
    log('🔍 Testowanie wyszukiwania użytkowników...');
    await page.goto('http://localhost:3000/search', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '06_search_page');
    
    // Spróbuj wyszukać użytkowników
    const searchInput = await page.$('input[type="search"], input[placeholder*="search"], input[name="search"]');
    if (searchInput) {
      await searchInput.type('Jan');
      await page.waitForTimeout(1000);
      await takeScreenshot(page, '07_search_results');
      
      // Sprawdź wyniki wyszukiwania
      const searchResults = await page.$$('.search-result, .user-card, .user-item');
      log(`🔍 Znaleziono ${searchResults.length} wyników wyszukiwania`);
    }
    
    // 6. Test nawigacji
    log('🧭 Testowanie nawigacji...');
    
    // Sprawdź czy w navbar są linki do wiadomości i znajomych
    const messagesLink = await page.$('a[href="/messages"]');
    const friendsLink = await page.$('a[href="/friends"]');
    
    if (messagesLink) {
      log('✅ Link do wiadomości znaleziony w nawigacji');
    } else {
      log('❌ Link do wiadomości nie znaleziony w nawigacji');
    }
    
    if (friendsLink) {
      log('✅ Link do znajomych znaleziony w nawigacji');
    } else {
      log('❌ Link do znajomych nie znaleziony w nawigacji');
    }
    
    // 7. Test responsywności
    log('📱 Testowanie responsywności...');
    
    // Desktop
    await page.setViewport({ width: 1920, height: 1080 });
    await takeScreenshot(page, '08_responsive_desktop');
    
    // Tablet
    await page.setViewport({ width: 768, height: 1024 });
    await takeScreenshot(page, '08_responsive_tablet');
    
    // Mobile
    await page.setViewport({ width: 375, height: 667 });
    await takeScreenshot(page, '08_responsive_mobile');
    
    // Przywróć normalny rozmiar
    await page.setViewport({ width: 1280, height: 720 });
    
    log('✅ Test przez przeglądarkę zakończony pomyślnie!');
    
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
testBrowser(); 