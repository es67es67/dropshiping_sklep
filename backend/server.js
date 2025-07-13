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
const locationRoutes = require('./routes/locationRoutes');

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

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/locations', locationRoutes);

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Coś poszło nie tak!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
