import { useRef } from 'react';
import { Card, CardContent, Typography, Box, Chip, Avatar, IconButton, CircularProgress, Tooltip } from '@mui/material';
import { AlertTriangle, Pencil, Camera } from 'lucide-react';
import type { Dog } from '../../hooks/useDogs';
import { useDogPhoto } from '../../hooks/useDogPhoto';

interface DogCardProps {
  dog: Dog;
  onEdit?: (dog: Dog) => void;
  onPhotoUpdated?: (dogId: string, updatedDog: Dog) => void;
}

/**
 * Genera las iniciales del nombre del perro para el Avatar de fallback.
 * Toma las primeras letras de cada palabra (máximo 2).
 */
const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

const DogCard = ({ dog, onEdit, onPhotoUpdated }: DogCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasAllergensInPlan = dog.allergies && dog.allergies.length > 0;

  // onPhotoUpdated actualiza el estado en useDogs sin necesidad de refetch completo
  const { uploading, uploadPhoto } = useDogPhoto((dogId, updatedDog) => {
    onPhotoUpdated?.(dogId, updatedDog);
  });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadPhoto(dog._id, file);
    // Limpiar input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  };

  return (
    <Card elevation={2} sx={{ height: '100%', borderRadius: 3, position: 'relative', overflow: 'visible' }}>
      {hasAllergensInPlan && (
        <Box sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', borderRadius: '50%', p: 0.5, zIndex: 1 }}>
          <AlertTriangle color="white" size={20} />
        </Box>
      )}

      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3 }}>
        {/* Avatar con foto o iniciales — botón de cámara sobre él */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            src={dog.photo ?? undefined}
            alt={dog.name}
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'secondary.main',
              fontSize: '2rem',
              fontWeight: 700,
              border: '3px solid',
              borderColor: 'secondary.light',
            }}
          >
            {getInitials(dog.name)}
          </Avatar>

          {/* Botón de cámara superpuesto sobre el avatar */}
          <Tooltip title="Cambiar foto">
            <IconButton
              size="small"
              onClick={handlePhotoClick}
              disabled={uploading}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                width: 32,
                height: 32,
              }}
            >
              {uploading ? <CircularProgress size={16} color="inherit" /> : <Camera size={16} />}
            </IconButton>
          </Tooltip>

          {/* Input de archivo oculto — se activa con el botón de cámara */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {dog.name}
            </Typography>
            {onEdit && (
              <Tooltip title="Editar perro">
                <IconButton size="small" onClick={() => onEdit(dog)} sx={{ color: 'text.secondary' }}>
                  <Pencil size={18} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Typography color="text.secondary">
            <strong>Raza:</strong> {dog.breed}
          </Typography>
          <Typography color="text.secondary">
            <strong>Edad:</strong> {dog.ageYears} años
          </Typography>
          <Typography color="text.secondary">
            <strong>Peso:</strong> {dog.weightKg} kg
          </Typography>

          {dog.allergies && dog.allergies.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }} color="error.main">
                Alergias:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {dog.allergies.map((allergy) => (
                  <Chip key={allergy} label={allergy} size="small" color="error" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DogCard;
