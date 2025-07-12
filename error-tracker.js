const fs = require('fs-extra');
const path = require('path');

class ErrorTracker {
    constructor() {
        this.errorsFile = path.join(__dirname, 'error-log.json');
        this.statsFile = path.join(__dirname, 'error-stats.json');
        this.rulesFile = path.join(__dirname, 'error-rules.json');
        this.errors = [];
        this.stats = {};
        this.rules = {};
        
        this.loadExistingData();
    }

    async loadExistingData() {
        try {
            // Załaduj istniejące błędy
            if (await fs.pathExists(this.errorsFile)) {
                this.errors = await fs.readJson(this.errorsFile);
            }
            
            // Załaduj statystyki
            if (await fs.pathExists(this.statsFile)) {
                this.stats = await fs.readJson(this.statsFile);
            }
            
            // Załaduj reguły
            if (await fs.pathExists(this.rulesFile)) {
                this.rules = await fs.readJson(this.rulesFile);
            }
            
            console.log('✅ ErrorTracker: Załadowano istniejące dane');
        } catch (error) {
            console.error('❌ ErrorTracker: Błąd ładowania danych:', error.message);
        }
    }

    async trackError(error, context = {}) {
        const errorEntry = {
            id: this.generateErrorId(),
            timestamp: new Date().toISOString(),
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code
            },
            context: {
                file: context.file || 'unknown',
                function: context.function || 'unknown',
                line: context.line || 'unknown',
                module: context.module || 'unknown',
                user: context.user || 'system',
                action: context.action || 'unknown'
            },
            category: this.categorizeError(error),
            severity: this.calculateSeverity(error),
            status: 'new', // new, investigating, fixed, ignored
            fixAttempts: 0,
            fixHistory: [],
            relatedErrors: [],
            tags: this.generateTags(error, context)
        };

        this.errors.push(errorEntry);
        this.updateStats(errorEntry);
        this.updateRules(errorEntry);
        
        await this.saveData();
        
        console.log(`🚨 BŁĄD ZAREJESTROWANY: ${errorEntry.category} - ${error.message}`);
        console.log(`   📁 Plik: ${errorEntry.context.file}:${errorEntry.context.line}`);
        console.log(`   🏷️  ID: ${errorEntry.id}`);
        
        return errorEntry;
    }

    categorizeError(error) {
        const message = error.message.toLowerCase();
        const stack = error.stack.toLowerCase();
        
        // Kategorie błędów
        if (message.includes('cannot find module') || message.includes('module not found')) {
            return 'MODULE_NOT_FOUND';
        }
        if (message.includes('argument handler must be a function')) {
            return 'INVALID_HANDLER';
        }
        if (message.includes('syntax error')) {
            return 'SYNTAX_ERROR';
        }
        if (message.includes('permission denied') || message.includes('eacces')) {
            return 'PERMISSION_ERROR';
        }
        if (message.includes('connection') || message.includes('timeout')) {
            return 'CONNECTION_ERROR';
        }
        if (message.includes('validation') || message.includes('invalid')) {
            return 'VALIDATION_ERROR';
        }
        if (message.includes('authentication') || message.includes('unauthorized')) {
            return 'AUTH_ERROR';
        }
        if (message.includes('database') || message.includes('mongodb')) {
            return 'DATABASE_ERROR';
        }
        if (message.includes('memory') || message.includes('heap')) {
            return 'MEMORY_ERROR';
        }
        if (message.includes('typeerror')) {
            return 'TYPE_ERROR';
        }
        if (message.includes('referenceerror')) {
            return 'REFERENCE_ERROR';
        }
        
        return 'UNKNOWN_ERROR';
    }

    calculateSeverity(error) {
        const message = error.message.toLowerCase();
        
        // Krytyczne błędy
        if (message.includes('cannot find module') || 
            message.includes('syntax error') ||
            message.includes('uncaught exception')) {
            return 'CRITICAL';
        }
        
        // Wysokie błędy
        if (message.includes('connection') ||
            message.includes('database') ||
            message.includes('authentication')) {
            return 'HIGH';
        }
        
        // Średnie błędy
        if (message.includes('validation') ||
            message.includes('permission')) {
            return 'MEDIUM';
        }
        
        return 'LOW';
    }

    generateTags(error, context) {
        const tags = [];
        
        // Tagi na podstawie typu błędu
        if (error.name) tags.push(error.name);
        if (error.code) tags.push(error.code);
        
        // Tagi na podstawie kontekstu
        if (context.file) tags.push(`file:${path.basename(context.file)}`);
        if (context.module) tags.push(`module:${context.module}`);
        if (context.function) tags.push(`function:${context.function}`);
        
        // Tagi na podstawie kategorii
        const category = this.categorizeError(error);
        tags.push(`category:${category}`);
        
        return tags;
    }

    updateStats(errorEntry) {
        const category = errorEntry.category;
        const file = errorEntry.context.file;
        const severity = errorEntry.severity;
        
        // Statystyki kategorii
        if (!this.stats.categories) this.stats.categories = {};
        if (!this.stats.categories[category]) {
            this.stats.categories[category] = {
                count: 0,
                firstSeen: errorEntry.timestamp,
                lastSeen: errorEntry.timestamp,
                severity: {}
            };
        }
        this.stats.categories[category].count++;
        this.stats.categories[category].lastSeen = errorEntry.timestamp;
        
        // Statystyki plików
        if (!this.stats.files) this.stats.files = {};
        if (!this.stats.files[file]) {
            this.stats.files[file] = {
                count: 0,
                firstSeen: errorEntry.timestamp,
                lastSeen: errorEntry.timestamp,
                errors: []
            };
        }
        this.stats.files[file].count++;
        this.stats.files[file].lastSeen = errorEntry.timestamp;
        this.stats.files[file].errors.push(errorEntry.id);
        
        // Statystyki ogólne
        if (!this.stats.general) this.stats.general = {};
        this.stats.general.totalErrors = (this.stats.general.totalErrors || 0) + 1;
        this.stats.general.lastError = errorEntry.timestamp;
        
        // Statystyki ważności
        if (!this.stats.severity) this.stats.severity = {};
        this.stats.severity[severity] = (this.stats.severity[severity] || 0) + 1;
    }

    updateRules(errorEntry) {
        const category = errorEntry.category;
        
        if (!this.rules[category]) {
            this.rules[category] = {
                description: this.getRuleDescription(category),
                prevention: this.getPreventionTips(category),
                examples: [],
                fixAttempts: 0,
                successRate: 0,
                lastUpdated: errorEntry.timestamp
            };
        }
        
        // Dodaj przykład błędu
        this.rules[category].examples.push({
            message: errorEntry.error.message,
            file: errorEntry.context.file,
            line: errorEntry.context.line,
            timestamp: errorEntry.timestamp
        });
        
        // Ogranicz liczbę przykładów do 10
        if (this.rules[category].examples.length > 10) {
            this.rules[category].examples = this.rules[category].examples.slice(-10);
        }
        
        this.rules[category].lastUpdated = errorEntry.timestamp;
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

    generateErrorId() {
        return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async saveData() {
        try {
            await fs.writeJson(this.errorsFile, this.errors, { spaces: 2 });
            await fs.writeJson(this.statsFile, this.stats, { spaces: 2 });
            await fs.writeJson(this.rulesFile, this.rules, { spaces: 2 });
        } catch (error) {
            console.error('❌ ErrorTracker: Błąd zapisywania danych:', error.message);
        }
    }

    getErrorStats() {
        return {
            totalErrors: this.errors.length,
            categories: this.stats.categories || {},
            files: this.stats.files || {},
            severity: this.stats.severity || {},
            rules: this.rules
        };
    }

    getErrorsByCategory(category) {
        return this.errors.filter(error => error.category === category);
    }

    getErrorsByFile(file) {
        return this.errors.filter(error => error.context.file === file);
    }

    markErrorAsFixed(errorId, fixDescription) {
        const error = this.errors.find(e => e.id === errorId);
        if (error) {
            error.status = 'fixed';
            error.fixAttempts++;
            error.fixHistory.push({
                timestamp: new Date().toISOString(),
                description: fixDescription
            });
            this.saveData();
        }
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalErrors: this.errors.length,
                criticalErrors: this.errors.filter(e => e.severity === 'CRITICAL').length,
                fixedErrors: this.errors.filter(e => e.status === 'fixed').length,
                newErrors: this.errors.filter(e => e.status === 'new').length
            },
            topCategories: Object.entries(this.stats.categories || {})
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5),
            topFiles: Object.entries(this.stats.files || {})
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5),
            recentErrors: this.errors
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10)
        };
        
        return report;
    }
}

// Eksportuj singleton
module.exports = new ErrorTracker(); 