const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCompanyProfilesAPI() {
  console.log('🏢 Testowanie API profili firmowych...');
  
  try {
    // 1. Test rejestracji użytkownika
    console.log('📝 Test 1: Rejestracja użytkownika...');
    const testUser = `testuser_${Date.now()}`;
    const registerResponse = await axios.post(`${API_BASE}/users/register`, {
      username: testUser,
      email: `${testUser}@test.com`,
      password: 'testpass123'
    });
    
    console.log('✅ Rejestracja zakończona');
    const token = registerResponse.data.token;
    
    // 2. Test tworzenia profilu firmy
    console.log('🏢 Test 2: Tworzenie profilu firmy...');
    const companyData = {
      name: 'TechCorp Solutions',
      description: 'Innowacyjne rozwiązania technologiczne dla biznesu',
      shortDescription: 'Specjaliści od digitalizacji przedsiębiorstw',
      companyType: 'sme',
      industry: 'Technologia',
      contact: {
        email: 'kontakt@techcorp.pl',
        phone: '+48 123 456 789',
        website: 'https://techcorp.pl'
      },
      address: {
        city: 'Warszawa',
        voivodeship: 'Mazowieckie'
      },
      companyInfo: {
        foundedYear: 2020,
        employeeCount: '11-50',
        revenue: '1M-10M'
      }
    };
    
    const createCompanyResponse = await axios.post(`${API_BASE}/company-profiles`, companyData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Profil firmy utworzony');
    const companyId = createCompanyResponse.data._id;
    
    // 3. Test pobierania profilu firmy
    console.log('📋 Test 3: Pobieranie profilu firmy...');
    const getCompanyResponse = await axios.get(`${API_BASE}/company-profiles/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Profil firmy pobrany:', getCompanyResponse.data.name);
    
    // 4. Test dodawania postu firmowego
    console.log('📝 Test 4: Dodawanie postu firmowego...');
    const postData = {
      title: 'Nowe rozwiązanie dla e-commerce',
      content: 'Pracujemy nad rewolucyjnym systemem zarządzania sklepami online.',
      tags: ['e-commerce', 'technologia', 'innowacje']
    };
    
    await axios.post(`${API_BASE}/company-profiles/${companyId}/posts`, postData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Post firmowy dodany');
    
    // 5. Test dodawania oferty pracy
    console.log('💼 Test 5: Dodawanie oferty pracy...');
    const jobData = {
      title: 'Senior Frontend Developer',
      description: 'Poszukujemy doświadczonego developera React do naszego zespołu.',
      location: 'Warszawa',
      salary: {
        min: 8000,
        max: 15000,
        currency: 'PLN',
        period: 'monthly'
      },
      type: 'full-time',
      requirements: ['React', 'JavaScript', 'TypeScript'],
      benefits: ['Darmowe szkolenia', 'Elastyczne godziny pracy']
    };
    
    await axios.post(`${API_BASE}/company-profiles/${companyId}/jobs`, jobData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Oferta pracy dodana');
    
    // 6. Test wyszukiwania firm
    console.log('🔍 Test 6: Wyszukiwanie firm...');
    const searchResponse = await axios.get(`${API_BASE}/company-profiles/search?q=TechCorp`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Znaleziono ${searchResponse.data.companies.length} firm`);
    
    // 7. Test obserwowania firmy
    console.log('👁️ Test 7: Obserwowanie firmy...');
    const followResponse = await axios.post(`${API_BASE}/company-profiles/${companyId}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Firma obserwowana:', followResponse.data.isFollowing);
    
    // 8. Test dodawania recenzji
    console.log('⭐ Test 8: Dodawanie recenzji firmy...');
    const reviewData = {
      client: 'Anna Nowak',
      position: 'Dyrektor IT',
      company: 'ABC Corp',
      rating: 5,
      content: 'Świetna współpraca, profesjonalne podejście i wysokiej jakości rozwiązania.',
      project: 'System e-commerce'
    };
    
    await axios.post(`${API_BASE}/company-profiles/${companyId}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Recenzja dodana');
    
    // 9. Test statystyk branżowych
    console.log('📊 Test 9: Statystyki branżowe...');
    const statsResponse = await axios.get(`${API_BASE}/company-profiles/stats/industry`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Statystyki pobrane:', statsResponse.data.length, 'branż');
    
    // 10. Test aktualizacji profilu
    console.log('✏️ Test 10: Aktualizacja profilu firmy...');
    const updateData = {
      shortDescription: 'Zaktualizowany opis - liderzy w dziedzinie technologii'
    };
    
    await axios.put(`${API_BASE}/company-profiles/${companyId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Profil firmy zaktualizowany');
    
    console.log('🎉 Wszystkie testy API profili firmowych zakończone pomyślnie!');
    
    // Podsumowanie
    console.log('\n📋 PODSUMOWANIE TESTÓW:');
    console.log('✅ Rejestracja użytkownika');
    console.log('✅ Tworzenie profilu firmy');
    console.log('✅ Pobieranie profilu firmy');
    console.log('✅ Dodawanie postów firmowych');
    console.log('✅ Dodawanie ofert pracy');
    console.log('✅ Wyszukiwanie firm');
    console.log('✅ Obserwowanie firm');
    console.log('✅ Dodawanie recenzji');
    console.log('✅ Statystyki branżowe');
    console.log('✅ Aktualizacja profilu');
    
  } catch (error) {
    console.error('❌ Błąd podczas testowania:', error.response?.data || error.message);
  }
}

// Uruchom testy
testCompanyProfilesAPI().catch(console.error); 