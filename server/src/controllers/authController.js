const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail, sendPasswordChangedEmail } = require('../services/emailService');
const { cloudinary } = require('../config/cloudinary');

/**
 * Genera access token (15min) + refresh token (30d).
 * El refresh token se guarda en DB para poder invalidarlo desde el servidor.
 * Ambos se envían como httpOnly cookies para mayor seguridad.
 */
const sendTokenResponse = async (user, statusCode, res) => {
  // Access token de corta duración — se renueva automáticamente vía refresh
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  // Refresh token de larga duración — permite mantener la sesión sin re-login
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Guardar refresh token en DB para poder invalidar sesiones específicas
  await User.findByIdAndUpdate(user._id, { refreshToken });

  const cookieBase = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res
    .status(statusCode)
    .cookie('access_token', accessToken, { ...cookieBase, maxAge: 15 * 60 * 1000 })
    .cookie('refresh_token', refreshToken, { ...cookieBase, maxAge: 30 * 24 * 60 * 60 * 1000 })
    .json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      loyaltyPoints: user.loyaltyPoints,
      role: user.role,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone, address });

    if (user) {
      await sendTokenResponse(user, 201, res);

      // El email de bienvenida no debe interrumpir el registro si falla
      try {
        await sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Error enviando email de bienvenida:', emailError.message);
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      await sendTokenResponse(user, 200, res);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user — limpia ambas cookies y elimina refresh token de DB
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    // Si hay refresh token en la cookie, lo eliminamos de DB para invalidar la sesión
    const { refresh_token } = req.cookies;
    if (refresh_token) {
      try {
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      } catch {
        // Si el token ya expiró o es inválido, igual limpiamos las cookies
      }
    }

    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(200)
      .json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Renovar access token usando el refresh token
// @route   POST /api/auth/refresh
// @access  Public (solo con cookie válida)
exports.refresh = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    // Verificar que el JWT es válido
    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }

    // Verificar que el token coincide con el guardado en DB (permite revocar sesiones)
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refresh_token) {
      return res.status(401).json({ message: 'Sesión inválida' });
    }

    // Generar nuevo access token
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    res
      .cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({ message: 'Token renovado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      loyaltyPoints: updatedUser.loyaltyPoints,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();

      // Aviso de seguridad por email — no interrumpe el flujo si falla
      try {
        await sendPasswordChangedEmail(user);
      } catch (emailError) {
        console.error('Error enviando email de cambio de contraseña:', emailError.message);
      }

      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Incorrect current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload or replace user profile photo
// @route   POST /api/auth/photo
// @access  Private
exports.uploadUserPhotoController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo de imagen.' });
    }

    // Eliminar foto anterior de Cloudinary para evitar imágenes huérfanas
    if (user.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(user.photoPublicId);
      } catch (cloudinaryError) {
        console.error('Error eliminando foto anterior del usuario:', cloudinaryError.message);
      }
    }

    user.photo = req.file.path;
    user.photoPublicId = req.file.filename;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      loyaltyPoints: updatedUser.loyaltyPoints,
      role: updatedUser.role,
      photo: updatedUser.photo,
      photoPublicId: updatedUser.photoPublicId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
