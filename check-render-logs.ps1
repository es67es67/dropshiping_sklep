# Skrypt do sprawdzenia logów Render
# INSTRUKCJE POBRANIA KLUCZY:
# 1. Przejdź do https://dashboard.render.com/
# 2. Account Settings -> API Keys -> New API Key (nazwa: "Portal Monitoring", uprawnienia: Read)
# 3. Skopiuj API Key
# 4. W Dashboard kliknij na backend -> skopiuj Service ID (srv-xxx)
# 5. W Dashboard kliknij na frontend -> skopiuj Service ID (srv-xxx)
# 6. Zastąp poniższe wartości

$renderApiKey = "rnd_Rr8evzEH0yEF4hmPAW59GF16fC4y"
$frontendServiceId = "srv-d1n82obe5dus73c95ilg"
$backendServiceId = "srv-d1n82oje5dus73c95in0"

Write-Host "Sprawdzanie logow Render..." -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $renderApiKey"
    "Content-Type" = "application/json"
}

# Sprawdz logi backendu
Write-Host "`n=== Logi Backendu ===" -ForegroundColor Yellow
try {
    $backendLogsUrl = "https://api.render.com/v1/services/$backendServiceId/logs"
    $backendResponse = Invoke-RestMethod -Uri $backendLogsUrl -Headers $headers -Method GET
    
    foreach ($log in $backendResponse) {
        $timestamp = $log.timestamp
        $message = $log.message
        $level = $log.level
        
        switch ($level) {
            "error" { $color = "Red" }
            "warn" { $color = "Yellow" }
            "info" { $color = "Green" }
            default { $color = "White" }
        }
        
        Write-Host "[$timestamp] [$level] $message" -ForegroundColor $color
    }
} catch {
    Write-Host "Blad pobierania logow backendu: $($_.Exception.Message)" -ForegroundColor Red
}

# Sprawdz logi frontendu
Write-Host "`n=== Logi Frontendu ===" -ForegroundColor Yellow
try {
    $frontendLogsUrl = "https://api.render.com/v1/services/$frontendServiceId/logs"
    $frontendResponse = Invoke-RestMethod -Uri $frontendLogsUrl -Headers $headers -Method GET
    
    foreach ($log in $frontendResponse) {
        $timestamp = $log.timestamp
        $message = $log.message
        $level = $log.level
        
        switch ($level) {
            "error" { $color = "Red" }
            "warn" { $color = "Yellow" }
            "info" { $color = "Green" }
            default { $color = "White" }
        }
        
        Write-Host "[$timestamp] [$level] $message" -ForegroundColor $color
    }
} catch {
    Write-Host "Blad pobierania logow frontendu: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nSprawdzanie logow zakonczone!" -ForegroundColor Green 