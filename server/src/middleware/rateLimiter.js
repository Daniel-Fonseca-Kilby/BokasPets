const rateLimit = require('express-rate-limit');

/**
 * Handler compartido: responde con 429 y mensaje en español.
 * Se define aquí para reutilizarlo en los tres limiters sin duplicar código.
 */
const spanishHandler = (message) => (req, res) => {
  res.status(429).json({ message });
};

/**
 * globalLimiter — Se aplica a TODAS las rutas de la API.
 * Protege contra scrapers y ataques DDoS genéricos.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,  // Envía RateLimit-* headers (RFC 6585)
  legacyHeaders: false,   // No envía X-RateLimit-* (obsoleto)
  handler: spanishHandler('Demasiadas peticiones, intenta más tarde.'),
});

/**
 * authLimiter — Solo para login y register.
 * Límite estricto para prevenir ataques de fuerza bruta en credenciales.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: spanishHandler('Demasiados intentos de acceso, espera 15 minutos.'),
});

/**
 * adminLimiter — Para todas las rutas /api/admin/*.
 * Límite más alto que el global porque los admins hacen más operaciones legítimas.
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: spanishHandler('Demasiadas peticiones al panel de administración, intenta más tarde.'),
});

module.exports = { globalLimiter, authLimiter, adminLimiter };
