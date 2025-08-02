const mongoose = require('mongoose');

async function checkUserCart() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const UserModel = require('./models/userModel');
    const CartModel = require('./models/cartModel');
    const ProductModel = require('./models/productModel'); // Dodaję model Product

    // Znajdź użytkownika testuser
    const user = await UserModel.findOne({ username: 'testuser' });
    
    if (!user) {
      console.log('❌ Użytkownik testuser nie istnieje');
      return;
    }

    console.log('✅ Znaleziono użytkownika:', user.username);
    console.log('   ID:', user._id);
    console.log('   Email:', user.email);

    // Sprawdź koszyk użytkownika
    const cart = await CartModel.findOne({ user: user._id, status: 'active' })
      .populate('items.product', 'name price shop');

    if (!cart) {
      console.log('🛒 Użytkownik nie ma aktywnego koszyka');
      
      // Sprawdź czy są jakieś koszyki dla tego użytkownika
      const allUserCarts = await CartModel.find({ user: user._id });
      console.log(`📊 Użytkownik ma ${allUserCarts.length} koszyków w bazie:`);
      allUserCarts.forEach((c, index) => {
        console.log(`   ${index + 1}. Status: ${c.status}, Produktów: ${c.items.length}`);
      });
    } else {
      console.log('🛒 Znaleziono aktywny koszyk:');
      console.log('   ID koszyka:', cart._id);
      console.log('   Status:', cart.status);
      console.log('   Produktów:', cart.items.length);
      
      if (cart.items.length > 0) {
        console.log('   Produkty:');
        cart.items.forEach((item, index) => {
          console.log(`     ${index + 1}. ${item.product?.name || 'Nieznany'} - Ilość: ${item.quantity} - Cena: ${item.price} zł`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Rozłączono z bazą danych');
  }
}

checkUserCart(); 