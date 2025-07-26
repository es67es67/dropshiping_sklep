// Test prostego backendu bez modułów
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Podstawowe middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend działa!' });
});

// Test userController
try {
  const userController = require('./backend/controllers/userController');
  console.log('✅ userController zaimportowany');
  
  // Test route z userController
  app.get('/api/users/status', userController.status || ((req, res) => {
    res.json({ status: 'OK', message: 'Users API działa poprawnie' });
  }));
  
  console.log('✅ Route /api/users/status dodany');
} catch (error) {
  console.error('❌ Błąd z userController:', error.message);
}

// Test połączenia z MongoDB
const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Połączono z MongoDB');
    
    // Uruchom serwer
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serwer testowy działa na porcie ${PORT}`);
      console.log(`📡 Test URL: http://localhost:${PORT}/api/test`);
      console.log(`👥 Users URL: http://localhost:${PORT}/api/users/status`);
    });
  })
  .catch(err => {
    console.error('❌ Błąd połączenia z MongoDB:', err.message);
  }); 