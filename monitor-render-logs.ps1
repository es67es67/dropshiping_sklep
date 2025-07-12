# Skrypt monitorowania logów Render
# Wymaga Render API Key

$renderApiKey = "YOUR_RENDER_API_KEY_HERE"
$frontendServiceId = "YOUR_FRONTEND_SERVICE_ID"
$backendServiceId = "YOUR_BACKEND_SERVICE_ID"

Write-Host "Monitorowanie logow Render..." -ForegroundColor Green

# Funkcja do pobierania logów z Render
function Get-RenderLogs {
    param(
        [string]$ServiceId,
        [string]$ServiceName
    )
    
    $headers = @{
        "Authorization" = "Bearer $renderApiKey"
        "Content-Type" = "application/json"
    }
    
    try {
        $logsUrl = "https://api.render.com/v1/services/$ServiceId/logs"
        $response = Invoke-RestMethod -Uri $logsUrl -Headers $headers -Method GET
        
        Write-Host "`n=== Logi $ServiceName ===" -ForegroundColor Yellow
        foreach ($log in $response) {
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
        Write-Host "Blad pobierania logow $ServiceName : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Pobierz logi frontendu
Get-RenderLogs -ServiceId $frontendServiceId -ServiceName "Frontend"

# Pobierz logi backendu
Get-RenderLogs -ServiceId $backendServiceId -ServiceName "Backend"

Write-Host "`nMonitorowanie logow zakonczone!" -ForegroundColor Green 