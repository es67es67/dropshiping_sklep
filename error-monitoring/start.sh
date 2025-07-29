#!/bin/bash

# 🚀 Skrypt uruchamiania Error Monitoring System
# Zależności: Docker, Docker Compose, Node.js, npm
# Wpływ: Uruchomienie całego systemu
# Jeśli się zepsuje: system nie działa
# Używane w: deployment, development

set -e

echo "🔍 Uruchamianie Error Monitoring System..."

# Sprawdź czy Docker jest zainstalowany
if ! command -v docker &> /dev/null; then
    echo "❌ Docker nie jest zainstalowany. Zainstaluj Docker i spróbuj ponownie."
    exit 1
fi

# Sprawdź czy Docker Compose jest zainstalowany
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose nie jest zainstalowany. Zainstaluj Docker Compose i spróbuj ponownie."
    exit 1
fi

# Sprawdź czy Node.js jest zainstalowany
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nie jest zainstalowany. Zainstaluj Node.js i spróbuj ponownie."
    exit 1
fi

# Sprawdź czy npm jest zainstalowany
if ! command -v npm &> /dev/null; then
    echo "❌ npm nie jest zainstalowany. Zainstaluj npm i spróbuj ponownie."
    exit 1
fi

# Funkcja do sprawdzania portów
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port jest już używany przez $service"
        read -p "Czy chcesz kontynuować? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Sprawdź porty
echo "🔍 Sprawdzanie dostępności portów..."
check_port 5001 "backend"
check_port 3001 "frontend"
check_port 27017 "mongodb"
check_port 6379 "redis"
check_port 9090 "prometheus"
check_port 3000 "grafana"

# Utwórz plik .env jeśli nie istnieje
if [ ! -f .env ]; then
    echo "📝 Tworzenie pliku .env..."
    cp backend/env.example backend/.env
    echo "✅ Plik .env utworzony. Edytuj go przed uruchomieniem."
fi

# Instalacja zależności backendu
echo "📦 Instalacja zależności backendu..."
cd backend
npm install
cd ..

# Instalacja zależności frontendu
echo "📦 Instalacja zależności frontendu..."
cd frontend
npm install
cd ..

# Uruchom system
echo "🚀 Uruchamianie systemu..."
docker-compose up -d

# Czekaj na uruchomienie serwisów
echo "⏳ Czekam na uruchomienie serwisów..."
sleep 30

# Sprawdź status serwisów
echo "🔍 Sprawdzanie statusu serwisów..."
docker-compose ps

# Sprawdź logi
echo "📋 Logi serwisów:"
echo "Backend:"
docker-compose logs --tail=10 backend
echo ""
echo "Frontend:"
docker-compose logs --tail=10 frontend
echo ""
echo "MongoDB:"
docker-compose logs --tail=10 mongodb

# Informacje o dostępie
echo ""
echo "🎉 Error Monitoring System został uruchomiony!"
echo ""
echo "📊 Dostęp do aplikacji:"
echo "   Dashboard: http://localhost:3001"
echo "   API: http://localhost:5001"
echo "   Grafana: http://localhost:3000 (admin/admin123)"
echo "   Prometheus: http://localhost:9090"
echo ""
echo "🔧 Przydatne komendy:"
echo "   Zatrzymanie: docker-compose down"
echo "   Logi: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo "   Status: docker-compose ps"
echo ""
echo "📝 Następne kroki:"
echo "   1. Otwórz http://localhost:3001 w przeglądarce"
echo "   2. Skonfiguruj alerty w ustawieniach"
echo "   3. Dodaj system do swojego portalu"
echo ""
echo "🔍 Monitorowanie:"
echo "   docker-compose logs -f backend"
echo "   docker-compose logs -f frontend"
echo "   docker-compose logs -f mongodb" 