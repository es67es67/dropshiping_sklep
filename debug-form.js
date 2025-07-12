// Skrypt debugowania formularzy
const puppeteer = require('puppeteer');

const frontendUrl = 'https://portal-frontend-ysqz.onrender.com';

async function debugForms() {
    console.log('🔍 Debugowanie formularzy...');
    
    let browser;
    let page;
    
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            slowMo: 2000
        });
        
        page = await browser.newPage();
        
        // ===== DEBUG REJESTRACJI =====
        console.log('\n📝 Debugowanie formularza rejestracji');
        await page.goto(`${frontendUrl}/register`);
        await page.waitForTimeout(3000);
        
        // Znajdź wszystkie inputy na stronie
        const inputs = await page.evaluate(() => {
            const inputElements = document.querySelectorAll('input, textarea, select');
            return Array.from(inputElements).map(input => ({
                name: input.name,
                id: input.id,
                type: input.type,
                placeholder: input.placeholder,
                className: input.className,
                tagName: input.tagName
            }));
        });
        
        console.log('📋 Znalezione pola formularza rejestracji:');
        inputs.forEach((input, index) => {
            console.log(`${index + 1}. ${input.tagName}[name="${input.name}"][id="${input.id}"][type="${input.type}"] placeholder="${input.placeholder}"`);
        });
        
        // Zrób screenshot
        await page.screenshot({ path: 'D:/portal/debug-register-form.png', fullPage: true });
        console.log('📸 Screenshot formularza rejestracji: D:/portal/debug-register-form.png');
        
        // ===== DEBUG LOGOWANIA =====
        console.log('\n🔐 Debugowanie formularza logowania');
        await page.goto(`${frontendUrl}/login`);
        await page.waitForTimeout(3000);
        
        const loginInputs = await page.evaluate(() => {
            const inputElements = document.querySelectorAll('input, textarea, select');
            return Array.from(inputElements).map(input => ({
                name: input.name,
                id: input.id,
                type: input.type,
                placeholder: input.placeholder,
                className: input.className,
                tagName: input.tagName
            }));
        });
        
        console.log('📋 Znalezione pola formularza logowania:');
        loginInputs.forEach((input, index) => {
            console.log(`${index + 1}. ${input.tagName}[name="${input.name}"][id="${input.id}"][type="${input.type}"] placeholder="${input.placeholder}"`);
        });
        
        // Zrób screenshot
        await page.screenshot({ path: 'D:/portal/debug-login-form.png', fullPage: true });
        console.log('📸 Screenshot formularza logowania: D:/portal/debug-login-form.png');
        
        // ===== DEBUG DODAWANIA SKLEPU =====
        console.log('\n🏪 Debugowanie formularza dodawania sklepu');
        await page.goto(`${frontendUrl}/shop-create`);
        await page.waitForTimeout(3000);
        
        const shopInputs = await page.evaluate(() => {
            const inputElements = document.querySelectorAll('input, textarea, select');
            return Array.from(inputElements).map(input => ({
                name: input.name,
                id: input.id,
                type: input.type,
                placeholder: input.placeholder,
                className: input.className,
                tagName: input.tagName
            }));
        });
        
        console.log('📋 Znalezione pola formularza sklepu:');
        shopInputs.forEach((input, index) => {
            console.log(`${index + 1}. ${input.tagName}[name="${input.name}"][id="${input.id}"][type="${input.type}"] placeholder="${input.placeholder}"`);
        });
        
        // Zrób screenshot
        await page.screenshot({ path: 'D:/portal/debug-shop-form.png', fullPage: true });
        console.log('📸 Screenshot formularza sklepu: D:/portal/debug-shop-form.png');
        
        console.log('\n✅ Debugowanie zakończone!');
        
    } catch (error) {
        console.error('❌ Błąd podczas debugowania:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔌 Przeglądarka zamknięta');
        }
    }
}

debugForms(); 