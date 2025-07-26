const mongoose = require('mongoose');
const Product = require('./models/productModel');
const Shop = require('./models/shopModel');
const User = require('./models/userModel');
require('dotenv').config();

async function addDemoProduct() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';
  await mongoose.connect(uri);
  const shopId = '6875d1867f40145e58a47086';
  const shop = await Shop.findById(shopId);
  if (!shop) {
    console.error('Nie znaleziono sklepu!');
    process.exit(1);
  }
  const owner = await User.findById(shop.owner);
  if (!owner) {
    console.error('Nie znaleziono właściciela sklepu!');
    process.exit(1);
  }
  const product = new Product({
    name: 'Demo Produkt',
    description: 'To jest przykładowy produkt dodany automatycznie.',
    price: 99.99,
    category: 'demo',
    brand: 'DemoBrand',
    stock: 10,
    images: [],
    isActive: true,
    shop: shop._id,
    seller: owner._id
  });
  await product.save();
  console.log('✅ Dodano przykładowy produkt:', product);
  await mongoose.disconnect();
}

addDemoProduct().catch(console.error); 