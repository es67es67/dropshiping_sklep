// Skrypt monitorowania Firefox z Puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const frontendUrl = 'https://portal-frontend-ysqz.onrender.com';
const backendUrl = 'https://portal-backend-igf9.onrender.com';

async function monitorFirefox() {
    console.log('🚀 Monitorowanie Firefox z Puppeteer...');
    
    try {
        // Uruchom Firefox
        const browser = await puppeteer.launch({
            product: 'firefox',
            headless: false, // Pokaż przeglądarkę
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Przechwytuj logi konsoli
        page.on('console', msg => {
            const level = msg.type();
            const text = msg.text();
            const timestamp = new Date().toISOString();
            
            console.log(`[${timestamp}] [${level.toUpperCase()}] ${text}`);
            
            // Zapisz do pliku
            const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${text}\n`;
            fs.appendFileSync('D:/portal/firefox-console-logs.txt', logEntry);
        });
        
        // Przechwytuj błędy
        page.on('pageerror', error => {
            console.log(`❌ Błąd strony: ${error.message}`);
            fs.appendFileSync('D:/portal/firefox-errors.txt', `${new Date().toISOString()}: ${error.message}\n`);
        });
        
        // Przechwytuj błędy sieciowe
        page.on('response', response => {
            if (!response.ok()) {
                console.log(`⚠️ Błąd HTTP ${response.status()}: ${response.url()}`);
            }
        });
        
        console.log(`🌐 Przechodzę do: ${frontendUrl}`);
        await page.goto(frontendUrl, { waitUntil: 'networkidle2' });
        
        // Poczekaj na załadowanie
        await page.waitForTimeout(5000);
        
        // Zrób screenshot
        const screenshotPath = `D:/portal/firefox-screenshots/screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot zapisany: ${screenshotPath}`);
        
        // Testuj rejestrację
        console.log('🧪 Testuję formularz rejestracji...');
        await page.goto(`${frontendUrl}/register`);
        await page.waitForTimeout(2000);
        
        // Wypełnij formularz
        await page.type('input[name="username"]', 'TestUser123');
        await page.type('input[name="email"]', 'test@example.com');
        await page.type('input[name="password"]', 'Test123!');
        
        // Zrób screenshot formularza
        const formScreenshotPath = `D:/portal/firefox-screenshots/register_form_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        await page.screenshot({ path: formScreenshotPath });
        console.log(`📸 Screenshot formularza: ${formScreenshotPath}`);
        
        // Zamknij przeglądarkę
        await browser.close();
        console.log('✅ Monitorowanie zakończone!');
        
    } catch (error) {
        console.error('❌ Błąd monitorowania:', error);
    }
}

// Uruchom monitoring
monitorFirefox(); 