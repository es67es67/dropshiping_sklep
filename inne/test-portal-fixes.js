// Skrypt testowy naprawionych funkcji portalu
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const frontendUrl = 'https://portal-frontend-ysqz.onrender.com';
const backendUrl = 'https://portal-backend-igf9.onrender.com';

// Upewnij się, że katalog screenshots istnieje
const screenshotsDir = 'D:/portal/test-fixes-screenshots';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function testPortalFixes() {
    console.log('🧪 Testowanie naprawionych funkcji portalu...');
    
    let browser;
    let page;
    
    try {
        // Uruchom Chrome
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 1000
        });
        
        page = await browser.newPage();
        
        // Przechwytuj logi konsoli
        page.on('console', msg => {
            const level = msg.type();
            const text = msg.text();
            const timestamp = new Date().toISOString();
            
            console.log(`[${timestamp}] [${level.toUpperCase()}] ${text}`);
            
            // Zapisz do pliku
            const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${text}\n`;
            fs.appendFileSync('D:/portal/test-fixes-logs.txt', logEntry);
        });
        
        // Przechwytuj błędy
        page.on('pageerror', error => {
            console.log(`❌ Błąd strony: ${error.message}`);
            fs.appendFileSync('D:/portal/test-fixes-errors.txt', `${new Date().toISOString()}: ${error.message}\n`);
        });

        // ===== TEST 1: STRONA GŁÓWNA =====
        console.log('\n🌐 TEST 1: Strona główna');
        await page.goto(frontendUrl, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(3000);
        
        const mainScreenshotPath = `${screenshotsDir}/01_main_page.png`;
        await page.screenshot({ path: mainScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot strony głównej: ${mainScreenshotPath}`);

        // ===== TEST 2: REJESTRACJA NOWEGO UŻYTKOWNIKA =====
        console.log('\n📝 TEST 2: Rejestracja nowego użytkownika');
        await page.goto(`${frontendUrl}/register`);
        await page.waitForTimeout(2000);
        
        const timestamp = Date.now();
        const testUsername = `TestUser${timestamp}`;
        const testEmail = `test${timestamp}@example.com`;
        const testPassword = 'Test123!';
        
        console.log(`👤 Rejestruję użytkownika: ${testUsername} (${testEmail})`);
        
        // Wypełnij formularz rejestracji
        await page.type('input[name="firstName"]', testUsername);
        await page.type('input[name="lastName"]', 'TestLastName');
        await page.type('input[name="email"]', testEmail);
        await page.type('input[name="password"]', testPassword);
        await page.type('input[name="confirmPassword"]', testPassword);
        await page.type('input[name="phone"]', '+48 123 456 789');
        await page.type('input[name="city"]', 'Warszawa');
        
        // Zaznacz checkboxy
        await page.click('input[name="acceptTerms"]');
        await page.click('input[name="acceptNewsletter"]');
        
        const registerScreenshotPath = `${screenshotsDir}/02_register_form.png`;
        await page.screenshot({ path: registerScreenshotPath });
        console.log(`📸 Screenshot formularza rejestracji: ${registerScreenshotPath}`);
        
        // Kliknij przycisk rejestracji
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const afterRegisterScreenshotPath = `${screenshotsDir}/03_after_register.png`;
        await page.screenshot({ path: afterRegisterScreenshotPath });
        console.log(`📸 Screenshot po rejestracji: ${afterRegisterScreenshotPath}`);

        // ===== TEST 3: LOGOWANIE =====
        console.log('\n🔐 TEST 3: Logowanie');
        await page.goto(`${frontendUrl}/login`);
        await page.waitForTimeout(2000);
        
        // Wypełnij formularz logowania
        await page.type('input[name="emailOrUsername"]', testEmail);
        await page.type('input[name="password"]', testPassword);
        
        const loginScreenshotPath = `${screenshotsDir}/04_login_form.png`;
        await page.screenshot({ path: loginScreenshotPath });
        console.log(`📸 Screenshot formularza logowania: ${loginScreenshotPath}`);
        
        // Kliknij przycisk logowania
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const afterLoginScreenshotPath = `${screenshotsDir}/05_after_login.png`;
        await page.screenshot({ path: afterLoginScreenshotPath });
        console.log(`📸 Screenshot po logowaniu: ${afterLoginScreenshotPath}`);

        // ===== TEST 4: SPRAWDZENIE MENU UŻYTKOWNIKA =====
        console.log('\n👤 TEST 4: Sprawdzenie menu użytkownika (Moje sklepy)');
        await page.waitForTimeout(2000);
        
        // Kliknij na menu użytkownika
        await page.click('.UserInfo');
        await page.waitForTimeout(1000);
        
        const userMenuScreenshotPath = `${screenshotsDir}/06_user_menu.png`;
        await page.screenshot({ path: userMenuScreenshotPath });
        console.log(`📸 Screenshot menu użytkownika: ${userMenuScreenshotPath}`);

        // ===== TEST 5: DODANIE SKLEPU =====
        console.log('\n➕ TEST 5: Dodanie nowego sklepu');
        await page.goto(`${frontendUrl}/shop-create`);
        await page.waitForTimeout(3000);
        
        // Wypełnij formularz sklepu
        const shopName = `Test Shop ${timestamp}`;
        const shopDescription = 'To jest testowy sklep utworzony przez test napraw';
        
        await page.type('input[name="name"]', shopName);
        await page.type('textarea[name="description"]', shopDescription);
        await page.select('select[name="category"]', 'Elektronika');
        await page.type('input[name="address"]', 'Testowa ulica 123');
        await page.type('input[name="city"]', 'Warszawa');
        await page.type('input[name="postalCode"]', '00-001');
        await page.type('input[name="phone"]', '+48 123 456 789');
        await page.type('input[name="email"]', 'shop@test.com');
        await page.type('input[name="website"]', 'https://test-shop.pl');
        await page.type('input[name="openingHours"]', 'Pon-Pt 9:00-18:00, Sob 9:00-14:00');
        
        const shopFormScreenshotPath = `${screenshotsDir}/07_shop_form.png`;
        await page.screenshot({ path: shopFormScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot formularza sklepu: ${shopFormScreenshotPath}`);
        
        // Kliknij przycisk dodania sklepu
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const afterShopCreateScreenshotPath = `${screenshotsDir}/08_after_shop_create.png`;
        await page.screenshot({ path: afterShopCreateScreenshotPath });
        console.log(`📸 Screenshot po dodaniu sklepu: ${afterShopCreateScreenshotPath}`);

        // ===== TEST 6: SPRAWDZENIE DODAWANIA PRODUKTU (z uprawnieniami) =====
        console.log('\n📦 TEST 6: Sprawdzenie dodawania produktu (z uprawnieniami)');
        await page.goto(`${frontendUrl}/product-create`);
        await page.waitForTimeout(3000);
        
        const productCreateScreenshotPath = `${screenshotsDir}/09_product_create_with_permissions.png`;
        await page.screenshot({ path: productCreateScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot dodawania produktu (z uprawnieniami): ${productCreateScreenshotPath}`);

        // ===== TEST 7: WYLOGOWANIE I SPRAWDZENIE BEZ UPRAWNIEŃ =====
        console.log('\n🚪 TEST 7: Wylogowanie i sprawdzenie bez uprawnień');
        
        // Wyloguj się
        await page.click('.UserInfo');
        await page.waitForTimeout(1000);
        await page.click('text=🚪 Wyloguj');
        await page.waitForTimeout(3000);
        
        const afterLogoutScreenshotPath = `${screenshotsDir}/10_after_logout.png`;
        await page.screenshot({ path: afterLogoutScreenshotPath });
        console.log(`📸 Screenshot po wylogowaniu: ${afterLogoutScreenshotPath}`);

        // Sprawdź dodawanie produktu bez uprawnień
        await page.goto(`${frontendUrl}/product-create`);
        await page.waitForTimeout(3000);
        
        const productCreateNoPermissionsScreenshotPath = `${screenshotsDir}/11_product_create_no_permissions.png`;
        await page.screenshot({ path: productCreateNoPermissionsScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot dodawania produktu (bez uprawnień): ${productCreateNoPermissionsScreenshotPath}`);

        // ===== TEST 8: LOGOWANIE I SPRAWDZENIE USTAWIENIA =====
        console.log('\n⚙️ TEST 8: Sprawdzenie ustawień wyglądu');
        
        // Zaloguj się ponownie
        await page.goto(`${frontendUrl}/login`);
        await page.waitForTimeout(2000);
        await page.type('input[name="emailOrUsername"]', testEmail);
        await page.type('input[name="password"]', testPassword);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        // Przejdź do ustawień
        await page.goto(`${frontendUrl}/settings`);
        await page.waitForTimeout(3000);
        
        const settingsScreenshotPath = `${screenshotsDir}/12_settings_page.png`;
        await page.screenshot({ path: settingsScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot strony ustawień: ${settingsScreenshotPath}`);
        
        // Zmień motyw
        await page.click('text=Zielony');
        await page.waitForTimeout(1000);
        
        // Kliknij zapisz ustawienia
        await page.click('text=💾 Zapisz ustawienia');
        await page.waitForTimeout(3000);
        
        const afterSettingsSaveScreenshotPath = `${screenshotsDir}/13_after_settings_save.png`;
        await page.screenshot({ path: afterSettingsSaveScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot po zapisaniu ustawień: ${afterSettingsSaveScreenshotPath}`);

        console.log('\n✅ Wszystkie testy naprawionych funkcji zakończone pomyślnie!');
        console.log(`📁 Screenshoty zapisane w: ${screenshotsDir}`);
        console.log(`📄 Logi zapisane w: D:/portal/test-fixes-logs.txt`);
        console.log(`❌ Błędy zapisane w: D:/portal/test-fixes-errors.txt`);
        
    } catch (error) {
        console.error('❌ Błąd podczas testowania:', error);
        
        // Zrób screenshot błędu
        if (page) {
            const errorScreenshotPath = `${screenshotsDir}/ERROR_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            await page.screenshot({ path: errorScreenshotPath });
            console.log(`📸 Screenshot błędu: ${errorScreenshotPath}`);
        }
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔌 Przeglądarka zamknięta');
        }
    }
}

// Uruchom testy
testPortalFixes(); 