const Category = require('../models/categoryModel');
const UniversalErrorService = require('../services/universalErrorService');

// Pobieranie wszystkich kategorii (drzewo)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.getTree();
    res.json(categories);
  } catch (error) {
    console.error('❌ Błąd podczas pobierania kategorii:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'getCategories'
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas pobierania kategorii' });
  }
};

// Pobieranie pojedynczej kategorii
exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).populate('parent');
    
    if (!category) {
      return res.status(404).json({ error: 'Kategoria nie została znaleziona' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('❌ Błąd podczas pobierania kategorii:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'getCategory',
        categoryId: req.params.id
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas pobierania kategorii' });
  }
};

// Tworzenie nowej kategorii
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent, icon, order, showInMenu, showOnHomepage } = req.body;
    
    // Walidacja
    if (!name) {
      return res.status(400).json({ error: 'Nazwa kategorii jest wymagana' });
    }
    
    // Generowanie sluga
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    // Sprawdzenie czy slug już istnieje
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: 'Kategoria o tej nazwie już istnieje' });
    }
    
    // Przygotowanie danych kategorii
    const categoryData = {
      name,
      slug,
      description,
      icon,
      order: order || 0,
      showInMenu: showInMenu !== undefined ? showInMenu : true,
      showOnHomepage: showOnHomepage !== undefined ? showOnHomepage : false,
      createdBy: req.user.id
    };
    
    // Jeśli jest kategoria nadrzędna
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Kategoria nadrzędna nie istnieje' });
      }
      
      categoryData.parent = parent;
      categoryData.level = parentCategory.level + 1;
      categoryData.path = [...parentCategory.path, parentCategory._id];
    }
    
    const category = new Category(categoryData);
    await category.save();
    
    // Aktualizuj licznik produktów
    await category.updateProductCount();
    
    res.status(201).json(category);
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia kategorii:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'createCategory',
        requestData: req.body
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas tworzenia kategorii' });
  }
};

// Aktualizacja kategorii
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent, icon, order, showInMenu, showOnHomepage } = req.body;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Kategoria nie została znaleziona' });
    }
    
    // Walidacja
    if (!name) {
      return res.status(400).json({ error: 'Nazwa kategorii jest wymagana' });
    }
    
    // Generowanie nowego sluga jeśli nazwa się zmieniła
    let slug = category.slug;
    if (name !== category.name) {
      slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      // Sprawdzenie czy nowy slug już istnieje
      const existingCategory = await Category.findOne({ slug, _id: { $ne: id } });
      if (existingCategory) {
        return res.status(400).json({ error: 'Kategoria o tej nazwie już istnieje' });
      }
    }
    
    // Przygotowanie danych do aktualizacji
    const updateData = {
      name,
      slug,
      description,
      icon,
      order: order !== undefined ? order : category.order,
      showInMenu: showInMenu !== undefined ? showInMenu : category.showInMenu,
      showOnHomepage: showOnHomepage !== undefined ? showOnHomepage : category.showOnHomepage
    };
    
    // Jeśli zmienia się kategoria nadrzędna
    if (parent !== category.parent) {
      if (parent) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
          return res.status(400).json({ error: 'Kategoria nadrzędna nie istnieje' });
        }
        
        // Sprawdź czy nie próbuje ustawić siebie jako rodzica
        if (parent === id) {
          return res.status(400).json({ error: 'Kategoria nie może być swoim własnym rodzicem' });
        }
        
        updateData.parent = parent;
        updateData.level = parentCategory.level + 1;
        updateData.path = [...parentCategory.path, parentCategory._id];
      } else {
        updateData.parent = null;
        updateData.level = 0;
        updateData.path = [];
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    // Aktualizuj licznik produktów
    await updatedCategory.updateProductCount();
    
    res.json(updatedCategory);
  } catch (error) {
    console.error('❌ Błąd podczas aktualizacji kategorii:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'updateCategory',
        categoryId: req.params.id,
        requestData: req.body
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas aktualizacji kategorii' });
  }
};

// Usuwanie kategorii
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Kategoria nie została znaleziona' });
    }
    
    // Sprawdź czy kategoria ma podkategorie
    const children = await Category.find({ parent: id });
    if (children.length > 0) {
      return res.status(400).json({ 
        error: 'Nie można usunąć kategorii, która ma podkategorie. Najpierw usuń lub przenieś podkategorie.' 
      });
    }
    
    // Sprawdź czy kategoria ma produkty
    const Product = require('../models/productModel');
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({ 
        error: `Nie można usunąć kategorii, która ma ${productsCount} produktów. Najpierw przenieś produkty do innej kategorii.` 
      });
    }
    
    await Category.findByIdAndDelete(id);
    
    res.json({ message: 'Kategoria została usunięta' });
  } catch (error) {
    console.error('❌ Błąd podczas usuwania kategorii:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'deleteCategory',
        categoryId: req.params.id
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas usuwania kategorii' });
  }
};

// Pobieranie breadcrumbs dla kategorii
exports.getCategoryBreadcrumbs = async (req, res) => {
  try {
    const { id } = req.params;
    const breadcrumbs = await Category.getBreadcrumbs(id);
    res.json(breadcrumbs);
  } catch (error) {
    console.error('❌ Błąd podczas pobierania breadcrumbs:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'getCategoryBreadcrumbs',
        categoryId: req.params.id
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas pobierania breadcrumbs' });
  }
};

// Pobieranie kategorii dla menu
exports.getMenuCategories = async (req, res) => {
  try {
    const categories = await Category.find({ 
      showInMenu: true, 
      isActive: true 
    }).sort('order');
    
    res.json(categories);
  } catch (error) {
    console.error('❌ Błąd podczas pobierania kategorii menu:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'getMenuCategories'
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas pobierania kategorii menu' });
  }
};

// Pobieranie kategorii dla strony głównej
exports.getHomepageCategories = async (req, res) => {
  try {
    const categories = await Category.find({ 
      showOnHomepage: true, 
      isActive: true 
    }).sort('order');
    
    res.json(categories);
  } catch (error) {
    console.error('❌ Błąd podczas pobierania kategorii strony głównej:', error);
    
    await UniversalErrorService.logError(error, {
      componentName: 'categoryController',
      filename: 'categoryController.js',
      type: 'database_error',
      additionalData: {
        action: 'getHomepageCategories'
      }
    });
    
    res.status(500).json({ error: 'Błąd podczas pobierania kategorii strony głównej' });
  }
}; 