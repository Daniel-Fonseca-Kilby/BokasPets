import { useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Chip, OutlinedInput, Avatar, Typography, CircularProgress,
} from '@mui/material';
import { Camera } from 'lucide-react';
import type { Dog } from '../../hooks/useDogs';

const ALLERGY_OPTIONS = ['pollo', 'res', 'cerdo', 'granos', 'lácteos', 'huevo', 'pescado'];
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface AddDogModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (dogData: Omit<Dog, '_id' | 'photo' | 'photoPublicId'>) => Promise<Dog | null>;
  /** Se llama después de crear el perro para subir la foto si el usuario eligió una */
  onUploadPhoto?: (dogId: string, file: File) => Promise<unknown>;
  /** ID del nuevo perro — disponible solo si se pasa desde el padre después de crear */
  newDogId?: string;
}

const initialState = {
  name: '',
  breed: '',
  ageYears: 0,
  ageMonths: 0,
  weightKg: 0,
  activityLevel: 'moderado',
  allergies: [] as string[],
};

const AddDogModal = ({ open, onClose, onAdd, onUploadPhoto }: AddDogModalProps) => {
  const [newDog, setNewDog] = useState(initialState);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación en el cliente para feedback inmediato
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
    // URL.createObjectURL crea una URL temporal para el preview sin necesidad de subir
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const addedDog = await onAdd(newDog);
      if (addedDog) {
        if (photoFile && onUploadPhoto) {
          await onUploadPhoto(addedDog._id, photoFile);
        }
        // Reset del formulario al cerrar
        setNewDog(initialState);
        // Revocar la URL del preview para liberar memoria
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoFile(null);
        setPhotoPreview(null);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewDog(initialState);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Añadir Nuevo Perro</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nombre"
            value={newDog.name}
            onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Raza"
            value={newDog.breed}
            onChange={(e) => setNewDog({ ...newDog, breed: e.target.value })}
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Edad (Años)"
              type="number"
              value={newDog.ageYears}
              onChange={(e) => setNewDog({ ...newDog, ageYears: Number(e.target.value) })}
              fullWidth
              slotProps={{ htmlInput: { min: 0, max: 25 } }}
            />
            <TextField
              label="Peso (Kg)"
              type="number"
              value={newDog.weightKg}
              onChange={(e) => setNewDog({ ...newDog, weightKg: Number(e.target.value) })}
              fullWidth
              slotProps={{ htmlInput: { min: 0.1, max: 120, step: 0.1 } }}
            />
          </Box>
          <FormControl fullWidth>
            <InputLabel>Nivel de Actividad</InputLabel>
            <Select
              value={newDog.activityLevel}
              label="Nivel de Actividad"
              onChange={(e) => setNewDog({ ...newDog, activityLevel: e.target.value })}
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
              value={newDog.allergies}
              onChange={(e) => {
                const { target: { value } } = e;
                setNewDog({ ...newDog, allergies: typeof value === 'string' ? value.split(',') : value });
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

          {/* Sección de foto — opcional al crear, se puede agregar luego desde DogCard */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Foto del perro (opcional)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Preview inmediato de la foto seleccionada */}
              <Avatar
                src={photoPreview ?? undefined}
                sx={{ width: 72, height: 72, bgcolor: 'secondary.light' }}
              >
                🐶
              </Avatar>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Camera size={16} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoFile ? 'Cambiar foto' : 'Subir foto'}
                </Button>
                {photoFile && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {photoFile.name}
                  </Typography>
                )}
                {photoError && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
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
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Perro'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDogModal;
