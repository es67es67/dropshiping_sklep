# 🤖 Automatyczne Commitowanie i Push

System automatycznego commitowania i push na GitHub po każdej zmianie kodu.

## 🚀 Szybki start

### Windows (PowerShell)
```powershell
# Uruchom skrypt z opisem zmian
.\auto-commit.ps1 "feat: dodano nową funkcjonalność sklepów"
```

### Linux/Mac (Bash)
```bash
# Nadaj uprawnienia wykonywania (tylko raz)
chmod +x auto-commit.sh

# Uruchom skrypt z opisem zmian
./auto-commit.sh "feat: dodano nową funkcjonalność sklepów"
```

## 📝 Format commit messages

### Typy commitów:
- `feat:` - Nowa funkcjonalność
- `fix:` - Naprawa błędu
- `docs:` - Zmiany w dokumentacji
- `style:` - Zmiany formatowania (nie wpływają na kod)
- `refactor:` - Refaktoryzacja kodu
- `test:` - Dodanie lub zmiana testów
- `chore:` - Zmiany w build process, narzędziach, itp.

### Przykłady:
```bash
# Nowa funkcjonalność
./auto-commit.sh "feat: dodano system sklepów i produktów"

# Naprawa błędu
./auto-commit.sh "fix: naprawiono błąd dodawania produktów"

# Dokumentacja
./auto-commit.sh "docs: zaktualizowano MAPA_SERWISU.md"

# Testy
./auto-commit.sh "test: dodano testy Cypress dla sklepów"

# Refaktoryzacja
./auto-commit.sh "refactor: poprawiono strukturę komponentów"
```

## 🔄 Workflow

### Automatyczny proces:
1. **Sprawdzenie Git** - Czy jesteśmy w repozytorium
2. **Status check** - Czy są zmiany do commitowania
3. **Add changes** - Dodanie wszystkich zmian
4. **Create commit** - Utworzenie commita z timestamp
5. **Push to GitHub** - Wypchnięcie zmian na GitHub
6. **CI/CD trigger** - Uruchomienie GitHub Actions

### Przykład output:
```
🚀 Automatyczny commit i push na GitHub...
📁 Dodawanie zmian...
💾 Tworzenie commita...
✅ Commit utworzony pomyślnie!
📝 Message: feat: dodano system sklepów - 2024-01-15 14:30:25
🚀 Push na GitHub...
✅ Push wykonany pomyślnie!
🌐 Zmiany dostępne na GitHub
🔍 Sprawdzanie GitHub Actions...
🎉 Automatyczny commit i push zakończony pomyślnie!
📊 Sprawdź status na: https://github.com/[username]/portal/actions
```

## ⚙️ Konfiguracja

### Wymagania:
- Git zainstalowany i skonfigurowany
- Dostęp do repozytorium GitHub
- Uprawnienia do push na main branch

### Sprawdzenie konfiguracji:
```bash
# Sprawdź czy Git jest skonfigurowany
git config --list

# Sprawdź remote origin
git remote -v

# Sprawdź status
git status
```

## 🛠️ Integracja z IDE

### VS Code:
1. Otwórz terminal w VS Code
2. Uruchom skrypt po każdej zmianie
3. Można dodać do tasków VS Code

### Automatyczne uruchamianie:
```json
// .vscode/tasks.json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Auto Commit",
            "type": "shell",
            "command": "./auto-commit.sh",
            "args": ["feat: automatyczny commit"],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        }
    ]
}
```

## 🔧 Troubleshooting

### Błędy i rozwiązania:

#### "Nie jesteś w repozytorium Git"
```bash
# Sprawdź czy jesteś w odpowiednim katalogu
pwd
ls -la

# Zainicjuj Git jeśli potrzeba
git init
git remote add origin https://github.com/[username]/portal.git
```

#### "Brak zmian do commitowania"
- Sprawdź czy rzeczywiście zmieniłeś pliki
- Użyj `git status` aby zobaczyć status

#### "Błąd podczas push"
```bash
# Sprawdź uprawnienia
git remote -v

# Sprawdź czy masz token lub SSH key
git config --list | grep user
```

#### "Permission denied"
```bash
# Nadaj uprawnienia wykonywania
chmod +x auto-commit.sh

# Lub uruchom przez bash
bash auto-commit.sh "opis zmian"
```

## 📊 Monitoring

### GitHub Actions:
- Automatyczne uruchamianie po push
- Testy e2e z Cypress
- Build i deploy na Render
- Powiadomienia o statusie

### Sprawdzenie statusu:
```bash
# Sprawdź ostatnie commity
git log --oneline -5

# Sprawdź status GitHub Actions
# Przejdź na: https://github.com/[username]/portal/actions
```

## 🎯 Best Practices

### Kiedy używać:
- ✅ Po każdej znaczącej zmianie kodu
- ✅ Po dodaniu nowej funkcjonalności
- ✅ Po naprawie błędu
- ✅ Po aktualizacji dokumentacji

### Kiedy NIE używać:
- ❌ Dla tymczasowych zmian
- ❌ Dla eksperymentalnego kodu
- ❌ Dla zmian które nie działają

### Commit message tips:
- Używaj imperatywów ("dodaj" nie "dodano")
- Bądź konkretny i zwięzły
- Opisuj co robi zmiana, nie co zmieniłeś
- Używaj standardowych typów commitów

## 🔗 Linki

- [GitHub Repository](https://github.com/[username]/portal)
- [GitHub Actions](https://github.com/[username]/portal/actions)
- [Render Deploy](https://portal-backend-igf9.onrender.com)
- [Dokumentacja](https://github.com/[username]/portal/blob/main/README.md) 