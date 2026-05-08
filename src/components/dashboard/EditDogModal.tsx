import { useState, useRef, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Chip, OutlinedInput, Avatar, Typography, CircularProgress,
} from '@mui/material';
import { Camera } from 'lucide-react';
import type { Dog } from '../../hooks/useDogs';
import { useDogPhoto } from '../../hooks/useDogPhoto';

const ALLERGY_OPTIONS = ['pollo', 'res', 'cerdo', 'granos', 'lácteos', 'huevo', 'pescado'];
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface EditDogModalProps {
  open: boolean;
  dog: Dog | null;
  onClose: () => void;
  onUpdate: (dogId: string, dogData: Partial<Dog>) => Promise<boolean>;
  onPhotoUpdated: (dogId: string, updatedDog: Dog) => void;
}

const EditDogModal = ({ open, dog, onClose, onUpdate, onPhotoUpdated }: EditDogModalProps) => {
  const [formData, setFormData] = useState<Partial<Dog>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  // El preview muestra la foto actual del perro o la nueva foto seleccionada
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploading, uploadPhoto } = useDogPhoto(onPhotoUpdated);

  // Pre-poblar el formulario cuando se abre con un perro diferente
  useEffect(() => {
    if (dog) {
      setFormData({
        name: dog.name,
        breed: dog.breed,
        ageYears: dog.ageYears,
        ageMonths: dog.ageMonths ?? 0,
        weightKg: dog.weightKg,
        activityLevel: dog.activityLevel ?? 'moderado',
        allergies: dog.allergies ?? [],
      });
      // Mostrar la foto actual del perro como preview inicial
      setPhotoPreview(dog.photo ?? null);
      setPhotoFile(null);
      setPhotoError(null);
    }
  }, [dog]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoError('Solo se aceptan imágenes JPEG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setPhotoError('La imagen no debe superar 5MB.');
      return;
    }

    setPhotoError(null);
    setPhotoFile(file);
    // URL.createObjectURL da un preview instantáneo sin subir al servidor aún
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const handleSubmit = async () => {
    if (!dog) return;
    setIsSubmitting(true);

    try {
      // Actualizar datos del perro y foto en paralelo si hay nueva foto
      const [updateSuccess] = await Promise.all([
        onUpdate(dog._id, formData),
        photoFile ? uploadPhoto(dog._id, photoFile) : Promise.resolve(null),
      ]);

      if (updateSuccess) {
        // Limpiar URL temporal antes de cerrar para liberar memoria del navegador
        if (photoFile && photoPreview) URL.revokeObjectURL(photoPreview);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (photoFile && photoPreview && photoPreview !== dog?.photo) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoError(null);
    onClose();
  };

  if (!dog) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Perro — {dog.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nombre"
            value={formData.name ?? ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Raza"
            value={formData.breed ?? ''}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Edad (Años)"
              type="number"
              value={formData.ageYears ?? 0}
              onChange={(e) => setFormData({ ...formData, ageYears: Number(e.target.value) })}
              fullWidth
              inputProps={{ min: 0, max: 25 }}
            />
            <TextField
              label="Peso (Kg)"
              type="number"
              value={formData.weightKg ?? 0}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
              fullWidth
              inputProps={{ min: 0.1, max: 120, step: 0.1 }}
            />
          </Box>
          <FormControl fullWidth>
            <InputLabel>Nivel de Actividad</InputLabel>
            <Select
              value={formData.activityLevel ?? 'moderado'}
              label="Nivel de Actividad"
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
            >
              <MenuItem value="bajo">Bajo</MenuItem>
              <MenuItem value="moderado">Moderado</MenuItem>
              <MenuItem value="alto">Alto</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Alergias (Opcional)</InputLabel>
            <Select
              multiple
              value={formData.allergies ?? []}
              onChange={(e) => {
                const { target: { value } } = e;
                setFormData({ ...formData, allergies: typeof value === 'string' ? value.split(',') : value });
              }}
              input={<OutlinedInput label="Alergias (Opcional)" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" color="error" />
                  ))}
                </Box>
              )}
            >
              {ALLERGY_OPTIONS.map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Sección de foto con preview de la foto actual */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Foto del perro
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={photoPreview ?? undefined}
                sx={{ width: 72, height: 72, bgcolor: 'secondary.light', fontSize: '1.5rem' }}
              >
                🐶
              </Avatar>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={uploading ? <CircularProgress size={16} /> : <Camera size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Subiendo...' : (dog.photo ? 'Cambiar foto' : 'Subir foto')}
                </Button>
                {photoFile && (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Nueva: {photoFile.name}
                  </Typography>
                )}
                {photoError && (
                  <Typography variant="caption" display="block" color="error" sx={{ mt: 0.5 }}>
                    {photoError}
                  </Typography>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handlePhotoSelect}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || uploading}
          startIcon={(isSubmitting || uploading) ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDogModal;
