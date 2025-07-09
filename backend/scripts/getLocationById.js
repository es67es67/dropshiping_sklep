const mongoose = require('mongoose');
const Location = require('../models/locationModel');

const MONGODB_URI = 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0';

// Podaj tutaj _id dokumentu, który chcesz pobrać (może być string lub ObjectId)
const LOCATION_ID = '5'; // <- Zmień na prawidłowe _id z bazy, np. "64e1b2c3f4a5b6c7d8e9f0a1"

async function getLocationById() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Połączono z MongoDB');

    // Pobierz dokument po _id
    const location = await Location.findById(LOCATION_ID);
    if (!location) {
      console.log('❌ Nie znaleziono dokumentu o podanym _id');
      return;
    }

    // Wyświetl wszystkie pola i ich wartości
    console.log('📄 Wszystkie dane dokumentu:');
    Object.entries(location.toObject()).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await mongoose.disconnect();
  }
}

getLocationById(); 