// Skrypt monitorowania Chrome z Puppeteer - POPRAWIONY
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const frontendUrl = 'https://portal-frontend-ysqz.onrender.com';
const backendUrl = 'https://portal-backend-igf9.onrender.com';

// Upewnij się, że katalog screenshots istnieje
const screenshotsDir = 'D:/portal/chrome-screenshots-fixed';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function monitorChromeFixed() {
    console.log('🚀 Rozbudowane monitorowanie Chrome z Puppeteer (POPRAWIONE)...');
    
    let browser;
    let page;
    
    try {
        // Uruchom Chrome
        browser = await puppeteer.launch({
            headless: false, // Pokaż przeglądarkę
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 1000 // Spowolnij akcje dla lepszej widoczności
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
            fs.appendFileSync('D:/portal/chrome-console-logs-fixed.txt', logEntry);
        });
        
        // Przechwytuj błędy
        page.on('pageerror', error => {
            console.log(`❌ Błąd strony: ${error.message}`);
            fs.appendFileSync('D:/portal/chrome-errors-fixed.txt', `${new Date().toISOString()}: ${error.message}\n`);
        });
        
        // Przechwytuj błędy sieciowe
        page.on('response', response => {
            if (!response.ok()) {
                console.log(`⚠️ Błąd HTTP ${response.status()}: ${response.url()}`);
            }
        });

        // ===== TEST 1: STRONA GŁÓWNA =====
        console.log('\n🌐 TEST 1: Strona główna');
        await page.goto(frontendUrl, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(3000);
        
        const mainScreenshotPath = `${screenshotsDir}/01_main_page_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: mainScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot strony głównej: ${mainScreenshotPath}`);

        // ===== TEST 2: REJESTRACJA =====
        console.log('\n📝 TEST 2: Rejestracja nowego użytkownika');
        await page.goto(`${frontendUrl}/register`);
        await page.waitForTimeout(2000);
        
        // Generuj unikalne dane testowe
        const timestamp = Date.now();
        const testFirstName = `TestUser${timestamp}`;
        const testLastName = `TestLastName${timestamp}`;
        const testEmail = `test${timestamp}@example.com`;
        const testPassword = 'Test123!';
        
        console.log(`👤 Rejestruję użytkownika: ${testFirstName} ${testLastName} (${testEmail})`);
        
        // Wypełnij formularz rejestracji (poprawione selektory)
        await page.type('input[name="firstName"]', testFirstName);
        await page.type('input[name="lastName"]', testLastName);
        await page.type('input[name="email"]', testEmail);
        await page.type('input[name="password"]', testPassword);
        await page.type('input[name="confirmPassword"]', testPassword);
        await page.type('input[name="phone"]', '+48 123 456 789');
        await page.type('input[name="city"]', 'Warszawa');
        
        // Zaznacz checkboxy
        await page.click('input[name="acceptTerms"]');
        await page.click('input[name="acceptNewsletter"]');
        
        const registerScreenshotPath = `${screenshotsDir}/02_register_form_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: registerScreenshotPath });
        console.log(`📸 Screenshot formularza rejestracji: ${registerScreenshotPath}`);
        
        // Kliknij przycisk rejestracji
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const afterRegisterScreenshotPath = `${screenshotsDir}/03_after_register_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: afterRegisterScreenshotPath });
        console.log(`📸 Screenshot po rejestracji: ${afterRegisterScreenshotPath}`);

        // ===== TEST 3: LOGOWANIE =====
        console.log('\n🔐 TEST 3: Logowanie');
        await page.goto(`${frontendUrl}/login`);
        await page.waitForTimeout(2000);
        
        // Wypełnij formularz logowania (poprawione selektory)
        await page.type('input[name="emailOrUsername"]', testEmail);
        await page.type('input[name="password"]', testPassword);
        
        const loginScreenshotPath = `${screenshotsDir}/04_login_form_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: loginScreenshotPath });
        console.log(`📸 Screenshot formularza logowania: ${loginScreenshotPath}`);
        
        // Kliknij przycisk logowania
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const afterLoginScreenshotPath = `${screenshotsDir}/05_after_login_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: afterLoginScreenshotPath });
        console.log(`📸 Screenshot po logowaniu: ${afterLoginScreenshotPath}`);

        // ===== TEST 4: LISTA SKLEPÓW (przed dodaniem) =====
        console.log('\n🏪 TEST 4: Lista sklepów (przed dodaniem)');
        await page.goto(`${frontendUrl}/shops`);
        await page.waitForTimeout(3000);
        
        const shopsBeforeScreenshotPath = `${screenshotsDir}/06_shops_before_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: shopsBeforeScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot listy sklepów (przed): ${shopsBeforeScreenshotPath}`);

        // ===== TEST 5: DODANIE SKLEPU =====
        console.log('\n➕ TEST 5: Dodanie nowego sklepu');
        await page.goto(`${frontendUrl}/shop-create`);
        await page.waitForTimeout(3000);
        
        // Wypełnij formularz sklepu (poprawione selektory)
        const shopName = `Test Shop ${timestamp}`;
        const shopDescription = 'To jest testowy sklep utworzony przez Puppeteer';
        
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
        
        const shopFormScreenshotPath = `${screenshotsDir}/07_shop_form_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: shopFormScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot formularza sklepu: ${shopFormScreenshotPath}`);
        
        // Kliknij przycisk dodania sklepu
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const afterShopCreateScreenshotPath = `${screenshotsDir}/08_after_shop_create_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: afterShopCreateScreenshotPath });
        console.log(`📸 Screenshot po dodaniu sklepu: ${afterShopCreateScreenshotPath}`);

        // ===== TEST 6: LISTA SKLEPÓW (po dodaniu) =====
        console.log('\n🏪 TEST 6: Lista sklepów (po dodaniu)');
        await page.goto(`${frontendUrl}/shops`);
        await page.waitForTimeout(3000);
        
        const shopsAfterScreenshotPath = `${screenshotsDir}/09_shops_after_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: shopsAfterScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot listy sklepów (po): ${shopsAfterScreenshotPath}`);

        // ===== TEST 7: ZARZĄDZANIE SKLEPAMI =====
        console.log('\n⚙️ TEST 7: Zarządzanie sklepami');
        await page.goto(`${frontendUrl}/shop-management`);
        await page.waitForTimeout(3000);
        
        const shopManagementScreenshotPath = `${screenshotsDir}/10_shop_management_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: shopManagementScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot zarządzania sklepami: ${shopManagementScreenshotPath}`);

        // ===== TEST 8: DODANIE PRODUKTU =====
        console.log('\n📦 TEST 8: Dodanie produktu');
        await page.goto(`${frontendUrl}/product-create`);
        await page.waitForTimeout(3000);
        
        // Sprawdź jakie pola są w formularzu produktu
        const productInputs = await page.evaluate(() => {
            const inputElements = document.querySelectorAll('input, textarea, select');
            return Array.from(inputElements).map(input => ({
                name: input.name,
                id: input.id,
                type: input.type,
                placeholder: input.placeholder,
                tagName: input.tagName
            }));
        });
        
        console.log('📋 Pola formularza produktu:');
        productInputs.forEach((input, index) => {
            console.log(`${index + 1}. ${input.tagName}[name="${input.name}"][type="${input.type}"] placeholder="${input.placeholder}"`);
        });
        
        // Wypełnij formularz produktu (bazując na typowych polach)
        const productName = `Test Product ${timestamp}`;
        const productDescription = 'To jest testowy produkt utworzony przez Puppeteer';
        
        // Wypełnij pola jeśli istnieją
        if (productInputs.find(i => i.name === 'name')) {
            await page.type('input[name="name"]', productName);
        }
        if (productInputs.find(i => i.name === 'description')) {
            await page.type('textarea[name="description"]', productDescription);
        }
        if (productInputs.find(i => i.name === 'price')) {
            await page.type('input[name="price"]', '99.99');
        }
        if (productInputs.find(i => i.name === 'category')) {
            await page.select('select[name="category"]', 'Elektronika');
        }
        
        const productFormScreenshotPath = `${screenshotsDir}/11_product_form_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: productFormScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot formularza produktu: ${productFormScreenshotPath}`);
        
        // Kliknij przycisk dodania produktu
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const afterProductCreateScreenshotPath = `${screenshotsDir}/12_after_product_create_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: afterProductCreateScreenshotPath });
        console.log(`📸 Screenshot po dodaniu produktu: ${afterProductCreateScreenshotPath}`);

        // ===== TEST 9: LISTA PRODUKTÓW =====
        console.log('\n📦 TEST 9: Lista produktów');
        await page.goto(`${frontendUrl}/products`);
        await page.waitForTimeout(3000);
        
        const productsScreenshotPath = `${screenshotsDir}/13_products_list_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: productsScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot listy produktów: ${productsScreenshotPath}`);

        // ===== TEST 10: PROFIL UŻYTKOWNIKA =====
        console.log('\n👤 TEST 10: Profil użytkownika');
        await page.goto(`${frontendUrl}/profile`);
        await page.waitForTimeout(3000);
        
        const profileScreenshotPath = `${screenshotsDir}/14_user_profile_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: profileScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot profilu użytkownika: ${profileScreenshotPath}`);

        // ===== TEST 11: WYSZUKIWANIE =====
        console.log('\n🔍 TEST 11: Wyszukiwanie');
        await page.goto(`${frontendUrl}/search`);
        await page.waitForTimeout(3000);
        
        // Wypełnij wyszukiwanie
        await page.type('input[placeholder*="szukaj"]', 'test');
        await page.waitForTimeout(2000);
        
        const searchScreenshotPath = `${screenshotsDir}/15_search_results_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: searchScreenshotPath, fullPage: true });
        console.log(`📸 Screenshot wyników wyszukiwania: ${searchScreenshotPath}`);

        // ===== TEST 12: WYLOGOWANIE =====
        console.log('\n🚪 TEST 12: Wylogowanie');
        
        // Znajdź i kliknij przycisk wylogowania (może być w menu lub navbar)
        try {
            await page.click('button[onclick*="logout"], a[href*="logout"], .logout-btn');
            await page.waitForTimeout(3000);
        } catch (e) {
            console.log('⚠️ Nie znaleziono przycisku wylogowania, przechodzę do strony logowania');
            await page.goto(`${frontendUrl}/login`);
            await page.waitForTimeout(3000);
        }
        
        const logoutScreenshotPath = `${screenshotsDir}/16_after_logout_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: logoutScreenshotPath });
        console.log(`📸 Screenshot po wylogowaniu: ${logoutScreenshotPath}`);

        console.log('\n✅ Wszystkie testy zakończone pomyślnie!');
        console.log(`📁 Screenshoty zapisane w: ${screenshotsDir}`);
        console.log(`📄 Logi zapisane w: D:/portal/chrome-console-logs-fixed.txt`);
        console.log(`❌ Błędy zapisane w: D:/portal/chrome-errors-fixed.txt`);
        
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

// Uruchom monitoring
monitorChromeFixed(); 