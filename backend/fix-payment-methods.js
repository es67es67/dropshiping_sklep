const mongoose = require('mongoose');
require('dotenv').config();

// Połączenie z MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

// Model sklepu
const Shop = require('./models/shopModel');

async function fixPaymentMethods() {
  try {
    console.log('🔍 Wyszukiwanie sklepów z nieprawidłowymi paymentMethods...');
    
    // Znajdź sklepy z nieprawidłowymi paymentMethods (z indeksami numerycznymi)
    const shopsWithInvalidPaymentMethods = await Shop.find({
      'paymentMethods.0': { $exists: true }
    });
    
    console.log(`📊 Znaleziono ${shopsWithInvalidPaymentMethods.length} sklepów z nieprawidłowymi paymentMethods`);
    
    for (const shop of shopsWithInvalidPaymentMethods) {
      console.log(`\n🔧 Naprawiam sklep: ${shop.name} (ID: ${shop._id})`);
      console.log('Przed naprawą:', JSON.stringify(shop.paymentMethods, null, 2));
      
      // Sprawdź czy paymentMethods to tablica z indeksami numerycznymi
      if (Array.isArray(shop.paymentMethods) && shop.paymentMethods.length > 0) {
        let needsFix = false;
        
        // Sprawdź czy którykolwiek z elementów ma indeksy numeryczne
        for (const method of shop.paymentMethods) {
          if (typeof method === 'object' && method['0'] !== undefined) {
            needsFix = true;
            break;
          }
        }
        
        if (needsFix) {
          console.log('❌ Wykryto nieprawidłowe dane paymentMethods - naprawiam...');
          
          // Przekonwertuj indeksy numeryczne na string
          const fixedMethods = shop.paymentMethods.map(method => {
            if (typeof method === 'object' && method['0'] !== undefined) {
              // Zbierz wszystkie znaki z indeksów numerycznych
              const chars = [];
              for (let i = 0; i < 50; i++) { // Sprawdź do 50 indeksów
                if (method[i.toString()] !== undefined) {
                  chars.push(method[i.toString()]);
                } else {
                  break;
                }
              }
              const methodName = chars.join('');
              
              return {
                name: methodName,
                description: `Metoda płatności: ${methodName}`,
                enabled: method.enabled !== undefined ? method.enabled : true
              };
            }
            return method;
          });
          
          // Zaktualizuj sklep
          shop.paymentMethods = fixedMethods;
          await shop.save();
          
          console.log('✅ Naprawiono paymentMethods:', JSON.stringify(fixedMethods, null, 2));
        } else {
          console.log('✅ PaymentMethods wyglądają poprawnie');
        }
      } else {
        console.log('ℹ️ Brak paymentMethods lub pusta tablica');
      }
    }
    
    console.log('\n🎉 Naprawa zakończona!');
    
  } catch (error) {
    console.error('❌ Błąd podczas naprawy:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Połączenie z MongoDB zamknięte');
  }
}

// Uruchom naprawę
fixPaymentMethods(); 