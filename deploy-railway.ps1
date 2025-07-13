# 🚀 Skrypt do deployu na Railway
Write-Host "🚀 Przygotowanie deployu na Railway..." -ForegroundColor Green

# Sprawdź czy masz zainstalowany Railway CLI
Write-Host "📋 Sprawdzanie Railway CLI..." -ForegroundColor Yellow
try {
    $railwayVersion = railway --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Railway CLI jest zainstalowany" -ForegroundColor Green
    } else {
        Write-Host "❌ Railway CLI nie jest zainstalowany" -ForegroundColor Red
        Write-Host "📥 Zainstaluj Railway CLI: npm install -g @railway/cli" -ForegroundColor Cyan
        exit 1
    }
} catch {
    Write-Host "❌ Railway CLI nie jest dostępny" -ForegroundColor Red
    Write-Host "📥 Zainstaluj Railway CLI: npm install -g @railway/cli" -ForegroundColor Cyan
    exit 1
}

Write-Host "`n📋 Instrukcja deployu na Railway:" -ForegroundColor Cyan
Write-Host "1. Przejdź do https://railway.app" -ForegroundColor White
Write-Host "2. Utwórz nowy projekt" -ForegroundColor White
Write-Host "3. Połącz z GitHub repo: es67es67/dropshiping_sklep" -ForegroundColor White
Write-Host "4. Railway automatycznie wykryje backend" -ForegroundColor White
Write-Host "5. Dodaj zmienne środowiskowe (patrz RAILWAY_DEPLOY.md)" -ForegroundColor White
Write-Host "6. Utwórz drugi serwis dla frontendu" -ForegroundColor White

Write-Host "`n🔧 Zmienne środowiskowe dla backendu:" -ForegroundColor Yellow
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "PORT=10000" -ForegroundColor White
Write-Host "MONGODB_URI=twój_connection_string_z_mongodb_atlas" -ForegroundColor White
Write-Host "JWT_SECRET=twój_tajny_klucz_jwt" -ForegroundColor White
Write-Host "CORS_ORIGIN=https://twoja-domena-frontend.railway.app" -ForegroundColor White

Write-Host "`n🌐 Zmienne środowiskowe dla frontendu:" -ForegroundColor Yellow
Write-Host "REACT_APP_API_URL=https://twoja-domena-backend.railway.app" -ForegroundColor White
Write-Host "REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg" -ForegroundColor White

Write-Host "`n📖 Szczegółowa instrukcja w pliku: RAILWAY_DEPLOY.md" -ForegroundColor Green
Write-Host "🚀 Gotowe do deployu!" -ForegroundColor Green 