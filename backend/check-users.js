const mongoose = require('mongoose');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Połączono z bazą danych');

    const UserModel = require('./models/userModel');

    console.log('🔍 Sprawdzam użytkowników w bazie danych...');

    const users = await UserModel.find({}).select('username email firstName lastName isActive createdAt');
    
    if (users.length === 0) {
      console.log('❌ Brak użytkowników w bazie danych');
    } else {
      console.log(`✅ Znaleziono ${users.length} użytkowników:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username} (${user.email}) - Aktywny: ${user.isActive}`);
      });
    }

    // Sprawdź czy są aktywne koszyki
    const CartModel = require('./models/cartModel');
    const carts = await CartModel.find({ status: 'active' }).populate('user', 'username email');
    
    console.log(`\n🛒 Koszyki w bazie danych: ${carts.length}`);
    carts.forEach((cart, index) => {
      console.log(`${index + 1}. Użytkownik: ${cart.user?.username || 'Nieznany'} - Produktów: ${cart.items.length}`);
    });

  } catch (error) {
    console.error('❌ Błąd:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Rozłączono z bazą danych');
  }
}

checkUsers(); 