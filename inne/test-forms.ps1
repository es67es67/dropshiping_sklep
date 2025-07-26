# Skrypt testowania formularzy portalu e-commerce
# Testuje rejestrację, logowanie i wszystkie formularze dodawania

$frontendBase = "https://portal-frontend-ysqz.onrender.com"
$backendBase = "https://portal-backend-igf9.onrender.com"

Write-Host "🧪 Testowanie formularzy portalu e-commerce..." -ForegroundColor Green

# Test 1: Rejestracja użytkownika "Jadźka_testerka"
Write-Host "`n📝 Test 1: Rejestracja użytkownika 'Jadźka_testerka'" -ForegroundColor Yellow

$registerData = @{
    username = "JadwigaTester2025"
    email = "jadwiga.tester2025@test.pl"
    password = "Test123!"
    firstName = "Jadwiga"
    lastName = "Testerka"
    location = "Warszawa"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$backendBase/api/users/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ Rejestracja udana! Token: $($registerResponse.token.Substring(0,20))..." -ForegroundColor Green
    $token = $registerResponse.token
} catch {
    Write-Host "❌ Błąd rejestracji: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Szczegóły błędu: $errorBody" -ForegroundColor Red
    }
    exit 1
}

# Test 2: Logowanie użytkownika
Write-Host "`n🔐 Test 2: Logowanie użytkownika" -ForegroundColor Yellow

$loginData = @{
    email = "jadwiga.tester2025@test.pl"
    password = "Test123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$backendBase/api/users/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✅ Logowanie udane!" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd logowania: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Dodawanie sklepu
Write-Host "`n🏪 Test 3: Dodawanie sklepu" -ForegroundColor Yellow

$shopData = @{
    name = "Testowy Sklep Jadźki"
    description = "Sklep testowy do sprawdzenia formularzy"
    category = "Elektronika"
    location = "Warszawa"
    address = "ul. Testowa 123"
    phone = "123456789"
    email = "sklep@test.pl"
    website = "https://test.pl"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $shopResponse = Invoke-RestMethod -Uri "$backendBase/api/shops" -Method POST -Body $shopData -Headers $headers
    Write-Host "✅ Sklep dodany! ID: $($shopResponse._id)" -ForegroundColor Green
    $shopId = $shopResponse._id
} catch {
    Write-Host "❌ Błąd dodawania sklepu: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Szczegóły błędu: $errorBody" -ForegroundColor Red
    }
}

# Test 4: Dodawanie produktu
Write-Host "`n📦 Test 4: Dodawanie produktu" -ForegroundColor Yellow

$productData = @{
    name = "Testowy Produkt"
    description = "Produkt testowy do sprawdzenia formularzy"
    price = 99.99
    category = "Elektronika"
    shopId = $shopId
    location = "Warszawa"
    stock = 10
    images = @("https://via.placeholder.com/300x200?text=Test+Product")
} | ConvertTo-Json

try {
    $productResponse = Invoke-RestMethod -Uri "$backendBase/api/products" -Method POST -Body $productData -Headers $headers
    Write-Host "✅ Produkt dodany! ID: $($productResponse._id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd dodawania produktu: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Szczegóły błędu: $errorBody" -ForegroundColor Red
    }
}

# Test 5: Sprawdzenie listy sklepów użytkownika
Write-Host "`n📋 Test 5: Lista sklepów użytkownika" -ForegroundColor Yellow

try {
    $myShopsResponse = Invoke-RestMethod -Uri "$backendBase/api/shops/my-shops" -Method GET -Headers $headers
    Write-Host "✅ Pobrano sklepy użytkownika: $($myShopsResponse.Count) sklepów" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd pobierania sklepów: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Sprawdzenie profilu użytkownika
Write-Host "`n👤 Test 6: Profil użytkownika" -ForegroundColor Yellow

try {
    $profileResponse = Invoke-RestMethod -Uri "$backendBase/api/users/profile" -Method GET -Headers $headers
    Write-Host "✅ Profil użytkownika: $($profileResponse.username) - $($profileResponse.firstName) $($profileResponse.lastName)" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd pobierania profilu: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\nTestowanie formularzy zakonczone!" -ForegroundColor Green
Write-Host "Sprawdz konsole przegladarki pod adresem: $frontendBase" -ForegroundColor Cyan 