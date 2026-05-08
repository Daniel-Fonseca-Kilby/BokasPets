const express = require('express');
const router = express.Router();
const { getDogs, addDog, updateDog, deleteDog, uploadDogPhotoController } = require('../controllers/dogController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { dogSchema } = require('../validators/schemas');
const { uploadDogPhoto } = require('../config/cloudinary');

router.route('/').get(protect, getDogs).post(protect, validate(dogSchema), addDog);
router.route('/:id').put(protect, updateDog).delete(protect, deleteDog);

/**
 * Ruta de foto separada del CRUD principal:
 * - uploadDogPhoto es el middleware de multer que sube a Cloudinary
 * - uploadDogPhotoController guarda la URL y publicId en MongoDB
 */
router.route('/:id/photo').post(protect, uploadDogPhoto, uploadDogPhotoController);

module.exports = router;

