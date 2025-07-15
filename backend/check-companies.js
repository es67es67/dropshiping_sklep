const mongoose = require('mongoose');
require('dotenv').config();

async function checkCompanies() {
  try {
    console.log('🔌 Łączenie z MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Połączono z MongoDB');

    const CompanyProfile = require('./models/companyProfileModel');
    const count = await CompanyProfile.countDocuments();
    console.log(`📊 Liczba firm w bazie: ${count}`);

    if (count > 0) {
      const companies = await CompanyProfile.find().limit(3).select('_id name');
      console.log('🏢 Przykładowe firmy:');
      companies.forEach(company => {
        console.log(`  - ID: ${company._id}, Nazwa: ${company.name}`);
      });
    } else {
      console.log('⚠️ Brak firm w bazie danych');
    }

  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    console.log('🔌 Zamykanie połączenia...');
    await mongoose.disconnect();
    console.log('✅ Rozłączono z MongoDB');
  }
}

checkCompanies(); 