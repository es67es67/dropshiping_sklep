const mongoose = require('mongoose');

async function checkProduct() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const ProductModel = require('./models/productModel');

    const productId = '6877fdd918c94583a52840d6';
    console.log(`Sprawdzam produkt o ID: ${productId}`);

    const product = await ProductModel.findById(productId);
    
    if (product) {
      console.log('✅ Produkt znaleziony:');
      console.log('ID:', product._id);
      console.log('Nazwa:', product.name);
      console.log('Opis:', product.description);
      console.log('Cena:', product.price);
      console.log('Kategoria:', product.category);
      console.log('Sklep:', product.shop);
      console.log('Status:', product.status);
      console.log('Data utworzenia:', product.createdAt);
      console.log('Data aktualizacji:', product.updatedAt);
      
      // Sprawdź czy wszystkie wymagane pola są obecne
      console.log('\n--- Sprawdzanie pól ---');
      console.log('name:', !!product.name);
      console.log('description:', !!product.description);
      console.log('price:', !!product.price);
      console.log('category:', !!product.category);
      console.log('shop:', !!product.shop);
      console.log('images:', Array.isArray(product.images));
      console.log('specifications:', !!product.specifications);
      
      // Sprawdź pole stats
      console.log('\n--- Sprawdzanie pola stats ---');
      console.log('stats:', !!product.stats);
      console.log('stats.views:', product.stats?.views);
      console.log('stats.sales:', product.stats?.sales);
      console.log('stats.revenue:', product.stats?.revenue);
      console.log('stats.wishlistCount:', product.stats?.wishlistCount);
      
      // Sprawdź pole ratings
      console.log('\n--- Sprawdzanie pola ratings ---');
      console.log('ratings:', !!product.ratings);
      console.log('ratings.average:', product.ratings?.average);
      console.log('ratings.count:', product.ratings?.count);
      console.log('ratings.distribution:', product.ratings?.distribution);
      
    } else {
      console.log('❌ Produkt nie został znaleziony');
    }

    // Sprawdź wszystkie produkty w bazie
    console.log('\n--- Wszystkie produkty w bazie ---');
    const allProducts = await ProductModel.find({}).limit(5);
    console.log(`Znaleziono ${allProducts.length} produktów:`);
    
    allProducts.forEach((prod, index) => {
      console.log(`${index + 1}. ID: ${prod._id}, Nazwa: ${prod.name}, Cena: ${prod.price}`);
      console.log(`   stats: ${!!prod.stats}, ratings: ${!!prod.ratings}`);
    });

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Połączenie zamknięte');
  }
}

checkProduct(); 