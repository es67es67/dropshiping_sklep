const puppeteer = require('puppeteer');

async function testMessagesSimple() {
  console.log('🧪 Rozpoczynam prosty test wiadomości...');
  
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
    await page.screenshot({ path: 'simple_01_main_page.png' });
    console.log('✅ Strona główna załadowana');
    
    // Test 2: Strona wiadomości (bez logowania)
    console.log('💬 Test 2: Strona wiadomości bez logowania');
    await page.goto('http://localhost:3000/messages', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'simple_02_messages_page.png' });
    console.log('✅ Strona wiadomości załadowana');
    
    // Test 3: Sprawdź czy jest komunikat o konieczności logowania
    const loginMessage = await page.$('text="Zaloguj się"');
    if (loginMessage) {
      console.log('✅ Znaleziono komunikat o konieczności logowania');
    } else {
      console.log('⚠️ Nie znaleziono komunikatu o logowaniu');
    }
    
    console.log('✅ Prosty test wiadomości zakończony pomyślnie!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testu:', error);
    await page.screenshot({ path: 'simple_ERROR.png' });
  } finally {
    await browser.close();
  }
}

testMessagesSimple(); 