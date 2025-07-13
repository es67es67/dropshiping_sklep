// Prosty test rejestracji użytkownika
const fetch = require('node-fetch');

const backendUrl = 'https://portal-backend-igf9.onrender.com';

async function testRegistration() {
  console.log('🧪 Test rejestracji użytkownika...');
  
  const timestamp = Date.now();
  const testUser = {
    username: `testuser${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'Test123!',
    firstName: `TestUser${timestamp}`,
    lastName: `TestLastName${timestamp}`,
    dateOfBirth: '1990-01-01',
    phone: '+48 123 456 789',
    city: 'Warszawa',
    gender: 'male'
  };
  
  try {
    console.log('📝 Rejestruję użytkownika:', testUser.username);
    
    const response = await fetch(`${backendUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log('❌ Błąd rejestracji:', data.error);
      console.log('Status:', response.status);
      return false;
    }
    
    console.log('✅ Rejestracja udana!');
    console.log('User ID:', data.user._id);
    console.log('Token:', data.token.substring(0, 20) + '...');
    
    // Test logowania
    console.log('\n🔐 Test logowania...');
    
    const loginResponse = await fetch(`${backendUrl}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      }),
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ Błąd logowania:', loginData.error);
      return false;
    }
    
    console.log('✅ Logowanie udane!');
    console.log('User ID:', loginData.user._id);
    console.log('Username:', loginData.user.username);
    console.log('Email:', loginData.user.email);
    console.log('isActive:', loginData.user.isActive);
    
    return true;
    
  } catch (error) {
    console.error('❌ Błąd testu:', error.message);
    return false;
  }
}

async function testExistingUsers() {
  console.log('\n👥 Sprawdzanie istniejących użytkowników...');
  
  try {
    const response = await fetch(`${backendUrl}/api/users/search?q=test&limit=5`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Znaleziono ${data.length} użytkowników testowych`);
      data.forEach(user => {
        console.log(`- ${user.username} (${user.email}) - isActive: ${user.isActive}`);
      });
    } else {
      console.log('❌ Błąd pobierania użytkowników:', data.error);
    }
  } catch (error) {
    console.error('❌ Błąd:', error.message);
  }
}

async function main() {
  console.log('🚀 Rozpoczęcie testów rejestracji...\n');
  
  const registrationSuccess = await testRegistration();
  await testExistingUsers();
  
  console.log('\n📊 Podsumowanie:');
  if (registrationSuccess) {
    console.log('✅ Rejestracja i logowanie działają poprawnie');
    console.log('✅ Użytkownicy są dodawani do bazy danych');
  } else {
    console.log('❌ Wystąpiły błędy w rejestracji/logowaniu');
  }
}

main().catch(console.error); 