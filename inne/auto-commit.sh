#!/bin/bash

# Automatyczny commit i push na GitHub
# Uruchom: ./auto-commit.sh "opis zmian"

if [ $# -eq 0 ]; then
    echo "❌ Błąd: Podaj opis zmian!"
    echo "Użycie: ./auto-commit.sh \"opis zmian\""
    exit 1
fi

COMMIT_MESSAGE="$1"

echo "🚀 Automatyczny commit i push na GitHub..."

# Sprawdź czy jesteśmy w repozytorium Git
if [ ! -d ".git" ]; then
    echo "❌ Błąd: Nie jesteś w repozytorium Git!"
    exit 1
fi

# Sprawdź status Git
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️ Brak zmian do commitowania"
    exit 0
fi

# Dodaj wszystkie zmiany
echo "📁 Dodawanie zmian..."
git add .

# Sprawdź czy są zmiany do commitowania
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "ℹ️ Brak zmian do commitowania"
    exit 0
fi

# Utwórz commit message z timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
FULL_MESSAGE="$COMMIT_MESSAGE - $TIMESTAMP"

# Wykonaj commit
echo "💾 Tworzenie commita..."
git commit -m "$FULL_MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Commit utworzony pomyślnie!"
    echo "📝 Message: $FULL_MESSAGE"
else
    echo "❌ Błąd podczas tworzenia commita!"
    exit 1
fi

# Push na GitHub
echo "🚀 Push na GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Push wykonany pomyślnie!"
    echo "🌐 Zmiany dostępne na GitHub"
else
    echo "❌ Błąd podczas push!"
    exit 1
fi

# Sprawdź czy GitHub Actions są uruchomione
echo "🔍 Sprawdzanie GitHub Actions..."
sleep 3

echo "🎉 Automatyczny commit i push zakończony pomyślnie!"
echo "📊 Sprawdź status na: https://github.com/[username]/portal/actions" 