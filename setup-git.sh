#!/bin/bash

echo "🚀 Inicjalizacja Git dla projektu Portal"
echo "========================================"

# Sprawdź czy Git jest zainstalowany
if ! command -v git &> /dev/null; then
    echo "❌ Git nie jest zainstalowany. Zainstaluj Git i spróbuj ponownie."
    exit 1
fi

# Inicjalizuj Git (jeśli nie jest już zainicjalizowany)
if [ ! -d ".git" ]; then
    echo "📁 Inicjalizacja repozytorium Git..."
    git init
else
    echo "✅ Repozytorium Git już istnieje"
fi

# Dodaj wszystkie pliki
echo "📦 Dodawanie plików do Git..."
git add .

# Pierwszy commit
echo "💾 Tworzenie pierwszego commita..."
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

echo ""
echo "✅ Git został zainicjalizowany pomyślnie!"
echo ""
echo "📋 Następne kroki:"
echo "1. Utwórz repozytorium na GitHub:"
echo "   - Przejdź do https://github.com/new"
echo "   - Nazwa: portal"
echo "   - Opis: Modular Community Platform with Admin Panel"
echo "   - Public/Private: według preferencji"
echo ""
echo "2. Połącz z GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/portal.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Sprawdź GitHub Actions:"
echo "   - Przejdź do zakładki 'Actions' na GitHub"
echo "   - Sprawdź czy testy przechodzą"
echo ""
echo "🔗 Przydatne linki:"
echo "- GitHub: https://github.com/YOUR_USERNAME/portal"
echo "- Issues: https://github.com/YOUR_USERNAME/portal/issues"
echo "- Actions: https://github.com/YOUR_USERNAME/portal/actions"
echo ""
echo "🎯 Projekt jest gotowy do współpracy i rozwoju!" 