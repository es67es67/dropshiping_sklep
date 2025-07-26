# PowerShell script for Git initialization
Write-Host "🚀 Inicjalizacja Git dla projektu Portal" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Sprawdź czy Git jest zainstalowany
try {
    git --version | Out-Null
    Write-Host "✅ Git jest zainstalowany" -ForegroundColor Green
} catch {
    Write-Host "❌ Git nie jest zainstalowany. Zainstaluj Git i spróbuj ponownie." -ForegroundColor Red
    exit 1
}

# Inicjalizuj Git (jeśli nie jest już zainicjalizowany)
if (-not (Test-Path ".git")) {
    Write-Host "📁 Inicjalizacja repozytorium Git..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "✅ Repozytorium Git już istnieje" -ForegroundColor Green
}

# Dodaj wszystkie pliki
Write-Host "📦 Dodawanie plików do Git..." -ForegroundColor Yellow
git add .

# Pierwszy commit
Write-Host "💾 Tworzenie pierwszego commita..." -ForegroundColor Yellow
git commit -m "🎉 Initial commit - Portal Community Platform

- Modular React frontend with admin panel
- Node.js/Express backend with MongoDB
- Complete CRUD operations for all collections
- Data export functionality (JSON, CSV, XML, Excel)
- Real-time statistics and monitoring
- User authentication and authorization
- Location management with GUS data integration
- E-commerce functionality (shops, products, orders)
- Gamification system (achievements, badges, points)
- Messaging and social features
- Responsive design with modern UI/UX"

Write-Host ""
Write-Host "✅ Git został zainicjalizowany pomyślnie!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Następne kroki:" -ForegroundColor Cyan
Write-Host "1. Utwórz repozytorium na GitHub:" -ForegroundColor White
Write-Host "   - Przejdź do https://github.com/new" -ForegroundColor Gray
Write-Host "   - Nazwa: portal" -ForegroundColor Gray
Write-Host "   - Opis: Modular Community Platform with Admin Panel" -ForegroundColor Gray
Write-Host "   - Public/Private: według preferencji" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Połącz z GitHub:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/portal.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Sprawdź GitHub Actions:" -ForegroundColor White
Write-Host "   - Przejdź do zakładki 'Actions' na GitHub" -ForegroundColor Gray
Write-Host "   - Sprawdź czy testy przechodzą" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Przydatne linki:" -ForegroundColor Cyan
Write-Host "- GitHub: https://github.com/YOUR_USERNAME/portal" -ForegroundColor Gray
Write-Host "- Issues: https://github.com/YOUR_USERNAME/portal/issues" -ForegroundColor Gray
Write-Host "- Actions: https://github.com/YOUR_USERNAME/portal/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Projekt jest gotowy do wspolpracy i rozwoju!" -ForegroundColor Green 