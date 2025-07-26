const fetch = require('node-fetch');

const API_URL = 'http://localhost:5000/api';

// Funkcja do logowania
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Funkcja do wyszukiwania użytkowników
const searchUsers = async (query) => {
  try {
    log(`🔍 Wyszukiwanie użytkowników: "${query}"`);
    
    const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`);
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ Znaleziono ${data.users.length} użytkowników`);
      
      if (data.users.length > 0) {
        log('📋 Znalezieni użytkownicy:');
        data.users.slice(0, 10).forEach((user, index) => {
          log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
        });
        
        if (data.users.length > 10) {
          log(`   ... i ${data.users.length - 10} więcej`);
        }
      }
      
      return data.users;
    } else {
      const errorText = await response.text();
      log(`❌ Błąd wyszukiwania: ${errorText}`);
      return [];
    }
  } catch (error) {
    log(`❌ Błąd podczas wyszukiwania: ${error.message}`);
    return [];
  }
};

// Lista polskich imion do przetestowania
const polishNamesToTest = [
  'Jan', 'Anna', 'Piotr', 'Maria', 'Andrzej', 'Katarzyna', 'Krzysztof', 'Małgorzata',
  'Stanisław', 'Agnieszka', 'Tomasz', 'Barbara', 'Paweł', 'Krystyna', 'Józef', 'Ewa',
  'Marcin', 'Elżbieta', 'Marek', 'Zofia', 'Michał', 'Teresa', 'Grzegorz', 'Jadwiga',
  'Jerzy', 'Danuta', 'Tadeusz', 'Halina', 'Adam', 'Irena', 'Łukasz', 'Janina',
  'Zbigniew', 'Joanna', 'Ryszard', 'Wanda', 'Dariusz', 'Grażyna', 'Henryk', 'Jolanta',
  'Mariusz', 'Stanisława', 'Kazimierz', 'Iwona', 'Wojciech', 'Dorota', 'Robert', 'Alicja',
  'Mirosław', 'Magdalena', 'Czesław', 'Beata', 'Stefan', 'Aleksandra', 'Zdzisław', 'Monika',
  'Zenon', 'Helena', 'Bogusław', 'Marta', 'Witold', 'Dominika', 'Aleksander', 'Sylwia',
  'Mieczysław', 'Aneta', 'Władysław', 'Renata', 'Edward', 'Bożena', 'Franciszek', 'Urszula',
  'Leonard', 'Kinga', 'Alfred', 'Karolina', 'Alojzy', 'Justyna', 'Antoni', 'Weronika',
  'Benedykt', 'Natalia', 'Bernard', 'Paulina', 'Bolesław', 'Patrycja', 'Marlena', 'Angelika'
];

// Główna funkcja testowa
const testPolishUsers = async () => {
  log('🚀 Rozpoczynam test wyszukiwania polskich użytkowników...');
  
  const results = [];
  
  // Testuj różne polskie imiona
  for (const name of polishNamesToTest) {
    const users = await searchUsers(name);
    if (users.length > 0) {
      results.push({
        name: name,
        count: users.length,
        users: users.slice(0, 3) // Zapisz pierwsze 3 wyniki
      });
    }
    
    // Krótkie opóźnienie między zapytaniami
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Podsumowanie
  log('\n📊 PODSUMOWANIE WYSZUKIWANIA:');
  log(`✅ Przetestowano ${polishNamesToTest.length} polskich imion`);
  log(`✅ Znaleziono wyniki dla ${results.length} imion`);
  
  if (results.length > 0) {
    log('\n🏆 NAJLEPSZE WYNIKI:');
    results
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .forEach((result, index) => {
        log(`${index + 1}. "${result.name}" - ${result.count} użytkowników`);
        result.users.forEach(user => {
          log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
        });
      });
  }
  
  // Test wyszukiwania po nazwiskach
  log('\n🔍 Testowanie wyszukiwania po nazwiskach...');
  const polishSurnames = ['Kowalski', 'Wiśniewski', 'Dąbrowski', 'Lewandowski', 'Wójcik'];
  
  for (const surname of polishSurnames) {
    await searchUsers(surname);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Test wyszukiwania po miastach
  log('\n🏙️ Testowanie wyszukiwania po miastach...');
  const polishCities = ['Warszawa', 'Kraków', 'Łódź', 'Wrocław', 'Poznań'];
  
  for (const city of polishCities) {
    await searchUsers(city);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  log('\n✅ Test wyszukiwania polskich użytkowników zakończony!');
};

// Uruchom test
testPolishUsers().catch(console.error); 