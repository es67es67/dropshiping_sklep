const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

// Core system
const eventSystem = require('./core/eventSystem');
const moduleLoader = require('./core/moduleLoader');

// Legacy routes (do migracji)
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const postRoutes = require('./routes/postRoutes');
const locationRoutes = require('./routes/locationRoutes');
const exportRoutes = require('./routes/exportRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://portal-frontend.onrender.com",
      "https://portal-frontend-igf9.onrender.com",
      "https://portal-frontend-ysqz.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://portal-frontend.onrender.com',
    'https://portal-frontend-igf9.onrender.com',
    'https://portal-frontend-ysqz.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Middleware do logowania żądań
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log('Headers:', req.headers);
  
  // Dodaj nagłówki CORS dla wszystkich żądań
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Obsłuż preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Enhanced middleware
const { rateLimiter, logRequest } = require('./middleware/authMiddleware');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply enhanced middleware
app.use(rateLimiter);
app.use(logRequest);

// Middleware do usuwania restrykcyjnych nagłówków bezpieczeństwa
app.use((req, res, next) => {
  // Przechwyć oryginalną metodę end
  const originalEnd = res.end;
  
  res.end = function(chunk, encoding) {
    // Usuń restrykcyjne nagłówki przed wysłaniem odpowiedzi
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('X-Content-Type-Options');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('X-XSS-Protection');
    
    // Wywołaj oryginalną metodę end
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

// Dodaj favicon route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

// Statyczne pliki (zdjęcia)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO dla funkcji społecznościowych
io.on('connection', (socket) => {
  console.log('Użytkownik połączony:', socket.id);
  
  socket.on('join_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Użytkownik ${userId} dołączył do pokoju`);
  });
  
  socket.on('join_location', (locationId) => {
    socket.join(`location_${locationId}`);
    console.log(`Użytkownik dołączył do lokalizacji ${locationId}`);
  });
  
  socket.on('join_shop', (shopId) => {
    socket.join(`shop_${shopId}`);
    console.log(`Użytkownik dołączył do sklepu ${shopId}`);
  });
  
  socket.on('send_message', (data) => {
    io.to(`user_${data.receiverId}`).emit('receive_message', data);
  });
  
  socket.on('like_post', (data) => {
    io.emit('post_liked', data);
  });
  
  socket.on('new_post', (data) => {
    // Powiadom użytkowników z tej samej lokalizacji
    if (data.locationId) {
      io.to(`location_${data.locationId}`).emit('new_post', data);
    }
  });
  
  socket.on('new_product', (data) => {
    // Powiadom użytkowników z tej samej lokalizacji
    if (data.locationId) {
      io.to(`location_${data.locationId}`).emit('new_product', data);
    }
  });
  
  socket.on('new_shop', (data) => {
    // Powiadom użytkowników z tej samej lokalizacji
    if (data.locationId) {
      io.to(`location_${data.locationId}`).emit('new_shop', data);
    }
  });
  
  socket.on('shop_review', (data) => {
    // Powiadom właściciela sklepu
    io.to(`user_${data.shopOwnerId}`).emit('shop_review', data);
  });
  
  socket.on('shop_follow', (data) => {
    // Powiadom właściciela sklepu
    io.to(`user_${data.shopOwnerId}`).emit('shop_follow', data);
  });
  
  socket.on('live_stream_start', (data) => {
    // Powiadom obserwujących sklep
    io.to(`shop_${data.shopId}`).emit('live_stream_start', data);
  });
  
  socket.on('live_stream_end', (data) => {
    // Powiadom obserwujących sklep
    io.to(`shop_${data.shopId}`).emit('live_stream_end', data);
  });
  
  socket.on('new_story', (data) => {
    // Powiadom obserwujących sklep
    io.to(`shop_${data.shopId}`).emit('new_story', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Użytkownik rozłączony:', socket.id);
  });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('✅ Połączono z MongoDB');
    
    // Inicjalizacja systemu modułowego
    console.log('🔄 Inicjalizacja systemu modułowego...');
    
    // Ustaw event system dla module loader
    moduleLoader.setEventEmitter(eventSystem);
    
    // Załaduj wszystkie moduły
    await moduleLoader.loadAllModules();
    
    // Rejestruj modułowe routes po załadowaniu modułów
    const messagingModule = moduleLoader.getModule('messaging');
    const gamificationModule = moduleLoader.getModule('gamification');
    const paymentsModule = moduleLoader.getModule('payments');
    
    if (messagingModule) {
      app.use('/api/messaging', messagingModule.getRoutes());
      console.log('✅ Routes modułu messaging zarejestrowane');
    }
    
    if (gamificationModule) {
      app.use('/api/gamification', gamificationModule.getRoutes());
      console.log('✅ Routes modułu gamification zarejestrowane');
    }
    
    if (paymentsModule) {
      app.use('/api/payments', paymentsModule.getRoutes());
      console.log('✅ Routes modułu payments zarejestrowane');
    }
    
    console.log('✅ System modułowy zainicjalizowany');
  })
  .catch(err => console.error('❌ Błąd połączenia z MongoDB:', err));

// Legacy routes (do migracji)
app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin', adminRoutes);

// Middleware anty-XSS/NoSQL injection dla wyszukiwania produktów
app.use('/api/products', (req, res, next) => {
  const search = req.query.search;
  if (search) {
    // Prosta detekcja XSS/NoSQL injection
    const xssPattern = /<script|onerror=|javascript:|\$where|\$regex|\$ne|\$gt|\$lt|\$in|\$or|\$and|\$nor|\$not|\$exists|\$expr|\$function|\$accumulator/i;
    if (xssPattern.test(search)) {
      return res.status(403).json({ error: 'Wykryto próbę ataku XSS lub NoSQL injection w parametrze wyszukiwania.' });
    }
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portal działa poprawnie!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Coś poszło nie tak!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
