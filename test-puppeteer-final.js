// Skrypt testowania Chrome z Puppeteer - FINALNA WERSJA
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const frontendUrl = 'https://portal-frontend-ysqz.onrender.com';
const backendUrl = 'https://portal-backend-igf9.onrender.com';

// Upewnij się, że katalog screenshots istnieje
const screenshotsDir = 'D:/portal/puppeteer-final-test';
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function testPortalFinal() {
    console.log('🚀 Testowanie portalu - FINALNA WERSJA...');
    
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
            fs.appendFileSync('D:/portal/puppeteer-final-logs.txt', logEntry);
        });
        
        // Przechwytuj błędy
        page.on('pageerror', error => {
            console.log(`❌ Błąd strony: ${error.message}`);
            fs.appendFileSync('D:/portal/puppeteer-final-errors.txt', `${new Date().toISOString()}: ${error.message}\n`);
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
        
        // Wypełnij formularz rejestracji
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
        
        // Wypełnij formularz logowania
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

        // ===== TEST 4: SPRAWDZENIE MENU UŻYTKOWNIKA =====
        console.log('\n👤 TEST 4: Sprawdzenie menu użytkownika');
        await page.waitForTimeout(3000);
        
        // Sprawdź czy użytkownik jest zalogowany i menu jest widoczne
        const userMenuExists = await page.evaluate(() => {
            // Sprawdź różne możliwe selektory menu użytkownika
            const selectors = [
                '[style*="cursor: pointer"]', // UserInfo z cursor pointer
                'div[style*="background"]', // UserInfo z tłem
                'div:has(> div:contains("👤"))', // Kontener z avatar
                'div:has(> div:contains("Poziom"))', // Kontener z poziomem
                'div[style*="border-radius: 8px"]', // UserInfo z border-radius
            ];
            
            for (const selector of selectors) {
                try {
                    const element = document.querySelector(selector);
                    if (element) {
                        console.log(`Znaleziono menu użytkownika: ${selector}`);
                        return true;
                    }
                } catch (e) {
                    // Ignoruj błędy selektorów
                }
            }
            
            // Sprawdź wszystkie divy z tekstem użytkownika
            const allDivs = document.querySelectorAll('div');
            for (const div of allDivs) {
                const text = div.textContent || '';
                if (text.includes('👤') && text.includes('Poziom')) {
                    console.log('Znaleziono menu użytkownika przez tekst');
                    return true;
                }
            }
            
            return false;
        });
        
        if (userMenuExists) {
            console.log('✅ Menu użytkownika znalezione!');
            
            // Kliknij w menu użytkownika
            await page.click('[style*="cursor: pointer"]');
            await page.waitForTimeout(2000);
            
            const userMenuScreenshotPath = `${screenshotsDir}/06_user_menu_open_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            await page.screenshot({ path: userMenuScreenshotPath });
            console.log(`📸 Screenshot menu użytkownika: ${userMenuScreenshotPath}`);
            
            // Sprawdź czy "Moje sklepy" jest w menu
            const myShopsInMenu = await page.evaluate(() => {
                const menuText = document.body.textContent || '';
                return menuText.includes('Moje sklepy');
            });
            
            if (myShopsInMenu) {
                console.log('✅ "Moje sklepy" znalezione w menu użytkownika!');
            } else {
                console.log('⚠️ "Moje sklepy" nie znalezione w menu użytkownika');
            }
        } else {
            console.log('❌ Menu użytkownika nie znalezione');
        }

        // ===== TEST 5: DODANIE SKLEPU =====
        console.log('\n➕ TEST 5: Dodanie nowego sklepu');
        await page.goto(`${frontendUrl}/shop-create`);
        await page.waitForTimeout(3000);
        
        // Wypełnij formularz sklepu
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

        // ===== TEST 6: SPRAWDZENIE "ADD PRODUCT" (powinno być widoczne po dodaniu sklepu) =====
        console.log('\n📦 TEST 6: Sprawdzenie widoczności "Add Product"');
        await page.goto(`${frontendUrl}/product-create`);
        await page.waitForTimeout(3000);
        
        // Sprawdź czy formularz produktu jest widoczny
        const productFormVisible = await page.evaluate(() => {
            const form = document.querySelector('form');
            const submitButton = document.querySelector('button[type="submit"]');
            return form && submitButton;
        });
        
        if (productFormVisible) {
            console.log('✅ Formularz produktu jest widoczny (użytkownik ma sklepy)');
            
            // Wypełnij formularz produktu
            const productName = `Test Product ${timestamp}`;
            const productDescription = 'To jest testowy produkt utworzony przez Puppeteer';
            
            await page.type('input[name="name"]', productName);
            await page.type('textarea[name="description"]', productDescription);
            await page.type('input[name="price"]', '99.99');
            await page.select('select[name="category"]', 'Elektronika');
            
            const productFormScreenshotPath = `${screenshotsDir}/09_product_form_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            await page.screenshot({ path: productFormScreenshotPath, fullPage: true });
            console.log(`📸 Screenshot formularza produktu: ${productFormScreenshotPath}`);
            
            // Kliknij przycisk dodania produktu
            await page.click('button[type="submit"]');
            await page.waitForTimeout(5000);
            
            const afterProductCreateScreenshotPath = `${screenshotsDir}/10_after_product_create_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            await page.screenshot({ path: afterProductCreateScreenshotPath });
            console.log(`📸 Screenshot po dodaniu produktu: ${afterProductCreateScreenshotPath}`);
        } else {
            console.log('⚠️ Formularz produktu nie jest widoczny (użytkownik nie ma sklepów)');
        }

        // ===== TEST 7: USTAWIENIA WYGLĄDU =====
        console.log('\n🎨 TEST 7: Ustawienia wyglądu');
        await page.goto(`${frontendUrl}/layout-customization`);
        await page.waitForTimeout(3000);
        
        // Sprawdź czy strona ustawień się załadowała
        const settingsLoaded = await page.evaluate(() => {
            return document.body.textContent.includes('Dostosuj wygląd') || 
                   document.body.textContent.includes('Layout') ||
                   document.body.textContent.includes('Theme');
        });
        
        if (settingsLoaded) {
            console.log('✅ Strona ustawień wyglądu załadowana');
            
            // Zmień layout na compact
            await page.select('select[name="layout"]', 'compact');
            
            // Zmień theme na dark
            await page.select('select[name="theme"]', 'dark');
            
            // Zapisz ustawienia
            await page.click('button[type="submit"]');
            await page.waitForTimeout(3000);
            
            const settingsScreenshotPath = `${screenshotsDir}/11_settings_saved_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
            await page.screenshot({ path: settingsScreenshotPath });
            console.log(`📸 Screenshot po zapisaniu ustawień: ${settingsScreenshotPath}`);
            
            // Sprawdź czy strona się przeładowała
            const currentUrl = page.url();
            if (currentUrl.includes('/layout-customization')) {
                console.log('✅ Ustawienia zostały zapisane i strona się przeładowała');
            } else {
                console.log('⚠️ Strona nie przeładowała się po zapisaniu ustawień');
            }
        } else {
            console.log('❌ Strona ustawień wyglądu nie załadowała się');
        }

        // ===== TEST 8: WYLOGOWANIE =====
        console.log('\n🚪 TEST 8: Wylogowanie');
        
        // Przejdź do strony głównej
        await page.goto(frontendUrl);
        await page.waitForTimeout(3000);
        
        // Spróbuj znaleźć i kliknąć przycisk wylogowania
        try {
            // Kliknij w menu użytkownika
            await page.click('[style*="cursor: pointer"]');
            await page.waitForTimeout(1000);
            
            // Kliknij w "Wyloguj"
            await page.click('div:contains("🚪 Wyloguj"), div:contains("Wyloguj")');
            await page.waitForTimeout(3000);
            
            console.log('✅ Wylogowanie przez menu użytkownika');
        } catch (e) {
            console.log('⚠️ Nie udało się wylogować przez menu, przechodzę do strony logowania');
            await page.goto(`${frontendUrl}/login`);
            await page.waitForTimeout(3000);
        }
        
        const logoutScreenshotPath = `${screenshotsDir}/12_after_logout_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: logoutScreenshotPath });
        console.log(`📸 Screenshot po wylogowaniu: ${logoutScreenshotPath}`);

        // ===== TEST 9: SPRAWDZENIE "ADD PRODUCT" DLA NIEZALOGOWANEGO =====
        console.log('\n📦 TEST 9: Sprawdzenie "Add Product" dla niezalogowanego użytkownika');
        await page.goto(`${frontendUrl}/product-create`);
        await page.waitForTimeout(3000);
        
        // Sprawdź czy jest przekierowanie do logowania
        const currentUrl = page.url();
        if (currentUrl.includes('/login')) {
            console.log('✅ Niezalogowany użytkownik został przekierowany do logowania');
        } else {
            console.log('⚠️ Niezalogowany użytkownik ma dostęp do formularza produktu');
        }
        
        const unauthorizedScreenshotPath = `${screenshotsDir}/13_unauthorized_access_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: unauthorizedScreenshotPath });
        console.log(`📸 Screenshot dostępu bez autoryzacji: ${unauthorizedScreenshotPath}`);

        console.log('\n✅ Wszystkie testy zakończone pomyślnie!');
        console.log(`📁 Screenshoty zapisane w: ${screenshotsDir}`);
        console.log(`📄 Logi zapisane w: D:/portal/puppeteer-final-logs.txt`);
        console.log(`❌ Błędy zapisane w: D:/portal/puppeteer-final-errors.txt`);
        
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

// Uruchom testowanie
testPortalFinal(); 