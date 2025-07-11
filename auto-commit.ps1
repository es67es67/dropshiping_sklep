# Automatyczny commit i push na GitHub
# Uruchom: .\auto-commit.ps1 "opis zmian"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "🚀 Automatyczny commit i push na GitHub..." -ForegroundColor Green

# Sprawdź czy jesteśmy w repozytorium Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Blad: Nie jestes w repozytorium Git!" -ForegroundColor Red
    exit 1
}

# Sprawdź status Git
$status = git status --porcelain
if (-not $status) {
    Write-Host "ℹ️ Brak zmian do commitowania" -ForegroundColor Yellow
    exit 0
}

# Dodaj wszystkie zmiany
Write-Host "📁 Dodawanie zmian..." -ForegroundColor Blue
git add .

# Sprawdź czy są zmiany do commitowania
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "ℹ️ Brak zmian do commitowania" -ForegroundColor Yellow
    exit 0
}

# Utwórz commit message z timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$fullMessage = "$CommitMessage - $timestamp"

# Wykonaj commit
Write-Host "💾 Tworzenie commita..." -ForegroundColor Blue
git commit -m $fullMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit utworzony pomyslnie!" -ForegroundColor Green
    Write-Host "📝 Message: $fullMessage" -ForegroundColor Cyan
} else {
    Write-Host "❌ Blad podczas tworzenia commita!" -ForegroundColor Red
    exit 1
}

# Push na GitHub
Write-Host "🚀 Push na GitHub..." -ForegroundColor Blue
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Push wykonany pomyslnie!" -ForegroundColor Green
    Write-Host "🌐 Zmiany dostepne na GitHub" -ForegroundColor Cyan
} else {
    Write-Host "❌ Blad podczas push!" -ForegroundColor Red
    exit 1
}

# Sprawdź czy GitHub Actions są uruchomione
Write-Host "🔍 Sprawdzanie GitHub Actions..." -ForegroundColor Blue
Start-Sleep -Seconds 3

Write-Host "🎉 Automatyczny commit i push zakonczony pomyslnie!" -ForegroundColor Green
Write-Host "📊 Sprawdz status na: https://github.com/[username]/portal/actions" -ForegroundColor Cyan 