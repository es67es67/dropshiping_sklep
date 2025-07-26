# Skrypt robienia screenshots portalu
# Uruchamiaj: .\take-screenshot.ps1

param(
    [string]$Url = "https://your-portal.onrender.com",
    [string]$OutputPath = "D:\portal\screenshots"
)

Write-Host "Robienie screenshotu: $Url" -ForegroundColor Green

# Sprawdzenie czy Chrome jest zainstalowany
if (-not (Get-Command chrome -ErrorAction SilentlyContinue)) {
    Write-Host "Chrome nie jest zainstalowany lub nie jest w PATH" -ForegroundColor Red
    exit 1
}

# Tworzenie nazwy pliku z timestampem
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$filename = "screenshot_$timestamp.png"
$fullPath = Join-Path $OutputPath $filename

# Robienie screenshotu uzywajac Chrome
try {
    chrome --headless --disable-gpu --screenshot="$fullPath" --window-size=1920,1080 $Url
    if (Test-Path $fullPath) {
        Write-Host "Screenshot zapisany: $fullPath" -ForegroundColor Green
    } else {
        Write-Host "Nie udalo sie utworzyc screenshotu" -ForegroundColor Red
    }
} catch {
    Write-Host "Blad podczas robienia screenshotu: $($_.Exception.Message)" -ForegroundColor Red
}
