const fs = require('fs');
const path = require('path');

class ModuleLoader {
  constructor() {
    this.modules = new Map();
    this.eventEmitter = null;
  }

  setEventEmitter(emitter) {
    this.eventEmitter = emitter;
  }

  async loadModule(moduleName, modulePath) {
    try {
      console.log(`🔄 Ładowanie modułu: ${moduleName}`);
      
      const module = require(modulePath);
      
      if (typeof module.initialize === 'function') {
        await module.initialize();
      }
      
      this.modules.set(moduleName, {
        instance: module,
        path: modulePath,
        loaded: true,
        timestamp: new Date()
      });
      
      console.log(`✅ Moduł ${moduleName} załadowany pomyślnie`);
      
      // Emit event that module was loaded
      if (this.eventEmitter) {
        this.eventEmitter.emit('module:loaded', { moduleName, module });
      }
      
      return module;
    } catch (error) {
      console.error(`❌ Błąd ładowania modułu ${moduleName}:`, error.message);
      throw error;
    }
  }

  async loadAllModules(modulesDir = './modules') {
    const modulesPath = path.join(__dirname, '..', modulesDir);
    
    if (!fs.existsSync(modulesPath)) {
      console.log(`📁 Tworzenie katalogu modułów: ${modulesPath}`);
      fs.mkdirSync(modulesPath, { recursive: true });
      return;
    }
    
    const moduleDirs = fs.readdirSync(modulesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    console.log(`🔍 Znaleziono moduły: ${moduleDirs.join(', ')}`);
    
    for (const moduleName of moduleDirs) {
      const modulePath = path.join(modulesPath, moduleName, 'index.js');
      
      if (fs.existsSync(modulePath)) {
        try {
          await this.loadModule(moduleName, modulePath);
        } catch (error) {
          console.error(`❌ Nie udało się załadować modułu ${moduleName}`);
        }
      }
    }
  }

  getModule(moduleName) {
    const module = this.modules.get(moduleName);
    return module ? module.instance : null;
  }

  getAllModules() {
    return Array.from(this.modules.keys());
  }

  isModuleLoaded(moduleName) {
    return this.modules.has(moduleName) && this.modules.get(moduleName).loaded;
  }

  async unloadModule(moduleName) {
    const module = this.modules.get(moduleName);
    if (module && typeof module.instance.cleanup === 'function') {
      await module.instance.cleanup();
    }
    this.modules.delete(moduleName);
    console.log(`🗑️ Moduł ${moduleName} wyładowany`);
  }
}

module.exports = new ModuleLoader(); 