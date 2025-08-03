const mongoose = require('mongoose');
const Cart = require('./models/cartModel');
const User = require('./models/userModel');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('✅ Połączono z MongoDB');
    
    // ID użytkownika aaaaaaaaaaaaa
    const userId = '6889a3f6e1ac1a771c78b9a7';
    
    // Pobierz koszyk użytkownika
    let cart = await Cart.findOne({ user: userId, status: 'active' });

    if (!cart) {
      console.log('❌ Koszyk nie znaleziony');
      return;
    }

    // Ręcznie zrób populate dla każdego produktu
    for (let item of cart.items) {
      if (item.productType === 'MarketplaceProduct') {
        const MarketplaceProduct = require('./models/marketplaceProductModel');
        item.product = await MarketplaceProduct.findById(item.product)
          .select('name price originalPrice images mainImage stock isActive seller saleType _id')
          .populate({
            path: 'seller',
            select: 'username firstName lastName avatar'
          });
      } else if (item.productType === 'Product') {
        const Product = require('./models/productModel');
        item.product = await Product.findById(item.product)
          .select('name price originalPrice images mainImage stock isActive shop')
          .populate({
            path: 'shop',
            select: 'name logo address city'
          });
      }
    }

    if (!cart) {
      console.log('❌ Koszyk nie znaleziony');
      return;
    }

    console.log('📦 Koszyk użytkownika:', cart._id);
    console.log('🔢 Liczba produktów:', cart.items.length);

    // Sprawdź każdy produkt w koszyku
    cart.items.forEach((item, index) => {
      console.log(`\n📦 Produkt ${index + 1}:`);
      console.log('  ID produktu:', item.product?._id);
      console.log('  Nazwa:', item.product?.name);
      console.log('  Typ sprzedaży:', item.product?.saleType);
      console.log('  Główne zdjęcie:', item.product?.mainImage);
      console.log('  Zdjęcia:', item.product?.images);
      console.log('  Cena:', item.price);
      console.log('  Ilość:', item.quantity);
      console.log('  Typ produktu:', item.productType);
      console.log('  Ma sklep:', !!item.product?.shop);
      console.log('  Ma sprzedawcę:', !!item.product?.seller);
    });

    // Sprawdź czy są jakieś produkty marketplace
    const marketplaceProducts = cart.items.filter(item => 
      item.productType === 'MarketplaceProduct' || 
      (item.product && !item.product.shop && item.product.seller)
    );

    console.log(`\n🏪 Produkty marketplace: ${marketplaceProducts.length}`);

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Błąd:', err);
    mongoose.connection.close();
  }); 