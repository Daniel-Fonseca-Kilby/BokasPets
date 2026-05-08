const Dog = require('../models/Dog');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get user dogs
// @route   GET /api/dogs
// @access  Private
exports.getDogs = async (req, res) => {
  try {
    const dogs = await Dog.find({ user: req.user.id });
    res.status(200).json(dogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a dog
// @route   POST /api/dogs
// @access  Private
exports.addDog = async (req, res) => {
  try {
    const { name, breed, ageYears, ageMonths, weightKg, allergies, activityLevel } = req.body;

    const dog = await Dog.create({
      user: req.user.id,
      name,
      breed,
      ageYears,
      ageMonths,
      weightKg,
      allergies,
      activityLevel,
    });

    res.status(201).json(dog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a dog
// @route   PUT /api/dogs/:id
// @access  Private
exports.updateDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    // Make sure user owns dog
    if (dog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedDog = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedDog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a dog (también elimina la foto de Cloudinary si existe)
// @route   DELETE /api/dogs/:id
// @access  Private
exports.deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    if (dog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Limpiar foto de Cloudinary antes de borrar el documento
    // Si esto falla, igual borramos el perro para no dejar datos huérfanos
    if (dog.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(dog.photoPublicId);
      } catch (cloudinaryError) {
        console.error('Error eliminando foto de Cloudinary:', cloudinaryError.message);
      }
    }

    await dog.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload or replace dog photo
// @route   POST /api/dogs/:id/photo
// @access  Private
exports.uploadDogPhotoController = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }

    if (dog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // req.file es inyectado por multer-storage-cloudinary después de subir a Cloudinary
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo de imagen.' });
    }

    // Si el perro ya tenía foto, eliminar la anterior para no acumular imágenes huérfanas
    if (dog.photoPublicId) {
      try {
        await cloudinary.uploader.destroy(dog.photoPublicId);
      } catch (cloudinaryError) {
        console.error('Error eliminando foto anterior:', cloudinaryError.message);
      }
    }

    // multer-storage-cloudinary expone path (URL) y filename (publicId)
    dog.photo = req.file.path;
    dog.photoPublicId = req.file.filename;
    const updatedDog = await dog.save();

    res.status(200).json(updatedDog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
