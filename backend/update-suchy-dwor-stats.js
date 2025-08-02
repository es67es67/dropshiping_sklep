const mongoose = require('mongoose');
require('dotenv').config();

// Połącz z MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

const Miejscowosc = require('./models/miejscowoscModel');
const User = require('./models/userModel');
const Shop = require('./models/shopModel');
const Product = require('./models/productModel');
const Post = require('./models/postModel');
const CompanyProfile = require('./models/companyProfileModel');

async function updateSuchyDworStats() {
  try {
    console.log('🔍 Znajduję miasto Suchy Dwór...');
    
    // Znajdź miasto Suchy Dwór
    const suchyDwor = await Miejscowosc.findOne({ code: '0884766' });
    
    if (!suchyDwor) {
      console.log('❌ Nie znaleziono miasta Suchy Dwór!');
      return;
    }
    
    console.log(`✅ Znaleziono miasto: ${suchyDwor.name} (kod: ${suchyDwor.code})`);
    
    // Policz statystyki
    console.log('📊 Liczę statystyki...');
    
    const [users, shops, products, posts, companies] = await Promise.all([
      User.countDocuments({ 
        'teryt.simcCode': '0884766',
        isActive: true 
      }),
      Shop.countDocuments({ 
        'address.city': 'Suchy Dwór',
        isActive: true 
      }),
      Product.countDocuments({ 
        'address.city': 'Suchy Dwór',
        isActive: true 
      }),
      Post.countDocuments({ 
        'address.city': 'Suchy Dwór',
        isActive: true 
      }),
      CompanyProfile.countDocuments({ 
        'address.city': 'Suchy Dwór',
        isActive: true 
      })
    ]);
    
    console.log(`📊 Znalezione statystyki:
  - Użytkownicy: ${users}
  - Sklepy: ${shops}
  - Produkty: ${products}
  - Posty: ${posts}
  - Firmy: ${companies}`);
    
    // Aktualizuj statystyki miasta
    console.log('📊 Aktualizuję statystyki miasta...');
    suchyDwor.stats = {
      totalUlice: 0,
      totalUsers: users,
      totalShops: shops,
      totalProducts: products,
      totalPosts: posts,
      totalCompanies: companies
    };
    
    await suchyDwor.save();
    console.log('✅ Zaktualizowano statystyki miasta');
    
    console.log('\n🎉 Pomyślnie zaktualizowano statystyki dla miasta Suchy Dwór!');
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateSuchyDworStats(); 