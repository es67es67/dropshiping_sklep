const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testFriendshipSystem() {
  console.log('🧪 Testowanie systemu znajomych...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    // Przejdź do strony głównej
    console.log('🌐 Przechodzę do strony głównej...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Zarejestruj pierwszego użytkownika
    console.log('👤 Rejestracja pierwszego użytkownika...');
    await page.click('a[href="/register"]');
    await page.waitForSelector('form');
    
    await page.type('input[name="firstName"]', 'Jan');
    await page.type('input[name="lastName"]', 'Kowalski');
    await page.type('input[name="username"]', 'jankowalski');
    await page.type('input[name="email"]', 'jan.kowalski@example.com');
    await page.type('input[name="password"]', 'test123');
    await page.type('input[name="dateOfBirth"]', '1990-01-01');
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Zaloguj się
    console.log('🔑 Logowanie...');
    await page.click('a[href="/login"]');
    await page.waitForSelector('form');
    
    await page.type('input[name="email"]', 'jan.kowalski@example.com');
    await page.type('input[name="password"]', 'test123');
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // Przejdź do systemu znajomych
    console.log('👥 Przechodzę do systemu znajomych...');
    await page.click('a[href="/friends"]');
    await page.waitForTimeout(2000);
    
    // Screenshot pustego systemu znajomych
    await page.screenshot({ 
      path: 'friendship-system-empty.png',
      fullPage: true 
    });
    console.log('📸 Screenshot: friendship-system-empty.png');
    
    // Otwórz nową kartę dla drugiego użytkownika
    const page2 = await browser.newPage();
    
    // Zarejestruj drugiego użytkownika
    console.log('👤 Rejestracja drugiego użytkownika...');
    await page2.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
    await page2.waitForSelector('form');
    
    await page2.type('input[name="firstName"]', 'Anna');
    await page2.type('input[name="lastName"]', 'Nowak');
    await page2.type('input[name="username"]', 'annanowak');
    await page2.type('input[name="email"]', 'anna.nowak@example.com');
    await page2.type('input[name="password"]', 'test123');
    await page2.type('input[name="dateOfBirth"]', '1992-05-15');
    
    await page2.click('button[type="submit"]');
    await page2.waitForNavigation();
    
    // Zaloguj drugiego użytkownika
    console.log('🔑 Logowanie drugiego użytkownika...');
    await page2.click('a[href="/login"]');
    await page2.waitForSelector('form');
    
    await page2.type('input[name="email"]', 'anna.nowak@example.com');
    await page2.type('input[name="password"]', 'test123');
    
    await page2.click('button[type="submit"]');
    await page2.waitForNavigation();
    
    // Przejdź do systemu znajomych drugiego użytkownika
    await page2.click('a[href="/friends"]');
    await page2.waitForTimeout(2000);
    
    // Wróć do pierwszego użytkownika i wyślij zaproszenie
    console.log('📨 Wysyłanie zaproszenia do znajomych...');
    await page.bringToFront();
    
    // Przejdź do zakładki sugestii
    await page.click('button:contains("Sugestie")');
    await page.waitForTimeout(1000);
    
    // Jeśli są sugestie, wyślij zaproszenie
    const suggestions = await page.$$('[data-testid="friend-suggestion"]');
    if (suggestions.length > 0) {
      await page.click('[data-testid="friend-suggestion"] button:contains("Dodaj")');
      await page.waitForTimeout(2000);
    }
    
    // Screenshot z zaproszeniem
    await page.screenshot({ 
      path: 'friendship-system-sent-request.png',
      fullPage: true 
    });
    console.log('📸 Screenshot: friendship-system-sent-request.png');
    
    // Przejdź do drugiego użytkownika i zaakceptuj zaproszenie
    console.log('✅ Akceptowanie zaproszenia...');
    await page2.bringToFront();
    
    // Przejdź do zakładki oczekujących
    await page2.click('button:contains("Oczekujące")');
    await page2.waitForTimeout(1000);
    
    // Akceptuj zaproszenie
    const pendingRequests = await page2.$$('[data-testid="pending-request"]');
    if (pendingRequests.length > 0) {
      await page2.click('[data-testid="pending-request"] button:contains("Akceptuj")');
      await page2.waitForTimeout(2000);
    }
    
    // Screenshot po akceptacji
    await page2.screenshot({ 
      path: 'friendship-system-accepted.png',
      fullPage: true 
    });
    console.log('📸 Screenshot: friendship-system-accepted.png');
    
    // Wróć do pierwszego użytkownika i sprawdź listę znajomych
    console.log('👥 Sprawdzanie listy znajomych...');
    await page.bringToFront();
    
    // Przejdź do zakładki znajomych
    await page.click('button:contains("Znajomi")');
    await page.waitForTimeout(2000);
    
    // Screenshot listy znajomych
    await page.screenshot({ 
      path: 'friendship-system-friends-list.png',
      fullPage: true 
    });
    console.log('📸 Screenshot: friendship-system-friends-list.png');
    
    // Test wyszukiwania znajomych
    console.log('🔍 Test wyszukiwania znajomych...');
    const searchInput = await page.$('input[placeholder*="Szukaj"]');
    if (searchInput) {
      await searchInput.type('Anna');
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: 'friendship-system-search.png',
        fullPage: true 
      });
      console.log('📸 Screenshot: friendship-system-search.png');
    }
    
    // Test blokowania użytkownika
    console.log('🚫 Test blokowania użytkownika...');
    const friendCards = await page.$$('[data-testid="friend-card"]');
    if (friendCards.length > 0) {
      await page.click('[data-testid="friend-card"] button:contains("Usuń")');
      await page.waitForTimeout(1000);
      
      // Potwierdź usunięcie
      await page.click('button:contains("Tak")');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'friendship-system-removed.png',
        fullPage: true 
      });
      console.log('📸 Screenshot: friendship-system-removed.png');
    }
    
    console.log('✅ Test systemu znajomych zakończony pomyślnie!');
    
  } catch (error) {
    console.error('❌ Błąd podczas testowania systemu znajomych:', error);
    await page.screenshot({ 
      path: 'friendship-system-error.png',
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Uruchom test
testFriendshipSystem().catch(console.error); 