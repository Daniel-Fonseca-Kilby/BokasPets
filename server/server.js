const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const { globalLimiter, adminLimiter } = require('./src/middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// Allowed origins: local dev + production Vercel URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL, // e.g. https://bokaspets.vercel.app
].filter(Boolean);

app.use(cors({ 
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Aplicar globalLimiter a todas las rutas — (Comentado temporalmente para pruebas de despliegue)
// app.use(globalLimiter);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/dogs', require('./src/routes/dogRoutes'));
// app.use('/api/plans', require('./src/routes/planRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
// adminLimiter se aplica antes de las rutas admin (límite más alto para operaciones legítimas)
app.use('/api/admin', adminLimiter, require('./src/routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('BokasPets API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
