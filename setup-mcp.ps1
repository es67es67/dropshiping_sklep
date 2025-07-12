# Skrypt konfiguracji MCP servers dla portalu e-commerce
# Autor: AI Assistant
# Data: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Konfiguracja MCP servers dla portalu e-commerce..." -ForegroundColor Green

# Sprawdzenie czy Node.js jest zainstalowany
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js nie jest zainstalowany. Zainstaluj Node.js przed kontynuacją." -ForegroundColor Red
    exit 1
}

# Tworzenie katalogów dla MCP
$directories = @(
    "D:\portal\screenshots",
    "D:\portal\performance-reports", 
    "D:\portal\error-screenshots",
    "D:\portal\backups",
    "D:\portal\logs"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "✅ Utworzono katalog: $dir" -ForegroundColor Green
    }
}

# Instalacja pakietów MCP servers
Write-Host "📦 Instalacja pakietów MCP servers..." -ForegroundColor Yellow

$mcpPackages = @(
    "@modelcontextprotocol/server-github",
    "@modelcontextprotocol/server-filesystem", 
    "@modelcontextprotocol/server-brave-search",
    "@modelcontextprotocol/server-postgres",
    "@modelcontextprotocol/server-render",
    "@modelcontextprotocol/server-web-browser",
    "@modelcontextprotocol/server-terminal",
    "@modelcontextprotocol/server-sentry",
    "@modelcontextprotocol/server-cypress",
    "@modelcontextprotocol/server-mongodb"
)

foreach ($package in $mcpPackages) {
    Write-Host "Instalowanie: $package" -ForegroundColor Cyan
    npx -y $package --version | Out-Null
}

# Tworzenie pliku .env dla kluczy API
$envContent = @"
# MCP Configuration - Portal E-commerce
# Zastąp wartości swoimi kluczami API

# GitHub
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=your_username/portal

# Brave Search
BRAVE_API_KEY=your_brave_api_key_here

# MongoDB
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DATABASE=portal

# Render
RENDER_API_KEY=your_render_api_key_here

# Sentry
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_org_slug
SENTRY_PROJECT=portal-ecommerce

# Discord Notifications
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Email Notifications
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Portal URLs
FRONTEND_URL=https://your-portal.onrender.com
BACKEND_URL=https://your-portal-backend.onrender.com
"@

$envContent | Out-File -FilePath 'D:\portal\.env.mcp' -Encoding UTF8
Write-Host "✅ Utworzono plik .env.mcp z szablonem konfiguracji" -ForegroundColor Green

# Tworzenie skryptu monitorowania
$monitorScript = @"
# Skrypt monitorowania portalu
# Uruchamiaj: .\monitor-portal.ps1

Write-Host "🔍 Monitorowanie portalu e-commerce..." -ForegroundColor Green

# Sprawdzenie statusu frontendu
try {
    `$frontendResponse = Invoke-WebRequest -Uri "https://your-portal.onrender.com" -TimeoutSec 10
    if (`$frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend działa poprawnie" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Problem z frontendem: `$(`$_.Exception.Message)" -ForegroundColor Red
}

# Sprawdzenie statusu backendu
try {
    `$backendResponse = Invoke-WebRequest -Uri "https://your-portal-backend.onrender.com/api/health" -TimeoutSec 10
    if (`$backendResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend działa poprawnie" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Problem z backendem: `$(`$_.Exception.Message)" -ForegroundColor Red
}

# Sprawdzenie bazy danych
try {
    `$dbResponse = Invoke-WebRequest -Uri "https://your-portal-backend.onrender.com/api/shops" -TimeoutSec 10
    if (`$dbResponse.StatusCode -eq 200) {
        Write-Host "✅ Baza danych działa poprawnie" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Problem z bazą danych: `$(`$_.Exception.Message)" -ForegroundColor Red
}

Write-Host "📊 Monitorowanie zakończone: `$(Get-Date)" -ForegroundColor Yellow
"@

$monitorScript | Out-File -FilePath 'D:\portal\monitor-portal.ps1' -Encoding UTF8
Write-Host "✅ Utworzono skrypt monitorowania: monitor-portal.ps1" -ForegroundColor Green

# Tworzenie skryptu robienia screenshots
$screenshotScript = @"
# Skrypt robienia screenshots portalu
# Uruchamiaj: .\take-screenshot.ps1

param(
    [string]`$Url = "https://your-portal.onrender.com",
    [string]`$OutputPath = "D:\portal\screenshots"
)

Write-Host "📸 Robienie screenshotu: `$Url" -ForegroundColor Green

# Sprawdzenie czy Chrome jest zainstalowany
if (-not (Get-Command chrome -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Chrome nie jest zainstalowany lub nie jest w PATH" -ForegroundColor Red
    exit 1
}

# Tworzenie nazwy pliku z timestampem
`$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
`$filename = "screenshot_`$timestamp.png"
`$fullPath = Join-Path `$OutputPath `$filename

# Robienie screenshotu używając Chrome
try {
    chrome --headless --disable-gpu --screenshot="`$fullPath" --window-size=1920,1080 `$Url
    if (Test-Path `$fullPath) {
        Write-Host "✅ Screenshot zapisany: `$fullPath" -ForegroundColor Green
    } else {
        Write-Host "❌ Nie udało się utworzyć screenshotu" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Błąd podczas robienia screenshotu: `$(`$_.Exception.Message)" -ForegroundColor Red
}
"@

$screenshotScript | Out-File -FilePath 'D:\portal\take-screenshot.ps1' -Encoding UTF8
Write-Host "✅ Utworzono skrypt robienia screenshots: take-screenshot.ps1" -ForegroundColor Green

# Instrukcje konfiguracji
Write-Host "`n📋 INSTRUKCJE KONFIGURACJI:" -ForegroundColor Yellow
Write-Host "1. Edytuj plik .env.mcp i zastąp 'your_*_here' swoimi kluczami API" -ForegroundColor White
Write-Host "2. W Cursor: Settings → Extensions → MCP → Add Server" -ForegroundColor White
Write-Host "3. Wybierz plik mcp-config.json jako konfigurację" -ForegroundColor White
Write-Host "4. Uruchom monitor-portal.ps1 aby sprawdzić status" -ForegroundColor White
Write-Host "5. Uruchom take-screenshot.ps1 aby zrobić screenshot" -ForegroundColor White

Write-Host "`n🎉 Konfiguracja MCP servers zakończona!" -ForegroundColor Green
Write-Host "Teraz możesz monitorować swój portal w czasie rzeczywistym!" -ForegroundColor Cyan 