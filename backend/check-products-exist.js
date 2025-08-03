const mongoose = require('mongoose');
const MarketplaceProduct = require('./models/marketplaceProductModel');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('✅ Połączono z MongoDB');
    
    const productIds = [
      '688c5b49951d90a2cd876328',
      '688c5b4a951d90a2cd876330', 
      '688f53fe33300f7c5e12e9e7',
      '688f53fe33300f7c5e12e9f1'
    ];
    
    for (const id of productIds) {
      const product = await MarketplaceProduct.findById(id).select('name mainImage images saleType _id');
      console.log(`\n📦 Produkt ${id}:`);
      if (product) {
        console.log('  ✅ Znaleziony');
        console.log('  Nazwa:', product.name);
        console.log('  Typ sprzedaży:', product.saleType);
        console.log('  Główne zdjęcie:', product.mainImage);
        console.log('  Zdjęcia:', product.images);
      } else {
        console.log('  ❌ Nie znaleziony');
      }
    }

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Błąd:', err);
    mongoose.connection.close();
  }); 