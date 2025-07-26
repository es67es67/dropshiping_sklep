const http = require('http');

// Sprawdź status serwerów
async function checkServer(url, name) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      console.log(`✅ ${name} (${url}): Status ${res.statusCode}`);
      resolve({ status: 'ok', code: res.statusCode });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name} (${url}): ${err.message}`);
      resolve({ status: 'error', error: err.message });
    });
    
    req.setTimeout(5000, () => {
      console.log(`⏰ ${name} (${url}): Timeout`);
      resolve({ status: 'timeout' });
    });
  });
}

async function checkAllServers() {
  console.log('🔍 Sprawdzanie statusu serwerów...\n');
  
  const servers = [
    { url: 'http://localhost:3000', name: 'Frontend (Vite)' },
    { url: 'http://localhost:5000', name: 'Backend (Express)' },
    { url: 'https://portal-backend-igf9.onrender.com', name: 'Backend (Render)' }
  ];
  
  for (const server of servers) {
    await checkServer(server.url, server.name);
  }
  
  console.log('\n📋 Instrukcje:');
  console.log('1. Frontend powinien działać na http://localhost:3000');
  console.log('2. Backend powinien działać na http://localhost:5000');
  console.log('3. Jeśli serwery nie działają, uruchom je:');
  console.log('   - Frontend: cd frontend && npm run dev');
  console.log('   - Backend: cd backend && npm start');
}

checkAllServers(); 