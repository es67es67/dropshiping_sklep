const mongoose = require('mongoose');

async function checkCartDetails() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const CartModel = require('./models/cartModel');
    const UserModel = require('./models/userModel');
    const ProductModel = require('./models/productModel'); // Dodaję model Product

    console.log('🔍 Sprawdzam szczegóły koszyków...');

    const carts = await CartModel.find({ status: 'active' })
      .populate('user', 'username email')
      .populate('items.product', 'name price shop');

    console.log(`\n🛒 Znaleziono ${carts.length} aktywnych koszyków:`);
    
    carts.forEach((cart, index) => {
      console.log(`\n${index + 1}. Koszyk ID: ${cart._id}`);
      console.log(`   Użytkownik: ${cart.user?.username || 'Nieznany'} (${cart.user?.email || 'Brak email'})`);
      console.log(`   Status: ${cart.status}`);
      console.log(`   Produktów: ${cart.items.length}`);
      
      if (cart.items.length > 0) {
        console.log('   Produkty:');
        cart.items.forEach((item, itemIndex) => {
          console.log(`     ${itemIndex + 1}. ${item.product?.name || 'Nieznany produkt'} - Ilość: ${item.quantity} - Cena: ${item.price} zł`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Rozłączono z bazą danych');
  }
}

checkCartDetails(); 