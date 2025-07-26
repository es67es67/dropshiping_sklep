# 🌐 Testowanie Systemu przez Przeglądarkę

## 🚀 Status Serwerów
- ✅ **Backend**: http://localhost:5000 (działa)
- ✅ **Frontend**: http://localhost:3000 (działa)

## 📋 Instrukcja Testowania

### 1. Otwórz Przeglądarkę
```
http://localhost:3000
```

### 2. Logowanie
- **Email**: admin@test.com
- **Hasło**: admin123

### 3. Testowanie Funkcjonalności

#### 🔍 Wyszukiwanie Użytkowników
1. Przejdź do strony głównej
2. Znajdź pole wyszukiwania (jeśli dostępne)
3. Wpisz polskie imiona do przetestowania:
   - `Jan` (powinno znaleźć 8 użytkowników)
   - `Anna` (powinno znaleźć 3 użytkowników)
   - `Piotr` (powinno znaleźć 3 użytkowników)
   - `Katarzyna` (powinno znaleźć 2 użytkowników)
   - `Stanisław` (powinno znaleźć 2 użytkowników)

#### 💬 System Wiadomości
1. Przejdź do sekcji wiadomości (jeśli dostępna)
2. Spróbuj wysłać wiadomość do użytkownika `admin@test.com`
3. Sprawdź czy możesz:
   - Wysłać wiadomość
   - Zobaczyć historię konwersacji
   - Oznaczyć wiadomości jako przeczytane

#### 👥 System Znajomych
1. Przejdź do sekcji znajomych (jeśli dostępna)
2. Spróbuj:
   - Wysłać zaproszenie do znajomych
   - Zobaczyć listę znajomych
   - Akceptować/odrzucać zaproszenia

### 4. Testowanie API Bezpośrednio

#### Wyszukiwanie Użytkowników
```
http://localhost:5000/api/users/search?q=Jan
http://localhost:5000/api/users/search?q=Anna
http://localhost:5000/api/users/search?q=Piotr
```

#### Sprawdzenie Statusu Serwera
```
http://localhost:5000/api/users
```
(To powinno zwrócić błąd 401 - brak autoryzacji, co jest poprawne)

### 5. Przykładowi Użytkownicy do Testowania

#### Główne Konta Testowe:
- **admin@test.com** / admin123 (główny użytkownik)
- **jan.kowalski@test.com** / test123
- **anna.nowak@test.com** / test123
- **piotr.wisniewski@test.com** / test123

#### Polscy Użytkownicy (wybrane):
- **Jan Baran** (jan.baran389@interia.pl)
- **Anna Kowalska** (anna@test.com)
- **Piotr Nowak** (piotr@test.com)
- **Katarzyna Krawczyk** (katarzyna.krawczyk694@gmail.com)
- **Stanisław Mazur** (stanisław.mazur986@gmail.com)
- **Helena Duda** (helena.duda287@poczta.onet.pl)
- **Aleksander Lewandowski** (aleksander.lewandowski175@wp.pl)

### 6. Oczekiwane Wyniki

#### ✅ Wyszukiwanie powinno zwracać:
- Użytkowników z polskimi imionami
- Różne domeny email (gmail.com, wp.pl, onet.pl, interia.pl, o2.pl)
- Poprawne dane osobowe

#### ✅ System Wiadomości powinien:
- Pozwalać na wysyłanie wiadomości
- Tworzyć konwersacje
- Pokazywać historię wiadomości

#### ✅ System Znajomych powinien:
- Pozwalać na wysyłanie zaproszeń
- Pokazywać listę znajomych
- Obsługiwać akceptowanie/odrzucanie zaproszeń

### 7. Rozwiązywanie Problemów

#### Jeśli frontend nie ładuje się:
1. Sprawdź czy proces na porcie 3000 działa
2. Spróbuj odświeżyć stronę
3. Sprawdź konsolę przeglądarki (F12) pod kątem błędów

#### Jeśli API nie odpowiada:
1. Sprawdź czy proces na porcie 5000 działa
2. Sprawdź logi backend w terminalu
3. Upewnij się, że MongoDB jest dostępne

#### Jeśli logowanie nie działa:
1. Sprawdź czy używasz poprawnego hasła (admin123)
2. Sprawdź czy użytkownik istnieje w bazie danych
3. Sprawdź logi backend pod kątem błędów autoryzacji

### 8. Dodatkowe Testy

#### Testowanie Różnych Przeglądarek:
- Chrome
- Firefox
- Edge
- Safari

#### Testowanie Responsywności:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### 9. Raportowanie Błędów

Jeśli napotkasz problemy:
1. Zrób screenshot błędu
2. Sprawdź konsolę przeglądarki (F12)
3. Sprawdź logi backend w terminalu
4. Opisz kroki prowadzące do błędu

## 🎯 Podsumowanie

System jest gotowy do testowania przez przeglądarkę z:
- ✅ 50+ polskimi użytkownikami
- ✅ Pełnym systemem wiadomości
- ✅ Systemem znajomych
- ✅ Wyszukiwaniem użytkowników
- ✅ Autoryzacją JWT

**Uruchom przeglądarkę i przejdź do: http://localhost:3000** 