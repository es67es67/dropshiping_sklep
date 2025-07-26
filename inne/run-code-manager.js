const CodeManager = require('./code-manager');

async function main() {
    console.log('🚀 SYSTEM ZARZĄDZANIA KODEM');
    console.log('============================');
    
    const codeManager = CodeManager;
    
    // Przechwyć błędy podczas uruchamiania
    try {
        // Skanuj i udokumentuj kod
        console.log('\n📋 Krok 1: Skanowanie i dokumentowanie kodu...');
        await codeManager.scanAndDocument();
        
        // Wygeneruj reguły z istniejących błędów
        console.log('\n📋 Krok 2: Generowanie reguł z błędów...');
        await codeManager.generateRulesFromErrors();
        
        // Wygeneruj raport
        console.log('\n📊 Krok 3: Generowanie raportu...');
        const report = codeManager.getComprehensiveReport();
        
        // Wyświetl podsumowanie
        console.log('\n📈 PODSUMOWANIE:');
        console.log(`🔴 Łącznie błędów: ${report.errors.total}`);
        console.log(`🔧 Naprawionych automatycznie: ${report.stats.general?.autoFixedErrors || 0}`);
        console.log(`📝 Łącznie funkcji: ${report.code.totalFunctions}`);
        console.log(`❌ Nieużywanych funkcji: ${report.code.unusedFunctions}`);
        
        // Wyświetl top kategorie błędów
        if (report.errors.categories) {
            console.log('\n🔴 TOP KATEGORIE BŁĘDÓW:');
            Object.entries(report.errors.categories)
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5)
                .forEach(([category, data]) => {
                    console.log(`   ${category}: ${data.count} błędów`);
                });
        }
        
        // Wyświetl top pliki z błędami
        if (report.errors.files) {
            console.log('\n📁 TOP PLIKI Z BŁĘDAMI:');
            Object.entries(report.errors.files)
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5)
                .forEach(([file, data]) => {
                    console.log(`   ${file}: ${data.count} błędów`);
                });
        }
        
        // Wyświetl najbardziej używane funkcje
        if (report.code.mostUsedFunctions) {
            console.log('\n⭐ NAJBARDZIEJ UŻYWANE FUNKCJE:');
            report.code.mostUsedFunctions.slice(0, 5).forEach(func => {
                console.log(`   ${func.name} (${func.file}): ${func.usage.length} użyć`);
            });
        }
        
        console.log('\n✅ System zarządzania kodem uruchomiony!');
        console.log('📁 Sprawdź pliki:');
        console.log('   - error-log.json (błędy)');
        console.log('   - error-stats.json (statystyki błędów)');
        console.log('   - error-rules.json (reguły)');
        console.log('   - code-documentation.json (dokumentacja)');
        console.log('   - code-stats.json (statystyki kodu)');
        console.log('   - code-rules.json (reguły kodu)');
        
    } catch (error) {
        console.error('❌ Błąd podczas uruchamiania systemu:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Uruchom system
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main }; 