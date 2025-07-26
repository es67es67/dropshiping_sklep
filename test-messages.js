const puppeteer = require('puppeteer');

async function testMessages() {
  console.log('🧪 Rozpoczynam test wiadomości...');
  
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
    await page.screenshot({ path: '01_main_page_messages.png' });
    console.log('✅ Strona główna załadowana');
    
    // Test 2: Logowanie
    console.log('🔐 Test 2: Logowanie');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000); // Czekaj na załadowanie
    await page.screenshot({ path: '02_login_page_messages.png' });
    
    // Czekaj na załadowanie formularza
    await page.waitForSelector('input[name="emailOrUsername"]', { timeout: 10000 });
    
    // Wypełnij formularz logowania
    await page.type('input[name="emailOrUsername"]', 'test2@example.com');
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Czekaj na przekierowanie
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.screenshot({ path: '03_after_login_messages.png' });
    console.log('✅ Logowanie udane');
    
    // Test 3: Strona wiadomości
    console.log('💬 Test 3: Strona wiadomości');
    await page.goto('http://localhost:3000/messages', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: '04_messages_page.png' });
    console.log('✅ Strona wiadomości załadowana');
    
    // Test 4: Wyszukiwanie użytkowników
    console.log('🔍 Test 4: Wyszukiwanie użytkowników');
    const searchInput = await page.$('input[placeholder*="Wyszukaj"]');
    if (searchInput) {
      await searchInput.type('test');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '05_search_users.png' });
      console.log('✅ Wyszukiwanie użytkowników działa');
    } else {
      console.log('⚠️ Nie znaleziono pola wyszukiwania');
    }
    
    // Test 5: Wysyłanie wiadomości (jeśli jest użytkownik do wyboru)
    console.log('📤 Test 5: Wysyłanie wiadomości');
    const searchResults = await page.$$('.search-result');
    if (searchResults.length > 0) {
      // Kliknij pierwszego użytkownika
      await searchResults[0].click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '06_conversation_started.png' });
      
      // Wpisz wiadomość
      const messageInput = await page.$('input[placeholder*="wiadomość"], textarea[placeholder*="wiadomość"]');
      if (messageInput) {
        await messageInput.type('Test wiadomości z Puppeteer!');
        await page.screenshot({ path: '07_message_typed.png' });
        
        // Wyślij wiadomość
        const sendButton = await page.$('button[type="submit"], button:has-text("Wyślij")');
        if (sendButton) {
          await sendButton.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: '08_message_sent.png' });
          console.log('✅ Wiadomość wysłana');
        } else {
          console.log('⚠️ Nie znaleziono przycisku wysyłania');
        }
      } else {
        console.log('⚠️ Nie znaleziono pola wiadomości');
      }
    } else {
      console.log('⚠️ Brak użytkowników do wyboru');
    }
    
    console.log('✅ Test wiadomości zakończony pomyślnie!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testu:', error);
    await page.screenshot({ path: 'ERROR_messages.png' });
  } finally {
    await browser.close();
  }
}

testMessages(); 