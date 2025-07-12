# Skrypt do testowania endpointów i sprawdzania błędów
Write-Host "Testowanie endpointow Portal..." -ForegroundColor Green

$baseUrl = "https://portal-backend-igf9.onrender.com"

# Test 1: Health check
Write-Host "`n=== Test 1: Health Check ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health"
    Write-Host "✅ Health check: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Pobieranie wszystkich sklepów (bez autoryzacji)
Write-Host "`n=== Test 2: Wszystkie sklepy (public) ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/shops"
    Write-Host "✅ Wszystkie sklepy: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Liczba sklepów: $($data.shops.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Błąd pobierania wszystkich sklepów: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Sklepy użytkownika (wymaga autoryzacji)
Write-Host "`n=== Test 3: Sklepy użytkownika (z autoryzacją) ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/shops/user" -Headers @{"Authorization"="Bearer invalid_token"}
    Write-Host "✅ Sklepy użytkownika: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Oczekiwany błąd autoryzacji: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 4: Sprawdzenie CORS
Write-Host "`n=== Test 4: CORS Headers ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/shops" -Method OPTIONS
    Write-Host "✅ CORS preflight: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "CORS Headers:" -ForegroundColor Gray
    $response.Headers | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} catch {
    Write-Host "❌ CORS test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Sprawdzenie konkretnego sklepu
Write-Host "`n=== Test 5: Konkretny sklep ===" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/shops/test-id"
    Write-Host "✅ Test sklepu: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Test sklepu failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTestowanie zakonczone!" -ForegroundColor Green 