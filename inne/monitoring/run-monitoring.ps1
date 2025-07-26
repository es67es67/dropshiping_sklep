# Skrypt do uruchamiania monitoringu portalu
# Autor: Portal Monitoring System
# Data: 2025-07-12

Write-Host "🚀 SYSTEM MONITORINGU PORTALU" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Sprawdź czy Node.js jest zainstalowany
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js nie jest zainstalowany!" -ForegroundColor Red
    Write-Host "Pobierz z: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Sprawdź czy npm jest dostępny
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm nie jest dostępny!" -ForegroundColor Red
    exit 1
}

# Instaluj zależności
Write-Host "`n📦 Instalowanie zależności..." -ForegroundColor Yellow
npm install

# Menu wyboru
Write-Host "`n🎯 WYBIERZ TYP MONITORINGU:" -ForegroundColor Cyan
Write-Host "1. Test portalu (rejestracja, logowanie, dodawanie sklepow/produktow)" -ForegroundColor White
Write-Host "2. Monitoring Render (logi, status, deployy)" -ForegroundColor White
Write-Host "3. Pelny monitoring (portal + Render)" -ForegroundColor White
Write-Host "4. Tylko test dostepnosci portalu" -ForegroundColor White
Write-Host "5. Wyjscie" -ForegroundColor White

$choice = Read-Host "`nWybierz opcje (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n🔍 Uruchamianie testow portalu..." -ForegroundColor Green
        node monitoring/portal-monitor.js
    }
    "2" {
        Write-Host "`n🔍 Uruchamianie monitoringu Render..." -ForegroundColor Green
        Write-Host "UWAGA: Musisz skonfigurowac dane logowania w pliku render-monitor.js" -ForegroundColor Yellow
        node monitoring/render-monitor.js
    }
    "3" {
        Write-Host "`n🔍 Uruchamianie pelnego monitoringu..." -ForegroundColor Green
        Write-Host "Krok 1: Testy portalu..." -ForegroundColor Yellow
        node monitoring/portal-monitor.js
        Write-Host "`nKrok 2: Monitoring Render..." -ForegroundColor Yellow
        node monitoring/render-monitor.js
    }
    "4" {
        Write-Host "`n🔍 Uruchamianie testu dostepnosci..." -ForegroundColor Green
        # Stworzę prosty skrypt do testu dostępności
        $quickTest = @"
const puppeteer = require('puppeteer');

async function quickHealthCheck() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Sprawdzanie dostepnosci portalu...');
        await page.goto('https://portal-frontend.onrender.com', { waitUntil: 'networkidle2', timeout: 30000 });
        
        const title = await page.title();
        const status = await page.evaluate(() => document.readyState);
        
        console.log('✅ Portal dostepny!');
        console.log('📄 Tytul:', title);
        console.log('📊 Status:', status);
        
        await page.screenshot({ path: 'monitoring/health-check.png' });
        console.log('📸 Screenshot zapisany: monitoring/health-check.png');
        
    } catch (error) {
        console.log('❌ Portal niedostepny:', error.message);
    } finally {
        await browser.close();
    }
}

quickHealthCheck();
"@
        
        $quickTest | Out-File -FilePath "monitoring/quick-health.js" -Encoding UTF8
        node monitoring/quick-health.js
    }
    "5" {
        Write-Host "`n👋 Do widzenia!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "`n❌ Nieprawidlowy wybor!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✅ Monitoring zakonczony!" -ForegroundColor Green
Write-Host "📁 Sprawdz katalog 'monitoring' dla raportow i screenshotow" -ForegroundColor Yellow 