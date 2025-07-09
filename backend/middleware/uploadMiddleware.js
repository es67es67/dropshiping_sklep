const multer = require('multer');
const path = require('path');

// Konfiguracja storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrowanie plików
const fileFilter = (req, file, cb) => {
  // Sprawdź typ pliku
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Tylko pliki obrazów są dozwolone!'), false);
  }
};

// Konfiguracja uploadu
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware dla pojedynczego zdjęcia
const uploadSingle = upload.single('image');

// Middleware dla wielu zdjęć
const uploadMultiple = upload.array('images', 10); // max 10 zdjęć

// Middleware dla różnych typów plików
const uploadProfile = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 }
]);

const uploadShop = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

const uploadProduct = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadProfile,
  uploadShop,
  uploadProduct
}; 