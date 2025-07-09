const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Poprawne pobranie tokenu
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Brak tokenu autoryzacyjnego' });
  }
  
  // Format nagłówka: "Bearer <token>"
  const token = authHeader.split(' ')[1]; // <-- Pobierz drugi element tablicy
  if (!token) {
    return res.status(401).json({ error: 'Brak tokenu' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TAJNY_KLUCZ');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Nieprawidłowy token' });
  }
};
