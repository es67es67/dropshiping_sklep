const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Konfiguracja Render API
const RENDER_API_KEY = 'rnd_Q0PxVYXZycCyFAfuBo1vV63xPBhW';
const BACKEND_SERVICE_ID = 'srv-d1n82oje5dus73c95in0';
const FRONTEND_SERVICE_ID = 'srv-d1n82obe5dus73c95ilg';

const RENDER_API_BASE = 'https://api.render.com/v1';

// Headers dla API
const headers = {
    'Authorization': `Bearer ${RENDER_API_KEY}`,
    'Content-Type': 'application/json'
};

async function getServiceStatus(serviceId, serviceName) {
    try {
        console.log(`🔍 Sprawdzanie statusu ${serviceName}...`);
        
        const response = await axios.get(`${RENDER_API_BASE}/services/${serviceId}`, { headers });
        
        const service = response.data;
        console.log(`✅ ${serviceName} Status: ${service.status}`);
        console.log(`   URL: ${service.service?.url || 'N/A'}`);
        console.log(`   Ostatni deploy: ${service.updatedAt}`);
        
        return {
            name: serviceName,
            status: service.status,
            url: service.service?.url,
            lastDeploy: service.updatedAt,
            success: true
        };
    } catch (error) {
        console.error(`❌ Błąd podczas sprawdzania ${serviceName}:`, error.response?.data || error.message);
        return {
            name: serviceName,
            status: 'ERROR',
            error: error.response?.data || error.message,
            success: false
        };
    }
}

async function getServiceLogs(serviceId, serviceName) {
    try {
        console.log(`📋 Pobieranie logów ${serviceName}...`);
        
        const response = await axios.get(`${RENDER_API_BASE}/services/${serviceId}/logs`, { 
            headers,
            params: {
                limit: 100 // Ostatnie 100 logów
            }
        });
        
        const logs = response.data;
        console.log(`✅ Pobrano ${logs.length} logów dla ${serviceName}`);
        
        return {
            name: serviceName,
            logs: logs,
            success: true
        };
    } catch (error) {
        console.error(`❌ Błąd podczas pobierania logów ${serviceName}:`, error.response?.data || error.message);
        return {
            name: serviceName,
            logs: [],
            error: error.response?.data || error.message,
            success: false
        };
    }
}

async function getDeployments(serviceId, serviceName) {
    try {
        console.log(`🚀 Sprawdzanie deployów ${serviceName}...`);
        
        const response = await axios.get(`${RENDER_API_BASE}/services/${serviceId}/deploys`, { 
            headers,
            params: {
                limit: 10 // Ostatnie 10 deployów
            }
        });
        
        const deployments = response.data;
        console.log(`✅ Pobrano ${deployments.length} deployów dla ${serviceName}`);
        
        return {
            name: serviceName,
            deployments: deployments,
            success: true
        };
    } catch (error) {
        console.error(`❌ Błąd podczas pobierania deployów ${serviceName}:`, error.response?.data || error.message);
        return {
            name: serviceName,
            deployments: [],
            error: error.response?.data || error.message,
            success: false
        };
    }
}

async function monitorRender() {
    console.log('🚀 Inicjalizacja monitoringu Render przez API...');
    console.log('=' .repeat(50));
    
    const results = {
        timestamp: new Date().toISOString(),
        services: []
    };
    
    // Sprawdzanie statusu usług
    const backendStatus = await getServiceStatus(BACKEND_SERVICE_ID, 'Backend');
    const frontendStatus = await getServiceStatus(FRONTEND_SERVICE_ID, 'Frontend');
    
    results.services.push(backendStatus);
    results.services.push(frontendStatus);
    
    console.log('\n' + '=' .repeat(50));
    
    // Pobieranie logów
    const backendLogs = await getServiceLogs(BACKEND_SERVICE_ID, 'Backend');
    const frontendLogs = await getServiceLogs(FRONTEND_SERVICE_ID, 'Frontend');
    
    results.services.push(backendLogs);
    results.services.push(frontendLogs);
    
    console.log('\n' + '=' .repeat(50));
    
    // Sprawdzanie deployów
    const backendDeployments = await getDeployments(BACKEND_SERVICE_ID, 'Backend');
    const frontendDeployments = await getDeployments(FRONTEND_SERVICE_ID, 'Frontend');
    
    results.services.push(backendDeployments);
    results.services.push(frontendDeployments);
    
    // Zapisywanie raportu
    const reportPath = path.join(__dirname, `render_api_report_${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    
    console.log('\n' + '=' .repeat(50));
    console.log('📊 PODSUMOWANIE MONITORINGU RENDER:');
    console.log(`📄 Raport zapisany: ${reportPath}`);
    
    // Podsumowanie statusów
    const statusServices = results.services.filter(s => s.status);
    const successCount = statusServices.filter(s => s.success).length;
    const errorCount = statusServices.filter(s => !s.success).length;
    
    console.log(`✅ Usługi działające: ${successCount}`);
    console.log(`❌ Usługi z błędami: ${errorCount}`);
    
    if (errorCount > 0) {
        console.log('\n❌ BŁĘDY:');
        results.services.filter(s => !s.success).forEach(service => {
            console.log(`   - ${service.name}: ${service.error || 'Nieznany błąd'}`);
        });
    }
    
    return results;
}

// Uruchomienie monitoringu
if (require.main === module) {
    monitorRender().catch(console.error);
}

module.exports = { monitorRender }; 