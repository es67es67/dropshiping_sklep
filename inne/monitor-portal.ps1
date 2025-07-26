# Skrypt monitorowania portalu
# Uruchamiaj: .\monitor-portal.ps1

$frontendBase = "https://portal-frontend-ysqz.onrender.com"
$backendBase = "https://portal-backend-igf9.onrender.com"

Write-Host "Monitorowanie portalu e-commerce..." -ForegroundColor Green

# Lista podstron frontendu do sprawdzenia
$frontendPages = @(
    "/", "/login", "/register", "/shops", "/products", "/profile", "/live", "/admin", "/myshops", "/settings", "/analytics", "/notifications"
)

foreach ($page in $frontendPages) {
    $url = $frontendBase + $page
    try {
        $resp = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
        if ($resp.StatusCode -eq 200) {
            Write-Host "[OK] $url" -ForegroundColor Green
        } else {
            Write-Host "[WARN] $url - Status: $($resp.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[ERR] $url - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Lista endpointów backendu do sprawdzenia
$backendEndpoints = @(
    "/api/health", "/api/shops", "/api/products", "/api/users/status", "/api/locations"
)

foreach ($ep in $backendEndpoints) {
    $url = $backendBase + $ep
    try {
        $resp = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
        if ($resp.StatusCode -eq 200) {
            Write-Host "[OK] $url" -ForegroundColor Green
        } else {
            Write-Host "[WARN] $url - Status: $($resp.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[ERR] $url - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Monitorowanie zakonczone: $(Get-Date)" -ForegroundColor Yellow
