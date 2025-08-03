const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Połączenie z bazą danych
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = require('./models/userModel');

async function checkLoginStatus() {
  try {
    const username = 'aaaaaaaaaaaaa';
    
    console.log('🔍 Sprawdzanie stanu logowania użytkownika:', username);
    
    // Znajdź użytkownika
    const user = await User.findOne({ username });
    if (!user) {
      console.log('❌ Użytkownik nie został znaleziony');
      return;
    }
    
    console.log('✅ Użytkownik znaleziony:');
    console.log('- ID:', user._id);
    console.log('- Username:', user.username);
    console.log('- Email:', user.email);
    console.log('- IsActive:', user.isActive);
    console.log('- LastLogin:', user.lastLogin);
    
    // Wygeneruj token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('\n🔑 Token wygenerowany:');
    console.log('- Token (pierwsze 50 znaków):', token.substring(0, 50) + '...');
    
    // Sprawdź czy token jest poprawny
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('\n✅ Token jest poprawny:');
      console.log('- Decoded userId:', decoded.userId);
      console.log('- Decoded username:', decoded.username);
      console.log('- Expires at:', new Date(decoded.exp * 1000));
    } catch (error) {
      console.log('❌ Token jest niepoprawny:', error.message);
    }
    
    console.log('\n📋 Instrukcje dla frontendu:');
    console.log('1. Otwórz konsolę przeglądarki (F12)');
    console.log('2. Wklej te komendy:');
    console.log(`localStorage.setItem('token', '${token}');`);
    console.log(`localStorage.setItem('isLoggedIn', 'true');`);
    console.log(`localStorage.setItem('user', '${JSON.stringify({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive
    })}');`);
    console.log('3. Odśwież stronę');
    console.log('4. Sprawdź czy użytkownik jest zalogowany');
    console.log('5. Spróbuj edytować produkt ponownie');
    
    console.log('\n🔍 Sprawdź w konsoli przeglądarki:');
    console.log('- localStorage.getItem("token")');
    console.log('- localStorage.getItem("isLoggedIn")');
    console.log('- localStorage.getItem("user")');
    
  } catch (error) {
    console.error('❌ Błąd podczas sprawdzania stanu logowania:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkLoginStatus(); 