const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import routes
const errorRoutes = require('./routes/errorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Import services
const ErrorService = require('./services/ErrorService');
const AlertService = require('./services/AlertService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://portal-frontend.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://portal-frontend.onrender.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 1000, // max 1000 requests per window
  message: {
    error: 'Zbyt wiele żądań. Spróbuj ponownie później.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Custom request logger
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/errors', errorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 Nowe połączenie Socket.IO:', socket.id);
  
  socket.on('join_dashboard', (data) => {
    socket.join('dashboard');
    console.log(`📊 Użytkownik dołączył do dashboardu: ${data.userId || 'anonymous'}`);
  });
  
  socket.on('error_reported', (data) => {
    console.log('🚨 Nowy błąd zgłoszony:', data.errorId);
    io.to('dashboard').emit('new_error', data);
  });
  
  socket.on('error_resolved', (data) => {
    console.log('✅ Błąd rozwiązany:', data.errorId);
    io.to('dashboard').emit('error_resolved', data);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Połączenie rozłączone:', socket.id);
  });
});

// Error handling middleware (musi być na końcu)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  ErrorService.logSystemError(error, 'uncaught_exception');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  ErrorService.logSystemError(reason, 'unhandled_rejection');
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/error-monitoring';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Połączono z MongoDB');
  } catch (error) {
    console.error('❌ Błąd połączenia z MongoDB:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5001;
const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(PORT, () => {
      console.log(`🚀 Serwer Error Monitoring działa na porcie ${PORT}`);
      console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    });
    
    // Initialize services
    await ErrorService.initialize();
    await AlertService.initialize();
    
  } catch (error) {
    console.error('❌ Błąd uruchamiania serwera:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io }; 