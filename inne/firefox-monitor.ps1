# Skrypt monitorowania Firefox z Selenium
# Wymaga zainstalowanego Firefox WebDriver

$frontendUrl = "https://portal-frontend-ysqz.onrender.com"
$backendUrl = "https://portal-backend-igf9.onrender.com"

Write-Host "Monitorowanie Firefox..." -ForegroundColor Green

# Sprawdź czy Firefox WebDriver jest zainstalowany
try {
    $driver = New-Object OpenQA.Selenium.Firefox.FirefoxDriver
    Write-Host "Firefox WebDriver zainicjalizowany" -ForegroundColor Green
    
    # Przejdź do frontendu
    Write-Host "Przechodze do: $frontendUrl" -ForegroundColor Yellow
    $driver.Navigate().GoToUrl($frontendUrl)
    
    # Poczekaj na załadowanie
    Start-Sleep -Seconds 5
    
    # Pobierz logi konsoli
    $logs = $driver.Manage().Logs.GetLog("browser")
    Write-Host "`n=== Logi konsoli Firefox ===" -ForegroundColor Yellow
    foreach ($log in $logs) {
        $level = $log.Level
        $message = $log.Message
        $timestamp = $log.Timestamp
        
        switch ($level) {
            "SEVERE" { $color = "Red" }
            "WARNING" { $color = "Yellow" }
            "INFO" { $color = "Green" }
            default { $color = "White" }
        }
        
        Write-Host "[$timestamp] [$level] $message" -ForegroundColor $color
    }
    
    # Zrób screenshot
    $screenshotPath = "D:\portal\firefox-screenshots\$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').png"
    $driver.GetScreenshot().SaveAsFile($screenshotPath, [OpenQA.Selenium.ScreenshotImageFormat]::Png)
    Write-Host "Screenshot zapisany: $screenshotPath" -ForegroundColor Green
    
    # Zamknij przeglądarkę
    $driver.Quit()
    
} catch {
    Write-Host "Blad Firefox WebDriver: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Zainstaluj Firefox WebDriver: https://github.com/mozilla/geckodriver/releases" -ForegroundColor Yellow
}

Write-Host "Monitorowanie Firefox zakonczone!" -ForegroundColor Green 