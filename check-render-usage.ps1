# Skrypt do sprawdzania zużycia minut w Render
Write-Host "🔍 Sprawdzanie zużycia minut w Render..." -ForegroundColor Yellow

# Sprawdź czy masz zainstalowany curl
try {
    $response = curl --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ curl nie jest zainstalowany. Zainstaluj curl aby sprawdzić API Render." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ curl nie jest dostępny. Zainstaluj curl aby sprawdzić API Render." -ForegroundColor Red
    exit 1
}

Write-Host "📊 Aby sprawdzić zużycie minut w Render:" -ForegroundColor Cyan
Write-Host "1. Przejdź do https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Sprawdź sekcję 'Usage' w lewym menu" -ForegroundColor White
Write-Host "3. Zobacz ile minut zostało z 500 darmowych" -ForegroundColor White

Write-Host "`n💡 Wskazówki oszczędzania minut:" -ForegroundColor Green
Write-Host "- Usuń niepotrzebne serwisy z Render" -ForegroundColor White
Write-Host "- Użyj npm ci zamiast npm install (szybsze)" -ForegroundColor White
Write-Host "- Zoptymalizuj build procesy" -ForegroundColor White
Write-Host "- Rozważ upgrade na płatny plan jeśli potrzebujesz więcej minut" -ForegroundColor White

Write-Host "`n🔧 Zoptymalizowane ustawienia w render.yaml:" -ForegroundColor Cyan
Write-Host "- Backend: npm ci --only=production" -ForegroundColor White
Write-Host "- Frontend: npm ci && npm run build" -ForegroundColor White
Write-Host "- Usunięto duplikaty konfiguracji" -ForegroundColor White

Write-Host "`n✅ Konfiguracja została zoptymalizowana!" -ForegroundColor Green 