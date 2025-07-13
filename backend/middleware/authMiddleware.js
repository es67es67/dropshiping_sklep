const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minut
const RATE_LIMIT_MAX_REQUESTS = 2000; // max requests per window (bardzo łagodnie na czas testów)
const RATE_LIMIT_ENABLED = false; // Wyłączone na czas testów

// Store for rate limiting data
const rateLimitStore = new Map();

// Rate limiting middleware
const rateLimiter = (req, res, next) => {
  // Wyłącz rate limiting na czas testów
  if (!RATE_LIMIT_ENABLED) {
    return next();
  }
  
  const clientId = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // Get or create client data
  let clientData = rateLimitStore.get(clientId);
  if (!clientData) {
    clientData = {
      requests: 0,
      resetTime: now + RATE_LIMIT_WINDOW
    };
    rateLimitStore.set(clientId, clientData);
  }
  
  // Check if window has reset
  if (now > clientData.resetTime) {
    clientData.requests = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // Increment request count
  clientData.requests++;
  rateLimitStore.set(clientId, clientData);
  
  // Log rate limit status
  if (clientData.requests % 100 === 0) {
    console.log(`📊 Rate limit dla ${clientId}: ${clientData.requests}/${RATE_LIMIT_MAX_REQUESTS}`);
  }
  
  // Check if limit exceeded
  if (clientData.requests > RATE_LIMIT_MAX_REQUESTS) {
    console.warn(`⚠️ Rate limit exceeded for IP: ${clientId} (${clientData.requests} requests)`);
    return res.status(429).json({ 
      error: 'Zbyt wiele żądań. Spróbuj ponownie później.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
      currentRequests: clientData.requests,
      maxRequests: RATE_LIMIT_MAX_REQUESTS
    });
  }
  
  // Add rate limit headers
  res.set({
    'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS,
    'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT_MAX_REQUESTS - clientData.requests),
    'X-RateLimit-Reset': clientData.resetTime
  });
  
  next();
};

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [clientId, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(clientId);
    }
  }
}, RATE_LIMIT_WINDOW);

// Basic authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Poprawne pobranie tokenu
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
    }
    
    // Format nagłówka: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Brak tokenu' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TAJNY_KLUCZ');
    
    // Get user data
    const user = await User.findById(decoded.userId).select('_id username roles isActive lastLogin');
    if (!user) {
      return res.status(401).json({ error: 'Użytkownik nie istnieje' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ error: 'Konto jest nieaktywne' });
    }
    
    // Add user data to request
    req.userId = decoded.userId;
    req.user = user;
    
    // Update last activity
    user.lastLogin = new Date();
    await user.save();
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token wygasł' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Nieprawidłowy token' });
    }
    res.status(500).json({ error: 'Błąd autoryzacji' });
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Brak autoryzacji' });
    }
    
    const userRoles = req.user.roles || [];
    const hasRole = Array.isArray(roles) 
      ? roles.some(role => userRoles.includes(role))
      : userRoles.includes(roles);
    
    if (!hasRole) {
      return res.status(403).json({ error: 'Brak uprawnień' });
    }
    
    next();
  };
};

// Admin-only middleware
const requireAdmin = requireRole(['admin']);

// Shop owner middleware
const requireShopOwner = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const Shop = require('../models/shopModel');
    
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Sklep nie został znaleziony' });
    }
    
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Brak uprawnień do tego sklepu' });
    }
    
    req.shop = shop;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Błąd podczas weryfikacji uprawnień' });
  }
};

// Optional authentication (for public endpoints)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TAJNY_KLUCZ');
        const user = await User.findById(decoded.userId).select('_id username roles isActive');
        if (user && user.isActive) {
          req.userId = decoded.userId;
          req.user = user;
        }
      }
    }
    next();
  } catch (err) {
    // Continue without authentication
    next();
  }
};

// Logging middleware
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireShopOwner,
  optionalAuth,
  rateLimiter,
  logRequest
};
