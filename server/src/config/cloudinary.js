const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Inicializar Cloudinary con las credenciales del entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Filtro MIME compartido — solo acepta jpeg, png y webp.
 * La validación en backend es la fuente de verdad; el frontend solo hace pre-validación.
 */
const imageFileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Solo se aceptan JPEG, PNG o WebP.'), false);
  }
};

/**
 * Storage para fotos de perros.
 * Transformación: 500x500px, crop centrado, formato webp, calidad auto.
 * webp reduce el tamaño ~30% vs jpeg sin pérdida visual perceptible.
 */
const dogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bokaspets/dogs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'webp' }
    ],
  },
});

/**
 * Storage para fotos de perfil de usuarios.
 * Más pequeño (300x300) ya que se muestra principalmente en avatars.
 */
const userStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bokaspets/users',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'webp' }
    ],
  },
});

// Middleware multer listo para usar en las rutas — tamaño máximo 5MB
const uploadDogPhoto = multer({
  storage: dogStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('photo');

const uploadUserPhoto = multer({
  storage: userStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('photo');

module.exports = { cloudinary, uploadDogPhoto, uploadUserPhoto };
