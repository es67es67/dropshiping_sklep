const ErrorTracker = require('./error-tracker');
const CodeDocumenter = require('./code-documenter');
const fs = require('fs-extra');
const path = require('path');

class CodeManager {
    constructor() {
        this.errorTracker = ErrorTracker;
        this.codeDocumenter = CodeDocumenter;
        this.rulesFile = path.join(__dirname, 'code-rules.json');
        this.statsFile = path.join(__dirname, 'code-stats.json');
        this.rules = {};
        this.stats = {};
        
        this.loadRules();
        this.setupErrorHandling();
    }

    async loadRules() {
        try {
            if (await fs.pathExists(this.rulesFile)) {
                this.rules = await fs.readJson(this.rulesFile);
            }
            
            if (await fs.pathExists(this.statsFile)) {
                this.stats = await fs.readJson(this.statsFile);
            }
        } catch (error) {
            console.error('❌ CodeManager: Błąd ładowania reguł:', error.message);
        }
    }

    setupErrorHandling() {
        // Przechwyć wszystkie nieobsłużone błędy
        process.on('uncaughtException', (error) => {
            this.handleError(error, {
                file: 'process',
                function: 'uncaughtException',
                line: 'unknown',
                module: 'system',
                user: 'system',
                action: 'uncaughtException'
            });
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.handleError(reason, {
                file: 'process',
                function: 'unhandledRejection',
                line: 'unknown',
                module: 'system',
                user: 'system',
                action: 'unhandledRejection'
            });
        });
    }

    async handleError(error, context = {}) {
        // Dodaj informacje o stosie wywołań
        if (error.stack) {
            const stackLines = error.stack.split('\n');
            for (const line of stackLines) {
                const fileMatch = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
                if (fileMatch && !context.file) {
                    context.file = fileMatch[2];
                    context.line = fileMatch[3];
                    context.function = fileMatch[1];
                    break;
                }
            }
        }

        // Zarejestruj błąd
        const errorEntry = await this.errorTracker.trackError(error, context);
        
        // Sprawdź reguły i zastosuj automatyczne naprawy
        await this.applyAutoFixes(errorEntry);
        
        // Zaktualizuj statystyki
        this.updateStats(errorEntry);
        
        // Zapisz reguły
        await this.saveRules();
        
        return errorEntry;
    }

    async applyAutoFixes(errorEntry) {
        const category = errorEntry.category;
        const rules = this.rules[category] || {};
        
        if (rules.autoFix) {
            console.log(`🔧 Próba automatycznej naprawy błędu: ${category}`);
            
            try {
                switch (category) {
                    case 'INVALID_HANDLER':
                        await this.fixInvalidHandler(errorEntry);
                        break;
                    case 'MODULE_NOT_FOUND':
                        await this.fixModuleNotFound(errorEntry);
                        break;
                    case 'SYNTAX_ERROR':
                        await this.fixSyntaxError(errorEntry);
                        break;
                    default:
                        console.log(`⚠️  Brak automatycznej naprawy dla kategorii: ${category}`);
                }
            } catch (fixError) {
                console.error(`❌ Błąd podczas automatycznej naprawy:`, fixError.message);
            }
        }
    }

    async fixInvalidHandler(errorEntry) {
        const file = errorEntry.context.file;
        const line = errorEntry.context.line;
        
        if (file && line) {
            try {
                const content = await fs.readFile(file, 'utf8');
                const lines = content.split('\n');
                
                // Sprawdź czy to jest problem z userRoutes.js
                if (file.includes('userRoutes.js')) {
                    // Dodaj walidację handlera
                    const newContent = this.addHandlerValidation(content);
                    await fs.writeFile(file, newContent);
                    
                    errorEntry.status = 'fixed';
                    errorEntry.fixHistory.push({
                        timestamp: new Date().toISOString(),
                        description: 'Dodano walidację handlera w userRoutes.js'
                    });
                    
                    console.log(`✅ Naprawiono błąd INVALID_HANDLER w ${file}`);
                }
            } catch (error) {
                console.error(`❌ Błąd naprawy INVALID_HANDLER:`, error.message);
            }
        }
    }

    async fixModuleNotFound(errorEntry) {
        const message = errorEntry.error.message;
        const moduleMatch = message.match(/Cannot find module '(.+?)'/);
        
        if (moduleMatch) {
            const moduleName = moduleMatch[1];
            console.log(`📦 Próba instalacji modułu: ${moduleName}`);
            
            // Tutaj można dodać automatyczną instalację modułu
            // npm install ${moduleName}
        }
    }

    async fixSyntaxError(errorEntry) {
        const file = errorEntry.context.file;
        const line = errorEntry.context.line;
        
        if (file && line) {
            console.log(`🔧 Sprawdź składnię w ${file}:${line}`);
            // Tutaj można dodać automatyczne sprawdzanie składni
        }
    }

    addHandlerValidation(content) {
        // Dodaj funkcję safeRoute jeśli nie istnieje
        if (!content.includes('function safeRoute')) {
            const safeRouteFunction = `
function safeRoute(method, path, ...handlers) {
  // Ostatni handler musi być funkcją
  const last = handlers[handlers.length - 1];
  if (typeof last === 'function') {
    router[method](path, ...handlers);
  } else {
    console.warn(\`⚠️  Handler dla \${method.toUpperCase()} \${path} nie jest funkcją! Pomijam trasę.\`);
  }
}

`;
            // Wstaw przed pierwszym router.get
            const insertIndex = content.indexOf('router.get');
            if (insertIndex !== -1) {
                return content.slice(0, insertIndex) + safeRouteFunction + content.slice(insertIndex);
            }
        }
        
        return content;
    }

    updateStats(errorEntry) {
        const category = errorEntry.category;
        const file = errorEntry.context.file;
        
        // Statystyki kategorii
        if (!this.stats.categories) this.stats.categories = {};
        if (!this.stats.categories[category]) {
            this.stats.categories[category] = {
                count: 0,
                firstSeen: errorEntry.timestamp,
                lastSeen: errorEntry.timestamp,
                fixedCount: 0,
                autoFixedCount: 0
            };
        }
        this.stats.categories[category].count++;
        this.stats.categories[category].lastSeen = errorEntry.timestamp;
        
        if (errorEntry.status === 'fixed') {
            this.stats.categories[category].fixedCount++;
        }
        
        // Statystyki plików
        if (!this.stats.files) this.stats.files = {};
        if (!this.stats.files[file]) {
            this.stats.files[file] = {
                count: 0,
                firstSeen: errorEntry.timestamp,
                lastSeen: errorEntry.timestamp,
                errorTypes: {}
            };
        }
        this.stats.files[file].count++;
        this.stats.files[file].lastSeen = errorEntry.timestamp;
        
        if (!this.stats.files[file].errorTypes[category]) {
            this.stats.files[file].errorTypes[category] = 0;
        }
        this.stats.files[file].errorTypes[category]++;
        
        // Statystyki ogólne
        if (!this.stats.general) this.stats.general = {};
        this.stats.general.totalErrors = (this.stats.general.totalErrors || 0) + 1;
        this.stats.general.lastError = errorEntry.timestamp;
        this.stats.general.autoFixedErrors = (this.stats.general.autoFixedErrors || 0) + 
            (errorEntry.status === 'fixed' ? 1 : 0);
    }

    async saveRules() {
        try {
            await fs.writeJson(this.rulesFile, this.rules, { spaces: 2 });
            await fs.writeJson(this.statsFile, this.stats, { spaces: 2 });
        } catch (error) {
            console.error('❌ CodeManager: Błąd zapisywania reguł:', error.message);
        }
    }

    async scanAndDocument() {
        console.log('🔍 Skanowanie i dokumentowanie kodu...');
        
        // Skanuj kod
        await this.codeDocumenter.scanCodebase();
        
        // Dodaj komentarze użycia
        await this.codeDocumenter.addUsageCommentToAll();
        
        console.log('✅ Skanowanie i dokumentowanie zakończone');
    }

    getComprehensiveReport() {
        const errorStats = this.errorTracker.getErrorStats();
        const usageReport = this.codeDocumenter.getUsageReport();
        
        return {
            timestamp: new Date().toISOString(),
            errors: {
                total: errorStats.totalErrors,
                categories: errorStats.categories,
                files: errorStats.files,
                severity: errorStats.severity
            },
            code: {
                totalFunctions: usageReport.totalFunctions,
                unusedFunctions: usageReport.unusedFunctions,
                mostUsedFunctions: usageReport.mostUsedFunctions,
                filesWithMostFunctions: usageReport.filesWithMostFunctions
            },
            stats: this.stats,
            rules: this.rules
        };
    }

    async generateRulesFromErrors() {
        console.log('📋 Generowanie reguł z błędów...');
        
        const errorStats = this.errorTracker.getErrorStats();
        
        for (const [category, data] of Object.entries(errorStats.categories)) {
            if (!this.rules[category]) {
                this.rules[category] = {
                    description: this.getRuleDescription(category),
                    prevention: this.getPreventionTips(category),
                    autoFix: this.shouldAutoFix(category),
                    examples: [],
                    fixAttempts: 0,
                    successRate: 0,
                    lastUpdated: new Date().toISOString()
                };
            }
            
            // Dodaj przykłady błędów
            const categoryErrors = this.errorTracker.getErrorsByCategory(category);
            this.rules[category].examples = categoryErrors.slice(0, 5).map(error => ({
                message: error.error.message,
                file: error.context.file,
                line: error.context.line,
                timestamp: error.timestamp
            }));
        }
        
        await this.saveRules();
        console.log('✅ Reguły wygenerowane');
    }

    getRuleDescription(category) {
        const descriptions = {
            'MODULE_NOT_FOUND': 'Błąd: Nie można znaleźć modułu. Sprawdź czy pakiet jest zainstalowany.',
            'INVALID_HANDLER': 'Błąd: Handler nie jest funkcją. Sprawdź czy funkcja jest poprawnie eksportowana.',
            'SYNTAX_ERROR': 'Błąd składni w kodzie JavaScript.',
            'PERMISSION_ERROR': 'Błąd uprawnień - brak dostępu do pliku/katalogu.',
            'CONNECTION_ERROR': 'Błąd połączenia z bazą danych lub API.',
            'VALIDATION_ERROR': 'Błąd walidacji danych.',
            'AUTH_ERROR': 'Błąd autoryzacji/uwierzytelniania.',
            'DATABASE_ERROR': 'Błąd bazy danych MongoDB.',
            'MEMORY_ERROR': 'Błąd pamięci - wyciek pamięci lub za mało RAM.',
            'TYPE_ERROR': 'Błąd typu - nieprawidłowy typ danych.',
            'REFERENCE_ERROR': 'Błąd referencji - zmienna nie jest zdefiniowana.',
            'UNKNOWN_ERROR': 'Nieznany błąd - wymaga dalszej analizy.'
        };
        
        return descriptions[category] || 'Brak opisu dla tej kategorii.';
    }

    getPreventionTips(category) {
        const tips = {
            'MODULE_NOT_FOUND': [
                'Zawsze używaj npm install po klonowaniu projektu',
                'Sprawdź czy package.json zawiera wszystkie zależności',
                'Użyj npm ci dla czystej instalacji'
            ],
            'INVALID_HANDLER': [
                'Sprawdź czy funkcja jest poprawnie eksportowana',
                'Użyj console.log() do debugowania importów',
                'Dodaj walidację przed rejestracją tras'
            ],
            'SYNTAX_ERROR': [
                'Używaj ESLint do sprawdzania składni',
                'Sprawdź nawiasy, średniki i cudzysłowy',
                'Używaj Prettier do formatowania kodu'
            ],
            'PERMISSION_ERROR': [
                'Sprawdź uprawnienia do plików/katalogów',
                'Użyj sudo tylko w razie konieczności',
                'Sprawdź czy katalog istnieje przed zapisem'
            ],
            'CONNECTION_ERROR': [
                'Sprawdź połączenie internetowe',
                'Zweryfikuj URL i port',
                'Dodaj retry logic dla połączeń'
            ],
            'VALIDATION_ERROR': [
                'Dodaj walidację po stronie klienta i serwera',
                'Używaj bibliotek walidacji (Joi, Yup)',
                'Sprawdź typy danych przed przetwarzaniem'
            ],
            'AUTH_ERROR': [
                'Sprawdź tokeny JWT',
                'Zweryfikuj uprawnienia użytkownika',
                'Dodaj middleware autoryzacji'
            ],
            'DATABASE_ERROR': [
                'Sprawdź połączenie z MongoDB',
                'Zweryfikuj schemat danych',
                'Dodaj obsługę błędów w zapytaniach'
            ],
            'MEMORY_ERROR': [
                'Monitoruj użycie pamięci',
                'Zamykaj połączenia i strumienie',
                'Używaj garbage collection'
            ],
            'TYPE_ERROR': [
                'Używaj TypeScript',
                'Dodaj sprawdzanie typów',
                'Używaj default values'
            ],
            'REFERENCE_ERROR': [
                'Sprawdź czy zmienne są zdefiniowane',
                'Używaj let/const zamiast var',
                'Dodaj sprawdzanie undefined'
            ],
            'UNKNOWN_ERROR': [
                'Dodaj szczegółowe logowanie',
                'Używaj try-catch bloków',
                'Monitoruj aplikację'
            ]
        };
        
        return tips[category] || ['Brak wskazówek dla tej kategorii.'];
    }

    shouldAutoFix(category) {
        const autoFixCategories = [
            'INVALID_HANDLER',
            'MODULE_NOT_FOUND',
            'SYNTAX_ERROR'
        ];
        
        return autoFixCategories.includes(category);
    }
}

module.exports = new CodeManager(); 