const fetch = require('node-fetch');

async function testCompanyAPI() {
  try {
    console.log('🧪 Testowanie API firm...');
    
    // Test pobierania listy firm
    console.log('📋 Pobieranie listy firm...');
    const listResponse = await fetch('http://localhost:5000/api/company-profiles/list?limit=5');
    console.log('Status:', listResponse.status);
    
    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log('✅ Lista firm pobrana pomyślnie');
      console.log('Liczba firm:', listData.companyProfiles?.length || 0);
      if (listData.companyProfiles?.length > 0) {
        console.log('Pierwsza firma:', listData.companyProfiles[0].name);
        console.log('ID pierwszej firmy:', listData.companyProfiles[0]._id);
      }
    } else {
      console.log('❌ Błąd pobierania listy firm');
      const errorText = await listResponse.text();
      console.log('Błąd:', errorText);
    }
    
    // Test pobierania konkretnej firmy
    console.log('\n🏢 Pobieranie konkretnej firmy...');
    const companyResponse = await fetch('http://localhost:5000/api/company-profiles/6875773831cf77c7af5e07b4');
    console.log('Status:', companyResponse.status);
    
    if (companyResponse.ok) {
      const companyData = await companyResponse.json();
      console.log('✅ Firma pobrana pomyślnie');
      console.log('Nazwa firmy:', companyData.name);
      console.log('Branża:', companyData.industry);
    } else {
      console.log('❌ Błąd pobierania firmy');
      const errorText = await companyResponse.text();
      console.log('Błąd:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Błąd testowania API:', error.message);
  }
}

testCompanyAPI(); 