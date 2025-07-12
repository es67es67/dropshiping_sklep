# Skrypt do testowania autoryzacji i sprawdzania błędów
Write-Host "Testowanie autoryzacji Portal..." -ForegroundColor Green

$baseUrl = "https://portal-backend-igf9.onrender.com"

# Test 1: Logowanie użytkownika
Write-Host "`n=== Test 1: Logowanie ===" -ForegroundColor Yellow
try {
    $loginData = @{
        email = "FF@RRF.PL"
        password = "Admin123!"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/api/users/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Logowanie: $($response.StatusCode)" -ForegroundColor Green
    
    $loginResult = $response.Content | ConvertFrom-Json
    $token = $loginResult.token
    Write-Host "Token otrzymany: $($token.Substring(0, 20))..." -ForegroundColor Gray
    
    # Test 2: Pobieranie sklepów użytkownika z tokenem
    Write-Host "`n=== Test 2: Sklepy użytkownika (z tokenem) ===" -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $shopsResponse = Invoke-WebRequest -Uri "$baseUrl/api/shops/user" -Headers $headers
        Write-Host "✅ Sklepy użytkownika: $($shopsResponse.StatusCode)" -ForegroundColor Green
        
        $shopsData = $shopsResponse.Content | ConvertFrom-Json
        Write-Host "Liczba sklepów użytkownika: $($shopsData.Count)" -ForegroundColor Gray
        
        if ($shopsData.Count -gt 0) {
            Write-Host "Pierwszy sklep: $($shopsData[0].name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "❌ Błąd pobierania sklepów użytkownika: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Szczegóły błędu: $errorBody" -ForegroundColor Red
        }
    }
    
    # Test 3: Sprawdzenie profilu użytkownika
    Write-Host "`n=== Test 3: Profil użytkownika ===" -ForegroundColor Yellow
    try {
        $profileResponse = Invoke-WebRequest -Uri "$baseUrl/api/users/profile" -Headers $headers
        Write-Host "✅ Profil użytkownika: $($profileResponse.StatusCode)" -ForegroundColor Green
        
        $profileData = $profileResponse.Content | ConvertFrom-Json
        Write-Host "Użytkownik: $($profileData.username) - $($profileData.firstName) $($profileData.lastName)" -ForegroundColor Gray
        Write-Host "Liczba sklepów w profilu: $($profileData.shops.Count)" -ForegroundColor Gray
        
    } catch {
        Write-Host "❌ Błąd pobierania profilu: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Błąd logowania: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Szczegóły błędu: $errorBody" -ForegroundColor Red
    }
}

Write-Host "`nTestowanie autoryzacji zakonczone!" -ForegroundColor Green 