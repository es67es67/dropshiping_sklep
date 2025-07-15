const express = require('express');
const router = express.Router();
const geocodingController = require('../controllers/geocodingController');

// Geocoding - konwersja adresu na współrzędne
router.post('/geocode', geocodingController.geocodeAddress);

// Reverse geocoding - konwersja współrzędnych na adres
router.post('/reverse-geocode', geocodingController.reverseGeocode);

// Mapowanie współrzędnych na kody TERYT
router.get('/coordinates-to-teryt', geocodingController.coordinatesToTeryt);

// Mapowanie kodów TERYT na współrzędne
router.get('/teryt-to-coordinates', geocodingController.terytToCoordinates);

// Wyszukiwanie obiektów w promieniu
router.get('/nearby', geocodingController.searchNearbyObjects);

// Autouzupełnianie adresów
router.get('/autocomplete', geocodingController.autocompleteAddress);

// Obliczanie odległości między dwoma punktami
router.post('/distance', geocodingController.calculateDistance);

module.exports = router; 