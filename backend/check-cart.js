const mongoose = require('mongoose');
const Cart = require('./models/cartModel');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Shop = require('./models/shopModel');
require('dotenv').config();

async function checkCart() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    const cartCount = await Cart.countDocuments();
    console.log(`📊 Liczba koszyków w bazie: ${cartCount}`);

    if (cartCount === 0) {
      console.log('⚠️ Brak koszyków w bazie');
    } else {
      console.log('📋 Lista koszyków:');
      const carts = await Cart.find()
        .populate('user', 'username email')
        .populate({
          path: 'items.product',
          select: 'name price shop',
          populate: {
            path: 'shop',
            select: 'name'
          }
        });

      carts.forEach((cart, index) => {
        console.log(`\n${index + 1}. Koszyk użytkownika: ${cart.user?.username || 'Nieznany'} (${cart.user?.email || 'Brak email'})`);
        console.log(`   Status: ${cart.status}`);
        console.log(`   Liczba produktów: ${cart.items.length}`);
        console.log(`   Wartość: ${cart.getSubtotal().toFixed(2)} zł`);
        
        if (cart.items.length > 0) {
          console.log('   Produkty:');
          cart.items.forEach((item, itemIndex) => {
            console.log(`     ${itemIndex + 1}. ${item.product?.name || 'Nieznany produkt'} - ${item.quantity} szt. - ${item.price.toFixed(2)} zł`);
          });
        }
      });
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia z MongoDB...');
    await mongoose.disconnect();
    console.log('🔌 Rozłączono z MongoDB');
  }
}

checkCart().catch(error => {
  console.error('❌ Błąd w głównej funkcji:', error);
  process.exit(1);
}); 