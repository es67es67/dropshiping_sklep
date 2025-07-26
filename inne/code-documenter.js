const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

class CodeDocumenter {
    constructor() {
        this.usageMap = {};
        this.dependencies = {};
        this.documentationFile = path.join(__dirname, 'code-documentation.json');
        this.loadExistingDocumentation();
    }

    async loadExistingDocumentation() {
        try {
            if (await fs.pathExists(this.documentationFile)) {
                const data = await fs.readJson(this.documentationFile);
                this.usageMap = data.usageMap || {};
                this.dependencies = data.dependencies || {};
            }
        } catch (error) {
            console.error('❌ CodeDocumenter: Błąd ładowania dokumentacji:', error.message);
        }
    }

    async scanCodebase(rootDir = '.') {
        console.log('🔍 Skanowanie kodu...');
        
        // Skanuj pliki JavaScript/TypeScript
        const files = glob.sync(`${rootDir}/**/*.{js,jsx,ts,tsx}`, {
            ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
        });

        for (const file of files) {
            await this.analyzeFile(file);
        }

        await this.saveDocumentation();
        console.log('✅ Skanowanie zakończone');
    }

    async analyzeFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            
            // Analizuj funkcje i klasy
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Znajdź funkcje
                const functionMatch = line.match(/^(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
                if (functionMatch) {
                    const functionName = functionMatch[1];
                    await this.documentFunction(filePath, functionName, i + 1, lines);
                }
                
                // Znajdź metody klas
                const methodMatch = line.match(/^\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*{/);
                if (methodMatch) {
                    const methodName = methodMatch[1];
                    await this.documentMethod(filePath, methodName, i + 1, lines);
                }
                
                // Znajdź eksporty
                const exportMatch = line.match(/^exports\.(\w+)\s*=/);
                if (exportMatch) {
                    const exportName = exportMatch[1];
                    await this.documentExport(filePath, exportName, i + 1, lines);
                }
            }
            
        } catch (error) {
            console.error(`❌ Błąd analizy pliku ${filePath}:`, error.message);
        }
    }

    async documentFunction(filePath, functionName, lineNumber, lines) {
        const key = `${filePath}:${functionName}`;
        
        if (!this.usageMap[key]) {
            this.usageMap[key] = {
                type: 'function',
                name: functionName,
                file: filePath,
                line: lineNumber,
                usage: [],
                dependencies: [],
                description: this.extractDescription(lines, lineNumber),
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
        }
        
        // Znajdź użycia tej funkcji
        await this.findUsages(functionName, filePath);
    }

    async documentMethod(filePath, methodName, lineNumber, lines) {
        const key = `${filePath}:${methodName}`;
        
        if (!this.usageMap[key]) {
            this.usageMap[key] = {
                type: 'method',
                name: methodName,
                file: filePath,
                line: lineNumber,
                usage: [],
                dependencies: [],
                description: this.extractDescription(lines, lineNumber),
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
        }
    }

    async documentExport(filePath, exportName, lineNumber, lines) {
        const key = `${filePath}:${exportName}`;
        
        if (!this.usageMap[key]) {
            this.usageMap[key] = {
                type: 'export',
                name: exportName,
                file: filePath,
                line: lineNumber,
                usage: [],
                dependencies: [],
                description: this.extractDescription(lines, lineNumber),
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
        }
    }

    extractDescription(lines, lineNumber) {
        // Szukaj komentarzy nad funkcją
        let description = '';
        for (let i = lineNumber - 2; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.startsWith('//') || line.startsWith('/*')) {
                description = line.replace(/^\/\/\s*/, '').replace(/^\/\*\s*/, '').replace(/\s*\*\/$/, '');
                break;
            }
            if (line === '') break;
        }
        return description;
    }

    async findUsages(functionName, excludeFile) {
        const files = glob.sync('**/*.{js,jsx,ts,tsx}', {
            ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
        });

        for (const file of files) {
            if (file === excludeFile) continue;
            
            try {
                const content = await fs.readFile(file, 'utf8');
                const lines = content.split('\n');
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    // Sprawdź czy funkcja jest używana
                    if (line.includes(functionName)) {
                        const key = `${excludeFile}:${functionName}`;
                        if (this.usageMap[key]) {
                            this.usageMap[key].usage.push({
                                file: file,
                                line: i + 1,
                                context: line.trim(),
                                timestamp: new Date().toISOString()
                            });
                        }
                    }
                }
            } catch (error) {
                console.error(`❌ Błąd szukania użyć w ${file}:`, error.message);
            }
        }
    }

    generateUsageComment(filePath, functionName) {
        const key = `${filePath}:${functionName}`;
        const item = this.usageMap[key];
        
        if (!item || item.usage.length === 0) {
            return `// TODO: Użycie nieznane - sprawdź czy funkcja jest potrzebna`;
        }
        
        const usageFiles = [...new Set(item.usage.map(u => u.file))];
        const usageCount = item.usage.length;
        
        let comment = `// UŻYCIE: ${usageCount} użyć w ${usageFiles.length} plikach\n`;
        comment += `// Pliki: ${usageFiles.map(f => path.basename(f)).join(', ')}\n`;
        
        if (item.description) {
            comment += `// Opis: ${item.description}\n`;
        }
        
        comment += `// Ostatnia modyfikacja: ${item.lastModified}`;
        
        return comment;
    }

    async addUsageComment(filePath, functionName) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');
            
            // Znajdź linię z funkcją
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const functionMatch = line.match(/^(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
                
                if (functionMatch && functionMatch[1] === functionName) {
                    const comment = this.generateUsageComment(filePath, functionName);
                    
                    // Sprawdź czy komentarz już istnieje
                    if (i > 0 && !lines[i-1].includes('UŻYCIE:')) {
                        lines.splice(i, 0, comment);
                        await fs.writeFile(filePath, lines.join('\n'));
                        console.log(`✅ Dodano komentarz użycia dla ${functionName} w ${filePath}`);
                    }
                    break;
                }
            }
        } catch (error) {
            console.error(`❌ Błąd dodawania komentarza w ${filePath}:`, error.message);
        }
    }

    async saveDocumentation() {
        try {
            const data = {
                usageMap: this.usageMap,
                dependencies: this.dependencies,
                lastUpdated: new Date().toISOString()
            };
            
            await fs.writeJson(this.documentationFile, data, { spaces: 2 });
        } catch (error) {
            console.error('❌ CodeDocumenter: Błąd zapisywania dokumentacji:', error.message);
        }
    }

    getUsageReport() {
        const report = {
            totalFunctions: Object.keys(this.usageMap).length,
            unusedFunctions: Object.values(this.usageMap).filter(item => item.usage.length === 0).length,
            mostUsedFunctions: Object.values(this.usageMap)
                .sort((a, b) => b.usage.length - a.usage.length)
                .slice(0, 10),
            filesWithMostFunctions: this.getFilesWithMostFunctions(),
            lastUpdated: new Date().toISOString()
        };
        
        return report;
    }

    getFilesWithMostFunctions() {
        const fileStats = {};
        
        Object.values(this.usageMap).forEach(item => {
            const file = item.file;
            if (!fileStats[file]) {
                fileStats[file] = {
                    functions: 0,
                    methods: 0,
                    exports: 0
                };
            }
            
            fileStats[file][item.type + 's']++;
        });
        
        return Object.entries(fileStats)
            .sort(([,a], [,b]) => (b.functions + b.methods + b.exports) - (a.functions + a.methods + a.exports))
            .slice(0, 10);
    }

    async addUsageCommentToAll() {
        console.log('📝 Dodawanie komentarzy użycia...');
        
        for (const [key, item] of Object.entries(this.usageMap)) {
            await this.addUsageComment(item.file, item.name);
        }
        
        console.log('✅ Komentarze użycia dodane');
    }
}

module.exports = new CodeDocumenter(); 