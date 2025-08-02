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

// Import routes
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const locationRoutes = require('./routes/locationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const abTestingRoutes = require('./routes/abTestingRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const geocodingRoutes = require('./routes/geocodingRoutes');
const exportRoutes = require('./routes/exportRoutes');
const errorRoutes = require('./routes/errorRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const marketplaceProductRoutes = require('./routes/marketplaceProductRoutes');

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

// Dynamic CORS configuration
app.use(cors({
  origin: function (origin, callback) {
      const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:8080',
    'https://portal-frontend.onrender.com',
    'https://portal-frontend-igf9.onrender.com',
    'https://portal-frontend-ysqz.onrender.com'
  ];
    
    // Allow requests without origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚨 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
}));

// Dodatkowe nagłówki CORS dla wszystkich żądań
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:8080',
    'https://portal-frontend.onrender.com',
    'https://portal-frontend-igf9.onrender.com',
    'https://portal-frontend-ysqz.onrender.com'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Middleware do logowania żądań
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'} - IP: ${req.ip}`);
  
  // Dodaj nagłówki CORS dla wszystkich żądań
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Obsłuż preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`✅ Preflight request handled for ${req.path}`);
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

// Register routes PRZED uruchomieniem serwera
function safeUse(path, router, name) {
  if (!router || typeof router !== 'function' || !router.use) {
    console.error(`\n❌ Błąd rejestracji tras: ${name} nie jest poprawnym routerem Express! Sprawdź eksport w pliku.`);
    return;
  }
  app.use(path, router);
}

safeUse('/api/users', userRoutes, 'userRoutes');
safeUse('/api/shops', shopRoutes, 'shopRoutes');
safeUse('/api/products', productRoutes, 'productRoutes');
safeUse('/api/marketplace', marketplaceProductRoutes, 'marketplaceProductRoutes');
safeUse('/api/categories', categoryRoutes, 'categoryRoutes');
safeUse('/api/cart', cartRoutes, 'cartRoutes');
safeUse('/api/orders', orderRoutes, 'orderRoutes');
safeUse('/api/locations', locationRoutes, 'locationRoutes');
safeUse('/api/recommendations', recommendationRoutes, 'recommendationRoutes');
safeUse('/api/loyalty', loyaltyRoutes, 'loyaltyRoutes');
safeUse('/api/ab-testing', abTestingRoutes, 'abTestingRoutes');
safeUse('/api/friendships', friendshipRoutes, 'friendshipRoutes');
safeUse('/api/posts', require('./routes/postRoutes'), 'postRoutes');
safeUse('/api/messages', messageRoutes, 'messageRoutes');
safeUse('/api/notifications', notificationRoutes, 'notificationRoutes');
safeUse('/api/company-profiles', require('./routes/companyProfileRoutes'), 'companyProfileRoutes');
safeUse('/api/admin', adminRoutes, 'adminRoutes');
safeUse('/api/geocoding', geocodingRoutes, 'geocodingRoutes');
safeUse('/api/export', exportRoutes, 'exportRoutes');
safeUse('/api/auctions', auctionRoutes, 'auctionRoutes');
safeUse('/api', errorRoutes, 'errorRoutes');

// Uruchom serwer po zarejestrowaniu routes
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
  
  // Połączenie z MongoDB i inicjalizacja modułów w tle
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://es67jw:xlnepf0D4JXZtGwT@cluster0.hku8kvd.mongodb.net/portal?retryWrites=true&w=majority&appName=Cluster0')
    .then(async () => {
      console.log('✅ Połączono z MongoDB');
      
      // Inicjalizacja systemu modułowego
      console.log('🔄 Inicjalizacja systemu modułowego...');
      
      try {
        // Ustaw event system dla module loader
        moduleLoader.setEventEmitter(eventSystem);
        
        // Załaduj wszystkie moduły
        await moduleLoader.loadAllModules();
        
        // Rejestruj modułowe routes po załadowaniu modułów
        const messagingModule = moduleLoader.getModule('messaging');
        const gamificationModule = moduleLoader.getModule('gamification');
        const paymentsModule = moduleLoader.getModule('payments');
        
        if (messagingModule) {
          const messagingRoutes = messagingModule.getRoutes();
          if (!messagingRoutes || typeof messagingRoutes !== 'function' || !messagingRoutes.use) {
            console.error('\n❌ Błąd rejestracji tras: messagingModule.getRoutes() nie zwraca poprawnego routera Express!');
          } else {
            app.use('/api/messaging', messagingRoutes);
            console.log('✅ Routes modułu messaging zarejestrowane');
          }
        }
        
        if (gamificationModule) {
          const gamificationRoutes = gamificationModule.getRoutes();
          if (!gamificationRoutes || typeof gamificationRoutes !== 'function' || !gamificationRoutes.use) {
            console.error('\n❌ Błąd rejestracji tras: gamificationModule.getRoutes() nie zwraca poprawnego routera Express!');
          } else {
            app.use('/api/gamification', gamificationRoutes);
            console.log('✅ Routes modułu gamification zarejestrowane');
          }
        }
        
        if (paymentsModule) {
          const paymentsRoutes = paymentsModule.getRoutes();
          if (!paymentsRoutes || typeof paymentsRoutes !== 'function' || !paymentsRoutes.use) {
            console.error('\n❌ Błąd rejestracji tras: paymentsModule.getRoutes() nie zwraca poprawnego routera Express!');
          } else {
            app.use('/api/payments', paymentsRoutes);
            console.log('✅ Routes modułu payments zarejestrowane');
          }
        }
        
        console.log('✅ System modułowy zainicjalizowany');
      } catch (error) {
        console.error('❌ Błąd podczas inicjalizacji modułów:', error);
      }
    })
    .catch(err => {
      console.error('❌ Błąd połączenia z MongoDB:', err);
      console.log('⚠️ Serwer działa bez bazy danych - niektóre funkcje mogą być niedostępne');
    });
});

// Middleware anty-XSS/NoSQL injection dla wyszukiwania produktów
app.use('/api/products', (req, res, next) => {
  const search = req.query.search;
  if (search) {
    // Prosta detekcja XSS/NoSQL injection
    const xssPattern = /<script|onerror=|javascript:|\\$where|\\$regex|\\$ne|\\$gt|\\$lt|\\$in|\\$or|\\$and|\\$nor|\\$not|\\$exists|\\$expr|\\$function|\\$accumulator/i;
    if (xssPattern.test(search)) {
      console.warn(`🚨 Wykryto próbę ataku XSS/NoSQL: ${search}`);
      return res.status(403).json({ error: 'Wykryto próbę ataku XSS lub NoSQL injection w parametrze wyszukiwania.' });
    }
  }
  next();
});

// Dodatkowe nagłówki CORS dla preflight requests
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:3000',
    'https://portal-frontend.onrender.com',
    'https://portal-frontend-igf9.onrender.com',
    'https://portal-frontend-ysqz.onrender.com'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Endpoint dla sugestii wyszukiwania (brakujący endpoint)
app.get('/api/search/suggestions', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json({ suggestions: [] });
  }
  
  // Symulacja sugestii wyszukiwania
  const suggestions = [
    `${q} - produkty`,
    `${q} - sklepy`,
    `${q} - kategorie`,
    `${q} - lokalne`,
    `${q} - promocje`
  ].filter(suggestion => suggestion.toLowerCase().includes(q.toLowerCase()));
  
  res.json({ 
    suggestions: suggestions.slice(0, 5),
    query: q,
    timestamp: new Date().toISOString()
  });
});

// Endpoint dla wyszukiwania produktów z sugestiami
app.get('/api/search/products', (req, res) => {
  const { q, category, price_min, price_max, sort } = req.query;
  
  // Symulacja wyników wyszukiwania
  const results = {
    products: [],
    total: 0,
    page: 1,
    limit: 12,
    query: q,
    filters: { category, price_min, price_max, sort },
    timestamp: new Date().toISOString()
  };
  
  res.json(results);
});

// Health check endpoint (musi być przed 404 handlerem)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint (musi być przed 404 handlerem)
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found', 
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// 404 handler for all other routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Import error handling middleware
const { expressErrorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Error handling middleware
app.use('/api/*', notFoundHandler); // 404 dla API routes
app.use('*', notFoundHandler); // 404 dla wszystkich routes
app.use(expressErrorHandler); // Obsługa błędów Express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Coś poszło nie tak!' });
});

// Serwer już uruchomiony wyżej
