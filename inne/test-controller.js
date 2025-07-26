// Test kontrolera użytkowników
try {
    console.log('🔍 Testowanie importu userController...');
    
    const userController = require('./backend/controllers/userController');
    
    console.log('✅ userController zaimportowany pomyślnie');
    console.log('📋 Dostępne funkcje:');
    
    const functions = Object.keys(userController);
    functions.forEach(func => {
        console.log(`   - ${func}: ${typeof userController[func]}`);
    });
    
    // Sprawdź konkretnie funkcję list
    if (userController.list) {
        console.log('✅ userController.list istnieje i jest funkcją');
    } else {
        console.log('❌ userController.list nie istnieje!');
    }
    
} catch (error) {
    console.error('❌ Błąd podczas importu userController:', error.message);
    console.error('Stack trace:', error.stack);
} 