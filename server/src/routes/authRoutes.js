const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, updateProfile, changePassword, refresh, uploadUserPhotoController } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { registerSchema } = require('../validators/schemas');
const { authLimiter } = require('../middleware/rateLimiter');
const { uploadUserPhoto } = require('../config/cloudinary');

// authLimiter aplicado solo a login y register para prevenir fuerza bruta
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
// Ruta pública para renovar el access token usando el refresh token
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
// uploadUserPhoto es el middleware multer que sube a Cloudinary antes del controlador
router.post('/photo', protect, uploadUserPhoto, uploadUserPhotoController);

module.exports = router;
