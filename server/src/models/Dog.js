const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please add a dog name']
  },
  breed: {
    type: String,
  },
  ageYears: {
    type: Number,
    required: true,
    default: 0
  },
  ageMonths: {
    type: Number,
    required: true,
    default: 0
  },
  weightKg: {
    type: Number,
    required: true
  },
  allergies: [{
    type: String,
    enum: ['pollo', 'res', 'cerdo', 'granos', 'lácteos', 'huevo', 'pescado'],
  }],
  activityLevel: {
    type: String,
    enum: ['bajo', 'moderado', 'alto'],
    default: 'moderado'
  },
  // URL pública de Cloudinary — se muestra en el frontend
  photo: {
    type: String,
    default: null
  },
  // ID de Cloudinary — necesario para poder eliminar la imagen cuando se borra el perro
  photoPublicId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Dog', dogSchema);
