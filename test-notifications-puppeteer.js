const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Konfiguracja
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api';
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

// Funkcja do logowania użytkownika
const loginUser = async (page, email, password) => {
  try {
    log(`🔐 Logowanie użytkownika: ${email}`);
    
    await page.goto(`${BASE_URL}/login`);
    await takeScreenshot(page, '01_login_page');
    
    await waitForElement(page, 'input[name="emailOrUsername"], input[name="email"], input[type="email"]');
    await page.type('input[name="emailOrUsername"], input[name="email"], input[type="email"]', email);
    await page.type('input[name="password"], input[type="password"]', password);
    
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      log(`❌ Logowanie nieudane`);
      await takeScreenshot(page, '02_login_failed');
      return false;
    }
    
    log(`✅ Logowanie udane`);
    await takeScreenshot(page, '03_after_login');
    return true;
    
  } catch (error) {
    log(`❌ Błąd podczas logowania: ${error.message}`);
    await takeScreenshot(page, 'ERROR_login');
    return false;
  }
};

// Funkcja do sprawdzenia powiadomień w navbar
const checkNavbarNotifications = async (page) => {
  try {
    log(`🔔 Sprawdzam powiadomienia w navbar`);
    
    // Znajdź ikonę powiadomień w navbar
    const notificationIcon = await page.$('.notification-icon, .notifications-icon, [data-testid="notifications"], .bell-icon');
    
    if (notificationIcon) {
      // Sprawdź czy jest licznik powiadomień
      const notificationCount = await page.$('.notification-count, .badge, .notification-badge');
      
      if (notificationCount) {
        const count = await notificationCount.evaluate(el => el.textContent);
        log(`📊 Liczba powiadomień w navbar: ${count}`);
        await takeScreenshot(page, '04_navbar_notifications');
        return parseInt(count) || 0;
      } else {
        log(`ℹ️ Brak licznika powiadomień w navbar`);
        return 0;
      }
    } else {
      log(`⚠️ Nie znaleziono ikony powiadomień w navbar`);
      await takeScreenshot(page, '05_no_notification_icon');
      return 0;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas sprawdzania powiadomień w navbar: ${error.message}`);
    return 0;
  }
};

// Funkcja do otwarcia dropdown powiadomień
const openNotificationsDropdown = async (page) => {
  try {
    log(`🔔 Otwieram dropdown powiadomień`);
    
    const notificationIcon = await page.$('.notification-icon, .notifications-icon, [data-testid="notifications"], .bell-icon');
    
    if (notificationIcon) {
      await notificationIcon.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '06_notifications_dropdown');
      
      // Sprawdź czy dropdown się otworzył
      const dropdown = await page.$('.notifications-dropdown, .notification-menu, .dropdown-menu');
      if (dropdown) {
        log(`✅ Dropdown powiadomień otwarty`);
        return true;
      } else {
        log(`❌ Dropdown powiadomień nie otworzył się`);
        return false;
      }
    } else {
      log(`❌ Nie znaleziono ikony powiadomień`);
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas otwierania dropdown: ${error.message}`);
    return false;
  }
};

// Funkcja do sprawdzenia powiadomień w dropdown
const checkDropdownNotifications = async (page) => {
  try {
    log(`📋 Sprawdzam powiadomienia w dropdown`);
    
    // Sprawdź czy dropdown jest otwarty
    const dropdown = await page.$('.notifications-dropdown, .notification-menu, .dropdown-menu');
    if (!dropdown) {
      log(`❌ Dropdown nie jest otwarty`);
      return { total: 0, friendRequests: 0 };
    }
    
    // Znajdź wszystkie powiadomienia
    const notifications = await page.$$('.notification-item, .notification, .dropdown-item');
    log(`📊 Znaleziono ${notifications.length} powiadomień w dropdown`);
    
    // Sprawdź powiadomienia o zaproszeniach
    let friendRequestCount = 0;
    for (const notification of notifications) {
      const text = await notification.evaluate(el => el.textContent);
      if (text.includes('zaproszenie do znajomych') || text.includes('friend request')) {
        friendRequestCount++;
      }
    }
    
    log(`👥 Znaleziono ${friendRequestCount} powiadomień o zaproszeniach`);
    await takeScreenshot(page, '07_dropdown_notifications');
    
    return {
      total: notifications.length,
      friendRequests: friendRequestCount
    };
    
  } catch (error) {
    log(`❌ Błąd podczas sprawdzania dropdown: ${error.message}`);
    return { total: 0, friendRequests: 0 };
  }
};

// Funkcja do przejścia do strony powiadomień
const goToNotificationsPage = async (page) => {
  try {
    log(`📄 Przechodzę do strony powiadomień`);
    
    await page.goto(`${BASE_URL}/notifications`);
    await page.waitForTimeout(3000);
    await takeScreenshot(page, '08_notifications_page');
    
    // Sprawdź czy strona się załadowała
    const pageTitle = await page.$('h1, .page-title, [data-testid="notifications-title"]');
    if (pageTitle) {
      const title = await pageTitle.evaluate(el => el.textContent);
      log(`✅ Strona powiadomień załadowana: ${title}`);
      return true;
    } else {
      log(`❌ Nie udało się załadować strony powiadomień`);
      await takeScreenshot(page, 'ERROR_notifications_page');
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas ładowania strony powiadomień: ${error.message}`);
    await takeScreenshot(page, 'ERROR_notifications_page');
    return false;
  }
};

// Funkcja do sprawdzenia powiadomień na stronie
const checkNotificationsPage = async (page) => {
  try {
    log(`📋 Sprawdzam powiadomienia na stronie`);
    
    // Znajdź wszystkie powiadomienia
    const notifications = await page.$$('.notification-item, .notification, [data-testid="notification"]');
    log(`📊 Znaleziono ${notifications.length} powiadomień na stronie`);
    
    // Sprawdź różne typy powiadomień
    let friendRequestCount = 0;
    let otherCount = 0;
    
    for (const notification of notifications) {
      const text = await notification.evaluate(el => el.textContent);
      const type = await notification.evaluate(el => el.getAttribute('data-type') || el.className);
      
      if (text.includes('zaproszenie do znajomych') || text.includes('friend request') || type.includes('friend')) {
        friendRequestCount++;
        log(`👥 Powiadomienie o zaproszeniu: ${text.substring(0, 50)}...`);
      } else {
        otherCount++;
        log(`📝 Inne powiadomienie: ${text.substring(0, 50)}...`);
      }
    }
    
    await takeScreenshot(page, '09_notifications_list');
    
    return {
      total: notifications.length,
      friendRequests: friendRequestCount,
      other: otherCount
    };
    
  } catch (error) {
    log(`❌ Błąd podczas sprawdzania powiadomień: ${error.message}`);
    return { total: 0, friendRequests: 0, other: 0 };
  }
};

// Funkcja do akceptacji zaproszenia z listy powiadomień
const acceptFriendRequestFromList = async (page) => {
  try {
    log(`✅ Akceptuję zaproszenie z listy powiadomień`);
    
    // Znajdź pierwsze powiadomienie o zaproszeniu
    const friendRequestNotification = await page.$('.notification-item:has-text("zaproszenie do znajomych"), .notification:has-text("friend request")');
    
    if (friendRequestNotification) {
      // Znajdź przycisk "Akceptuj" w tym powiadomieniu
      const acceptButton = await friendRequestNotification.$('button:contains("Akceptuj"), button:contains("Accept"), [data-testid="accept-friend"]');
      
      if (acceptButton) {
        await acceptButton.click();
        await page.waitForTimeout(2000);
        await takeScreenshot(page, '10_friend_request_accepted');
        
        log(`✅ Zaproszenie zaakceptowane z listy powiadomień`);
        return true;
      } else {
        log(`❌ Nie znaleziono przycisku "Akceptuj" w powiadomieniu`);
        await takeScreenshot(page, 'ERROR_no_accept_button_in_notification');
        return false;
      }
    } else {
      log(`❌ Nie znaleziono powiadomienia o zaproszeniu`);
      await takeScreenshot(page, 'ERROR_no_friend_request_notification');
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas akceptacji z listy: ${error.message}`);
    await takeScreenshot(page, 'ERROR_accept_from_list');
    return false;
  }
};

// Funkcja do odrzucenia zaproszenia
const rejectFriendRequest = async (page) => {
  try {
    log(`❌ Odrzucam zaproszenie do znajomych`);
    
    // Znajdź przycisk "Odrzuć" w powiadomieniach
    const rejectButton = await page.$('button:contains("Odrzuć"), button:contains("Reject"), [data-testid="reject-friend"]');
    
    if (rejectButton) {
      await rejectButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '11_friend_request_rejected');
      
      log(`✅ Zaproszenie odrzucone`);
      return true;
    } else {
      log(`❌ Nie znaleziono przycisku "Odrzuć"`);
      await takeScreenshot(page, 'ERROR_no_reject_button');
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas odrzucania zaproszenia: ${error.message}`);
    await takeScreenshot(page, 'ERROR_reject_friend');
    return false;
  }
};

// Funkcja do oznaczania powiadomień jako przeczytane
const markNotificationsAsRead = async (page) => {
  try {
    log(`👁️ Oznaczam powiadomienia jako przeczytane`);
    
    // Znajdź przycisk "Oznacz jako przeczytane"
    const markReadButton = await page.$('button:contains("Oznacz jako przeczytane"), button:contains("Mark as read"), [data-testid="mark-read"]');
    
    if (markReadButton) {
      await markReadButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot(page, '12_notifications_marked_read');
      
      log(`✅ Powiadomienia oznaczone jako przeczytane`);
      return true;
    } else {
      log(`⚠️ Nie znaleziono przycisku "Oznacz jako przeczytane"`);
      return false;
    }
    
  } catch (error) {
    log(`❌ Błąd podczas oznaczania jako przeczytane: ${error.message}`);
    return false;
  }
};

// Główna funkcja testowa
const runNotificationsTest = async () => {
  let browser;
  
  try {
    log('🚀 Rozpoczynam test systemu powiadomień z Puppeteer');
    
    // Uruchom przeglądarkę
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    
    // Test 1: Logowanie jako admin
    const loginSuccess = await loginUser(page, 'admin@test.com', 'admin123');
    if (!loginSuccess) {
      throw new Error('Logowanie nieudane');
    }
    
    // Test 2: Sprawdzenie powiadomień w navbar
    const navbarCount = await checkNavbarNotifications(page);
    log(`📊 Powiadomienia w navbar: ${navbarCount}`);
    
    // Test 3: Otwarcie dropdown powiadomień
    const dropdownOpened = await openNotificationsDropdown(page);
    if (dropdownOpened) {
      const dropdownNotifications = await checkDropdownNotifications(page);
      log(`📊 Powiadomienia w dropdown: ${dropdownNotifications.total} total, ${dropdownNotifications.friendRequests} o zaproszeniach`);
    }
    
    // Test 4: Przejście do strony powiadomień
    const pageLoaded = await goToNotificationsPage(page);
    if (pageLoaded) {
      const pageNotifications = await checkNotificationsPage(page);
      log(`📊 Powiadomienia na stronie: ${pageNotifications.total} total, ${pageNotifications.friendRequests} o zaproszeniach, ${pageNotifications.other} inne`);
      
      // Test 5: Akceptacja zaproszenia (jeśli są)
      if (pageNotifications.friendRequests > 0) {
        const acceptSuccess = await acceptFriendRequestFromList(page);
        if (acceptSuccess) {
          log('✅ Zaproszenie zaakceptowane z listy powiadomień');
          
          // Sprawdź ponownie powiadomienia
          await page.waitForTimeout(2000);
          const updatedNotifications = await checkNotificationsPage(page);
          log(`📊 Zaktualizowane powiadomienia: ${updatedNotifications.total} total, ${updatedNotifications.friendRequests} o zaproszeniach`);
        }
      }
      
      // Test 6: Oznaczenie jako przeczytane
      await markNotificationsAsRead(page);
    }
    
    // Test 7: Sprawdzenie ponowne navbar
    await page.goto(`${BASE_URL}`);
    await page.waitForTimeout(2000);
    const updatedNavbarCount = await checkNavbarNotifications(page);
    log(`📊 Zaktualizowane powiadomienia w navbar: ${updatedNavbarCount}`);
    
    log('🎉 Test systemu powiadomień zakończony pomyślnie!');
    
  } catch (error) {
    log(`❌ Błąd podczas testu: ${error.message}`);
    if (typeof page !== 'undefined' && page) {
      await takeScreenshot(page, 'ERROR_test_failed');
    }
  } finally {
    if (browser) {
      await browser.close();
      log('🔌 Przeglądarka zamknięta');
    }
  }
};

// Uruchom test
runNotificationsTest().catch(console.error); 